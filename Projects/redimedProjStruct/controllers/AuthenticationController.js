module.exports = {
    signin: function(req, res) {
        var result = {success: false, message: '', data: null};
        if (typeof req.body.username !== 'undefined' && req.body.username &&
            typeof req.body.password !== 'undefined' && req.body.password) {
            req.getConnection(function(err,connection) {
                connection.query("SELECT * FROM users WHERE user_name=?", req.body.username, function (err, rows) {
                    if (err) {
                        res.json(result);
                    }
                    else {
                        if (rows.length > 0) {
                            bcrypt.compare(req.body.password, rows[0].password, function (err, compareResult) {
                                if (compareResult == true) {
                                    result.success = true;
                                    result.message = 'Signed in successfully';
                                    res.json(result);
                                }
                                else {
                                    result.message = 'Wrong username or password';
                                    res.json(result);
                                }
                            });
                        }
                        else {
                            result.message = 'Wrong username or password';
                            res.json(result);
                        }
                    }
                });
            });
        } else {
            res.json(result);
        }
    },
    signup: function(req, res) {

    },
    authenticated: function(req, res, next) {
        if (typeof req.user !== 'undefined' && req.user) {
            next();
        }
        else {
            throw new Error('User is not authenticated', 403);
        }
    },
    sampleActionRequiredSignIn: function(req, res) {
        // some code goes here
    }
};