/**
* Created by meditech on 22/09/2014.
*/
module.exports = function(sequelize,DataTypes){
    var Company = sequelize.define('Company',{
        id : {type:DataTypes.INTEGER(11), primaryKey: true},
        Company_name : DataTypes.STRING(100) ,
        Industry : DataTypes.STRING(50) ,
        Addr : DataTypes.STRING(100) ,
        postcode : DataTypes.INTEGER(11) ,
        State : DataTypes.STRING(25) ,
        Description : DataTypes.STRING(250) ,
        latitude : DataTypes.FLOAT ,
        longitude : DataTypes.FLOAT ,
        country : DataTypes.STRING(45) ,
        result_email : DataTypes.STRING(100) ,
        invoice_email : DataTypes.STRING(100) ,
        PO_number : DataTypes.STRING(50) ,
        isProject : DataTypes.INTEGER(4) ,
        isCalendar : DataTypes.INTEGER(4) ,
        father_id : DataTypes.INTEGER(11) ,
        report_to_email : DataTypes.STRING(50) ,
        default_status : DataTypes.STRING(20) ,
        isInvoiceEmailToUser : DataTypes.INTEGER(11) ,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE ,
        isAddContactEmailToResult : DataTypes.INTEGER(11) ,
        IMA : DataTypes.STRING(50) ,
        Site_name : DataTypes.STRING(100) ,
        Medic_contact_no : DataTypes.STRING(15) ,
        Email : DataTypes.STRING(100) ,
        CODE : DataTypes.STRING(100) ,
        Insurer : DataTypes.INTEGER(11) ,
        Phone : DataTypes.STRING(15) ,
        Site_medic : DataTypes.STRING(100) ,
        User_id : DataTypes.INTEGER(11) ,
        isPO : DataTypes.INTEGER(11) ,
        isExtra: DataTypes.INTEGER(11)

    },{
        tableName: 'companies',
        createdAt:'Creation_date',
        updatedAt: 'Last_update_date',
        classMethods: {
            associate: function(models) {
                Company.hasMany(models.Patient, { foreignKey: 'company_id', as: 'Patients' });
                Company.hasMany(models.Insurer, {as: 'Insurers', foreignKey: 'company_id', through: 'company_insurers'});
            }
        }
    });

    return Company;
};