var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'assyncplanningpoker@gmail.com',
        pass: 'Poker@123'
    }
});

const mailOptions = (to, subject, message) => {
    return {
        from: 'assyncplanningpoker@gmail.com',
        to: to,
        subject: subject,
        text: message
    };
}

exports.sendMail = (to, subject, message) => {
    var options = mailOptions(to, subject, message);
    transporter.sendMail(options, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


