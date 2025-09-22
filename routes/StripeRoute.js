import express from "express";
import { hotelCheckoutSession } from "../controller/StripeController.js";
import { stripeWebhook } from "../controller/webhookController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
const router = express.Router();

// 🏨 Checkout Session للفنادق (مستخدم مسجل)
router.post("/hotel/:id/checkout", VerifyToken, hotelCheckoutSession);

// 🔔 Webhook من Stripe (لازم يكون بدون auth)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

import PaymentLog from "../model/Stripe.js";

router.get("/success", async (req, res) => {
  const sessionId = req.query.session_id;

  res.send(`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:50px auto; padding: 30px; border-radius: 15px; box-shadow: 0 0 15px rgba(0,0,0,0.2); text-align: center;">
      <h1 id="statusText" style="color: orange; font-size: 2.5rem;">⏳ Payment is processing...</h1>
      <p style="font-size: 1.2rem; margin: 10px 0;">Amount: <strong>200 USD</strong></p>
      <p style="font-size: 1rem; margin: 5px 0; color: #555;">Session ID: ${sessionId}</p>
      <a href="/" style="display:inline-block; margin-top:20px; padding: 12px 25px; background-color: #007bff; color:#fff; border-radius: 8px; text-decoration:none; font-weight:bold;">Go to Home</a>

      <script>
        async function checkStatus() {
          try {
            const res = await fetch('/api/v1/payment/status?session_id=${sessionId}');
            const data = await res.json();
            const statusText = document.getElementById('statusText');
            if(data.status === 'paid') {
              statusText.textContent = '✅ Payment Successful';
              statusText.style.color = 'green';
              clearInterval(interval);
            }
          } catch(err) {
            console.error(err);
          }
        }

        const interval = setInterval(checkStatus, 2000); // كل ثانيتين
      </script>
    </div>
  `);
});

router.get("/status", async (req, res) => {
  const { session_id } = req.query;
  const payment = await PaymentLog.findOne({ paymentReference: session_id });
  if (!payment) return res.json({ status: "unpaid" });
  res.json({ status: payment.status });
});

// Cancel page
router.get("/cancel", (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:50px auto; padding: 30px; border-radius: 15px; box-shadow: 0 0 15px rgba(0,0,0,0.2); text-align: center;">
      <h1 style="color: red; font-size: 2.5rem;">❌ Payment Cancelled</h1>
      <p style="font-size: 1.2rem; margin-top: 10px;">تم إلغاء الدفع. يمكنك المحاولة مرة أخرى.</p>
      <a href="/" style="display:inline-block; margin-top:20px; padding: 12px 25px; background-color: #007bff; color:#fff; border-radius: 8px; text-decoration:none; font-weight:bold;">Try Again</a>
    </div>
  `);
});

export default router;
