import Stripe from 'stripe';
import Session from '../../domain/session.model.js';
import Notification from '../../domain/notification.model.js'
import Slot from '../../domain/slot.model.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { amount, sessionDetails } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Tutoring Session with ${sessionDetails.tutorName}`,
            description: `Subjects: ${sessionDetails.subjects}, Start Time: ${sessionDetails.startTime}, End Time: ${sessionDetails.endTime}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:5173/student/payment-success?session_id={CHECKOUT_SESSION_ID}', 
      cancel_url: 'http://localhost:5173/student/payment-cancel',
      metadata: {
        tutorId: sessionDetails.tutorId,
        studentId: sessionDetails.studentId,
        slotId: sessionDetails.slotId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const { tutorId, studentId, slotId } = session.metadata;

      const bookedSession = await Session.findOne({
        tutorId,
        studentId,
        slotId,
        status: 'pending',
        paymentStatus: 'pending'
      });

      if (!bookedSession) {
        console.log('Session not found for metadata:', session.metadata);
        return res.status(404).json({ message: 'Session not found' });
      }

       // Fetch slot details
       const slot = await Slot.findById(slotId);
       if (!slot) {
         console.log('Slot not found for slotId:', slotId);
         return res.status(404).json({ message: 'Slot not found' });
       }

      // Update the session status to confirmed and paymentStatus to completed
      bookedSession.status = 'confirmed';
      bookedSession.paymentStatus = 'completed';
      await bookedSession.save();

      // Create and save notifications
      const tutorNotification = new Notification({
        userId: tutorId,
        userType: 'tutor',
        message: `A new booking has been confirmed for your session on ${slot.date.toDateString()} from ${slot.startTime} to ${slot.endTime}`
      });

      const studentNotification = new Notification({
        userId: studentId,
        userType: 'student',
        message:`Your booking has been confirmed for the session on ${slot.date.toDateString()} from ${slot.startTime} to ${slot.endTime}`
      });

      await tutorNotification.save();
      await studentNotification.save();

     

      res.status(200).json({ received: true });
    } catch (error) {
      console.log('Error processing webhook:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  } else {
    res.status(400).json({ error: 'Unhandled event type' });
  }
};
