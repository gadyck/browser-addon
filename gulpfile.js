var gulp = require("gulp");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');
var merge = require('merge-stream');
var sequence = require('run-sequence');

gulp.task('default', function (done) {
    sequence('build', 'static', ['package:beta', 'package'], done);
});

gulp.task("build", function (done) {
    sequence("build:common", ["build:background", "build:popup", "build:panels", "build:page", "build:settings", "build:dialogs" ], done);
});

gulp.task("lint:ts", ["lint:background", "lint:popup", "lint:panels", "lint:page", "lint:settings", "lint:dialogs" ]);

gulp.task("lint:background", function() {
    return gulp.src(["background/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:page", function() {
    return gulp.src(["page/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:popup", function() {
    return gulp.src(["popup/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:panels", function() {
    return gulp.src(["panels/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:settings", function() {
    return gulp.src(["settings/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:dialogs", function() {
    return gulp.src(["dialogs/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:common", function() {
    return gulp.src(["common/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

var tsProjectCommon = ts.createProject("common/tsconfig.json", {
    outFile: "common/common.js",
    declaration: true
});
gulp.task("build:common", ["lint:common"], function() {

var tsResult = tsProjectCommon.src()
    .pipe(sourcemaps.init())
    .pipe(tsProjectCommon());
    return merge(
      tsResult.dts.pipe(gulp.dest('typedefs')),
      tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('common'))
    );
});

var tsProjectBackground = ts.createProject("background/tsconfig.json", {
    outFile: "background/app.js"
});
gulp.task("build:background", ["lint:background"], function() {
    return tsProjectBackground.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectBackground())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/background"));
});

var tsProjectPopup = ts.createProject("popup/tsconfig.json", {
    outFile: "popup/popup.js"
});
gulp.task("build:popup", ["lint:popup"], function() {
    return tsProjectPopup.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectPopup())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/popup"));
});

var tsProjectPanels = ts.createProject("panels/tsconfig.json", {
    outFile: "panels/panels.js"
});
gulp.task("build:panels", ["lint:panels"], function() {
    return tsProjectPanels.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectPanels())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/panels"));
});

var tsProjectPage = ts.createProject("page/tsconfig.json", {
    outFile: "page/page.js"
});
gulp.task("build:page", ["lint:page"], function() {
    return tsProjectPage.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectPage())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/page"));
});

var tsProjectSettings = ts.createProject("settings/tsconfig.json", {
    outFile: "settings/settings.js"
});
gulp.task("build:settings", ["lint:settings"], function() {
    return tsProjectSettings.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectSettings())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/settings"));
});

var tsProjectDialogs = ts.createProject("dialogs/tsconfig.json", {});
gulp.task("build:dialogs", ["lint:dialogs"], function() {
    return tsProjectDialogs.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectDialogs())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/dialogs"));
});

gulp.task('watch', ['build', 'static'], function() {
    gulp.watch(['common/**/*.ts'], ['build:common']);
    gulp.watch(['popup/**/*.ts'], ['build:popup']);
    gulp.watch(['panels/**/*.ts'], ['build:panels']);
    gulp.watch(['page/**/*.ts'], ['build:page']);
    gulp.watch(['background/**/*.ts'], ['build:background']);
    gulp.watch(['settings/**/*.ts'], ['build:settings']);
    gulp.watch(['dialogs/**/*.ts'], ['build:dialogs']);
    gulp.watch(['popup/**/*.{css,html}'], ['static:popup']);
    gulp.watch(['panels/**/*.{css,html}'], ['static:panels']);
    gulp.watch(['page/**/*.{css,html}'], ['static:page']);
    gulp.watch(['background/**/*.{css,html}'], ['static:background']);
    gulp.watch(['settings/**/*.{css,html}'], ['static:settings']);
    gulp.watch(['dialogs/**/*.{css,html}'], ['static:dialogs']);
    gulp.watch(['common/*.{js,css,html,map}', 'common/images/**', 'common/fonts/**'], ['static:common']);
    gulp.watch(['release-notes/*.{js,css,html,map}'], ['static:releasenotes']);
    gulp.watch(['_locales/**'], ['static:locales']);
    gulp.watch(['manifest.json'], ['static:manifest']);
});

gulp.task('static:popup', function() {
    return gulp.src('popup/popup.{css,html}')
        .pipe(gulp.dest('build/popup'))
});
gulp.task('static:panels', function() {
    return gulp.src('panels/panels.{css,html}')
        .pipe(gulp.dest('build/panels'))
});
gulp.task('static:page', function() {
    return gulp.src('page/*.{css,html}')
        .pipe(gulp.dest('build/page'))
});
gulp.task('static:background', function() {
    return gulp.src('background/*.{css,html}')
        .pipe(gulp.dest('build/background'))
});
gulp.task('static:settings', function() {
    return gulp.src('settings/*.{css,html}')
        .pipe(gulp.dest('build/settings'))
});
gulp.task('static:dialogs', function() {
    return gulp.src('dialogs/*.{css,html}')
        .pipe(gulp.dest('build/dialogs'))
});
gulp.task('static:common', function() {
    return merge(
        gulp.src('common/*.{js,css,html,map}')
            .pipe(gulp.dest('build/common')),
        gulp.src('common/images/**')
            .pipe(gulp.dest('build/common/images')),
        gulp.src('common/fonts/**')
            .pipe(gulp.dest('build/common/fonts'))
    );
});
gulp.task('static:releasenotes', function() {
    return gulp.src('release-notes/*.{js,css,html,map}')
        .pipe(gulp.dest('build/release-notes'))
});
gulp.task('static:locales', function() {
    return gulp.src('_locales/**')
        .pipe(gulp.dest('build/_locales'))
});
gulp.task('static:manifest', function() {
    return gulp.src('manifest.json')
        .pipe(gulp.dest('build'))
});

gulp.task('static', ['static:popup','static:panels','static:page','static:background',
    'static:settings','static:dialogs','static:common','static:releasenotes','static:locales',
    'static:manifest']);

gulp.task('zip', function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '.zip';
	return gulp.src(['build/**','!**/*.map'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('xpi', function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '.xpi';
	return gulp.src(['build/**','!**/*.map'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('zip:beta', function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '-beta.zip';
	return gulp.src(['build/**'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('xpi:beta', function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '-beta.xpi';
	return gulp.src(['build/**'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('package', ['xpi','zip']);
gulp.task('package:beta', ['xpi:beta','zip:beta']);
