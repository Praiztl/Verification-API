var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'professorbashorun@gmail.com',
    pass: 'Professorconnect'
  }
});




export async function send(data){
  var mailOptions = {
    from:'professorbashorun@gmail.com',
    to:data&&data.to?data.to:'jaybashorun@gmail.com',
    subject:data&&data.subject?data.subject:'VoiceTome Verification',
    text:data&&data.text?data.text:'That was easy!',
    html:data&&data.html?data.html:'<b>That was easy</b>'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}