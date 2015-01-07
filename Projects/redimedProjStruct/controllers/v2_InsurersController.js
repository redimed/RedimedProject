var ClnInsurersModel = require('../v1_models/Cln_insurers');
module.exports = {
    getDetail: function(req, res) {
        var id = req.query.id;
        if(!id) {
            res.end();
            return; 
        }
        var sql = ClnInsurersModel.sql_get(id);
        var k_sql = req.k_sql;
        k_sql.exec_row( sql, function(data){
            res.json({status: 'success', row: data});
        }, function(err) {
            res.json({status: 'error'});
        });
    },
    postGetAll : function (req, res) {
        var fields = req.body.fields;

        var sql = ClnInsurersModel.sql_get_all(fields);
        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {
            res.json({status: 'success', list: data});
    }, function(err) {
            res.json({status: 'error'});
        });
    }, 
    postInsert: function(req, res) {
        var data = req.body.data;
        if(!data) {
            res.end();
            return; 
        }

        var sql = ClnInsurersModel.sql_insert(data);
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            res.json({status: 'success', data: data});
        }, function(err) {
            res.json({status: 'error'});
        });
    },
    postUpdate: function(req, res) {
        var id = req.body.id;
        var data = req.body.data;
        if(!id || !data) {
            res.end();
            return; 
        }

        var sql = ClnInsurersModel.sql_update(id, data);
        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {
            res.json({status: 'success', data: data});
        }, function(err) {
            res.json({status: 'error'});
        });
    },
    postDelete: function(req, res) {
        var id = req.body.id;

        if(!id) {
            res.end();
            return; 
        }

        var sql = ClnInsurersModel.sql_delete(id);
        var k_sql = req.k_sql;
        k_sql.exec( function(data){
            res.json({status: 'success', data: data});
        }, function(err) {
            res.json({status: 'error'});
        });
    },

    postSearch: function(req, res){
        var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var fields = req.body.fields;

        var search_data = req.body.search;

        if(search_data) {
            ClnInsurersModel._callback.search = function(query_builder){
 
            };
        }

        var sql_count = ClnInsurersModel.sql_search_count();
        var sql_data = ClnInsurersModel.sql_search_data(limit, offset, fields);

        var k_sql = req.k_sql;
        var result = null;
        k_sql.exec(sql_data).then(function(data){
            result = data;
            return k_sql.exec_row(sql_count);
        }).then(function(row){
            res.json({list: result, count: row.count});
        }).catch(function(err){
            console.log(err);
        })
    },
}