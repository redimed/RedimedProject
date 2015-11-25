<!-- Start of first page: #one -->
<div data-role="page" id="dashboard">

	<div data-role="header" data-id="foo1" data-position="fixed">
        <div data-role="navbar">
            <ul>
                <li><a href="#dashboard" data-prefetch="true" class="ui-btn-active ui-state-persist">Home</a></li>
                <li><a href="#workrelated" data-prefetch="true">Albums</a></li>
                <li><a href="#nonworkrelated" data-prefetch="true">Emails</a></li>
            </ul>
        </div><!-- /navbar -->
    </div><!-- /header -->

	<div data-role="content" >	
		<h2>One</h2>
		
		<p>I have an id of "one" on my page container. I'm first in the source order so I'm shown when the page loads.</p>	
		
		<p>This is a multi-page boilerplate template that you can copy to build your first jQuery Mobile page. This template contains multiple "page" containers inside, unlike a <a href="page-template.html"> single page template</a> that has just one page within it.</p>	
		<p>Just view the source and copy the code to get started. All the CSS and JS is linked to the jQuery CDN versions so this is super easy to set up. Remember to include a meta viewport tag in the head to set the zoom level.</p>
		<p>You link to internal pages by referring to the ID of the page you want to show. For example, to <a href="#two" >link</a> to the page with an ID of "two", my link would have a <code>href="#two"</code> in the code.</p>	

		<h3>Show internal pages:</h3>
		<p><a href="#workrelated" data-role="button">Show page "two"</a></p>	
		<p><a href="#nonworkrelated"data-role="button">Show page "popup" (as a dialog)</a></p>
	</div><!-- /content -->
</div><!-- /page one -->