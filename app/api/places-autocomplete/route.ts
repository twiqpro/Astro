import { NextRequest, NextResponse } from 'next/server'

type PlacePrediction = {
  description: string
  name: string
  place_id: string
  lat?: number
  lng?: number
}

async function timezoneOffsetHours(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m&timezone=auto&forecast_days=1`
  const response = await fetch(url)
  if (!response.ok) return null

  const data = await response.json()
  if (typeof data.utc_offset_seconds !== 'number') return null
  return data.utc_offset_seconds / 3600
}

async function searchPhoton(input: string) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=6&lang=en&lat=22.5&lon=79`
  const response = await fetch(url, {
    headers: { 'User-Agent': 'moolank/1.0' },
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Could not load places' }, { status: 502 })
  }

  const data = await response.json()
  const features = Array.isArray(data.features) ? data.features : []

  const predictions: PlacePrediction[] = features.flatMap((feature: {
    geometry?: { coordinates?: [number, number] }
    properties?: {
      osm_id?: number
      osm_type?: string
      name?: string
      street?: string
      city?: string
      state?: string
      country?: string
    }
  }) => {
    const coordinates = feature.geometry?.coordinates
    const properties = feature.properties
    if (!coordinates || !properties) return []

    const [lng, lat] = coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number') return []

    const description = [properties.name, properties.street, properties.city, properties.state, properties.country]
      .filter((part, index, parts) => Boolean(part) && parts.indexOf(part) === index)
      .join(', ')

    if (!description) return []

    return [{
      description,
      name: properties.name || description.split(',')[0],
      place_id: `${properties.osm_type || 'X'}${properties.osm_id || description}`,
      lat,
      lng,
    }]
  })

  return NextResponse.json({ predictions })
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const input = searchParams.get('input')
    const placeId = searchParams.get('placeId')
    const latParam = searchParams.get('lat')
    const lngParam = searchParams.get('lng')
    const googleKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

    if (latParam && lngParam) {
      const lat = Number(latParam)
      const lng = Number(lngParam)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
      }

      const utcOffsetHours = await timezoneOffsetHours(lat, lng)
      return NextResponse.json({ utcOffsetHours })
    }

    if (!googleKey) {
      if (placeId) {
        return NextResponse.json(
          { error: 'Place coordinates are included with each suggestion' },
          { status: 400 }
        )
      }

      if (!input || input.length < 2) {
        return NextResponse.json({ predictions: [] })
      }

      return searchPhoton(input)
    }

    if (placeId) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,geometry&key=${googleKey}`
      
      const response = await fetch(detailsUrl)
      const data = await response.json()

      if (data.status !== 'OK') {
        return NextResponse.json(
          { error: 'Failed to fetch place details' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        name: data.result.name,
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng,
      })
    }

    if (!input || input.length < 2) {
      return NextResponse.json({ predictions: [] })
    }

    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${googleKey}`
    
    const response = await fetch(autocompleteUrl)
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json(
        { error: 'Failed to fetch autocomplete suggestions' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      predictions: data.predictions || [],
    })
  } catch (error: any) {
    console.error('Places API error:', error)
    return NextResponse.json(
      { error: error.message || 'Places API request failed' },
      { status: 500 }
    )
  }
}
