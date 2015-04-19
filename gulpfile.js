var gulp= require('gulp'),
gutil=require('gulp-util'),
coffee=require('gulp-coffee'),
browserify=require('gulp-browserify'),
compass=require('gulp-compass'),
connect=require('gulp-connect'),
concat=require('gulp-concat'),
gulpif=require('gulp-if'),
uglify=require('gulp-uglify'),
minifyhtml=require('gulp-minify-html'),
jsonminify=require('gulp-jsonminify'),
imagemin=require('gulp-imagemin'),
pngcrush=require('imagemin-pngcrush');
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
	gulp.watch('builds/development/*.html',['html']);
	gulp.watch('builds/development/js/*.json',['json']);
	gulp.watch(jsonsources,['json']),
	gulp.watch('builds/development/images/**/*.*',['images']);
});
gulp.task('default',['coffee','html','images','json','js','compass','connect','watch']);
gulp.task('connect',function(){
connect.server({
	root:outputdir ,
	livereload:true
});
});
gulp.task('html',function(){
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env==='production',minifyhtml()))
	.pipe(gulpif(env==='production',gulp.dest(outputdir)))
	.pipe(connect.reload())
});
gulp.task('images',function(){
gulp.src('builds/development/images/**/*.*')
.pipe(gulpif(env==='production',imagemin({
	progressive: true,
	svgoPlugins:[{removeViewBox:false}],
	use:[pngcrush()]
})))
	.pipe(gulpif(env==='production',gulp.dest(outputdir+'images')))
	.pipe(connect.reload())
});
gulp.task('json',function(){
	gulp.src('builds/development/js/*.json')
	.pipe(gulpif(env==='production',jsonminify()))
	.pipe(gulpif(env==='production',gulp.dest('builds/production/js')))
	.pipe(connect.reload())
});