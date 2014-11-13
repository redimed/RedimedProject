var squel = require("squel");

function K_SQL(req, res) {
    var _this = this;
    var init = function () {
        squel.useFlavour('mysql');
        console.log('INITILIZATION');
        _this.expr = squel.expr();
    }

    this.table = function (table) {
        this.tbl = table;
        return this;
    }

    this.key = function (key) {
        this._key = key;
        return this;
    }

    /**
     * FUNCTION HELPER
     */

    var _where_and = function (sql, value) {
        if (typeof value == 'undefined')
            _this.expr.and_begin().and(sql).end();
        else
            _this.expr.and_begin().and(sql, value).end();
    }
    var _where_or = function (sql, value) {
        if (typeof value == 'undefined')
            _this.expr.or_begin().or(sql).end();
        else
            _this.expr.or_begin().or(sql, value).end();
    }

    var _prefix_like = function (value, opt) {
        switch (opt) {
            case 'before':
                value = "%" + value;
                break;
            case 'after':
                value = value + '%';
                break;
            case 'both':
            default:
                value = "%" + value + "%";
        }
        return value;
    }


    /**
     * END FUNCTION
     */

    this.fields = function (flds) {
        if (typeof flds == 'string') {
            var flds = flds.split(',');
        }
        if (typeof flds == 'object') {
            if (Array.isArray(flds) && flds.length > 0) {
                for (var i = 0, len = flds.length; i < len; ++i)
                    this.query.field(flds[i]);
            } else {
                this.query.fields(flds);
            }
        }
        return this;
    }

    this.limit = function (num) {
        this.query.limit(num);
        return this;
    }

    this.offset = function (num) {
        this.query.offset(num);
        return this;
    }

    this.order = function (field, type) {
        switch (type) {
            case 'rand':
                
                break;
            case 'desc':
            case false:
            case 0:
                this.query.order(field, false);
                break;
            case 'asc':
            case 1:
            case true:
            default:
                this.query.order(field, true);
                break;
        }

        return this;
    }

    this.distinct = function () {
        this.query.distinct();
        return this;
    }

    /**
     * WHERE QUERY 
     */


    // values = [value, value2]
    this.where_in = function (field, values) {
        var sql = field + ' IN (' + values.join(',') + ')';
        _where_and(sql);
        return this;
    }

    this.where_not_in = function (field, values) {
        var sql = field + ' NOT IN (' + values.join(',') + ')';
        _where_and(sql);
        return this;
    }

    this.or_where_not_in = function (field, values) {
        var sql = field + ' NOT IN (' + values.join(',') + ')';
        _where_or(sql);
        return this;
    }

    // field = custom string
    this.where = function (field, value) {
        if (typeof value == 'undefined')
            _where_and(field);
        else
            _where_and(field + ' = ?', value);
        return this;
    }

    this.or_where = function (field, value) {
        if (typeof value == 'undefined')
            _where_or(field);
        else
            _where_or(field + ' = ?', value);
        return this;
    }

    // opt = 'before' or 'after' or 'both'
    this.or_like = function (field, value, opt) {
        value = _prefix_like(value, opt);
        _where_or(field + ' LIKE ?', value);
        return this;
    }

    this.like = function (field, value, opt) {
        value = _prefix_like(value, opt);
        _where_and(field + ' LIKE ?', value);
        return this;
    }

    this.not_like = function (field, value, opt) {
        value = _prefix_like(value, opt);
        _where_and(field + ' NOT LIKE ?', value);
        return this;
    }

    this.or_not_like = function (field, value, opt) {
        value = _prefix_like(value, opt);
        _where_or(field + ' NOT LIKE ?', value);
        return this;
    }

    /**
     * DELETE 
     */
    this.delete = function (key_value) {
        this.query = squel.delete().from(this.tbl);
        this.where(this._key, key_value);
        return this;
    }
    this.delete_by = function (field, value) {
        this.query = squel.insert().into(this.tbl);
        this.where(field, value);
        return this;
    }

    /**
     * INSERT QUERY 
     */

    this.set = function (field, data, opt) {
        if (opt)
            this.query.set(field, data, opt);
        else
            this.query.set(field, data);
        return this;
    }

    // data = {field1 : data1, field2 : data2}
    this.insert = function (data) {
        this._insert_mode = true;
        this.query = squel.insert().into(this.tbl);
        if (data)
            this.query.setFields(data);
        return this;
    }

    // data = [{field1 : data1, field2 : data2}, {field1 : data1, field2 : data2}]
    this.insert_batch = function (data) {
        this._insert_mode = true;
        this.query = squel.insert()
                .into(this.tbl)
                .setFieldsRows(data);
        return this;
    }

    /**
     * UPDATE QUERY 
     */
    this.update = function (key_value, data) {

        this.query = squel.update().table(this.tbl);
        if (typeof key_value === 'object') { // need call where after
            this.query.setFields(key_value);
        } else {
            this.where(this._key, key_value);
            this.query.setFields(data);
        }
        return this;
    }

    /**
     * SELECT QUERY 
     */
    this.get_all = function () {
        this.query = squel.select().from(this.tbl);
        return this;
    }

    this.get_by = function (field, value) {
        this.query = squel.select().from(this.tbl);
        this.where(field, value);
        return this;
    }

    this.get = function (key_value) {
        if(!key_value)
            return this.get_all();
        this.query = squel.select().from(this.tbl);
        this.where(this._key, key_value)
        return this;
    }
    /**
     * EXECUTE JOIN - REQUIRED SELECT
     */

    this.join = function (table, condition) {
        this.query.join(table, null, condition);
        return this;
    }

    this.left_join = function (table, condition) {
        this.query.left_join(table, null, condition);
        return this;
    }
    this.outer_join = function (table, condition) {
        this.query.outer_join(table, null, condition);
        return this;
    }

    /**
     * EXECUTE QUERY 
     */

    this.toSQL = function () {
//        console.log(this.expr);
        var expr = this.expr;
        if (!this._insert_mode)
            this.query.where(expr);
        var sql = this.query.toString();

        this.expr = squel.expr();
        this._insert_mode = false;
        return sql;
    }

    this.execQuery = function(sql, fnSuc, fnErr){
    	this.connection.query(sql, function (err, data) {
            if (err) {
                console.error('DB SQL: ', err)
                if (fnErr)
                    fnErr(err);
                return;
            }
            if (fnSuc) {
                fnSuc(data);
            }
        });
    }
    
    
    this.execQueryRow = function(sql, fnSuc, fnErr){
    	this.connection.query(sql, function (err, data) {
            if (err) {
                console.error('DB SQL: ', err)
                if (fnErr)
                    fnErr(err);
                return;
            }
            if (fnSuc) {
	    	if(data.length > 0)
                   fnSuc(data[0]);
		else 
		   fnSuc(null);
            }
        });
    }

    this.exec = function (sql, fnSuc, fnErr) {
        console.log("\n Exec SQL: " + sql)
        if (!this.connection) {
            req.getConnection(function (error, connection) {
                _this.connection = connection;     
		_this.execQuery(sql, fnSuc, fnErr);           
            });
        } else {
		_this.execQuery(sql, fnSuc, fnErr);   
	}
	
    }

    this.exec_row = function (sql, fnSuc, fnErr) {
        console.log("\n Exec SQL Row: " + sql)
        if (!this.connection) {
            req.getConnection(function (error, connection) {
                _this.connection = connection;     
		_this.execQueryRow(sql, fnSuc, fnErr);           
            });
        } else {
		_this.execQueryRow(sql, fnSuc, fnErr);   
	}
    }

    this.new = function () {
        return new K_SQL(req, res);
    }

    this.squel = function () {
        return squel;
    }

    init();
    return this;
}

module.exports = K_SQL;