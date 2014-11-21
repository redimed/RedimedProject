var $q = require('q');
var fs = require('fs');


function K_SQL(req, res) {
    var _this = this;
	
	this.isLog = 2; // 0 is off, 1 is console, 2 write file
	
	var getFileNameLog = function(){
		var d = new Date();
		return './log/' + d.getFullYear() + '_' + d.getMonth() + '_' + d.getDate() + '.log';
	}
	
	var logFile = function(filename, content) {
		fs.exists(filename,  function (exists) {
			if(!exists) {
				fs.writeFile(filename, content, function(err) {
					if(err) {
						console.log(err);
					} 
				}); 
			} else {
				fs.appendFile(filename, content, function (err) {
					if(err) {
						console.log(err);
					} 
				});
			}
		});
	}
	
	var logSql = function(sql){
		if(0 == _this.isLog)
			return;
		var d = new Date();	
		if(1 == _this.isLog) {
			console.log('Exec SQL (' + d.toString() + '): ' + sql + "\n"); 
			return;
		}

		var filename = getFileNameLog();
		var content = 'Exec SQL (' + d.toString() + '): ' + sql + "\n"; 
		logFile(filename, content);
	}
  
	var logErr = function(sql, err) {
		console.error('DB SQL: ', err);
		var filename = './log/error.log';
		var d = new Date();
	
		var content = 'Exec SQL: ' + sql + "\nError at " +  d.toString() + ' : ' +  JSON.stringify(err) + "\n\n";
		logFile(filename, content);
	}
  
    this.execQuery = function(sql, fnSuc, fnErr){
    	this.connection.query(sql, function (err, data) {
            if (err) {
				logErr(sql, err);
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
				logErr(sql, err);
                deferred.reject(err);
                return;
            } 
            deferred.resolve(data);
        });      
    }

     this.execQueryRow = function(sql, fnSuc, fnErr){
        this.connection.query(sql, function (err, data) {
            if (err) {
                logErr(sql, err);
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
                logErr(sql, err);
                deferred.reject(err);
                return;
            }
            if(data.length > 0)
                deferred.resolve(data[0]);
            else 
                deferred.resolve(null);
        });
    }

	/***
	*	PUBLIC FUNCTION
	**/

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
		logSql(sql);
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
		logSql(sql);
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
