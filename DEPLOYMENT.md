# Deployment Guide - Jyotish Verify

This guide walks you through deploying Jyotish Verify to Vercel with all required services.

## Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Cashfree Account**: Register at [cashfree.com](https://cashfree.com)
3. **Google Cloud Account**: For Places API at [console.cloud.google.com](https://console.cloud.google.com)
4. **Database**: Vercel Postgres, Neon, or any PostgreSQL provider

## Step 1: Set Up Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - **Places API**
   - **Places API (New)**
4. Navigate to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key (you'll need this later)
6. **Restrict the key** (recommended for production):
   - Application restrictions: HTTP referrers
   - Add your domains: `your-domain.vercel.app`, `www.your-domain.com`
   - API restrictions: Limit to Places API only

## Step 2: Set Up Cashfree Payment Gateway

### For Testing (Sandbox Mode)

1. Log in to [Cashfree Dashboard](https://merchant.cashfree.com/)
2. Go to **Developers** section
3. Copy your **App ID** and **Secret Key** for Sandbox
4. Note: Use `CASHFREE_ENV=sandbox` for testing

### For Production

1. Complete KYC verification in Cashfree dashboard
2. Get approved for live payments
3. Go to **Developers** → **Production**
4. Copy your production **App ID** and **Secret Key**
5. Note: Use `CASHFREE_ENV=production` for live payments

### Configure Webhook

After deploying to Vercel, set up webhook:

1. In Cashfree dashboard, go to **Developers** → **Webhooks**
2. Add webhook URL: `https://your-domain.vercel.app/api/webhook`
3. Select events: Payment Success, Payment Failed
4. Save webhook configuration

## Step 3: Set Up Database

### Option A: Vercel Postgres (Easiest)

1. In your Vercel project dashboard
2. Go to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Vercel will automatically set `DATABASE_URL` in your environment variables
5. Database is ready - migrations will run on first deploy

### Option B: Neon (Recommended for Production)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Create a database
4. Copy the connection string
5. Add to Vercel environment variables as `DATABASE_URL`

### Option C: Other PostgreSQL Providers

Any PostgreSQL provider works (Supabase, Railway, Heroku, etc.):

1. Create a PostgreSQL database
2. Get the connection string
3. Format: `postgresql://user:password@host:port/database`
4. Add as `DATABASE_URL` in Vercel

## Step 4: Deploy to Vercel

### Using Vercel Dashboard (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **New Project**
4. Import your repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-configured)
   - **Output Directory**: `.next` (auto-configured)

6. **Add Environment Variables**:

```
DATABASE_URL=your_postgres_connection_string
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=sandbox
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

7. Click **Deploy**
8. Wait for build to complete (1-2 minutes)

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and set environment variables
```

## Step 5: Run Database Migrations

After first deployment:

```bash
# Pull environment variables locally
vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

Alternatively, add a `postbuild` script in `package.json`:

```json
{
  "scripts": {
    "postbuild": "prisma generate && prisma db push"
  }
}
```

## Step 6: Update Webhook & Return URLs

After deployment, update these URLs:

1. **Cashfree Webhook**: Replace placeholder with actual Vercel domain
   - Old: `http://localhost:3000/api/webhook`
   - New: `https://your-project.vercel.app/api/webhook`

2. **Google Places API Restrictions**: Add your Vercel domain
   - `your-project.vercel.app`

3. **Environment Variable**: Update `NEXT_PUBLIC_APP_URL`
   - From: `http://localhost:3000`
   - To: `https://your-project.vercel.app`

## Step 7: Test Payment Flow

### In Sandbox Mode

1. Visit your deployed site: `https://your-project.vercel.app`
2. Fill out the form with test data
3. Use test card for payment:
   - **Card**: `4111 1111 1111 1111`
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **Name**: Any name
4. Complete payment
5. Verify success page shows
6. Check database to confirm lead was saved

### Check Database

```bash
# Open Prisma Studio locally
npx prisma studio

# Or query directly
psql $DATABASE_URL -c "SELECT * FROM kundli_leads;"
```

## Step 8: Go Live (Production)

When ready to accept real payments:

1. **Switch Cashfree to Production**:
   - Update `CASHFREE_ENV=production`
   - Use production App ID and Secret Key
   - Update webhook URL in production dashboard

2. **Verify Google Places API**:
   - Check billing is enabled
   - Monitor quota and usage
   - API key restrictions are active

3. **Domain Setup** (Optional):
   - Add custom domain in Vercel project settings
   - Update `NEXT_PUBLIC_APP_URL` to custom domain
   - Update webhook URLs to custom domain
   - Update Google Places API restrictions

4. **Test with Small Amount**:
   - Test with ₹1 first
   - Verify end-to-end flow
   - Check webhook delivery
   - Confirm database write

5. **Monitor**:
   - Set up Vercel monitoring
   - Check Cashfree dashboard for failed payments
   - Monitor database connection pool
   - Set up error tracking (Sentry, etc.)

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `CASHFREE_APP_ID` | Cashfree application ID | `12345abc...` |
| `CASHFREE_SECRET_KEY` | Cashfree secret key | `secret_xyz...` |
| `CASHFREE_ENV` | Cashfree environment | `sandbox` or `production` |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Google Places API key | `AIza...` |
| `NEXT_PUBLIC_APP_URL` | Your application URL | `https://your-app.vercel.app` |

### Adding Variables in Vercel

**Via Dashboard:**
1. Project → Settings → Environment Variables
2. Add each variable with appropriate value
3. Select environments: Production, Preview, Development
4. Save and redeploy

**Via CLI:**
```bash
vercel env add DATABASE_URL
vercel env add CASHFREE_APP_ID
# ... repeat for each variable
```

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is accessible from Vercel

### Payment Not Working

- Verify Cashfree credentials in environment variables
- Check `CASHFREE_ENV` matches your credentials (sandbox/production)
- Look at browser console for errors
- Check Cashfree dashboard for order status

### Database Connection Issues

- Verify `DATABASE_URL` format
- For Neon/Vercel Postgres, ensure connection pooling is enabled
- Check database allows connections from Vercel IPs
- Run `npx prisma db push` to sync schema

### Places API Errors

- Verify API key is correct
- Check Places API is enabled in Google Cloud Console
- Ensure billing is set up (required even for free tier)
- Check API key restrictions don't block your domain

## Monitoring & Maintenance

1. **Check Payment Status Daily**:
   - Review Cashfree dashboard
   - Check for failed transactions
   - Verify webhook deliveries

2. **Database Backups**:
   - Enable automatic backups in your database provider
   - Export leads regularly for safekeeping

3. **Update Dependencies**:
   ```bash
   npm update
   npm audit fix
   ```

4. **Scale as Needed**:
   - Vercel auto-scales serverless functions
   - Monitor database connection limits
   - Upgrade database plan if needed

## Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **Cashfree Support**: [support.cashfree.com](https://support.cashfree.com)
- **Google Cloud Support**: [cloud.google.com/support](https://cloud.google.com/support)

## Security Checklist

- [ ] All secrets stored in environment variables (never in code)
- [ ] Google Places API key restricted to your domains
- [ ] Cashfree webhook signature verification enabled (future enhancement)
- [ ] Database access restricted to Vercel IPs
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] `.env` file in `.gitignore` (already done)
- [ ] Regular dependency updates scheduled
- [ ] Error logging configured
- [ ] Payment success/failure monitoring active

## Next Steps

After successful deployment:

1. Set up custom domain (optional)
2. Configure email notifications for new leads
3. Set up admin dashboard to view leads
4. Implement webhook signature verification
5. Add analytics (Google Analytics, PostHog, etc.)
6. Set up uptime monitoring
7. Configure automated lead processing workflow

---

**Deployment complete!** Your Jyotish Verify platform is now live and ready to capture leads through Instagram ads.
