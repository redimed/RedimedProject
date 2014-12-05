module.exports=function(sequelize, DataTypes){
  var GroupsIDSSYS=sequelize.define("GroupsIDSSYS", {
  "IDAS_GROUP_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
  "IDAS_DF_ID": DataTypes.INTEGER(11),
  "ORD": DataTypes.INTEGER(11),
  "GROUP_NAME": DataTypes.STRING(200),
  "USER_TYPE": DataTypes.STRING(10),
  "ISENABLE": DataTypes.INTEGER(11),
  "Created_by": DataTypes.INTEGER(11),
  "Creation_date": DataTypes.DATE,
  "Last_updated_by": DataTypes.INTEGER(11),
  "Last_update_date": DataTypes.DATE
}, {
  tableName: 'sys_idas_groups',
  createdAt: 'Creation_date',
  updatedAt: 'Last_update_date'
});
return GroupsIDSSYS;
}
