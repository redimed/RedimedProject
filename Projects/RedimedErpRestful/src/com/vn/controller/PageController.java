package com.vn.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class PageController {
	@RequestMapping(value="login",method=RequestMethod.GET)
	public String loginPage()
	{
		return "page-with-body";
	}
}
