const nodemailer = require("nodemailer");
const inlineBase64 = require("nodemailer-plugin-inline-base64");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

// Create a Brevo transporter
const smtpTransporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.BREVO_SMTP_USERNAME, // Your Brevo account email
    pass: process.env.BREVO_SMTP_PASSWORD, // Your Brevo SMTP key
  },
});

// Verify connection configuration
smtpTransporter.verify(function (error, success) {
  if (error) {
    console.log("Brevo SMTP Server connection error:", error);
  } else {
    console.log("Brevo SMTP Server is ready to take our messages");
  }
});

const sendEmail = (to, from, subject, html) => {
  return new Promise((resolve, reject) => {
    // Make sure 'from' is your verified sender in Brevo
    const verifiedFrom = process.env.FROM_EMAIL || from;

    console.log(
      `Sending email FROM: ${verifiedFrom} TO: ${to} SUBJECT: ${subject}`
    );

    // Setup email data
    let mailOptions = {
      from: verifiedFrom,
      to,
      subject,
      html,
    };

    smtpTransporter.use("compile", inlineBase64());

    // Send mail with defined transport object
    smtpTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject({ _message: "Unable to send Email", status: 500, error });
      } else {
        console.log("Email sent successfully:", info.messageId);
        resolve(info);
      }
    });
  });
};

const parseEmailsData = async (emailData) => {
  try {
    let { data } = emailData;
    for (let j = 0; j < data.length; j++) {
      let singleData = data[j];

      // Use the from address provided or fall back to environment variable
      const fromAddress = process.env.FROM_EMAIL || singleData.from;
      console.log(`Using sender address: ${fromAddress}`);

      for (let i = 0; i < singleData.to.length; i++) {
        let html = "";
        if (
          _.isEqual("forget-password.html", singleData.template) ||
          _.isEqual("create-user.html", singleData.template)
        ) {
          try {
            html = fs.readFileSync(
              path.join(__dirname, "/", `../templates/${singleData.template}`),
              "utf8"
            );

            console.log(`Template ${singleData.template} loaded successfully`);

            // Replace template variables
            if (singleData.data && singleData.data.link) {
              html = html.replace(
                /##VERIFICATION_LINK##/g,
                singleData.data.link
              );
            }
          } catch (err) {
            console.error(
              `Error loading template ${singleData.template}:`,
              err
            );
            throw err;
          }
        }

        try {
          // Send email with the from address we determined above
          await sendEmail(
            singleData.to[i],
            fromAddress,
            singleData.subject,
            html
          );
          console.log(`Email sent successfully to ${singleData.to[i]}`);
        } catch (err) {
          console.error(`Failed to send email to ${singleData.to[i]}:`, err);
          throw err;
        }
      }
    }

    return {
      status: 200,
      message: "Emails have been queued for sending.",
    };
  } catch (error) {
    console.log("Error parsing email data:", error);

    return Promise.reject({
      status: 400,
      message: "Error parsing email data format.",
      error,
    });
  }
};

// create a function for sum of two values
const sumTwoValues = (a, b) => a + b;


module.exports = {
  parseEmailsData,
  sendEmail,
};
