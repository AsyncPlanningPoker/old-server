var nodemailer = require('nodemailer');
const { resetPassword, genericMail } = require('./MailTemplates');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'assyncplanningpoker@gmail.com',
        pass: 'Poker@123'
    }
});

const mailOptions = (to, subject, template, params) => {
    let message = {}

    switch (template) {
        case "reset-password":
            message = resetPassword(params) 
        break;
        case "generic":
            message = genericMail(params);
    }   
    
    return {
        ...message,
        from: 'assyncplanningpoker@gmail.com',
        to: to,
        subject: subject,
    };
}

exports.sendMail = (to, subject, template, params ) => {
    if(process.env.NODE_ENV === 'test') return

    var options = mailOptions(to, subject, template, params);
    transporter.sendMail(options, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


