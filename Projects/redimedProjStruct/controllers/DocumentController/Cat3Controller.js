/**
 * Created by thanh on 10/10/2014.
 */
var db = require('../../models');

module.exports = {
    insertCat3: function (req, res) {
        var info = req.body.info;
        console.log("Info: " + info);
        var cat_id = 1;

        db.Category3.create({
            cat_id: cat_id
        }, {raw: true})
            .success(function (data) {
                res.json({status: "success"});
            }).error(function (err) {
                res.json({status: "fail"});
                console.log("ERROR: " + err);
            });
    }
}