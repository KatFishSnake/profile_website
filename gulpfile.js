var gulp = require("gulp"),
	sass = require("gulp-sass"),
	csso = require("gulp-csso"), // Css minifier
	jade = require("gulp-jade");

var config = {
	path: {
		dest: "./public",

		//- Templates
		tpl: "./pages/*/*.jade",
		tpl_all: "./pages/**/*.jade",

		//- Style
		style: "./pages/*/*.scss",
		style_all: "./pages/**/*.scss",

		//- JS
		js: "./pages/**/*.js"
	}
};

// --- Basic Tasks ---
gulp.task("css", function() {
	return gulp.src(config.path.style)
		.pipe(
			sass({
				includePaths: [config.path.dest],
				errLogToConsole: true
			}))
		.pipe(csso())
		.pipe(gulp.dest(config.path.dest));
});

gulp.task("tpl", function() {
	return gulp.src(config.path.tpl)
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(config.path.dest));
});

gulp.task("watch", function() {
	gulp.watch(config.path.style_all, ["css"]);

	gulp.watch(config.path.tpl_all, ["tpl"]);
});

// Prod task
gulp.task("build", ["css", "tpl"]);

// Default Task for development
gulp.task("default", ["build", "watch"]);