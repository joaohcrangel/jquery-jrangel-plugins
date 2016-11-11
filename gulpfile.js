var fs      = require('fs'),
    gulp    = require('gulp'),
    rename  = require('gulp-rename'),
    jshint  = require('gulp-jshint'),
    jsmin   = require('gulp-jsmin'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    watch   = require('gulp-watch');

gulp.task('all-js', function() {

    gulp.src([
        './jquery.core.js',
        './jquery.btnload.js',
        './jquery.btnrest.js',
        './jquery.store.js',
        './jquery.combobox.js',
        './jquery.form.js',
        './jquery.upload.js',
        './jquery.table.js',
        './jquery.arquivos.js',
        './jquery.panel.js',
        './jquery.picker.js'
    ])
        .pipe(jshint())
        .pipe(uglify())
        .pipe(jsmin())
        .pipe(concat('./jrangel.all.js', {newLine: ';'}))
        .pipe(gulp.dest('dist'));

});

gulp.task('default', function() {
	gulp.watch('*.js',['all-js']);
});