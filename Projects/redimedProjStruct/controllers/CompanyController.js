/**
 * Created by meditech on 19/09/2014.
 */

module.exports = {
    companyList: function(req,res){
        req.getConnection(function(err,connection){
            var query = connection.query("SELECT * FROM companies ORDER BY Company_name ASC",function(err,rows){
                if(err)
                {
                    res.json({status:'fail', error:err});
                }
                else
                {
                    res.json(rows);
                }
            });
        });
    }
};