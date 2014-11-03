/* created by BV */
var db = require('../models');
module.exports = {
	listServiceByClinical: function(req, res){
		var dept = req.body.dept;

		req.getConnection(function(err, connection){
            var query = connection.query(
                "SELECT s.SERVICE_ID, ss.SERVICE_NAME"+
                " FROM cln_dept_services s"+
                " INNER JOIN sys_services ss ON s.SERVICE_ID=ss.SERVICE_ID"+
                " WHERE s.CLINICAL_DEPT_ID="+dept
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