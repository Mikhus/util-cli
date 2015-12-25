/*jshint esnext: true */
/*!
 * Project builder, main gulp config file.
 * Defines all the gulp tasks this project has.
 *
 *  ----------------------------------------------------------------------
 *                           THE RULES
 *  ----------------------------------------------------------------------
 *        (must be refreshed in mind each night before asleep)
 *
 *  1. Each task MUST be well-documented with an appropriate doc-block
 *
 *  2. Give a meaningful name to your task. If it counts ducks, don't
 *     spell it as looking for mushrooms.
 *
 *  3. Give a meaningful description, short, but well-understandable.
 *     Anyone would be able to read it running
 *       $ gulp help
 *     Remember this.
 *
 *  4. If you do not want to expose task to be visible within help message,
 *     tag it as #task {task:name}
 *
 *  5. If it is required to expose task to make it visible within help
 *     message, it MUST be tagged as @task {task:name}
 *
 *  6. We assuming ':' delimiter for the task names. If your task is
 *     more then one word - use the delimiter. Let's take care all our
 *     tasks are the same syntax. Please, do not confuse each other.
 *
 *  7. Keep the task code as short as possible. If it is more then one
 *     screen of code, refactor it, move some code in a separate module
 *     under ./libs directory, Keep the code clean!
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var glob = require('glob');
var mocha = require('gulp-mocha');

/**
 * @task {js:check}
 *
 * Performs validation of current project JavaScript code using JSHint and
 * checks code guidelines using JSCS
 */
gulp.task('js:check', function () {
    return gulp.src(glob.sync('./**/*.js').filter(function (path) {
            return !path.match(/^.\/(doc|bin|man|node_modules)/);
        }))
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'))
        .pipe(jshint.reporter('fail'))
        .once('error', function (error) {
            console.log(error.message);
            process.exit(1);
        });
});

/**
 * @task {pre:publish}
 *
 * Performs all operations needed before running module publishing
 */
gulp.task('pre:publish', ['js:doc']);

/**
 * @task {js:doc}
 *
 * Generates documentation from a JavaScript source files
 */
gulp.task('js:doc', ['js:test'], function (cb) {
    var bin = require('fs').realpathSync('./node_modules/.bin');
    var exec = require('child_process').exec;

    exec(bin + '/jsdoc -c ./jsdoc.json', function (error) {
        if (error) {
            console.log(error.message);
            process.exit(1);
        }
        cb();
    });
});

/**
 * @task {js:test}
 *
 * Running tests
 */
gulp.task('js:test', ['js:check'], function (cb) {
    return gulp.src(glob.sync('./test/*.js', { read: false }))
        .pipe(mocha())
        .once('error', function (error) {
            console.log(error.message);
            process.exit(1);
        });
});

/**
 * @task {default}
 *
 * Default task
 */
gulp.task('default', ['pre:publish']);
