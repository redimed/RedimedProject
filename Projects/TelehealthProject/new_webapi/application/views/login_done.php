<style>.ui-dialog .ui-header .ui-btn-icon-notext { display:none;} </style>
<div data-role="page" id="home">
	<script type="text/javascript">
		$("#home").bind( "pageinit", function(){
			
			$("#hiddenDialog").click(function() {
				$.mobile.changePage( "/telehealth/index.php/form", {
					transition: "flip"
				});
			});
			
			$('#hiddenDialog').trigger('click');
		});
	</script>
    <a href="#" id="hiddenDialog" data-role="button" style="display:none;">Open dialog</a>
</div>