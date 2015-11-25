<style>
	.button{
		min-height: 150px;
		text-align:center;
		vertical-align:middle;
	} 
	.button a{
		display:block;
		height:50px;
		width:128px;
		margin:auto;
		text-decoration:none;
		padding-top: 135px;
		background-repeat:no-repeat;
		color:#000 !important;
	}
	.button a:hover{
		color:#275973;
	}
	.results-button {
		background-image: url('/telehealth/images/128x128/info.png') !important;		
	}
	.settings-button {
		background-image: url('/telehealth/images/128x128/tool.png') !important;		
	}
	.changepwd-button {
		background-image: url('/telehealth/images/128x128/login.png') !important;		
	}
	.logout-button {
		background-image: url('/telehealth/images/128x128/unlock.png') !important;		
	}
	.forms-button {
		background-image: url('/telehealth/images/128x128/note.png') !important;		
	}
	.users-button {
		background-image: url('/telehealth/images/128x128/users.png') !important;		
	}
	.notification-button {
		background-image: url('/telehealth/images/128x128/comment_bubble.png') !important;		
	}
</style>

<div data-role="page" id="home">
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <h1>REDiMED TELEHEALTH</h1>
    </div><!-- /header -->

	<div data-mini="true" data-role="content" style="margin-top:40px;" >	
        <div class="ui-grid-c">
        <?php if (0==$type): ?>		
            <div class="ui-block-a button"><a href="/telehealth/index.php/results" class="results-button" data-inline="true" data-ajax="false"> Results </a></div>
            <div class="ui-block-b button"><a href="/telehealth/index.php/form" class="forms-button" data-inline="true" data-ajax="false"> Forms </a></div>
            <div class="ui-block-c button"><a href="/telehealth/index.php/settings" class="settings-button" data-inline="true" data-ajax="false"> Settings </a></div>
            <div class="ui-block-d button"><a href="/telehealth/index.php/settings" class="changepwd-button" data-inline="true" data-ajax="false"> Change Password</a></div>
            <div class="ui-block-a button"><a href="/telehealth/index.php/authen/logout" class="logout-button" data-inline="true" data-ajax="false" > Logout</a></div>
        <?php endif;?>
        <?php if (1==$type): ?>
        	<div class="ui-block-a button"><a href="/telehealth/index.php/redimed/results" class="results-button" data-inline="true" data-ajax="false"> Results </a></div>
            <div class="ui-block-b button"><a href="/telehealth/index.php/redimed/settings" class="settings-button" data-inline="true" data-ajax="false"> Settings </a></div>
            <div class="ui-block-c button"><a href="/telehealth/index.php/redimed/settings" class="changepwd-button" data-inline="true" data-ajax="false"> Change Password</a></div>
            <div class="ui-block-d button"><a href="/telehealth/index.php/authen/logout" class="logout-button" data-inline="true" data-ajax="false"> Logout</a></div>
        <?php endif;?>
        <?php if (2==$type): ?>
        	<!-- <div class="ui-block-a button"><a href="/telehealth/index.php/redimed/results" class="results-button" data-inline="true" data-ajax="false"> Results </a></div> -->
            <div class="ui-block-a button"><a href="/telehealth/index.php/redimed/companies" class="forms-button" data-inline="true" data-ajax="false"> Companies </a></div>
            <div class="ui-block-b button"><a href="/telehealth/index.php/redimed/users" class="users-button" data-inline="true" data-ajax="false"> Doctors </a></div>
            <div class="ui-block-c button"><a href="/telehealth/index.php/redimed/notification" class="notification-button" data-inline="true" data-ajax="false"> After-hour notification</a></div>
            <div class="ui-block-d button"><a href="/telehealth/index.php/authen/logout" class="logout-button" data-inline="true" data-ajax="false"> Logout</a></div>
        <?php endif;?>
        </div><!-- /grid-b -->        
	</div><!-- /content -->
</div><!-- /page one -->