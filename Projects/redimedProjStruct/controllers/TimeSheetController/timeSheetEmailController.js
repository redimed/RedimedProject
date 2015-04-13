var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var isTest = true;
module.exports = {
    sendEmail: function(req, res, emailInfo) {
        if (isTest) {
            var transport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'vnlegal123@gmail.com', //test
                    pass: 'redimed123' //test
                }
            });
            var mailOptions = {
                from: emailInfo.senders, // sender address.  Must be the same as authenticated user if using Gmail.
                to: emailInfo.recipients, // receiver
                subject: emailInfo.subject, // Subject line
                html: emailInfo.htmlBody,
                attachments: [{
                    filename: 'logo.png',
                    path: __dirname.substr(0, __dirname.search("controllers")) + "client\\" + "img\\" + "TimeSheet\\" + "logo.png",
                    cid: 'logoRedimed' //same cid value as in the html img src
                }]
            }
        } else {
            var transport = nodemailer.createTransport(smtpTransport({
                host: "mail.redimed.com.au", // hostname
                secure: false,
                port: 25, // port for secure SMTP
                auth: {
                    user: "programmer2",
                    pass: "Hello8080"
                },
                tls: {
                    rejectUnauthorized: false
                },
                debug: true
            }));

            var mailOptions = {
                from: emailInfo.senders, // sender address.  Must be the same as authenticated user if using Gmail.
                to: emailInfo.recipients, // receiver
                subject: emailInfo.subject, // Subject line
                html: emailInfo.htmlBody

            }
        }
        transport.sendMail(mailOptions, function(error, response) { //callback
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
            transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });
    }
}
