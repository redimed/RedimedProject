
var getUrl=function(part)
{
	return baseUrl+part;
}
function aaaa()
{
	var list={
			listUser:[{id:'333',userName:'aaa'},{id:'444',userName:'bbb'}]
	}
	var userInfo={
			id:'333',
			userName:'34343'
	};
	$.ajax({
		type: "POST",
		dataType: 'json', 
		contentType: 'application/json',
	    mimeType: 'application/json',
		url: getUrl("all-users.html"),
		//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
		data: JSON.stringify(list), 
		success: function(data)
		{
			alert(JSON.stringify(data))
		}
	}); 
}

function insertUser()
{
	var userInfo={
			id:'7776',
			userName:'tan ne tan ne6'
	};
	$.ajax({
		type: "POST",
		dataType: 'json', 
		contentType: 'application/json',
	    mimeType: 'application/json',
		url: getUrl("insert-user.html"),
		//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
		data: JSON.stringify(userInfo), 
		success: function(data)
		{
			alert(JSON.stringify(data))
		}
	}); 
}

function getTaxes()
{
	$.ajax({
		url : getUrl("erp/po-taxes/get-list-active.html"),
		type: "GET",
		success: function(data) {
			alert(JSON.stringify(data));
		},
		error: function() {
			
		}
	});
}

function insertCustomers()
{
	var list={
			listArBillingCustomerJson:[
			      {pVsName:'qq2234',
			    	  pAddress:'qq2234',
			    	  pCusChar20:'qq2234',
			    	  pCusNumber1:'1123',
			    	  pVsSiteName:'qq',
			    	  pAddressLine1:'qq',
			    	  pCountry:'qq',
			    	  pPhone:'qq'},
		    	  {pVsName:'ww2234',
			    	  pAddress:'ww2234',
			    	  pCusChar20:'ww2234',
			    	  pCusNumber1:'1124',
			    	  pVsSiteName:'ww',
			    	  pAddressLine1:'ww',
			    	  pCountry:'ww',
			    	  pPhone:'ww'},
			      ]
	}

	$.ajax({
		type: "POST",
		dataType: 'json', 
		contentType: 'application/json',
	    mimeType: 'application/json',
		url: getUrl("erp/ar-billing-customer/insert-customers.html"),
		//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
		data: JSON.stringify(list), 
		success: function(data)
		{
			alert(JSON.stringify(data))
		}
	});
}
function insertCustomer()
{
	var cus={pVsName:'ww22345',
	    	  pAddress:'ww22345',
	    	  pCusChar20:'ww22345',
	    	  pCusNumber1:'1124',
	    	  pVsSiteName:'ww',
	    	  pAddressLine1:'ww',
	    	  pCountry:'ww',
	    	  pPhone:'ww'};
	$.ajax({
		type: "POST",
		dataType: 'json', 
		contentType: 'application/json',
	    mimeType: 'application/json',
		url: getUrl("erp/ar-billing-customer/insert-customer.html"),
		//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
		data: JSON.stringify(cus), 
		success: function(data)
		{
			alert(data);
			if(data==true)
			{
				alert("dung roi");
			}
			else
			{
				alert("sai roi")
			}
		}
	});
	
}

function insertItem()
{
	var item={
			pOldItemNumber:"22",
			pOldItemNumber2:"22",
			pPrimaryUom:"22",
			pItemName1:"22"
	}
	$.ajax({
		type: "POST",
		dataType: 'json', 
		contentType: 'application/json',
	    mimeType: 'application/json',
		url: getUrl("erp/ar-billing-item/insert-item.html"),
		//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
		data: JSON.stringify(item), 
		success: function(data)
		{
			alert(data);
			if(data==true)
			{
				alert("dung roi");
			}
			else
			{
				alert("sai roi")
			}
		}
	});
}

function insertItems()
{
	var list={
			listItem:[
						{
							pOldItemNumber:"33",
							pOldItemNumber2:"33",
							pPrimaryUom:"33",
							pItemName1:"33"
						},
						{
							pOldItemNumber:"44",
							pOldItemNumber2:"44",
							pPrimaryUom:"44",
							pItemName1:"44"
						}
			          ]
	}
	
	$.ajax({
		type: "POST",
		dataType: 'json', 
		contentType: 'application/json',
	    mimeType: 'application/json',
		url:getUrl("erp/ar-billing-item/insert-items.html"),
		//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
		data: JSON.stringify(list), 
		success: function(data)
		{
			alert(data);
			if(data==true)
			{
				alert("dung roi");
			}
			else
			{
				alert("sai roi")
			}
		}
	});
	
	
}

function insertInvoiceLine()
{
	var line={
			headerId:'88',
			lineId:'88',
			invoiceNumber:'88',
			invoiceDate:new Date(),
			patientId:'88',
			patientName:'88',
			companyId:'88',
			insurerId:'88',
			taxId:'88',
			taxRate:'88',
			itemId:'88',
			price:'88',
			quantity:'88',
			amount:'88',
			taxAmount:'88',
			totalAmount:'88',
			status:'open',
	}
	
	$.ajax({
		type: "POST",
		dataType: 'json', 
		contentType: 'application/json',
	    mimeType: 'application/json',
		url: getUrl("erp/ar-invoice-interface/insert-line.html"),
		//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
		data: JSON.stringify(line), 
		success: function(data)
		{
			alert(data);
			if(data==true)
			{
				alert("dung roi");
			}
			else
			{
				alert("sai roi")
			}
		}
	});
}

function insertInvoiceLines()
{
	var list={
			listInvoiceInterface:[
				{
					headerId:'88',
					lineId:'88',
					invoiceNumber:'88',
					invoiceDate:new Date(),
					patientId:'88',
					patientName:'88',
					companyId:'88',
					insurerId:'88',
					taxId:'88',
					taxRate:'88',
					itemId:'88',
					price:'88',
					quantity:'88',
					amount:'88',
					taxAmount:'88',
					totalAmount:'88',
					status:'open',
				},
				{
					headerId:'99',
					lineId:'99',
					invoiceNumber:'99',
					invoiceDate:new Date(),
					patientId:'99',
					patientName:'99',
					companyId:'99',
					insurerId:'99',
					taxId:'99',
					taxRate:'99',
					itemId:'99',
					price:'99',
					quantity:'99',
					amount:'99',
					taxAmount:'99',
					totalAmount:'99',
					status:'open',
				}	
			                      ]
	}
	
	$.ajax({
		type: "POST",
		dataType: 'json', 
		contentType: 'application/json',
	    mimeType: 'application/json',
		url: getUrl("erp/ar-invoice-interface/insert-lines.html"),
		//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
		data: JSON.stringify(list), 
		success: function(data)
		{
			alert(data);
			if(data==true)
			{
				alert("dung roi");
			}
			else
			{
				alert("sai roi")
			}
		}
	});
}

function getInvoiceHeaderStatus()
{
	$.ajax({
        type: "GET",
        url: getUrl("erp/ar-invoice-interface/header-status.html"),
        data: {
        	headerId:77
        }, 
        success: function(data)
        {
        	alert(JSON.stringify(data));
        },
		error: function() {
		}
	});
}