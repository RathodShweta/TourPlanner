const PDFDocument = require("pdfkit");
const sendEmail = require("../utils/sendEmail");

exports.sendBookingConfirmation = async (req, res) => {
    try {
        const { email, name, bookingDetails, type } = req.body;

        if (!email || !bookingDetails) {
            return res.status(400).json({ message: "Email and booking details are required" });
        }

        // Generate PDF in-memory
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));

        // Return a promise for the PDF generation
        const pdfPromise = new Promise((resolve) => {
            doc.on('end', () => {
                let pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
        });

        // 📄 PDF Content
        doc.fontSize(22).fillColor("#1e293b").text("TourPlanner Booking Confirmation", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).fillColor("#334155").text(`Date: ${new Date().toLocaleString()}`);
        doc.moveDown();
        doc.fontSize(14).text("Booking Details:", { underline: true });
        doc.moveDown(0.5);

        Object.entries(bookingDetails).forEach(([key, value]) => {
            doc.fontSize(11).text(`${key}: ${value}`);
        });

        doc.moveDown(2);
        doc.fontSize(10).fillColor("#64748b").text("Thank you for choosing TourPlanner! Have a safe and happy journey.", { align: "center" });
        doc.end();

        const pdfBuffer = await pdfPromise;

        // 📧 Send Email
        await sendEmail({
            email: email,
            subject: "Payment Successful – Booking Confirmed",
            message: `
                <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: auto;">
                    <h2 style="color: #4f46e5;">Payment Successful</h2>
                    <p>Dear ${name || 'User'},</p>
                    <p>Your payment has been successfully completed. Your <b>${type || 'flight/hotel'}</b> booking has been confirmed.</p>
                    <p>Thank you for choosing our <b>Tour Planner</b> website. We wish you a pleasant and safe journey.</p>
                    <p>Please find your booking receipt attached to this email.</p>
                    <br/>
                    <p>Best regards,<br/><b>Tour Planner Team</b></p>
                </div>
            `,
            attachments: [
                {
                    filename: `TourPlanner_Booking_${bookingDetails["Booking ID"] || "Receipt"}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });

        res.json({ message: "Confirmation email sent with PDF" });
    } catch (error) {
        console.error("Booking email error:", error);
        res.status(500).json({ message: "Failed to send confirmation email", error: error.message });
    }
};
