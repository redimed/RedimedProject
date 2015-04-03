var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var moment=require('moment');

module.exports = {
	//get data ph_company
	getCompany:function(req,res){
		var user_id = req.body;

		var sqlSelectCompany = 
							"SELECT cp.`company_id`,cp.`company_name`,cp.`address`,cp.`surburb`,cp.`postcode`,cp.state,cp.`country`,cp.`contact_name`,cp.`contact_number`,cp.`email`,cp.`phone`,cp.`email`,cp.`isCompouding`,cp.`isCPOP`,cp.`Dispensing_software`,cp.`isMutiShops` FROM ph_companies cp "+
							"INNER JOIN  `ph_company_users` cu ON cp.`company_id` = cu.`company_id` "+
							"INNER JOIN ph_users u ON cu.`user_id` = u.`user_id` "+
							"WHERE u.`user_id` = ?" ;

	}

}