package com.vn.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class ArInvoicePK implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name="HEADER_ID")
	private Integer headerId;
	
	@Column(name="LINE_ID")
	private Integer lineId;

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

	public ArInvoicePK(Integer headerId, Integer lineId) {
		super();
		this.headerId = headerId;
		this.lineId = lineId;
	}

	public ArInvoicePK() {
		
	}
	
	
	
}
