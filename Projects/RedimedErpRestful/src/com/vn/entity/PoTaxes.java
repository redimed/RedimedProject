package com.vn.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="po.po_taxes")
public class PoTaxes {
	@Id
	@Column(name="TAX_ID")
	private Integer taxId;
	
	@Column(name="TAX_CODE")
	private String taxCode;
	
	@Column(name="RATE")
	private Float rate;
	
	@Column(name="ENABLE_FLAG")
	private String enableFlag;

	public Integer getTaxId() {
		return taxId;
	}

	public void setTaxId(Integer taxId) {
		this.taxId = taxId;
	}

	public String getTaxCode() {
		return taxCode;
	}

	public void setTaxCode(String taxCode) {
		this.taxCode = taxCode;
	}

	public Float getRate() {
		return rate;
	}

	public void setRate(Float rate) {
		this.rate = rate;
	}

	public String getEnableFlag() {
		return enableFlag;
	}

	public void setEnableFlag(String enableFlag) {
		this.enableFlag = enableFlag;
	}
	
	
}
