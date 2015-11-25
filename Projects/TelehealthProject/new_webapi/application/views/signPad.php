<!-- Start of first page: #one -->

<div data-mini="true" data-role="page" id="form">
	
    <script type="text/javascript">
		jQuery( window ).load(
			function(){
 				setTimeout(
					function(){
						window.scrollTo( 0, 0 );
					},
					100
				);
			}
		);
 
 
		// When The DOM loads, initialize the scripts.
	$("#form").bind( "pageinit", function(){

		var restorePoints = [];
		var canvas = $( "canvas" );
		var a=false;var b,c="";var d=document.getElementById("can");
		
		var e=d.getContext("2d");e.strokeStyle="red";
		e.lineWidth=2;e.lineCap="round";
		e.fillStyle="#fff";e.fillRect(0,0,d.width,d.height);
		$("#bsz").change(function(a){e.lineWidth=this.value; });
		$("#bcl").change(function(a){e.strokeStyle=this.value; window.location.hash = '#';});
 
			
			//$("#can").mousedown(function(d){saveRestorePoint();a=true;e.save();b=d.pageX-this.offsetLeft;c=d.pageY-this.offsetTop});


			$(document).click(function(){a=false});
			
			var isIPhone = (new RegExp( "iPhone", "i" )).test(
				navigator.userAgent
			);
			var isIPad = (new RegExp( "iPad", "i" )).test(
				navigator.userAgent
			);
 			isIPhone = (isIPhone||isIPad);
			//alert(isIPhone);
			var getCanvasLocalCoordinates = function( pageX, pageY ){
				var position = canvas.offset();
				
				return({
					x: (pageX - position.left),
					y: (pageY - position.top)
				});
			};
 
			var getTouchEvent = function( event ){
				return(
					isIPhone ?
						window.event.targetTouches[ 0 ] :
						event
				);
			};
 

			var onTouchStart = function( event ){

				window.location.hash = '#';

			
				var touch = getTouchEvent( event );
				var localPosition = getCanvasLocalCoordinates(
					touch.pageX,
					touch.pageY
				);

				saveRestorePoint();
				a=true;
				e.save();
				b=localPosition.x;
				c=localPosition.y;


				if(a==true){
				e.beginPath();
				e.moveTo(localPosition.x,localPosition.y);
				e.lineTo(localPosition.x+1,localPosition.y+1);
				e.stroke();
				e.closePath();
				b=localPosition.x;
				c=localPosition.y;
				}

				lastPenPoint = {
					x: localPosition.x,
					y: localPosition.y
				};
 
				canvas.bind(
					(isIPhone ? "touchmove" : "mousemove"),
					onTouchMove
				);
 
				canvas.bind(
					(isIPhone ? "touchend" : "mouseup"),
					onTouchEnd
				);
			};


			var OnClick = function( event ){
				var touch = getTouchEvent( event );
				var localPosition = getCanvasLocalCoordinates(
					touch.pageX,
					touch.pageY
				);

				lastPenPoint = {
					x: localPosition.x,
					y: localPosition.y
				};

				if(a==true){
				e.beginPath();
				e.moveTo(localPosition.x,localPosition.y);
				e.lineTo(localPosition.x+1,localPosition.y+1);
				e.stroke();
				e.closePath();
				b=localPosition.x;
				c=localPosition.y;
				}
				

			};

 
			var onTouchMove = function( event ){
				var touch = getTouchEvent( event );
				var localPosition = getCanvasLocalCoordinates(
					touch.pageX,
					touch.pageY
				);

				lastPenPoint = {
					x: localPosition.x,
					y: localPosition.y
				};

				if(a==true){
				e.beginPath();
				e.moveTo(localPosition.x,localPosition.y);
				e.lineTo(b,c);
				e.stroke();
				e.closePath();
				b=localPosition.x;
				c=localPosition.y;
				}
				

			};
 
			var onTouchEnd = function( event ){
				canvas.unbind(
					(isIPhone ? "touchmove" : "mousemove")
				);

				canvas.unbind(
					(isIPhone ? "touchend" : "mouseup")
				);
			};
 

			canvas.bind(
				(isIPhone ? "touchstart" : "mousedown"),
				function( event ){
					onTouchStart( event );
					return( false );
				}
			);



			$("#clr > div").click(function(){e.strokeStyle=$(this).css("background-color");
			//$("#bcl").val($(this).css("background-color"))
			window.location.hash = '#';
				});
			$("#undo").click(function(){undoDrawOnCanvas();});

			$("#eraser").click(function(){e.strokeStyle="#fff"});
			$("#save").click(
				function(){
				window.location.href=d.toDataURL();
				
				/*$("#result").html("<img src="+d.toDataURL()+' /><br /><a href="#" id="get" class="minimal" >Download This</a>');
				$("#data").val(d.toDataURL());
				$("#get").click(function(){$("#frm").trigger("submit")})
				*/
					}
				);
				
				
				$("#clear").click(function(){e.fillStyle="#fff";e.fillRect(0,0,d.width,d.height);e.strokeStyle="red";e.fillStyle="red"})

 		
		});
		var restorePoints = [];
		function saveRestorePoint() {
			var oCanvas = document.getElementById("can");
			var imgSrc = oCanvas.toDataURL("image/png");
			restorePoints.push(imgSrc);
		}
		
		function undoDrawOnCanvas() {
				if (restorePoints.length > 0) {
				var oImg = new Image();
				oImg.onload = function() {
					var canvasContext = document.getElementById("can").getContext("2d");		
					canvasContext.drawImage(oImg, 0, 0);
				}
				oImg.src = restorePoints.pop();
			}
		}
		

 
	</script>

	<div data-mini="true" data-role="header" data-id="foo1" data-position="fixed">
        <div data-mini="true" data-role="navbar">
            <ul>
                <li><a href="/telehealth/index.php/form" data-icon="home" class="ui-btn-active ui-state-persist" data-ajax="false">Patient's details</a></li>
                <li><a href="/telehealth/index.php/results"data-icon="grid" data-ajax="false">Results</a></li>
                <li><a href="/telehealth/index.php/settings"  data-icon="gear" data-ajax="false">Settings</a></li>
                
            </ul>
        </div><!-- /navbar -->
    </div><!-- /header -->

    <div data-mini="true" data-role="content" style="height:100%; width:100%; overflow:hidden;" id="content">
		
        <a href="#" data-sheet="signature" name="list-sign" id="sign">Signature</a>
        <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="signature" data-theme="b">
            <div data-role="content" data-theme="b" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                <canvas id="can" width="900" height="400" style="border:1px solid #d3d3d3; overflow:hidden; display:block;">Your browser does not support the canvas tag </canvas> 	      
            </div>
        </div> 	
        <div id="status" style="position:absolute; left:20px; top:15px;">tes tes</div>		
    </div><!-- /content -->
</div><!-- /page one -->

