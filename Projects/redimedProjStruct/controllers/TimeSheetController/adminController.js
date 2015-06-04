//EXPORTS MODEL
var db = require("../../models");
//END
module.exports = {
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
        var query = "SELECT sys_hierarchy_group.GROUP_ID, sys_hierarchy_group.GROUP_NAME, sys_hierarchy_group.DECRIPTION, " +
            "sys_hierarchy_group.CREATION_DATE, sys_hierarchy_group.COMPANY_ID, companies.Company_name FROM sys_hierarchy_group " +
            "INNER JOIN companies ON sys_hierarchy_group.COMPANY_ID=companies.id" + " where " + searchParam + " ORDER BY CREATION_DATE " +
            searchObj.order + " limit " + searchObj.limit + " offset " + searchObj.offset;
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
                    db.sys_hierarchy_group.count({
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

        db.sys_hierarchy_nodes.findAndCountAll({
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
        db.UserType.findAll({}, {
                raw: true
            })
            .success(function(userType) {
                db.Company.findAll({}, {
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
        db.Departments.findAll({
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
        db.sys_hierarchy_nodes.findAll({
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
        db.sys_hierarchies_users.update({
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
        db.Location.findAll({}, {
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
        db.Departments.find({
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
        db.Departments.max("departmentid")
            .success(function(maxDept) {
                var id = maxDept + 1;
                db.Departments.create({
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
        db.Departments.update({
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
    }
};
