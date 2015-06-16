package com.vn.service;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vn.entity.Users;
import com.vn.json.UserInfoJson;

@Service
@Transactional
public class UsersService {
	@Autowired
	private SessionFactory sessionFactory;
	
	public List<Users> getAllUsers()
	{
		return sessionFactory.getCurrentSession().createCriteria(Users.class).list();
	}
	
	public UserInfoJson insertUser(Users user)
	{
//		Session session=sessionFactory.getCurrentSession();
//		session.save(user);
//		UserInfoJson ru=new UserInfoJson();
//		ru.setId(user.getId());
//		ru.setUserName(user.getUserName());
		
		Session session = sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		session.save(user);
		tx.commit();
		session.close();
		UserInfoJson ru=new UserInfoJson();
		ru.setId(user.getId());
		ru.setUserName(user.getUserName());
		return ru;
	}
	
}
