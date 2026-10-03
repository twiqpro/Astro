import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Refunds & Cancellations — moolank",
  description: "How to cancel a handwritten kundli request and when the ₹499 INR fee is refunded.",
};

export default function RefundsPage() {
  return (
    <PolicyPage title="Refunds & Cancellations" updated="4 October 2026">
      <p>
        This policy covers the Handwritten Kundli sold on moolank.life for ₹499 INR. Payments are collected in Indian Rupees through Cashfree by TWIQ RESEARCH (OPC) PVT LTD.
      </p>
      <h2>Cancel before the work starts</h2>
      <p>
        You may cancel while the astrologer has not yet started drawing your kundli. Email twiq.pro@gmail.com with your name, mobile number, and order ID. We refund the full ₹499 INR.
      </p>
      <h2>After the kundli is drawn</h2>
      <p>
        Once the chart has been drawn by hand, or the answers have been written, the fee is not refunded. The work has already been done for you. A change of mind after that point is not a ground for a refund.
      </p>
      <h2>If we cannot deliver</h2>
      <p>
        If payment succeeded and we cannot send you the handwritten kundli and handwritten answers, we refund the full ₹499 INR.
      </p>
      <h2>Failed or duplicate payments</h2>
      <ul>
        <li>If checkout fails, you are not charged for a completed order.</li>
        <li>A duplicate charge for the same request is refunded in full.</li>
      </ul>
      <h2>How a refund is paid</h2>
      <p>
        Approved refunds go back to the original payment method through Cashfree, in INR. Write to <a className="text-plum underline decoration-gold underline-offset-2" href="mailto:twiq.pro@gmail.com">twiq.pro@gmail.com</a> with your order ID. We reply by email with the status of the refund.
      </p>
    </PolicyPage>
  );
}
