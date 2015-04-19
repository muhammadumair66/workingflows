var gulp= require('gulp'),
gutil=require('gulp-util'),
coffee=require('gulp-coffee');
var coffeesources=['components/coffee/tagline.coffee'];
gulp.task('coffee',function(){
gulp.src('coffeesources')
.pipe(coffee({bare:true})
	.on('error',gutil.log))
	.pipe(gulp.dest('components/scripts'))
});