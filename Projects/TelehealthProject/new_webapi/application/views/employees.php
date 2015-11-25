<div data-role="page" id="results">
	<script type="text/javascript">
		$("#results").bind( "pageinit", function(){
			//alert('done');
			
			$('a[name|="delete"]').click(function() {							
			  	$.mobile.showPageLoadingMsg();								
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/results/delete/"+$(this).attr('id'),
				}).done(function( msg ) {
				  //				  	
					$(".ui-actionsheet-wallpaper").click();
					if ('1'==msg){
						$.mobile.changePage( "#alert", {
							transition: "fade",
							reverse: true,
							changeHash: false,
							role: 'dialog'
						});
						$.mobile.hidePageLoadingMsg();
					}else{
						// error control here
					};
				});
			});
		});
	</script>
    <style>
		.old{
			background:rgba(243, 243, 243, 0.85) !important;
		}
		
		.new{
			background:rgba(255, 255, 255, 0.9) !important;
		}
	</style>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Results</h1>
    </div><!-- /header -->

	<div data-role="content">	
		<h2>List</h2>
		<p>
  		
        <ul data-role="listview" data-inset="true" data-filter="true">
            <?php foreach($results as $key => $entry) : ?>	
                <li data-theme="d">
                        
                    <a href="<?= BASE_APP_URL;?>results/detail/<?= $entry['id'];?>" name="<?= $entry['id'];?>" id="<?= $entry['id'];?>">
                        <?php if (2==1): ?>			
                            <img src="<?= BASE_FILE_URL;?>images/check.png" alt="Buy" class="ui-li-icon" width="15">
                        <?php else: ?>
                            <img src="<?= BASE_FILE_URL;?>images/new.png" alt="Buy" class="ui-li-icon" width="15">
                        <?php endif; ?>
                        
                        <?= $entry['gname']." ".$entry['fname'];?>
                    </a>  
                </li>  
                <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="functions" data-theme="b">
                    <div data-role="content" data-theme="b" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                        <h3>Please choose a function for <?= $entry['data']['gname']." ".$entry['data']['fname'];?>.</h3>
                        <a href="<?= BASE_APP_URL;?>results/detail/<?= $entry['id'];?>" data-role="button" data-icon="search"  data-ajax="false">View</a>    
                    </div>
                </div>     
            <?php endforeach; ?>
        </ul>
        	
        </p>	
        
	</div><!-- /content -->
</div><!-- /page two -->

<div data-role="dialog" id="alert">
    <div data-role="content" data-theme="c">
        <h1>Success!</h1>
        <p>Deleted. Click OK to go back.</p>
        <a data-transition="pop" href="results" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
    </div>
</div>