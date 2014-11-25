module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtUser", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'user_name': { 
    type: DataTypes.STRING(50),  
            },
            'password': { 
    type: DataTypes.STRING(500),  
            },
            'company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'user_type': { 
    type: DataTypes.STRING(20),  
            },
            'result_email': { 
    type: DataTypes.STRING(1000),  
            },
            'invoiceemail': { 
    type: DataTypes.STRING(1000),  
            },
            'PO_number': { 
    type: DataTypes.STRING(50),  
            },
            'Booking_Person': { 
    type: DataTypes.STRING(50),  
            },
            'Contact_number': { 
    type: DataTypes.STRING(50),  
            },
            'isProject': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCalendar': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAll': { 
    type: DataTypes.INTEGER(11),  
            },
            'isEnable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Contact_email': { 
    type: DataTypes.STRING(50),  
            },
            'Report_To_email': { 
    type: DataTypes.STRING(50),  
            },
            'isMakeBooking': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBooking': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPackage': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPosition': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSetting': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'isDownloadResult': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAllCompanyData': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAdmin': { 
    type: DataTypes.INTEGER(11),  
            },
            'isReceiveEmailAfterHour': { 
    type: DataTypes.INTEGER(11),  
            },
            'function_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'function_taskFlow': { 
    type: DataTypes.STRING(100),  
            },
            'employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'img': { 
    type: DataTypes.TEXT,  
            },
            'HAVE_BELL': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'HAVE_LETTER': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'HAVE_CALENDAR': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
}, {
tableName: "users",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}