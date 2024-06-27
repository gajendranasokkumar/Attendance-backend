const nodemailer = require('nodemailer');

async function sendEmail({toMail, otp}) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '717822p215@kce.ac.in',
        pass: 'Gajendran@049944919805'// Use environment variables for this in production
      }
    });

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            h1 {
              color: #4a4a4a;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
              padding: 10px;
              background-color: #f8f9fa;
              border-radius: 5px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>OTP for Changing the Password</h1>
            <p>Your 6-digit OTP for changing the password is:</p>
            <p class="otp">${otp}</p>
            <p>Please use this OTP to complete your password changing process. This OTP is valid only for 5 mins</p>
            <p>If you didn't request this change, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: 'Gajendran A',
      to: toMail,
      subject: 'OTP for Changing the Password',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

module.exports = sendEmail;