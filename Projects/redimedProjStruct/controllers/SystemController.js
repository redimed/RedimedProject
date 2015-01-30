/* created by BV */
var db = require('../models');
module.exports = {
	listServiceByClinical: function(req, res){
		var dept = req.body.dept;

		req.getConnection(function(err, connection){
            var sql = "SELECT s.SERVICE_ID, ss.SERVICE_NAME"+
                " FROM cln_dept_services s"+
                " INNER JOIN sys_services ss ON s.SERVICE_ID=ss.SERVICE_ID"+
                " WHERE s.CLINICAL_DEPT_ID="+dept + ' AND s.ISENABLE = 1';
                console.log(sql);
            var query = connection.query(
                sql
            , function(err, rows){
                if(err){
                    console.log("Error Selecting : %s ",err );
                }
                else{
                    res.json(rows);
                }
            });
        })
	}
};