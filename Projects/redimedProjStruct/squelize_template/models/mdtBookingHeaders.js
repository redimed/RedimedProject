module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtBookingHeaders", {
            'Booking_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'PO_Number': { 
    type: DataTypes.STRING(20),  
            },
            'result_email': { 
    type: DataTypes.STRING(1000),  
            },
            'invoice_email': { 
    type: DataTypes.STRING(1000),  
            },
            'Project_Identofication': { 
    type: DataTypes.STRING(100),  
            },
            'Comments': { 
    type: DataTypes.STRING(250),  
            },
            'package_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Booking_Person': { 
    type: DataTypes.STRING(50),  
            },
            'contact_number': { 
    type: DataTypes.STRING(50),  
            },
            'period': { 
    type: DataTypes.INTEGER(11),  
            },
            'sub_company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'contact_email': { 
    type: DataTypes.STRING(50),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
            'isBookingAtRediMed': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "booking_headers",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}