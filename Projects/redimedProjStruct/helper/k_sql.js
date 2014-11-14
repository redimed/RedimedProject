var $q = require('q');

function K_SQL(req, res) {
    var _this = this;
  
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

     this.execQuery2 = function(sql, deferred){
        _this.connection.query(sql, function (err, data) {
            if (err) {
                console.error('DB SQL: ', err)
                deferred.reject(err);
                return;
            } 
            deferred.resolve(data);
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

     this.execQueryRow2 = function(sql, deferred){
        this.connection.query(sql, function (err, data) {
            if (err) {
                console.error('DB SQL: ', err)
                deferred.reject(err);
                return;
            }
            if(data.length > 0)
                deferred.resolve(data[0]);
            else 
                deferred.resolve(null);
        });
    }


    this.exec2 = function(sql) {
        var deferred = $q.defer();
        if (!this.connection) {
            req.getConnection(function (error, connection) {
                if(error) throw new Error('Cannot find MySQL connection!');
                _this.connection = connection;   
                _this.execQuery2 (sql, deferred);
            });
        } else {
            _this.execQuery2 (sql, deferred);  
        }
        return deferred.promise;
    }


    this.exec = function (sql, fnSuc, fnErr) {
        console.log("\n Exec SQL: " + sql);
        if(fnSuc) {
            if (!this.connection) {
                req.getConnection(function (error, connection) {
                    if(error) throw new Error('Cannot find MySQL connection!');
                    _this.connection = connection;     
    		        _this.execQuery(sql, fnSuc, fnErr);        
                });
            } else {
        		_this.execQuery(sql, fnSuc, fnErr);   
        	}
        } else {
            return this.exec2 (sql);
        }
    }

    /**
    *   QUERY ROW
    */

    
   
    this.exec_row2 = function (sql) {
        var deferred = $q.defer();
        if (!this.connection) {
            req.getConnection(function (error, connection) {
                if(error) throw new Error('Cannot find MySQL connection!');
                _this.connection = connection;   
                _this.execQueryRow2 (sql, deferred);
            });
        } else {
            _this.execQueryRow2 (sql, deferred);  
        }
        return deferred.promise;
    }

    this.exec_row = function (sql, fnSuc, fnErr) {
        console.log("\n Exec SQL Row: " + sql);
        if(fnSuc) {
            if (!this.connection) {
                req.getConnection(function (error, connection) {
                    if(error) throw new Error('Cannot find MySQL connection!');
                    _this.connection = connection;     
    		        _this.execQueryRow(sql, fnSuc, fnErr);           
                });
            } else {
    		   _this.execQueryRow(sql, fnSuc, fnErr);   
    	    }
        } else {
            return this.exec_row2 (sql);
        }
    }


    return this;
}

module.exports = K_SQL;
