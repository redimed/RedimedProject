package com.vn.service;

import java.sql.SQLException;
import java.sql.CallableStatement;
import java.sql.Connection;
import org.hibernate.SessionFactory;
import org.hibernate.connection.ConnectionProvider;
import org.hibernate.engine.SessionFactoryImplementor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vn.json.PayrollTimeWeekJson;

@Service
@Transactional
public class PayrollService {
	@Autowired
	private SessionFactory sessionFactory;
	
	public Boolean TranferTimesheetApproved(PayrollTimeWeekJson dataTimeWeek)
	{
		SessionFactoryImplementor sessionFactoryImplementation = (SessionFactoryImplementor) sessionFactory;
		ConnectionProvider connectionProvider = sessionFactoryImplementation.getConnectionProvider();
		String result="";
	try{
		//connection success and transfer timesheet
		Connection connection = connectionProvider.getConnection();
//		for(int i=1;i<=4;i++){
			CallableStatement cs=(CallableStatement) connection.prepareCall("{ call HRS.HRTIMEWEEK.InsertInterFace(?,?,?,?,?,?,?,?) }");
			cs.setString(1, dataTimeWeek.getpEMPLOYEE_ID());
			cs.setString(2, dataTimeWeek.getpWEEKNO());
			cs.setString(3, dataTimeWeek.getpFROMDATE());
			cs.setString(4, dataTimeWeek.getpTODATE());
			cs.setString(5, dataTimeWeek.getpWAGE_CODE());
			cs.setString(6, dataTimeWeek.getpWAGE_NAME());
			cs.setString(7, dataTimeWeek.getpTIME_WEEK());
			cs.registerOutParameter(8, java.sql.Types.VARCHAR);
			cs.executeUpdate();
			result = cs.getString(8);
//			if(!result.equals("Completed")){
//				break;
//			}
//		}
	}
	catch(SQLException e){
		e.printStackTrace();
	}
	if(result.equals("Completed"))
	{
		return true;
	}
	else{
		return false;
	}
		}
}

