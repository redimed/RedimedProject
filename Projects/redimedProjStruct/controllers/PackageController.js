/**
 * Created by meditech on 27/09/2014.
 */
var db = require('../models');

module.exports = {
    packageAssById: function(req,res){
        var packId = req.body.id;

        db.sequelize.query('SELECT p.pack_id, p.ass_id, p.ass_name, a.HEADER_ID, IFNULL(a.period,1) AS period, h.ass_name AS HeaderName FROM `packages_assessments` p INNER JOIN assessments a ON p.`ass_id` = a.`id` LEFT JOIN assessment_headers h ON a.HEADER_ID = h.id WHERE p.pack_id = ?',null,{raw:true},[packId])
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    },
    packageAss: function(req,res){
        db.sequelize.query('SELECT p.*, IFNULL(a.`price`,0) as price FROM packages_assessments p LEFT JOIN assessments a ON a.`id` = p.`ass_id`')
            .success(function(data){
                res.json({status:'success',rs:data});
            })
            .error(function(err){
                res.json({status:'error',err:err});
            })
    },
    insertPackage: function(req,res){
        var packName = req.body.name;
        var comId = req.body.comId;
        db.sequelize.query('INSERT INTO packages(package_name,company_id) VALUES(?,?)',null,{raw:true},[packName,comId])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
            })
    },
    updateAss: function(req,res){
        var oldId = req.body.oldId;
        var newId = req.body.newId;
        var packId = req.body.packId;

        db.sequelize.query('SELECT ass_name FROM assessments WHERE id=?',null,{raw:true},[newId])
            .success(function(data){
                db.sequelize.query('UPDATE packages_assessments SET ass_id = ?, ass_name=? WHERE pack_id = ? AND ass_id = ?',null,{raw:true},[newId,data[0].ass_name,packId,oldId])
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })
            })


    },
    updatePackageFee: function(req,res){
    db.sequelize.query("SELECT * FROM packages",null,{raw:true})
        .success(function(data){
            for(var i=0; i<data.length; i++)
            {
                db.sequelize.query("update packages p set p.fee = (select sum(ifnull(a.price,0)) from assessments as a where a.id in (select pa.ass_id  from packages_assessments as pa where pa.pack_id = ?)) where p.id = ?",null,{raw:true},
                    [data[i].id,data[i].id])
                    .success(function(){
                        console.log('success');
                    })
                    .error(function(err){
                        console.log(err);
                    })
            }
            res.json({status:'success'});
        })
        .error(function(err){
            res.json({status:'error'});
            console.log(err);
        })
},
    deleteAss: function(req,res){
        var id = req.body.id;
        var packId = req.body.packId;
        db.sequelize.query('DELETE FROM packages_assessments WHERE pack_id=? AND ass_id=?',null,{raw:true},[packId,id])
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    insertAss: function(req,res){
        var id = req.body.id;
        var packId = req.body.packId;
        db.sequelize.query('SELECT ass_name FROM assessments WHERE id=?',null,{raw:true},[id])
            .success(function(data){
                db.sequelize.query('INSERT INTO packages_assessments(pack_id,ass_id,ass_name) VALUES(?,?,?)',null,{raw:true},[packId,id,data[0].ass_name])
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })
            })

    },
    customPackAss: function(req,res){
        var assId = req.body.id;


        db.sequelize.query("SELECT a.HEADER_ID, h.ass_name AS HeaderName, a.id AS ass_id, a.ass_name " +
                        "FROM assessments a LEFT JOIN assessment_headers h ON a.HEADER_ID = h.id  " +
                        "WHERE a.id IN (?)",null,{raw:true}, [assId])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })

    }
}
