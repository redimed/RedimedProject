package com.vn.json;

import java.util.Date;

public class ArInvoiceInterfaceJson { 
	  
	private Integer headerId;
	private Integer lineId;
	private String invoiceNumber;
	private Date invoiceDate;
	private Integer patientId;
	private String patientName;
	private Integer companyId;
	private Integer insurerId;
	private Integer taxId;
	private Float taxRate;
	private Integer itemId;
	private Float price;
	private Integer quantity;
	private Float amount;
	private Float taxAmount;
	private Float totalAmount;
	private String status;
	
	public Integer getHeaderId() {
		return headerId;
	}
	public void setHeaderId(Integer headerId) {
		this.headerId = headerId;
	}
	public Integer getLineId() {
		return lineId;
	}
	public void setLineId(Integer lineId) {
		this.lineId = lineId;
	}
	public String getInvoiceNumber() {
		return invoiceNumber;
	}
	public void setInvoiceNumber(String invoiceNumber) {
		this.invoiceNumber = invoiceNumber;
	}
	public Date getInvoiceDate() {
		return invoiceDate;
	}
	public void setInvoiceDate(Date invoiceDate) {
		this.invoiceDate = invoiceDate;
	}
	public Integer getPatientId() {
		return patientId;
	}
	public void setPatientId(Integer patientId) {
		this.patientId = patientId;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public Integer getCompanyId() {
		return companyId;
	}
	public void setCompanyId(Integer companyId) {
		this.companyId = companyId;
	}
	public Integer getInsurerId() {
		return insurerId;
	}
	public void setInsurerId(Integer insurerId) {
		this.insurerId = insurerId;
	}
	public Integer getTaxId() {
		return taxId;
	}
	public void setTaxId(Integer taxId) {
		this.taxId = taxId;
	}
	public Float getTaxRate() {
		return taxRate;
	}
	public void setTaxRate(Float taxRate) {
		this.taxRate = taxRate;
	}
	public Integer getItemId() {
		return itemId;
	}
	public void setItemId(Integer itemId) {
		this.itemId = itemId;
	}
	public Float getPrice() {
		return price;
	}
	public void setPrice(Float price) {
		this.price = price;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public Float getAmount() {
		return amount;
	}
	public void setAmount(Float amount) {
		this.amount = amount;
	}
	public Float getTaxAmount() {
		return taxAmount;
	}
	public void setTaxAmount(Float taxAmount) {
		this.taxAmount = taxAmount;
	}
	public Float getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(Float totalAmount) {
		this.totalAmount = totalAmount;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	
}
