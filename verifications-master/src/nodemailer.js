import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tochukwueagles7@gmail.com',
    //pass: ''
  }
});

export async function send(data) {
  const mailOptions = {
    from: 'tochukwueagles7@gmail.com',
    to: data && data.to ? data.to : 'tochukwueagles7@gmail.com',
    subject: data && data.subject ? data.subject : 'VoiceTome Verification',
    text: data && data.text ? data.text : 'That was easy!',
    html: data && data.html ? data.html : '<b>That was easy</b>'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error(error);
  }
}
