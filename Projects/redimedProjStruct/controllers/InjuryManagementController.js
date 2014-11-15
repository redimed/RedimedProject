/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var db = require('../models');
module.exports = {
  search : function(req,res){
      var info = req.body.info;
      var title = info.title;
      var fname = info.First_name;
      var sname = info.Sur_name;
      var midname = info.Middle_name;

  }
};