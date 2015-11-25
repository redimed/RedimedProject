<style>
	.button{
		min-height: 150px;
		text-align:center;
		vertical-align:middle;
	} 
	.user{
		display:inline-block;
		height:70px;
		width:128px;
		margin:auto;
		text-decoration:none;
		padding-top: 135px;
		background-repeat:no-repeat;
		color:#000 !important;
		margin-left: 20px;
		margin-right: 20px;
		text-align: center;
	}
	.user:hover{
		color:#275973;
	}
	
	.users-button {
		background-image: url('/telehealth/images/128x128/user.png') !important;		
	}
	.userschecked-button {
		background-image: url('/telehealth/images/user_checked.png') !important;		
	}
</style>

<div data-role="page" id="home">
	<script type="text/javascript">
		$("#home").bind( "pageinit", function(){
			//alert('done');
			$.mobile.ajaxEnabled = false;
			function getUniqueTime() {
			  var time = new Date().getTime();
			  while (time == new Date().getTime());
			  return new Date().getTime();
			}
			$('a[name|="add"]').click(function() {		
				//alert(checkInput());
				id = $(this).attr('id');
				//alert("id="+id+"&cpwd="+$("#cpwd-"+id).val()+"&npwd="+$("#npwd-"+id).val()+"&timestmp="+getUniqueTime());								
				$.mobile.showPageLoadingMsg();			
				
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/redimed/setDefault",
				  data: "id="+id+"&timestmp="+getUniqueTime(),
				}).done(function( msg ) {
				  	//alert(msg);	
					$(".ui-actionsheet-wallpaper").click();		  	
					if ('1'==msg){
						$.mobile.hidePageLoadingMsg();
						$('a[name|="list-'+id+'"]').addClass('userschecked-button');
						$('a[name|="list-'+id+'"]').removeClass('users-button');
					}else{
						// error control here
						$.mobile.hidePageLoadingMsg();
					};
				});
			});
			$('a[name|="remove"]').click(function() {		
				//alert(checkInput());
				id = $(this).attr('id');
				//alert("id="+id+"&cpwd="+$("#cpwd-"+id).val()+"&npwd="+$("#npwd-"+id).val()+"&timestmp="+getUniqueTime());								
				$.mobile.showPageLoadingMsg();			
				
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/redimed/removeDefault",
				  data: "id="+id+"&timestmp="+getUniqueTime(),
				}).done(function( msg ) {
				  	//alert(msg);	
					$(".ui-actionsheet-wallpaper").click();		  	
					if ('1'==msg){
						$.mobile.hidePageLoadingMsg();
						$('a[name|="list-'+id+'"]').addClass('users-button');
						$('a[name|="list-'+id+'"]').removeClass('userschecked-button');
					}else{
						// error control here
						$.mobile.hidePageLoadingMsg();
					};
				});
			});
		});
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - After-hour notification</h1>
    </div><!-- /header -->

	<div data-mini="true" data-role="content" style="margin-top:40px;" >
    	<?php foreach($data as $key => $entry) : ?>		
        	<a href="#" class="user <?= ((array_key_exists('default',$entry['detail']))?((1==$entry['detail']['default'])?'userschecked-button':'users-button'):'users-button');?>" data-inline="true" data-ajax="false"data-sheet='functions-<?= $entry['id'];?>' name="list-<?= $entry['id'];?>" id="<?= $entry['id'];?>">
				<?= $entry['detail']['name'];?>
            </a>  
            <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="functions-<?= $entry['id'];?>" data-theme="b">
                <div data-role="content" data-theme="b" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                    <h3>Add/Remove <strong><?= $entry['detail']['name'];?></strong> to/from receiving SMS notfication list.</h3>
                    <a href="#" data-role="button" data-rel="static" data-inline="true" name="add-<?= $entry['id'];?>" id="<?= $entry['id'];?>" data-icon="check"> Add</a> 
                    <a href="#" data-role="button" data-rel="static" data-inline="true" name="remove-<?= $entry['id'];?>" id="<?= $entry['id'];?>" data-icon="check"> Remove</a>  
                    <a href="#" data-role="button" data-inline="true" name="changeCancel" data-icon="check" >No</a>
                </div>
            </div>
        <?php endforeach; ?>
	</div><!-- /content -->
</div><!-- /page one -->