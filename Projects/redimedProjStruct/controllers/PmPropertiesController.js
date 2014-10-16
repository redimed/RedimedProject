/**
        * Created by meditech on 2014:10:14 15:51:32.
*/
var db = require('../models');
//connect-multiparty FOR UPLOAD
var path = require('path');
process.env.TMPDIR =path.join(__dirname, 'temp');
var mkdirp = require('mkdirp');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = {
    list: function(req,res){
        var rs = [];
        db.PmProperties.findAll({},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },

    findById: function(req,res){
        var id = req.body.id;
        var rs = [];
        db.PmProperties.findAll({where:{property_id:id},order:'property_id'},{raw: true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail'});
            })
    },


    edit: function(req,res){
    var f = req.body.f;
    db.PmProperties.update({
          Suburb : f.Suburb
          ,Zipcode : f.Zipcode
          ,State : f.State
          ,Country : f.Country
          ,Price : f.Price
          ,purchase_date : f.purchase_date
          ,note : f.note
          ,Cancellation_reason : f.Cancellation_reason
          ,isCancellation : f.isCancellation
          ,isInsurance : f.isInsurance
          ,Avatar_Pic_path : f.Avatar_Pic_path
          ,Created_by : f.Created_by
          ,Creation_date : f.Creation_date
          ,Last_update_date : f.Last_update_date
          ,Last_updated_by : f.Last_updated_by
          ,property_id : f.property_id
          ,Address : f.Address
   },{property_id: f.property_id})
       .success(function(){
           res.json({status:'success'});
       })
            .error(function(err){
                res.json({status:'fail'});
           });
   },

    insert: function(req,res){
        var f = req.body.f;
        db.PmProperties.create({
              Suburb : f.Suburb
              ,Zipcode : f.Zipcode
              ,State : f.State
              ,Country : f.Country
              ,Price : f.Price
              ,purchase_date : f.purchase_date
              ,note : f.note
              ,Cancellation_reason : f.Cancellation_reason
              ,isCancellation : f.isCancellation
              ,isInsurance : f.isInsurance
              ,Avatar_Pic_path : f.Avatar_Pic_path
              ,Created_by : f.Created_by
              ,Creation_date : f.Creation_date
              ,Last_update_date : f.Last_update_date
              ,Last_updated_by : f.Last_updated_by
              ,property_id : f.property_id
              ,Address : f.Address
        },['Suburb','Zipcode','State','Country','Price','purchase_date','note','Cancellation_reason','isCancellation','isInsurance','Avatar_Pic_path','Created_by','Creation_date','Last_update_date','Last_updated_by','property_id','Address']).success(function(){
            res.json({status:'success'});
        })
        .error(function(err){
            res.json({status:'fail'});
        });
    },

    upLoadFile :  function(req, resp) {
        var targetFolder='.\\redilegal\\'+req.body.property_id;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+targetFolder);
        mkdirp(targetFolder, function(err) {
            // path was created unless there was error
            //console.log(req.body);
            //console.log(req.files);
            // don't forget to delete all req.files when done

            // get the temporary location of the file
            var tmp_path = req.files.file.path;
            console.log('temp_path:'+tmp_path);
            // set where the file should actually exists - in this case it is in the "images" directory
            var target_path =targetFolder+"\\" + req.files.file.name;
            console.log('target_path:'+target_path);
            // move the file from the temporary location to the intended location
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;
                // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                fs.unlink(tmp_path, function() {
                    if (err) throw err;
                    console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes')
                    //res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
                });
            });

            console.log("GGGGGGGGGGGGGGGGGGGGG>>>>:"+req.body.isClientDownLoad);
            req.getConnection(function(err,connection) {
                var key_result=connection.query("SELECT get_pk_value('RlBookingFiles')",function(err,rows){
                    if(err)
                    {

                    }
                    else
                    {
                        var file_id=rows[0]["get_pk_value('RlBookingFiles')"]
                        var fileInfo={
                            FILE_ID:file_id,
                            BOOKING_ID:req.body.booking_id,
                            isClientDownLoad:req.body.isClientDownLoad,
                            FILE_NAME:req.files.file.name,
                            FILE_PATH:target_path
                        }

                        req.getConnection(function(err,connection){
                            var query=connection.query('insert into rl_booking_files set ?',fileInfo,function(err,rows){
                                if (err)
                                {
                                    console.log("Error inserting : %s ",err );
                                    resp.json({status:"fail"});
                                }
                                else
                                {
                                    console.log("success");
                                    resp.json({status:"success",fileInfo:fileInfo});
                                }

                            })
                        });
                    }
                });
            });
        });
    }
}


