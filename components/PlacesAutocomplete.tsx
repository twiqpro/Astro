'use client'

import { useState, useEffect, useRef } from 'react'

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: { name: string; lat: number; lng: number }) => void
}

interface Prediction {
  description: string
  name?: string
  place_id: string
  lat?: number
  lng?: number
}

interface SelectedPlace {
  name: string
  lat: number
  lng: number
  detail: string
}

function formatAxis(value: number, positive: string, negative: string) {
  const hemisphere = value >= 0 ? positive : negative
  const absolute = Math.abs(value)
  const degrees = Math.floor(absolute)
  const minutes = Math.floor((absolute - degrees) * 60)
  return `${degrees}${hemisphere}${String(minutes).padStart(2, '0')}`
}

function formatOffset(hours: number) {
  const sign = hours < 0 ? '-' : '+'
  const rounded = Math.round(Math.abs(hours) * 100) / 100
  return `${sign}${rounded}`
}

function formatPlaceDetail(lat: number, lng: number, offsetHours: number | null) {
  const coordinates = `${formatAxis(lat, 'N', 'S')}, ${formatAxis(lng, 'E', 'W')}`
  if (offsetHours == null) return `( ${coordinates} )`
  return `( ${coordinates} ${formatOffset(offsetHours)} )`
}

export default function PlacesAutocomplete({ onPlaceSelect }: PlacesAutocompleteProps) {
  const [input, setInput] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState('')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const skipSearchRef = useRef(false)

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false
      return
    }

    if (input.length < 2) {
      setPredictions([])
      setShowDropdown(false)
      return
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/places-autocomplete?input=${encodeURIComponent(input)}`)
        const data = await response.json()
        if (!response.ok) {
          setPredictions([])
          setError(data.error || 'Could not load places')
          setShowDropdown(true)
          return
        }
        setPredictions(data.predictions || [])
        setShowDropdown(true)
      } catch (fetchError) {
        console.error('Error fetching predictions:', fetchError)
        setPredictions([])
        setError('Could not load places')
        setShowDropdown(true)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [input])

  const applySelection = (place: SelectedPlace) => {
    const fullSelection = `${place.name} ${place.detail}`
    skipSearchRef.current = true
    setInput(fullSelection)
    setShowDropdown(false)
    setPredictions([])
    onPlaceSelect({
      name: fullSelection,
      lat: place.lat,
      lng: place.lng,
    })
  }

  const handleSelectPlace = async (prediction: Prediction) => {
    setShowDropdown(false)
    setPredictions([])
    setIsLoading(true)
    setError('')

    try {
      let name = prediction.description
      let lat = prediction.lat
      let lng = prediction.lng

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/places-autocomplete?placeId=${prediction.place_id}`)
        const data = await response.json()
        if (!response.ok || typeof data.lat !== 'number' || typeof data.lng !== 'number') {
          setError('Could not read coordinates for that place')
          return
        }
        lat = data.lat
        lng = data.lng
      }

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        setError('Could not read coordinates for that place')
        return
      }

      const timezoneResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/places-autocomplete?lat=${lat}&lng=${lng}`)
      const timezone = await timezoneResponse.json()
      const offsetHours = typeof timezone.utcOffsetHours === 'number' ? timezone.utcOffsetHours : null

      applySelection({
        name,
        lat,
        lng,
        detail: formatPlaceDetail(lat, lng, offsetHours),
      })
    } catch (fetchError) {
      console.error('Error fetching place details:', fetchError)
      setError('Could not read coordinates for that place')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        className="w-full px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
        placeholder="Start typing your birth place..."
      />
      {isLoading && (
        <div className="absolute right-4 top-4">
          <div className="animate-spin h-5 w-5 border-2 border-gold border-t-transparent rounded-full"></div>
        </div>
      )}
      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectPlace(prediction)}
              className="w-full text-left px-4 py-3 hover:bg-gold-soft border-b border-gray-100 last:border-b-0 text-sm text-gray-900 bg-white"
            >
              {prediction.description}
            </button>
          ))}
        </div>
      )}
      {showDropdown && !isLoading && predictions.length === 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-700">
          {error || 'No matching places'}
        </div>
      )}
    </div>
  )
}
