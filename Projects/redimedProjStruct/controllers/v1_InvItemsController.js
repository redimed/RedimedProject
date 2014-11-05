var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
    sql_get_by_dept: function (dept_id) {
        var dept_items_builder = squel.select().from('cln_dept_item_lists').where('CLINICAL_DEPT_ID = ?', dept_id)
                .field('POPULAR_HEADER_ID');

        var inv_items_builder = squel.select().from('inv_items').where('isenable = ?', 1)
                .field('ITEM_ID').field('ITEM_NAME').field('AMA_CODE').field('AMA_DESC');

        var querybuilder = squel.select().from('cln_popular_item_headers', 'item_headers');
        querybuilder.join(dept_items_builder, 'dept_item', 'item_headers.POPULAR_HEADER_ID = dept_item.POPULAR_HEADER_ID')
        querybuilder.join('cln_popular_item_lines', null, 'cln_popular_item_lines.POPULAR_HEADER_ID = item_headers.POPULAR_HEADER_ID')
        querybuilder.join(inv_items_builder, 'inv_items', 'cln_popular_item_lines.ITEM_ID = inv_items.ITEM_ID')

        querybuilder.field('inv_items.ITEM_ID', 'ITEM_ID')
                .field('ITEM_NAME').field('AMA_CODE').field('AMA_DESC')
                .field('item_headers.POPULAR_HEADER_ID').field('POPULAR_NAME');

        return querybuilder.toString();
    },
    sql_get_by_appt: function (appt_id) {
        var query_builder = squel.select().from('inv_items').where('cal_id = ?', appt_id);
        query_builder.join('cln_appt_items', 'appt_items', 'appt_items.CLN_ITEM_ID = inv_items.ITEM_ID');
        query_builder.field('ITEM_ID').field('ITEM_NAME').field('AMA_CODE').field('AMA_DESC').field('QUANTITY');
        return query_builder.toString();
    },
    // INSERT HEADER
    sql_get_header_id: function () {
        var max_builder = squel.select().field('MAX(POPULAR_HEADER_ID)+1').from('cln_popular_item_headers');
        return max_builder.toString();
    },
    sql_insert_header_item: function (data, header_id) {
        var query_builder = squel.insert().into('cln_popular_item_headers');

        query_builder.set('POPULAR_HEADER_ID', header_id);
        for (var key in data) {
            query_builder.set(key, data[key]);
        }
        return query_builder.toString();
    },
    sql_insert_dept_header: function (dept_id, header_id) {
        var query_builder = squel.insert().into('cln_dept_item_lists');
        query_builder.set('CLINICAL_DEPT_ID', dept_id);
        query_builder.set('POPULAR_HEADER_ID', header_id);
        return query_builder.toString();
    },
    // END INSERT HEADER
    // 
    // INSERT ITEM 
    sql_get_item_id: function () {
        var max_builder = squel.select().field('MAX(ITEM_ID)+1').from('inv_items');
        return max_builder.toString();
    },
    sql_insert_item: function (item_id, data) {
        var query_builder = squel.insert().into('inv_items');

        query_builder.set('ITEM_ID', item_id);
        for (var key in data) {
            query_builder.set(key, data[key]);
        }
        return query_builder.toString();
    },
    sql_insert_item_line: function (header_id, item_id) {
        var max_builder = squel.select().field('MAX(POPULAR_LINE_ID)+1').from('cln_popular_item_headers');

        var query_builder = squel.insert().into('cln_popular_item_lines');
        query_builder.set('ISENABLE', 1);
        query_builder.set('POPULAR_LINE_ID', max_builder);
        query_builder.set('POPULAR_HEADER_ID', header_id);
        query_builder.set('ITEM_ID', item_id);
        return query_builder.toString();
    }
    // END INSERT ITEM
}

module.exports = {
    getListByDept: function (req, res) {
        var dept_id = req.query.dept_id;
        var sql = model_sql.sql_get_by_dept(dept_id);
        var k_sql = res.locals.k_sql;

        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
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
    getInsertHeader: function (req, res) {
        var data = req.body.data;

        // DEPT ID 
        var dept_id = req.body.dept_id;

        //INSERT HEADER FIRST 
        // INSERT DEPT HEADER


        // EXECUTE QUERY 
        var sql = model_sql.sql_insert_item(data);
        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
    getInsertItem: function (req, res) {
        var data = req.body.data;
        // HEADER ITEM ID 
        var h_item = req.body.h_item;

        // DEPT ID 
        var dept_id = req.body.dept_id;


        // EXECUTE QUERY 
        var sql = model_sql.sql_insert_item(data);
        var k_sql = res.locals.k_sql;
        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });
    },
}