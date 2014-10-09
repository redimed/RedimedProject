/**
 * Created by meditech on 8/29/2014.
 */

/**
 * author: tannv.dts@gmail.com
 * get list doctors dependence req.query.Specialties_id
 *
 */
function list(req, res)
{
    req.getConnection(function(err,connection)
    {

        var query = connection.query(
            'SELECT d.*,s.Specialties_id FROM doctors d INNER JOIN  doctor_specialities s ON d.`doctor_id`=s.`doctor_id`'
            ,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                }
                res.json(rows);
            });
    });
}

function getDoctorOfSpeciality(req, res)
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
            }
            res.json(rows);
        });
    });
};

exports.list=list;
exports.getDoctorOfSpeciality=getDoctorOfSpeciality;