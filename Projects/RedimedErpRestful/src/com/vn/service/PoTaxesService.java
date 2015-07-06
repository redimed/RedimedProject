package com.vn.service;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vn.entity.PoTaxes;

@Service
@Transactional
public class PoTaxesService {
	@Autowired
	private SessionFactory sessionFactory;
	
	public List<PoTaxes> getActiveTaxes()
	{
		return sessionFactory.getCurrentSession().createCriteria(PoTaxes.class).list();
	}
}
