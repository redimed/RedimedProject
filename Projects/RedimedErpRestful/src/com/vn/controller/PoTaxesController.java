package com.vn.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.vn.entity.PoTaxes;
import com.vn.json.PoTaxJson;
import com.vn.json.PoTaxesListJson;
import com.vn.service.InvoiceService;
import com.vn.service.PoTaxesService;

@Controller
public class PoTaxesController {
	@Autowired
	PoTaxesService poTaxesService;

	@RequestMapping(value="erp/po-taxes/get-list-active",method=RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody List<PoTaxJson> getActivePoTaxes()
	{
		
		List<PoTaxes> listTax=poTaxesService.getActiveTaxes();
		List<PoTaxJson> listJson=new ArrayList<PoTaxJson>();
		if(listTax!=null)
		{
			for(PoTaxes item:listTax)
			{
				PoTaxJson json=new PoTaxJson();
				json.setTaxId(item.getTaxId());
				json.setTaxCode(item.getTaxCode());
				json.setRate(item.getRate());
				json.setEnableFlag(item.getEnableFlag());
				listJson.add(json);
			}
		}
		
		return listJson;
	}
}
