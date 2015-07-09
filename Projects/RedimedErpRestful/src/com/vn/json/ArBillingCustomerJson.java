package com.vn.json;

public class ArBillingCustomerJson {
	//insurer->company->patient
	private String pVsName;//insurer name->company name->patient name
	private String pAddress;
	private String pCusChar20;//code
	private String pCusNumber1;//id
	private String pVsSiteName;//insurer name->company name->patient name
	private String pAddressLine1;//==pAddress
	private String pCountry;
	private String pPhone;
	
	public String getpVsName() {
		return pVsName;
	}
	public void setpVsName(String pVsName) {
		this.pVsName = pVsName;
	}
	public String getpAddress() {
		return pAddress;
	}
	public void setpAddress(String pAddress) {
		this.pAddress = pAddress;
	}
	public String getpCusChar20() {
		return pCusChar20;
	}
	public void setpCusChar20(String pCusChar20) {
		this.pCusChar20 = pCusChar20;
	}
	public String getpCusNumber1() {
		return pCusNumber1;
	}
	public void setpCusNumber1(String pCusNumber1) {
		this.pCusNumber1 = pCusNumber1;
	}
	public String getpVsSiteName() {
		return pVsSiteName;
	}
	public void setpVsSiteName(String pVsSiteName) {
		this.pVsSiteName = pVsSiteName;
	}
	public String getpAddressLine1() {
		return pAddressLine1;
	}
	public void setpAddressLine1(String pAddressLine1) {
		this.pAddressLine1 = pAddressLine1;
	}
	public String getpCountry() {
		return pCountry;
	}
	public void setpCountry(String pCountry) {
		this.pCountry = pCountry;
	}
	public String getpPhone() {
		return pPhone;
	}
	public void setpPhone(String pPhone) {
		this.pPhone = pPhone;
	}

}
