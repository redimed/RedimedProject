var db = require("../../models");
var sys_hierarchy_group = db.sys_hierarchy_group;
var sys_hierarchy_nodes = db.sys_hierarchy_nodes;
var sys_hierarchies_users = db.sys_hierarchies_users;
var User = db.User;
var UserType = db.UserType;
var Company = db.Company;
var Departments = db.Departments;
var Location = db.timeLocation;
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
        var strQuery = "SELECT time_tasks.date, time_tasks.tasks_id,time_tasks.order, time_tasks.task, time_location.NAME AS LOCATION, time_activity.NAME, departments.departmentName, " +
            "time_tasks.time_charge as chargeDate, time_tasks.task, time_tasks_week.task_status_id, time_task_status.name as status, time_item_task.quantity, time_item_task.time_charge, " +
            "time_tasks_week.time_charge as chargeWeek, time_tasks_week.time_rest, time_tasks_week.time_in_lieu, time_tasks_week.over_time, time_tasks_week.comments, time_item_code.ITEM_ID, time_item_code.ITEM_ID, " +
            "time_tasks_week.start_date, time_tasks_week.end_date, " + "hr_employee.Employee_Code, hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct FROM time_tasks_week " +
            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id INNER JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "INNER JOIN users ON users.id = time_tasks_week.user_id INNER JOIN hr_employee ON " +
            "hr_employee.Employee_ID = users.employee_id INNER JOIN departments ON departments.departmentid = time_tasks.department_code_id " +
            "INNER JOIN time_location ON time_location.location_id = time_tasks.location_id INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "LEFT JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id LEFT JOIN time_item_code ON time_item_code.ITEM_ID = time_item_task.item_id " +
            "WHERE departments.departmentType = 'Time Sheet' AND time_tasks_week.task_week_id = " + idTaskWeek + " ORDER BY time_tasks.order";
        db.sequelize.query(strQuery)
            .success(function(result) {
                if (result === null || result.length === 0) {
                    res.json({
                        status: "success",
                        result: null
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
                    status: "error",
                    result: []
                });
                return;
            });
    },

    ViewItem: function(req, res) {
        var taskID = req.body.taskID;
        var query = "SELECT time_item_code.ITEM_ID, time_item_code.ITEM_NAME, time_tasks.date, time_tasks.time_charge, time_tasks.task, time_activity.NAME, " +
            "departments.departmentName FROM time_tasks INNER JOIN " +
            "time_location ON time_location.location_id = time_tasks.location_id INNER JOIN departments ON " +
            "time_tasks.department_code_id = departments.departmentid INNER JOIN time_activity ON " +
            "time_activity.activity_id = time_activity.activity_id INNER JOIN time_item_task ON time_item_task.task_id = " +
            "time_tasks.tasks_id INNER JOIN time_item_code ON time_item_code.ITEM_ID = time_item_task.item_id " +
            "WHERE time_tasks.tasks_id = " + taskID;
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
        //get NODE_ID Head of Dept. on TIMESHEET
        var strQueryGetNodeDept = "SELECT sys_hierarchy_nodes.NODE_ID FROM sys_hierarchy_nodes INNER JOIN sys_hierarchy_group ON " +
            "sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID INNER JOIN sys_hierarchies_types ON " +
            " sys_hierarchies_types.TYPE_NAME = sys_hierarchy_group.GROUP_TYPE INNER JOIN sys_hierarchies_users ON " +
            "sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID WHERE sys_hierarchies_users.USER_ID = " + searchObj.USER_ID +
            " AND sys_hierarchies_types.TYPE_NAME='Time Sheet'";
        db.sequelize.query(strQueryGetNodeDept)
            .success(function(result) {
                if (result === undefined || result === null || result.length === 0) {
                    res.json({
                        status: "error"
                    });
                    return;
                } else {
                    var NodeDeptId = "";
                    for (var deptId in result) {
                        if (result[deptId] !== undefined &&
                            result[deptId] !== null &&
                            result[deptId] !== "") {
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
                                console.log("DEPT NULL");
                                res.json({
                                    status: "error"
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
                                                status: "error"
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
                                            var strUserStaff = "SELECT USER_ID FROM sys_hierarchies_users WHERE NODE_ID IN" +
                                                NodeList + " AND DEPARTMENT_CODE_ID IN " + Depts;
                                            db.sequelize.query(strUserStaff)
                                                .success(function(resultListUser) {
                                                    if (resultListUser === undefined || resultListUser === null || resultListUser.length === 0) {
                                                        res.json({
                                                            status: "error"
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
                                                            "time_tasks_week.time_rest, time_tasks_week.over_time, time_tasks_week.date_submited, time_tasks_week.comments, " +
                                                            "hr_employee.Employee_Code, hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct, time_task_status.name " +
                                                            "FROM time_tasks_week INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
                                                            "INNER JOIN users ON time_tasks_week.user_id = users.id INNER JOIN time_task_status ON " +
                                                            "time_tasks_week.task_status_id = time_task_status.task_status_id INNER JOIN hr_employee ON " +
                                                            "hr_employee.Employee_ID = users.employee_id WHERE time_tasks.department_code_id IN " + Depts +
                                                            " AND users.id IN " + listUser + strSearch + strSearchEmployee + orderBY + " LIMIT " + searchObj.limit +
                                                            " OFFSET " + searchObj.offset;
                                                        var queryCountApprovedTimeSheet = "SELECT COUNT(DISTINCT time_tasks_week.task_week_id) AS COUNT " +
                                                            "FROM time_tasks_week INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
                                                            "INNER JOIN users ON time_tasks_week.user_id = users.id INNER JOIN time_task_status ON " +
                                                            "time_tasks_week.task_status_id = time_task_status.task_status_id INNER JOIN hr_employee ON " +
                                                            "hr_employee.Employee_ID = users.employee_id WHERE time_tasks.department_code_id IN " + Depts +
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
        var query = "UPDATE time_tasks_week SET task_status_id = 4, comments ='" +
            info.comments + "' WHERE task_week_id = " + info.idTaskWeek;
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
                return;
            });
    },
    ApproveTaskWeek: function(req, res) {
        var info = req.body.info;
        var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var timeType = "";
        if (info.time_rest !== 0) {
            var hourInLieu = parseInt(info.time_in_lieu.substring(0, 2));
            var minuteInLieu = parseInt(info.time_in_lieu.substring(2, 4));
            var time_in_lieu = hourInLieu + (minuteInLieu / 60);
            var hourOver = parseInt(info.over_time.substring(0, 2));
            var minuteOver = parseInt(info.over_time.substring(2, 4));
            var over_time = hourOver + (minuteOver / 60);
            if (time_in_lieu !== undefined) {
                timeType += ", time_in_lieu = " + time_in_lieu;
            }
            if (over_time !== undefined) {
                timeType += ", over_time = " + over_time;
            }
            timeType += ", time_rest = 0";
        }
        var query = "UPDATE time_tasks_week SET task_status_id = 3, approved_date = '" + date + "'" + timeType + " WHERE task_week_id = " + info.idTaskWeek;
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
                return;
            });
    },
    //ROLE
    LoadRole: function(req, res) {
            var USER_ID = req.body.USER_ID;
            var query = "SELECT NODE_CODE FROM sys_hierarchy_nodes INNER JOIN sys_hierarchy_group ON " +
                "sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID INNER JOIN sys_hierarchies_types ON " +
                " sys_hierarchies_types.TYPE_NAME = sys_hierarchy_group.GROUP_TYPE INNER JOIN sys_hierarchies_users ON " +
                "sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID WHERE sys_hierarchies_users.USER_ID = " + USER_ID +
                " AND sys_hierarchies_types.TYPE_NAME='Time Sheet'";
            db.sequelize.query(query)
                .success(function(result) {
                    if (result === undefined || result === null || result.length === 0) {
                        res.json({
                            status: "fail",
                            position: []
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
        }
        //END ROLE
};
