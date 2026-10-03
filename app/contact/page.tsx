import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Contact Us — moolank",
  description: "Contact moolank about a handwritten kundli, a payment, or a refund.",
};

export default function ContactPage() {
  return (
    <PolicyPage title="Contact Us" updated="4 October 2026">
      <p>
        moolank is the handwritten kundli service at moolank.life. It is operated by TWIQ RESEARCH (OPC) PVT LTD.
      </p>
      <h2>Email</h2>
      <p>
        <a className="text-plum underline decoration-gold underline-offset-2" href="mailto:twiq.pro@gmail.com">
          twiq.pro@gmail.com
        </a>
      </p>
      <p>Write to us for a question about your kundli, your payment, or a refund. Include your name and, if you have already paid, your order ID.</p>
      <h2>Website</h2>
      <p>
        <a className="text-plum underline decoration-gold underline-offset-2" href="https://moolank.life">
          https://moolank.life
        </a>
      </p>
      <h2>What to include</h2>
      <ul>
        <li>Your full name</li>
        <li>The mobile number used on the form</li>
        <li>Your Cashfree order ID, for a payment or refund</li>
      </ul>
    </PolicyPage>
  );
}
