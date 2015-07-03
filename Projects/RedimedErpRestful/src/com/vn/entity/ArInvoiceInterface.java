package com.vn.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="AR.AR_INVOICE_INTERFACE")
public class ArInvoiceInterface {
	@EmbeddedId
	protected ArInvoicePK arInvoicePK;
	
	@Column(name="INVOICE_NUMBER")
	private String invoiceNumber;
	
	@Column(name="INVOICE_DATE")
	private Date invoiceDate;
	
	@Column(name="PATIENT_ID")
	private Integer patientId;
	
	@Column(name="PATIENT_NAME")
	private String patientName;
	
	@Column(name="COMPANY_ID")
	private Integer companyId;
	
	@Column(name="INSURER_ID")
	private Integer insurerId;
	
	@Column(name="TAX_ID")
	private Integer taxId;
	
	@Column(name="TAX_RATE")
	private Float taxRate;
	
	@Column(name="ITEM_ID")
	private Integer itemId;
	
	@Column(name="PRICE")
	private Float price;
	
	@Column(name="QUANTITY")
	private Integer quantity;
	
	@Column(name="AMOUNT")
	private Float amount;
	
	@Column(name="TAX_AMOUNT")
	private Float taxAmount;
	
	@Column(name="TOTAL_AMOUNT")
	private Float totalAmount;
	
	@Column(name="STATUS")
	private String status;

	public ArInvoicePK getArInvoicePK() {
		return arInvoicePK;
	}

	public void setArInvoicePK(ArInvoicePK arInvoicePK) {
		this.arInvoicePK = arInvoicePK;
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
