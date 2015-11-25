<!-- Start of first page: #one -->

<div data-mini="true" data-role="page" id="form">
	<script type="text/javascript">
		$("#form").bind( "pagecreate", function(){
			//alert('done');
			var x = new Array();
			var data = $.toJSON(x);
			
			$.mobile.changePage( "/telehealth/index.php/form/loadPage/1", {
				transition: "slide",
				data :"data=" + data,
				allowSamePageTransition : true,
				reloadPage: true,
				reverse: false,
				changeHash: false,
				type: "post"
			});	
			
		});
	</script>

    <a href="#" id="hiddenDialog" data-role="button" style="display:none;">Open dialog</a>
    
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Form section 1/3</h1>
    </div><!-- /header -->

  <div data-mini="true" data-role="content" >	
       
  </div><!-- /content -->
</div><!-- /page one -->

