var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
    sql_get_by_dept: function (dept_id, isenable) {
        var dept_items_builder = squel.select().from('cln_dept_item_lists')
                .where('CLINICAL_DEPT_ID = ?', dept_id)
                .field('POPULAR_HEADER_ID');

        var inv_items_builder = squel.select().from('inv_items')
                .field('ITEM_ID').field('ITEM_CODE').field('ITEM_NAME').field('AMA_CODE').field('AMA_DESC').field('isenable');

        if(isenable == 1){
            inv_items_builder.where('isenable = ?', 1);
        }
        var querybuilder = squel.select().from('cln_popular_item_headers', 'item_headers');
        if(isenable == 1){
            querybuilder.where('item_headers.isenable = ?', 1);
        }

        querybuilder.join(dept_items_builder, 'dept_item', 'item_headers.POPULAR_HEADER_ID = dept_item.POPULAR_HEADER_ID')
        querybuilder.join('cln_popular_item_lines', null, 'cln_popular_item_lines.POPULAR_HEADER_ID = item_headers.POPULAR_HEADER_ID')
        querybuilder.join(inv_items_builder, 'inv_items', 'cln_popular_item_lines.ITEM_ID = inv_items.ITEM_ID')

        querybuilder.field('inv_items.ITEM_ID', 'ITEM_ID')
                .field('inv_items.isenable', 'ISENABLE')
                .field('ITEM_NAME').field('AMA_CODE').field('AMA_DESC').field('ITEM_CODE')
                .field('item_headers.POPULAR_HEADER_ID').field('POPULAR_NAME');

        return querybuilder.toString();
    },
    sql_get_by_appt: function (appt_id) {
        var query_builder = squel.select().from('inv_items').where('cal_id = ?', appt_id);
        query_builder.join('cln_appt_items', 'appt_items', 'appt_items.CLN_ITEM_ID = inv_items.ITEM_ID');
        query_builder.field('ITEM_CODE').field('ITEM_ID').field('ITEM_NAME').field('AMA_CODE').field('AMA_DESC').field('QUANTITY');
        return query_builder.toString();
    },
    // CRUD HEADER
    sql_get_header: function(dept_id){
        var dept_items_builder = squel.select().from('cln_dept_item_lists')
                .where('CLINICAL_DEPT_ID = ?', dept_id)
                .field('POPULAR_HEADER_ID');

        var querybuilder = squel.select().from('cln_popular_item_headers', 'item_headers');
        querybuilder.join(dept_items_builder, 'dept_item', 'item_headers.POPULAR_HEADER_ID = dept_item.POPULAR_HEADER_ID');
        querybuilder.field('item_headers.POPULAR_HEADER_ID', 'POPULAR_HEADER_ID');
        querybuilder.field('POPULAR_CODE');
        querybuilder.field('POPULAR_NAME');
        querybuilder.field('ISENABLE');
        return querybuilder.toString();
    },
    sql_insert_header: function (data) {
        var query_builder = squel.insert().into('cln_popular_item_headers');
        query_builder.set('Creation_date', 'NOW()', {dontQuote: true});
        for (var key in data) {
            query_builder.set(key, data[key]);
        }
        return query_builder.toString();
    },
    sql_insert_dept_header: function (dept_id, header_id) {
        var query_builder = squel.insert().into('cln_dept_item_lists');
        query_builder.set('CLINICAL_DEPT_ID', dept_id);
        query_builder.set('POPULAR_HEADER_ID', header_id);
        query_builder.set('Creation_date', 'NOW()', {dontQuote: true});
        return query_builder.toString();
    },
    sql_delete_header: function(header_id){
        var query_select_item = squel.select().from('cln_popular_item_lines').where('POPULAR_HEADER_ID = ?', header_id).limit(1).field('POPULAR_LINE_ID');
        var query_builder = squel.delete().from('cln_popular_item_headers');
        query_builder.where('POPULAR_HEADER_ID = ?', header_id);
        query_builder.where('NOT EXISTS ?', query_select_item);
        return query_builder.toString();
    },
    sql_delete_dept_header: function(dept_id, header_id){
        var query_builder = squel.delete().from('cln_dept_item_lists');
        query_builder.where('POPULAR_HEADER_ID = ?', header_id);
        query_builder.where('CLINICAL_DEPT_ID = ?', dept_id);
        return query_builder.toString();
    },
    sql_update_header: function (header_id, data) {
        var query_builder = squel.update().table('cln_popular_item_headers').where('POPULAR_HEADER_ID = ?', header_id);
        query_builder.set('Last_update_date', 'NOW()', {dontQuote: true});
        for (var key in data) {
            query_builder.set(key, data[key]);
        }
        return query_builder.toString();
    },
    // END CRUD HEADER
    // 
    // POPULAR ITEM 
    sql_insert_item: function (data) {
        var query_builder = squel.insert().into('inv_items');
        
        query_builder.set('ISENABLE', 1);
        for (var key in data) {
            query_builder.set(key, data[key]);
        }
        return query_builder.toString();
    },
    sql_insert_item_line: function (header_id, item_id) {
      //  var max_builder = squel.select().field('MAX(POPULAR_LINE_ID)+1').from('cln_popular_item_headers');

        var query_builder = squel.insert().into('cln_popular_item_lines');
        query_builder.set('ISENABLE', 1);
       // query_builder.set('POPULAR_LINE_ID', max_builder);
        query_builder.set('POPULAR_HEADER_ID', header_id);
        query_builder.set('ITEM_ID', item_id);
        return query_builder.toString();
    },

    squel_search_item: function(code, name, type){
        var querybuilder = squel.select().from('inv_items');
        if(code)
            querybuilder.where("ITEM_CODE LIKE ?", code + '%');
        if(name)
            querybuilder.where("ITEM_NAME LIKE ?", '%' + name + '%');
        if(type)
            querybuilder.where("ITEM_TYPE = ?", type);
        return querybuilder;
    },
    sql_search_item: function(limit, offset, code, name, type){
        var querybuilder = this.squel_search_item(code, name, type);
        querybuilder.limit(limit).offset(offset);
        querybuilder.field('ITEM_ID').field('ITEM_NAME').field('ITEM_CODE').field('ITEM_TYPE');

        return querybuilder.toString();
    },
    sql_search_item_count: function(code, name, type) {
        var querybuilder = this.squel_search_item(code, name, type);
        querybuilder.field('COUNT(1)', 'count');
        return querybuilder.toString();
    }

    // END POPULAR ITEM
}

module.exports = {
    getSearch: function(req, res){
        var limit = (req.query.limit) ? req.query.limit : 10;
        var offset = (req.query.offset) ? req.query.offset : 0;

        var name = req.query.k, type = req.query.type, code = req.query.code;

        var sql = model_sql.sql_search_item(limit, offset, code, name, type);

        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {

            var sql = model_sql.sql_search_item_count(code, name, type);
            k_sql.exec_row(sql, function (row) {
                res.json({list: data, count: row.count});
            }, function (err) {
                res.json(err);
            });
        }, function (err) {
            res.json(err);
        });
    },
    getListByDept: function (req, res) {
        var dept_id = req.query.dept_id;
        var isenable = req.query.isenable ;
        console.log('isenable ', isenable);

        var sql = model_sql.sql_get_by_dept(dept_id, isenable);
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    /*
    USE APPOINTMENT CONTROLLER INSTEAD
    getListByAppt: function (req, res) {
        var appt_id = req.query.appt_id;
        var sql = model_sql.sql_get_by_appt(appt_id);
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    */
    /*
    *   HEADER OPERATION 
    */

 
    postInsert: function (req, res) {
        var data = req.body.data;
        var h_item = req.body.h_item;

          if(!h_item && !data) {
            res.end();
            return;
        }
          var errHandler = function (err) {
            res.json(err);
        };

        //INSERT ITEM FIRST 
        var sql = model_sql.sql_insert_item(data);
        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (result) {
            console.log('JUST INSERT ITEM ID', result.insertId)
            var item_id = result.insertId;
            // INSERT ITEM HEADER

            var sql = model_sql.sql_insert_item_line(h_item, item_id);
            k_sql.exec(sql, function(data2){
                res.json({status: 'success'});       
            }, errHandler);
        }, errHandler);
    },
    /*
    *   HEADER OPERATION 
    */
    getGetHeaderByDept: function(req, res) {
        var dept_id = req.query.dept_id;
        if(!dept_id) {
            res.end();
            return;
        }

        var sql = model_sql.sql_get_header(dept_id);
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    postInsertHeader: function (req, res) {
        var data = req.body.data;
        var dept_id = req.body.dept_id;

        if(!dept_id && !data) {
            res.end();
            return;
        }

        var errHandler = function (err) {
            res.json(err);
        };

        //INSERT HEADER FIRST 
        var sql = model_sql.sql_insert_header(data);
        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (result) {
            // INSERT DEPT HEADER
            var header_id = result.insertId;
            var sql = model_sql.sql_insert_dept_header(dept_id, header_id);

            k_sql.exec(sql, function(data){
                res.json({header_id: header_id, status: 'success'});       
            }, errHandler);
        }, errHandler);
    },
    postDeleteHeader: function(req, res) {
        var header_id = req.body.header_id;
        var dept_id = req.body.dept_id; 

        if(!dept_id && !header_id) {
            res.end();
            return;
        }

        var sql = model_sql.sql_delete_header(header_id);
        var k_sql = res.locals.k_sql;

        var errHandler = function (err) {
            res.json({status: 'success', message: 'Fatal Error', err: err});
        };
     
        k_sql.exec(sql, function (data) {
            var sql = model_sql.sql_delete_dept_header(dept_id, header_id);
            if(data.affectedRows == 0) {
                 res.json({status: 'error', message: 'Cannot delete this category !!!'});
                return;
            }

            k_sql.exec(sql, function (data2) {
                res.json({status: 'success'});
            }, errHandler);
        }, errHandler);
    },
    postUpdateHeader: function (req, res) {
        var header = req.body.data;
        if(!header) {
            res.end();
            return;
        }

        var header_id = header.POPULAR_HEADER_ID;
        delete header.POPULAR_HEADER_ID;
        var errHandler = function (err) {
            res.json(err);
        };

        var sql = model_sql.sql_update_header(header_id, header);
        var k_sql = res.locals.k_sql;
        
        k_sql.exec(sql, function (result) {
            res.json({header_id: header_id, status: 'success'});       
        }, errHandler);
    },
}
