package com.vn.json;

import java.util.List;

public class UserInfoListJson {
	private List<UserInfoJson> listUser;

	public List<UserInfoJson> getListUser() {
		return listUser;
	}

	public void setListUser(List<UserInfoJson> listUser) {
		this.listUser = listUser;
	}

	@Override
	public String toString() {
		String str="";
		for(int i=0;i<this.listUser.size();i++)
		{
			str=str+this.listUser.get(i).toString()+"\n";
		}
		return str;
	}
	
	
	
}
