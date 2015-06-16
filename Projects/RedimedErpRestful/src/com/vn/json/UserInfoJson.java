package com.vn.json;

import java.io.Serializable;

public class UserInfoJson implements Serializable{
	private Integer id;
	private String userName;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "id:"+this.id+"; userName:"+this.userName;
	}
	
}
