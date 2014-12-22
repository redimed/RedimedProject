var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
	getDetail: function(req, res){

		var id = req.query.id;

		db.Appointment.find({
			where: {CAL_ID: id},
			// include: [
			// 	{ 
			// 		model: db.InvItem , as: 'Items',
			// 		attributes: ['ITEM_ID', 'ITEM_NAME', 'ITEM_CODE']
			// 	},
			// ]
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
	},

	postItemFeeAppt: function(req, res) {
		var list_id = req.body.list_id;
		var service_id = req.body.service_id; 
		// var list_id =  [29199, 29175, 34929, 34931, 34903, 34905];
		// var service_id = req.query.id; 

		db.SysServices.find({
			where: {SERVICE_ID: service_id},
			attributes: ['SERVICE_ID', 'FEE_TYPE_ID']
		})
		.success(function(service){
			if(!service || !service.FEE_TYPE_ID) {
				res.json(500, {status: 'error', message: 'Not found service or Type !!!'})
				return;
			}
			db.mdtClnItemFee.findAll({
				where: {
					FEE_TYPE_ID: service.FEE_TYPE_ID,
					CLN_ITEM_ID: list_id
				}
				
			}).success(function(fee_type){
				res.json({status: 'success', list: fee_type});
			})
		})
		.error(function( err ){
			console.log(err);
			res.json(500, {status: 'error', error: err})
		})

	}
}