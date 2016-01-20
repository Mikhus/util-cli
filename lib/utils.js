/*jshint esnext: true */
/*!
 * Generic util functions for command line interface
 *
 * @author Mykhailo Stadnyk <mike.stadnyk@sisense.com>
 */

/**
 * @module util-cli
 * @description Generic util functions for command line interface
 */

var fs = require('fs');
var deasync = require('deasync');
var exec = deasync(require('child_process').exec);

/**
 * Checks if a current module was required by another node module or
 * just executed from command line.
 * Actually it is expected to bypass an argument which would be always
 * the value of internal __filename node constant.
 *
 * @example
 * <caption>Example usage:</caption>
 * var utils = require('./lib/cli-utils');
 * var cli = required('./MyCliImplementation');
 *
 * if (utils.executed(__filename)) {
 *     // this was executed from command line, so do the job
 *     cli.run();
 * }
 *
 * else {
 *    // otherwise just export something
 *    module.exports = cli;
 * }
 *
 * @param {string} moduleFilename - path to the module file
 * @returns {boolean}
 */
function executed (moduleFilename) {
    var pargs = process.argv;
    var i = 0;
    var s = pargs.length;
    var file = fs.realpathSync(moduleFilename);

    for (; i < s; i++) {
        if (pargs[i].match(/node(js)?(\.(exe|bat|cmd))?$/)) {
            if (file == fs.realpathSync(pargs[i + 1])) {
                return true;
            }
        }
    }

    return false;
}

// jscs:disable
/**
 * @external ChildProcess
 * @description ChildProcess class
 * @see {@link https://nodejs.org/api/child_process.html#child_process_class_childprocess|ChildProcess}
 */
// jscs:enable

/**
 * Spawns OS agnostic child process in the proper shell making sure it won't
 * loose coloring, etc.
 *
 * @param {string} cmd - command to launch as child process
 * @param {Array} [args] - arguments bypassed to a command
 * @param {Object} [options] - the same as for native's child_process.spawn()
 * @returns {external:ChildProcess}
 * @access public
 * @static
 */
function spawn (cmd, args, options) {
    options = options || {};

    if (process.platform.match(/^win/)) {
        args.unshift('/s', '/c', cmd);
        cmd = 'cmd.exe';
        options.windowsVerbatimArguments = true;
    }

    else {
        args.unshift('-c', cmd);
        cmd = 'sh';
    }

    return require('child_process')
        .spawn(cmd, args, options);
}

/**
 * Synchronous version of spawn function.
 *
 * @param {string} cmd - command to launch as child process
 * @param {Array} [args] - arguments bypassed to a command
 * @param {Object} [options] - the same as for native's child_process.spawn()
 * @returns {integer} - child process exit code
 * @access public
 * @static
 */
function spawnSync (cmd, args, options) {
    var done = false;
    var child = spawn(cmd, args, options)
        .on('error', function (err) { throw err; })
        .on('exit', function () { done = true; })
    ;

    deasync.loopWhile(function () {
        return !done;
    });

    return child.exitCode;
}

spawn.sync = spawnSync;

/**
 * Lookup for system related available text editor in the current OS
 *
 * @example
 * var editor = require('util-cli').editor;
 * var exec = require('child_process).execFile;
 * var fs = require('fs');
 * var file = './test.txt';
 *
 * fs.writeFileSync(file, 'Hello, World!', 'utf8');
 *
 * exec(editor(), [file], function () {
 *     // editing complete, do something
 * });
 *
 * @returns {string|null} - path to editor command
 * @access public
 * @static
 */
function editor () {
    if (!editor.cmd) {
        editor.cmd = process.env.EDITOR ||
            ['notepad', 'mcedit', 'vim', 'vi', 'gedit', 'nano']
                .map(function (cmd) {
                    return resolve(cmd);
                })
                .filter(function (cmd) {
                    return cmd;
                })[0] || null
        ;
    }

    return editor.cmd;
}

/**
 * Resolves absolute command path, OS agnostic way
 *
 * @example
 * var resolve = require('util-cli').resolve;
 * console.log(resolve('npm'));
 *
 * @param {string} cmd - command to find absolute path to
 * @returns {string|null}
 * @access public
 * @static
 */
function resolve (cmd) {
    try {
        var checker = process.platform.match(/^win/) ? 'where' : 'which';
        var result = exec(checker + ' ' + cmd);
        var paths = result.split(/\r?\n/);
        return paths[0];
    }
    catch (err) {
        return null;
    }
}

module.exports = {
    editor: editor,
    resolve: resolve,
    executed: executed,
    spawn: spawn
};
