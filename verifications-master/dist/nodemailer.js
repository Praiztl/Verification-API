'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.send = send;

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transporter = _nodemailer2.default.createTransport({
  service: 'gmail',
  auth: {
    user: 'tochukwueagles7@gmail.com',
    pass: '@Angel007'
  }
});

async function send(data) {
  var mailOptions = {
    from: 'tochukwueagles7@gmail.com',
    to: data && data.to ? data.to : 'tochukwueagles7@gmail.com',
    subject: data && data.subject ? data.subject : 'VoiceTome Verification',
    text: data && data.text ? data.text : 'That was easy!',
    html: data && data.html ? data.html : '<b>That was easy</b>'
  };

  try {
    var info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error(error);
  }
}