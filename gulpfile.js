var gulp= require('gulp'),
gutil=require('gulp-util'),
coffee=require('gulp-coffee'),
browserify=require('gulp-browserify'),
compass=require('gulp-compass'),
connect=require('gulp-connect'),
concat=require('gulp-concat');
var coffeesources=['components/coffee/tagline.coffee'];
var jssources=['components/scripts/rclick.js',
'components/scripts/pixgrid.js',
'components/scripts/tagline.js',
'components/scripts/template.js'


];
var sasssources=['components/sass/style.scss'];
gulp.task('coffee',function(){
gulp.src('coffeesources')
.pipe(coffee({bare:true})
	.on('error',gutil.log))
	.pipe(gulp.dest('components/scripts'))
});
gulp.task('js',function(){
	gulp.src(jssources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulp.dest('builds/development/js'))
	.pipe(connect.reload())
});
gulp.task('compass',function(){
	gulp.src(sasssources)
	.pipe(compass({
		sass:'components/sass',
		image:'builds/development/images',
		style: 'expanded'
	})
	.on('error',gutil.log))
	.pipe(gulp.dest('builds/development/css'))
	.pipe(connect.reload())
});
gulp.task('watch',function(){
	gulp.watch(coffeesources,['coffee']);
	gulp.watch(jssources,['js']);
	gulp.watch('components/sass/*.scss',['compass']);
});
gulp.task('default',['coffee','js','compass','connect','watch']);
gulp.task('connect',function(){
connect.server({
	root:'builds/development/',
	livereload:true
});
});