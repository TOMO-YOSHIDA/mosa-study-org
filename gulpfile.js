var application_name = 'study';

var gulp = require('gulp')
	, del = require('del')
	, bowers = require('bower-main')
	, runSequence = require('run-sequence').use(gulp)
	, jade = require('gulp-jade')
	, filter = require('gulp-filter')
	, less = require('gulp-less')
	, minifyCss = require('gulp-cssnano')
	, autoprefixer = require('gulp-autoprefixer')
	, uglify = require('gulp-uglify')
	, concat = require('gulp-concat')
	, styledocco = require('gulp-styledocco')
	, webserver = require('gulp-webserver')
	;


var tsPath = ['src/js/**/*.ts'],
	lessPath = 'src/css/**/*.less',
	lessSubPath = 'src/css-sub/**/*.less',
	jadePath = 'src/html/**/*.jade';


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
		.pipe(gulp.dest('public/mosa-study/temp'));

	var jslib = marge(bowers('js', 'min.js'));
	jslib.push('src/scripts/**/*.js') // bowerだけど自作JSも含める
	gulp.src(jslib)
		.pipe(uglify()) // ハングする
		.pipe(concat('lib.min.js'))
		.pipe(gulp.dest('public/mosa-study/'));
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
		.pipe(gulp.dest('public/mosa-study/temp'));
});
// styledocco
gulp.task('styledocco', function () {
	return;//無効
	gulp.src('public/mosa-study/temp/**/*.css')
		.pipe(plum())
		.pipe(styledocco({
			out: 'public/mosa-study/style-guide',
			name: 'styleguid',
			verbose: false, // 詳細出力をしない
			"no-minify": true
		}))
});
// css minify
gulp.task('css-minify', function () {
	gulp.src('public/mosa-study/temp/**/*.css')
		.pipe(concat(application_name + '.css'))
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(gulp.dest('public/mosa-study/'));
});

// ページ固有のless
gulp.task('sub-less', function () {
	gulp.src(lessSubPath)
		.pipe(plum())
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(gulp.dest('public/mosa-study/subcss'));
});

//jadeをコンパイルして出力先にコピーする
gulp.task('jade', function () {
	gulp.src([jadePath])
		.pipe(plum())
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest('public/mosa-study/'));
});

// 生JS
gulp.task('plane-js', function () {
	gulp.src(['src/scripts/*.js'])
		.pipe(plum())
		.pipe(gulp.dest('public/mosa-study/scripts/'));
});


//ファイルの更新を監視する
gulp.task('watch', function () {

	gulp.watch(lessPath, ['less']);
	gulp.watch(jadePath, ['jade']);
	gulp.watch(lessSubPath, ['sub-less']);
	gulp.watch('src/scripts/*.js', ['plane-js']);

});

gulp.task('webserver', function () {
	gulp.src('public')
		.pipe(webserver({
			livereload: true,
			open: true
		}));
});

gulp.task('build', function () {
	runSequence('clean', 'bower', 'less', 'sub-less', 'jade', 'plane-js');
});

// build & watch
gulp.task('debug', function () {
	runSequence('build', 'watch')
});
