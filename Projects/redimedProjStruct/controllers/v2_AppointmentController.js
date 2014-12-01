var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	getDetail: function(req, res){

		var id = req.query.id;

		db.Appointment.find({
			where: {CAL_ID: id},
			include: [
				{ 
					model: db.InvItem , as: 'Items',
					attributes: ['ITEM_ID', 'ITEM_NAME', 'ITEM_CODE']
				},
			]
		}).success(function(appt){
			if(!appt) {
				res.json(500, {"status": "error"});
				return;
			}

			// for (var i = appt.Items.length - 1; i >= 0; i--) {

			// 	var item = appt.Items[i];
			// 	// console.log(item)
			// 	// break;
			// 	item.QUANTITY = item.clnApptItem.QUANTITY;
			// };
	
			// appt.getItems().success(function(items){


				res.json({'status': 'success', data: appt});
			// })

		}) .error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	}
}