/**
 * Created by meditech on 8/29/2014.
 */

//root
eval(fs.readFileSync('module_listener/root.js')+'');

//User
eval(fs.readFileSync('module_listener/users.js')+'');

//LegalOnlineBooking module
eval(fs.readFileSync('module_listener/redi-legal-online-booking.js')+'');
