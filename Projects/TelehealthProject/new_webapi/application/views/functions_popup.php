<script type="text/javascript">
	$("#alert").bind( "pageinit", function(){
		alert('done');
		
	});
</script>
<div data-role="dialog" id="alert" data-theme="b">
    <div data-role="content" data-theme="b">
        <h3>Please choose a function for AAAA.</h3>
        <a href="index.html" data-role="button" data-inline="true" data-icon="search">View</a>
        <a href="index.html" data-role="button" data-inline="true" data-icon="info">Edit</a>
		<a href="index.html" data-role="button" data-inline="true" data-icon="delete">Delete</a>      
		<a data-direction="reverse" data-transition="pop" href="#" data-inline="true" data-role="button" data-rel="back" data-icon="back" data-theme="c">Cancel</a>
    </div>
</div>