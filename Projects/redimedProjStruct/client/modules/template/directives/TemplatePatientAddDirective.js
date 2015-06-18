angular.module('app.loggedIn.template.directives.patient_add', [])

.directive('templatePatientAdd', function($modal, $cookieStore, $state, TemplateModel, toastr, PatientService){
	return {
		restrict: 'EA',
		scope: {
			patientId: '=',
			calId: '=',
			success: '='
		},
		templateUrl: 'modules/template/directives/templates/patient_add.html',
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;
			/* PATIENT LOAD */
			var patientLoad = function(patient_id){
				PatientService.get(patient_id)
				.then(function(response){
					scope.patient.one = response.data;
				}, function(error){})
			}

			scope.patient = {
				one: null,
				load: function(patient_id){
					patientLoad(patient_id);
				}
			}

			scope.$watch('patientId', function(patientId){
				if(typeof patientId !== 'undefined'){
					scope.patient.load(patientId);
				}
			})
			/* END PATIENT LOAD */

			var element = $('#editor');

			element.wysiwyg({
				toolbar: 'top',
				buttons: {
					bold: {
	                    title: 'Bold (Ctrl+B)',
	                    image: '\uf032', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    hotkey: 'b'
	                },
	                italic: {
	                    title: 'Italic (Ctrl+I)',
	                    image: '\uf033', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    hotkey: 'i'
	                },
	                underline: {
	                    title: 'Underline (Ctrl+U)',
	                    image: '\uf0cd', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    hotkey: 'u'
	                },
	                insertimage: {
	                    title: 'Insert image',
	                    image: '\uf030',
	                    showselection: true
	                },
	                fontname: {
	                    title: 'Font',
	                    image: '\uf031', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    popup: function( $popup, $button ) {
	                            var list_fontnames = {
	                                    // Name : Font
	                                    'Arial, Helvetica' : 'Arial,Helvetica',
	                                    'Verdana'          : 'Verdana,Geneva',
	                                    'Georgia'          : 'Georgia',
	                                    'Courier New'      : 'Courier New,Courier',
	                                    'Times New Roman'  : 'Times New Roman,Times'
	                                };
	                            var $list = $('<div/>').addClass('wysiwyg-plugin-list')
	                                                   .attr('unselectable','on');
	                            $.each( list_fontnames, function( name, font ) {
	                                var $link = $('<a/>').attr('href','#')
	                                                    .css( 'font-family', font )
	                                                    .html( name )
	                                                    .click(function(event) {
	                                                        $(element).wysiwyg('shell').fontName(font).closePopup();
	                                                        // prevent link-href-#
	                                                        event.stopPropagation();
	                                                        event.preventDefault();
	                                                        return false;
	                                                    });
	                                $list.append( $link );
	                            });
	                            $popup.append( $list );
	                           },
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                strikethrough: {
	                    title: 'Strikethrough (Ctrl+S)',
	                    image: '\uf0cc', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    hotkey: 's'
	                },
	                forecolor: {
	                    title: 'Text color',
	                    image: '\uf1fc' // <img src="path/to/image.png" width="16" height="16" alt="" />
	                },
	                highlight: {
	                    title: 'Background color',
	                    image: '\uf043' // <img src="path/to/image.png" width="16" height="16" alt="" />
	                },
	                alignleft: {
	                    title: 'Left',
	                    image: '\uf036', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                aligncenter: {
	                    title: 'Center',
	                    image: '\uf037', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                alignright: {
	                    title: 'Right',
	                    image: '\uf038', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                alignjustify: {
	                    title: 'Justify',
	                    image: '\uf039', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                subscript: {
	                    title: 'Subscript',
	                    image: '\uf12c', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: true    // wanted on selection
	                },
	                superscript: {
	                    title: 'Superscript',
	                    image: '\uf12b', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: true    // wanted on selection
	                },
	                indent: {
	                    title: 'Indent',
	                    image: '\uf03c', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                outdent: {
	                    title: 'Outdent',
	                    image: '\uf03b', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                orderedList: {
	                    title: 'Ordered list',
	                    image: '\uf0cb', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                unorderedList: {
	                    title: 'Unordered list',
	                    image: '\uf0ca', // <img src="path/to/image.png" width="16" height="16" alt="" />
	                    //showstatic: true,    // wanted on the toolbar
	                    showselection: false    // wanted on selection
	                },
	                removeformat: {
	                    title: 'Remove format',
	                    image: '\uf12d' // <img src="path/to/image.png" width="16" height="16" alt="" />
	                }
				},
				selectImage: 'Click or drop image',
            	placeholderUrl: 'http://sasa',
            	maxImageSize: [600,200],
            	forceImageUpload: false,
            	// Submit-Button
	            submit: {
	                title: 'Submit',
	                image: '\uf00c' // <img src="path/to/image.png" width="16" height="16" alt="" />
	            },
	            onAutocomplete: function( typed, key, character, shiftKey, altKey, ctrlKey, metaKey ) {
                    if( typed.indexOf('.') == 0 ) // startswith '@'
                    {
                    	var fields = [];

                    	for(var key in scope.patient.one){
							fields.push(key);
						}

                        var $list = $('<div/>').addClass('wysiwyg-plugin-list')
                                               .attr('unselectable','on');

                        $.each(fields, function(index, field){
                        	var $link = $('<a/>').attr('href','javascript:void(0)')
		                                .text(field)
		                                .click(function(event) {
		                                    var html = '.'+field;

		                                    var editor = $(element).wysiwyg('shell');
		                                    // Expand selection and set inject HTML
		                                    editor.expandSelection( typed.length, 0 ).insertHTML( html );
		                                    editor.closePopup().getElement().focus();
		                                    // prevent link-href-#
		                                    event.stopPropagation();
		                                    event.preventDefault();
		                                    return false;
		                                });
		                    $list.append( $link );
                        });

                        if( $list.children().length )
                        {
                            if( key == 13 )
                            {
                                $list.children(':first').click();
                                return false; // swallow enter
                            }
                            // Show popup
                            else if( character || key == 8 )
                                return $list;
                        }//endif
                    }
                }
			});
			

			scope.form = {
				name: null
			}

			scope.save = function(){

				var html = element.wysiwyg('shell').getHTML();

				var postData = {name: scope.form.name, content: html, user_id: user_id};

				TemplateModel.add(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){})
			}
		}
	}
})