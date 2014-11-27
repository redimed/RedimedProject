var squel = require("squel");
squel.useFlavour('mysql');

function travelArr(data, callback) {
    for (var i = data.length - 1; i >= 0; --i) {
        callback(data[i]);
    }
}

function travelObj(data, callback) {
    for (var key in data) {
        callback(key, data[key]);
    }
}

function K_MODEL(table, primary_key) {
    var _this = this;
    this._table = table;
    this._primary_key = primary_key;
    this._squel = squel;
    this._callback = {search: null};

    this._default_values = {};

    /*
     *  ADD ON FOR SQUEL
     */

    this.addFields = function (builder, fields) {
        if (!fields)
            return;

        if (typeof fields === 'string') {
            var fields = fields.split(',');
        }
        // ARRAY 
        if (Array.isArray(fields) && fields.length > 0) {
            for (var i = 0, len = fields.length; i < len; ++i)
                builder.field(fields[i]);
        } else { // OBJECT
            builder.fields(fields);
        }
    };

    this.addWhereIn = function (builder, key, value) {
        builder.where('`' + key + '` IN ?', value);
    };


    /**
     *  PRIVATE FUNCTION
     */
    var getUpdateQuery = function (rows) {
        var str = 'UPDATE `' + _this._table + '` SET';

        var primary_keys = [];

        // GET ALL PRIMARY KEY
        travelArr(rows, function (row) {
            primary_keys.push(row[_this._primary_key]);
        });

        var first_row = rows[0];

        travelObj(first_row, function (key, value) {
            if (key.toLowerCase() != _this._primary_key.toLowerCase()) {
                str += ' `' + key + '` = CASE ' + _this._primary_key;
                travelArr(rows, function (row) {
                    str += " WHEN '" + row[_this._primary_key] + "' THEN '" + row[key] + "'";
                });
                str += ' END,';
            }
        });
        str = str.substring(0, str.length - 1);
        str += " WHERE " + _this._primary_key + " IN ('" + primary_keys.join("','") + "')";
        return str;
    };

    /*
     * SEARCH
     */

    this.query_search_base = function () {
        var querybuilder = squel.select().from(this._table);
        if (this._callback.search)
            this._callback.search.call(null, querybuilder);
        return querybuilder;
    };

    this.query_search_data = function (limit, offset, fields) {
        var querybuilder = this.query_search_base();
        querybuilder.limit(limit).offset(offset);
        this.addFields(querybuilder, fields);
        return querybuilder;
    };

    this.query_search_count = function () {
        var querybuilder = this.query_search_base();
        querybuilder.field('COUNT(1)', 'count');
        return querybuilder;
    };


    /**
     *	SELECT
     */
    this.query_get_base = function (fields) {
        var querybuilder = squel.select().from(this._table);
        this.addFields(querybuilder, fields);
        return querybuilder;
    };

    this.query_get_all = function (fields) {
        return this.query_get_base();
    };

    this.query_get_by = function (key, value, fields) {
        var querybuilder = this.query_get_base(fields);
        querybuilder.where('`' + key + '` = ?', value);
        return querybuilder;
    }

    this.query_get = function (id, fields) {
        var querybuilder = this.query_get_base(fields);
        querybuilder.where(this._table + '.`' + this._primary_key + '` = ?', id);
        return querybuilder;
    };

    this.query_get_in = function (arr_id, fields) {
        var querybuilder = this.query_get_base(fields);
        this.addWhereIn(querybuilder, this._primary_key, arr_id);
        return querybuilder;
    };

    /**
     *	INSERT FUNCTION 
     */

    this.query_insert = function (data) {
        var querybuilder = squel.insert().into(this._table);
        querybuilder.setFields(this._default_values)
        querybuilder.setFields(data);
        return querybuilder;
    };

    // data is an array 
    this.query_insert_batch = function (data) {
        var querybuilder = squel.insert().into(this._table);
        querybuilder.setFieldsRows(data);
        return querybuilder;
    };

    /**
     *	UPDATE FUNCTION 
     */


    this.query_update = function (id, data) {
        var querybuilder = squel.update().table(this._table);
        querybuilder.where('`' + this._primary_key + '` = ?', id);
        querybuilder.setFields(data);
        return querybuilder;
    };

    this.query_update_by = function (key, value, data) {
        var querybuilder = squel.update().table(this._table);
        querybuilder.where('`' + key + '` = ?', value);
        querybuilder.setFields(data);
        return querybuilder;
    };

    /**
     *	DELETE FUNCTION 
     */

    this.query_delete_base = function () {
        return squel.delete().from(this._table);
    }

    this.query_delete = function (id) {
        var querybuilder = this.query_delete_base();
        querybuilder.where('`' + this._primary_key + '` = ?', id);
        return querybuilder;
    };

    this.query_delete_in = function (arr_id) {
        var querybuilder = this.query_delete_base();
        this.addWhereIn(querybuilder, this._primary_key, arr_id);
        return querybuilder;
    };

    /////////////////////////////////////////
    ////////	SQL HERE 
    /////////////////////////////////////////

    this.sql_search_data = function (limit, offset, fields) {
        return this.query_search_data(limit, offset, fields).toString();
    };
    this.sql_search_count = function () {
        return this.query_search_count().toString();
    };
    this.sql_get = function (id, fields) {
        return this.query_get(id, fields).toString();
    };

    this.sql_get_by = function (key, value, fields) {
        return this.query_get_by(key, value, fields).toString();
    };

    this.sql_get_in = function (arr_id, fields) {
        return this.query_get_in(arr_id, fields).toString();
    };

    this.sql_get_all = function (fields) {
        return this.query_get_all(fields).toString();
    };

    this.sql_insert = function (data) {
        return this.query_insert(data).toString();
    };

    this.sql_insert_batch = function (data) {
        return this.query_insert_batch(data).toString();
    };

    this.sql_update = function (id, data) {
        return this.query_update(id, data).toString();
    };

    this.sql_update_by = function (key, value, data) {
        return this.query_update_by(key, value, data).toString();
    };

    this.sql_update_batch = function (data) {
        return getUpdateQuery(data);
    };

    this.sql_delete = function (id) {
        return this.query_delete(id).toString();
    };

    this.sql_delete_in = function (arr_id) {
        return this.query_delete_in(arr_id).toString();
    };


}

module.exports = K_MODEL;
