module.exports=function(sequelize, DataTypes){
  var LinesIDSSYS=sequelize.define('LinesIDSSYS', {
  "IDAS_LINE_ID": DataTypes.INTEGER(11),
  "IDAS_GROUP_ID": DataTypes.INTEGER(11),
  "IDAS_DF_ID": DataTypes.INTEGER(11),
  "ORD": DataTypes.INTEGER(11),
  "QUESTION": DataTypes.STRING(200),
  "YES_NO": DataTypes.INTEGER(11),
  "ISENABLE": DataTypes.INTEGER(11),
  "Created_by": DataTypes.INTEGER(11),
  "Creation_date": DataTypes.DATE,
  "Last_updated_by": DataTypes.INTEGER(11),
  "Last_update_date": DataTypes.DATE
}, {
  tableName: 'sys_idas_lines',
  createdAt: 'Creation_date',
  updatedAt: 'Last_update_date'
});
return LinesIDSSYS;
}
