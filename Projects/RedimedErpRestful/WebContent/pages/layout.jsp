<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title><tiles:insertAttribute name="title" ignore="true" /></title>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" type="text/css" charset="utf-8" />
<link rel="stylesheet" href="css/style.css" type="text/css" charset="utf-8" />

<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/app.js"></script>
<script type="text/javascript" src="js/test1.js"></script>
</head>
<body>
	
	<div class="row">
		<div class="col-md-12">
			<img src="img/logo.png" width="300px"/>
		</div>
		<div class="col-md-12">
			<nav class="navbar navbar-default">
				 <div class="container-fluid">
					<div class="navbar-header">
					  <a class="navbar-brand" href="#">REDIMED ERP</a>
					</div>
					<div>
					  <ul class="nav navbar-nav">
					    <li class="active"><a href="#">Home</a></li>
					    <li><a href="#">Page 1</a></li>
					    <li><a href="#">Page 2</a></li>
					    <li><a href="#">Page 3</a></li>
					  </ul>
					</div>
				 </div>
			</nav>
		</div>
		<div class="row">
			<div class="col-md-12">
				<tiles:insertAttribute name="body" />
				
			</div>
		</div>
		<div  id="footer">
			<div>
				<div class="col-md-12">
					
	       			<tiles:insertAttribute name="footer" />
				</div>
			</div>
			
		</div>
	</div>
</body>
</html>