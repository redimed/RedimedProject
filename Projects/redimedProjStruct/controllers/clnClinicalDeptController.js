/* CREATED BY BV */
var db = require('../models');

module.exports = {
    getList: function (req, res) {
        req.getConnection(function (err, connection)
        {
            var query = connection.query('SELECT * FROM cln_clinical_depts', function (err, rows)
            {
                if (err)
                {
                    console.log("Error Selecting : %s ", err);
                } else {
                    res.json(rows);
                }
            });
        });
    }
}