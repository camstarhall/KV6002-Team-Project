const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {Vonage} = require("@vonage/server-sdk");

// Initialize Vonage
const vonage = new Vonage({
  apiKey: "f761193a", // Replace with your Vonage API Key
  apiSecret: "eRkUP7EZaABR1TE6", // Replace with your Vonage API Secret
});

exports.sendBookingNotification = onDocumentCreated(
    {document: "Bookings/{bookingId}"},
    async (event) => {
    // Access the Firestore snapshot and extract the document data
      const bookingSnapshot = event.data; // Firestore QueryDocumentSnapshot
      if (!bookingSnapshot) {
        console.error("No snapshot data found for the booking.");
        return null;
      }

      const bookingData = bookingSnapshot.data(); // Extract the document fields
      console.log("Booking data:", bookingData);

      // Validate the booking data
      const {phone, eventTitle, bookingDate} = bookingData;
      if (!phone || !eventTitle || !bookingDate) {
        console.error("Missing required fields in booking:", bookingData);
        return null;
      }

      // Format the SMS content
      const message = `Thank you for booking "${eventTitle}". Your booking is confirmed for ${bookingDate}.`;

      try {
      // Send the SMS using Vonage
        const response = await vonage.sms.send({
          to: phone,
          from: "ROSE", // Replace with your desired sender name (max 11 characters)
          text: message,
        });

        console.log("SMS sent successfully:", response);
      } catch (error) {
        console.error("Failed to send SMS:", error);
      }

      return null;
    },
);
