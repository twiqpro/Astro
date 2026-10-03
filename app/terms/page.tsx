import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — moolank",
  description: "Terms for requesting a handwritten kundli from moolank.",
};

export default function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions" updated="4 October 2026">
      <p>
        These terms cover the handwritten kundli service on moolank.life, offered by TWIQ RESEARCH (OPC) PVT LTD (“we”). By sending your birth details and paying, you agree to these terms, the Refunds & Cancellations policy, and the Privacy policy.
      </p>
      <h2>The service</h2>
      <p>
        The only service sold here is a Handwritten Kundli. A qualified, experienced astrologer draws your birth chart by hand and writes the answers by hand. No AI writes the chart or the answers. The finished work is sent to the WhatsApp number you give us.
      </p>
      <h2>Price</h2>
      <p>
        The price is ₹499 INR (Indian Rupees). That is the amount collected at checkout through Cashfree. There is no other product and no subscription.
      </p>
      <h2>What you must provide</h2>
      <p>
        The chart is drawn from your name, gender, date of birth, exact birth time, and birth place. If the time or place is wrong, the chart will be wrong. You confirm that the details you submit are yours, or that you have permission to submit them.
      </p>
      <h2>What this reading is</h2>
      <p>
        A kundli is a traditional astrological reading of the details you provide. It is not a promise about health, money, marriage, legal matters, or any future event. You decide what to do with the reading.
      </p>
      <h2>Payment</h2>
      <p>
        Payment is taken in INR by Cashfree. Your birth details are saved when you submit the form. If payment does not finish, the request stays on file and the chart is not prepared until payment succeeds.
      </p>
      <h2>Delivery</h2>
      <p>
        After payment, the astrologer prepares the handwritten kundli and the handwritten answers. They are sent to your WhatsApp number. Keep that number able to receive the message.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms: <a className="text-plum underline decoration-gold underline-offset-2" href="mailto:twiq.pro@gmail.com">twiq.pro@gmail.com</a>. These terms are governed by the laws of India.
      </p>
    </PolicyPage>
  );
}
