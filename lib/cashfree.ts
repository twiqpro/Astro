import { getCloudflareContext } from "@opennextjs/cloudflare"

const API_VERSION = "2023-08-01"

type CashfreeConfig = {
  appId: string
  secret: string
  mode: "production" | "sandbox"
  baseUrl: string
}

async function cashfreeConfig(): Promise<CashfreeConfig> {
  let appId = process.env.CASHFREE_APP_ID
  let secret = process.env.CASHFREE_SECRET_KEY
  let envName = process.env.CASHFREE_ENV

  try {
    const { env } = await getCloudflareContext({ async: true })
    const bindings = env as {
      CASHFREE_APP_ID?: string
      CASHFREE_SECRET_KEY?: string
      CASHFREE_ENV?: string
    }
    appId = bindings.CASHFREE_APP_ID || appId
    secret = bindings.CASHFREE_SECRET_KEY || secret
    envName = bindings.CASHFREE_ENV || envName
  } catch {
    // Local Next.js has no Cloudflare bindings.
  }

  if (!appId?.trim() || !secret?.trim()) {
    throw new Error("Missing Cashfree credentials in environment variables")
  }

  const mode = envName?.trim().toLowerCase() === "production" ? "production" : "sandbox"
  return {
    appId: appId.trim(),
    secret: secret.trim(),
    mode,
    baseUrl: mode === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg",
  }
}

function headers(config: CashfreeConfig) {
  return {
    "Content-Type": "application/json",
    "x-api-version": API_VERSION,
    "x-client-id": config.appId,
    "x-client-secret": config.secret,
  }
}

export async function createCashfreeOrder(input: {
  orderId: string
  amount: number
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  returnUrl: string
  notifyUrl: string
}) {
  const config = await cashfreeConfig()
  const response = await fetch(`${config.baseUrl}/orders`, {
    method: "POST",
    headers: headers(config),
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: "INR",
      order_note: "Jyotish Verify Kundli report",
      customer_details: {
        customer_id: input.customerId,
        customer_name: input.customerName.slice(0, 100),
        customer_email: input.customerEmail.slice(0, 100),
        customer_phone: input.customerPhone,
      },
      order_meta: {
        return_url: input.returnUrl,
        notify_url: input.notifyUrl,
      },
    }),
  })

  const body = await response.json().catch(() => null) as {
    order_id?: string
    payment_session_id?: string
    message?: string
  } | null

  if (!response.ok || !body?.payment_session_id || !body.order_id) {
    throw new Error(body?.message || "Could not create payment order")
  }

  return {
    orderId: body.order_id,
    paymentSessionId: body.payment_session_id,
    mode: config.mode,
  }
}

export async function fetchCashfreePayments(orderId: string) {
  const config = await cashfreeConfig()
  const response = await fetch(`${config.baseUrl}/orders/${encodeURIComponent(orderId)}/payments`, {
    headers: headers(config),
  })
  const body = await response.json().catch(() => null) as Array<{
    payment_status?: string
    cf_payment_id?: string | number
  }> | { message?: string } | null

  if (!response.ok || !Array.isArray(body)) {
    throw new Error(!Array.isArray(body) && body?.message ? body.message : "Could not verify payment")
  }

  return body
}
