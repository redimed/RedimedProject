/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var db = require('../models');
module.exports = {
  search : function(req,res){
      var info = req.body.info;
      var title = info.Title != null ? '%'+info.Title+'%' : '%';
      var fname = info.First_name != null ? '%'+info.First_name+'%' : '%';
      var sname = info.Sur_name != null ? '%'+info.Sur_name+'%' : '%';
      var midname = info.Middle_name != null ? '%'+info.Middle_name+'%' : '%';

      db.sequelize.query("SELECT * FROM cln_patients WHERE Title LIKE ? AND First_name LIKE ? AND Sur_name LIKE ? AND Middle_name LIKE ?",null,[title,fname,sname,midname])
          .success(function(data){
              res.json(data);
          })
          .error(function(err){
              res.json('err');
              console.log(err);
          })

  }
};