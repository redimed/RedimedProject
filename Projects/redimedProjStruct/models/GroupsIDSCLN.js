module.exports=function(sequelize, DataTypes){
  var GroupsIDSCLN=sequelize.define('GroupsIDSCLN', {
  "IDAS_GROUP_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
  "IDAS_ID": DataTypes.INTEGER(11),
  "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey:true},
  "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
  "ORD": DataTypes.INTEGER(11),
  "GROUP_NAME": DataTypes.STRING(200),
  "USER_TYPE": DataTypes.STRING(10),
  "Created_by": DataTypes.INTEGER(11),
  "Creation_date": DataTypes.DATE,
  "Last_updated_by": DataTypes.INTEGER(11),
  "Last_update_date": DataTypes.DATE,
  "ISENABLE": DataTypes.INTEGER(11)
},{
  tableName: 'cln_idas_groups',
  createdAt: 'Creation_date',
  updatedAt: 'Last_update_date'
});
return GroupsIDSCLN;
}
