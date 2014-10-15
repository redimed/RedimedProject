/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var db = require('../models');
module.exports =
{
    list:function(req,res)
    {
        req.getConnection(function(err,connection)
        {

            var query = connection.query(
                'SELECT d.*,s.Specialties_id FROM doctors d LEFT JOIN  doctor_specialities s ON d.`doctor_id`=s.`doctor_id`'
                ,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                    }
                    res.json(rows);
                });
        });
    },
    getDoctorOfSpeciality:function(req,res)
    {
        var Specialties_id=req.query.Specialties_id;
        req.getConnection(function(err,connection)
        {

            var query = connection.query(
                'SELECT d.* FROM doctors d INNER JOIN  doctor_specialities s ON d.`doctor_id`=s.`doctor_id` WHERE s.Specialties_id=?'
                ,Specialties_id,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'})
                    }
                    else
                    {
                        res.json({status:'success',data:rows})
                    }

                });
        });
    },

    getDoctorInfoByUserId:function(req,res)
    {
        var userId=req.query.userId;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>"+userId);
        req.getConnection(function(err,connection)
        {

            var query = connection.query(
                ' SELECT doctor.doctor_id FROM `doctors` doctor WHERE doctor.`User_id`=? '
                ,userId,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'})
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
