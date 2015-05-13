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
                                            result[keyTimeSheet].activity_id === 16) &&
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
            "hr_leave.is_approve_second, " +
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
                                                                                        resultInfoLevel2.length !== 0) {
                                                                                        result[indexResult].person_charge = resultInfoLevel2[0].FirstName + " " + resultInfoLevel2[0].LastName;
                                                                                    } else if (resultInfoLevel1 !== undefined &&
                                                                                        resultInfoLevel1 !== null &&
                                                                                        resultInfoLevel1.length !== 0) {
                                                                                        result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                    }
                                                                                    //END LEVEL 2

                                                                                }
                                                                            });
                                                                            //END PROCESSING
                                                                            res.json({
                                                                                status: "success",
                                                                                result: result,
                                                                                count: resultCount[0].COUNT
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
                                                                        count: resultCount[0].COUNT
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
                                                    count: resultCount[0].COUNT
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
            "SELECT hr_leave.leave_id, hr_leave.application_date, hr_leave.start_date, hr_leave.is_reject, " +
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
                        "SELECT DISTINCT sys_hierarchies_users.USER_ID " + //SELECT
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
                                        "hr_leave.status_id, hr_leave.is_approve_first, hr_leave.is_approve_second, " + //SELECT
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
                                        "hr_leave.status_id, hr_leave.is_approve_first, hr_leave.is_approve_second, " + //SELECT
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
                                                                                                        resultInfoLevel2.length !== 0) {
                                                                                                        result[indexResult].person_charge = resultInfoLevel2[0].FirstName + " " + resultInfoLevel2[0].LastName;
                                                                                                    } else if (resultInfoLevel1 !== undefined &&
                                                                                                        resultInfoLevel1 !== null &&
                                                                                                        resultInfoLevel1.length !== 0) {
                                                                                                        result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                                    }
                                                                                                    //END LEVEL 2

                                                                                                }
                                                                                            });
                                                                                            //END PROCESSING
                                                                                            res.json({
                                                                                                status: "success",
                                                                                                result: result,
                                                                                                count: resultCount[0].COUNT
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
                                                                                        count: resultCount[0].COUNT
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
                                                                    count: resultCount[0].COUNT
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

                                                }

                                                //END ERROR
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
