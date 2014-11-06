/**
 * Created by meditech on 11/6/2014.
 */
var db = require('../models');
module.exports =
{
    getListNotification: function (req, res) {
        var sql = 'select * from `sys_user_notifications`';
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    res.json({status:'fail'})
                }
                else
                {
                    if(rows.length>0)
                        res.json({status:'success',data:rows});
                    else
                        res.json({status:'fail'})
                }
            });
        });
    }
}

