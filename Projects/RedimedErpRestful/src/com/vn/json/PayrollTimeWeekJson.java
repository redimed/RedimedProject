package com.vn.json;

import java.sql.Date;

public class PayrollTimeWeekJson {
private String pEMPLOYEE_CODE;
private String pWEEKNO;
private Date pFROMDATE;
private Date pTODATE;
private int pPAID_HOUR;
private int pNON_PAID;
private int pOVER_TIME;
private int pPUBLIC_HOLIDAY;
private int pANNUAL_LEAVE;
private int pCARER_PERSONAL;

public String getpWEEKNO() {
	return pWEEKNO;
}
public void setpWEEKNO(String pWEEKNO) {
	this.pWEEKNO = pWEEKNO;
}
public Date getpFROMDATE() {
	return pFROMDATE;
}
public void setpFROMDATE(Date pFROMDATE) {
	this.pFROMDATE = pFROMDATE;
}
public Date getpTODATE() {
	return pTODATE;
}
public void setpTODATE(Date pTODATE) {
	this.pTODATE = pTODATE;
}
public int getpPAID_HOUR() {
	return pPAID_HOUR;
}
public void setpPAID_HOUR(int pPAID_HOUR) {
	this.pPAID_HOUR = pPAID_HOUR;
}
public int getpNON_PAID() {
	return pNON_PAID;
}
public void setpNON_PAID(int pNON_PAID) {
	this.pNON_PAID = pNON_PAID;
}
public int getpOVER_TIME() {
	return pOVER_TIME;
}
public void setpOVER_TIME(int pOVER_TIME) {
	this.pOVER_TIME = pOVER_TIME;
}
public int getpPUBLIC_HOLIDAY() {
	return pPUBLIC_HOLIDAY;
}
public void setpPUBLIC_HOLIDAY(int pPUBLIC_HOLIDAY) {
	this.pPUBLIC_HOLIDAY = pPUBLIC_HOLIDAY;
}
public int getpANNUAL_LEAVE() {
	return pANNUAL_LEAVE;
}
public void setpANNUAL_LEAVE(int pANNUAL_LEAVE) {
	this.pANNUAL_LEAVE = pANNUAL_LEAVE;
}
public int getpCARER_PERSONAL() {
	return pCARER_PERSONAL;
}
public void setpCARER_PERSONAL(int pCARER_PERSONAL) {
	this.pCARER_PERSONAL = pCARER_PERSONAL;
}
public String getpEMPLOYEE_CODE() {
	return pEMPLOYEE_CODE;
}
public void setpEMPLOYEE_CODE(String pEMPLOYEE_CODE) {
	this.pEMPLOYEE_CODE = pEMPLOYEE_CODE;
}

}
