var db = require("../../models");
var FunctionSendMail = require("../../controllers/TimeSheetController/timeSheetEmailController.js");
var sys_hierarchy_group = db.sys_hierarchy_group;
var sys_hierarchy_nodes = db.sys_hierarchy_nodes;
var sys_hierarchies_users = db.sys_hierarchies_users;
var User = db.User;
var UserType = db.UserType;
var Company = db.Company;
var Departments = db.Departments;
var Location = db.timeLocation;
var moment = require('moment');
var CronJob = require('cron').CronJob;
var chainer = new db.Sequelize.Utils.QueryChainer();
module.exports = {
    //MODULE TREE
    LoadTreeTimeSheet: function(req, res) {
        var searchObj = req.body.searchObj;
        var searchParam = [];
        var strQuery = '';
        strQuery += "GROUP_TYPE='" + searchObj.GROUP_TYPE + "' and ";
        for (var key in searchObj.data) {
            if (searchObj.data[key]) {
                strQuery += key + " like '%" + searchObj.data[key] + "%' and ";
            }
        }
        strQuery = strQuery.substring(0, strQuery.length - 5);
        searchParam.unshift(strQuery);
        var query = "SELECT sys_hierarchy_group.GROUP_ID, sys_hierarchy_group.GROUP_NAME, sys_hierarchy_group.DECRIPTION, sys_hierarchy_group.CREATION_DATE, sys_hierarchy_group.COMPANY_ID, companies.Company_name FROM sys_hierarchy_group INNER JOIN companies ON sys_hierarchy_group.COMPANY_ID=companies.id" + " where " + searchParam + " ORDER BY CREATION_DATE " + searchObj.order + " limit " + searchObj.limit + " offset " + searchObj.offset;
        db.sequelize.query(query)
            .success(function(data) {
                if (data === undefined || data === null || data.length === 0) {
                    res.json({
                        status: "fail",
                        result: searchObj.data.GROUP_NAME === "" ? null : [],
                        count: 0
                    });
                    return;
                } else {
                    sys_hierarchy_group.count({
                            where: {
                                GROUP_TYPE: searchObj.GROUP_TYPE
                            }
                        })
                        .success(function(count) {
                            res.json({
                                count: count,
                                result: data
                            });
                            return;
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "fail",
                                result: null,
                                count: 0
                            });
                            return;
                        });
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "fail",
                    result: null,
                    count: 0
                });
                return;
            });
    },
    LoadNodeTimeSheet: function(req, res) {
        var searchObj = req.body.searchObj;
        var searchParam = [];
        var strQuery = "";
        var order = "";
        strQuery += "GROUP_ID = " + searchObj.GROUP_ID + " and ";
        //search
        for (var key in searchObj.data) {
            if (searchObj.data[key] !== null && searchObj.data[key] !== undefined) {
                strQuery += key + " like '%" + searchObj.data[key] + "%' and ";
                searchParam.push("%" + searchObj.data[key] + "%");
            }
        }
        strQuery = strQuery.substring(0, strQuery.length - 5);
        // end search

        // order by 
        for (var keyorder in searchObj.order) {
            if (searchObj.order[keyorder] !== null && searchObj.order[keyorder] !== undefined) {
                order += keyorder + " " + searchObj.order[keyorder];
            }
        }
        // end order by

        searchParam.unshift(strQuery);

        sys_hierarchy_nodes.findAndCountAll({
                order: order,
                offset: searchObj.offset,
                limit: searchObj.limit,
                where: searchParam
            })
            .success(function(data) {
                if (data.count === 0) {
                    res.json({
                        status: "findNull",
                        result: [],
                        count: 0
                    });
                    return;
                } else {
                    res.json({
                        status: "success",
                        result: data.rows,
                        count: data.count
                    });
                    return;
                }
            })
            .error(function(err) {
                console.log("*****ERROR: " + err + "*****");
                res.json({
                    status: "error",
                    result: [],
                    count: 0
                });
                return;
            });
    },

    LoadUserTimeSheet: function(req, res) {
        var searchObj = req.body.searchObj;
        var strQuery = "";
        var searchParam = [];
        var order = " ORDER BY ";
        var whereSelect = "";
        strQuery += searchObj.NODE_ID + " and ";

        //search
        for (var key in searchObj.data) {
            if (searchObj.data[key] !== undefined && searchObj.data[key] !== null && searchObj.data[key] !== "") {
                strQuery += key + " like '%" + searchObj.data[key] + "%' and ";
                searchParam.push("%" + searchObj.data[key] + "%");
            }
        }
        //end search

        //order
        for (var keyorder in searchObj.order) {
            if (searchObj.order[keyorder] !== undefined && searchObj.order[keyorder] !== null && searchObj.order[key] !== "") {
                order += keyorder + " " + searchObj.order[keyorder];
            }
        }
        //end order
        //check not order
        if (order.length === 10) {
            order = "";
        }
        //end check order

        //select
        for (var keyselect in searchObj.select) {
            if (searchObj.select[keyselect] !== undefined && searchObj.select[keyselect] !== null && searchObj.select[keyselect] !== "") {
                whereSelect += keyselect + " = " + searchObj.select[keyselect] + " and ";
            }
        }
        //end select
        strQuery += whereSelect;
        strQuery = strQuery.substring(0, strQuery.length - 5);
        searchParam.unshift(strQuery);
        var querySelectDel = "SELECT users.user_name, users.id,sys_hierarchies_users.NODE_ID,sys_hierarchies_users.DEPARTMENT_CODE_ID, users.Creation_date, " +
            "time_location.name, departments.departmentName FROM sys_hierarchies_users " +
            "INNER JOIN users ON sys_hierarchies_users.USER_ID = users.id " +
            "INNER JOIN departments ON departments.departmentid = sys_hierarchies_users.DEPARTMENT_CODE_ID " +
            "INNER JOIN time_location ON time_location.location_id = departments.locationID " +
            "WHERE sys_hierarchies_users.NODE_ID = " + strQuery + order;
        db.sequelize.query(querySelectDel)
            .success(function(resultSelect) {
                var querySelect = "SELECT users.user_name, users.id,sys_hierarchies_users.NODE_ID,sys_hierarchies_users.DEPARTMENT_CODE_ID, users.Creation_date, " +
                    "time_location.name, departments.departmentName FROM sys_hierarchies_users " +
                    "INNER JOIN users ON sys_hierarchies_users.USER_ID = users.id " +
                    "INNER JOIN departments ON departments.departmentid = sys_hierarchies_users.DEPARTMENT_CODE_ID " +
                    "INNER JOIN time_location ON time_location.location_id = departments.locationID " +
                    "WHERE sys_hierarchies_users.NODE_ID = " + strQuery + order + " " + " limit " +
                    searchObj.limit + " offset " + searchObj.offset;
                db.sequelize.query(querySelect)
                    .success(function(result) {
                        var queryCount = "SELECT count(users.user_name) as count FROM sys_hierarchies_users " +
                            "INNER JOIN users ON sys_hierarchies_users.USER_ID = users.id " +
                            "INNER JOIN departments ON departments.departmentid = sys_hierarchies_users.DEPARTMENT_CODE_ID " +
                            "INNER JOIN time_location ON time_location.location_id = departments.locationID " +
                            "WHERE sys_hierarchies_users.NODE_ID = " + strQuery;
                        db.sequelize.query(queryCount)
                            .success(function(count) {
                                if (result.length === 0) {
                                    res.json({
                                        status: "success",
                                        result: (whereSelect.length !== 0 || searchObj.data['user_name'].length !== 0) ? result : null,
                                        count: count[0].count,
                                        resultSelect: resultSelect
                                    });
                                } else {
                                    res.json({
                                        status: "success",
                                        result: result,
                                        count: count[0].count,
                                        resultSelect: resultSelect
                                    });
                                    return;
                                }
                            })
                            .error(function(err) {
                                console.log("*****ERRROR:" + err + "*****");
                                res.json({
                                    status: "error",
                                    result: null,
                                    count: 0,
                                    resultSelect: []
                                });
                                return;
                            });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: null,
                            count: 0,
                            resultSelect: []
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: [],
                    count: 0,
                    resultSelect: []
                });
            });

    },

    LoadSelectUser: function(req, res) {
        UserType.findAll({}, {
                raw: true
            })
            .success(function(userType) {
                Company.findAll({}, {
                        raw: true
                    })
                    .success(function(company) {
                        res.json({
                            status: "success",
                            userType: userType,
                            company: company
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            userType: [],
                            company: []
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    userType: [],
                    company: []
                });
                return;
            });
    },

    DeleteUser: function(req, res) {
        var userPost = req.body.userPost;
        var query = "DELETE FROM sys_hierarchies_users WHERE (NODE_ID, USER_ID, DEPARTMENT_CODE_ID) IN (" + userPost + ")";
        db.sequelize.query(query)
            .success(function(resultDel) {
                res.json({
                    status: "success"
                });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },
    LoadDepartMent: function(req, res) {
        Departments.findAll({
                where: {
                    departmentType: "Time Sheet"
                }
            }, {
                raw: true
            })
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
                return;
            });
    },
    LoadNodeSelect: function(req, res) {
        var GROUP_ID = req.body.info;
        sys_hierarchy_nodes.findAll({
                where: {
                    GROUP_ID: GROUP_ID
                }
            }, {
                raw: true
            })
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    ressult: []
                });
                return;
            });
    },
    LoadUser: function(req, res) {
        var searchObj = req.body.searchObj;
        var strQuery = "";
        var order = " ORDER BY ";
        var queryNOTIN = "SELECT USER_ID FROM sys_hierarchies_users WHERE NODE_ID = " + searchObj.NODE_ID + " AND DEPARTMENT_CODE_ID = " + searchObj.departmentid;
        db.sequelize.query(queryNOTIN)
            .success(function(NOTIN) {
                for (var keyNotIn in NOTIN) {
                    strQuery += NOTIN[keyNotIn].USER_ID + ",";
                }
                if (NOTIN.length !== 0) {
                    strQuery = " users.id NOT IN (" + strQuery.substring(0, strQuery.length - 1) + ") and ";
                }
                //get filter
                for (var keyFilter in searchObj.select) {
                    if (searchObj.select[keyFilter] !== undefined && searchObj.select[keyFilter] !== null && searchObj.select[keyFilter] !== "") {
                        strQuery += keyFilter + " = " + searchObj.select[keyFilter] + " and ";
                    }
                }
                //end get filter

                //get search
                for (var key in searchObj.data) {
                    if (searchObj.data[key] !== undefined && searchObj.data[key] !== null && searchObj.data[keyFilter] !== "") {
                        strQuery += key + " like '%" + searchObj.data[key] + "%' and ";
                    }
                }
                //end get search

                //get order
                for (var keyOrder in searchObj.order) {
                    if (searchObj.order[keyOrder] !== undefined && searchObj.order[keyOrder] !== null && searchObj.order[keyOrder] !== "") {
                        order += key + " " + searchObj.order[keyOrder] + ", ";
                    }
                }
                if (order.length === 10) {
                    order = "";
                } else {
                    order = order.substring(0, order.length - 2);
                }
                //end get order
                strQuery = strQuery.substring(0, strQuery.length - 5);
                var querySelectAll = "SELECT users.user_name, users.id, users.Creation_date, companies.Company_name, user_type.user_type " +
                    "FROM users LEFT JOIN user_type ON users.user_type = user_type.ID " +
                    "LEFT JOIN companies ON users.company_id = companies.id " +
                    "WHERE " + strQuery + order;
                var querySelectSome = "SELECT users.user_name, users.id, users.Creation_date, companies.Company_name, user_type.user_type " +
                    "FROM users LEFT JOIN user_type ON users.user_type = user_type.ID " +
                    "LEFT JOIN companies ON users.company_id = companies.id " +
                    "WHERE " + strQuery + order + " LIMIT " + searchObj.limit + " OFFSET " + searchObj.offset;
                var queryCountSome = "SELECT count(users.user_name) as count " +
                    "FROM users LEFT JOIN user_type ON users.user_type = user_type.ID " +
                    "LEFT JOIN companies ON users.company_id = companies.id " +
                    "WHERE " + strQuery + order;
                db.sequelize.query(querySelectAll)
                    .success(function(resultAll) {
                        db.sequelize.query(querySelectSome)
                            .success(function(resultSome) {
                                db.sequelize.query(queryCountSome)
                                    .success(function(count) {
                                        res.json({
                                            status: "success",
                                            resultAll: resultAll,
                                            result: resultSome,
                                            count: count[0].count
                                        });
                                        return;
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR:" + err + "*****");
                                        res.json({
                                            status: "error",
                                            resultAll: [],
                                            result: [],
                                            count: 0
                                        });
                                        return;
                                    });
                            })
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "error",
                                    resultAll: [],
                                    result: [],
                                    count: 0
                                });
                                return;
                            });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            resultAll: [],
                            result: [],
                            count: 0
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    resultAll: [],
                    result: [],
                    count: 0
                });
                return;
            });
    },

    AddUser: function(req, res) {
        var info = req.body.info;
        var arrayUser = "";
        for (var key in info.userList) {
            if (info.userList[key] !== undefined && info.userList[key] !== null) {
                arrayUser += "(" + info.NODE_ID + "," + info.departmentid + "," + info.userList[key] + "," + 1 + "," + info.user_id + "," + null + "," + null + "," + null + "), ";
            }
        }
        arrayUser = arrayUser.substring(0, arrayUser.length - 2);
        var queryAddUser = "INSERT INTO sys_hierarchies_users VALUE " + arrayUser;
        db.sequelize.query(queryAddUser)
            .success(function(result) {
                sys_hierarchies_users.findAll({
                        where: {
                            NODE_ID: info.NODE_ID,
                            DEPARTMENT_CODE_ID: info.departmentid
                        }
                    }, {
                        raw: true
                    })
                    .success(function(result) {
                        res.json({
                            status: "success",
                            result: result
                        });

                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: []
                        });
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
            });
    },

    LoadOneUser: function(req, res) {
        var info = req.body.info;
        var NODE_ID = info.NODE_ID;
        var USER_ID = info.USER_ID;
        var DEPARTMENT_ID = info.DEPARTMENT_ID;
        var query = "SELECT users.user_name, users.Contact_email, user_type.user_type, companies.Company_name " +
            "FROM users LEFT JOIN user_type ON users.user_type = user_type.ID " +
            "LEFT JOIN companies ON users.company_id = companies.id " +
            "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
            "WHERE sys_hierarchies_users.NODE_ID = " + NODE_ID + " AND sys_hierarchies_users.USER_ID = " +
            USER_ID + " AND sys_hierarchies_users.DEPARTMENT_CODE_ID = " + DEPARTMENT_ID;
        db.sequelize.query(query)
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
                return;
            });
    },

    UpdateUser: function(req, res) {
        var info = req.body.info;
        var NODE_ID = info.NODE_ID;
        var USER_ID = info.USER_ID;
        var DEPARTMENT_CODE_ID = info.departmentid;
        sys_hierarchies_users.update({
                NODE_ID: NODE_ID,
                DEPARTMENT_CODE_ID: DEPARTMENT_CODE_ID,
            }, {
                NODE_ID: info.oldNodeId,
                USER_ID: USER_ID,
                DEPARTMENT_CODE_ID: info.oldDeptId
            })
            .success(function(ressult) {
                res.json({
                    status: "success"
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },

    LoadRoleWhere: function(req, res) {
        var info = req.body.info;
        var queryNotIn = "SELECT NODE_ID FROM sys_hierarchies_users WHERE USER_ID = " + info.USER_ID + " AND DEPARTMENT_CODE_ID = " + info.DEPARTMENT_ID;
        db.sequelize.query(queryNotIn)
            .success(function(result) {
                var strRole = "";
                for (var key in result) {
                    strRole += result[key].NODE_ID + ",";
                }
                strRole = strRole.substring(0, strRole.length - 1);
                var queryRole = "SELECT sys_hierarchy_nodes.NODE_ID, sys_hierarchy_nodes.NODE_CODE " +
                    "FROM sys_hierarchy_nodes " +
                    "WHERE sys_hierarchy_nodes.GROUP_ID = " + info.GROUP_ID;
                if (strRole !== "" && strRole.length !== 0) {
                    queryRole += " AND sys_hierarchy_nodes.NODE_ID NOT IN (" + strRole + ")";
                }
                db.sequelize.query(queryRole)
                    .success(function(result2) {
                        res.json({
                            status: "success",
                            result: result2
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: []
                        });
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
            });
    },

    LoadDeptWhere: function(req, res) {
        var info = req.body.info;
        var queryNotIn = "SELECT DEPARTMENT_CODE_ID FROM sys_hierarchies_users WHERE USER_ID = " + info.USER_ID + " AND NODE_ID = " + info.NODE_ID;
        db.sequelize.query(queryNotIn)
            .success(function(result) {
                var strDept = "";
                for (var key in result) {
                    strDept += result[key].DEPARTMENT_CODE_ID + ",";
                }
                strDept = strDept.substring(0, strDept.length - 1);
                var queryDept = "SELECT departments.departmentid, departments.departmentName " +
                    "FROM departments ";
                if (strDept !== "" && strDept.length !== 0) {
                    queryDept += " WHERE departments.departmentid NOT IN (" + strDept + ")";
                }
                db.sequelize.query(queryDept)
                    .success(function(result2) {
                        res.json({
                            status: "success",
                            result: result2
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: []
                        });
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
            });
    },

    //DEPT
    LoadDept: function(req, res) {
        var searchObj = req.body.searchObj;
        var strOrder = "ORDER BY ";
        var strSearch = " AND ";
        var strQuery = " AND ";
        //ORDER
        for (var key in searchObj.order) {
            if (searchObj.order[key] !== undefined && searchObj.order[key] !== null && searchObj.order[key] !== "") {
                strOrder += key + " " + searchObj.order[key];
            }
        }
        if (strOrder.length === 9) {
            strOrder = "";
        }
        //END ORDER

        //get filter
        for (var keyFilter in searchObj.select) {
            if (searchObj.select[keyFilter] !== undefined && searchObj.select[keyFilter] !== null && searchObj.select[keyFilter] !== "") {
                strQuery += keyFilter + " = " + searchObj.select[keyFilter] + " and ";
            }
        }
        //end get filter

        //SEARCH
        for (var keySearch in searchObj.data) {
            if (searchObj.data[keySearch] !== undefined && searchObj.data[keySearch] !== null && searchObj.data[keySearch]) {
                strSearch += key + " like '%" + searchObj.data[keySearch] + "%' and ";
            }
        }

        if (strSearch.length === 5) {
            strSearch = "";
        } else {
            strSearch = strSearch.substring(0, strSearch.length - 5);
        }

        if (strQuery.length === 5) {
            strQuery = "";
        } else {
            strQuery = strQuery.substring(0, strQuery.length - 5);
        }
        //END SEARCH

        var querySearch = "SELECT departments.departmentid, departments.departmentName, time_location.name, users.user_name " +
            "FROM departments LEFT JOIN users ON departments.managerId = users.id " +
            "LEFT JOIN time_location ON time_location.location_id = departments.locationID " +
            "WHERE departments.departmentType = 'Time Sheet' " +
            strSearch + strQuery + " " + strOrder + " LIMIT " + searchObj.limit + " OFFSET " + searchObj.offset;
        var queryCount = "SELECT COUNT(departments.departmentid) AS count " +
            "FROM departments LEFT JOIN users ON departments.managerId = users.id " +
            "LEFT JOIN time_location ON time_location.location_id = departments.locationID " +
            "WHERE departments.departmentType = 'Time Sheet' " +
            strSearch + strQuery;
        db.sequelize.query(querySearch)
            .success(function(result) {
                db.sequelize.query(queryCount)
                    .success(function(count) {
                        res.json({
                            status: "success",
                            result: result,
                            count: count[0].count
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: [],
                            count: 0
                        });
                        return;
                    });
            }).error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: [],
                    count: 0
                });
                return;
            });
    },
    //END DEPT

    DeleteDept: function(req, res) {
        var idDept = req.body.idDept;
        var query = "DELETE FROM departments WHERE departmentid = " + idDept;
        db.sequelize.query(query)
            .success(function(result) {
                res.json({
                    status: "success"
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
            });
    },

    LoadLocation: function(req, res) {
        Location.findAll({}, {
                raw: true
            })
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },
    LoadOneDept: function(req, res) {
        var idDept = req.body.idDept;
        Departments.find({
                where: {
                    departmentid: idDept
                }
            }, {
                raw: true
            })
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },

    InsertDept: function(req, res) {
        var info = req.body.info;
        Departments.max("departmentid")
            .success(function(maxDept) {
                var id = maxDept + 1;
                Departments.create({
                        departmentid: id,
                        departmentName: info.departmentName,
                        locationID: info.locationID,
                        departmentType: "Time Sheet"
                    })
                    .success(function(result) {
                        res.json({
                            status: "success"
                        });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    });
            }).error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },

    UpdateDept: function(req, res) {
        var info = req.body.info;
        Departments.update({
                departmentName: info.departmentName,
                locationID: info.locationID
            }, {
                departmentid: info.departmentid
            })
            .success(function(result) {
                res.json({
                    status: "success"
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },

    ViewApproved: function(req, res) {
        var idTaskWeek = req.body.info;
        var strQuery = "SELECT SUM(time_tasks.time_charge) AS sumDATE, time_tasks.date, time_tasks.tasks_id, " +
            "time_tasks.activity_id, time_tasks_week.start_date, time_tasks_week.end_date,  " +
            "time_tasks_week.task_week_id, time_tasks_week.time_in_lieu, time_tasks.time_charge, time_tasks_week.over_time, " +
            "time_task_status.name AS status, time_task_status.task_status_id, time_tasks_week.time_charge as chargeWeek, hr_employee.FirstName, hr_employee.LastName " +
            "FROM time_tasks INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "INNER JOIN users ON time_tasks_week.user_id = users.id " +
            "INNER JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "WHERE time_tasks.tasks_week_id = " + idTaskWeek + " GROUP BY time_tasks.date ORDER BY time_tasks.date";
        var strActivity = "SELECT SUM(time_tasks.time_charge) AS sumAC, time_tasks.date, " +
            "time_tasks.activity_id, time_tasks_week.start_date, time_tasks_week.end_date,  " +
            "time_tasks_week.task_week_id, time_tasks_week.time_in_lieu, time_tasks.time_charge, time_tasks_week.over_time, " +
            "time_task_status.name AS status, time_task_status.task_status_id, time_tasks_week.time_charge as chargeWeek, hr_employee.FirstName, hr_employee.LastName " +
            "FROM time_tasks INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "INNER JOIN users ON time_tasks_week.user_id = users.id " +
            "INNER JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "WHERE time_tasks.tasks_week_id = " + idTaskWeek + " GROUP BY time_tasks.date, time_activity.activity_id ORDER BY time_tasks.date";
        db.sequelize.query(strQuery)
            .success(function(result) {
                if (result === undefined || result === null || result.length === 0) {
                    res.json({
                        status: "success",
                        result: [],
                        resultActivity: []
                    });
                    return;
                } else {
                    db.sequelize.query(strActivity)
                        .success(function(resultActivity) {
                            res.json({
                                status: "success",
                                result: result,
                                resultActivity: resultActivity
                            });
                            return;
                        }).error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                result: [],
                                resultActivity: []
                            });
                            return;
                        });

                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: [],
                    resultActivity: []
                });
                return;
            });
    },

    ViewOnDate: function(req, res) {
        var info = req.body.info;
        var strQuery = "SELECT DISTINCT time_tasks.date, time_tasks.task,time_item_task.units,time_item_code.ITEM_NAME, time_item_code.IS_BILLABLE, time_item_task.ratio, time_activity.NAME, time_location.NAME AS LOCATION, departments.departmentName, " +
            "time_tasks.time_charge, time_item_task.item_id, time_item_task.deleted, time_item_task.time_charge as chargeItem, time_item_task.comment, " +
            "hr_employee.FirstName, hr_employee.LastName, time_tasks_week.start_date, time_tasks_week.end_date, " +
            "time_tasks_week.time_charge as chargeWeek, time_task_status.name AS status FROM time_tasks " +
            "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " +
            "INNER JOIN users ON users.id=time_tasks_week.user_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "LEFT JOIN time_location ON time_location.location_id = time_tasks.location_id " +
            "LEFT JOIN departments ON departments.departmentid = time_tasks.department_code_id " +
            "LEFT OUTER JOIN time_item_task ON time_tasks.tasks_id = time_item_task.task_id AND time_item_task.deleted = 0 " +
            "LEFT JOIN time_item_code ON time_item_code.ITEM_ID = time_item_task.item_id " +
            "WHERE time_tasks.date = '" + info.DATE + "' AND time_tasks.tasks_week_id = " + info.ID +
            " AND time_tasks.deleted = 0" +
            " ORDER BY time_tasks.order ASC";
        db.sequelize.query(strQuery)
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
                return;
            });
    },

    LoadItemCode: function(req, res) {
        var searchObj = req.body.searchObj;
        var strSearch = " WHERE 1 = 1 AND ";
        var strOrder = " ORDER BY ";
        var activity = "";
        // CHECK ISBILLABLE OR NOT
        if (searchObj.isBillable === false) {
            activity = " AND time_item_code.ACTIVITY_ID = " + searchObj.activity_id + " ";
        } else {
            activity = " AND time_item_code.IS_BILLABLE = 1 ";
        }
        //END
        //get search
        for (var keySearch in searchObj.data) {
            if (searchObj.data[keySearch] !== undefined &&
                searchObj.data[keySearch] !== null &&
                searchObj.data[keySearch] !== "") {
                strSearch += keySearch + " like '%" + searchObj.data[keySearch] +
                    "%' AND ";
            }
        }

        strSearch = strSearch.substring(0, strSearch.length - 5);
        //end get search

        //get ORDER
        for (var keyOrder in searchObj.order) {
            if (searchObj.order[keyOrder] !== undefined &&
                searchObj.order[keyOrder] !== null &&
                searchObj.order[keyOrder] !== "") {
                strOrder += keyOrder + " " + searchObj.order[keyOrder] + ", ";
            }
        }
        if (strOrder.length === 10) {
            strOrder = "";
        } else {
            strOrder = strOrder.substring(0, strOrder.length - 2);
        }
        //end get ORDER
        var query = "SELECT time_item_code.ITEM_ID, time_item_code.ITEM_NAME, time_item_code.ITEM_UNITS FROM time_item_code " + strSearch + activity + strOrder + " LIMIT " + searchObj.limit + " OFFSET " + searchObj.offset;
        var queryCount = "SELECT COUNT(time_item_code.ITEM_ID) AS COUNTITEM FROM time_item_code " + strSearch + activity + strOrder;
        db.sequelize.query(query)
            .success(function(result) {
                if ((result === undefined || result === null || result.length === 0) && strSearch === "") {
                    res.json({
                        status: "success",
                        result: null,
                        count: 0
                    });
                    return;
                } else {

                    db.sequelize.query(queryCount)
                        .success(function(count) {
                            res.json({
                                status: "success",
                                result: result,
                                count: count[0].COUNTITEM
                            });
                            return;
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                result: null,
                                count: 0
                            });
                            return;
                        });
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: null,
                    count: 0
                });
                return;
            });
    },

    //approve
    LoadTimeSheetApprove: function(req, res) {
        var searchObj = req.body.searchObj;
        var strSearch = " AND ";
        var orderBY = " ORDER BY ";
        var strSearchEmployee = "";
        if (searchObj.name['nameEmployee'] !== undefined && searchObj.name['nameEmployee'] !== null && searchObj.name['nameEmployee'] !== "") {
            strSearchEmployee = " AND (hr_employee.FirstName like '%" + searchObj.name['nameEmployee'] + "%' OR " +
                "hr_employee.LastName like '%" + searchObj.name['nameEmployee'] + "%')";
        }

        //search Employee

        //end search Employee

        //search
        for (var keySearch in searchObj.data) {
            if (searchObj.data[keySearch] !== undefined &&
                searchObj.data[keySearch] !== null &&
                searchObj.data[keySearch] !== "") {
                strSearch += keySearch + " like '%" + searchObj.data[keySearch] + "%' AND ";
            }
        }
        //end search

        //select
        for (var keySelect in searchObj.select) {
            if (searchObj.select[keySelect] !== undefined &&
                searchObj.select[keySelect] !== null &&
                searchObj.select[keySelect] !== "") {
                strSearch += keySelect + " = " + searchObj.select[keySelect] + " AND ";
            }
        }
        //end select
        if (strSearch.length === 5) {
            strSearch = "";
        } else {
            strSearch = strSearch.substring(0, strSearch.length - 5);
        }

        for (var keyOrder in searchObj.order) {
            if (searchObj.order[keyOrder] !== undefined &&
                searchObj.order[keyOrder] !== null &&
                searchObj.order[keyOrder] !== "") {
                orderBY += keyOrder + " " + searchObj.order[keyOrder];
            }
        }
        if (orderBY.length === 10) {
            orderBY = "";
        }
        var isDirector = false;
        //get NODE_ID Head of Dept. on TIMESHEET
        var strQueryGetNodeDept = "SELECT sys_hierarchy_nodes.NODE_ID, sys_hierarchy_nodes.NODE_CODE FROM sys_hierarchy_nodes INNER JOIN sys_hierarchy_group ON " +
            "sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID INNER JOIN sys_hierarchies_types ON " +
            " sys_hierarchies_types.TYPE_NAME = sys_hierarchy_group.GROUP_TYPE INNER JOIN sys_hierarchies_users ON " +
            "sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID WHERE sys_hierarchies_users.USER_ID = " + searchObj.USER_ID +
            " AND sys_hierarchies_types.TYPE_NAME='Time Sheet'";
        db.sequelize.query(strQueryGetNodeDept)
            .success(function(result) {
                if (result === undefined || result === null || result.length === 0) {
                    res.json({
                        status: "success",
                        count: 0,
                        result: null
                    });
                    return;
                } else {
                    var NodeDeptId = "";
                    for (var deptId in result) {
                        if (result[deptId] !== undefined &&
                            result[deptId] !== null &&
                            result[deptId] !== "") {
                            if (result[deptId].NODE_CODE === "Director") {
                                isDirector = true;
                            }
                            NodeDeptId += result[deptId].NODE_ID + ",";
                        }
                    }
                    if (NodeDeptId !== "") {
                        NodeDeptId = "(" + NodeDeptId.substring(0, NodeDeptId.length - 1) + ")";
                    }
                    //get list Dept's manager
                    var strQueryDeptList = "SELECT sys_hierarchies_users.DEPARTMENT_CODE_ID FROM sys_hierarchies_users WHERE NODE_ID IN " +
                        NodeDeptId + " AND sys_hierarchies_users.USER_ID = " +
                        searchObj.USER_ID;
                    db.sequelize.query(strQueryDeptList)
                        .success(function(resultDept) {
                            var Depts = "";
                            if (resultDept === undefined || resultDept === null || resultDept.length === 0) {
                                res.json({
                                    status: "success",
                                    count: 0,
                                    result: []
                                });
                                return;
                            } else {
                                for (var keyDept in resultDept) {
                                    if (resultDept[keyDept] !== undefined &&
                                        resultDept[keyDept] !== null &&
                                        resultDept[keyDept] !== "") {
                                        Depts += resultDept[keyDept].DEPARTMENT_CODE_ID + ",";
                                    }
                                }
                                if (Depts !== "") {
                                    Depts = "(" + Depts.substring(0, Depts.length - 1) + ")";
                                }
                                //get node staff
                                var queryNodeStaff = "SELECT NODE_ID FROM sys_hierarchy_nodes WHERE TO_NODE_ID IN " + NodeDeptId;
                                db.sequelize.query(queryNodeStaff)
                                    .success(function(staffNode) {
                                        if (staffNode === undefined || staffNode === null || staffNode.length === 0) {
                                            res.json({
                                                status: "success",
                                                count: 0,
                                                result: []
                                            });
                                            return;
                                        } else {
                                            var NodeList = "";
                                            for (var keyNode in staffNode) {
                                                if (staffNode[keyNode] !== undefined &&
                                                    staffNode[keyNode] !== null &&
                                                    staffNode[keyNode].length !== 0) {
                                                    NodeList += staffNode[keyNode].NODE_ID + ",";
                                                }
                                            }
                                            if (NodeList !== "") {
                                                NodeList = "(" + NodeList.substring(0, NodeList.length - 1) + ")";
                                            }
                                            //get list user staff
                                            var strUserStaff = "";
                                            if (isDirector === true) {
                                                strUserStaff = "SELECT USER_ID FROM sys_hierarchies_users WHERE NODE_ID IN" +
                                                    NodeList;
                                            } else if (isDirector === false) {
                                                strUserStaff = "SELECT USER_ID FROM sys_hierarchies_users WHERE NODE_ID IN" +
                                                    NodeList + " AND DEPARTMENT_CODE_ID IN " + Depts;
                                            }
                                            db.sequelize.query(strUserStaff)
                                                .success(function(resultListUser) {
                                                    if (resultListUser === undefined || resultListUser === null || resultListUser.length === 0) {
                                                        res.json({
                                                            status: "success",
                                                            count: 0,
                                                            result: []
                                                        });
                                                        return;
                                                    } else {
                                                        var listUser = "";
                                                        for (var keyUser in resultListUser) {
                                                            if (resultListUser[keyUser] !== undefined &&
                                                                resultListUser[keyUser] !== null &&
                                                                resultListUser[keyUser] !== "") {
                                                                listUser += resultListUser[keyUser].USER_ID + ",";
                                                            }
                                                        }
                                                        if (listUser !== "") {
                                                            listUser = "(" + listUser.substring(0, listUser.length - 1) + ")";
                                                        }
                                                        //get list approved
                                                        var queryApprovedTimeSheet = "SELECT DISTINCT time_tasks_week.task_week_id, time_tasks_week.time_charge, time_tasks_week.start_date, time_tasks_week.end_date, " +
                                                            "time_tasks_week.over_time, time_tasks_week.date_submited, time_tasks_week.comments, " +
                                                            "hr_employee.Employee_Code, hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct, time_task_status.name " +
                                                            "FROM time_tasks_week INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
                                                            "INNER JOIN users ON time_tasks_week.user_id = users.id INNER JOIN time_task_status ON " +
                                                            "time_tasks_week.task_status_id = time_task_status.task_status_id INNER JOIN hr_employee ON " +
                                                            "hr_employee.Employee_ID = users.employee_id WHERE time_task_status.task_status_id NOT IN(1) " +
                                                            " AND users.id IN " + listUser + strSearch + strSearchEmployee + orderBY + " LIMIT " + searchObj.limit +
                                                            " OFFSET " + searchObj.offset;
                                                        var queryCountApprovedTimeSheet = "SELECT COUNT(DISTINCT time_tasks_week.task_week_id) AS COUNT " +
                                                            "FROM time_tasks_week INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
                                                            "INNER JOIN users ON time_tasks_week.user_id = users.id INNER JOIN time_task_status ON " +
                                                            "time_tasks_week.task_status_id = time_task_status.task_status_id INNER JOIN hr_employee ON " +
                                                            "hr_employee.Employee_ID = users.employee_id WHERE time_task_status.task_status_id NOT IN(1) " +
                                                            " AND users.id IN " + listUser + strSearch + strSearchEmployee;
                                                        db.sequelize.query(queryApprovedTimeSheet)
                                                            .success(function(listApproved) {
                                                                db.sequelize.query(queryCountApprovedTimeSheet)
                                                                    .success(function(count) {
                                                                        //get list employee
                                                                        var queryEmployee = "SELECT hr_employee.Employee_ID, hr_employee.Employee_Code FROM hr_employee INNER JOIN users ON " +
                                                                            " users.employee_id = hr_employee.Employee_ID WHERE users.id IN " + listUser;
                                                                        db.sequelize.query(queryEmployee)
                                                                            .success(function(listEmployee) {
                                                                                if ((listApproved === null || listApproved.length === 0) && strSearch === "" && strSearchEmployee === "") {
                                                                                    res.json({
                                                                                        status: "success",
                                                                                        count: 0,
                                                                                        result: null,
                                                                                        listEmployee: listEmployee
                                                                                    });
                                                                                    return;
                                                                                } else {
                                                                                    res.json({
                                                                                        status: "success",
                                                                                        count: count[0].COUNT,
                                                                                        result: listApproved,
                                                                                        listEmployee: listEmployee
                                                                                    });
                                                                                    return;

                                                                                }
                                                                                //end get list employee
                                                                            })
                                                                            .error(function(err) {
                                                                                console.log("*****ERROR:" + err + "*****");
                                                                                res.json({
                                                                                    status: "error",
                                                                                    count: 0,
                                                                                    result: [],
                                                                                    listEmployee: []
                                                                                });
                                                                                return;
                                                                            });
                                                                    })
                                                                    .error(function(err) {
                                                                        console.log("*****ERROR:" + err + "*****");
                                                                        res.json({
                                                                            status: "error",
                                                                            count: 0,
                                                                            result: [],
                                                                            listEmployee: []
                                                                        });
                                                                        return;
                                                                    });
                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR:" + err + "*****");
                                                                res.json({
                                                                    status: "error",
                                                                    count: 0,
                                                                    result: [],
                                                                    listEmployee: []
                                                                });
                                                                return;
                                                            });
                                                    }
                                                })
                                                .error(function(err) {
                                                    console.log("*****ERROR:" + err + "*****");
                                                    res.json({
                                                        status: "error",
                                                        count: 0,
                                                        result: [],
                                                        listEmployee: []
                                                    });
                                                    return;
                                                });
                                        }
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR:" + err + "*****");
                                        res.json({
                                            status: "error",
                                            count: 0,
                                            result: [],
                                            listEmployee: []
                                        });
                                    });
                            }
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                count: 0,
                                result: [],
                                listEmployee: []
                            });
                            return;
                        });
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    count: 0,
                    result: [],
                    listEmployee: []
                });
                return;
            });
    },

    RejectTaskWeek: function(req, res) {
        var info = req.body.info;
        info.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        info.status = 4;
        var query = "UPDATE time_tasks_week SET task_status_id = 4, after_status_id = 4, approved_date ='" + info.date + "', comments ='" +
            info.comments + "' WHERE task_week_id = " + info.idTaskWeek;
        db.sequelize.query(query)
            .success(function(result) {
                //TRACKER
                var tracKer = {
                    statusID: 4,
                    USER_ID: info.USER_ID,
                    idTaskWeek: info.idTaskWeek,
                    date: info.date
                };
                //CALL FUNCTION TRACKER
                TracKerTimeSheet(tracKer);
                //END
                // SEND MAIL
                SendMailTimeSheet(req, res, info);
                // END MAIL

                //END TRACKER
                res.json({
                    status: "success"
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },
    ApproveTaskWeek: function(req, res) {
        var info = req.body.info;
        var idTaskWeek = info.idTaskWeek;
        var queryGetTimeInLieu = "SELECT time_in_lieuChoose FROM  time_tasks_week WHERE task_week_id = " + idTaskWeek;
        db.sequelize.query(queryGetTimeInLieu)
            .success(function(result) {
                if (result[0] !== undefined && result[0] !== null && result[0].time_in_lieuChoose > 0) {
                    //processing time in lieu
                    var time_in_lieuChoose = result[0].time_in_lieuChoose;
                    //GET USER ID OF EMPLOYEE
                    var queryGetUserID = "SELECT user_id FROM time_tasks_week WHERE task_week_id = " + idTaskWeek;
                    db.sequelize.query(queryGetUserID)
                        .success(function(users) {
                            if (users[0] !== undefined && users[0] !== null) {
                                var USER_ID = users[0].user_id;
                                var weekNo = getWeekNo();
                                var weekStart = weekNo - 4;
                                //GET TIME IN LIEU 4 WEEK
                                var queryGet4Week = "SELECT task_week_id, time_in_lieu FROM time_tasks_week WHERE user_id = " + USER_ID +
                                    " AND week_no  BETWEEN " + weekStart + " AND " + weekNo + " AND task_status_id = 3 ";
                                db.sequelize.query(queryGet4Week)
                                    .success(function(listWeek) {
                                        if (listWeek === undefined || listWeek === null || listWeek.length === 0) {
                                            console.log("*****ERROR: User has not time in lieu *****");
                                            res.json({
                                                status: "error"
                                            });

                                        } else {
                                            var Weeks = listWeek;
                                            //CHECK NULL OR 0 DELETE
                                            for (var i = 0; i < Weeks.length; i++) {
                                                if (Weeks[i].time_in_lieu === undefined ||
                                                    Weeks[i].time_in_lieu === null ||
                                                    Weeks[i].time_in_lieu === 0) {
                                                    Weeks.splice(i, 1);
                                                } else {
                                                    //MINUS TIME IN LIEU REST
                                                    if (time_in_lieuChoose <= Weeks[i].time_in_lieu) {
                                                        Weeks[i].time_in_lieu = Weeks[i].time_in_lieu - time_in_lieuChoose;
                                                        time_in_lieuChoose = 0;
                                                        break;
                                                    } else {
                                                        time_in_lieuChoose = time_in_lieuChoose - Weeks[i].time_in_lieu;
                                                        Weeks[i].time_in_lieu = 0;
                                                    }
                                                }
                                            }
                                            //END CHECK

                                            //UPDATE TIME IN LIEU FOR WEEK BEFORE
                                            for (var j = 0; j < Weeks.length; j++) {
                                                var queryUpdateTimeInLieu = "UPDATE time_tasks_week SET time_in_lieu = " + Weeks[j].time_in_lieu + " WHERE task_week_id = " + Weeks[j].task_week_id;
                                                db.sequelize.query(queryUpdateTimeInLieu)
                                                    .success(function(success) {
                                                        res.json({
                                                            status: "success"
                                                        });
                                                    })
                                                    .error(function(err) {
                                                        console.log("*****ERROR:" + err + "*****");
                                                        res.json({
                                                            status: "error"
                                                        });
                                                        return;
                                                    });
                                            }
                                        }
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR:" + err + "*****");
                                        res.json({
                                            status: "error"
                                        });
                                        return;
                                    });
                            }
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error"
                            });
                            return;
                        });
                    //END
                } else {
                    console.log("*****Not found time in lieu choose of this week *****");
                }
                //SET APPROVE
                info.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                info.status = 3;
                var timeType = "";
                if (info.time_rest !== 0 && info.time_rest !== null && info.time_rest !== undefined) {
                    if (info.time_in_lieuFull !== undefined && info.time_in_lieuFull !== null) {
                        timeType += ", time_in_lieu = " + info.time_in_lieuFull;
                    }
                    if (info.over_timeFull !== undefined && info.over_timeFull !== null) {
                        timeType += ", over_time = " + info.over_timeFull;
                    }
                }
                var query = "UPDATE time_tasks_week SET task_status_id = 3, approved_date = '" + info.date + "'" + timeType + " WHERE task_week_id = " + idTaskWeek;
                db.sequelize.query(query)
                    .success(function(result) {
                        //TRACKER
                        var tracKer = {
                            statusID: 3,
                            USER_ID: info.USER_ID,
                            idTaskWeek: info.idTaskWeek,
                            date: info.date
                        };
                        //CALL FUNCTION TRACKER
                        TracKerTimeSheet(tracKer);
                        //END

                        // SEND MAIL
                        SendMailTimeSheet(req, res, info);
                        // ENE MAIL

                        //END TRACKER
                        res.json({
                            status: "success"
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    });

                //END
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });

    },
    //ROLE
    LoadRole: function(req, res) {
        var USER_ID = req.body.USER_ID;
        var query = "SELECT hr_employee.TITLE FROM sys_hierarchy_nodes INNER JOIN sys_hierarchy_group ON " +
            "sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID INNER JOIN sys_hierarchies_types ON " +
            " sys_hierarchies_types.TYPE_NAME = sys_hierarchy_group.GROUP_TYPE INNER JOIN sys_hierarchies_users ON " +
            "sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " +
            "INNER JOIN users ON users.id = sys_hierarchies_users.USER_ID " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "WHERE sys_hierarchies_users.USER_ID = " + USER_ID +
            " AND sys_hierarchies_types.TYPE_NAME='Time Sheet'";
        db.sequelize.query(query)
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
    StepEmployee: function(req, res) {
        var info = req.body.info;
        var listUserID = "";
        for (var i = 0; i < info.length; i++) {
            listUserID += info[i] + ",";
        }
        listUserID = listUserID.substring(0, listUserID.length - 1);
        listUserID = "(" + listUserID + ")";
        var queryEmp = "SELECT users.id, users.user_name, users.employee_id, hr_employee.Employee_Code, " +
            "hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct FROM users " +
            "LEFT JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id WHERE users.id IN " + listUserID;
        db.sequelize.query(queryEmp)
            .success(function(result) {
                if (result === undefined || result === null || result.length === 0) {
                    console.log("NOT FOUND USER IN LIST");
                    res.json({
                        status: "error"
                    });
                    return;
                } else {
                    res.json({
                        status: "success",
                        result: result
                    });
                    return;
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
        //END ROLE
    },

    LoadDeptReport: function(req, res) {
        var USER_ID = req.body.USER_ID;
        var query = "SELECT hr_employee.TITLE FROM hr_employee " +
            "INNER JOIN users ON users.employee_id  = hr_employee.Employee_ID " +
            "WHERE users.id = " + USER_ID;
        db.sequelize.query(query)
            .success(function(result) {
                if (result !== undefined && result !== null && result.length !== 0) {
                    var TITLE = result[0].TITLE;
                    var queryDept = "";
                    if (TITLE === "Director") {
                        //ALL DEPT
                        queryDept = "SELECT DISTINCT departments.departmentid as id, departments.departmentName as label FROM departments " +
                            "INNER JOIN hr_employee ON hr_employee.Dept_ID = departments.departmentid " +
                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                            "WHERE departments.departmentType = 'Time Sheet'";
                    } else if (TITLE === "Head of Dept.") {
                        //ONE DEPT
                        queryDept = "SELECT DISTINCT departments.departmentid as id, departments.departmentName as label FROM departments " +
                            "INNER JOIN hr_employee ON hr_employee.Dept_ID = departments.departmentid " +
                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                            "WHERE departments.departmentType = 'Time Sheet' AND users.id = " + USER_ID;
                    }
                    db.sequelize.query(queryDept)
                        .success(function(resultDept) {
                            res.json({
                                status: "success",
                                result: resultDept
                            });
                            return;
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                result: []
                            });
                            return;
                        });
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
                return;
            });
    },
    LoadEmpReport: function(req, res) {
        var listDept = req.body.listDept;
        var strListDept = "";
        for (var i = 0; i < listDept.length; i++) {
            strListDept += listDept[i].id + ", ";
        }
        if (strListDept !== undefined && strListDept !== null && strListDept !== "" && strListDept.length !== 0) {
            strListDept = strListDept.substring(0, strListDept.length - 2);
        } else {
            strListDept = null;
        }
        var query = "SELECT hr_employee.FirstName, hr_employee.LastName, hr_employee.Employee_ID FROM hr_employee " +
            "INNER JOIN departments ON departments.departmentid = hr_employee.Dept_ID " +
            "WHERE departments.departmentid IN (" + strListDept + ")";
        db.sequelize.query(query)
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
                return;
            });
    },
    LoadReports1: function(req, res) {
        var info = req.body.info;
        var weekNoFrom = info.weekNoFrom;
        var weekNoTo = info.weekNoTo - 1;
        var listEMP = info.listEMP;
        var USER_ID = info.USER_ID;
        var listDept = info.listDept;
        var weekFrom = moment(info.weekFrom).format("YYYY-MM-DD");
        var weekTo = moment(info.weekTo).format("YYYY-MM-DD");
        //STR EMP
        var strListEmp = "";
        for (var i = 0; i < listEMP.length; i++) {
            strListEmp += listEMP[i].id + ", ";
        }
        if (strListEmp !== undefined && strListEmp !== null && strListEmp !== "" && strListEmp.length !== 0) {
            strListEmp = strListEmp.substring(0, strListEmp.length - 2);
        } else {
            strListEmp = null;
        }
        //END
        var strListDept = "";
        var strListDeptID = "";
        for (var d = 0; d < listDept.length; d++) {
            strListDeptID += listDept[d].id + ", ";
        }
        if (strListDeptID !== "") {
            strListDeptID = strListDeptID.substring(0, strListDeptID.length - 2);
        } else strListDeptID = -1;
        // SELECT DEPT
        var queryDept = "SELECT DISTINCT COUNT(hr_employee.Employee_ID) AS CountEmp, departments.departmentName, departments.departmentid FROM departments " +
            "INNER JOIN hr_employee ON hr_employee.Dept_ID = departments.departmentid " +
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
            "INNER JOIN time_tasks_week ON time_tasks_week.user_id  = users.id " +
            "WHERE users.employee_id IN (" + strListEmp + ") AND time_tasks_week.task_status_id = 3 AND " +
            "time_tasks_week.week_no BETWEEN " + weekNoFrom + " AND " + weekNoTo + " GROUP BY departments.departmentName ORDER BY departments.departmentName ASC";
        // END DEPT

        // SELECT TIMECHARGE ACTIVITY
        var queryActivity = "SELECT sum(time_tasks.time_charge) as SUM_CHARGE_ACTIVITY, time_tasks.activity_id, hr_employee.Employee_ID, " +
            "hr_employee.FirstName, hr_employee.LastName, departments.departmentName " +
            "FROM time_tasks_week " +
            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
            "INNER JOIN users ON users.id = time_tasks_week.user_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " +
            "WHERE users.employee_id IN (" + strListEmp + ") AND time_tasks_week.task_status_id = 3 AND " +
            "time_tasks_week.week_no BETWEEN " + weekNoFrom + " AND " + weekNoTo +
            " GROUP BY hr_employee.Employee_ID, time_tasks.activity_id ORDER BY departments.departmentid";
        // END ACTIVITY

        // SELECT TIMECHARGE ALL
        var querySumTimeCharge = "SELECT DISTINCT SUM(C.time_charge) as SUM_CHARGE, SUM(c.time_in_lieu) AS SUM_IN_LIEU, SUM(C.over_time) AS SUM_OVER_TIME, " +
            "C.Employee_ID, C.FirstName, C.LastName, C.departmentName , C.departmentid " +
            " FROM (SELECT DISTINCT time_tasks_week.time_charge , " +
            "hr_employee.Employee_ID, time_tasks_week.over_time , time_tasks_week.time_in_lieu, time_tasks_week.week_no, " +
            "hr_employee.FirstName, hr_employee.LastName, departments.departmentName, departments.departmentid " +
            "FROM time_tasks_week " +
            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
            "INNER JOIN users ON users.id = time_tasks_week.user_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " +
            "WHERE users.employee_id IN (" + strListEmp + ") AND time_tasks_week.task_status_id = 3 AND " +
            "time_tasks_week.week_no BETWEEN " + weekNoFrom + " AND " + weekNoTo + ") C GROUP BY C.Employee_ID";
        // END ALL
        db.sequelize.query(queryDept)
            .success(function(resultDept) {
                db.sequelize.query(querySumTimeCharge)
                    .success(function(resultTimeCharge) {
                        db.sequelize.query(queryActivity)
                            .success(function(resultActivity) {
                                for (var i = 0; i < resultDept.length; i++) {
                                    resultDept[i].listEmployee = [];
                                    for (var j = 0; j < resultTimeCharge.length; j++) {
                                        if (resultDept[i].departmentid === resultTimeCharge[j].departmentid) {
                                            //PUSH DATA
                                            resultDept[i].listEmployee.push({
                                                employee_id: resultTimeCharge[j].Employee_ID,
                                                name: resultTimeCharge[j].FirstName + " " + resultTimeCharge[j].LastName,
                                                time_charge: resultTimeCharge[j].SUM_CHARGE,
                                                time_in_lieu: resultTimeCharge[j].SUM_IN_LIEU,
                                                over_time: resultTimeCharge[j].SUM_OVER_TIME,
                                                SUM_CHARGE_ACTIVITY: [],
                                                activity_id: resultTimeCharge[j].activity_id
                                            });
                                            //END
                                            for (var k = 0; k < resultActivity.length; k++) {
                                                if (resultActivity[k].Employee_ID === resultDept[i].listEmployee[resultDept[i].listEmployee.length - 1].employee_id) {
                                                    resultDept[i].listEmployee[resultDept[i].listEmployee.length - 1].SUM_CHARGE_ACTIVITY[resultActivity[k].activity_id] = resultActivity[k].SUM_CHARGE_ACTIVITY;
                                                }
                                            }
                                        }
                                    }
                                }
                                //INSERT TEMP TABLE REPORTS1

                                //SUM TIME ON DEPT
                                for (var deptIndex = 0; deptIndex < resultDept.length; deptIndex++) {
                                    resultDept[deptIndex].sum_ac1_dept = 0;
                                    resultDept[deptIndex].sum_ac2_dept = 0;
                                    resultDept[deptIndex].sum_ac3_dept = 0;
                                    resultDept[deptIndex].sum_ac4_dept = 0;
                                    resultDept[deptIndex].sum_ac5_dept = 0;
                                    resultDept[deptIndex].time_in_lieu_dept = 0;
                                    resultDept[deptIndex].overtime_dept = 0;
                                    for (var empIndex = 0; empIndex < resultDept[deptIndex].listEmployee.length; empIndex++) {
                                        resultDept[deptIndex].sum_ac1_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[1] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[1] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[1]);
                                        resultDept[deptIndex].sum_ac2_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[2] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[2] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[2]);
                                        resultDept[deptIndex].sum_ac3_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[3] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[3] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[3]);
                                        resultDept[deptIndex].sum_ac4_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[4] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[4] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[4]);
                                        resultDept[deptIndex].sum_ac5_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[5] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[5] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[5]);
                                        resultDept[deptIndex].time_in_lieu_dept += ((resultDept[deptIndex].listEmployee[empIndex].time_in_lieu === undefined || resultDept[deptIndex].listEmployee[empIndex].time_in_lieu === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].time_in_lieu);
                                        resultDept[deptIndex].overtime_dept += ((resultDept[deptIndex].listEmployee[empIndex].over_time === undefined || resultDept[deptIndex].listEmployee[empIndex].over_time === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].over_time);
                                    }
                                }
                                //END

                                // SUM ALL
                                var sum_all = 0;
                                var sum_ac1_all = 0,
                                    sum_ac2_all = 0,
                                    sum_ac3_all = 0,
                                    sum_ac4_all = 0,
                                    sum_ac5_all = 0,
                                    time_in_lieu_all = 0,
                                    overtime_all = 0;
                                for (var deptIndexAll = 0; deptIndexAll < resultDept.length; deptIndexAll++) {
                                    sum_ac1_all += resultDept[deptIndexAll].sum_ac1_dept;
                                    sum_ac2_all += resultDept[deptIndexAll].sum_ac2_dept;
                                    sum_ac3_all += resultDept[deptIndexAll].sum_ac3_dept;
                                    sum_ac4_all += resultDept[deptIndexAll].sum_ac4_dept;
                                    sum_ac5_all += resultDept[deptIndexAll].sum_ac5_dept;
                                    time_in_lieu_all += resultDept[deptIndexAll].time_in_lieu_dept;
                                    overtime_all += resultDept[deptIndexAll].overtime_dept;
                                    sum_all +=
                                        sum_ac1_all +
                                        sum_ac2_all +
                                        sum_ac3_all +
                                        sum_ac4_all +
                                        sum_ac5_all;
                                }

                                //END
                                var listEmployeeInsert = "";
                                var listTimeInsert = "";
                                for (var i = 0; i < resultDept.length; i++) {
                                    for (var j = 0; j < resultDept[i].listEmployee.length; j++) {

                                        // VALUE EMP
                                        listEmployeeInsert += "(" + USER_ID + "," + resultDept[i].departmentid + "," + resultDept[i].listEmployee[j].employee_id + ",'" +
                                            resultDept[i].listEmployee[j].name + "','" + weekFrom + "','" + weekTo + "'," + resultDept[i].sum_ac1_dept +
                                            "," + resultDept[i].sum_ac2_dept + "," +
                                            resultDept[i].sum_ac3_dept + "," + resultDept[i].sum_ac4_dept + "," +
                                            resultDept[i].sum_ac5_dept + "," + (resultDept[i].sum_ac1_dept + resultDept[i].sum_ac2_dept +
                                                resultDept[i].sum_ac3_dept + resultDept[i].sum_ac4_dept + resultDept[i].sum_ac5_dept) + "," +
                                            resultDept[i].time_in_lieu_dept + "," + resultDept[i].overtime_dept + ", " + sum_ac1_all +
                                            ", " + sum_ac2_all + ", " + sum_ac3_all + ", " + sum_ac4_all + ", " +
                                            sum_ac5_all + ", " + sum_all + ", " + time_in_lieu_all + ", " + overtime_all +
                                            "), ";
                                        //EMP
                                        // VALUE TIME CHARGE
                                        listTimeInsert += "(" + USER_ID + "," +
                                            resultDept[i].listEmployee[j].employee_id + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[1] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[1]) + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[2] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[2]) + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[3] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[3]) + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[4] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[4]) + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[5] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[5]) + "," +
                                            (resultDept[i].listEmployee[j].time_charge === undefined ? 0 : resultDept[i].listEmployee[j].time_charge) + "," + resultDept[i].listEmployee[j].time_in_lieu + ", " + resultDept[i].listEmployee[j].over_time + "), ";
                                        //TIME 3
                                    }
                                }
                                if (listEmployeeInsert !== "") {
                                    listEmployeeInsert = listEmployeeInsert.substring(0, listEmployeeInsert.length - 2);
                                }
                                if (listTimeInsert !== "") {
                                    listTimeInsert = listTimeInsert.substring(0, listTimeInsert.length - 2);
                                }
                                var queryInsertEmployee = "INSERT INTO time_employee_reports1 (user_id, departmentid, employee_id, employee, from_date, to_date, " +
                                    "time_ac1_dept, time_ac2_dept, time_ac3_dept,time_ac4_dept, time_ac5_dept, total_dept, time_in_lieu_dept, overtime_dept, time_ac1_all, time_ac2_all, time_ac3_all, time_ac4_all, time_ac5_all, total_all, time_in_lieu_all, overtime_all)" +
                                    " VALUES " + listEmployeeInsert;
                                var queryInsertTimeInSert = "INSERT INTO time_time_charge_reports1 (user_id, employee_id, time_ac1, time_ac2, time_ac3, time_ac4, time_ac5, time_charge_sum, time_in_lieu, time_over) VALUES " + listTimeInsert;
                                var queryDelEmployee = "DELETE FROM time_employee_reports1 WHERE user_id = " + USER_ID;
                                var queryDelTime = "DELETE FROM time_time_charge_reports1 WHERE user_id = " + USER_ID;
                                db.sequelize.query(queryDelEmployee)
                                    .success(function(delSuccessEmp) {
                                        db.sequelize.query(queryDelTime)
                                            .success(function(delSuccessTime) {
                                                //INSERT EMP
                                                if (listEmployeeInsert !== "") {
                                                    db.sequelize.query(queryInsertEmployee)
                                                        .success(function(insertSuccessEmp) {
                                                            // INSERT TIME
                                                            if (queryInsertTimeInSert !== "") {
                                                                db.sequelize.query(queryInsertTimeInSert)
                                                                    .success(function(insertSuccessTime) {

                                                                        //RES.JSON
                                                                        res.json({
                                                                            status: "success",
                                                                            result: resultDept
                                                                        });
                                                                        return;
                                                                        //END
                                                                    })
                                                                    .error(function(err) {
                                                                        console.log("*****ERROR:" + err + "*****");
                                                                        res.json({
                                                                            status: "error",
                                                                            result: []
                                                                        });
                                                                        return;
                                                                    });
                                                            }
                                                        })
                                                        .error(function(err) {
                                                            console.log("*****ERROR:" + err + "*****");
                                                            res.json({
                                                                status: "error",
                                                                result: []
                                                            });
                                                            return;
                                                        });
                                                }
                                            })
                                            .error(function(err) {
                                                console.log("*****ERROR:" + err + "*****");
                                                res.json({
                                                    status: "error",
                                                    result: []
                                                });
                                                return;
                                            });
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR:" + err + "*****");
                                        res.json({
                                            status: "error",
                                            result: []
                                        });
                                        return;
                                    });
                                //END INSERT
                            })
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "error",
                                    result: []
                                });
                                return;
                            });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: []
                        });
                        return;
                    });

            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
                return;
            });
    },

    SendMailNotification: function(req, res) {
        //SEND MAIL
        var queryNode = "SELECT sys_hierarchy_nodes.NODE_ID FROM sys_hierarchy_nodes " +
            "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
            "WHERE sys_hierarchy_group.GROUP_TYPE = 'Time Sheet' AND (sys_hierarchy_nodes.NODE_CODE = 'Staff' OR sys_hierarchy_nodes.NODE_CODE = 'Head of Dept.')";
        db.sequelize.query(queryNode)
            .success(function(resultNode) {
                var strNode = "";
                if (resultNode !== undefined && resultNode !== null) {
                    for (var i = 0; i < resultNode.length; i++) {
                        if (resultNode[i] !== undefined && resultNode[i] !== null) {
                            strNode += resultNode[i].NODE_ID + ", ";
                        }
                    }
                }
                if (strNode === "" || strNode.length === 0) {
                    strNode = "(-1)";
                } else {
                    strNode = "(" + strNode.substring(0, strNode.length - 2) + ")";
                }
                var queryHasTimeSheet = "SELECT time_tasks_week.user_id FROM time_tasks_week WHERE time_tasks_week.week_no = " + getWeekNo();
                db.sequelize.query(queryHasTimeSheet)
                    .success(function(resultHasTimeSheet) {
                        var strHasTimeSheet = "";
                        if (resultHasTimeSheet !== undefined && resultHasTimeSheet !== null) {
                            for (var i = 0; i < resultHasTimeSheet.length; i++) {
                                if (resultHasTimeSheet[i] !== undefined && resultHasTimeSheet[i] !== null) {
                                    strHasTimeSheet += resultHasTimeSheet[i].user_id + ", ";
                                }
                            }
                        }
                        if (strHasTimeSheet === "" || strHasTimeSheet.length === 0) {
                            strHasTimeSheet = "(-1)";
                        } else {
                            strHasTimeSheet = "(" + strHasTimeSheet.substring(0, strHasTimeSheet.length - 2) + ")";
                        }

                        var queryListEmp = "SELECT DISTINCT hr_employee.Email, hr_employee.FirstName, hr_employee.LastName FROM users " +
                            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
                            "INNER JOIN sys_hierarchies_users ON users.id = sys_hierarchies_users.USER_ID " +
                            "WHERE (hr_employee.TITLE = 'Staff' OR hr_employee.TITLE = 'Head of Dept.') " +
                            "AND sys_hierarchies_users.NODE_ID IN " + strNode + " AND sys_hierarchies_users.USER_ID NOT IN " + strHasTimeSheet;
                        db.sequelize.query(queryListEmp)
                            .success(function(resultListEmp) {
                                var FRIDAY = moment(moment().day(5)).format("DD/MM/YYYY");
                                for (var lM = 0; lM < resultListEmp.length; lM++) {
                                    var mailOptions = {
                                        senders: 'TimeSheet',
                                        recipients: resultListEmp[lM].Email,
                                        subject: '<span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Notification of Late Timesheet(s) Due</span>',
                                        htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Dear <b>' + resultListEmp[lM].FirstName + ' ' + resultListEmp[lM].LastName + '</label></b>,<br/><br/><br/>' +
                                            '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This is a reminder that your timesheet was due</label><b> FRIDAY, ' + FRIDAY + ' - 12:00pm.&nbsp;</b><br/><br/><br/>' +
                                            '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please log into the Timesheet System to complete and submit your timesheet. ' +
                                            'Failure to submit your timesheets may result in not being paid or loss of accrued leave.</label><br/><br/><br/>' +
                                            '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">If you have any questions regarding your timesheet in general then please contact your Team Leader.</label><br/><br/><br/>' +
                                            '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au:4000/#/login</label><br/><br/><br/>' +
                                            '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                                            '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Timesheet Reporting System</label><br/><br/><br/>' +
                                            '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label>' +
                                            '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                                            '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                                            '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                                            'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                                            '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                                    };
                                    //CALL SEND MAIL
                                    FunctionSendMail.sendEmail(req, res, mailOptions);
                                    // END CALL
                                }
                            })
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "success"
                                });
                                return;
                            });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
        //END

    },
    LoadInfoEmployee: function(req, res) {
        var USER_ID = req.body.USER_ID;
        var queryGetInfoUser = "SELECT hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct, " +
            "departments.departmentName FROM hr_employee " +
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
            "INNER JOIN departments ON departments.departmentid = hr_employee.Dept_ID " +
            "WHERE users.id = ?";
        db.sequelize.query(queryGetInfoUser, null, {
                raw: true
            }, [USER_ID])
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },
    LoadTypeLeave: function(req, res) {
        var queryGetTypeLeave = "SELECT hr_leave_type.leave_name, hr_leave_type.leave_type_id FROM hr_leave_type";
        db.sequelize.query(queryGetTypeLeave)
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },
    UpLeaveServer: function(req, res) {
        var info = req.body.info;
        db.HrLeave.create({
                application_date: info.application_date,
                start_date: info.start_date,
                finish_date: info.finish_date,
                work_date: info.work_date,
                standard: info.standard,
                time_leave: info.time_leave_real,
                reason_leave: info.reason_leave,
                user_id: info.USER_ID,
                status_id: info.statusID,
                created_by: info.USER_ID
            })
            .success(function(result) {
                if (result !== undefined && result !== null &&
                    result !== undefined && result !== null &&
                    result.dataValues !== undefined && result.dataValues !== null &&
                    result.dataValues.leave_id !== undefined && result.dataValues.leave_id !== null) {
                    for (var i = 0; i < info.infoTypeLeave.length; i++) {
                        chainer.add(db.HrLeaveDetail.create({
                            leave_id: result.dataValues.leave_id,
                            leave_type_id: info.infoTypeLeave[i].leave_type_id,
                            time_leave: info.infoTypeLeave[i].time_leave_real,
                            other: i === 4 ? info.infoTypeLeave[i].type_other : null,
                            reason_leave: info.infoTypeLeave[i].reason_leave,
                            created_by: info.USER_ID
                        }));
                    }
                }
                chainer.runSerially()
                    .success(function(resultAll) {
                        res.json({
                            status: "success"
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },

    // HISTORY LEAVE
    LoadHistoryLeave: function(req, res) {
        var searchObj = req.body.searchObj;
        //select
        var paramSelect = " AND ";
        for (var key in searchObj.select) {
            if (searchObj.select[key] !== undefined && searchObj.select[key] !== null && searchObj.select[key] !== "") {
                paramSelect += key + " = " + searchObj.select[key] + ", ";
            }
        }
        if (paramSelect.length !== 5) {
            paramSelect = paramSelect.substring(0, paramSelect.length - 2);
        } else {
            paramSelect = "";
        }
        //end select
        var queryGetAllMyLeave = "SELECT hr_employee.FirstName, hr_employee.LastName, hr_leave.start_date, time_task_status.name, " +
            "hr_leave.finish_date, hr_leave.standard, hr_leave.status_id, hr_leave.time_leave, hr_leave.reason_leave, hr_leave.leave_id, hr_leave.application_date FROM hr_employee " +
            "INNER JOIN users ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " +
            "WHERE hr_leave.user_id = ? " + paramSelect + " LIMIT ? OFFSET ?";
        var queryCountAllMyLeave = "SELECT COUNT(*) as COUNT FROM hr_employee " +
            "INNER JOIN users ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " +
            "WHERE hr_leave.user_id = ? " + paramSelect + " LIMIT ? OFFSET ?";
        var queryStatus = "SELECT time_task_status.task_status_id, time_task_status.name FROM time_task_status";
        db.sequelize.query(queryGetAllMyLeave, null, {
                raw: true
            }, [
                searchObj.USER_ID,
                searchObj.limit,
                searchObj.offset
            ])
            .success(function(result) {
                db.sequelize.query(queryStatus)
                    .success(function(resultStatus) {
                        db.sequelize.query(queryCountAllMyLeave, null, {
                                raw: true
                            }, [
                                searchObj.USER_ID,
                                searchObj.limit,
                                searchObj.offset
                            ])
                            .success(function(resultCount) {
                                if (result.length === 0 && paramSelect === "") {
                                    res.json({
                                        status: "success",
                                        result: null,
                                        count: 0,
                                        resultStatus: resultStatus
                                    });
                                    return;
                                } else if (result !== undefined &&
                                    result !== null &&
                                    result.length !== 0) {
                                    res.json({
                                        status: "success",
                                        result: result,
                                        count: resultCount[0].COUNT,
                                        resultStatus: resultStatus
                                    });
                                    return;
                                } else if (result.length === 0 && paramSelect !== "") {
                                    res.json({
                                        status: "success",
                                        result: [],
                                        count: 0,
                                        resultStatus: resultStatus
                                    });
                                    return;
                                }
                            })
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "error",
                                    result: null,
                                    count: 0,
                                    resultStatus: resultStatus
                                });
                                return;
                            });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: null,
                            count: 0,
                            resultStatus: resultStatus
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },
    // END HISTORY

    // VIEW LEAVE
    ViewLeave: function(req, res) {
        var leave_id = req.body.leave_id;
        var queryView = "SELECT hr_employee.FirstName, hr_employee.LastName, hr_leave.leave_id, " +
            "hr_leave.time_leave as time_leave_all, hr_leave.reason_leave as reason_leave_all, " +
            "hr_leave.application_date, hr_leave.work_date, hr_leave_detail.other, " +
            "hr_leave.start_date, hr_leave.finish_date, hr_leave_type.leave_name, " +
            "hr_leave_detail.time_leave, hr_leave_detail.reason_leave, time_task_status.name as status " +
            "FROM hr_employee " +
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " +
            "INNER JOIN hr_leave_detail ON hr_leave.leave_id = hr_leave_detail.leave_id " +
            "INNER JOIN hr_leave_type ON hr_leave_type.leave_type_id = hr_leave_detail.leave_type_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " +
            "WHERE hr_leave.leave_id = :leave_id";
        db.sequelize.query(queryView, null, {
                raw: true
            }, {
                leave_id: leave_id
            })
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
                return;
            });
    },
    //END LEAVE
};

//FUNCTION GET WEEKNO
var getWeekNo = function() {
    d = new Date();
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
};
//END

// FUNCTION TRACKER
var TracKerTimeSheet = function(info) {
    var arrayAction = {
        1: "Save",
        2: "Submit",
        3: "Approve",
        4: "Reject",
        5: "Resubmit"
    };
    var nameAction = arrayAction[info.statusID];
    var queryTracKer = "INSERT INTO time_tracker (name_action, user_id, creation_date,task_week_id) VALUES('" +
        nameAction + "'," + info.USER_ID + ",'" + info.date + "'," + info.idTaskWeek + ")";
    db.sequelize.query(queryTracKer)
        .success(function(result) {
            console.log("*****SAVE TRACKKER SUCCESS *****");
        })
        .error(function(err) {
            console.log("*****ERROR:" + err + "*****");
        });
};
//END


//FUNCTION GET FORMAT TIME_CHARGE
var getFortMatTimeCharge = function(time_charge) {
    if (time_charge !== undefined && time_charge !== null && time_charge !== 0) {
        var hours = parseInt(time_charge / 60);
        var minutes = parseInt(time_charge % 60);
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return hours + ':' + minutes;
    } else {
        return "-";
    }

};
//END

// FUNCTION CONVERT
var convertTime = function(time) {
    if (time === undefined || time === null || isNaN(time)) {
        return 0;
    } else {
        var tempTime = (time * 37.25) / 2235;
        var tempTimeInt = parseInt(tempTime);
        var tempDecimal = (tempTime - tempTimeInt).toFixed(3) * 100;
        if (tempDecimal >= 87.5) {
            tempTimeInt += 1;
        } else if (tempDecimal >= 62.5) {
            tempTimeInt += 0.75;
        } else if (tempDecimal >= 37.5) {
            tempTimeInt += 0.5;
        } else if (tempDecimal >= 12.5) {
            tempTimeInt += 0.25;
        }
        return tempTimeInt;
    }
};
//END CONVERT

// FUNCTION SEND MAIL
var SendMailTimeSheet = function(req, res, info) {
    var mailOptions = {};
    var query = "SELECT hr_employee.FirstName, hr_employee.Email, hr_employee.LastName, time_tasks_week.start_date, time_tasks_week.end_date " +
        "FROM hr_employee INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
        "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " +
        "WHERE time_tasks_week.task_week_id = " + info.idTaskWeek;
    db.sequelize.query(query)
        .success(function(result) {
            var start_date = "";
            var end_date = "";
            if (result[0] !== undefined && result[0] !== null) {
                start_date = moment(result[0].start_date).format('DD/MM/YYYY');
                end_date = moment(result[0].end_date).format('DD/MM/YYYY');
            }
            if (info.status === 4) {
                mailOptions = {
                    senders: 'TimeSheet',
                    recipients: result[0].Email,
                    subject: 'Notification of Rejected Timesheet(s)',
                    htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Attention: <b>' + result[0].FirstName + ' ' + result[0].LastName + ',</b></label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Your timesheet for the period (' + start_date + '–' + end_date + ') has been rejected.<br/><br/><br/> Please log into the Timesheet System to correct and re-submit your timesheet. ' +
                        'Failure to re-submit your timesheets may result in not being paid or loss of accrued leave.</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">If you have any questions regarding your timesheet in general then please contact your Team Leader.</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au:4000/#/login<label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Timesheet Reporting System<br></label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond' +
                        '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                        '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                        '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                        'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                        '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                };
                // END APPROVE
                //CALL SEND MAIL
                FunctionSendMail.sendEmail(req, res, mailOptions);
                // END CALL

            } else if (info.status === 3) {
                //IS APPROVE
                mailOptions = {
                    senders: 'TimeSheet',
                    recipients: result[0].Email,
                    subject: 'Notification of Approved Timesheet(s)',
                    htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Attention: <b>' +
                        result[0].FirstName + ' ' + result[0].LastName +
                        '</b></label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Your timesheet for the period (' +
                        start_date + '–' + end_date + ') has been approved.</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au:4000/#/login</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Timesheet Reporting System<label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label</i>' +
                        '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                        '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                        '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                        'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                        '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                };
                // END APPROVE

                //CALL SEND MAIL
                FunctionSendMail.sendEmail(req, res, mailOptions);
                // END CALL
            }
        })
        .error(function(err) {
            console.log("*****ERROR:" + err + "*****");
            res.josn({
                status: "error"
            });
            return;

        });

};
// END MAIL

// FUNCTION SEND MAIL NOTIFICATION
var job = new CronJob({
    cronTime: '00 00 07 * * 5',
    onTick: function(req, res) {
        // module.exports.SendMailNotification(req, res);
    },
    start: false,
    timeZone: 'Australia/Canberra'
        //Australia/Canberra
        //Asia/Bangkok
});
job.start();
//END NOTIFICATION
