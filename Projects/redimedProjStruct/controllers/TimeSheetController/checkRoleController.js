//EXPORTS MODEL
var db = require("../../models");
//END
module.exports = {
    LoadRole: function(req, res) {
        var USER_ID = req.body.USER_ID;
        var query =
            "SELECT hr_employee.TITLE " + //SELECT
            "FROM sys_hierarchy_nodes " + //FROM
            "INNER JOIN sys_hierarchy_group ON sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID " + //JOIN
            "INNER JOIN sys_hierarchies_types ON sys_hierarchies_types.TYPE_NAME = sys_hierarchy_group.GROUP_TYPE " + //JOIN
            "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " + //JOIN
            "INNER JOIN users ON users.id = sys_hierarchies_users.USER_ID " + //JOIN
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " + //JOIN
            "WHERE sys_hierarchies_users.USER_ID = :userId " + //WHERE
            "AND sys_hierarchies_types.TYPE_NAME='Time Sheet'"; //WHERE
        db.sequelize.query(query, null, {
                raw: true
            }, {
                userId: USER_ID
            })
            .success(function(result) {
                if (result === undefined || result === null || result.length === 0) {
                    res.json({
                        status: "success",
                        position: [{
                            TITLE: "NOTROLE"
                        }]
                    });
                    return;
                } else {
                    res.json({
                        status: "success",
                        position: result
                    });
                    return;
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    position: [],
                });
                return;
            });
    },
};
