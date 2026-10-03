# Jyotish Verify - Astrological Lead Capture Platform

A mobile-first astrological lead-capture website optimized for Instagram ads. Users can submit their birth details and pay ₹499 to receive a personalized Kundli report validated manually by experienced astrologers.

## Features

- **Mobile-First Design**: Optimized for Instagram mobile ads with thumb-stop hero, large tap targets, and fast 4G loading
- **Birth Details Form**: Collects name, gender, date/time of birth, and precise location with lat/lng
- **Location Autocomplete**: Google Places API integration for accurate birth place selection
- **Cashfree Payment**: Secure ₹499 one-time payment via Cashfree Payment Gateway
- **Database Storage**: All lead data persisted to PostgreSQL with payment status tracking
- **Success Flow**: Clear confirmation after payment with next-steps messaging

## ⚠️ IMPORTANT: Instagram Ads Compliance

**Before launching any Instagram ad campaigns, review and update the accuracy claims in your copy.**

### Risk: Absolute Accuracy Claims

Instagram (Meta) has strict advertising policies for astrology services. **Avoid absolute claims** like:
- ❌ "100% authentic"
- ❌ "100% accurate"  
- ❌ "Guaranteed accuracy"
- ❌ Any promise of absolute certainty

### Recommended Approach

Use softer, trust-building language that emphasizes the human validation process without absolute guarantees:
- ✅ "Validated by experienced astrologers"
- ✅ "Authentic Kundli analysis"
- ✅ "Carefully prepared by expert astrologers"
- ✅ "Traditional Vedic astrology methods"

### Current Hero Copy

The current hero section includes "100% Authentic Kundli Analysis" which may need revision before ad spend. See `app/page.tsx` lines 83-89 for the hero copy.

**Action Required Before Ads Go Live:**
1. Review all marketing copy (hero, form, success page)
2. Soften absolute claims to comply with Meta's policies
3. Test ad creative with Meta's ad review process
4. Consider A/B testing different trust-building phrases

See [Meta Advertising Standards](https://www.facebook.com/business/help/2150157295254833) for full guidelines.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS (mobile-first)
- **Database**: PostgreSQL via Prisma ORM (Vercel Postgres / Neon compatible)
- **Payment**: Cashfree Payment Gateway (sandbox & production modes)
- **Location**: Google Places API (Autocomplete + Place Details)
- **Hosting**: Vercel (serverless)

## Prerequisites

1. **Node.js**: v18 or higher
2. **PostgreSQL Database**: Vercel Postgres, Neon, or local PostgreSQL
3. **Cashfree Account**: [Sign up here](https://www.cashfree.com/)
4. **Google Cloud Account**: For Places API [Get API key](https://console.cloud.google.com/)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in the required values:

```env
# Database - Use local PostgreSQL or a cloud provider
DATABASE_URL="postgresql://user:password@localhost:5432/jyotish_verify?schema=public"

# Cashfree Payment Gateway
CASHFREE_APP_ID="your_cashfree_app_id"
CASHFREE_SECRET_KEY="your_cashfree_secret_key"
CASHFREE_ENV="sandbox"  # Use "production" for live payments

# Google Places API
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY="your_google_places_api_key"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

Run Prisma migrations to create the database schema:

```bash
npx prisma generate
npx prisma db push
```

To view the database in Prisma Studio:

```bash
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## API Setup Guides

### Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Places API
   - Places API (New)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Restrict the API key:
   - **Application restrictions**: HTTP referrers (recommended for production)
   - **API restrictions**: Limit to Places API
6. Copy the API key to `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`

**Note**: For production, add your domain to the HTTP referrer restrictions.

### Cashfree Setup

1. Sign up at [Cashfree](https://www.cashfree.com/)
2. Get test credentials from the **Developer** section:
   - App ID
   - Secret Key
3. For **Sandbox mode**:
   - Use test credentials
   - Set `CASHFREE_ENV="sandbox"`
4. For **Production mode**:
   - Complete KYC verification
   - Get production credentials
   - Set `CASHFREE_ENV="production"`
5. Configure webhook URL in Cashfree dashboard:
   - URL: `https://your-domain.com/api/webhook`
   - This receives payment status updates

**Test Cards** (Sandbox):
- Success: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

## Vercel Deployment

### 1. Connect Repository to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **New Project** → Import your repository
4. Vercel will auto-detect Next.js configuration

### 2. Configure Environment Variables in Vercel

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.example`:

```
DATABASE_URL=your_vercel_postgres_or_neon_url
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=sandbox
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_api_key
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### 3. Set Up Vercel Postgres (Optional)

If using Vercel Postgres:

1. In Vercel project → **Storage** → **Create Database** → **Postgres**
2. Vercel automatically sets `DATABASE_URL` environment variable
3. Run migrations from Vercel CLI or use a GitHub Action:

```bash
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

Alternatively, use **Neon** or any PostgreSQL provider and paste the connection string.

### 4. Update Cashfree Webhook URL

After deployment, update the webhook URL in Cashfree dashboard:

```
https://your-vercel-domain.vercel.app/api/webhook
```

### 5. Deploy

Push to your Git repository, and Vercel will auto-deploy.

## Database Schema

The `kundli_leads` table stores all submitted lead data:

```prisma
model KundliLead {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // User details
  fullName     String
  gender       String
  dateOfBirth  DateTime
  birthTime    String
  birthPlace   String
  latitude     Float
  longitude    Float

  // Contact details
  email String
  phone String

  // Payment details
  paymentStatus   String  @default("pending")
  cashfreeOrderId String?
  cashfreePaymentId String?
  amountPaise     Int     @default(49900)
  currency        String  @default("INR")
}
```

## API Routes

- **POST /api/create-order**: Creates a Cashfree payment order
- **POST /api/verify-payment**: Verifies payment and saves lead to database
- **POST /api/webhook**: Cashfree webhook for payment status updates
- **GET /api/places-autocomplete**: Proxy for Google Places Autocomplete & Details

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── create-order/       # Payment order creation
│   │   ├── verify-payment/     # Payment verification
│   │   ├── webhook/            # Cashfree webhook handler
│   │   └── places-autocomplete/ # Google Places proxy
│   ├── payment-success/        # Success page after payment
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main form page
│   └── globals.css             # Global styles
├── components/
│   └── PlacesAutocomplete.tsx  # Location search component
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   └── cashfree.ts             # Cashfree SDK configuration
├── prisma/
│   └── schema.prisma           # Database schema
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Payment Flow

1. User fills out the form with birth details
2. User clicks "Submit and Pay ₹499"
3. Backend creates a Cashfree order via `/api/create-order`
4. Cashfree checkout modal opens for payment
5. After payment, user is redirected to `/payment-success`
6. Backend verifies payment via `/api/verify-payment`
7. Lead data is saved to database with payment status "paid"
8. Success confirmation is shown to the user

## Security Notes

- **Never commit `.env` to Git** - it's already in `.gitignore`
- Store all secrets in environment variables
- Use environment-specific Cashfree credentials (sandbox vs production)
- Restrict Google Places API key to your domains in production
- Validate all form inputs on both client and server
- Verify payment status server-side before marking as paid

## Production Checklist

Before going live:

- [ ] Switch Cashfree to production mode with production credentials
- [ ] Update `CASHFREE_ENV` to `"production"`
- [ ] Restrict Google Places API key to your domain
- [ ] Set correct `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Update Cashfree webhook URL to production domain
- [ ] Test end-to-end payment flow with real payment methods
- [ ] Set up database backups
- [ ] Monitor error logs and payment failures

## Troubleshooting

### Payment Not Working

- Check Cashfree credentials in environment variables
- Verify `CASHFREE_ENV` is set correctly (sandbox/production)
- Check Cashfree dashboard for order status
- Look at browser console for JavaScript errors

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- For Vercel Postgres, ensure it's created in the same region
- Run `npx prisma generate` after schema changes
- Check database logs in your provider's dashboard

### Places API Not Working

- Verify API key is correct and not restricted incorrectly
- Ensure Places API is enabled in Google Cloud Console
- Check API usage limits and quotas
- Look at network tab for API response errors

## Support

For issues with:
- **Cashfree**: [Cashfree Documentation](https://docs.cashfree.com/)
- **Google Places**: [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Prisma**: [Prisma Documentation](https://www.prisma.io/docs)

## License

This is proprietary software for lead capture. All rights reserved.
