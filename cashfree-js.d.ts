declare module '@cashfreepayments/cashfree-js' {
  export interface CheckoutOptions {
    paymentSessionId: string
    returnUrl?: string
    redirectTarget?: '_self' | '_blank' | '_top' | HTMLElement
  }

  export interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<{
      error?: { message?: string }
      redirect?: boolean
    } | void>
  }

  export function load(config: { mode: 'sandbox' | 'production' }): Promise<CashfreeInstance>
}
