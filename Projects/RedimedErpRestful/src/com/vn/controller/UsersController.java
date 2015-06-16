package com.vn.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.vn.entity.Users;
import com.vn.json.UserInfoJson;
import com.vn.json.UserInfoListJson;
import com.vn.service.UsersService;

@Controller
public class UsersController {
	@Autowired UsersService usersService;
	
	@RequestMapping(value="all-users",method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody List<UserInfoJson> getAllPerson(@RequestBody UserInfoListJson postData)
	{
		System.out.println(postData);
		List<Users> listUsers=usersService.getAllUsers();
		List<UserInfoJson> listJSON=new ArrayList();
		if(listUsers!=null)
		{
			for(Users user:listUsers)
			{
				UserInfoJson json=new UserInfoJson();
				json.setId(user.getId());
				json.setUserName(user.getUserName());
				listJSON.add(json);
			}
		}
		return listJSON;
	}
	
	@RequestMapping(value="insert-user",method=RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody UserInfoJson insertUser(@RequestBody UserInfoJson user)
	{
		Users u=new Users();
		u.setId(user.getId());
		u.setUserName(user.getUserName());
		UserInfoJson ru= usersService.insertUser(u);
		return ru;
	}
}
