const {
  onDocumentCreated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const {onSchedule} = require("firebase-functions/v2/scheduler"); // Correct import for scheduled functions
const {onRequest} = require("firebase-functions/v2/https");
const {Vonage} = require("@vonage/server-sdk");
const admin = require("firebase-admin");

admin.initializeApp();

// Initialize Vonage
const vonage = new Vonage({
  apiKey: "f761193a", // Replace with your Vonage API Key
  apiSecret: "eRkUP7EZaABR1TE6", // Replace with your Vonage API Secret
});

/**
 * Function 1: sendBookingNotification
 * Triggered when a new booking document is created in the "Bookings" collection.
 * Sends a booking confirmation SMS to the customer.
 */
exports.sendBookingNotification = onDocumentCreated(
    {document: "Bookings/{bookingId}"},
    async (event) => {
      const bookingSnapshot = event.data;

      if (!bookingSnapshot) {
        console.error("No snapshot data found for the booking.");
        return null;
      }

      const bookingData = bookingSnapshot.data();
      const {phone, eventTitle, eventDate, uniqueCode} = bookingData;

      if (!phone || !eventTitle || !eventDate || !uniqueCode) {
        console.error("Missing required fields in booking:", bookingData);
        return null;
      }

      // SMS content with the unique code
      const message = `Thank you for booking "${eventTitle}" on ${eventDate}.\n\nTo cancel your booking, reply with your 4-digit code:\n${uniqueCode}`;

      try {
      // Send the SMS using Vonage
        const response = await vonage.sms.send({
          to: phone,
          from: "447418318909", // Replace with your phone number
          text: message,
        });

        console.log("SMS sent successfully:", response);
      } catch (error) {
        console.error("Failed to send SMS:", error);
      }

      return null;
    },
);

/**
 * Function 2: handleInboundSMS
 * Webhook function that listens for inbound SMS replies via Vonage.
 * Cancels the booking if the user replies with their 4-digit unique code.
 */
exports.handleInboundSMS = onRequest(async (req, res) => {
  const {msisdn, text} = req.body;

  console.log("Inbound SMS received:", req.body);

  if (!msisdn || !text) {
    res.status(400).send("Invalid SMS data");
    return;
  }

  const uniqueCode = text.trim(); // The user is expected to send just the unique code

  console.log("User sent unique code:", uniqueCode);

  try {
    const bookingsCollection = admin.firestore().collection("Bookings");

    // Find the booking with the provided unique code
    const bookingQuery = bookingsCollection.where(
        "uniqueCode",
        "==",
        uniqueCode,
    );
    const bookingSnapshot = await bookingQuery.get();

    if (bookingSnapshot.empty) {
      console.log("No booking found with unique code:", uniqueCode);
      res.status(200).send("No booking found with this code.");
      return;
    }

    const bookingDoc = bookingSnapshot.docs[0];
    const bookingData = bookingDoc.data();

    // Verify the phone number matches
    if (bookingData.phone !== msisdn) {
      console.error("Phone number mismatch for booking:", uniqueCode);
      res.status(200).send("Booking not found or phone number mismatch.");
      return;
    }

    // Update the booking status to 'Cancelled'
    await bookingDoc.ref.update({status: "Cancelled"});

    console.log("Booking cancelled successfully:", uniqueCode);

    // Send confirmation SMS to the customer
    const confirmationMessage = `Your booking "${bookingData.eventTitle}" has been successfully cancelled.`;

    try {
      const smsResponse = await vonage.sms.send({
        to: msisdn,
        from: "447418318909", // Replace with your phone number
        text: confirmationMessage,
      });

      console.log(
          "Cancellation confirmation SMS sent successfully:",
          smsResponse,
      );
    } catch (smsError) {
      console.error("Failed to send cancellation confirmation SMS:", smsError);
    }

    res.status(200).send("Your booking has been successfully cancelled.");
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).send("Failed to cancel booking.");
  }
});

/**
 * Function 3: notifyUsersOnEventDeletion
 * Triggered when an event document is deleted from the "Events" collection.
 * Notifies all users who booked the event and cancels their bookings.
 */
exports.notifyUsersOnEventDeletion = onDocumentDeleted(
    {document: "Events/{eventId}"},
    async (event) => {
      const deletedEventId = event.params.eventId;

      console.log("Event deleted:", deletedEventId);

      try {
        const bookingsCollection = admin.firestore().collection("Bookings");
        const bookingsSnapshot = await bookingsCollection
            .where("eventId", "==", deletedEventId)
            .get();

        if (bookingsSnapshot.empty) {
          console.log("No bookings found for the deleted event.");
          return;
        }

        const smsPromises = [];
        bookingsSnapshot.forEach((doc) => {
          const booking = doc.data();

          if (booking.phone) {
            const message = `We regret to inform you that the event "${booking.eventTitle}" has been cancelled. We apologize for the inconvenience.`;

            // Send SMS
            smsPromises.push(
                vonage.sms.send({
                  to: booking.phone,
                  from: "447418318909", // Replace with your phone number
                  text: message,
                }),
            );

            // Update booking status to "Cancelled"
            bookingsCollection.doc(doc.id).update({status: "Cancelled"});
          }
        });

        // Wait for all SMS promises to resolve
        await Promise.all(smsPromises);
        console.log("All users have been notified, and bookings cancelled.");
      } catch (error) {
        console.error("Error notifying users about event deletion:", error);
      }
    },
);

/**
 * Function 3: scheduleReminderSMS
 * Scheduled Cloud Function that runs every 24 hours.
 * Sends reminder SMS for bookings happening in the next 48 hours.
 */
exports.scheduleReminderSMS = onSchedule("every 24 hours", async (event) => {
  try {
    const currentTime = new Date();
    const targetTime = new Date(currentTime.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

    const bookingsCollection = admin.firestore().collection("Bookings");

    // Query bookings for events happening within the next 48 hours
    const bookingsSnapshot = await bookingsCollection
        .where("status", "==", "Booked")
        .get();

    const smsPromises = [];
    bookingsSnapshot.forEach((doc) => {
      const booking = doc.data();
      const eventDate = new Date(booking.eventDate);

      // Check if the eventDate is within the next 48 hours
      if (eventDate >= currentTime && eventDate <= targetTime) {
        smsPromises.push(
            sendReminderSMS(
                booking.phone,
                booking.eventTitle,
                eventDate.toLocaleDateString(),
            ),
        );
      }
    });

    await Promise.all(smsPromises);
    console.log("Reminder SMS process completed.");
  } catch (error) {
    console.error("Error scheduling reminder SMS:", error);
  }
});

/**
 * Function: sendReminderSMS
 * Sends a reminder SMS to a customer.
 * @param {string} phone - The customer's phone number.
 * @param {string} eventTitle - The title of the event.
 * @param {string} eventDate - The date of the event.
 */
async function sendReminderSMS(phone, eventTitle, eventDate) {
  const message = `Reminder: Your booking for "${eventTitle}" is scheduled on ${eventDate}. We look forward to seeing you there!`;

  try {
    const response = await vonage.sms.send({
      to: phone,
      from: "447418318909",
      text: message,
    });
    console.log("Reminder SMS sent successfully:", response);
  } catch (error) {
    console.error("Failed to send reminder SMS:", error);
  }
}
