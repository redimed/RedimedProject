/**
 * Created by meditech on 19/09/2014.
 */
module.exports = function(sequelize,DataTypes){
    var Function = sequelize.define('Function',{
        function_id: DataTypes.INTEGER(11),
        decription: DataTypes.STRING(60),
        definition: DataTypes.STRING(200),
        type: DataTypes.STRING(1)
    },{
        tableName : 'redi_functions',
        timestamps: false
    });

    return Function;
};