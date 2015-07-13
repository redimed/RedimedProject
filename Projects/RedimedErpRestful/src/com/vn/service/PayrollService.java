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
			CallableStatement cs=(CallableStatement) connection.prepareCall("{ call HRS.HRTIMEWEEK.InsertInterFace(?,?,?,?,?,?,?,?,?,?,?) }");
			cs.setInt(1, dataTimeWeek.getpEMPLOYEE_ID());
			cs.setString(2, dataTimeWeek.getpWEEKNO());
			cs.setDate(3, dataTimeWeek.getpFROMDATE());
			cs.setDate(4, dataTimeWeek.getpTODATE());
			cs.setInt(5, dataTimeWeek.getpPAID_HOUR());
			cs.setInt(6, dataTimeWeek.getpNON_PAID());
			cs.setInt(7, dataTimeWeek.getpOVER_TIME());
			cs.setInt(8, dataTimeWeek.getpPUBLIC_HOLIDAY());
			cs.setInt(9, dataTimeWeek.getpNON_PAID());
			cs.setInt(10, dataTimeWeek.getpCARER_PERSONAL());
			cs.registerOutParameter(11, java.sql.Types.VARCHAR);
			cs.executeUpdate();
			result = cs.getString(11);
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

