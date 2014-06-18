/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require("path");
module.exports = function (grunt) {
    grunt.loadNpmTasks('atpackager');
    require('atpackager').loadNpmPlugin('noder-js');
    require('atpackager').loadNpmPlugin('at-noder-converter');
    grunt.registerMultiTask('atbuild', "Aria Templates framework build", function () {

        var ariaPackage = require('../package.json');
        var options = this.options({
            extraSourceDirectories : [],
            extraSourceFiles : [],
            extraAllowedGlobals : [],
            bootstrap : require('../build/config/files-bootstrap.json'),
            packages : require('../build/config/files-prod.json'),
            pkg : require('../package.json'),
            output : {
                bootstrap : 'build/target/bootstrap',
                prod : 'build/target/production'
            },
            appEnvironment : {},
            checkPackaged : true
        });

        if (options.appEnvironment.defaultWidgetLibs) {
            options.appEnvironment.defaultWidgetLibs.aria = "aria.widgets.AriaLib";
        }
        var baseAriaDirectory = (options.pkg.name && options.pkg.name == ariaPackage.name)
                ? 'src'
                : 'node_modules/ariatemplates/src';
        grunt.config.set('packaging.bootstrap.aria_source_directory', baseAriaDirectory);
        grunt.config.set('packaging.bootstrap.source_directories', [baseAriaDirectory].concat(options.extraSourceDirectories));
        grunt.config.set('packaging.bootstrap.extra_source_files', options.extraSourceFiles);
        grunt.config.set('packaging.bootstrap.files', options.bootstrap);
        grunt.config.set('packaging.bootstrap.extra_allowed_globals', options.extraAllowedGlobals);
        grunt.config.set('packaging.prod.files', options.packages);
        grunt.config.set('packaging.prod.app_environment', options.appEnvironment);
        grunt.config.set('packaging.prod.check_packaged', options.checkPackaged);
        grunt.config.set('pkg', options.pkg);
        grunt.config.set('packaging.bootstrap.outputdir', options.output.bootstrap);
        grunt.config.set('packaging.prod.outputdir', options.output.prod);
        grunt.config.set('aria.version', ariaPackage.version);

        grunt.loadTasks(path.join(__dirname, '../build/grunt-config/packaging'));
        grunt.task.run('bootstrap', 'prod');
    })
};
