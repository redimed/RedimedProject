package com.vn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.vn.json.PayrollTimeWeekJson;
import com.vn.service.PayrollService;

@Controller
public class PayrollTimeWeekController {
	@Autowired
	PayrollService payrollService;
	
	@RequestMapping(value="erp/array-payroll-timeweek/transfer-timeweek", method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	
	public @ResponseBody  Boolean transferTimeWeek(@RequestBody PayrollTimeWeekJson dataTimeWeek){
		Boolean result = payrollService.TranferTimesheetApproved(dataTimeWeek);
		return result;
	}
}
