<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title><tiles:insertAttribute name="title" ignore="true" /></title>
<tiles:insertAttribute name="head" ignore="true" />
<link rel="stylesheet" href="css/style.css" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="css/style-login.css" type="text/css" charset="utf-8" />

<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.js"></script>
<script type="text/javascript">
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
			url: "http://localhost:8085/RedimedErpRestful/all-users.html",
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
			url: "http://localhost:8085/RedimedErpRestful/insert-user.html",
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
			url : "http://localhost:8085/RedimedErpRestful/erp/po-taxes/get-list-active.html",
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
			url: "http://localhost:8085/RedimedErpRestful/erp/ar-billing-customer/insert-customers.html",
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
			url: "http://localhost:8085/RedimedErpRestful/erp/ar-billing-customer/insert-customer.html",
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
			url: "http://localhost:8085/RedimedErpRestful/erp/ar-billing-item/insert-item.html",
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
			url: "http://localhost:8085/RedimedErpRestful/erp/ar-billing-item/insert-items.html",
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
			url: "http://localhost:8085/RedimedErpRestful/erp/ar-invoice-interface/insert-line.html",
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
			url: "http://localhost:8085/RedimedErpRestful/erp/ar-invoice-interface/insert-lines.html",
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
	        url: "http://localhost:8085/RedimedErpRestful/erp/ar-invoice-interface/header-status.html",
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
</script>
</head>
<body>
	<button onclick="aaaa();">aaaa</button>
	<button onclick="insertUser();">insert user info</button>
	<button onclick="getTaxes();">get Taxes</button>
	<button onclick="insertCustomers();">Insert Customers</button>
	<button onclick="insertCustomer();">Insert Customer</button>
	<button onclick="insertItem();">Insert item</button>
	<button onclick="insertItems();">Insert items</button>
	<button onclick="insertInvoiceLine();">Insert invoice line</button>
	<button onclick="insertInvoiceLines();">Insert invoice lines</button>
	<button onclick="getInvoiceHeaderStatus();">Get Invoice Header Status</button>
  <div id="wrapper">
    <div id="header"> </div>
    <div id="left">
      <div id="logo">
        <h1>Redimed</h1>
        <p>Web service</p>
      </div>
      <div id="nav">
        <ul>
          <%--MENU O DAY --%>
           <tiles:insertAttribute name="menu" />
          
        </ul>
      </div>
      <div id="news">
        <%--DAY LA NEWS --%>
         <tiles:insertAttribute name="new" />
        
      </div>
      <div id="support">
        <%--DAY LA SUPPORT --%>
        <tiles:insertAttribute name="support" />
      </div>
    </div>
    <div id="right">
      <%--DAY LA BODY--%>
     	 <tiles:insertAttribute name="body" />
    </div>
    <div class="clear"> </div>
    <div id="spacer"> </div>
    <div id="footer">
      <%--DAY LA FOOTER --%>
       <tiles:insertAttribute name="footer" />
	  <div id="footerline"></div>
    </div>
	
  </div>
</body>
</html>