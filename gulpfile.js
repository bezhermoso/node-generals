'use strict';

var gulp = require('gulp');
var react = require('gulp-react');
var eventStream = require('event-stream');
var clientConnect = require('gulp-connect');
var express = require('gulp-express');
var coffee = require('gulp-coffee');

gulp.task('client-serve', ['client-compile'], function () {
    clientConnect.server({
        root: 'client'
    });
});

gulp.task('client-compile', function () {

    var htmlStream = gulp.src('client/**.html');
    var reactStream = gulp.src([
        'client/jsx/**.js',
        'client/jsx/**/*.js'
    ], {base: 'client/jsx'});

    reactStream
        .pipe(react())
        .pipe(gulp.dest('client/dist/js'));

    var merged = eventStream.merge(reactStream, htmlStream);

    merged.pipe(clientConnect.reload());
});

gulp.task('client-watch', function () {
    gulp.watch([
        'client/**.html',
        'client/jsx/**.js',
        'client/jsx/**/*.js'
    ], ['client-compile']);
});

gulp.task('server-compile', function() {

    var coffeePot = gulp.src([
        'server/coffee/**.coffee',
        'server/coffee/**/*.coffee'
    ], {base: 'server/coffee'});
    coffeePot
        .pipe(coffee())
        .pipe(gulp.dest('server'));

});

gulp.task('server-watch', function () {
   gulp.watch([
       'server/coffee/**.coffee',
       'server/coffee/**/*.coffee'
   ], ['server-compile', 'server-serve']);
    gulp.watch([
        'server/**.js',
        'server/**/*.js'
    ], express.notify);
});

gulp.task('server-serve', function () {
    express.run(['server/gotg-server.js']);
});

gulp.task('client', ['client-compile', 'client-serve', 'client-watch']);
gulp.task('server', ['server-compile', 'server-serve', 'server-watch']);
gulp.task('default', ['client', 'server']);