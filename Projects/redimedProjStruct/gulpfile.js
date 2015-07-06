var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('common', function(){
	return gulp.src(['./client/vendor/jquery/dist/jquery.js', 
					'./client/vendor/jquery-ui/ui/jquery-ui.js', 
					'./client/lib/jquery.ui.touch-punch.js', 
					'./client/theme/assets/global/plugins/bootstrap/js/bootstrap.min.js',
					'./client/lib/apiRTC-latest.min.js',
					'./client/lib/wysiwyg.js/src/wysiwyg.js',
					'./client/lib/wysiwyg.js/src/wysiwyg-editor.js',
					'./client/vendor/angular/angular.js',
					'./client/vendor/angular-bindonce/bindonce.js',
					'./client/theme/assets/global/plugins/moment.min.js',
					'./client/vendor/moment-range/lib/moment-range.js',
					'./client/lib/dateRangePicker/angular-date-range-picker.js',
					'./client/lib/ng-map.min.js',
					'./client/theme/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
					'./client/lib/angular-sanitize.min.js',
					'./client/lib/modernizr-2.6.2.min.js',
					'./client/theme/assets/global/plugins/angular/angular-resource.min.js',
					'./client/theme/assets/global/plugins/angular/angular-route.min.js',
					'./client/theme/assets/global/plugins/angular/angular-cookies.min.js',
					'./client/theme/assets/global/plugins/angular/angular-filter.min.js',
					'./client/theme/assets/global/plugins/angular/angular-file-upload.min.js',
					'./client/theme/assets/global/plugins/angular/angular-mailto.js',
					'./client/vendor/angular-bootstrap/ui-bootstrap.min.js',
					'./client/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
					'./client/vendor/angular-ui-router/release/angular-ui-router.min.js',
					'./client/vendor/jquery-minicolors/jquery.minicolors.min.js',
					'./client/lib/jquery-knob/js/jquery.knob.js',
					'./client/vendor/lodash/dist/lodash.compat.min.js',
					'./client/vendor/restangular/dist/restangular.min.js',
					'./client/lib/timepicker/include/ui-1.10.0/jquery.ui.core.min.js',
					'./client/lib/timepicker/include/ui-1.10.0/jquery.ui.widget.min.js',
					'./client/lib/timepicker/include/ui-1.10.0/jquery.ui.tabs.min.js',
					'./client/lib/timepicker/include/ui-1.10.0/jquery.ui.position.min.js',
					'./client/lib/timepicker/jquery.ui.timepicker.js',
					'./client/vendor/angular-cookies/angular-cookies.min.js',
					'./client/lib/angular-local-storage.min.js',
					'./client/vendor/angular-fcsa-number/src/fcsaNumber.min.js',
					'./client/vendor/angular-loading-bar/build/loading-bar.min.js',
					'./client/vendor/angular-translate/angular-translate.min.js',
					'./client/vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
					'./client/lib/desktop-notify.js',
					'./client/lib/EasyRTC/opentok.min.js',
					'./client/lib/EasyRTC/OTChromeScreenSharingExtensionHelper.js',
					'./client/vendor/opentok-layout-js/opentok-layout.js',
					'./client/vendor/opentok-angular/opentok-angular.js',
					'./client/vendor/angularjs-scroll-glue/src/scrollglue.js',
					'./client/vendor/angular-bootstrap-simple-chat/src/scripts/index.js',
					'./client/lib/flot/jquery.flot.min.js',
					'./client/lib/flot/jquery.flot.resize.min.js',
					'./client/jquery.flot.categories.min.js',
					'./client/vendor/angular-svg-round-progressbar/build/roundProgress.js',
					'./client/vendor/angular-flot/angular-flot.js',
					'./client/vendor/angular-ui-select/dist/select.min.js',
					'./client/vendor/chosen/chosen.jquery.min.js',
					'./client/vendor/angular-chosen-localytics/chosen.js',
					'./client/vendor/angular-touch/angular-touch.min.js',
					'./client/vendor/angular-ui-slider/src/slider.js',
					'./client/vendor/angular-hotkeys/build/hotkeys.min.js',
					'./client/vendor/angular-toastr/dist/angular-toastr.min.js',
					'./client/vendor/ng-table/ng-table.min.js',
					'./client/vendor/angular-file-upload/angular-file-upload.min.js',
					'./client/vendor/jasny-bootstrap/dist/js/jasny-bootstrap.min.js',
					'./client/vendor/ng-idle/angular-idle.min.js',
					'./client/lib/socket.io-1.3.5.js',
					'./client/theme/assets/global/plugins/jquery-migrate-1.2.1.min.js',
					'./client/vendor/angular-ui-date/src/date.js',
					'./client/theme/assets/global/plugins/jSignature/jSignature.min.js',
					'./client/theme/assets/global/plugins/jSignature/jSignature.min.noconflict.js',
					'./client/vendor/angular-xeditable/dist/js/xeditable.js',
					'./client/theme/assets/global/plugins/bootstrap/js/bootstrap.min.js',
					'./client/theme/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
					'./client/theme/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js',
					'./client/theme/assets/global/plugins/jquery.blockui.min.js',
					'./client/theme/assets/global/plugins/uniform/jquery.uniform.min.js',
					'./client/theme/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
					'./client/theme/assets/global/plugins/select2/select2.min.js',
					'./client/theme/assets/global/plugins/datatables/media/js/jquery.dataTables.min.js',
					'./client/theme/assets/global/plugins/datatables/media/js/jquery.dataTables.columnFilter.js',
					'./client/theme/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js',
					'./client/theme/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
					'./client/theme/assets/global/plugins/bootstrap-datepaginator/bootstrap-datepaginator.min.js',
					'./client/theme/assets/admin/pages/scripts/ui-datepaginator.js',
					'./client/theme/assets/global/plugins/datatables/media/js/jquery.dataTables.min.js',
					'./client/theme/assets/global/plugins/datatables/media/js/jquery.dataTables.columnFilter.js',
					'./client/theme/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js',
					'./client/theme/assets/global/plugins/bootstrap-notify/js/bootstrap-notify.js',
					'./client/lib/dropzone.js',
					'./client/vendor/ng-draggable/ngDraggable.js',
					'./client/vendor/angular-dragdrop/src/angular-dragdrop.min.js',
	])
	.pipe(concat('common.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./client/dist/'));
})