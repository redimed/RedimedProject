var db = require('../../models');
var sys_hierarchy_group = db.sys_hierarchy_group;
var sys_hierarchy_nodes = db.sys_hierarchy_nodes;
var sys_hierarchies_types = db.sys_hierarchies_types;
var Company = db.Company;
var RedimedSite = db.RedimedSite;
module.exports = {
    //MODULE SYSTEM
    LoadFunction: function(req, res) {
        var searchObj = req.body.searchObj;
        var searchParam = [];
        var strQuery = '';
        for (var key in searchObj.data) {
            if (searchObj.data[key]) {
                strQuery += key + ' like ? and ';
                searchParam.push('%' + searchObj.data[key] + '%');
            }
        }
        strQuery = strQuery.substring(0, strQuery.length - 5);
        searchParam.unshift(strQuery);
        sys_hierarchies_types.findAndCountAll({
                order: 'Creation_date ' + searchObj.order,
                offset: searchObj.offset,
                limit: searchObj.limit,
                where: searchParam
            }, {
                raw: true
            })
            .success(function(data) {
                if (data.count === 0) {
                    res.json({
                        status: "fail",
                        result: searchObj.data.TYPE_NAME === "" ? null : [],
                        count: 0
                    });
                    return;
                } else {
                    res.json({
                        status: "success",
                        count: data.count,
                        result: data.rows
                    });
                    return;
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    "status": "error",
                    result: null,
                    count: 0
                });
                return;
            });
    },
    InsertFunction: function(req, res) {
        var info = req.body.info || [];
        sys_hierarchies_types.create({
                TYPE_NAME: info.model[0].value,
                Created_by: info.userId
            }, {
                raw: true
            })
            .success(function(result) {
                sys_hierarchies_types.findAll({
                        order: 'Creation_date DESC'
                    }, {
                        raw: true
                    })
                    .success(function(result) {
                        res.json({
                            "status": "success",
                            "result": result
                        });
                        return;
                    })
                    .error(function(err) {
                        consolle.log("*****ERR:" + err + "*****");
                        res.json({
                            status: "getFail"
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "fail"
                });
                return;
            });
    },
    DeleteFunction: function(req, res) {
        var info = req.body.info || -1;
        var query = "DELETE FROM sys_hierarchies_types where TYPE_NAME = '" + info + "'";
        db.sequelize.query(query)
            .success(function() {
                res.json({
                    "status": "success",
                    "result": info
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "******");
                res.json({
                    "status": "fail",
                    "result": -1
                });
                return;
            });
    },
    LoadOneFunction: function(req, res) {
        var info = req.body.info;
        sys_hierarchies_types.find({
                where: {
                    TYPE_NAME: info
                }
            }, {
                raw: true
            })
            .success(function(result) {
                res.json({
                    "status": "success",
                    "result": result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    "status": "fail",
                    "result": []
                });
                return;
            });
    },

    UpdateFunction: function(req, res) {
        var info = req.body.info;
        var TYPE_NAME = info.oldName;
        sys_hierarchies_types.update({
                TYPE_NAME: info.model[0].value,
                Last_updated_by: info.userId
            }, {
                TYPE_NAME: TYPE_NAME
            })
            .success(function(result1) {
                sys_hierarchies_types.findAll({
                        order: "Creation_date DESC"
                    }, {
                        raw: true
                    })
                    .success(function(result2) {
                        res.json({
                            "status": "success",
                            result: result2
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            "status": "fail",
                            "result": []
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    "status": status,
                    "result": []
                });
                return;
            });
    },
    //END MODULE SYSTEM

    //MODULE TREE
    LoadTree: function(req, res) {
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

    InsertTree: function(req, res) {
        var info = req.body.info || [];
        var typeSystem = info.GROUP_TYPE;
        sys_hierarchy_group.max("GROUP_ID").success(function(maxId) {
                var GROUP_ID = maxId + 1;
                sys_hierarchy_group.create({
                        GROUP_ID: GROUP_ID,
                        GROUP_NAME: info.GROUP_NAME,
                        DECRIPTION: info.DECRIPTION,
                        GROUP_TYPE: info.GROUP_TYPE,
                        COMPANY_ID: info.COMPANY_ID,
                        SITE_ID: info.SITE_ID,
                        ISENABLE: 1,
                        CREATED_BY: info.userId

                    }, {
                        raw: true
                    })
                    .success(function(result) {
                        //get list department agian
                        var query = "SELECT sys_hierarchy_group.GROUP_ID, sys_hierarchy_group.GROUP_NAME, sys_hierarchy_group.DECRIPTION, sys_hierarchy_group.CREATION_DATE, sys_hierarchy_group.COMPANY_ID, companies.Company_name FROM sys_hierarchy_group INNER JOIN companies ON sys_hierarchy_group.COMPANY_ID=companies.id WHERE sys_hierarchy_group.GROUP_TYPE='" + typeSystem + "' ORDER BY CREATION_DATE DESC";
                        db.sequelize.query(query)
                            .success(function(result) {
                                res.json({
                                    "status": "success",
                                    "result": result
                                });
                                return;
                            })
                            //end get list department again
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "getFail"
                                });
                                return;
                            });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            "status": "fail",
                            "result": []
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    "status": "fail",
                    "result": []
                });
                return;
            });
    },

    DeleteTree: function(req, res) {
        var info = req.body.info;
        var query = "DELETE FROM sys_hierarchy_group WHERE GROUP_ID=" + info;
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
                    status: "fail",
                    result: []
                });
                return;
            });
    },

    LoadOneTree: function(req, res) {
        var info = req.body.info;
        sys_hierarchy_group.find({
                where: {
                    GROUP_ID: info
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
            .error(function(error) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "fail",
                    result: []
                });
                return;
            });
    },

    UpdateTree: function(req, res) {
        var info = req.body.info;
        sys_hierarchy_group.update({
                GROUP_NAME: info.GROUP_NAME,
                DECRIPTION: info.DECRIPTION,
                COMPANY_ID: info.COMPANY_ID,
                SITE_ID: info.SITE_ID,
                Last_updated_by: info.userId
            }, {
                GROUP_ID: info.GROUP_ID
            })
            .success(function(result1) {
                var query = "SELECT sys_hierarchy_group.GROUP_ID, sys_hierarchy_group.GROUP_NAME, sys_hierarchy_group.DECRIPTION, sys_hierarchy_group.CREATION_DATE, sys_hierarchy_group.COMPANY_ID, companies.Company_name FROM sys_hierarchy_group INNER JOIN companies ON sys_hierarchy_group.COMPANY_ID=companies.id WHERE sys_hierarchy_group.GROUP_TYPE='" + info.GROUP_TYPE + "' ORDER BY CREATION_DATE DESC";
                db.sequelize.query(query)
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
                            status: "fail",
                            result: []
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "fail",
                    result: []
                });
                return;
            });
    },

    //MODULE COMPANY
    LoadCompany: function(req, res) {
        Company.findAll({}, {
                raw: true
            })
            .success(function(company) {
                var status = "findFound";
                if (company === undefined || company === null || company.length === 0) {
                    console.log("Not found company!");
                    status = "findNull";
                };
                res.json({
                    "status": status,
                    "company": company
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    "status": "fail",
                    "company": []
                });
                return;
            });
    },
    //END MODULE COMPANY

    //MODULE SITE
    LoadSite: function(req, res) {
        RedimedSite.findAll({}, {
                raw: true
            })
            .success(function(redimedSite) {
                var status = "FindFound";
                if (redimedSite === undefined || redimedSite === null || redimedSite.length === 0) {
                    console.log("Not found RedumedSite!");
                    status = "findNull";
                };
                res.json({
                    "status": status,
                    "redimedSite": redimedSite
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    "status": "fail",
                    "redimedSite": []
                });
                return;
            });
    },
    //END MODULE SITE

    //END MODULE DEPARTMENT

    //MODULE NODE
    InsertNode: function(req, res) {
        var info = req.body.info;
        sys_hierarchy_nodes.max("NODE_ID")
            .success(function(maxId) {
                var id = maxId + 1;
                sys_hierarchy_nodes.create({
                        NODE_ID: id,
                        NODE_CODE: info.NODE_CODE,
                        FROM_VALUE: info.FROM_VALUE,
                        TO_VALUE: info.TO_VALUE,
                        ISVALUE: 1,
                        TO_NODE_ID: info.parent,
                        GROUP_ID: info.GROUP_ID,
                        DECRIPTION: info.DECRIPTION,
                        GROUP_TYPE: info.GROUP_TYPE,
                        ISENABLE: 1,
                        CREATED_BY: info.userId,
                        seq: info.seq

                    }, {
                        raw: true
                    })
                    .success(function(result1) {
                        sys_hierarchy_nodes.findAll({
                                where: {
                                    GROUP_ID: info.GROUP_ID
                                }
                            }, {
                                raw: true
                            })
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
                                return;
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
                    status: "fail"
                });
            });
    },
    //END MODULE NDOE

    //MODULE TREEAPPROVE
    LoadTreeApprove: function(req, res) {
        var info = req.body.info;
        sys_hierarchy_nodes.findAll({
                where: {
                    GROUP_ID: info.GROUP_ID
                }
            }, {
                raw: true
            })
            .success(function(result) {
                if (result === undefined || result === null || result.length === 0) {
                    sys_hierarchy_nodes.max("NODE_ID")
                        .success(function(maxId) {
                            var id = maxId + 1;
                            sys_hierarchy_nodes.create({
                                    NODE_ID: id,
                                    NODE_CODE: "Root",
                                    FROM_VALUE: null,
                                    TO_VALUE: null,
                                    ISVALUE: 0,
                                    TO_NODE_ID: null,
                                    GROUP_ID: info.GROUP_ID,
                                    DECRIPTION: null,
                                    GROUP_TYPE: info.GROUP_TYPE,
                                    ISENABLE: 1,
                                    CREATED_BY: info.userId,
                                    seq: 0

                                }, {
                                    raw: true
                                })
                                .success(function(result1) {
                                    sys_hierarchy_nodes.findAll({
                                            where: {
                                                GROUP_ID: info.GROUP_ID
                                            }
                                        }, {
                                            raw: true
                                        })
                                        .success(function(result2) {
                                            res.json({
                                                status: "findNull",
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
                                status: "fail",
                                result: []
                            });
                            return;
                        });

                } else {
                    res.json({
                        "status": "findFound",
                        "result": result
                    });
                    return;
                }

            })
            .error(function(err) {
                console.log("*****ERROR:" + error + "*****");
                res.json({
                    status: "fail",
                    result: []
                });
                return;
            });
    },
    //END MODULE TREEAPPROVE
    LoadOneNode: function(req, res) {
        var info = req.body.info;
        sys_hierarchy_nodes.find({
                where: {
                    NODE_ID: info
                }
            }, {
                raw: true
            })
            .success(function(result) {
                if (result === undefined || result === null || result.length === 0) {
                    console.log("*****Find not found node!*****");
                    res.json({
                        status: "fail",
                        result: []
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
    UpdateNode: function(req, res) {
        var info = req.body.info;
        sys_hierarchy_nodes.update({
                NODE_CODE: info.NODE_CODE,
                FROM_VALUE: info.FROM_VALUE,
                TO_VALUE: info.TO_VALUE,
                TO_NODE_ID: info.TO_NODE_ID,
                GROUP_ID: info.GROUP_ID,
                DECRIPTION: info.DECRIPTION,
                GROUP_TYPE: info.GROUP_TYPE,
                Last_updated_by: info.userId
            }, {
                NODE_ID: info.NODE_ID
            })
            .success(function(result1) {
                sys_hierarchy_nodes.findAll({
                        where: {
                            GROUP_ID: info.GROUP_ID
                        }
                    }, {
                        raw: true
                    })
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
                            status: "fail"
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "fail"
                });
                return;
            });
    },

    DeleteNode: function(req, res) {
        var info = req.body.info;
        var query = "DELETE FROM sys_hierarchy_nodes WHERE NODE_ID = " + info.NODE_ID;
        db.sequelize.query(query)
            .success(function(result1) {
                sys_hierarchy_nodes.findAll({
                        where: {
                            GROUP_ID: info.GROUP_ID
                        }
                    }, {
                        raw: true
                    })
                    .success(function(result2) {
                        res.json({
                            status: "success",
                            result: result2
                        });
                        return;
                    }).error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "fail"
                        });
                        return;
                    });

            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "fail"
                });
                return;
            });
    }
};
