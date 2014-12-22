var k_model = require("./k_model");
var install_model = new k_model('inv_items', 'ITEM_ID');
var squel = install_model._squel;

var jsesc = require('jsesc');

function convert_date_xml(date) {
    if (!date || date == '')
        return null;
    var spices = date.split('.');

    return spices[2] + '-' + spices[1] + '-' + spices[0];
}

install_model.build_instance_from_xml_node = function(item) {
    var node = {};
    node.ITEM_CODE = item.ItemNum[0];
    node.ISENABLE = 1;
    node.ITEM_NAME = item.Description[0];
    node.SUB_ITEM_CODE = item.SubItemNum[0] ? item.SubItemNum[0] : null;

    node.ITEM_START_DATE = convert_date_xml(item.ItemStartDate[0]);
    node.ITEM_END_DATE = convert_date_xml(item.ItemEndDate[0]);

    node.CATEGORY = item.Category[0];
    node.INV_GROUP = item.Group[0];
    node.SUB_GROUP = item.SubGroup[0];
    node.SUB_HEADING = item.SubHeading[0] ? item.SubHeading[0] : null;
    node.ITEM_TYPE = item.ItemType[0];
    node.FEE_TYPE = item.FeeType[0];
    node.PROVIDER_TYPE = item.ProviderType[0];
    node.NEW_ITEM = item.NewItem[0];
    node.ITEM_CHANGE = item.ItemChange[0];

    node.ANAES_CHANGE = item.AnaesChange[0];
    node.FEE_CHANGE = item.FeeChange[0];

    node.EMSN_CHANGE = item.EMSNChange[0];
    node.EMSN_CAP = item.EMSNCap[0];

    node.BENEFIT_TYPE = item.BenefitType[0];
    node.BENEFIT_START_DATE = convert_date_xml(item.BenefitStartDate[0]);

    //        node.ITEM_CHANGE = item.FeeStartDate ? convert_date_xml(item.FeeStartDate[0]) : null;
    node.DESCRIPTOR_CHANGE = item.DescriptorChange[0];
    // node.ITEM_CHANGE = item.ScheduleFee[0];
    // node.ITEM_CHANGE = item.Benefit100[0];
    // node.ITEM_CHANGE = item.BasicUnits[0];

    node.EMSN_START_DATE = convert_date_xml(item.EMSNStartDate[0]);
    node.EMSN_END_DATE = convert_date_xml(item.EMSNEndDate[0]);
    node.EMSN_FIXED_CAP_AMOUNT = item.EMSNFixedCapAmount[0] ? parseFloat(item.EMSNFixedCapAmount[0]) : 0;
    node.EMSN_MAXIMUM_CAP = item.EMSNMaximumCap[0] ? parseFloat(item.EMSNMaximumCap[0]) : 0;
    node.EMSN_PERCENTAGE_CAP = item.EMSNPercentageCap[0] ? parseFloat(item.EMSNPercentageCap[0]) : 0;
    node.EMSN_DESCRIPTION = item.EMSNDescription[0];
    node.EMSN_CHANGE_DATE = convert_date_xml(item.EMSNChangeDate[0]);

    node.DESCRIPTION_START_DATE = convert_date_xml(item.DescriptionStartDate[0]);


    node.QFE_START_DATE = convert_date_xml(item.QFEStartDate[0]);
    node.QFE_END_DATE = convert_date_xml(item.QFEEndDate[0]);
    return node;
}

install_model.sql_insert_from_source = function (data_list) {
    var arr = [];
    // var now_str = functions.toCurrentTimeDatabase();
    for (var i = 0; i < data_list.length; ++i) {
        var item = data_list[i];

        var node = install_model.build_instance_from_xml_node(item);

        for (var key in node) {
            if (typeof node[key] == 'string') {
                node[key] = jsesc(node[key], {
                    'quotes': 'single'
                });
                node[key] = node[key].trim();
            }
        };

        arr.push(node);
    }

    var querybuilder = install_model.query_insert_batch(arr);
    querybuilder.onDupUpdate('SUB_ITEM_CODE', 'VALUES(SUB_ITEM_CODE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('ITEM_START_DATE', 'VALUES(ITEM_START_DATE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('ITEM_END_DATE', 'VALUES(ITEM_END_DATE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('CATEGORY', 'VALUES(CATEGORY)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('INV_GROUP', 'VALUES(INV_GROUP)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('SUB_GROUP', 'VALUES(SUB_GROUP)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('SUB_HEADING', 'VALUES(SUB_HEADING)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('ITEM_TYPE', 'VALUES(ITEM_TYPE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('FEE_TYPE', 'VALUES(FEE_TYPE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('NEW_ITEM', 'VALUES(NEW_ITEM)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('PROVIDER_TYPE', 'VALUES(PROVIDER_TYPE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('ITEM_CHANGE', 'VALUES(ITEM_CHANGE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('ANAES_CHANGE', 'VALUES(ANAES_CHANGE)', {
        dontQuote: true
    });

    querybuilder.onDupUpdate('FEE_CHANGE', 'VALUES(FEE_CHANGE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('EMSN_CHANGE', 'VALUES(EMSN_CHANGE)', {
        dontQuote: true
    });

    querybuilder.onDupUpdate('EMSN_CAP', 'VALUES(EMSN_CAP)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('BENEFIT_TYPE', 'VALUES(BENEFIT_TYPE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('BENEFIT_START_DATE', 'VALUES(BENEFIT_START_DATE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('ITEM_CHANGE', 'VALUES(ITEM_CHANGE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('DESCRIPTOR_CHANGE', 'VALUES(DESCRIPTOR_CHANGE)', {
        dontQuote: true
    });

    querybuilder.onDupUpdate('EMSN_START_DATE', 'VALUES(EMSN_START_DATE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('EMSN_END_DATE', 'VALUES(EMSN_END_DATE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('EMSN_FIXED_CAP_AMOUNT', 'VALUES(EMSN_FIXED_CAP_AMOUNT)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('EMSN_MAXIMUM_CAP', 'VALUES(EMSN_MAXIMUM_CAP)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('EMSN_PERCENTAGE_CAP', 'VALUES(EMSN_PERCENTAGE_CAP)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('EMSN_DESCRIPTION', 'VALUES(EMSN_DESCRIPTION)', {
        dontQuote: true
    });

    querybuilder.onDupUpdate('EMSN_CHANGE_DATE', 'VALUES(EMSN_CHANGE_DATE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('DESCRIPTION_START_DATE', 'VALUES(DESCRIPTION_START_DATE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('ITEM_NAME', 'VALUES(ITEM_NAME)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('QFE_START_DATE', 'VALUES(QFE_START_DATE)', {
        dontQuote: true
    });
    querybuilder.onDupUpdate('QFE_END_DATE', 'VALUES(QFE_END_DATE)', {
        dontQuote: true
    });

    return querybuilder.toString();
}

module.exports = install_model;