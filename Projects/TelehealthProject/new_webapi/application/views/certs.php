<!-- Start of first page: #one -->
<div data-mini="true" data-role="page" id="detail">
	<script type="text/javascript">
		$("#detail").bind( "pageinit", function(){
			<?php if ($redimed): ?>
				$('a[name|="okbtn"]').click(function() {							
					$.mobile.showPageLoadingMsg();		
					//alert('done');
					
					$.ajax({
					  type: "POST",
					  url: "/telehealth/index.php/redimed/deleteAssess/"+$(this).attr('id'),
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
				
			<?php endif;?> 
		});
		
		
	</script>
    <?php 
		include_once('inc/bitly.php');
	?>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Certificates</h1>
    </div><!-- /header -->
	
<div data-mini="true" data-role="content" >	
		<h2 align="center" style="margin-top: 0px; margin-bottom: 0px;">Certificate(s) for <?= $entry['detail']['gname']." ".$entry['detail']['fname'];?> </h2>
        <table width="100%">
      <?php if ($has1st): ?>
      		<tr><td width="100px"></td><td><a href="/telehealth/index.php/redimed/getPdf/<?= $entry['id'];?>/1" data-role="button" data-ajax="false">First Certificate </a>  </td><td width="300px"><?php if ($redimed): ?><a href="mailto:?body=<?php $url = bitly_v3_shorten('http://mynote.net.au/telehealth/index.php/redimed/getPdf/'.$entry['id'].'/1', 'bit.ly'); echo $url['url'];?>" data-role="button" data-icon="check" data-iconpos="left" data-mini="true" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c">Email</a><?php endif;?> </td></tr>
      <?php endif;?>                              
      <?php foreach($progress as $pkey => $pentry) : ?>
      		<tr><td></td><td>
            <a href="/telehealth/index.php/redimed/getPdf/<?= $entry['id'];?>/2/<?= $pentry['id'];?>" data-role="button" data-ajax="false">Progress Certificate <em>(<?= $pentry['createdTime'];?>)</em></a></td><td>
            <?php if ($redimed): ?>
                <a href="mailto:?body=<?php $url = bitly_v3_shorten('http://mynote.net.au/telehealth/index.php/redimed/getPdf/'.$entry['id'].'/2/'.$pentry['id'], 'bit.ly'); echo $url['url'];?>" data-role="button" data-icon="check" data-iconpos="left" data-mini="true" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c">Email</a>
                <a href="#" data-role="button" data-icon="delete" data-iconpos="left" data-mini="true" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" data-sheet="functions" name="list-<?= $pentry['id'];?>">Delete</a>
                
                <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="functions" data-theme="b">
                    <div data-role="content" name="assessdiv-<?= $pentry['id'];?>" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                        <h3>You are about to delete this assessment. <br />Do you want to continue?</h3>
                        <a href="#" data-role="button" data-rel="static" data-inline="true" name="okbtn-<?= $pentry['id'];?>" id="<?= $pentry['id'];?>" data-icon="check"> OK</a>  
                		<a href="#" data-role="button" data-inline="true" name="changeCancel" data-icon="check" >Cancel</a> 
                    </div>
                </div>
             <?php endif;?>   
            </td></tr>
      <?php endforeach; ?>
      <?php foreach($final as $fkey => $fentry) : ?>
      		<tr><td></td><td><a href="/telehealth/index.php/redimed/getPdf/<?= $entry['id'];?>/3/<?= $fentry['id'];?>" data-role="button" data-ajax="false">Final Certificate <em>(<?= $fentry['createdTime'];?>)</em></a></td><td><?php if ($redimed): ?><a href="mailto:?body=<?php $url = bitly_v3_shorten('http://mynote.net.au/telehealth/index.php/redimed/getPdf/'.$entry['id'].'/3/'.$fentry['id'], 'bit.ly'); echo $url['url'];?>" data-role="button" data-icon="check" data-iconpos="left" data-mini="true" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c">Email</a><?php endif;?> </td></tr>
      <?php endforeach; ?>
      <?php if (1==0): ?>
      		<tr><td></td><td></td><td><a href="mailto:" data-role="button" data-icon="check" data-iconpos="left" data-mini="true" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c">Email All</a></td></tr>
      <?php endif;?> 
      </table>
  </div><!-- /content -->
</div><!-- /page one -->

<div data-role="dialog" id="alert">
    <div data-role="content" data-theme="c">
        <h1>Success!</h1>
        <p>Deleted. Click OK to go back.</p>
        <a data-transition="pop" href="<?= $_SERVER['REQUEST_URI'];?>" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
    </div>
</div>