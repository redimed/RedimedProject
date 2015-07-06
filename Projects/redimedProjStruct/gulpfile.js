var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('common', function(){
	return gulp.src(['./client/vendor/jquery/dist/jquery.js', 
					'./client/vendor/jquery-ui/ui/jquery-ui.js', 
					'./client/lib/jquery.ui.touch-punch.js', 
					'./client/theme/assets/global/plugins/bootstrap/js/bootstrap.min.js'
	])
	.pipe(concat('common.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./client/dist/'));
})