var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

//Libs utilizadas pelo sistema.
var libJS = [];
libJS.push('www/lib/ionic/js/ionic.bundle.min.js');
libJS.push('www/lib/angular/angular.min.js');
libJS.push('www/lib/ngCordova/dist/ng-cordova.min.js');



//Scripts do sistema.
var scriptJS = [];
scriptJS.push('www/js/*.js');
scriptJS.push('www/js/modules/*.js');
scriptJS.push('www/js/controllers/*.js');
scriptJS.push('www/js/services/*.js');
scriptJS.push('www/js/directives/*.js');

//Verifica as modificações dos scripts do sistema.
gulp.task('watch', function() {
  gulp.watch(scriptJS, ['scripts']);
});

//Concatena os scripts do sistema.
//Caso necessite minificar usar uglify()
gulp.task('scripts', function() {
  return gulp.src(scriptJS)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('www/build'));
});

//Concatena as libs do sistema.
gulp.task('libs', function() {
  return gulp.src(libJS)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('www/build'));
});

//Cria a task default.
gulp.task('default', ['watch', 'scripts', 'libs']);