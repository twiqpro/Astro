declare module '@cashfreepayments/cashfree-js' {
  export interface CheckoutOptions {
    paymentSessionId: string
    returnUrl?: string
  }

  export interface CashfreeInstance {
    checkout(options: CheckoutOptions): void
  }

  export function load(config: { mode: 'sandbox' | 'production' }): Promise<CashfreeInstance>
}
