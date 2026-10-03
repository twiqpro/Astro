import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy — moolank",
  description: "How moolank uses the birth details you submit for a handwritten kundli.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage title="Privacy" updated="4 October 2026">
      <p>
        TWIQ RESEARCH (OPC) PVT LTD operates moolank at moolank.life. This page explains what we keep when you request a handwritten kundli.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Name, gender, date of birth, birth time, and birth place</li>
        <li>Email address and Indian mobile number</li>
        <li>Payment status, order ID, and amount in INR</li>
      </ul>
      <h2>Why we collect it</h2>
      <p>
        The astrologer needs your birth details to draw the kundli. We use your mobile number to send the handwritten chart and answers on WhatsApp, and your email if we need to reach you about the order. Payment details are used to confirm that the ₹499 INR fee was paid.
      </p>
      <h2>Who sees it</h2>
      <p>
        Your birth details are seen by us and by the astrologer preparing your kundli. Cashfree processes the payment. We do not sell your details. We do not use them to train an AI model. The chart and the answers are written by hand.
      </p>
      <h2>How long we keep it</h2>
      <p>
        We keep the request so the order, the payment, and the delivery can be checked later, including requests where payment did not finish. To ask about your details, email <a className="text-plum underline decoration-gold underline-offset-2" href="mailto:twiq.pro@gmail.com">twiq.pro@gmail.com</a>.
      </p>
    </PolicyPage>
  );
}