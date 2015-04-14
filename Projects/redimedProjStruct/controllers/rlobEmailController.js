/**
 * Created by tannv.dts@gmail.com on 10/14/2014.
 */
/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var rlobUtil=require('./rlobUtilsController');
module.exports =
{
    sendEmail: function (req,res,emailInfo) {      
      /*
        phanquocchien.c1109g@gmail.com
        chen thong tin vao noi dung email
       */
        emailInfo.htmlBody = " <div style='font:11pt Calibri'> "+ emailInfo.htmlBody +  
        "   <hr/>                                                                                                                                        "+      
        "   <table>                                                                                                                                      "+      
        "   <tr>                                                                                                                                         "+      
        "       <td>                                                                                                                                     "+      
        "     <img src='http://s17.postimg.org/dqbicb0zj/Medico_Legal.png'/>                                                                             "+      
        "       </td>                                                                                                                                    "+      
        "       <td>                                                                                                                                     "+      
        //"           <p style='font-weight: bold'>Redimed Medico-Legal</p>                                                                                "+      
        "           <p><span style='font-weight: bold'>A&nbsp;</span>1 Frederick street, Belmont, Westem Australia 6140</p>                              "+  
        "           <p><span style='font-weight: bold'>T&nbsp;</span>1300 881 301 (REDiMED Emergency Service 24/7)</p>                                   "+      
        "           <p><span style='font-weight: bold'>P&nbsp;</span>+61 8 9230 0900 <span style='font-weight: bold'>F</span> +61 8 9230 0999</p>        "+      
        "           <p><span style='font-weight: bold'>E&nbsp;</span>medicolegal@redimed.com.au</p>                                                      "+      
        "           <p><span style='font-weight: bold'>W&nbsp;</span>www.redimed.com.au</p>                                                              "+      
        "       </td>                                                                                                                                    "+      
        "   </tr>                                                                                                                                        "+      
        "   </table>                                                                                                                                     "+      
        "                                                                                                                                                "+      
        " </div>                                                                                                                                         "; 
        if(rlobUtil.isTestSendMail)
        {
           var transport = nodemailer.createTransport({
               service: 'Gmail',
               auth: {
                   user:'vnlegal123@gmail.com',//test
                   pass:'redimed123'//test
               }
           });

           var mailOptions = {
               from: emailInfo.senders, // sender address.  Must be the same as authenticated user if using Gmail.
               to: emailInfo.recipients, // receiver
               cc: emailInfo.cc?emailInfo.cc:[],
               subject: emailInfo.subject, // Subject line
               html: emailInfo.htmlBody,
               attachments:emailInfo.attachments?emailInfo.attachments:[]
           }
        }
        else
        {
          var transport = nodemailer.createTransport(smtpTransport({
            host: "mail.redimed.com.au", // hostname
            secure: false,
            port: 25, // port for secure SMTP
            auth: {
                // user: "programmer2",
                // pass: "Hello8080"
                user: "redicolegal",
                pass: "L3g@lSyst3m!"
            },
            tls: {rejectUnauthorized: false},
            debug:true
          }));

          var mailOptions = {
              from: emailInfo.senders, // sender address.  Must be the same as authenticated user if using Gmail.
              to: emailInfo.recipients, // receiver
              cc: emailInfo.cc?emailInfo.cc:[],
              subject: emailInfo.subject, // Subject line
              html: emailInfo.htmlBody,
              attachments:emailInfo.attachments?emailInfo.attachments:[]

          }
        }

        
        transport.sendMail(mailOptions, function(error, response){  //callback
            if(error){
                console.log(error);
                res.json({status:"fail"});
            }else{
                console.log("Message sent: " + response.message);
                res.json({status:"success"});
            }
            transport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        });
    }
}
