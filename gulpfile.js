var gulp= require('gulp'),
gutil=require('gulp-util'),
coffee=require('gulp-coffee'),
browserify=require('gulp-browserify'),
compass=require('gulp-compass'),
connect=require('gulp-connect'),
concat=require('gulp-concat'),
gulpif=require('gulp-if'),
uglify=require('gulp-uglify');
var env,outputdir,sassstyle;
env = process.env.NODE_ENV || 'development' ;
if (env==='development'){
	outputdir='builds/development/';
	sassstyle='expanded';
} else {
	outputdir='builds/production/';
	sassstyle='compressed';
}
var coffeesources=['components/coffee/tagline.coffee'];
var jssources=['components/scripts/rclick.js',
'components/scripts/pixgrid.js',
'components/scripts/tagline.js',
'components/scripts/template.js'


];
var sasssources=['components/sass/style.scss'];
var htmlsources=[outputdir + '*.html'];
var jsonsources=[outputdir +'js/*.json']
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
	.pipe(gulpif(env==='production',uglify()))
	.pipe(gulp.dest(outputdir +'js'))
	.pipe(connect.reload())
});
gulp.task('compass',function(){
	gulp.src(sasssources)
	.pipe(compass({
		sass:'components/sass',
		image:outputdir +'images',
		style: sassstyle	})
	.on('error',gutil.log))
	.pipe(gulp.dest(outputdir +'css'))
	.pipe(connect.reload())
});
gulp.task('watch',function(){
	gulp.watch(coffeesources,['coffee']);
	gulp.watch(jssources,['js']);
	gulp.watch('components/sass/*.scss',['compass']);
	gulp.watch(htmlsources,['html']);
	gulp.watch(jsonsources,['json']);
});
gulp.task('default',['coffee','html','json','js','compass','connect','watch']);
gulp.task('connect',function(){
connect.server({
	root:outputdir ,
	livereload:true
});
});
gulp.task('html',function(){
	gulp.src(htmlsources)
	.pipe(connect.reload())
});
gulp.task('json',function(){
	gulp.src(jsonsources)
	.pipe(connect.reload())
});