const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const { Vonage } = require("@vonage/server-sdk");
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
  { document: "Bookings/{bookingId}" },
  async (event) => {
    const bookingSnapshot = event.data;

    if (!bookingSnapshot) {
      console.error("No snapshot data found for the booking.");
      return null;
    }

    const bookingData = bookingSnapshot.data();
    const bookingId = event.params.bookingId;
    const { phone, eventTitle, eventDate } = bookingData;

    if (!phone || !eventTitle || !eventDate) {
      console.error("Missing required fields in booking:", bookingData);
      return null;
    }

    // SMS content with Booking ID
    const message = `Thank you for booking "${eventTitle}" on ${eventDate}.\n\nTo cancel your booking, reply with:\nCANCEL ${bookingId}`;

    try {
      // Send the SMS using Vonage
      const response = await vonage.sms.send({
        to: phone,
        from: "447418318909", // Replace with your new phone number
        text: message,
      });

      console.log("SMS sent successfully:", response);
    } catch (error) {
      console.error("Failed to send SMS:", error);
    }

    return null;
  }
);

/**
 * Function 2: handleInboundSMS
 * Webhook function that listens for inbound SMS replies via Vonage.
 * Cancels the booking if the user replies with "CANCEL <BookingID>".
 */
exports.handleInboundSMS = onRequest(async (req, res) => {
  const { msisdn, text } = req.body;

  console.log("Inbound SMS received:", req.body);

  if (!msisdn || !text) {
    res.status(400).send("Invalid SMS data");
    return;
  }

  // Extract Booking ID from the text
  const cancelMatch = text.trim().match(/^CANCEL\s+(\w+)$/i);
  if (!cancelMatch) {
    console.log("User sent an unrecognized reply:", text);
    res
      .status(200)
      .send("Unrecognized reply. To cancel, reply with 'CANCEL <BookingID>'.");
    return;
  }

  const bookingId = cancelMatch[1]; // Extracted Booking ID
  console.log("User requested to cancel Booking ID:", bookingId);

  try {
    const bookingRef = admin.firestore().collection("Bookings").doc(bookingId);
    const bookingSnapshot = await bookingRef.get();

    if (!bookingSnapshot.exists) {
      console.log("No booking found with ID:", bookingId);
      res.status(200).send("No booking found with this ID.");
      return;
    }

    const bookingData = bookingSnapshot.data();
    if (bookingData.phone !== msisdn) {
      console.error("Phone number mismatch for booking:", bookingId);
      res.status(200).send("Booking not found or phone number mismatch.");
      return;
    }

    // Update the booking status to 'Cancelled'
    await bookingRef.update({ status: "Cancelled" });

    console.log("Booking cancelled successfully:", bookingId);

    // Send confirmation SMS to the customer
    const confirmationMessage = `Your booking "${bookingData.eventTitle}" has been successfully cancelled.`;

    try {
      const smsResponse = await vonage.sms.send({
        to: msisdn,
        from: "447418318909", // Replace with your new phone number
        text: confirmationMessage,
      });

      console.log(
        "Cancellation confirmation SMS sent successfully:",
        smsResponse
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
