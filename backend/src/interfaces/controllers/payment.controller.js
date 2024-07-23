import Stripe from 'stripe';
import Student from '../../domain/student.model.js';
import Tutor from '../../domain/tutor.model.js';
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
          unit_amount: amount * 100, // Amount in paise (1 INR = 100 paise)
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:5173/student/payment-success?session_id={CHECKOUT_SESSION_ID}', 
      cancel_url: 'http://localhost:5173/student/payment-cancel',
      metadata: {
        tutorId: sessionDetails.tutorId,
        studentId: sessionDetails.studentId,
        date: sessionDetails.date,
        startTime: sessionDetails.startTime,
        endTime: sessionDetails.endTime,
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
    console.log(`  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
  
    try {
      const tutorId = session.metadata.tutorId;
      const studentId = session.metadata.studentId;
      const dateString = session.metadata.date;
      const startTime = session.metadata.startTime;
      const endTime = session.metadata.endTime;

      

      const tutor = await Tutor.findById(tutorId);
      const student = await Student.findById(studentId);

      if (!tutor || !student) {
        return res.status(404).json({ message: 'Tutor or student not found' });
      }

      // Parse the date string and set the time to midnight to avoid time zone issues
      const [month, day, year] = dateString.split('/').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));

    

      // Find the booked slot in tutor's schedule
      const slotIndex = tutor.booked.findIndex(
        slot =>
          slot.studentId.equals(studentId) &&
          slot.date.toISOString().split('T')[0] === date.toISOString().split('T')[0] &&
          slot.startTime === startTime &&
          slot.endTime === endTime
      );

      if (slotIndex === -1) {
        return res.status(400).json({ message: 'Booked slot not found in tutor’s schedule' });
      }
      console.log('tutor', tutor.booked[slotIndex]);

      // Mark the booked slot as completed
      tutor.booked[slotIndex].status = 'completed';
      await tutor.save();

      // Find and update the corresponding slot in student's schedule
      const studentSlotIndex = student.bookedSlots.findIndex(
        slot =>
          slot.tutorId.equals(tutorId) &&
          slot.date.toISOString().split('T')[0] === date.toISOString().split('T')[0] &&
          slot.startTime === startTime &&
          slot.endTime === endTime
      );

      if (studentSlotIndex === -1) {
        return res.status(400).json({ message: 'Booked slot not found in student’s schedule' });
      }
      console.log('student', student.bookedSlots[studentSlotIndex]);

      student.bookedSlots[studentSlotIndex].status = 'completed';
      await student.save();

      res.status(200).json({ received: true });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  } else {
    res.status(400).json({ error: 'Unhandled event type' });
  }
};
