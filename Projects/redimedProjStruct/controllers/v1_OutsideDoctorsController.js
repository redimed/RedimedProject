/**
 * Created by Minh Hikari on 11/21/2014.
 */
var outsideDoc_m =  require("../v1_models/Outside_doctors");
var common_functions = require("../functions");

module.exports = {
    getTest: function(){
        console.log('Test success');
    },

    postAdd: function(req,res){
        var userinfo = req.cookies.userInfo;
        console.log(userinfo);
        if(!userinfo){
            res.json({status:'failed'});
        }
        userinfo = JSON.parse(userinfo);
        var outdoc = req.body.outdoc;
        outdoc.creation_date = common_functions.toDateDatabase(new Date());
        outdoc.created_by = userinfo.id;
        console.log(outdoc);
        var errHandler = function (err) {
            res.json(err);
        };
        var k_sql = res.locals.k_sql;
        var insertSql = outsideDoc_m.sql_insert(outdoc);

        k_sql.exec(insertSql,function(result){
            console.log("insert conplete");
            res.json({status:'success'});
        },errHandler);
    },

    postGet: function(req,res){
        var id = req.body.outdoc.outdoc_id;
        var errHandler = function (err) {
            res.json(err);
        };
        var k_sql = res.locals.k_sql;
        var getSql = outsideDoc_m.sql_get(id,['doctor_id','provider_no','title','name','sex','address','suburb','state','phone']);
        k_sql.exec(getSql,function(result){
            console.log('get complete');
            res.json({data:result,status:'success'});
        },errHandler);
    },

    postUpdate: function(req,res){
        var userinfo = req.cookies.userInfo;
        console.log(userinfo);
        if(!userinfo){
            res.json({status:'failed'});
        }
        userinfo = JSON.parse(userinfo);
        var outdoc = req.body.outdoc;
        outdoc.last_update_date = common_functions.toDateDatabase(new Date());
        outdoc.last_updated_by = userinfo.id;
        console.log(outdoc);
        var errHandler = function (err) {
            res.json(err);
        };
        var k_sql = res.locals.k_sql;
        var updateSql = outsideDoc_m.sql_update(outdoc.doctor_id,outdoc);

        k_sql.exec(updateSql,function(result){
            console.log("update conplete");
            res.json({status:'success'});
        },errHandler);
    }
};