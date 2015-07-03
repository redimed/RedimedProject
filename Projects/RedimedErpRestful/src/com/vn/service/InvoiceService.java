package com.vn.service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.connection.ConnectionProvider;
import org.hibernate.criterion.Restrictions;
import org.hibernate.engine.SessionFactoryImplementor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vn.entity.ArInvoiceInterface;
import com.vn.entity.ArInvoicePK;
import com.vn.json.ArBillingCustomerJson;
import com.vn.json.ArBillingCustomerListJson;
import com.vn.json.ArBillingItemJson;
import com.vn.json.ArBillingItemListJson;
import com.vn.json.ArInvoiceInterfaceJson;
import com.vn.json.ArInvoiceInterfaceListJson;
import com.vn.json.UserInfoJson;

@Service
@Transactional
public class InvoiceService {
	@Autowired
	private SessionFactory sessionFactory;
	
	public Boolean insertCustomer(ArBillingCustomerJson item)
	{
		SessionFactoryImplementor sessionFactoryImplementation = (SessionFactoryImplementor) sessionFactory;
		ConnectionProvider connectionProvider = sessionFactoryImplementation.getConnectionProvider();
		int num=0;
		try {
			// do your work using connection
		    Connection connection = connectionProvider.getConnection();
		    CallableStatement cs = connection.prepareCall("{ call AR.ARBILLINGS.SYNCUSTOMERS(?,?,?,?,?,?,?,?) }");
			cs.setString(1,item.getpVsName());  
		    cs.setString(2,item.getpAddress());  
		    cs.setString(3,item.getpCusChar20());  
		    cs.setString(4,item.getpCusNumber1());  
		    cs.setString(5,item.getpVsSiteName());  
		    cs.setString(6,item.getpAddressLine1());  
		    cs.setString(7,item.getpCountry());  
		    cs.setString(8,item.getpPhone());  
		    num=cs.executeUpdate();  
		} catch (SQLException e) {
		    e.printStackTrace();
		}
		if(num>0)
			return true;
		else
			return false;
	}
	
	public Boolean insertListCustomers(ArBillingCustomerListJson listCustomer)
	{
		SessionFactoryImplementor sessionFactoryImplementation = (SessionFactoryImplementor) sessionFactory;
		ConnectionProvider connectionProvider = sessionFactoryImplementation.getConnectionProvider();
		Connection connection;
		try {
			connection = connectionProvider.getConnection();
//			connection.setAutoCommit(false);
			for(int i=0;i<listCustomer.getListArBillingCustomerJson().size();i++){
				ArBillingCustomerJson item=listCustomer.getListArBillingCustomerJson().get(i);
				CallableStatement cs = connection.prepareCall("{ call AR.ARBILLINGS.SYNCUSTOMERS(?,?,?,?,?,?,?,?) }");
				cs.setString(1,item.getpVsName());  
			    cs.setString(2,item.getpAddress());  
			    cs.setString(3,item.getpCusChar20());  
			    cs.setString(4,item.getpCusNumber1());  
			    cs.setString(5,item.getpVsSiteName());  
			    cs.setString(6,item.getpAddressLine1());  
			    cs.setString(7,item.getpCountry());  
			    cs.setString(8,item.getpPhone());  
			    cs.executeUpdate();  
			}
			//connection.commit();
		} catch (SQLException e) {
			return false;
		}
		
		return true;
	}
	
	public Boolean insertItem(ArBillingItemJson item)
	{
		SessionFactoryImplementor sessionFactoryImplementation = (SessionFactoryImplementor) sessionFactory;
		ConnectionProvider connectionProvider = sessionFactoryImplementation.getConnectionProvider();
		Connection connection;
		try {
			connection = connectionProvider.getConnection();
			//connection.setAutoCommit(false);
			CallableStatement cs = connection.prepareCall("{ call AR.ARBILLINGS.SYNITEMS(?,?,?,?) }");
			cs.setString(1,item.getpOldItemNumber());  
		    cs.setString(2,item.getpOldItemNumber2());  
		    cs.setString(3,item.getpPrimaryUom());  
		    cs.setString(4,item.getpItemName1());  
		    cs.executeUpdate();  
			//connection.commit();
		} catch (SQLException e) {
			return false;
		}
		
		return true;
	}
	
	public Boolean insertListItems(ArBillingItemListJson listItem)
	{
		SessionFactoryImplementor sessionFactoryImplementation = (SessionFactoryImplementor) sessionFactory;
		ConnectionProvider connectionProvider = sessionFactoryImplementation.getConnectionProvider();
		Connection connection;
		try {
			connection = connectionProvider.getConnection();
//			connection.setAutoCommit(false);
			for(int i=0;i<listItem.getListItem().size();i++){
				ArBillingItemJson item=listItem.getListItem().get(i);
				CallableStatement cs = connection.prepareCall("{ call AR.ARBILLINGS.SYNITEMS(?,?,?,?) }");
				cs.setString(1,item.getpOldItemNumber());  
			    cs.setString(2,item.getpOldItemNumber2());  
			    cs.setString(3,item.getpPrimaryUom());  
			    cs.setString(4,item.getpItemName1());  
			    cs.executeUpdate();  
			}
			//connection.commit();
		} catch (SQLException e) {
			System.out.println(e);
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	
	public Boolean insertInvoiceLine(ArInvoiceInterfaceJson line)
	{
		Session session = sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		try {
			ArInvoiceInterface insertLine=new ArInvoiceInterface();
			insertLine.setArInvoicePK(new ArInvoicePK(line.getHeaderId(),line.getLineId()));
			insertLine.setInvoiceNumber(line.getInvoiceNumber());
			insertLine.setInvoiceDate(line.getInvoiceDate());
			insertLine.setPatientId(line.getPatientId());
			insertLine.setPatientName(line.getPatientName());
			insertLine.setCompanyId(line.getCompanyId());
			insertLine.setInsurerId(line.getInsurerId());
			insertLine.setTaxId(line.getTaxId());
			insertLine.setTaxRate(line.getTaxRate());
			insertLine.setItemId(line.getItemId());
			insertLine.setPrice(line.getPrice());
			insertLine.setQuantity(line.getQuantity());
			insertLine.setAmount(line.getAmount());
			insertLine.setTaxAmount(line.getTaxAmount());
			insertLine.setTotalAmount(line.getTotalAmount());
			insertLine.setStatus(line.getStatus());
			session.save(insertLine);
			tx.commit();
			session.close();
		} catch (Exception e) {
			session.close();
			return false;
		} finally{
			session.close();
		}
		return true;
	}
	
	public Boolean insertListInvoiceLines(ArInvoiceInterfaceListJson listLine)
	{
		Session session = sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		try {
			for(int i=0;i<listLine.getListInvoiceInterface().size();i++)
			{
				ArInvoiceInterfaceJson line=listLine.getListInvoiceInterface().get(i);
				ArInvoiceInterface insertLine=new ArInvoiceInterface();
				insertLine.setArInvoicePK(new ArInvoicePK(line.getHeaderId(),line.getLineId()));
				insertLine.setInvoiceNumber(line.getInvoiceNumber());
				insertLine.setInvoiceDate(line.getInvoiceDate());
				insertLine.setPatientId(line.getPatientId());
				insertLine.setPatientName(line.getPatientName());
				insertLine.setCompanyId(line.getCompanyId());
				insertLine.setInsurerId(line.getInsurerId());
				insertLine.setTaxId(line.getTaxId());
				insertLine.setTaxRate(line.getTaxRate());
				insertLine.setItemId(line.getItemId());
				insertLine.setPrice(line.getPrice());
				insertLine.setQuantity(line.getQuantity());
				insertLine.setAmount(line.getAmount());
				insertLine.setTaxAmount(line.getTaxAmount());
				insertLine.setTotalAmount(line.getTotalAmount());
				insertLine.setStatus(line.getStatus());
				session.save(insertLine);
			}
			tx.commit();
		} catch (Exception e) {
			session.close();
			return false;
		} finally 
		{
			session.close();
		}
		return true;
	}
	
	public ArInvoiceInterface getInvoiceHeaderStatus(Integer headerId)
	{
		List<ArInvoiceInterface> list= sessionFactory.getCurrentSession().createCriteria(ArInvoiceInterface.class)
		.add(Restrictions.eq("arInvoicePK.headerId",headerId))
		.setFirstResult(0)
		.list();
		if(list.size()>0)
			return list.get(0);
		else 
			return null;
	}
}
