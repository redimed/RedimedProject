//LIBRARY
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
var Q = require("q");
//END LIBRARY

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
        //DECLARATION
        var idTaskWeek = req.body.info;
        // END DECLARATION
        // QUERY 
        var strQuery = "SELECT SUM(time_tasks.time_charge) AS sumDATE, time_tasks.date, time_tasks.tasks_id, " +
            "time_tasks.activity_id, time_tasks_week.start_date, time_tasks_week.end_date, time_tasks_week.user_id, " +
            "time_tasks_week.task_week_id, time_tasks_week.time_in_lieu, time_tasks.time_charge, time_tasks_week.over_time, " +
            "time_task_status.name AS status, time_task_status.task_status_id, time_tasks_week.time_charge as chargeWeek, hr_employee.FirstName, hr_employee.LastName " +
            "FROM time_tasks INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "INNER JOIN users ON time_tasks_week.user_id = users.id " +
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "WHERE time_tasks.tasks_week_id = " + idTaskWeek + " GROUP BY time_tasks.date ORDER BY time_tasks.date";
        var strActivity = "SELECT SUM(time_tasks.time_charge) AS sumAC, time_tasks.date, " +
            "time_tasks.activity_id, time_tasks_week.start_date, time_tasks_week.end_date,  " +
            "time_tasks_week.task_week_id, time_tasks_week.time_in_lieu, time_tasks.time_charge, time_tasks_week.over_time, " +
            "time_task_status.name AS status, time_task_status.task_status_id, time_tasks_week.time_charge as chargeWeek, hr_employee.FirstName, hr_employee.LastName " +
            "FROM time_tasks INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "INNER JOIN users ON time_tasks_week.user_id = users.id " +
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "WHERE time_tasks.tasks_week_id = " + idTaskWeek + " GROUP BY time_tasks.date, time_activity.activity_id ORDER BY time_tasks.date";
        // END QUERY
        db.sequelize.query(strQuery)
            .success(function(result) {
                //CHECK LEAVE
                var queryGetLeaveApprove = "SELECT hr_leave.start_date, hr_leave.finish_date " +
                    "FROM hr_leave " +
                    "WHERE hr_leave.user_id = :userId AND hr_leave.status_id = 3";
                db.sequelize.query(queryGetLeaveApprove, null, {
                        raw: true
                    }, {
                        userId: result[0].user_id
                    })
                    .success(function(resultLeaveApprove) {
                        var forPermission = true;
                        if (resultLeaveApprove !== undefined &&
                            resultLeaveApprove !== null &&
                            resultLeaveApprove.length !== 0) {
                            //CHECK EXIST LEAVE
                            for (var keyTimeSheet in result) {
                                var checkExistLeave = false;
                                var date = moment(moment(result[keyTimeSheet].date).format("YYYY-MM-DD")).format("X");
                                for (var keyLeave in resultLeaveApprove) {
                                    var startDate = moment(moment(resultLeaveApprove[keyLeave].start_date).format("YYYY-MM-DD")).format("X");
                                    var finishDate = moment(moment(resultLeaveApprove[keyLeave].finish_date).format("YYYY-MM-DD")).format("X");
                                    if ((result[keyTimeSheet].activity_id === 15 ||
                                            result[keyTimeSheet].activity_id === 16 ||
                                            result[keyTimeSheet].activity_id === 17 ||
                                            result[keyTimeSheet].activity_id === 19 ||
                                            result[keyTimeSheet].activity_id === 25) &&
                                        date >= startDate &&
                                        date <= finishDate) {
                                        checkExistLeave = true;
                                    }
                                }
                                if (checkExistLeave === false) {
                                    forPermission = false;
                                }
                            }
                            //END CHECK EXIST LEAVE
                        } else {
                            forPermission = false;
                        }
                        //GET TIME SHEET
                        if (result === undefined || result === null || result.length === 0) {
                            res.json({
                                status: "success",
                                result: [],
                                resultActivity: [],
                                forPermission: forPermission
                            });
                            return;
                        } else {
                            db.sequelize.query(strActivity)
                                .success(function(resultActivity) {
                                    res.json({
                                        status: "success",
                                        result: result,
                                        resultActivity: resultActivity,
                                        forPermission: forPermission
                                    });
                                    return;
                                }).error(function(err) {
                                    console.log("*****ERROR:" + err + "*****");
                                    res.json({
                                        status: "error",
                                        result: [],
                                        resultActivity: [],
                                        forPermission: forPermission
                                    });
                                    return;
                                });

                        }
                        //END GET TIME SHEET
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    });
                //END CHECK LEAVE
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
        var strQuery = "SELECT DISTINCT time_tasks.date,time_tasks.tasks_id, time_tasks.task,time_item_task.units,time_item_code.ITEM_NAME,time_item_task.ITEM_ID, " +
            "time_item_code.IS_BILLABLE, time_item_task.ratio, time_activity.NAME, time_location.NAME AS LOCATION, departments.departmentName, " +
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
                db.sequelize.query("SELECT DISTINCT t.`tasks_id`, c.`item_id` as ITEM_ID, " +
                        "time_task_file.path_file, time_task_file.file_id, time_task_file.file_name, time_task_file.file_size " +
                        "FROM `time_tasks` t INNER JOIN `time_item_task` i ON i.`task_id` = t.`tasks_id` " +
                        "INNER JOIN `time_item_code` c ON c.`ITEM_ID` = i.`item_id`" +
                        "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = t.tasks_week_id " +
                        "INNER JOIN time_item_file ON time_item_file.task_id = i.task_id AND time_item_file.item_id = i.item_id " +
                        "INNER JOIN time_task_file ON time_task_file.file_id = time_item_file.file_id " +
                        " WHERE " +
                        "t.`tasks_week_id` = ?", null, {
                            raw: true
                        }, [info.ID])
                    .success(function(file) {
                        res.json({
                            status: "success",
                            result: result,
                            file: file
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
                            "WHERE departments.departmentType = 'Time Sheet'";
                    } else {
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
                                result: resultDept,
                                isStaff: (TITLE === "Head of Dept." || TITLE === "Director") ? false : true
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
        var queryStaff = "";
        if (req.body.listDept[0].USER_ID !== undefined &&
            req.body.listDept[0].isStaff === true) {
            queryStaff = "AND users.id = " + req.body.listDept[0].USER_ID;
        }
        var query = "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName, hr_employee.Employee_ID FROM hr_employee " +
            "INNER JOIN departments ON departments.departmentid = hr_employee.Dept_ID " +
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
            "WHERE departments.departmentid IN (" + strListDept + ") " + queryStaff;
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
                                            '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au</label><br/><br/><br/>' +
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
            .success(function(resultEmployee) {
                var queryGetTypeLeave = "SELECT hr_leave_type.leave_name, hr_leave_type.leave_type_id FROM hr_leave_type";
                db.sequelize.query(queryGetTypeLeave)
                    .success(function(resultTypeLeave) {
                        res.json({
                            status: "success",
                            resultEmployee: resultEmployee,
                            resultTypeLeave: resultTypeLeave
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
                is_approve_first: 1,
                user_id: info.USER_ID,
                status_id: info.statusID,
                status_id_first: info.statusID,
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
                            type_other: i === 4 ? info.infoTypeLeave[i].type_other : null,
                            reason_leave: info.infoTypeLeave[i].reason_leave,
                            created_by: info.USER_ID
                        }));
                    }
                }
                chainer.runSerially()
                    .success(function(resultAll) {
                        //SAVE TRACKER - SEND MAIL
                        if (info.statusID === 2 || info.statusID === 5) {

                            //TRACKER
                            var trackerInfo = {};

                            if (result !== undefined && result !== null &&
                                result !== undefined && result !== null &&
                                result.dataValues !== undefined && result.dataValues !== null &&
                                result.dataValues.leave_id !== undefined && result.dataValues.leave_id !== null) {
                                trackerInfo.leaveID = result.dataValues.leave_id;
                            }
                            trackerInfo.creationDate = moment().format("YYYY-MM-DD h:mm:ss");
                            trackerInfo.userID = info.USER_ID;
                            trackerInfo.statusID = info.statusID;
                            TracKerLeave(trackerInfo);
                            //END TRACKER

                            //CALL SEND MAIL
                            var sendMailInfo = {
                                userID: trackerInfo.userID,
                                dateSubmit: trackerInfo.creationDate
                            };
                            sendMailSubmitLeave(req, res, sendMailInfo);
                            // END CALL

                        }
                        //END TRACKER - SEND MAIL
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
        var queryGetAllMyLeave =
            "SELECT hr_employee.FirstName, hr_employee.LastName, hr_leave.start_date, time_task_status.name, " +
            "hr_leave.finish_date, hr_leave.standard, hr_leave.status_id, hr_leave.time_leave, hr_leave.is_approve_first, " +
            "hr_leave.is_approve_second, hr_leave.comments, " +
            "hr_leave.reason_leave, hr_leave.leave_id, hr_leave.application_date FROM hr_employee " +
            "INNER JOIN users ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " +
            "WHERE hr_leave.user_id = ? " + paramSelect + " ORDER BY hr_leave.start_date DESC LIMIT ? OFFSET ?";

        var queryCountAllMyLeave =
            "SELECT COUNT(*) as COUNT FROM hr_employee " +
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
                                if (result.length === 0 &&
                                    paramSelect === "") {
                                    res.json({
                                        status: "success",
                                        result: null,
                                        count: 0,
                                        resultStatus: resultStatus
                                    });
                                } else if (result !== undefined &&
                                    result !== null &&
                                    result.length !== 0) {
                                    //GET INFO LEVEL 1

                                    //GET LIST LEAVE ID
                                    var listLeaveId = "";
                                    result.forEach(function(element, index) {
                                        listLeaveId += element.leave_id + ", ";
                                    });
                                    if (listLeaveId === "") {
                                        listLeaveId = "(-1)";
                                    } else {
                                        listLeaveId = "(" + listLeaveId.substring(0, listLeaveId.length - 2) + ")";
                                    }
                                    //END LEAVE ID

                                    var queryGetNodeIdLevel1 = "SElECT DISTINCT sys_hierarchy_nodes.TO_NODE_ID " +
                                        "FROM hr_leave " +
                                        "INNER JOIN users ON hr_leave.user_id = users.id " +
                                        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                                        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                                        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                                        "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND hr_leave.leave_id IN " + listLeaveId;
                                    db.sequelize.query(queryGetNodeIdLevel1)
                                        .success(function(resultNodeIdLevel1) {
                                            if (resultNodeIdLevel1 !== undefined &&
                                                resultNodeIdLevel1 !== null &&
                                                resultNodeIdLevel1.length !== 0) {
                                                var listNodeLevel1 = "";
                                                resultNodeIdLevel1.forEach(function(elemLevel2, indexLevel2) {
                                                    listNodeLevel1 += elemLevel2.TO_NODE_ID + ", ";
                                                });
                                                if (listNodeLevel1 === "") {
                                                    listNodeLevel1 = "(-1)";
                                                } else {
                                                    listNodeLevel1 = "(" + listNodeLevel1.substring(0, listNodeLevel1.length - 2) + ")";
                                                }
                                                var queryGetNodeIdLevel2 = "SElECT DISTINCT sys_hierarchy_nodes.TO_NODE_ID " +
                                                    "FROM sys_hierarchy_nodes " +
                                                    "INNER JOIN sys_hierarchies_users ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                                                    "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                                                    "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID IN " + listNodeLevel1;
                                                db.sequelize.query(queryGetNodeIdLevel2)
                                                    .success(function(resultNodeLevel2) {
                                                        //GET INFO LEVEL 1 AND LEVEL 2
                                                        var queryGetInfoLevel1 =
                                                            "SElECT hr_employee.FirstName, hr_employee.LastName " +
                                                            "FROM hr_employee " +
                                                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                                                            "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                                                            "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                                                            "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                                                            "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID IN " + listNodeLevel1;
                                                        db.sequelize.query(queryGetInfoLevel1)
                                                            .success(function(resultInfoLevel1) {
                                                                if (resultNodeLevel2 !== undefined &&
                                                                    resultNodeLevel2 !== null &&
                                                                    resultNodeLevel2.length !== 0) {
                                                                    var listNodeLevel2 = "";
                                                                    resultNodeLevel2.forEach(function(elemLevel2, indexLevel2) {
                                                                        listNodeLevel2 += elemLevel2.TO_NODE_ID + ", ";
                                                                    });
                                                                    if (listNodeLevel2 === "") {
                                                                        listNodeLevel2 = "(-1)";
                                                                    } else {
                                                                        listNodeLevel2 = "(" + listNodeLevel2.substring(0, listNodeLevel2.length - 2) + ")";
                                                                    }
                                                                    var queryGetInfoLevel2 =
                                                                        "SElECT hr_employee.FirstName, hr_employee.LastName " +
                                                                        "FROM hr_employee " +
                                                                        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                                                                        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                                                                        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                                                                        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                                                                        "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID IN " + listNodeLevel2;
                                                                    db.sequelize.query(queryGetInfoLevel2)
                                                                        .success(function(resultInfoLevel2) {
                                                                            //PROCESSING FOREACH
                                                                            result.forEach(function(elemResult, indexResult) {
                                                                                if (elemResult.status_id === 1 || elemResult.status_id === 4) {
                                                                                    result[indexResult].person_charge = result[indexResult].FirstName + " " + result[indexResult].LastName;
                                                                                } else if ((elemResult.status_id === 2 || elemResult.status_id === 5) &&
                                                                                    elemResult.is_approve_first === 1 &&
                                                                                    elemResult.is_approve_second === 0) {
                                                                                    if (resultInfoLevel1 !== undefined &&
                                                                                        resultInfoLevel1 !== null &&
                                                                                        resultInfoLevel1.length !== 0) {
                                                                                        result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                    }

                                                                                } else {
                                                                                    //CHECK LEVEL 2
                                                                                    if (resultInfoLevel2 !== undefined &&
                                                                                        resultInfoLevel2 !== null &&
                                                                                        resultInfoLevel2.length !== 0 &&
                                                                                        result[indexResult].standard === 0) {
                                                                                        result[indexResult].person_charge = resultInfoLevel2[0].FirstName + " " + resultInfoLevel2[0].LastName;
                                                                                    } else if (resultInfoLevel1 !== undefined &&
                                                                                        resultInfoLevel1 !== null &&
                                                                                        resultInfoLevel1.length !== 0 &&
                                                                                        result[indexResult].standard === 1) {
                                                                                        result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                    }
                                                                                    //END LEVEL 2

                                                                                }
                                                                            });
                                                                            //END PROCESSING
                                                                            res.json({
                                                                                status: "success",
                                                                                result: result,
                                                                                count: resultCount[0].COUNT,
                                                                                resultStatus: resultStatus
                                                                            });
                                                                            return;
                                                                        })
                                                                        .error(function(err) {
                                                                            console.log("*****ERROR:" + err + "*****");
                                                                            res.json({
                                                                                status: "error"
                                                                            });
                                                                        });
                                                                } else {
                                                                    //PROCESSING FOREACH
                                                                    result.forEach(function(elemResult, indexResult) {
                                                                        if (elemResult.status_id === 1 || elemResult.status_id === 4) {
                                                                            result[indexResult].person_charge = result[indexResult].FirstName + " " + result[indexResult].LastName;
                                                                        } else if ((elemResult.status_id === 2 || elemResult.status_id === 5) &&
                                                                            elemResult.is_approve_first === 0 &&
                                                                            elemResult.is_approve_second === 1) {
                                                                            if (resultInfoLevel1 !== undefined &&
                                                                                resultInfoLevel1 !== null &&
                                                                                resultInfoLevel1.length !== 0) {
                                                                                result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                            }

                                                                        } else {
                                                                            //CHECK LEVEL 1
                                                                            if (resultInfoLevel1 !== undefined &&
                                                                                resultInfoLevel1 !== null &&
                                                                                resultInfoLevel1.length !== 0) {
                                                                                result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                            }
                                                                            //END LEVEL 1

                                                                        }
                                                                    });
                                                                    res.json({
                                                                        status: "success",
                                                                        result: result,
                                                                        count: resultCount[0].COUNT,
                                                                        resultStatus: resultStatus
                                                                    });
                                                                    return;
                                                                    //END PROCESSING
                                                                }

                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR:" + err + "*****");
                                                                res.json({
                                                                    status: "error"
                                                                });
                                                            });
                                                        //END GET INFO LEVEL 1 AND 2
                                                    })
                                                    .error(function(err) {
                                                        console.log("*****ERROR:" + err + "*****");
                                                        res.json({
                                                            status: "error"
                                                        });
                                                    });
                                            } else {
                                                res.json({
                                                    status: "success",
                                                    result: result,
                                                    count: resultCount[0].COUNT,
                                                    resultStatus: resultStatus
                                                });
                                            }
                                        })
                                        .error(function(err) {
                                            console.log("*****ERROR:" + err + "*****");
                                            res.json({
                                                status: "error"
                                            });
                                        });
                                    //END

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
        var queryView =
            "SELECT hr_employee.FirstName, hr_employee.LastName, hr_leave.leave_id, hr_leave.is_reject, " +
            "hr_leave.time_leave as time_leave_all, hr_leave.reason_leave as reason_leave_all, " +
            "hr_leave.application_date, hr_leave.work_date, hr_leave_detail.type_other, " +
            "hr_leave.start_date, hr_leave.finish_date, hr_leave_type.leave_name, " +
            "hr_leave_detail.time_leave, hr_leave_detail.reason_leave, time_task_status.name as status, time_task_status.task_status_id " +
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

    // SUBMIT ON VIEW LEAVE
    SubmitOnViewLeave: function(req, res) {
        var trackerInfo = req.body.info;
        var statusID = req.body.info.statusID;
        var leaveID = req.body.info.leaveID;
        var userID = req.body.info.userID;
        var dateUpdate = moment().format("YYYY-MM-DD hh:mm:ss");
        var queryUpdateStatus =
            "UPDATE hr_leave SET hr_leave.status_id = :statusID, status_id_first = :statusIdFirst, " +
            "last_update_date = :dateUpdate " +
            "WHERE hr_leave.leave_id = :leaveID";
        db.sequelize.query(queryUpdateStatus, null, {
                raw: true
            }, {
                statusID: statusID,
                statusIdFirst: statusID,
                dateUpdate: dateUpdate,
                leaveID: leaveID
            })
            .success(function(result) {
                //CALL TRACKER
                trackerInfo.creationDate = moment().format("YYYY-MM-DD h:mm:ss");
                TracKerLeave(trackerInfo);
                //END TRACKER

                //CALL SEND MAIL
                var sendMailInfo = {
                    userID: trackerInfo.userID,
                    dateSubmit: trackerInfo.creationDate
                };
                sendMailSubmitLeave(req, res, sendMailInfo);
                // END CALL

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
    //END SUBMIT ON VIEW

    //LOAD LEAVE EDIT
    LoadLeaveEdit: function(req, res) {
        var leaveID = req.body.leaveID;
        var queryLoadLeaveEdit =
            "SELECT hr_leave.leave_id, hr_leave.application_date, hr_leave.start_date, hr_leave.is_reject, hr_leave.status_id, " +
            "hr_leave.finish_date, hr_leave.work_date, hr_leave.standard, hr_leave.status_id, hr_leave.time_leave, departments.departmentName, " +
            "hr_leave.reason_leave, hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct " +
            "FROM hr_leave " +
            "INNER JOIN users ON users.id = hr_leave.user_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN departments ON departments.departmentid = hr_employee.Dept_ID " +
            "WHERE hr_leave.leave_id = :leaveID";
        var queryLoadLeaveDetailEdit =
            "SELECT hr_leave_detail.leave_detail_id, hr_leave_detail.time_leave, " +
            "hr_leave_detail.reason_leave, " +
            "hr_leave_detail.type_other, hr_leave_type.leave_name, hr_leave_type.leave_type_id " +
            "FROM hr_employee " +
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " +
            "INNER JOIN hr_leave_detail ON hr_leave.leave_id = hr_leave_detail.leave_id " +
            "INNER JOIN hr_leave_type ON hr_leave_type.leave_type_id = hr_leave_detail.leave_type_id " +
            "WHERE hr_leave.leave_id = :leaveID";
        db.sequelize.query(queryLoadLeaveEdit, null, {
                raw: true
            }, {
                leaveID: leaveID
            })
            .success(function(resultLeave) {
                db.sequelize.query(queryLoadLeaveDetailEdit, null, {
                        raw: true
                    }, {
                        leaveID: leaveID
                    })
                    .success(function(resultLeaveDetail) {
                        res.json({
                            status: "success",
                            resultLeave: resultLeave,
                            resultLeaveDetail: resultLeaveDetail
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            resultLeave: [],
                            resultLeaveDetail: []
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    resultLeave: [],
                    resultLeaveDetail: []
                });
                return;
            });
    },
    //END LOAD EDIT

    //UPDATE
    UpdateLeave: function(req, res) {
        var info = req.body.info;
        db.HrLeave.update({
                application_date: info.application_date,
                start_date: info.start_date,
                finish_date: info.finish_date,
                work_date: info.work_date,
                standard: info.standard,
                time_leave: info.time_leave_real,
                reason_leave: info.reason_leave,
                is_approve_first: 1,
                is_approve_second: 0,
                status_id: info.statusID,
                status_id_first: info.statusID,
                status_id_second: null,
                user_id: info.USER_ID,
                last_updated_by: info.USER_ID
            }, {
                leave_id: info.leave_id
            })
            .success(function(result) {
                for (var i = 0; i < info.infoTypeLeave.length; i++) {
                    chainer.add(db.HrLeaveDetail.update({
                        time_leave: info.infoTypeLeave[i].time_leave_real,
                        reason_leave: info.infoTypeLeave[i].reason_leave,
                        last_updated_by: info.USER_ID,
                        type_other: i === 4 ? info.infoTypeLeave[i].type_other : null
                    }, {
                        leave_detail_id: info.infoTypeLeave[i].leave_detail_id
                    }));
                }
                chainer.runSerially()
                    .success(function(resultAll) {
                        if (info.statusID === 2 || info.statusID === 5) {
                            //TRACKER LEAVE
                            var trackerInfo = {
                                statusID: info.statusID,
                                leaveID: info.leave_id,
                                creationDate: moment().format("YYYY-MM-DD h:mm:ss"),
                                userID: info.USER_ID
                            };
                            TracKerLeave(trackerInfo);
                            //END TRACKER

                            //CALL SEND MAIL
                            var sendMailInfo = {
                                userID: trackerInfo.userID,
                                dateSubmit: trackerInfo.creationDate
                            };
                            sendMailSubmitLeave(req, res, sendMailInfo);
                            // END CALL

                        }
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
    //END UPDATE

    //LIST LEAVE APPROVE
    LoadLeaveApprove: function(req, res) {
        var deferred = Q.defer();
        var info = req.body.info;
        var searchStr = " AND (",
            orderStr = " ORDER BY ",
            selectStr = " AND ";
        //search
        if (info.search[0] !== undefined &&
            info.search[0] !== null &&
            info.search[0] !== '' &&
            info.search[0] !== ' ') {
            searchStr += "hr_employee.FirstName like '%" + info.search[0] +
                "%' OR hr_employee.LastName like '%" + info.search[0] + "%') ";
        } else {
            searchStr = "";
        }
        //end search

        //order
        if (info.order[0] !== undefined &&
            info.order[0] !== null &&
            info.order[0] !== '' &&
            info.order[0] !== ' ') {
            orderStr += "hr_leave.start_date " + info.order[0];
        } else {
            orderStr = "";
        }
        //end order

        //sellect
        if (info.select[0] !== undefined &&
            info.select[0] !== null &&
            info.select[0] !== '' &&
            info.select[0] !== ' ') {
            selectStr += "time_task_status.task_status_id = " + info.select[0];
        } else {
            selectStr = "";
        }
        //end select

        var queryGetDept =
            "SELECT DISTINCT sys_hierarchies_users.DEPARTMENT_CODE_ID, sys_hierarchy_nodes.NODE_CODE, sys_hierarchy_nodes.NODE_ID " + //SELECT
            "FROM sys_hierarchies_users " + //FROM
            "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
            "WHERE sys_hierarchies_users.USER_ID = :userID"; //WHERE

        db.sequelize.query(queryGetDept, null, { //GET DEPARTMENT CODE, NODE CODE OF USER
                raw: true
            }, {
                userID: info.USER_ID
            })
            .success(function(resultDept) {
                if (resultDept !== undefined &&
                    resultDept !== null &&
                    resultDept[0] !== undefined &&
                    resultDept[0] !== null) {
                    var DEPARTMENT_CODE_ID = resultDept[0].DEPARTMENT_CODE_ID;
                    var NODE_CODE = resultDept[0].NODE_CODE;
                    var NODE_ID = resultDept[0].NODE_ID;
                    var queryGetListLeave = "";
                    var queryCountListLeave = "";
                    var queryGetUserSubordinate =
                        "SELECT DISTINCT sys_hierarchies_users.USER_ID, sys_hierarchies_users.DEPARTMENT_CODE_ID " + //SELECT
                        "FROM sys_hierarchies_users " + //FROM
                        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //INNER JOIN
                        "WHERE sys_hierarchy_nodes.TO_NODE_ID = :nodeId AND sys_hierarchies_users.DEPARTMENT_CODE_ID = :deptId"; //WHERE
                    db.sequelize.query(queryGetUserSubordinate, null, {
                            raw: true
                        }, {
                            nodeId: NODE_ID,
                            deptId: DEPARTMENT_CODE_ID
                        })
                        .success(function(resultSubordinate) {
                            var listUser = "";
                            if (resultSubordinate !== undefined &&
                                resultSubordinate !== null &&
                                resultSubordinate.length !== 0) {
                                for (var i = 0; i < resultSubordinate.length; i++) {
                                    listUser += resultSubordinate[i].USER_ID + ", ";
                                }
                                if (listUser !== "") {
                                    listUser = listUser.substring(0, listUser.length - 2);
                                    listUser = "(" + listUser + ")";
                                } else {
                                    listUser = "(-1)";
                                }
                            }
                            if (NODE_CODE === "Head of Dept." || NODE_CODE === "Director") {

                                if (NODE_CODE === "Head of Dept.") {
                                    queryGetListLeave =
                                        "SELECT hr_employee.FirstName, hr_employee.LastName, " + //SELECT
                                        "hr_leave.status_id, hr_leave.is_approve_first, hr_leave.is_approve_second, hr_leave.standard, " + //SELECT
                                        "hr_leave.leave_id, hr_leave.time_leave, hr_leave.reason_leave, hr_leave.start_date, hr_leave.finish_date, " + //SELECT
                                        "hr_leave.status_id_first as task_status_id, time_task_status.name " + //SElECT
                                        "FROM hr_employee " + //FROM
                                        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                        "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //INNER JOIN
                                        "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //INNER JOIN
                                        "WHERE hr_leave.status_id != 1 AND hr_leave.user_id IN " + listUser +
                                        selectStr + " " + searchStr + " " + orderStr + " LIMIT :limit OFFSET :offset";
                                    queryCountListLeave =
                                        "SELECT COUNT(*) " + //SElECT
                                        "FROM hr_employee " + //FROM
                                        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                        "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //INNER JOIN
                                        "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id_first " + //INNER JOIN
                                        "WHERE hr_leave.status_id != 1 AND hr_leave.user_id IN " + listUser +
                                        selectStr + " " + searchStr + " " + orderStr + " LIMIT :limit OFFSET :offset";
                                } else if (NODE_CODE === "Director") {
                                    queryGetListLeave = "SELECT hr_employee.FirstName, hr_employee.LastName, " + //SELECT
                                        "hr_leave.status_id, hr_leave.is_approve_first, hr_leave.is_approve_second, hr_leave.standard, " + //SELECT
                                        "hr_leave.leave_id, hr_leave.time_leave, hr_leave.reason_leave, hr_leave.start_date, hr_leave.finish_date, " + //SELECT
                                        "time_task_status.task_status_id, time_task_status.name " + //SElECT
                                        "FROM hr_employee " + //FROM
                                        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                        "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //INNER JOIN
                                        "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //INNER JOIN
                                        " AND ((hr_leave.is_approve_first = 0 AND hr_leave.is_approve_second = 1 AND hr_leave.standard = 0) OR hr_leave.user_id IN " +
                                        listUser + ") AND hr_leave.status_id!=1 " +
                                        selectStr + " " + searchStr + " " + orderStr + " LIMIT :limit OFFSET :offset";
                                    queryCountListLeave = "SELECT COUNT(*) " + //SElECT
                                        "FROM hr_employee " + //FROM
                                        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                        "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //INNER JOIN
                                        "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //INNER JOIN
                                        " AND ((hr_leave.is_approve_first = 0 AND hr_leave.is_approve_second = 1 AND hr_leave.standard = 0) OR hr_leave.user_id IN " +
                                        listUser + ") AND hr_leave.status_id!=1 " +
                                        selectStr + " " + searchStr + " " + orderStr + " LIMIT :limit OFFSET :offset";
                                }
                                db.sequelize.query(queryGetListLeave, null, {
                                        raw: true
                                    }, {
                                        limit: info.limit,
                                        offset: info.offset
                                    })
                                    .success(function(result) {
                                        db.sequelize.query(queryCountListLeave, null, {
                                                raw: true
                                            }, {
                                                limit: info.limit,
                                                offset: info.offset
                                            })
                                            .success(function(resultCount) {
                                                if (searchStr === "" &&
                                                    selectStr === "" &&
                                                    result.length === 0) {
                                                    res.json({
                                                        status: "success",
                                                        result: null
                                                    });
                                                    return;
                                                } else {
                                                    //PROMISE
                                                    var promise_chain = Q.fcall(function() {});
                                                    //END ERROR
                                                    result.forEach(function(elemResult, indexResult) {
                                                        var promise_link = function() {
                                                            var deferred = Q.defer();
                                                            //GET PERSON-IN-CHARGE
                                                            var queryGetNodeLevel1 =
                                                                "SELECT DISTINCT sys_hierarchy_nodes.TO_NODE_ID " +
                                                                "FROM sys_hierarchy_nodes " +
                                                                "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " +
                                                                "INNER JOIN users on users.id = sys_hierarchies_users.USER_ID " +
                                                                "INNER JOIN hr_leave ON hr_leave.user_id = users.id " +
                                                                "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                                                                "WHERE sys_hierarchy_group.GROUP_TYPE = 'Time Sheet' AND hr_leave.leave_id = :leaveId AND sys_hierarchies_users.DEPARTMENT_CODE_ID = :deptId";
                                                            db.sequelize.query(queryGetNodeLevel1, null, {
                                                                    raw: true
                                                                }, {
                                                                    leaveId: result[indexResult].leave_id,
                                                                    deptId: resultDept[0].DEPARTMENT_CODE_ID
                                                                })
                                                                .success(function(resultNodeLevel1) {
                                                                    var queryGetNodeLevel2 =
                                                                        "SELECT DISTINCT sys_hierarchy_nodes.TO_NODE_ID " +
                                                                        "FROM sys_hierarchy_nodes " +
                                                                        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " +
                                                                        "INNER JOIN users on users.id = sys_hierarchies_users.USER_ID " +
                                                                        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                                                                        "WHERE sys_hierarchy_group.GROUP_TYPE = 'Time Sheet' AND sys_hierarchy_nodes.NODE_ID = :nodeId";
                                                                    db.sequelize.query(queryGetNodeLevel2, null, {
                                                                            raw: true
                                                                        }, {
                                                                            nodeId: (resultNodeLevel1 !== undefined &&
                                                                                resultNodeLevel1 !== null &&
                                                                                resultNodeLevel1[0] !== undefined &&
                                                                                resultNodeLevel1[0] !== null &&
                                                                                !isNaN(resultNodeLevel1[0].TO_NODE_ID) ? resultNodeLevel1[0].TO_NODE_ID : -1)
                                                                        })
                                                                        .success(function(resultNodeLevel2) {
                                                                            var getInfoLevel1 =
                                                                                "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName " +
                                                                                "FROM hr_employee " +
                                                                                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                                                                                "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                                                                                "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                                                                                "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_group.GROUP_ID " +
                                                                                "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID = :nodeId";
                                                                            db.sequelize.query(getInfoLevel1, null, {
                                                                                    raw: true
                                                                                }, {
                                                                                    nodeId: (resultNodeLevel1 !== undefined &&
                                                                                        resultNodeLevel1 !== null &&
                                                                                        resultNodeLevel1[0] !== undefined &&
                                                                                        resultNodeLevel1[0] !== null &&
                                                                                        !isNaN(resultNodeLevel1[0].TO_NODE_ID) ? resultNodeLevel1[0].TO_NODE_ID : -1)
                                                                                })
                                                                                .success(function(resultInfoLevel1) {
                                                                                    var getInfoLevel2 =
                                                                                        "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName " +
                                                                                        "FROM hr_employee " +
                                                                                        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                                                                                        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                                                                                        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                                                                                        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_group.GROUP_ID " +
                                                                                        "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID = :nodeId";
                                                                                    db.sequelize.query(getInfoLevel2, null, {
                                                                                            raw: true
                                                                                        }, {
                                                                                            nodeId: (resultNodeLevel2 !== undefined &&
                                                                                                resultNodeLevel2 !== null &&
                                                                                                resultNodeLevel2[0] !== undefined &&
                                                                                                resultNodeLevel2[0] !== null &&
                                                                                                !isNaN(resultNodeLevel2[0].TO_NODE_ID) ? resultNodeLevel2[0].TO_NODE_ID : -1)
                                                                                        })
                                                                                        .success(function(resultInfoLevel2) {
                                                                                            if ((result[indexResult].status_id === 2 ||
                                                                                                    result[indexResult].status_id === 5) &&
                                                                                                result[indexResult].standard === 1) {
                                                                                                result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                            } else if ((result[indexResult].status_id === 2 ||
                                                                                                    result[indexResult].status_id === 5) &&
                                                                                                result[indexResult].standard === 0 &&
                                                                                                result[indexResult].is_approve_first === 1 &&
                                                                                                result[indexResult].is_approve_second === 0) {
                                                                                                result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                            } else if ((result[indexResult].status_id === 2 ||
                                                                                                    result[indexResult].status_id === 5) &&
                                                                                                result[indexResult].standard === 0 &&
                                                                                                result[indexResult].is_approve_first === 0 &&
                                                                                                result[indexResult].is_approve_second === 1) {
                                                                                                result[indexResult].person_charge = resultInfoLevel2[0].FirstName + " " + resultInfoLevel2[0].LastName;
                                                                                            } else if (elemResult.status_id === 3 &&
                                                                                                elemResult.standard === 0) {
                                                                                                //CHECK LEVEL 2
                                                                                                if (resultInfoLevel2 !== undefined &&
                                                                                                    resultInfoLevel2 !== null &&
                                                                                                    resultInfoLevel2[0] !== undefined &&
                                                                                                    resultInfoLevel2[0] !== null &&
                                                                                                    resultInfoLevel2[0].length !== 0) {
                                                                                                    result[indexResult].person_charge = resultInfoLevel2[0].FirstName + " " + resultInfoLevel2[0].LastName;
                                                                                                } else {
                                                                                                    if (resultInfoLevel1 !== undefined &&
                                                                                                        resultInfoLevel1 !== null &&
                                                                                                        resultInfoLevel1[0] !== undefined &&
                                                                                                        resultInfoLevel1[0] !== null &&
                                                                                                        resultInfoLevel1[0].length !== 0) {
                                                                                                        result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                                    }
                                                                                                }
                                                                                                //END CHECK
                                                                                            } else if (elemResult.status_id === 3 &&
                                                                                                elemResult.standard === 1) {
                                                                                                //LEVEL 1
                                                                                                if (resultInfoLevel1 !== undefined &&
                                                                                                    resultInfoLevel1 !== null &&
                                                                                                    resultInfoLevel1[0] !== undefined &&
                                                                                                    resultInfoLevel1[0] !== null &&
                                                                                                    resultInfoLevel1[0].length !== 0) {
                                                                                                    result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                                }
                                                                                                //END LEVEL 1
                                                                                            }
                                                                                            deferred.resolve(resultInfoLevel2);
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
                                                            // END GET PERSON-IN-CHARGE
                                                            return deferred.promise;
                                                        };
                                                        promise_chain = promise_chain.then(promise_link);
                                                    });
                                                    promise_chain.then(function() {
                                                        res.json({
                                                            status: "success",
                                                            result: result,
                                                            count: resultCount[0].COUNT
                                                        });
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

                                    })
                                    //ERROR
                                    .error(function(err) {
                                        console.log("*****ERROR:" + err + "*****");
                                        res.json({
                                            status: "error"
                                        });
                                        return;
                                    });
                                //END ERROR

                            }
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                result: []
                            });
                        });
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
            });

    },
    //END LIST APPROVE

    // APPROVE LEAVE
    ApproveLeave: function(req, res) {
        var info = req.body.info;
        var dateApprove = moment().format('YYYY-MM-DD h:mm:ss');
        var infoTracKer = {
            leaveID: info.leaveID,
            statusID: 3,
            userID: info.userID,
            creationDate: moment().format("YYYY-MM-DD h:mm:ss")
        };
        var queryGetInfoLeave = "SELECT hr_leave.leave_id, hr_leave.standard, hr_leave.is_approve_first, " +
            "hr_leave.is_approve_second, hr_leave.status_id_first, hr_leave.status_id_second " +
            "FROM hr_leave " +
            "WHERE hr_leave.leave_id = :leaveID";
        db.sequelize.query(queryGetInfoLeave, null, {
                raw: true
            }, {
                leaveID: info.leaveID
            })
            .success(function(resultInfoLeave) {
                if (resultInfoLeave !== undefined &&
                    resultInfoLeave !== null &&
                    resultInfoLeave[0] !== undefined &&
                    resultInfoLeave[0] !== null) {
                    //CHECK STANDARD
                    if (resultInfoLeave[0].standard === 0) {
                        if (resultInfoLeave[0].is_approve_first === 0 &&
                            resultInfoLeave[0].is_approve_second === 1) {

                            //APPROVE COMPLETE
                            db.HrLeave.update({
                                    status_id: 3,
                                    status_id_first: 3,
                                    status_id_second: 3,
                                    date_approve: dateApprove
                                }, {
                                    leave_id: info.leaveID
                                })
                                .success(function(result) {

                                    //TRACKER LEAVE
                                    TracKerLeave(infoTracKer);
                                    //END TRACKER

                                    //SEND MAIL
                                    sendMailInfo = {
                                        leaveID: info.leaveID,
                                        status: 3
                                    };
                                    sendMailLeave(req, res, sendMailInfo);
                                    //END SEND MAIL

                                    res.json({
                                        status: "success"
                                    });
                                    return;
                                })
                                .error(function(err) {
                                    console.log("*****ERROR:" + err + "*****");
                                    res.json({
                                        status: "success"
                                    });
                                    return;
                                });
                            //END APPROVE
                        } else if (resultInfoLeave[0].is_approve_first === 1 &&
                            resultInfoLeave[0].is_approve_second === 0) {
                            var queryCheckHeadOfDept = "SElECT sys_hierarchy_nodes.NODE_ID " +
                                "FROM sys_hierarchy_nodes " +
                                "INNER JOIN sys_hierarchies_users ON sys_hierarchy_nodes.TO_NODE_ID = sys_hierarchies_users.NODE_ID " +
                                "WHERE sys_hierarchies_users.USER_ID = :userID";
                            db.sequelize.query(queryCheckHeadOfDept, null, {
                                    raw: true
                                }, {
                                    userID: info.userID
                                })
                                .success(function(resultCheckHeadOfDept) {
                                    if (resultCheckHeadOfDept !== undefined &&
                                        resultCheckHeadOfDept !== null &&
                                        resultCheckHeadOfDept.length !== 0 &&
                                        resultCheckHeadOfDept[0] !== undefined &&
                                        resultCheckHeadOfDept[0] !== null &&
                                        !isNaN(resultCheckHeadOfDept[0].NODE_ID)) {
                                        //APPROVE FIRST AND WAITTING SECOND
                                        db.HrLeave.update({
                                                is_approve_first: 0,
                                                is_approve_second: 1,
                                                status_id_first: 3
                                            }, {
                                                leave_id: info.leaveID
                                            })
                                            .success(function(result) {

                                                //TRACKER LEAVE
                                                TracKerLeave(infoTracKer);
                                                //END TRACKER

                                                //SEND MAIL

                                                //GET NODE_ID DIRECTOR
                                                var queryGetNodeID = "SELECT DISTINCT sys_hierarchy_nodes.NODE_ID " +
                                                    "FROM sys_hierarchy_nodes " +
                                                    "INNER JOIN sys_hierarchy_group ON sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID " +
                                                    "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " +
                                                    "WHERE sys_hierarchies_users.USER_ID = :userID AND sys_hierarchy_group.GROUP_TYPE = 'Time Sheet'";
                                                db.sequelize.query(queryGetNodeID, null, {
                                                        raw: true
                                                    }, {
                                                        userID: info.userID
                                                    })
                                                    .success(function(resultNodeId) {
                                                        if (resultNodeId !== undefined &&
                                                            resultNodeId !== null &&
                                                            resultNodeId.length !== 0 &&
                                                            resultNodeId[0] !== undefined &&
                                                            resultNodeId[0] !== null &&
                                                            !isNaN(resultNodeId[0].NODE_ID)) {
                                                            var queryGetNodeIdManage =
                                                                "SELECT DISTINCT sys_hierarchy_nodes.NODE_ID " +
                                                                "FROM sys_hierarchy_nodes " +
                                                                "INNER JOIN sys_hierarchies_users ON sys_hierarchy_nodes.TO_NODE_ID = sys_hierarchies_users.NODE_ID " +
                                                                "WHERE sys_hierarchy_nodes.NODE_ID = :nodeId";
                                                            db.sequelize.query(queryGetNodeIdManage, null, {
                                                                    raw: true
                                                                }, {
                                                                    nodeId: resultNodeId[0].NODE_ID
                                                                })
                                                                .success(function(resultNodeIdManage) {
                                                                    if (resultNodeIdManage !== undefined &&
                                                                        resultNodeIdManage !== null &&
                                                                        resultNodeIdManage.length !== 0 &&
                                                                        resultNodeIdManage[0] !== undefined &&
                                                                        resultNodeIdManage[0] !== null &&
                                                                        !isNaN(resultNodeIdManage[0].NODE_ID)) {
                                                                        //GET INFOMATION MANAGE
                                                                        var queryGetInfoManage =
                                                                            "SELECT sys_hierarchies_users.USER_ID " +
                                                                            "FROM sys_hierarchies_users " +
                                                                            "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                                                                            "INNER JOIN sys_hierarchy_group ON sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID " +
                                                                            "WHERE sys_hierarchy_group.GROUP_TYPE = 'Time Sheet' AND sys_hierarchy_nodes.NODE_ID = :nodeId";
                                                                        db.sequelize.query(queryGetInfoManage, null, {
                                                                                raw: true
                                                                            }, {
                                                                                nodeId: resultNodeIdManage[0].NODE_ID
                                                                            })
                                                                            .success(function(resultInfoManage) {
                                                                                //NOTIFICATION SUBMIT LEAVE
                                                                                if (resultInfoManage !== undefined &&
                                                                                    resultInfoManage !== null &&
                                                                                    resultInfoManage.length !== 0 &&
                                                                                    resultInfoManage[0] !== undefined &&
                                                                                    resultInfoManage[0] !== null &&
                                                                                    resultInfoManage[0].length !== 0) {
                                                                                    //SEND MAIL
                                                                                    var sendMailInfo = {
                                                                                        userId: resultInfoManage[0].USER_ID,
                                                                                        dateSubmit: new Date(),
                                                                                        leaveID: info.leaveID
                                                                                    };
                                                                                    sendMailSubmitLeaveAgain(req, res, sendMailInfo);
                                                                                    //END SEND MAIL
                                                                                }
                                                                            })
                                                                            .error(function(err) {
                                                                                console.log("*****ERROR:" + err + "*****");
                                                                                res.json({
                                                                                    status: "error"
                                                                                });
                                                                            });
                                                                        //END GET
                                                                    } else {
                                                                        //NOTIFICATION APPROVE FOR EMPLOYEE
                                                                        //SEND MAIL
                                                                        sendMailInfo = {
                                                                            leaveID: info.leaveID,
                                                                            status: 3
                                                                        };
                                                                        sendMailLeave(req, res, sendMailInfo);
                                                                        //END SEND MAIL
                                                                    }
                                                                })
                                                                .error(function(err) {
                                                                    console.log("*****ERRROR:" + err + "*****");
                                                                    res.json({
                                                                        status: "error"
                                                                    });
                                                                });
                                                        } else {
                                                            res.json({
                                                                status: "error"
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
                                                //END

                                                //END SEND MAIL

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
                                        //END APPROVE FIRST
                                    } else {
                                        //APPROVE COMPLETE
                                        db.HrLeave.update({
                                                status_id: 3,
                                                is_approve_first: 0,
                                                is_approve_second: 1,
                                                status_id_first: 3,
                                                status_id_second: 3,
                                                date_approve: dateApprove
                                            }, {
                                                leave_id: info.leaveID
                                            })
                                            .success(function(result) {

                                                //TRACKER LEAVE
                                                TracKerLeave(infoTracKer);
                                                //END TRACKER

                                                //SEND MAIL
                                                sendMailInfo = {
                                                    leaveID: info.leaveID,
                                                    status: 3
                                                };
                                                sendMailLeave(req, res, sendMailInfo);
                                                //END SEND MAIL

                                                res.json({
                                                    status: "success"
                                                });
                                                return;
                                            })
                                            .error(function(err) {
                                                console.log("*****ERROR:" + err + "*****");
                                                res.json({
                                                    status: "success"
                                                });
                                                return;
                                            });
                                        //END APPROVE
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

                    } else if (resultInfoLeave[0].standard === 1) {
                        //APPROVE COMPLETE
                        db.HrLeave.update({
                                status_id: 3,
                                is_approve_first: 0,
                                is_approve_second: 1,
                                status_id_first: 3,
                                status_id_second: 3,
                                date_approve: dateApprove
                            }, {
                                leave_id: info.leaveID
                            })
                            .success(function(result) {

                                //TRACKER LEAVE
                                TracKerLeave(infoTracKer);
                                //END TRACKER

                                //SEND MAIL
                                sendMailInfo = {
                                    leaveID: info.leaveID,
                                    status: 3
                                };
                                sendMailLeave(req, res, sendMailInfo);
                                //END SEND MAIL

                                res.json({
                                    status: "success"
                                });
                                return;
                            })
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "success"
                                });
                                return;
                            });
                        //end approve
                    }
                    //end
                } else {
                    res.json({
                        status: "error"
                    });
                    return;
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
            });
    },
    //END APPROVE

    //REJECT LEAVE
    RejectLeave: function(req, res) {
        var info = req.body.info;
        db.HrLeave.update({
                status_id: 4,
                is_approve_first: 1,
                is_approve_second: 0,
                status_id_first: 4,
                status_id_second: null,
                comments: info.comments,
                is_reject: 1

            }, {
                leave_id: info.leaveID
            })
            //SUCCESS
            .success(function(result) {

                //TRACKER LEAVE
                var infoTracKer = {
                    leaveID: info.leaveID,
                    userID: info.userID,
                    creationDate: moment().format("YYYY-MM-DD h:mm:ss"),
                    statusID: 4
                };
                TracKerLeave(infoTracKer);
                //END TRACKER

                //SEND MAIL
                var infoSendMail = {
                    status: 4,
                    leaveID: info.leaveID,
                    userID: info.userID
                };
                sendMailLeave(req, res, infoSendMail);
                //END SEND MAIL

                // GET STATUS SUCCESS REJECT
                res.json({
                    status: "success"
                });
                return;
                //END GET 
            })
            //END SUCCESS

        //ERROR
        .error(function(err) {
            console.log("*****ERROR:" + err + "*****");
            res.json({
                status: "error"
            });
            return;
        });
        //END ERROR
    },
    //END REJECT

    //CHECK LEAVE EXIST
    CheckLeave: function(req, res) {
        // DECLARATION
        var USER_ID = req.body.USER_ID;
        var queryGetListTime =
            "SElECT hr_leave.start_date, hr_leave.finish_date, hr_leave.leave_id " + //SELECT
            "FROM hr_leave " + //FROM
            "WHERE hr_leave.user_id = :userId"; //WHERE
        //END DECLARATION

        db.sequelize.query(queryGetListTime, null, {
                raw: true
            }, {
                userId: USER_ID
            })
            //SUCCESS
            .success(function(resultListTime) {
                res.json({
                    status: "success",
                    result: resultListTime
                });
                return;
            })
            //END SUCCESS

        //ERROR
        .error(function(err) {
            console.log("*****ERROR:" + err + "*****");
            res.json({
                status: "error"
            });
            return;
        });
        //END ERROR
    },
    // END CHECK LEAVE

    // REPORT OWE LEAVE
    LoadReportOweLeave: function(req, res) {
        var info = req.body.info;
        //console.log(info);
        var stringEMP = "";
        var stringDept = "";
        var stringID = "";
        var start_date;
        var finish_date;
        var date;
        var flag1 = 0;
        var flag2 = 0;
        var flag3 = 0;
        var flag4 = 0;
        var listleave = [];
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;

        var sql_get_total_all = "SELECT COUNT(*) AS 'total_all' FROM hr_leave_owe WHERE create_id = " + info.USER_ID;
        var sql_get_total_Dept = "SELECT COUNT(department) AS 'total_Dept',department FROM hr_leave_owe WHERE create_id = " + info.USER_ID + " GROUP BY department ";
        var sql_get_data_hr_leave_owe_table = "SELECT users.id,hr_employee.FirstName, hr_employee.LastName, hr_employee.Employee_ID , departments.departmentid, departments.departmentName,time_tasks_week.time_charge,time_tasks_week.time_in_lieu, time_tasks_week.week_no,time_tasks_week.creation_date,time_tasks_week.last_update_date,time_tasks_week.task_week_id " + "FROM hr_employee " + "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " + "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " + "WHERE time_tasks_week.task_status_id = 3 AND departments.departmentid IN ( " + stringDept + " ) AND (time_tasks_week.week_no BETWEEN " + info.weekNoFrom + " AND " + info.weekNoTo + " ) AND hr_employee.Employee_ID IN ( " + stringEMP + " )";

        var delete_hr_leave_owe = "DELETE FROM hr_leave_owe WHERE create_id =" + info.USER_ID + " ";

        var delete_hr_leave_owe_table = "DELETE FROM hr_leave_owe_table WHERE create_id =" + info.USER_ID + " ";
        db.sequelize.query(delete_hr_leave_owe)
            .success(function(delete1) {
                db.sequelize.query(delete_hr_leave_owe_table)
                    .success(function(delete2) {

                        db.sequelize.query(sql_get_data_hr_leave_owe_table)
                            .success(function(data_hr_leave_owe_table) {
                                //console.log(data_hr_leave_owe_table)
                                for (var i = 0; i < data_hr_leave_owe_table.length; i++) {
                                    db.hr_leave_owe_table.create({
                                            create_id: info.USER_ID,
                                            user_id: data_hr_leave_owe_table[i].id,
                                            task_week_id: data_hr_leave_owe_table[i].task_week_id,
                                            Employee_id: data_hr_leave_owe_table[i].Employee_ID,
                                            Department_id: data_hr_leave_owe_table[i].departmentid,
                                            FirstName: data_hr_leave_owe_table[i].FirstName,
                                            LastName: data_hr_leave_owe_table[i].LastName,
                                            Department_name: data_hr_leave_owe_table[i].departmentName,
                                            weekno: data_hr_leave_owe_table[i].week_no,
                                            from_date: info.weekFrom,
                                            to_date: info.weekTo
                                        })
                                        .success(function(data_insert1) {
                                            flag1++;
                                            if (flag1 == data_hr_leave_owe_table.length) {
                                                //console.log("NEXXT")
                                                var sql_get_data_1 = "SELECT " + "hr_leave_owe_table.create_id, " + "hr_leave_owe_table.user_id, " + "hr_leave_owe_table.task_week_id, " + "hr_leave_owe_table.Employee_id, " + "hr_leave_owe_table.Department_id, " + "hr_leave_owe_table.from_date, " + "hr_leave_owe_table.to_date, " + "time_tasks.tasks_id, " + "time_tasks.date, " + "time_item_task.item_id " + "FROM hr_leave_owe_table " + "INNER JOIN time_tasks     ON time_tasks.tasks_week_id = hr_leave_owe_table.task_week_id " + "INNER JOIN time_item_task ON time_item_task.task_id  = time_tasks.tasks_id " + "WHERE time_item_task.item_id IN (15,16,17,19,24,25) AND hr_leave_owe_table.create_id=" + info.USER_ID + " ORDER BY hr_leave_owe_table.user_id ";
                                                db.sequelize.query(sql_get_data_1)
                                                    .success(function(data_1) {
                                                        //console.log(data_1)

                                                        for (var j = 0; j < data_1.length; j++) {
                                                            stringID += data_1[j].user_id + ", ";
                                                        }
                                                        stringID += 0;
                                                        //console.log(stringID)
                                                        var sql_get_data_2 = "SELECT leave_id,start_date,finish_date,status_id,user_id " + "FROM hr_leave " + "WHERE user_id IN (" + stringID + ") AND status_id=3 ORDER BY user_id ";
                                                        db.sequelize.query(sql_get_data_2)
                                                            .success(function(data_2) {
                                                                for (var x = 0; x < data_2.length; x++) {
                                                                    start_date = moment(moment(data_2[x].start_date).format("YYYY-MM-DD")).format("X");
                                                                    finish_date = moment(moment(data_2[x].finish_date).format("YYYY-MM-DD")).format("X");
                                                                    for (var y = 0; y < data_1.length; y++) {
                                                                        date = moment(moment(data_1[y].date).format("YYYY-MM-DD")).format("X");
                                                                        if (data_1[y].user_id == data_2[x].user_id) {
                                                                            if (date < start_date || date > finish_date) {

                                                                                listleave.push(data_1[y]);
                                                                            }
                                                                        }
                                                                    }

                                                                }
                                                                for (var q = 0; q < listleave.length; q++) {
                                                                    db.hr_leave_owe.create({
                                                                            create_id: listleave[q].create_id,
                                                                            user_id: listleave[q].user_id,
                                                                            department: listleave[q].Department_id,
                                                                            date_leave: listleave[q].date,
                                                                            employee: listleave[q].Employee_id,
                                                                            from_date: listleave[q].from_date,
                                                                            to_date: listleave[q].to_date,
                                                                            created_by: info.USER_ID
                                                                        })
                                                                        .success(function(data_insert2) {
                                                                            flag2++;
                                                                            if (flag2 == listleave.length)

                                                                                db.sequelize.query(sql_get_total_all)
                                                                                .success(function(data_total_all) {
                                                                                    db.sequelize.query(sql_get_total_Dept)
                                                                                        .success(function(data_total_Dept) {

                                                                                            for (var u = 0; u < data_total_Dept.length; u++) {
                                                                                                for (var t = 0; t < listleave.length; t++) {
                                                                                                    db.hr_leave_owe.update({
                                                                                                            total_all: data_total_all[0].total_all,
                                                                                                            total_Dept: data_total_Dept[u].total_Dept
                                                                                                        }, {
                                                                                                            department: data_total_Dept[u].department
                                                                                                        })
                                                                                                        .success(function(success) {
                                                                                                            flag4++;
                                                                                                            if (flag3 == data_total_Dept.length && flag4 == listleave.length) {
                                                                                                                res.json({
                                                                                                                    status: "success"
                                                                                                                });
                                                                                                                return;
                                                                                                            }
                                                                                                        })
                                                                                                        .error(function(err) {
                                                                                                            console.log("*****ERROR: " + err + " *****");
                                                                                                            res.json({
                                                                                                                status: "error"
                                                                                                            });
                                                                                                            return;
                                                                                                        })
                                                                                                }
                                                                                                flag3++;
                                                                                            }
                                                                                        })
                                                                                        .error(function(err) {
                                                                                            console.log("*****ERROR: " + err + " *****");
                                                                                            res.json({
                                                                                                status: "error"
                                                                                            });
                                                                                            return;
                                                                                        })
                                                                                })
                                                                                .error(function(err) {
                                                                                    console.log("*****ERROR: " + err + " *****");
                                                                                    res.json({
                                                                                        status: "error"
                                                                                    });
                                                                                    return;
                                                                                })

                                                                        })
                                                                        .error(function(err) {
                                                                            console.log("*****ERROR: " + err + " *****");
                                                                            res.json({
                                                                                status: "error"
                                                                            });
                                                                            return;
                                                                        })
                                                                }
                                                                //console.log(listleave)


                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR: " + err + " *****");
                                                                res.json({
                                                                    status: "error"
                                                                });
                                                                return;
                                                            })
                                                    })
                                                    .error(function(err) {
                                                        console.log("*****ERROR: " + err + " *****");
                                                        res.json({
                                                            status: "error"
                                                        });
                                                        return;
                                                    })
                                            }
                                        })
                                        .error(function(err) {
                                            console.log("*****ERROR: " + err + " *****");
                                            res.json({
                                                status: "error"
                                            });
                                            return;
                                        })
                                }
                            })
                            .error(function(err) {
                                console.log("*****ERROR: " + err + " *****");
                                res.json({
                                    status: "error"
                                });
                                return;
                            })

                    })

            })
            .error(function(err) {
                console.log("*****ERROR: " + err + " *****");
                res.json({
                    status: "error"
                });
                return;
            })

        .error(function(err) {
            console.log("*****ERROR: " + err + " *****");
            res.json({
                status: "error"
            });
            return;
        })
    },
    //END REPORT OWE LEAVE

    //REPORT TIME IN LIEU
    LoadReportTimeInLieu: function(req, res) {
        var info = req.body.info;
        //console.log(info);
        //CHUYEN LIST EMPL VA LIST DEPT THANH CHUOI STRING
        var stringEMP = "";
        var stringDept = "";
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        var time_in_lieu_remain_all = [];
        var sum_ = 0;
        var flag1 = 0;
        var flag2 = 0;
        var flag3 = 0;
        var flag4 = 0;
        var time_in_lieu_remain_Dept = 0;
        var time_in_lieu_remain_total = 0;
        var time_in_lieu_used_Dept = 0;
        var time_in_lieu_used_total = 0;
        var time_in_lieu_week_Dept = 0;
        var time_in_lieu_week_total = 0;
        // console.log(stringEMP);
        // console.log(stringDept);
        //XU LY TAI DAY
        //1.XOA TAT CA DU LIEU TRONG TIME IN LIEU REPORT VA TIME IN LIEU DETAIL REPORT
        var sql_delete_time_in_lieu_detail = "DELETE FROM time_in_lieu_detail WHERE user_id=" + info.USER_ID;
        db.sequelize.query(sql_delete_time_in_lieu_detail)
            .success(function(data_delete_time_in_lieu_detail) {

                var sql_delete_timeinlieu_report = "DELETE FROM time_in_lieu_report WHERE user_id=" + info.USER_ID;
                db.sequelize.query(sql_delete_timeinlieu_report)
                    .success(function(data_delete_timeinlieu_report) {
                        var sql_delete_timeinlieu_detail_report = "DELETE FROM time_in_lieu_detail_report WHERE user_id=" + info.USER_ID;
                        db.sequelize.query(sql_delete_timeinlieu_detail_report)
                            .success(function(data_delete_timeinlieu_detail_report) {
                                // 2. LAY DU LIEU CAN THIET TU CAC BANG DE INSERT TIME IN LIEU REPORT

                                var sql_data_time_in_lieu = "SELECT users.id,hr_employee.FirstName, hr_employee.LastName, hr_employee.Employee_ID , departments.departmentid, departments.departmentName,time_tasks_week.time_charge,time_tasks_week.time_in_lieu, time_tasks_week.week_no,time_tasks_week.creation_date,time_tasks_week.last_update_date,time_tasks_week.task_week_id " + "FROM hr_employee " + "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " + "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " + "WHERE time_tasks_week.task_status_id = 3 AND departments.departmentid IN ( " + stringDept + " ) AND (time_tasks_week.week_no BETWEEN " + info.weekNoFrom + " AND " + info.weekNoTo + " ) AND hr_employee.Employee_ID IN ( " + stringEMP + " )";

                                db.sequelize.query(sql_data_time_in_lieu)
                                    .success(function(data_time_in_lieu) {
                                        for (var n = 0; n < data_time_in_lieu.length; n++) {
                                            db.time_in_lieu_report.create({
                                                    FirstName: data_time_in_lieu[n].FirstName,
                                                    task_week_id: data_time_in_lieu[n].task_week_id,
                                                    LastName: data_time_in_lieu[n].LastName,
                                                    Employee_id: data_time_in_lieu[n].Employee_ID,
                                                    Department_id: data_time_in_lieu[n].departmentid,
                                                    Department_name: data_time_in_lieu[n].departmentName,
                                                    weekno: data_time_in_lieu[n].week_no,
                                                    time_in_lieu: data_time_in_lieu[n].time_in_lieu,
                                                    time_charge: data_time_in_lieu[n].time_charge,
                                                    user_id: info.USER_ID,
                                                    from_date: info.weekFrom,
                                                    to_date: info.weekTo,
                                                    Creation_by: info.USER_ID
                                                })
                                                .success(function(data_time_in_lieu_report) {
                                                    flag1++;
                                                    //3.LAY TONG TIME IN LIEU DA SU DUNG
                                                    if (flag1 == data_time_in_lieu.length) {
                                                        var sql_time_in_lieu_data = "SELECT time_in_lieu_report.from_date, " + " time_in_lieu_report.to_date, " + " time_in_lieu_report.weekno, " + " time_in_lieu_report.task_week_id, " + " time_in_lieu_report.user_id, " + " time_item_task.item_id, " + " time_in_lieu_report.Department_id, " + " time_in_lieu_report.Employee_id, " + " SUM(time_item_task.time_charge) AS 'time_in_lieu_used', " + " time_in_lieu_report.time_in_lieu AS 'time_in_lieu_week' " + " FROM time_tasks " + " INNER JOIN time_in_lieu_report ON time_tasks.tasks_week_id = time_in_lieu_report.task_week_id " + " INNER JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id " + " WHERE time_in_lieu_report.Employee_id IN(" + stringEMP + ") AND time_in_lieu_report.Department_id IN (" + stringDept + ") " + " AND time_item_task.item_id=22 AND time_in_lieu_report.user_id=" + info.USER_ID + " " + " GROUP BY time_in_lieu_report.Employee_id ";
                                                        db.sequelize.query(sql_time_in_lieu_data)
                                                            .success(function(data_time_in_lieu_data) {
                                                                //tao 1 bang detail luu nhung thong tin trong data_time_in_lieu_data nay sau do tinh tong cac time_in_lieu de
                                                                // insert vao bang time_in_lieu_detail_report la` bang? dung de in KQ ra trong file pdf

                                                                for (var h = 0; h < data_time_in_lieu_data.length; h++) {

                                                                    db.time_in_lieu_detail.create({
                                                                            task_week_id: data_time_in_lieu_data[h].task_week_id,
                                                                            user_id: info.USER_ID,
                                                                            item_id: data_time_in_lieu_data[h].item_id,
                                                                            Employee_id: data_time_in_lieu_data[h].Employee_id,
                                                                            Department_id: data_time_in_lieu_data[h].Department_id,
                                                                            weekno: data_time_in_lieu_data[h].weekno,
                                                                            time_in_lieu_used: data_time_in_lieu_data[h].time_in_lieu_used,
                                                                            time_in_lieu_week: data_time_in_lieu_data[h].time_in_lieu_week,
                                                                            from_date: data_time_in_lieu_data[h].from_date,
                                                                            to_date: data_time_in_lieu_data[h].to_date,
                                                                            Creation_by: info.USER_ID

                                                                        })
                                                                        .success(function(data_time_in_lieu_detail) {
                                                                            flag2++; //insert time_in_lieu_detail_report sau khi tinh toan
                                                                            if (flag2 == data_time_in_lieu_data.length) {
                                                                                var sql_time_in_lieu = "SELECT SUM(time_in_lieu_week) AS 'time_in_lieu_week_all',SUM(time_in_lieu_used) AS 'time_in_lieu_used_all',user_id,Employee_id,Department_id,item_id,from_date,to_date " + "FROM time_in_lieu_detail " + "WHERE Employee_id IN (" + stringEMP + ") AND user_id =" + info.USER_ID + " " + "GROUP BY Employee_id ";
                                                                                db.sequelize.query(sql_time_in_lieu)
                                                                                    .success(function(data_time_in_lieu_detail_data) {


                                                                                        for (var y = 0; y < data_time_in_lieu_detail_data.length; y++) {
                                                                                            time_in_lieu_remain_all[y] = data_time_in_lieu_detail_data[y].time_in_lieu_week_all - data_time_in_lieu_detail_data[y].time_in_lieu_used_all;

                                                                                        }
                                                                                        console.log(time_in_lieu_remain_all);
                                                                                        for (var t = 0; t < data_time_in_lieu_detail_data.length; t++) {
                                                                                            db.time_in_lieu_detail_report.create({
                                                                                                    user_id: data_time_in_lieu_detail_data[t].user_id,
                                                                                                    Employee_id: data_time_in_lieu_detail_data[t].Employee_id,
                                                                                                    Department_id: data_time_in_lieu_detail_data[t].Department_id,
                                                                                                    time_in_lieu_remain_all: time_in_lieu_remain_all[t],
                                                                                                    time_in_lieu_used_all: data_time_in_lieu_detail_data[t].time_in_lieu_used_all,
                                                                                                    from_date: data_time_in_lieu_detail_data[t].from_date,
                                                                                                    to_date: data_time_in_lieu_detail_data[t].to_date,
                                                                                                    time_in_lieu_week_all: data_time_in_lieu_detail_data[t].time_in_lieu_week_all,
                                                                                                    Creation_by: info.USER_ID

                                                                                                })
                                                                                                .success(function(data_time_in_lieu_detail_report) {

                                                                                                    flag3++;
                                                                                                    //4. ADD SUM by DEPT_ID, SUM ALL
                                                                                                    if (flag3 == data_time_in_lieu_detail_data.length) {
                                                                                                        var sql_time_in_lieu_remain_Dept = "SELECT SUM(time_in_lieu_remain_all) AS 'time_in_lieu_remain_Dept',Employee_id,Department_id FROM time_in_lieu_detail_report WHERE user_id =" + info.USER_ID + " GROUP BY Department_id";
                                                                                                        db.sequelize.query(sql_time_in_lieu_remain_Dept)
                                                                                                            .success(function(data_time_in_lieu_remain_Dept) {

                                                                                                                var sql_time_in_lieu_remain_total = "SELECT SUM(time_in_lieu_remain_all) AS 'time_in_lieu_remain_total' ,Employee_id,Department_id  FROM time_in_lieu_detail_report WHERE user_id =" + info.USER_ID + " ";
                                                                                                                db.sequelize.query(sql_time_in_lieu_remain_total)
                                                                                                                    .success(function(data_time_in_lieu_remain_total) {

                                                                                                                        var sql_time_in_lieu_used_Dept = "SELECT SUM(time_in_lieu_used_all) AS 'time_in_lieu_used_Dept' ,Employee_id,Department_id FROM time_in_lieu_detail_report WHERE user_id =" + info.USER_ID + " GROUP BY Department_id ";
                                                                                                                        db.sequelize.query(sql_time_in_lieu_used_Dept)
                                                                                                                            .success(function(data_time_in_lieu_used_Dept) {

                                                                                                                                var sql_time_in_lieu_used_total = "SELECT SUM(time_in_lieu_used_all) AS 'time_in_lieu_used_total' ,Employee_id,Department_id FROM time_in_lieu_detail_report WHERE user_id =" + info.USER_ID + " ";
                                                                                                                                db.sequelize.query(sql_time_in_lieu_used_total)
                                                                                                                                    .success(function(data_time_in_lieu_used_total) {

                                                                                                                                        var sql_time_in_lieu_week_Dept = "SELECT SUM(time_in_lieu_week_all) AS 'time_in_lieu_week_Dept' ,Employee_id,Department_id FROM time_in_lieu_detail_report WHERE user_id =" + info.USER_ID + " GROUP BY Department_id ";
                                                                                                                                        db.sequelize.query(sql_time_in_lieu_week_Dept)
                                                                                                                                            .success(function(data_time_in_lieu_week_Dept) {

                                                                                                                                                var sql_time_in_lieu_week_total = "SELECT SUM(time_in_lieu_week_all) AS 'time_in_lieu_week_total' ,Employee_id,Department_id FROM time_in_lieu_detail_report WHERE user_id =" + info.USER_ID + " ";
                                                                                                                                                db.sequelize.query(sql_time_in_lieu_week_total)
                                                                                                                                                    .success(function(data_time_in_lieu_week_total) {
                                                                                                                                                        //console.log(data_time_in_lieu_week_total)
                                                                                                                                                        for (var l = 0; l < data_time_in_lieu_week_Dept.length; l++) {

                                                                                                                                                            db.time_in_lieu_detail_report.update({
                                                                                                                                                                    time_in_lieu_remain_Dept: data_time_in_lieu_remain_Dept[l].time_in_lieu_remain_Dept,
                                                                                                                                                                    time_in_lieu_remain_total: data_time_in_lieu_remain_total[0].time_in_lieu_remain_total,
                                                                                                                                                                    time_in_lieu_used_Dept: data_time_in_lieu_used_Dept[l].time_in_lieu_used_Dept,
                                                                                                                                                                    time_in_lieu_used_total: data_time_in_lieu_used_total[0].time_in_lieu_used_total,
                                                                                                                                                                    time_in_lieu_week_Dept: data_time_in_lieu_week_Dept[l].time_in_lieu_week_Dept,
                                                                                                                                                                    time_in_lieu_week_total: data_time_in_lieu_week_total[0].time_in_lieu_week_total
                                                                                                                                                                }, {
                                                                                                                                                                    Employee_id: data_time_in_lieu_week_Dept[l].Employee_id,
                                                                                                                                                                    user_id: info.USER_ID
                                                                                                                                                                })
                                                                                                                                                                .success(function(data_finish) {
                                                                                                                                                                    flag4++;
                                                                                                                                                                    if (flag4 == data_time_in_lieu_week_Dept.length) {
                                                                                                                                                                        res.json({
                                                                                                                                                                            status: "success"
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
                                                                                                                                                                })

                                                                                                                                                        }

                                                                                                                                                    })
                                                                                                                                                    .error(function(err) {
                                                                                                                                                        console.log("*****ERROR:" + err + "*****");
                                                                                                                                                        res.json({
                                                                                                                                                            status: "error"
                                                                                                                                                        });
                                                                                                                                                        return;
                                                                                                                                                    })

                                                                                                                                            })
                                                                                                                                            .error(function(err) {
                                                                                                                                                console.log("*****ERROR:" + err + "*****");
                                                                                                                                                res.json({
                                                                                                                                                    status: "error"
                                                                                                                                                });
                                                                                                                                                return;
                                                                                                                                            })

                                                                                                                                    })
                                                                                                                                    .error(function(err) {
                                                                                                                                        console.log("*****ERROR:" + err + "*****");
                                                                                                                                        res.json({
                                                                                                                                            status: "error"
                                                                                                                                        });
                                                                                                                                        return;
                                                                                                                                    })

                                                                                                                            })
                                                                                                                            .error(function(err) {
                                                                                                                                console.log("*****ERROR:" + err + "*****");
                                                                                                                                res.json({
                                                                                                                                    status: "error"
                                                                                                                                });
                                                                                                                                return;
                                                                                                                            })

                                                                                                                    })
                                                                                                                    .error(function(err) {
                                                                                                                        console.log("*****ERROR:" + err + "*****");
                                                                                                                        res.json({
                                                                                                                            status: "error"
                                                                                                                        });
                                                                                                                        return;
                                                                                                                    })

                                                                                                            })
                                                                                                            .error(function(err) {
                                                                                                                console.log("*****ERROR:" + err + "*****");
                                                                                                                res.json({
                                                                                                                    status: "error"
                                                                                                                });
                                                                                                                return;
                                                                                                            })
                                                                                                    }
                                                                                                    //END 4.
                                                                                                })
                                                                                                .error(function(err) {
                                                                                                    console.log("*****ERROR: " + err + "*****");
                                                                                                    res.json({
                                                                                                        status: "error"
                                                                                                    });
                                                                                                    return;
                                                                                                })
                                                                                        }
                                                                                    })
                                                                                    .error(function(err) {
                                                                                        console.log("*****ERROR:" + err + "*****");
                                                                                        res.json({
                                                                                            status: "error"
                                                                                        });
                                                                                        return;
                                                                                    })
                                                                            }
                                                                        })
                                                                        .error(function(err) {
                                                                            console.log("*****ERROR:" + err + "*****");
                                                                            res.json({
                                                                                status: "error"
                                                                            });
                                                                            return;
                                                                        })

                                                                }
                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR:" + err + "*****");
                                                                res.json({
                                                                    status: "error"
                                                                });
                                                                return;
                                                            })
                                                    }
                                                    //END 3.
                                                })
                                                .error(function(err) {
                                                    res.json(500, {
                                                        'status': 'error',
                                                        'message': err
                                                    });
                                                })
                                        }
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR:" + err + "*****");
                                        res.json({
                                            status: "error"
                                        });
                                        return;
                                    })
                            })
                            .error(function(err) {

                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "error"
                                });
                                return;
                            })
                            // END XOA DETAIL TIME IN LIEU
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    })

            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            })
            //1.END XOA TIME IN LIEU REPORT

        //END
    },
    //END TIME IN LIEU

    //REPORT UTILIZATION RATIO DETAIL
    LoadReportUtilizationRatioDetail: function(req, res) {
        var info = req.body.info;
        //console.log(info);
        var stringEMP = "";
        var stringDept = "";
        var stringWeek = "";
        var stringItem = "";
        var stringline1 ="";
        var flag1 = 0;
        var flag2 = 0;
        var flag3 = 0;
        var flag4 = 0;
        var flag5 = 0;
        var flag6 = 0;
        var co1   = 0;
        var co2   = 0;
        var time_charge_1_all = 0;
        var time_charge_2_all = 0;
        var time_charge_3_all = 0;
        var time_charge_4_all = 0;
        var time_charge_5_all = 0;
        var time_charge_all = 0;
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        var sql_get_data_time_activity_report = "SELECT user_id,task_week_id,Employee_id,Department_id,activity_id,SUM(time_charge) AS 'time_charge_by_activity_id',time_charge_week,weekno,from_date,to_date " + 
        "FROM time_activity_detail_table " + 
        "WHERE Employee_id IN(" + stringEMP + ") AND Department_id in (" + stringDept + ") AND user_id=" + info.USER_ID + " " + 
        "GROUP BY Department_id,activity_id,Employee_id ";

        var sql_get_data_total = "SELECT Department_id,SUM(time_charge_1) AS 'time_charge_1_Dept', " + 
        "SUM(time_charge_2) AS 'time_charge_2_Dept',SUM(time_charge_3) AS 'time_charge_3_Dept', " + 
        "SUM(time_charge_4) AS 'time_charge_4_Dept',SUM(time_charge_5) AS 'time_charge_5_Dept', " + 
        "SUM(time_charge_week) AS 'time_charge_week_Dept' " + "from time_activity_report " + 
        "WHERE Department_id in (" + stringDept + ") AND Employee_id IN(" + stringEMP + ") AND user_id=" + info.USER_ID + " " + 
        "GROUP BY Department_id";

        var sql_get_total = "SELECT * FROM time_activity_report ";

        var sql_get_line_count ="SELECT COUNT(DISTINCT FirstName),Department_id,Employee_id,time_charge_week FROM time_activity_table GROUP BY FirstName ";
                                                                                    
        //DELETE DATA IN TABLE
        var sql_delete_time_activity_table = "DELETE from time_activity_table WHERE user_id=" + info.USER_ID + " ";
        var sql_delete_time_activity_detail_table = "DELETE from time_activity_detail_table WHERE user_id=" + info.USER_ID + " ";
        var sql_delete_time_activity_report = "DELETE from time_activity_report WHERE user_id=" + info.USER_ID + " ";
        db.sequelize.query(sql_delete_time_activity_report)
            .success(function(data_delete3) {

                db.sequelize.query(sql_delete_time_activity_detail_table)
                    .success(function(data_delete1) {
                        db.sequelize.query(sql_delete_time_activity_table)
                            .success(function(data_delete2) {
                                //END DELETE
                                var sql_get_data_time_activity_table = "SELECT users.id,hr_employee.FirstName, hr_employee.LastName, hr_employee.Employee_ID , departments.departmentid, departments.departmentName,time_tasks_week.time_charge, time_tasks_week.week_no,time_tasks_week.creation_date,time_tasks_week.last_update_date,time_tasks_week.task_week_id " + "FROM hr_employee " + "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " + "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " + "WHERE time_tasks_week.task_status_id = 3 AND departments.departmentid IN ( " + stringDept + " ) AND (time_tasks_week.week_no BETWEEN " + info.weekNoFrom + " AND " + info.weekNoTo + " ) AND hr_employee.Employee_ID IN ( " + stringEMP + " )";
                                db.sequelize.query(sql_get_data_time_activity_table)
                                    .success(function(data_time_activity_table) {
                                        //console.log(data_time_activity_table)
                                        //INSERT time_activity_table
                                        for (var i = 0; i < data_time_activity_table.length; i++) {
                                            db.time_activity_table.create({
                                                    user_id: info.USER_ID,
                                                    task_week_id: data_time_activity_table[i].task_week_id,
                                                    Employee_id: data_time_activity_table[i].Employee_ID,
                                                    Department_id: data_time_activity_table[i].departmentid,
                                                    FirstName: data_time_activity_table[i].FirstName,
                                                    LastName: data_time_activity_table[i].LastName,
                                                    Department_name: data_time_activity_table[i].departmentName,
                                                    weekno: data_time_activity_table[i].week_no,
                                                    time_charge_week: data_time_activity_table[i].time_charge,
                                                    from_date: info.weekFrom,
                                                    to_date: info.weekTo,
                                                    Creation_by: info.USER_ID
                                                })
                                                .success(function(data_insert1) {
                                                    flag1++;
                                                    if (flag1 == data_time_activity_table.length) {
                                                        //GET DETAIL DATA
                                                        var sql_get_data_time_activity_detail_table = "SELECT time_activity_table.task_week_id,time_tasks.tasks_id," 
                                                        + "time_activity_table.user_id,time_activity_table.Employee_id," 
                                                        + "time_activity_table.Department_id,time_tasks.activity_id," 
                                                        + "time_tasks.time_charge,time_activity_table.time_charge_week," 
                                                        + "time_activity_table.weekno,time_activity_table.from_date,time_activity_table.to_date " 
                                                        + "FROM time_tasks " 
                                                        + "INNER JOIN time_activity_table ON time_activity_table.task_week_id = time_tasks.tasks_week_id " 
                                                        + "WHERE time_activity_table.user_id=" + info.USER_ID + " "
                                                        + "ORDER BY time_activity_table.Department_id,time_activity_table.Employee_id,time_tasks.activity_id,time_activity_table.weekno";

                                                        var sql_get_time_charge_week = "SELECT SUM(time_charge) AS 'time_charge_week',Department_id,Employee_id "
                                                                                        +" FROM time_activity_detail_table "
                                                                                        +" WHERE user_id=268 AND Employee_id IN ("+stringEMP+") "
                                                                                        +" GROUP BY Department_id,Employee_id";
                                                        db.sequelize.query(sql_get_data_time_activity_detail_table)
                                                            .success(function(data_time_activity_detail_table) {
                                                                db.sequelize.query(sql_get_time_charge_week)
                                                                    .success(function(data_get_time_charge_week){


                                                                    for (var j = 0; j < data_time_activity_detail_table.length; j++) {
                                                                        //INSERT time_activity_detail_table
                                                                        db.time_activity_detail_table.create({
                                                                                task_week_id: data_time_activity_detail_table[j].task_week_id,
                                                                                tasks_id: data_time_activity_detail_table[j].tasks_id,
                                                                                user_id: data_time_activity_detail_table[j].user_id,
                                                                                Employee_id: data_time_activity_detail_table[j].Employee_id,
                                                                                Department_id: data_time_activity_detail_table[j].Department_id,
                                                                                activity_id: data_time_activity_detail_table[j].activity_id,
                                                                                time_charge: data_time_activity_detail_table[j].time_charge,
                                                                                //time_charge_week: data_time_activity_detail_table[j].time_charge_week,
                                                                                weekno: data_time_activity_detail_table[j].weekno,
                                                                                from_date: data_time_activity_detail_table[j].from_date,
                                                                                to_date: data_time_activity_detail_table[j].to_date,
                                                                                Creation_by: info.USER_ID
                                                                            })
                                                                            .success(function(data_insert2) {
                                                                                flag2++;
                                                                                if (flag2 == data_time_activity_detail_table.length) {
                                                                                    
                                                                                    

                                                                                    var sql_get_time_charge_new = "SELECT user_id,SUM(time_charge) AS 'time_charge',Department_id,Employee_id,activity_id "
                                                                                                                    +" FROM time_activity_detail_table "
                                                                                                                    +" WHERE Department_id IN("+stringDept+") AND Employee_id IN("+stringEMP+") AND activity_id IN (1,2,3,4,5) "
                                                                                                                    +" AND user_id="+info.USER_ID+" "
                                                                                                                    +" GROUP BY Department_id,Employee_id,activity_id "
                                                                                                                    +" ORDER BY Department_id,Employee_id,activity_id ";
                                                                                    db.sequelize.query(sql_get_time_charge_new)
                                                                                        .success(function(data_time_charge_new){
                                                                                            var sql_get_length_line = "SELECT Department_id,Employee_id,user_id,SUM(time_charge) AS 'time_charge_week',from_date,to_date "
                                                                                                                        +"FROM time_activity_detail_table "
                                                                                                                        +"WHERE user_id ="+info.USER_ID+" "
                                                                                                                        +"GROUP BY Employee_id "
                                                                                                                        +"ORDER BY Department_id,Employee_id";
                                                                                            db.sequelize.query(sql_get_length_line)
                                                                                                .success(function(data_length_line){
                                                                                                    
                                                                                                    for(var x =0;x<data_length_line.length;x++){   
                                                                                                            stringline1+="(";                                                                             
                                                                                                        for(var y=0;y<data_time_charge_new.length;y++){

                                                                                                            if(data_length_line[x].Department_id==data_time_charge_new[y].Department_id&&data_length_line[x].Employee_id==data_time_charge_new[y].Employee_id){
                                                                                                                stringline1+=data_time_charge_new[y].time_charge+","+((data_time_charge_new[y].time_charge/data_length_line[x].time_charge_week)*100).toFixed(2)+",";
                                                                                                            }
                                                                                                        }
                                                                                                        if(stringline1!=="("){
                                                                                                            stringline1+=data_length_line[x].Department_id+","+
                                                                                                                        data_length_line[x].Employee_id+","+
                                                                                                                        data_length_line[x].user_id+","+
                                                                                                                        data_length_line[x].time_charge_week+",'"+
                                                                                                                        moment(data_length_line[x].from_date).format("YYYY-MM-DD")+"','"+
                                                                                                                        moment(data_length_line[x].to_date).format("YYYY-MM-DD")+"'),";
                                                                                                            
                                                                                                        }

                                                                                                    }
                                                                                                    stringline1 = stringline1.substring(0,stringline1.length-1);
                                                                                                    
                                                                                                    var sql_insert_time_activity_report = "INSERT INTO time_activity_report (time_charge_1,per_1,time_charge_2,per_2,time_charge_3,per_3,time_charge_4,per_4,time_charge_5,per_5,Department_id,Employee_id,user_id,time_charge_week,from_date,to_date) VALUE "+stringline1;
                                                                                                    db.sequelize.query(sql_insert_time_activity_report)
                                                                                                        .success(function(data_insert_success){
                                                                                                            var sql_get_time_charge_Dept_all ="SELECT SUM(time_charge_1) AS'time_charge_1_Dept',SUM(time_charge_2) AS'time_charge_2_Dept',SUM(time_charge_3) AS'time_charge_3_Dept',"+
                                                                                                                                                "SUM(time_charge_4) AS'time_charge_4_Dept',SUM(time_charge_5) AS'time_charge_5_Dept',"+
                                                                                                                                                "SUM(time_charge_week) AS'time_charge_week_Dept',Department_id "+
                                                                                                                                                "FROM time_activity_report "+
                                                                                                                                                "WHERE Department_id IN("+stringDept+") AND user_id="+info.USER_ID+" "+
                                                                                                                                                "GROUP BY Department_id";
                                                                                                            var sql_get_time_charge_all      ="SELECT user_id,SUM(time_charge_1_Dept) AS'time_charge_1_all',SUM(time_charge_2_Dept) AS'time_charge_2_all',SUM(time_charge_3_Dept) AS'time_charge_3_all', "+
                                                                                                                                            "SUM(time_charge_4_Dept) AS'time_charge_4_all',SUM(time_charge_5_Dept) AS'time_charge_5_all', "+
                                                                                                                                            "SUM(time_charge_week_Dept) AS'time_charge_all' "+
                                                                                                                                            "FROM time_activity_report "+
                                                                                                                                            "WHERE user_id="+info.USER_ID;
                                                                                                            db.sequelize.query(sql_get_time_charge_Dept_all)
                                                                                                                .success(function(data_time_charge_Dept_all){
                                                                                                                    
                                                                                                                    for(var v = 0;v <data_length_line.length;v++){
                                                                                                                                //continue
                                                                                                                                chainer.add(db.time_activity_report.update({
                                                                                                                                    time_charge_1_Dept     : data_time_charge_Dept_all[v].time_charge_1_Dept,
                                                                                                                                    per_1_Dept             : ((data_time_charge_Dept_all[v].time_charge_1_Dept/data_time_charge_Dept_all[v].time_charge_week_Dept)*100).toFixed(2),
                                                                                                                                    time_charge_2_Dept     : data_time_charge_Dept_all[v].time_charge_2_Dept,
                                                                                                                                    per_2_Dept             : ((data_time_charge_Dept_all[v].time_charge_2_Dept/data_time_charge_Dept_all[v].time_charge_week_Dept)*100).toFixed(2),
                                                                                                                                    time_charge_3_Dept     : data_time_charge_Dept_all[v].time_charge_3_Dept,
                                                                                                                                    per_3_Dept             : ((data_time_charge_Dept_all[v].time_charge_3_Dept/data_time_charge_Dept_all[v].time_charge_week_Dept)*100).toFixed(2),
                                                                                                                                    time_charge_4_Dept     : data_time_charge_Dept_all[v].time_charge_4_Dept,
                                                                                                                                    per_4_Dept             : ((data_time_charge_Dept_all[v].time_charge_4_Dept/data_time_charge_Dept_all[v].time_charge_week_Dept)*100).toFixed(2),
                                                                                                                                    time_charge_5_Dept     : data_time_charge_Dept_all[v].time_charge_5_Dept,
                                                                                                                                    per_5_Dept             : ((data_time_charge_Dept_all[v].time_charge_5_Dept/data_time_charge_Dept_all[v].time_charge_week_Dept)*100).toFixed(2),
                                                                                                                                    time_charge_week_Dept  : data_time_charge_Dept_all[v].time_charge_week_Dept
                                                                                                                                },{
                                                                                                                                    Department_id          : data_time_charge_Dept_all[v].Department_id
                                                                                                                                }));
                                                                                                                                
                                                                                                                            }
                                                                                                                            chainer.runSerially()
                                                                                                                                .success(function(update_success1){
                                                                                                                                    
                                                                                                                                    db.sequelize.query(sql_get_time_charge_all)
                                                                                                                                        .success(function(data_time_charge_all){
                                                                                                                                            for(var f=0;f<data_length_line.length;f++){
                                                                                                                                                chainer.add(db.time_activity_report.update({
                                                                                                                                                     time_charge_1_all     : data_time_charge_all[0].time_charge_1_all,
                                                                                                                                                     per_1_all             : ((data_time_charge_all[0].time_charge_1_all/data_time_charge_all[0].time_charge_all)*100).toFixed(2),
                                                                                                                                                     time_charge_2_all     : data_time_charge_all[0].time_charge_2_all,
                                                                                                                                                     per_2_all             : ((data_time_charge_all[0].time_charge_2_all/data_time_charge_all[0].time_charge_all)*100).toFixed(2),
                                                                                                                                                     time_charge_3_all     : data_time_charge_all[0].time_charge_3_all,
                                                                                                                                                     per_3_all             : ((data_time_charge_all[0].time_charge_3_all/data_time_charge_all[0].time_charge_all)*100).toFixed(2),
                                                                                                                                                     time_charge_4_all     : data_time_charge_all[0].time_charge_4_all,
                                                                                                                                                     per_4_all             : ((data_time_charge_all[0].time_charge_4_all/data_time_charge_all[0].time_charge_all)*100).toFixed(2),
                                                                                                                                                     time_charge_5_all     : data_time_charge_all[0].time_charge_5_all,
                                                                                                                                                     per_5_all             : ((data_time_charge_all[0].time_charge_5_all/data_time_charge_all[0].time_charge_all)*100).toFixed(2),
                                                                                                                                                     time_charge_all       : data_time_charge_all[0].time_charge_all
                                                                                                                                                },{
                                                                                                                                                    user_id               : data_time_charge_all[0].user_id
                                                                                                                                                }))
                                                                                                                                            }
                                                                                                                                            chainer.runSerially()
                                                                                                                                                .success(function(update_success2){
                                                                                                                                                    res.json({status:"success"});
                                                                                                                                                    return;
                                                                                                                                                })
                                                                                                                                        })
                                                                                                                                        .error(function(err){
                                                                                                                                            console.log("*****ERROR: "+err+" *****");
                                                                                                                                            res.json({
                                                                                                                                                status:"error"
                                                                                                                                            });
                                                                                                                                            return;
                                                                                                                                        })
                                                                                                                                })
                                                                                                                                .error(function(err){
                                                                                                                                    console.log("*****ERROR: "+err+" *****");
                                                                                                                                    res.json({
                                                                                                                                        status:"error"
                                                                                                                                    });
                                                                                                                                    return;
                                                                                                                                })

                                                                                                                })
                                                                                                                .error(function(err){
                                                                                                                    console.log("*****ERROR: "+err+" *****");
                                                                                                                    res.json({
                                                                                                                        status:"error"
                                                                                                                    });
                                                                                                                    return;
                                                                                                                })
                                                                                                        })
                                                                                                        .error(function(err){
                                                                                                            console.log("*****ERROR: "+err+" *****");
                                                                                                            res.json({
                                                                                                                status:"error"
                                                                                                            });
                                                                                                            return;
                                                                                                        })
                                                                                                    
                                                                                                })
                                                                                                .error(function(err){
                                                                                                    console.log("*****ERROR: "+err+" *****");
                                                                                                    res.json({
                                                                                                        status:"error"
                                                                                                    });
                                                                                                    return;
                                                                                                })
                                                                                        })
                                                                                        .error(function(err){
                                                                                            console.log("*****ERROR: "+err+" *****");
                                                                                            res.json({
                                                                                                status:"error"
                                                                                            });
                                                                                            return;
                                                                                        })
                                                                                }
                                                                            })
                                                                            
                                                                            .error(function(err) {
                                                                                console.log("*****ERROR: " + err + " *****");
                                                                                res.json({
                                                                                    status: "error"
                                                                                });
                                                                                return;
                                                                            })
                                                                    }
                                                                    })
                                                                    .error(function(err){
                                                                        console.log("*****ERROR: "+err+" *****");
                                                                        res.json({
                                                                            status:"error"
                                                                        });
                                                                        return;
                                                                    })
                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR: " + err + " *****");
                                                                res.json({
                                                                    status: "error"
                                                                });
                                                                return;
                                                            })
                                                            //END GET
                                                    }
                                                })
                                                .error(function(err) {
                                                    console.log("*****ERROR: " + err + " *****");
                                                    res.json({
                                                        status: "error"
                                                    });
                                                    return;
                                                })
                                        }
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR: " + err + " *****");
                                        res.json({
                                            status: "error"
                                        });
                                        return;
                                    })
                            })
                            .error(function(err) {
                                console.log("*****ERROR: " + err + " *****");
                                res.json({
                                    status: "error"
                                });
                                return;
                            })
                    })
                    .error(function(err) {
                        console.log("*****ERROR: " + err + " *****");
                        res.json({
                            status: "error"
                        });
                        return;
                    })

            })
            .error(function(err) {
                console.log("*****ERROR: " + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            })
            //
    },
    //END REPORT UTILIZITION RATIO DETAIL

    //REPORT UTILIZATION RATIO SUMARY
    LoadReportUtilizationRatioSumary: function(req, res) {
        var info = req.body.info;
        console.log(info);
        var stringEMP = "";
        var stringDept = "";
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        var time_charge_all = 0;
        var flag1 = 0;
        var flag2 = 0;
        var flag3 = 0;
        var flag4 = 0;
        var flag5 = 0;
        var flag6 = 0;
        var flag7 = 0;
        var flag8 = 0;
        var flag9 = 0;
        //DELETE ALL TABLE
        var sql_delete_time_activity_summary_table = " DELETE FROM time_activity_summary_table WHERE user_id=" + info.USER_ID + " ";
        var sql_delete_time_activity_summary_detail_table = " DELETE FROM time_activity_summary_detail_table WHERE user_id=" + info.USER_ID + " ";
        var sql_delete_time_activity_summary_report = " DELETE FROM time_activity_summary_report WHERE user_id=" + info.USER_ID + " ";
        //DELETE TABLE time_activity_summary_table
        db.sequelize.query(sql_delete_time_activity_summary_table)
            .success(function(data_delete1) {
                //DELETE TABLE time_activity_summary_detail_table
                db.sequelize.query(sql_delete_time_activity_summary_detail_table)
                    .success(function(data_delete2) {
                        //DELETE TABLE time_activity_summary_report
                        db.sequelize.query(sql_delete_time_activity_summary_report)
                            .success(function(data_delete3) {
                                var sql_get_data_time_activity_summary_table = "SELECT users.id,hr_employee.FirstName, hr_employee.LastName, hr_employee.Employee_ID , departments.departmentid, departments.departmentName,time_tasks_week.time_charge, time_tasks_week.week_no,time_tasks_week.creation_date,time_tasks_week.last_update_date,time_tasks_week.task_week_id " + "FROM hr_employee " + "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " + "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " + "WHERE time_tasks_week.task_status_id = 3 AND departments.departmentid IN ( " + stringDept + " ) AND (time_tasks_week.week_no BETWEEN " + info.weekNoFrom + " AND " + info.weekNoTo + " ) AND hr_employee.Employee_ID IN ( " + stringEMP + " ) ";
                                //GET DATA TABLE time_activity_summary_table
                                db.sequelize.query(sql_get_data_time_activity_summary_table)
                                    .success(function(data_time_activity_summary_table) {
                                        //console.log(data_time_activity_summary_table)
                                        //INSERT DATA INTO time_activity_summary_table
                                        for (var i = 0; i < data_time_activity_summary_table.length; i++) {
                                            db.time_activity_summary_table.create({
                                                    user_id: info.USER_ID,
                                                    task_week_id: data_time_activity_summary_table[i].task_week_id,
                                                    Employee_id: data_time_activity_summary_table[i].Employee_ID,
                                                    Department_id: data_time_activity_summary_table[i].departmentid,
                                                    FirstName: data_time_activity_summary_table[i].FirstName,
                                                    LastName: data_time_activity_summary_table[i].LastName,
                                                    Department_name: data_time_activity_summary_table[i].departmentName,
                                                    weekno: data_time_activity_summary_table[i].week_no,
                                                    time_charge_week: data_time_activity_summary_table[i].time_charge,
                                                    from_date: info.weekFrom,
                                                    to_date: info.weekTo,
                                                    Creation_by: info.USER_ID
                                                })
                                                .success(function(data_insert1) {
                                                    flag1++;
                                                    if (flag1 == data_time_activity_summary_table.length) {
                                                        //console.log("NEXT")
                                                        //GET DATA TABLE time_activity_summary_detail_table
                                                        var sql_get_data_time_activity_summary_detail_table = "SELECT " + "time_activity_summary_table.from_date, " + "time_activity_summary_table.to_date, " + "time_activity_summary_table.weekno, " + "time_tasks.tasks_id, " + "time_activity_summary_table.task_week_id, " + "time_activity_summary_table.user_id, " + "time_tasks.activity_id, " + "time_activity_summary_table.Department_id, " + "time_activity_summary_table.Employee_id, " + "time_tasks.time_charge, " + "time_activity_summary_table.time_charge_week " + "FROM time_tasks " + "INNER JOIN time_activity_summary_table ON time_tasks.tasks_week_id = time_activity_summary_table.task_week_id " + "WHERE time_activity_summary_table.Employee_id IN (" + stringEMP + ") AND time_activity_summary_table.Department_id IN (" + stringDept + ") AND time_activity_summary_table.user_id=" + info.USER_ID + " ";
                                                        db.sequelize.query(sql_get_data_time_activity_summary_detail_table)
                                                            .success(function(data_time_activity_summary_detail_table) {
                                                                // console.log(data_time_activity_summary_detail_table)
                                                                // console.log("NEXT")
                                                                //INSERT DATA INTO time_activity_summary_detail_table
                                                                for (var j = 0; j < data_time_activity_summary_detail_table.length; j++) {
                                                                    db.time_activity_summary_detail_table.create({
                                                                            task_week_id: data_time_activity_summary_detail_table[j].task_week_id,
                                                                            tasks_id: data_time_activity_summary_detail_table[j].tasks_id,
                                                                            user_id: data_time_activity_summary_detail_table[j].user_id,
                                                                            Employee_id: data_time_activity_summary_detail_table[j].Employee_id,
                                                                            Department_id: data_time_activity_summary_detail_table[j].Department_id,
                                                                            activity_id: data_time_activity_summary_detail_table[j].activity_id,
                                                                            time_charge: data_time_activity_summary_detail_table[j].time_charge,
                                                                            time_charge_week: data_time_activity_summary_detail_table[j].time_charge_week,
                                                                            weekno: data_time_activity_summary_detail_table[j].weekno,
                                                                            from_date: data_time_activity_summary_detail_table[j].from_date,
                                                                            to_date: data_time_activity_summary_detail_table[j].to_date,
                                                                            Creation_by: info.USER_ID
                                                                        })
                                                                        .success(function(data_insert2) {
                                                                            flag2++;
                                                                            if (flag2 == data_time_activity_summary_detail_table.length) {
                                                                                var sql_get_length_time_activity_summary_report = "SELECT DISTINCT Department_id FROM time_activity_summary_table ";
                                                                                db.sequelize.query(sql_get_length_time_activity_summary_report)
                                                                                    .success(function(data_length) {

                                                                                        for (var d = 0; d < data_length.length; d++) {
                                                                                            for (var c = 0; c < 5; c++) {
                                                                                                db.time_activity_summary_report.create({
                                                                                                        user_id: info.USER_ID,
                                                                                                        Department_id: data_length[d].Department_id,
                                                                                                        activity_id: c + 1,
                                                                                                        from_date: info.weekFrom,
                                                                                                        to_date: info.weekTo,
                                                                                                        Creation_by: info.USER_ID
                                                                                                    })
                                                                                                    .success(function(data_insert3) {
                                                                                                        flag4++;
                                                                                                        if (flag4 == (5 * data_length.length) && flag5 == data_length.length) {
                                                                                                            //GET DATA DETAIL FOR time_activity_summary_report
                                                                                                            var sql_get_data_detail_time_activity_summary_report1 = "SELECT Department_id,activity_id,SUM(time_charge) AS 'time_charge_Dept' " + " FROM time_activity_summary_detail_table " + " WHERE Department_id IN (" + stringDept + ") AND activity_id IS NOT NULL AND user_id=" + info.USER_ID + " " + " GROUP BY Department_id,activity_id";
                                                                                                            var sql_get_data_detail_time_activity_summary_report2 = "SELECT Department_id,SUM(time_charge) AS 'time_charge_Dept_all' " + " FROM time_activity_summary_detail_table " + " WHERE Department_id IN (" + stringDept + ") AND user_id=" + info.USER_ID + " " + " GROUP BY Department_id";
                                                                                                            db.sequelize.query(sql_get_data_detail_time_activity_summary_report1)
                                                                                                                .success(function(data_detail_time_activity_summary_report1) {
                                                                                                                    // console.log(data_detail_time_activity_summary_report1)//continue
                                                                                                                    db.sequelize.query(sql_get_data_detail_time_activity_summary_report2)
                                                                                                                        .success(function(data_detail_time_activity_summary_report2) {
                                                                                                                            for (var p = 0; p < data_detail_time_activity_summary_report2.length; p++) {
                                                                                                                                time_charge_all += data_detail_time_activity_summary_report2[p].time_charge_Dept_all;
                                                                                                                            }

                                                                                                                            for (var t = 0; t < data_detail_time_activity_summary_report1.length; t++) {
                                                                                                                                db.time_activity_summary_report.update({
                                                                                                                                        time_charge_Dept: data_detail_time_activity_summary_report1[t].time_charge_Dept
                                                                                                                                    }, {
                                                                                                                                        Department_id: data_detail_time_activity_summary_report1[t].Department_id,
                                                                                                                                        activity_id: data_detail_time_activity_summary_report1[t].activity_id,
                                                                                                                                        user_id: info.USER_ID
                                                                                                                                    })
                                                                                                                                    .success(function(data_success1) {
                                                                                                                                        flag6++;
                                                                                                                                        if (flag6 == data_detail_time_activity_summary_report1.length) {
                                                                                                                                            for (var x = 0; x < data_detail_time_activity_summary_report2.length; x++) {
                                                                                                                                                flag7++;
                                                                                                                                                for (var y = 0; y < 5 * data_time_activity_summary_table.length; y++) {
                                                                                                                                                    db.time_activity_summary_report.update({
                                                                                                                                                            time_charge_Dept_all: data_detail_time_activity_summary_report2[x].time_charge_Dept_all,

                                                                                                                                                            time_charge_all: time_charge_all
                                                                                                                                                        }, {
                                                                                                                                                            Department_id: data_detail_time_activity_summary_report2[x].Department_id,
                                                                                                                                                            user_id: info.USER_ID
                                                                                                                                                        })
                                                                                                                                                        .success(function(data_success2) {

                                                                                                                                                            flag8++;
                                                                                                                                                            if (flag8 == data_time_activity_summary_table.length && flag7 == data_detail_time_activity_summary_report2.length) {
                                                                                                                                                                var sql_get_per = "SELECT * FROM time_activity_summary_report ORDER BY Department_id,activity_id  ";
                                                                                                                                                                db.sequelize.query(sql_get_per)
                                                                                                                                                                    .success(function(data_per) {
                                                                                                                                                                        for (var o = 0; o < data_per.length; o++) {
                                                                                                                                                                            db.time_activity_summary_report.update({
                                                                                                                                                                                    time_charge_Dept_per: ((data_per[o].time_charge_Dept / data_per[o].time_charge_Dept_all) * 100).toFixed(2)
                                                                                                                                                                                }, {
                                                                                                                                                                                    Department_id: data_per[o].Department_id,
                                                                                                                                                                                    activity_id: data_per[o].activity_id,
                                                                                                                                                                                    user_id: info.USER_ID
                                                                                                                                                                                })
                                                                                                                                                                                .success(function(success) {
                                                                                                                                                                                    flag9++;
                                                                                                                                                                                    if (flag9 == data_per.length) {
                                                                                                                                                                                        res.json({
                                                                                                                                                                                            status: "success"
                                                                                                                                                                                        });
                                                                                                                                                                                        return;
                                                                                                                                                                                    }
                                                                                                                                                                                })
                                                                                                                                                                                .error(function(err) {
                                                                                                                                                                                    console.log("*****ERROR: " + err + " *****");
                                                                                                                                                                                    res.json({
                                                                                                                                                                                        status: "error"
                                                                                                                                                                                    });
                                                                                                                                                                                    return;
                                                                                                                                                                                })
                                                                                                                                                                        }
                                                                                                                                                                    })
                                                                                                                                                                    .error(function(err) {
                                                                                                                                                                        console.log("*****ERROR: " + err + " *****");
                                                                                                                                                                        res.json({
                                                                                                                                                                            status: "error"
                                                                                                                                                                        });
                                                                                                                                                                        return;
                                                                                                                                                                    })
                                                                                                                                                            }
                                                                                                                                                        })
                                                                                                                                                        .error(function(err) {
                                                                                                                                                            console.log("*****ERROR: " + err + " *****");
                                                                                                                                                            res.json({
                                                                                                                                                                status: "error"
                                                                                                                                                            });
                                                                                                                                                            return;
                                                                                                                                                        })
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                                    .error(function(err) {
                                                                                                                                        console.log("*****ERROR: " + err + " *****");
                                                                                                                                        res.json({
                                                                                                                                            status: "error"
                                                                                                                                        });
                                                                                                                                        return;
                                                                                                                                    })
                                                                                                                            }

                                                                                                                        })
                                                                                                                        .error(function(err) {
                                                                                                                            console.log("*****ERROR: " + err + " *****");
                                                                                                                            res.json({
                                                                                                                                status: "error"
                                                                                                                            });
                                                                                                                            return;
                                                                                                                        })
                                                                                                                })
                                                                                                                .error(function(err) {
                                                                                                                    console.log("*****ERROR: " + err + "*****");
                                                                                                                    res.json({
                                                                                                                        status: "error"
                                                                                                                    });
                                                                                                                    return;
                                                                                                                })
                                                                                                        }
                                                                                                    })
                                                                                                    .error(function(err) {
                                                                                                        console.log("******ERROR: " + err + " *****");
                                                                                                        res.json({
                                                                                                            status: "error"
                                                                                                        });
                                                                                                        return;
                                                                                                    })
                                                                                            }
                                                                                            flag5++;
                                                                                        }

                                                                                    })
                                                                                    .error(function(err) {
                                                                                        console.log("*****ERROR: " + err + " *****");
                                                                                        res.json({
                                                                                            status: "error"
                                                                                        });
                                                                                        return;
                                                                                    })
                                                                            }
                                                                        })
                                                                        .error(function(err) {
                                                                            console.log("*****ERROR: " + err + " *****");
                                                                            res.json({
                                                                                status: "error"
                                                                            });
                                                                            return;
                                                                        })
                                                                }
                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR: " + err + " *****");
                                                                res.json({
                                                                    status: "error"
                                                                });
                                                                return;
                                                            })
                                                    }
                                                })
                                                .error(function(err) {
                                                    console.log("*****ERROR: " + err + " *****");
                                                    res.json({
                                                        status: "error"
                                                    });
                                                    return;
                                                })
                                        }
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR: " + err + " *****");
                                        res.json({
                                            status: "error"
                                        });
                                        return;
                                    })
                            })
                            .error(function(err) {
                                console.log("*****ERROR: " + err + " *****");
                                res.json({
                                    status: "error"
                                });
                                return;
                            })
                    })
                    .error(function(err) {
                        console.log("*****ERROR: " + err + " *****");
                        res.json({
                            status: "error"
                        });
                        return;
                    })
            })
            .error(function(err) {
                console.log("*****ERROR: " + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            })
    },
    //END REPORT UTILIZITION RATIO SUMARY

    //REPORT ITEM NUMBER
    LoadReportItemNumber: function(req, res) {
        var info = req.body.info;
        //console.log(info);
        //CHUYEN LIST EMPL VA LIST DEPT THANH CHUOI STRING
        var stringEMP = "";
        var stringDept = "";
        var stringWeek = "";
        var stringItem = "";
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        var time_in_lieu_remain_all = [];
        var sum_ = 0;
        var flag1 = 0;
        var flag2 = 0;
        var flag3 = 0;
        var flag4 = 0;
        var flag5 = 0;
        var flag6 = 0;
        var flag7 = 0;
        var flag8 = 0;
        var data_average = [];
        //XU LY TAI DAY
        //1.
        var sql_delete_item_code_table = "DELETE FROM item_code_table WHERE user_id=" + info.USER_ID + " ";
        db.sequelize.query(sql_delete_item_code_table)
            .success(function(data_delete_item_code_table) {
                var sql_delete_item_code_detail_table = "DELETE FROM item_code_detail_table WHERE user_id=" + info.USER_ID + " ";
                db.sequelize.query(sql_delete_item_code_detail_table)
                    .success(function(data_delete_item_code_detail_table) {
                        var sql_delete_item_code_report1 = "DELETE FROM item_code_report1 WHERE user_id=" + info.USER_ID + " ";
                        db.sequelize.query(sql_delete_item_code_report1)
                            .success(function(data_delete_item_code_report1) {

                                var sql_item_code_table = "SELECT users.id,hr_employee.FirstName, hr_employee.LastName, hr_employee.Employee_ID , departments.departmentid, departments.departmentName,time_tasks_week.time_charge, time_tasks_week.week_no,time_tasks_week.creation_date,time_tasks_week.last_update_date,time_tasks_week.task_week_id " + "FROM hr_employee " + "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " + "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " + "WHERE time_tasks_week.task_status_id = 3 AND departments.departmentid IN ( " + stringDept + " ) AND (time_tasks_week.week_no BETWEEN " + info.weekNoFrom + " AND " + info.weekNoTo + " ) AND hr_employee.Employee_ID IN ( " + stringEMP + " )";
                                db.sequelize.query(sql_item_code_table)
                                    .success(function(data_item_code_table) {

                                        for (var i = 0; i < data_item_code_table.length; i++) {
                                            db.item_code_table.create({
                                                    user_id: info.USER_ID,
                                                    task_week_id: data_item_code_table[i].task_week_id,
                                                    Employee_id: data_item_code_table[i].Employee_ID,
                                                    Department_id: data_item_code_table[i].departmentid,
                                                    FirstName: data_item_code_table[i].FirstName,
                                                    LastName: data_item_code_table[i].LastName,
                                                    Department_name: data_item_code_table[i].departmentName,
                                                    weekno: data_item_code_table[i].week_no,
                                                    time_charge_week: data_item_code_table[i].time_charge,
                                                    from_date: info.weekFrom,
                                                    to_date: info.weekTo,
                                                    Creation_by: info.USER_ID
                                                })
                                                .success(function(data_insert_item_code_table) {
                                                    flag1++;
                                                    if (flag1 == data_item_code_table.length) {
                                                        var sql_get_data_item_code_detail = "SELECT item_code_table.from_date,item_code_table.to_date,item_code_table.weekno,time_tasks.tasks_id,item_code_table.task_week_id,item_code_table.user_id,time_item_task.item_id,item_code_table.Department_id,item_code_table.Employee_id,time_tasks.time_charge " + "FROM time_tasks " + "INNER JOIN item_code_table ON time_tasks.tasks_week_id = item_code_table.task_week_id " + "INNER JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id " + "WHERE item_code_table.Employee_id IN (" + stringEMP + ") AND item_code_table.Department_id IN (" + stringDept + ") AND item_code_table.user_id=" + info.USER_ID + " ";
                                                        db.sequelize.query(sql_get_data_item_code_detail)
                                                            .success(function(data_get_data_item_code_detail) {

                                                                for (var j = 0; j < data_get_data_item_code_detail.length; j++) {
                                                                    db.item_code_detail_table.create({
                                                                            task_week_id: data_get_data_item_code_detail[j].task_week_id,
                                                                            tasks_id: data_get_data_item_code_detail[j].tasks_id,
                                                                            user_id: data_get_data_item_code_detail[j].user_id,
                                                                            item_id: data_get_data_item_code_detail[j].item_id,
                                                                            Employee_id: data_get_data_item_code_detail[j].Employee_id,
                                                                            Department_id: data_get_data_item_code_detail[j].Department_id,
                                                                            weekno: data_get_data_item_code_detail[j].weekno,
                                                                            time_charge: data_get_data_item_code_detail[j].time_charge,
                                                                            from_date: data_get_data_item_code_detail[j].from_date,
                                                                            to_date: data_get_data_item_code_detail[j].to_date,
                                                                            Creation_by: info.USER_ID
                                                                        })
                                                                        .success(function(data_item_code_detail_table) {
                                                                            flag2++;
                                                                            if (flag2 == data_get_data_item_code_detail.length) {
                                                                                var sql_get_item_id = "SELECT DISTINCT item_id FROM item_code_detail_table WHERE user_id=" + info.USER_ID + "";
                                                                                db.sequelize.query(sql_get_item_id)
                                                                                    .success(function(data_get_item_id) {

                                                                                        for (var o = 0; o < data_get_item_id.length; o++) {
                                                                                            stringItem += "'"+data_get_item_id[o].item_id + "', ";
                                                                                        }
                                                                                        stringItem += -1;
                                                                                        var sql_item_code_report1 = "SELECT user_id,Employee_id,Department_id,item_id,COUNT(item_id) AS 'so_luong',from_date,to_date " + "FROM item_code_detail_table " + "WHERE item_id IN (" + stringItem + ") AND Employee_id IN (" + stringEMP + ") AND user_id=" + info.USER_ID + " " + "GROUP BY Employee_id,item_id";
                                                                                        db.sequelize.query(sql_item_code_report1)
                                                                                            .success(function(data_item_code_report1) {

                                                                                                for (var f = 0; f < data_item_code_report1.length; f++) {
                                                                                                    db.item_code_report1.create({
                                                                                                            user_id: data_item_code_report1[f].user_id,
                                                                                                            Employee_id: data_item_code_report1[f].Employee_id,
                                                                                                            Department_id: data_item_code_report1[f].Department_id,
                                                                                                            item_id: data_item_code_report1[f].item_id,
                                                                                                            total_numbers: data_item_code_report1[f].so_luong,
                                                                                                            from_date: data_item_code_report1[f].from_date,
                                                                                                            to_date: data_item_code_report1[f].to_date,
                                                                                                            Creation_by: info.USER_ID
                                                                                                        })
                                                                                                        .success(function(data_get_item_code_report1) {
                                                                                                            flag3++;
                                                                                                            if (flag3 == data_item_code_report1.length) {
                                                                                                                var sql_get_so_luong_trong_phong_item_code_report1 = "SELECT SUM(total_numbers) AS 'so_luong_trong_phong',Department_id " + "FROM item_code_report1 " + "WHERE Department_id IN(" + stringDept + ") AND user_id=" + info.USER_ID + " " + "GROUP BY Department_id ";
                                                                                                                db.sequelize.query(sql_get_so_luong_trong_phong_item_code_report1)
                                                                                                                    .success(function(data_get_so_luong_trong_phong_item_code_report1) {

                                                                                                                        for (var z = 0; z < data_get_so_luong_trong_phong_item_code_report1.length; z++) {
                                                                                                                            for (var w = 0; w < data_item_code_report1.length; w++) {
                                                                                                                                db.item_code_report1.update({
                                                                                                                                        total_numbers_Dept: data_get_so_luong_trong_phong_item_code_report1[z].so_luong_trong_phong
                                                                                                                                    }, {
                                                                                                                                        Department_id: data_get_so_luong_trong_phong_item_code_report1[z].Department_id,
                                                                                                                                        user_id: info.USER_ID
                                                                                                                                    })
                                                                                                                                    .success(function(data_update_item_code_report1) {
                                                                                                                                        //tiep tuc o day
                                                                                                                                        flag4++;
                                                                                                                                        if (flag4 == data_get_so_luong_trong_phong_item_code_report1.length) {
                                                                                                                                            var sql_get_total_item_numbers = "SELECT COUNT(DISTINCT item_id) AS'total_item_numbers' FROM item_code_report1 WHERE user_id=" + info.USER_ID + " ";
                                                                                                                                            var sql_get_total_numbers = "SELECT SUM(total_numbers) AS 'total_numbers_all' FROM item_code_report1 WHERE user_id=" + info.USER_ID + " ";
                                                                                                                                            var sql_get_total_items_Dept = "SELECT COUNT(DISTINCT item_id) AS 'total_items_Dept',item_code_report1.Department_id FROM item_code_report1 WHERE item_code_report1.Department_id IN (" + stringDept + ") AND item_code_report1.user_id=" + info.USER_ID + " GROUP BY item_code_report1.Department_id";
                                                                                                                                            var sql_get_time_charge = "SELECT time_charge AS 'time_charge_items' ,Department_id,item_id,Employee_id " + "FROM item_code_detail_table " + "WHERE item_id IN(" + stringItem + ") AND Department_id IN (" + stringDept + ") AND user_id=" + info.USER_ID + " ";

                                                                                                                                            db.sequelize.query(sql_get_total_item_numbers)
                                                                                                                                                .success(function(data_get_total_item_numbers) {

                                                                                                                                                    db.sequelize.query(sql_get_total_numbers)
                                                                                                                                                        .success(function(data_get_total_numbers) {

                                                                                                                                                            db.sequelize.query(sql_get_total_items_Dept)
                                                                                                                                                                .success(function(data_get_total_items_Dept) {
                                                                                                                                                                    db.sequelize.query(sql_get_time_charge)
                                                                                                                                                                        .success(function(data_get_time_charge) {

                                                                                                                                                                            for (var d = 0; d < data_get_total_items_Dept.length; d++) {
                                                                                                                                                                                for (var r = 0; r < data_item_code_report1.length; r++) {
                                                                                                                                                                                    db.item_code_report1.update({
                                                                                                                                                                                            total_numbers_all: data_get_total_numbers[0].total_numbers_all,
                                                                                                                                                                                            total_items: data_get_total_item_numbers[0].total_item_numbers,
                                                                                                                                                                                            total_items_Dept: data_get_total_items_Dept[d].total_items_Dept,
                                                                                                                                                                                        }, {
                                                                                                                                                                                            Department_id: data_get_total_items_Dept[d].Department_id,
                                                                                                                                                                                            user_id: info.USER_ID

                                                                                                                                                                                        })
                                                                                                                                                                                        .success(function(data_update_item_code_report1_2) {
                                                                                                                                                                                            flag5++;
                                                                                                                                                                                            if (flag5 == data_get_total_items_Dept.length) {
                                                                                                                                                                                                for (var p = 0; p < data_get_time_charge.length; p++) {
                                                                                                                                                                                                    db.item_code_report1.update({
                                                                                                                                                                                                            time_charge_items: data_get_time_charge[p].time_charge_items
                                                                                                                                                                                                        }, {
                                                                                                                                                                                                            item_id: data_get_time_charge[p].item_id,
                                                                                                                                                                                                            Department_id: data_get_time_charge[p].Department_id,
                                                                                                                                                                                                            Employee_id: data_get_time_charge[p].Employee_id,
                                                                                                                                                                                                            user_id: info.USER_ID

                                                                                                                                                                                                        })
                                                                                                                                                                                                        .success(function(data_success) {
                                                                                                                                                                                                            flag6++;
                                                                                                                                                                                                            if (flag6 == data_get_time_charge.length) {

                                                                                                                                                                                                                var sql_get_time_charge_Dept = "SELECT SUM(time_charge_items) AS 'time_charge_Dept',Department_id " + "FROM item_code_report1 " + "WHERE Department_id IN (" + stringDept + ") AND user_id=" + info.USER_ID + " " + "GROUP BY Department_id ";
                                                                                                                                                                                                                db.sequelize.query(sql_get_time_charge_Dept)
                                                                                                                                                                                                                    .success(function(data_get_time_charge_Dept) {

                                                                                                                                                                                                                        for (var s = 0; s < data_get_time_charge_Dept.length; s++) {
                                                                                                                                                                                                                            for (var v = 0; v < data_get_time_charge.length; v++) {
                                                                                                                                                                                                                                if (data_get_time_charge[v].Department_id == data_get_time_charge_Dept[s].Department_id) {
                                                                                                                                                                                                                                    data_average[v] = ((data_get_time_charge[v].time_charge_items / data_get_time_charge_Dept[s].time_charge_Dept) * 100).toFixed(2);
                                                                                                                                                                                                                                    db.item_code_report1.update({
                                                                                                                                                                                                                                            time_charge_average: data_average[v]
                                                                                                                                                                                                                                        }, {
                                                                                                                                                                                                                                            item_id: data_get_time_charge[v].item_id,
                                                                                                                                                                                                                                            Department_id: data_get_time_charge[v].Department_id,
                                                                                                                                                                                                                                            Employee_id: data_get_time_charge[v].Employee_id,
                                                                                                                                                                                                                                            user_id: info.USER_ID
                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                        .success(function(success) {
                                                                                                                                                                                                                                            flag8++;
                                                                                                                                                                                                                                            if (flag7 == data_get_time_charge_Dept.length && flag8 == data_get_time_charge.length) {
                                                                                                                                                                                                                                                res.json({
                                                                                                                                                                                                                                                    status: "success"
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
                                                                                                                                                                                                                                        })


                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            flag7++;
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                    })
                                                                                                                                                                                                                    .error(function(err) {
                                                                                                                                                                                                                        console.log("*****ERROR:" + err + "*****");
                                                                                                                                                                                                                        res.json({
                                                                                                                                                                                                                            status: "error"
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                        return;
                                                                                                                                                                                                                    })

                                                                                                                                                                                                            }
                                                                                                                                                                                                        })
                                                                                                                                                                                                        .error(function(err) {
                                                                                                                                                                                                            console.log("*****ERROR:" + err + "*****");
                                                                                                                                                                                                            res.json({
                                                                                                                                                                                                                status: "error"
                                                                                                                                                                                                            });
                                                                                                                                                                                                            return;
                                                                                                                                                                                                        })
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        })
                                                                                                                                                                                        .error(function(err) {
                                                                                                                                                                                            console.log("*****ERROR:" + err + "*****");
                                                                                                                                                                                            res.json({
                                                                                                                                                                                                status: "error"
                                                                                                                                                                                            });
                                                                                                                                                                                            return;
                                                                                                                                                                                        })
                                                                                                                                                                                }
                                                                                                                                                                            }

                                                                                                                                                                        })
                                                                                                                                                                        .error(function(err) {
                                                                                                                                                                            console.log("*****ERROR:" + err + "*****");
                                                                                                                                                                            res.json({
                                                                                                                                                                                status: "error"
                                                                                                                                                                            });
                                                                                                                                                                            return;
                                                                                                                                                                        })

                                                                                                                                                                })

                                                                                                                                                        })
                                                                                                                                                        .error(function(err) {
                                                                                                                                                            console.log("*****ERROR:" + err + "*****");
                                                                                                                                                            res.json({
                                                                                                                                                                status: "error"
                                                                                                                                                            });
                                                                                                                                                            return;
                                                                                                                                                        })

                                                                                                                                                })
                                                                                                                                                .error(function(err) {
                                                                                                                                                    console.log("*****ERROR:" + err + "*****");
                                                                                                                                                    res.json({
                                                                                                                                                        status: "error"
                                                                                                                                                    });
                                                                                                                                                    return;
                                                                                                                                                })

                                                                                                                                        }
                                                                                                                                    })
                                                                                                                                    .error(function(err) {
                                                                                                                                        console.log("*****ERROR:" + err + "******");
                                                                                                                                        res.json({
                                                                                                                                            status: "error"
                                                                                                                                        });
                                                                                                                                        return;
                                                                                                                                    })
                                                                                                                            }
                                                                                                                        }

                                                                                                                    })
                                                                                                                    .error(function(err) {
                                                                                                                        console.log("*****ERROR:" + err + "*****");
                                                                                                                        res.json({
                                                                                                                            status: "error"
                                                                                                                        });
                                                                                                                        return;
                                                                                                                    })
                                                                                                            }
                                                                                                        })
                                                                                                        .error(function(err) {
                                                                                                            console.log("*****ERROR:" + err + "*****");
                                                                                                            res.json({
                                                                                                                status: "error"
                                                                                                            });
                                                                                                            return;
                                                                                                        })
                                                                                                }

                                                                                            })
                                                                                            .error(function(err) {
                                                                                                console.log("*****ERROR:" + err + "*****");
                                                                                                res.json({
                                                                                                    status: "error"
                                                                                                });
                                                                                                return;
                                                                                            })
                                                                                    })
                                                                                    .error(function(err) {
                                                                                        console.log("*****ERROR:" + err + "*****");
                                                                                        res.json({
                                                                                            status: "error"
                                                                                        });
                                                                                        return;
                                                                                    })
                                                                            }
                                                                        })
                                                                        .error(function(err) {
                                                                            console.log("*****ERROR:" + err + "*****");
                                                                            res.json({
                                                                                status: "error"
                                                                            });
                                                                            return;
                                                                        })
                                                                }

                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR:" + err + "*****");
                                                                res.json({
                                                                    status: "error"
                                                                });
                                                                return;
                                                            })
                                                    }
                                                })
                                                .error(function(err) {
                                                    console.log("*****ERROR:" + err + "*****");
                                                    res.json({
                                                        status: "error"
                                                    });
                                                    return;
                                                })
                                        }

                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR:" + err + "*****");
                                        res.json({
                                            status: "error"
                                        });
                                        return;
                                    })

                            })
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "error"
                                });
                                return;
                            })
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    })
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            })

    },
    //END REPORT ITEM NUMBER

    // DEL FILE
    DeleteFile: function(req, res) {
        var fileId = req.body.fileId;
        db.sequelize.query("DELETE FROM time_item_file WHERE time_item_file.file_id=:fileId", null, {
                raw: true
            }, {
                fileId: fileId
            })
            .success(function(isDelTimeItemFile) {
                db.sequelize.query("DELETE FROM time_task_file WHERE time_task_file.file_id=:fileId", null, {
                        raw: true
                    }, {
                        fileId: fileId
                    })
                    .success(function(isDelTimeTaskFile) {
                        res.json({
                            status: "success"
                        });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
            });
    },
    //END
};

//FUNCTION SEND MAIL SUBMIT FIRST
var sendMailSubmitLeave = function(req, res, info) {
    var arrayWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var DATE_OF_WEEK = arrayWeek[moment(info.dateSubmit).format('e') - 1];
    var DATE_SUBMIT = moment(info.dateSubmit).format('DD/MM/YYYY - HH:mm:ss');
    //GET INFOMATION MANAGE AND EMPLOYEE
    var queryGetInfoEmployee = "SELECT hr_employee.FirstName, hr_employee.LastName, sys_hierarchy_nodes.NODE_ID " +
        "FROM hr_employee " +
        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
        "WHERE users.id = :userID";
    db.sequelize.query(queryGetInfoEmployee, null, {
            raw: true
        }, {
            userID: info.userID
        })
        .success(function(resultInfoEmployee) {
            if (resultInfoEmployee !== undefined &&
                resultInfoEmployee !== null &&
                resultInfoEmployee.length !== 0 &&
                resultInfoEmployee[0] !== undefined &&
                resultInfoEmployee[0] !== null &&
                !(isNaN(resultInfoEmployee[0].NODE_ID))) {
                var queryGetInfoManage = "SELECT hr_employee.FirstName, hr_employee.LastName, hr_employee.Email " +
                    "FROM hr_employee " +
                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                    "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                    "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.TO_NODE_ID = sys_hierarchies_users.NODE_ID " +
                    "WHERE sys_hierarchy_nodes.NODE_ID = :nodeID";
                db.sequelize.query(queryGetInfoManage, null, {
                        raw: true
                    }, {
                        nodeID: resultInfoEmployee[0].NODE_ID
                    })
                    .success(function(resultInfoManage) {
                        if (resultInfoManage !== undefined &&
                            resultInfoManage !== null &&
                            resultInfoManage.length !== 0 &&
                            resultInfoManage[0] !== undefined &&
                            resultInfoManage[0] !== null &&
                            resultInfoManage[0].Email !== undefined &&
                            resultInfoManage[0].Email !== null &&
                            resultInfoManage[0].Email.length !== 0) {
                            //SEND EMAIL TO MANAGE
                            mailOptions = {
                                senders: 'TimeSheet',
                                recipients: resultInfoManage[0].Email,
                                subject: 'Notification of Submitted Leave(s)',
                                htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Dear <b>' + resultInfoManage[0].FirstName + ' ' + resultInfoManage[0].LastName + ',</label></b><br/><br/><br/>' +
                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This is a notice that you has been submitted a Leave Form from <b>' + resultInfoEmployee[0].FirstName + ' ' + resultInfoEmployee[0].LastName + '</b> on <b>' + DATE_OF_WEEK + ', ' +
                                    DATE_SUBMIT + '.</b><br/><br/><br/>' +
                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please log into the e-Timesheet System to review and approve/reject the leave.<br/><br/><br/>' +
                                    'Access the e-Timesheet System at https://apps.redimed.com.au</label><br/><br/><br/>' +
                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">e-Timesheet Reporting System<br></label><br/><br/><br/>' +
                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label>' +
                                    '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                                    '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                                    '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                                    'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                                    '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                            };

                            // CALL SEND MAIL
                            FunctionSendMail.sendEmail(req, res, mailOptions);
                            // END CALL

                            // END SEND EMAIL
                        }
                    })
                    .error(function(err) {
                        cosole.log("*****ERROR:" + err + "*****");
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
        });
    //END GET INFORMATION
};
//END SEND MAIL SUBMIT FIRST

//FUNCTION SEND MAIL SUBMIT SECOND
var sendMailSubmitLeaveAgain = function(req, res, info) {
    var arrayWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var DATE_OF_WEEK = arrayWeek[moment(info.dateSubmit).format('e') - 1];
    var DATE_SUBMIT = moment(info.dateSubmit).format('DD/MM/YYYY - HH:mm:ss');
    var queryGetNodeIdUserApproveFirst =
        "SElECT hr_employee.FirstName, hr_employee.LastName, hr_employee.Email, sys_hierarchy_nodes.TO_NODE_ID " +
        "FROM hr_employee " +
        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " +
        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
        "WHERE sys_hierarchies_users.USER_ID = :userId";
    db.sequelize.query(queryGetNodeIdUserApproveFirst, null, {
            raw: true
        }, {
            userId: info.userId
        })
        .success(function(resultNodeInUserApproveFirst) {
            if (resultNodeInUserApproveFirst !== undefined &&
                resultNodeInUserApproveFirst !== null &&
                resultNodeInUserApproveFirst.length !== 0) {
                var queryGetInfoUserApproveSecond =
                    "SElECT hr_employee.FirstName, hr_employee.LastName, hr_employee.Email " +
                    "FROM hr_employee " +
                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                    "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                    "INNER JOIN sys_hierarchy_nodes ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " +
                    "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                    "WHERE sys_hierarchy_nodes.NODE_ID = :nodeId";
                db.sequelize.query(queryGetInfoUserApproveSecond, null, {
                        raw: true
                    }, {
                        nodeId: resultNodeInUserApproveFirst[0].TO_NODE_ID
                    })
                    .success(function(resultInfoUserApproveSecond) {
                        if (resultInfoUserApproveSecond !== undefined &&
                            resultInfoUserApproveSecond !== null &&
                            resultInfoUserApproveSecond.length !== 0) {
                            var queryGetInfoEmployee =
                                "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName, hr_employee.Email " +
                                "FROM hr_employee " +
                                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                                "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                                "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                                "INNER JOIN sys_hierarchy_group on sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                                "INNER JOIN hr_leave ON hr_leave.user_id = users.id " +
                                "WHERE hr_leave.leave_id = :leaveID AND sys_hierarchy_group.GROUP_TYPE='Time Sheet'";
                            db.sequelize.query(queryGetInfoEmployee, null, {
                                    raw: true
                                }, {
                                    leaveID: info.leaveID
                                })
                                .success(function(resultInfoEmployee) {
                                    if (resultInfoEmployee !== undefined &&
                                        resultInfoEmployee !== null &&
                                        resultInfoEmployee.length !== 0) {
                                        for (var keyManageSecond in resultInfoUserApproveSecond) {
                                            var mailOptions = {
                                                senders: 'TimeSheet',
                                                recipients: resultInfoUserApproveSecond[keyManageSecond].Email,
                                                subject: 'Notification of Submitted Leave(s)',
                                                htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Dear <b>' + resultInfoUserApproveSecond[keyManageSecond].FirstName + ' ' + resultInfoUserApproveSecond[keyManageSecond].LastName + ',</label></b><br/><br/><br/>' +
                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This is a notice that you has been submitted a leave from <b>' + resultInfoEmployee[0].FirstName + ' ' + resultInfoEmployee[0].LastName + '</b> on <b>' + DATE_OF_WEEK + ', ' +
                                                    DATE_SUBMIT + '.</b><br/><br/><br/>' +
                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please log into the e-Timesheet System to review and approve/reject the leave.<br/><br/><br/>' +
                                                    'Access the e-Timesheet System at https://apps.redimed.com.au</label><br/><br/><br/>' +
                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">e-Timesheet Reporting System<br></label><br/><br/><br/>' +
                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label>' +
                                                    '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                                                    '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                                                    '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                                                    'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                                                    '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                                            };

                                            // CALL SEND MAIL
                                            FunctionSendMail.sendEmail(req, res, mailOptions);
                                            // END CALL
                                        }
                                    } else {
                                        console.log("*****ERROR:NOT FOUND INFOMATION EMPLOYEE TO SEND EMAIL*****");
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

                        }
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    });
            } else {
                res.json({
                    status: "error"
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
};
//END SEND MAIL SUBMIT SECOND

//SEND MAIL REJECT LEAVE
var sendMailLeave = function(req, res, info) {
    var mailOptions = {};
    var queryGetInfoEmployee =
        "SELECT hr_employee.FirstName, hr_employee.TITLE, hr_employee.Email, hr_employee.LastName, hr_leave.start_date, hr_leave.finish_date, hr_leave.user_id " +
        "FROM hr_employee INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
        "INNER JOIN hr_leave ON users.id = hr_leave.user_id " +
        "WHERE hr_leave.leave_id = :leaveID";
    db.sequelize.query(queryGetInfoEmployee, null, {
            raw: true
        }, {
            leaveID: info.leaveID
        })
        .success(function(result) {
            var start_date = "";
            var end_date = "";
            if (result[0] !== undefined && result[0] !== null) {
                start_date = moment(result[0].start_date).format('DD/MM/YYYY');
                finish_date = moment(result[0].finish_date).format('DD/MM/YYYY');
            }
            if (info.status === 4) {
                mailOptions = {
                    senders: 'TimeSheet',
                    recipients: result[0].Email,
                    subject: 'Notification of Rejected Leave(s)',
                    htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Attention: <b>' + result[0].FirstName + ' ' + result[0].LastName + ',</b></label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Your leave for the period (' + start_date + '–' + finish_date + ') has been rejected.<br/><br/><br/> Please log into the e-Timesheet System to correct and re-submit your leave. ' +
                        'Failure to re-submit your leave may result in not being paid or loss of accrued leave.</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">If you have any questions regarding your leave in general then please contact your Team Leader.</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet System at https://apps.redimed.com.au<label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">e-Timesheet Reporting System<br></label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond' +
                        '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                        '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                        '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                        'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                        '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                };
                queryGetPositionUserReject =
                    "SELECT hr_employee.TITLE " +
                    "FROM hr_employee " +
                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                    "WHERE users.id = :userId";
                db.sequelize.query(queryGetPositionUserReject, null, {
                        raw: true
                    }, {
                        userId: info.userID
                    })
                    .success(function(resultPosition) {
                        if (resultPosition !== undefined &&
                            resultPosition !== null &&
                            resultPosition.length !== 0 &&
                            resultPosition[0] !== undefined &&
                            resultPosition[0] !== null &&
                            resultPosition[0].TITLE === "Director" &&
                            result[0].TITLE === "Staff") {
                            var queryGetNodeIdManage =
                                "SELECT sys_hierarchy_nodes.TO_NODE_ID " +
                                "FROM sys_hierarchy_nodes " +
                                "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " +
                                "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " +
                                "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchies_users.USER_ID = :userId";
                            db.sequelize.query(queryGetNodeIdManage, null, {
                                    raw: true
                                }, {
                                    userId: result[0].user_id
                                })
                                .success(function(resultNodeIdManage) {
                                    if (resultNodeIdManage !== undefined &&
                                        resultNodeIdManage !== null &&
                                        resultNodeIdManage.length !== 0) {
                                        var queryGetEmailTeamLeader =
                                            "SElECT hr_employee.Email " +
                                            "FROM hr_employee " +
                                            "INNER JOIN users ON hr_employee.Employee_ID = users.employee_id " +
                                            "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " +
                                            "INNER JOIN sys_hierarchy_nodes ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.TO_NODE_ID " +
                                            "WHERE sys_hierarchies_users.NODE_ID = :nodeId";
                                        db.sequelize.query(queryGetEmailTeamLeader, null, {
                                                raw: true
                                            }, {
                                                nodeId: resultNodeIdManage[0].TO_NODE_ID
                                            })
                                            .success(function(resultEmailTeamLeader) {
                                                if (resultEmailTeamLeader !== undefined &&
                                                    resultEmailTeamLeader !== null &&
                                                    resultEmailTeamLeader.length !== 0 &&
                                                    resultEmailTeamLeader[0] !== undefined &&
                                                    resultEmailTeamLeader[0] !== null) {
                                                    mailOptions.cc = resultEmailTeamLeader[0].Email;
                                                }
                                                //CALL SEND MAIL
                                                FunctionSendMail.sendEmail(req, res, mailOptions);
                                                // END CALL
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
                        } else {
                            //CALL SEND MAIL
                            FunctionSendMail.sendEmail(req, res, mailOptions);
                            // END CALL
                        }

                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    });

                // END REJECT

            } else if (info.status === 3) {
                //IS APPROVE
                mailOptions = {
                    senders: 'TimeSheet',
                    recipients: result[0].Email,
                    subject: 'Notification of Approved Leave(s)',
                    htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Attention: <b>' +
                        result[0].FirstName + ' ' + result[0].LastName +
                        '</b></label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Your leave for the period (' +
                        start_date + '–' + finish_date + ') has been approved.</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet System at https://apps.redimed.com.au</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">e-Timesheet Reporting System<label><br/><br/><br/>' +
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
            res.json({
                status: "error"
            });
            return;

        });

};
//END SEND  MAIL

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

// FUNCTION TRACKER TIMESHEET
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
//END TRACKER TIMESHEET

//FUNCTION TRACKER LEAVE
var TracKerLeave = function(info) {
    var arrayAction = {
        1: "Save",
        2: "Submit",
        3: "Approve",
        4: "Reject",
        5: "Resubmit"
    };
    var nameAction = arrayAction[info.statusID];
    var queryTracKer = "INSERT INTO leave_tracker (action_name, leave_id, user_id, creation_date) " +
        "VALUES(:nameAction, :leaveID, :userID, :creationDate)";
    db.sequelize.query(queryTracKer, null, {
            "reload": true
        }, {
            nameAction: nameAction,
            leaveID: info.leaveID,
            userID: info.userID,
            creationDate: info.creationDate
        })
        .success(function(resultTracKer) {
            console.log("***** SAVE TRACKER SUCCESS *****");
        })
        .error(function(error) {
            console.log("***** SAVE TRACKER ERROR *****");
        });
};
//END TRACKER


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
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au<label><br/><br/><br/>' +
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
                        '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au</label><br/><br/><br/>' +
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
            res.json({
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
