<?php

echo("vo day chu");

$dbhost = 'localhost';
$dbusername = "meoadm_xproject";
$dbpassword = "khoa@12";
$dbname = "meoadm_telehealth";

$con=@mysql_connect($dbhost, $dbusername, $dbpassword) or die("Could not connect to MySQL server");
mysql_select_db($dbname,$con);

//QUERY to create members

//employers ( table 1)
$quer= 'CREATE TABLE employers(
							id INT(11) NOT NULL AUTO_INCREMENT,
							name varchar(50) NOT NULL, 
							code varchar(50) NOT NULL, 
							IMA varchar(50) NOT NULL,
							insurer varchar(50) NOT NULL,
							email varchar(50) NOT NULL,
							phone varchar(50) NOT NULL,
							address varchar(50),
							username varchar(50) NOT NULL, 
							password varchar(50) NOT NULL,
							lastlogin DATE NOT NULL,		
							lastip varchar(50) ,					
							createdTime TIMESTAMP NULL DEFAULT NULL,
							updatedTime TIMESTAMP NULL DEFAULT NULL,
							PRIMARY KEY(id))';
$result = mysql_query($quer, $con);
echo mysql_error();
/*
$quer='CREATE TRIGGER employers_create BEFORE INSERT ON employers FOR EACH ROW SET
							NEW.createdTime = NOW()';
$result = mysql_query($quer, $con);

$quer='CREATE TRIGGER employers_update BEFORE UPDATE ON employers FOR EACH ROW SET	
							NEW.updatedTime = NOW()';
$result = mysql_query($quer, $con);
*/
echo mysql_error();
//employees ( table 1)
$quer= 'CREATE TABLE employees(
							id INT(11) NOT NULL AUTO_INCREMENT,
							salut varchar(10) NOT NULL,
							fname varchar(50) NOT NULL, 
							gname varchar(50) NOT NULL, 
							nextKin varchar(50) NOT NULL,
							kfone varchar(50) NOT NULL,
							email varchar(50) NOT NULL,
							sex ENUM("M","F") NOT NULL,
							hphone varchar(20),
							wphone varchar(20),
							mphone varchar(20),
							address varchar(20),
							suburb varchar(20),
							postcode varchar(20),
							dob DATE NOT NULL,	
							createdTime TIMESTAMP NULL DEFAULT NULL,
							updatedTime TIMESTAMP NULL DEFAULT NULL,
							PRIMARY KEY(id))';
$result = mysql_query($quer, $con);
/*
$quer='CREATE TRIGGER employees_create BEFORE INSERT ON employees FOR EACH ROW SET
							NEW.createdTime = NOW()';
$result = mysql_query($quer, $con);

$quer='CREATE TRIGGER employees_update BEFORE UPDATE ON employees FOR EACH ROW SET	
							NEW.updatedTime = NOW()';
$result = mysql_query($quer, $con);
*/
echo mysql_error();
//sessions table 2
$quer= 'CREATE TABLE sessions(
								id INT(11) NOT NULL AUTO_INCREMENT,
								dob DATE NOT NULL,		
								start TIMESTAMP NULL DEFAULT NULL,		
								stop TIMESTAMP NULL DEFAULT NULL,		
								status varchar(20),
								comments varchar(20),
								PRIMARY KEY  (id))';
$result = mysql_query($quer, $con);
/*
$quer='CREATE TRIGGER sessions_create BEFORE INSERT ON sessions FOR EACH ROW SET
							NEW.start = NOW()';
$result = mysql_query($quer, $con);

$quer='CREATE TRIGGER sessions_update BEFORE UPDATE ON sessions FOR EACH ROW SET	
							NEW.stop = NOW()';
$result = mysql_query($quer, $con);
*/
//category table 3
$quer= 'CREATE TABLE entries(
								id INT(11) NOT NULL AUTO_INCREMENT,
								employerId INT(11) NOT NULL,	
								employeeId INT(11) NOT NULL,	
								detail BLOB,							
								status INT(5) NOT NULL,	
								createdTime TIMESTAMP NULL default NULL,
								updatedTime TIMESTAMP NULL default NULL,							
								PRIMARY KEY  (id))';//more discussed 
$result = mysql_query($quer, $con);
/*
$quer='CREATE TRIGGER entries_create BEFORE INSERT ON entries FOR EACH ROW SET
							NEW.createdTime = NOW()';
$result = mysql_query($quer, $con);
$quer='CREATE TRIGGER entries_update BEFORE UPDATE ON entries FOR EACH ROW SET	
							NEW.updatedTime = NOW()';
$result = mysql_query($quer, $con);
*/
// add admin users

//$quer= 'INSERT INTO users(username,password,email,firstName, lastName, status,sex,phone,dob) value(\'admin\',\''.md5(substr(md5("test"),10,10)).'\', \'test\', \'test\', \'test\',1, \'M\', \'017675\',\'2012-09-16\')';
//$result = mysql_query($quer, $con);  



mysql_close($con);

?>