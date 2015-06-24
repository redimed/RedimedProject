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
			url: "http://localhost:8081/RedimedErpRestful/all-users.html",
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
				id:'7774',
				userName:'tan ne tan ne4'
		};
		$.ajax({
			type: "POST",
			dataType: 'json', 
			contentType: 'application/json',
		    mimeType: 'application/json',
			url: "http://localhost:8081/RedimedErpRestful/insert-user.html",
			//data: "{\"userName\":\"hmkcode\",\"id\":2}", 
			data: JSON.stringify(userInfo), 
			success: function(data)
			{
				alert(JSON.stringify(data))
			}
		}); 
	}
</script>
</head>
<body>
	<button onclick="aaaa();">aaaa</button>
	<button onclick="insertUser();">insert user info</button>
  <div id="wrapper">
    <div id="header"> </div>
    <div id="left">
      <div id="logo">
        <h1>Royal Educational</h1>
        <p>Web Portal</p>
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