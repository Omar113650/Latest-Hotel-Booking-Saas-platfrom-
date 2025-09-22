import Stripe from "stripe";
import { Hotel } from "../model/Hotel.js";
import { User } from "../model/user.js";
import PaymentLog from "../model/Stripe.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// @desc    Create Checkout Session for Hotel Booking
// @route   POST /api/v1/payment/hotel/:id/checkout
// @access  Private (Customer)
export const hotelCheckoutSession = async (req, res) => {
  try {
    const hotelId = req.params.id;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "الفندق غير موجود" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: " User not found" });
    }

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: hotel.hotelName,
            description: hotel.address,
          },
          unit_amount: Math.round(hotel.pricePerDay * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: user.Email,
      metadata: {
        phone: user.Phone || "",
        hotelId: hotel._id.toString(),
        userId: user._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/api/v1/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/api/v1/payment/cancel`,
    });

    await PaymentLog.create({
      orderId: null,
      paymentReference: session.id,
      paymentIntentId: session.payment_intent || null,
      amount: hotel.pricePerDay,
      currency: "usd",
      status: "unpaid",
      paymentMethod: "card",
      customerEmail: user.Email,
      rawResponse: session,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(" Stripe Hotel Checkout Error:", err);
    res.status(500).json({ error: err.message });
  }
};
