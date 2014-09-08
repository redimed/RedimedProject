/**
 * Created by meditech on 9/3/2014.
 */
function add(req,res)
{
    var input = req.body;
    req.getConnection(function(err,connection){
        var query=connection.query('insert into rl_bookings set ?',input,function(err,rows){
            if (err)
            {
                console.log("Error inserting : %s ",err );
                res.json({status:"fail"});
            }
            else
            {
                console.log("success");
                res.json({status:"success"});
            }

        })
    });
}

function getNewKey(req,res)
{
    req.getConnection(function(err,connection) {
        var key_result=connection.query("SELECT get_pk_value('RlBookings')",function(err,rows){
            if(err)
            {
                res.json({status:"fail"});
            }
            else
            {
                res.json({key:rows[0]["get_pk_value('RlBookings')"]});
            }
        });
    });
}

function list(req,res)
{
    req.getConnection(function(err,connection) {

//        var key_result=connection.query("SELECT * from rl_bookings",function(err,rows){
        var key_result=connection.query("SELECT b.*,t.`Rl_TYPE_NAME`,d.`NAME` FROM `rl_bookings` b INNER JOIN `rl_types` t ON b.`RL_TYPE_ID`=t.`RL_TYPE_ID` INNER JOIN `doctors` d ON b.`DOCTOR_ID`=d.`doctor_id`",function(err,rows){
            if(err)
            {
                res.json({status:"fail"});
            }
            else
            {
                console.log("asdas");
                res.json(rows);

            }
        });
    });
}

exports.getNewKey=getNewKey;
exports.add=add;
exports.list=list;