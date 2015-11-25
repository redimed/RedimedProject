<!-- Start of first page: #one -->
<div data-mini="true" data-role="page" id="form-1">
	<script type="text/javascript">
		$("#form-1").bind( "pageinit", function(){
			//$(function(){
			var obj = $.mobile.path.parseUrl(window.location.href);
			var path = obj.pathname;
			var paths = path.split('/');
			//alert(paths[4]);
			var id = obj.filename;
				$('#dob').scroller({
					preset: 'date',
					theme: 'ios',
					display: 'modal',
					mode: 'scroller',
					dateOrder: 'Mddyy'
				});
				
			//$('#show').click(function(){ $('#i').scroller('show'); return false; }); $('#clear').click(function () { $('#i').val(''); return false; });
			
			//});
			$("#nextbtn").click(function() {
			  	$.mobile.showPageLoadingMsg();
				var data = $('#form-form').serializeObject();
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
				$.mobile.changePage( "/telehealth/index.php/form/loadPage/2", {
					transition: "slide",
					data :"data=" + z,
					allowSamePageTransition : true,
					reloadPage: true,
					reverse: false,
					changeHash: false,
					type: "post"
				});
			});
		});
		
		
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Form section 1/3</h1>
    </div><!-- /header -->

  <div data-mini="true" data-role="content" >	
         <h2 align="center" style="margin-top: 0px; margin-bottom: 0px;">REDiMED TELEHEALTH CONSULT INITIAL FORM</h2>
        <p align="center" style="margin-top: 5px; margin-bottom: 5px;">
        	Welcome to REDiMed Telehealth Services
			<br />Please take your time to answer the following questions as accurately as possible:
         <h3><strong>Section 1</strong></h3>
         <form action="index.php/submit" method="post" id="form-form">	  
          	<table width="100%">
                <tr>
                	<td colspan="2" align="center">
                        <div data-mini="true" data-role="fieldcontain" style="margin:auto;width:240px;">
                            <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal">
                                    <input type="radio" name="relation" id="relation-1" value="1" <?= ((array_key_exists('relation',$data))?((1==$data['relation'])?'checked="checked"':''):'checked="checked"');?> />
                                    <label for="relation-1">Work related</label>
                        
                                    <input type="radio" name="relation" id="relation-2" value="2" <?= ((array_key_exists('relation',$data))?((2==$data['relation'])?'checked="checked"':''):"");?> />
                                        <label for="relation-2">Not work related</label>
                              </fieldset>
                        </div>
                    </td>
                </tr>
                <tr>
                	<td colspan="2">
                        Service required:
                    </td>
                </tr>
                <tr>
                	<td colspan="2">
                    	<div data-mini="true" data-role="fieldcontain">
                            <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal" >
                               <label><input type="checkbox" name="require-1" <?= ((array_key_exists('require-1',$data))?(('on'==$data['require-1'])?'checked="checked"':''):"");?>/> Emergency Telehealth Consult </label>
                               <label><input type="checkbox" name="require-2" <?= ((array_key_exists('require-2',$data))?(('on'==$data['require-2'])?'checked="checked"':''):"");?>/> First Medical Certificate </label>
                               <label><input type="checkbox" name="require-3" <?= ((array_key_exists('require-3',$data))?(('on'==$data['require-3'])?'checked="checked"':''):"");?>/> Follow up in Perth </label>
                               <label><input type="checkbox" name="require-4" <?= ((array_key_exists('require-4',$data))?(('on'==$data['require-4'])?'checked="checked"':''):"");?>/> Initial Telehealth Consult </label>
                               <label><input type="checkbox" name="require-5" <?= ((array_key_exists('require-5',$data))?(('on'==$data['require-5'])?'checked="checked"':''):"");?>/> Transport to/from Airport </label>
                            </fieldset>
                        </div>
                    </td>
                </tr>
                <tr>
                	<td>
                        <table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Salutation:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal">
                                                <input type="radio" name="salut" id="salut-1" value="1" <?= ((array_key_exists('salut',$data))?((1==$data['salut'])?'checked="checked"':''):'checked="checked"');?> />
                                                <label for="salut-1">Mr</label>
                                    
                                                <input type="radio" name="salut" id="salut-2" value="2"  <?= ((array_key_exists('salut',$data))?((2==$data['salut'])?'checked="checked"':''):'');?>/>
                                                <label for="salut-2">Mrs</label>
                                                <input type="radio" name="salut" id="salut-3" value="3"  <?= ((array_key_exists('salut',$data))?((3==$data['salut'])?'checked="checked"':''):'');?>/>
                                                <label for="salut-3">Ms</label>
                                                <input type="radio" name="salut" id="salut-4" value="4"  <?= ((array_key_exists('salut',$data))?((4==$data['salut'])?'checked="checked"':''):'');?>/>
                                                <label for="salut-4">Miss</label>
                                                <input type="radio" name="salut" id="salut-5" value="5" <?= ((array_key_exists('salut',$data))?((5==$data['salut'])?'checked="checked"':''):'');?> />
                                                <label for="salut-5">Master</label>
                                                <input type="radio" name="salut" id="salut-6" value="6" <?= ((array_key_exists('salut',$data))?((6==$data['salut'])?'checked="checked"':''):'');?> />
                                                <label for="salut-6">Dr</label>
                                          </fieldset>
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                    <td>
                    	<table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Occupation:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="occupation" id="occupation" value="<?= ((array_key_exists('occupation',$data))?$data['occupation']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td width="50%">
                        <table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Family name:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="fname" id="fname" value="<?= ((array_key_exists('fname',$data))?$data['fname']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                    <td width="50%">
                        <table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Given name:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="gname" id="gname" value="<?= ((array_key_exists('gname',$data))?$data['gname']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                	<td>
                    	<table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Date of Birth:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="dob" id="dob" value="<?= ((array_key_exists('dob',$data))?$data['dob']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                    <td>
                    	<table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Address:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="address" id="address" value="<?= ((array_key_exists('address',$data))?$data['address']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td width="50%">
                    	<table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Suburb:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="suburb" id="suburb" value="<?= ((array_key_exists('suburb',$data))?$data['suburb']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                    <td width="50%">
                        <table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Postcode:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="postcode" id="postcode" value="<?= ((array_key_exists('postcode',$data))?$data['postcode']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                	<td colspan="2">
                    	<table width="100%">
                        	<tr>
                            	<td width="40%">
                                    <table width="100%">
                                        <tr>
                                            <td width="120px" align="right">
                                                Telephone:(Hm)
                                           </td>
                                            <td>
                                                <div data-mini="true" data-role="fieldcontain">
                                                    <input type="text" name="hfone" id="hfone" value="<?= ((array_key_exists('hfone',$data))?$data['hfone']:"");?>" data-mini="true" />
                                                </div>
                                           </td>
                                        </tr>
                                    </table>
                               </td>
                                <td width="30%">
                                	<table width="100%">
                                        <tr>
                                            <td width="50px">
                                           <div align="right">(Mob): </div></td>
                                            <td>
                                                <div data-mini="true" data-role="fieldcontain">
                                                    <input type="text" name="mfone" id="mfone" value="<?= ((array_key_exists('mfone',$data))?$data['mfone']:"");?>" data-mini="true" />
                                                </div>
                                           </td>
                                        </tr>
                                    </table>
                               </td>
                               <td width="30%">
                                  	<table width="100%">
                                        <tr>
                                            <td width="50px">
                                           <div align="right">(Wk): </div></td>
                                            <td>
                                                <div data-mini="true" data-role="fieldcontain">
                                                    <input type="text" name="wfone" id="wfone" value="<?= ((array_key_exists('wfone',$data))?$data['wfone']:"");?>" data-mini="true" />
                                                </div>
                                           </td>
                                        </tr>
                       			 	</table>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td width="50%">
                    	<table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Next of Kin:
                                </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="nok" id="nok" value="<?= ((array_key_exists('nok',$data))?$data['nok']:"");?>" data-mini="true" />
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td width="50%">
                    	<table width="100%">
                        	<tr>
                            	<td width="120px" align="right">
                                    Telephone:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="Kfone" id="Kfone" value="<?= ((array_key_exists('Kfone',$data))?$data['Kfone']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
              </table>           		
      </form>
      <table width="100%">
        <tr>
            <td width="200px">
                
            </td>
            <td></td>
            <td width="200px" align="right">
                <a href="#" data-role="button" data-inline="true" data-theme="b" data-icon="arrow-r" data-iconpos="right" id="nextbtn" name="nextbtn">Next</a>
            </td>
        </tr>
      </table>
      
        </p>	
  </div><!-- /content -->
</div><!-- /page one -->