var application_name = 'web-learning';

var gulp = require('gulp')
	, del = require('del')
	, bowers = require('bower-main')
	, runSequence = require('run-sequence').use(gulp)
	, jade = require('gulp-jade')
	, filter = require('gulp-filter')
	, less = require('gulp-less')
	, minifyCss = require('gulp-minify-css')
	, autoprefixer = require('gulp-autoprefixer')
	, uglify = require('gulp-uglify')
	, concat = require('gulp-concat')
	, styledocco = require('gulp-styledocco')
	;


var tsPath = ['js/**/*.ts'],
	lessPath = 'css/**/*.less',
	lessSubPath = 'css-sub/**/*.less',
	jadePath = 'html/**/*.jade';


var tsSetting = {
	target: "ES5",
	sortOutput: true
}

//plumberはStream中のエラーが原因でタスクが強制停止することを防止するモジュール
var plumber = require('gulp-plumber'),
	plum = function () {
		return plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		});
	};

// minified, minifiedNotFoundをマージして返す
var marge = function (bowerFiles) {
	return bowerFiles.minified.concat(bowerFiles.minifiedNotFound);
};

// 出力フォルダのクリーンアップ
gulp.task('clean', function () {
	del.sync(['public/**/']);
});

// bower_components
gulp.task('bower', function () {

	var css = marge(bowers('css', 'min.css'));
	gulp.src(css)
		.pipe(plum())
		.pipe(concat('_lib.min.css'))
		.pipe(gulp.dest('public/css'));

	var jslib = marge(bowers('js', 'min.js'));
	gulp.src(jslib)
	// .pipe(uglify()) // ハングする
		.pipe(concat('_lib.min.js'))
		.pipe(gulp.dest('public/js'));
});


//lessをコンパイルする
gulp.task('less', function () {
	runSequence('less-compile', 'styledocco', 'css-minify');
});

// 生cssの出力
gulp.task('less-compile', function () {
	return gulp.src(lessPath)
		.pipe(plum())
		.pipe(less())
		.pipe(gulp.dest('public/css'));
});
// styledocco
gulp.task('styledocco', function () {
	gulp.src('public/css/**/*.css')
		.pipe(plum())
		.pipe(styledocco({
			out: 'public/style-guide',
			name: 'styleguid',
			verbose: false, // 詳細出力をしない
			"no-minify": true
		}))
});
// css minify
gulp.task('css-minify', function () {
	gulp.src('public/css/**/*.css')
		.pipe(concat(application_name + '.css'))
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(gulp.dest('public'));
});

// ページ固有のless
gulp.task('sub-less', function () {
	gulp.src(lessSubPath)
		.pipe(plum())
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(gulp.dest('public/subcss'));
});

//jadeをコンパイルして出力先にコピーする
gulp.task('jade', function () {
	gulp.src([jadePath])
		.pipe(plum())
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest('public/'));
});

//ファイルの更新を監視する
gulp.task('watch', function () {
	gulp.watch(lessPath, ['less']);
	gulp.watch(jadePath, ['jade']);
	gulp.watch(lessSubPath, ['sub-less']);
});

gulp.task('sonota', function () {
	gulp.src('js/**/*.js').pipe(gulp.dest('public/js/'))
});

gulp.task('build', function () {
	runSequence('clean', 'bower', 'less', 'sub-less', 'jade', 'sonota');
});

// build & watch
gulp.task('debug', function () {
	runSequence('build', 'watch')
});
