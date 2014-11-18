/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */
var db = require('../models');
module.exports =
{
    list:function(req,res){
        var sourceType=req.query.sourceType?req.query.sourceType:'%';
        var sql=
            " SELECT spec.*                                                                                     "+
            " FROM `cln_specialties` spec INNER JOIN `rl_types` rltype ON spec.`RL_TYPE_ID`=rltype.`RL_TYPE_ID` "+
            " WHERE rltype.`SOURCE_TYPE` like ?                                                                      ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[sourceType],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows})
                }

            });
        });
    },

    filterByType:function(req,res)
    {
        var RL_TYPE_ID=req.query.RL_TYPE_ID;
        req.getConnection(function(err,connection)
        {

            var query = connection.query('SELECT * FROM cln_specialties where RL_TYPE_ID=?',RL_TYPE_ID,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows})
                }

            });
        });
    },

    getSpecialityById:function(req,res)
    {
        var specialityId=req.query.specialityId;
        var sql="SELECT spec.* FROM `cln_specialties` spec WHERE spec.`Specialties_id`=?";
        req.getConnection(function(err,connection)
        {

            var query = connection.query(sql,specialityId,function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                        res.json({status:'success',data:rows[0]});
                    else
                        res.json({status:'fail'});
                }

            });
        });
    }
}