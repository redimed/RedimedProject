/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var isTestEmail = true;
module.exports = {
    sendEmail: function(req, res, emailInfo) {

        if (isTestEmail) {
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
                cc: emailInfo.cc ? emailInfo.cc : [],
                subject: emailInfo.subject, // Subject line
                html: emailInfo.htmlBody,
                attachments: emailInfo.attachments ? emailInfo.attachments : []
            }
        } else {
            var transport = nodemailer.createTransport(smtpTransport({
                host: "mail.redimed.com.au", // hostname
                secure: false,
                port: 25, // port for secure SMTP
                auth: {
                    user: "programmer2",
                    pass: "Hello8080"
                        // user: "redicolegal",
                        // pass: "L3g@lSyst3m!"
                },
                tls: {
                    rejectUnauthorized: false
                },
                debug: true
            }));

            var mailOptions = {
                from: emailInfo.senders, // sender address.  Must be the same as authenticated user if using Gmail.
                to: emailInfo.recipients, // receiver
                cc: emailInfo.cc ? emailInfo.cc : [],
                subject: emailInfo.subject, // Subject line
                html: emailInfo.htmlBody,
                attachments: emailInfo.attachments ? emailInfo.attachments : []

            }
        }


        transport.sendMail(mailOptions, function(error, response) { //callback
            if (error) {
                console.log(error);
                res.json({
                    status: "fail"
                });
            } else {
                console.log("Message sent: " + response.message);
                res.json({
                    status: "success"
                });
            }
            transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });
    }
}
