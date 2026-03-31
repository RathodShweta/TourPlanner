const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // Debugging: Log the recipient address
    console.log(`Sending email to: ${options.email}`);

    if (!options.email) {
        throw new Error("sendEmail failed: No recipient email provided.");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"TourPlanner" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
        attachments: options.attachments || [],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error("Error in transporter.sendMail:", error);
        throw error;
    }
};

module.exports = sendEmail;