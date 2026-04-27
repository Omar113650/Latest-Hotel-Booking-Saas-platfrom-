import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.APP_EMAIL_ADDRESS, 
    pass: process.env.APP_EMAIL_PASSWORD, 
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"Hotel-Book " <${process.env.APP_EMAIL_ADDRESS}>`, 
      to,
      subject: subject || "Hotel-Book Notification",
      text: text || "You have a new notification from Hotel-Book.",
      html:
        html ||
        `
          <h2>Hotel-Book Notification </h2>
          <p>You have received a new message from <strong>Hotel-Book</strong>.</p>
        `,
    });

    console.log(" Email sent successfully to:", to);
  } catch (error) {
    console.error(" Error sending email:", error.message, error.response || "");
    throw error;
  }
};




// https://your-domain.com/dashboard.  
// ده هنستخدمه ام بيقلك علي الايميل روح لي الداش بورد ف باخده من الفرونت بقا 