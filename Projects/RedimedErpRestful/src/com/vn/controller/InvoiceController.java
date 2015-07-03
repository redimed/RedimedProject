package com.vn.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.vn.entity.ArInvoiceInterface;
import com.vn.json.ArBillingCustomerJson;
import com.vn.json.ArBillingCustomerListJson;
import com.vn.json.ArBillingItemJson;
import com.vn.json.ArBillingItemListJson;
import com.vn.json.ArInvoiceInterfaceJson;
import com.vn.json.ArInvoiceInterfaceListJson;
import com.vn.json.UserInfoListJson;
import com.vn.service.InvoiceService;

@Controller
public class InvoiceController {
	@Autowired
	InvoiceService invoiceService;
	
	@RequestMapping(value="erp/ar-billing-customer/insert-customers",method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Boolean insertCustomer(@RequestBody ArBillingCustomerListJson postData)
	{
		invoiceService.insertListCustomers(postData);
		return true;
	}
	
	@RequestMapping(value="erp/ar-billing-customer/insert-customer",method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Boolean insertCustomer(@RequestBody ArBillingCustomerJson postData)
	{
		Boolean result=invoiceService.insertCustomer(postData);
		return result;
	}
	
	@RequestMapping(value="erp/ar-billing-item/insert-item",method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Boolean insertItem(@RequestBody ArBillingItemJson postData)
	{
		Boolean result=invoiceService.insertItem(postData);
		return result;
	}
	
	@RequestMapping(value="erp/ar-billing-item/insert-items",method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Boolean insertItems(@RequestBody ArBillingItemListJson postData)
	{
		Boolean result=invoiceService.insertListItems(postData);
		return result;
	}
	
	@RequestMapping(value="erp/ar-invoice-interface/insert-line",method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Boolean insertItems(@RequestBody ArInvoiceInterfaceJson postData)
	{
		Boolean result=invoiceService.addInvoiceLine(postData);
		return result;
	}
	
	@RequestMapping(value="erp/ar-invoice-interface/insert-lines",method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Boolean insertItems(@RequestBody ArInvoiceInterfaceListJson postData)
	{
		Boolean result=invoiceService.addListInvoiceLines(postData);
		return result;
	}
	
	
	@RequestMapping(value="erp/ar-invoice-interface/header-status",method=RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String getInvoiceHeaderStatus(@RequestParam("headerId") Integer headerId)
	{
		ArInvoiceInterface result=invoiceService.getInvoiceHeaderStatus(headerId);
		if(result!=null)
		{
			return result.getStatus();
		}
		else
		{
			return null;
		}
	}
}
