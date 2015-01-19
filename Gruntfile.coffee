"use strict"

LIVERELOAD_PORT = 35729

liveReload = require('connect-livereload')(port: LIVERELOAD_PORT)
serveStatic = (connect, base) ->
  connect.static (require("path").resolve base)

module.exports = (grunt) ->

  grunt.initConfig

    ####
    # static server
    ####
    connect:
        options:
            port: 9000
            hostname: "0.0.0.0" # cannot omit, default is "127.0.0.1"
        dev:
            options:
                middleware: (connect, options) ->
                  [liveReload, serveStatic(connect, "src")]
        dist:
            options:
                middleware: (connect, options) ->
                  [liveReload, serveStatic(connect, "dist")]

    ####
    # watch
    ####
    watch:
        options:
            livereload: LIVERELOAD_PORT
        dev:
            files: ["src/**/*", "spec/**/*", "Gruntfile.coffee", ".jshintrc"]
            tasks: ["jshint", "testem:ci:short"]
        dist:
            files: ["src/**/*", "spec/**/*", "Gruntfile.coffee", ".jshintrc"]
            tasks: ["build"]

    ####
    # jshint
    ####
    jshint:
        files:[
            "package.json"
            ".jshintrc"
            "src/**/*.js"
        ]
        options:
            jshintrc: ".jshintrc"

    ####
    # test
    ####
    testem:
        short:
            src: [
                "bower_components/jquery/dist/jquery.min.js"
                "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
                "src/util.js"
                "src/strip.js"
                "src/multi_strip.js"
                "src/player.js"
                "src/appearance_detector.js"
                "src/player_event_dispatcher.js"
                "src/controller.js"
                "spec/**/*.js"
            ]
            report_file: ".report.tap"
            options:
                parallel: 8
                timeout: 10
                framework: "jasmine2"
                launch_in_ci: ["PhantomJS"]
                launch_in_dev: ["PhantomJS"] # allow to use only: grunt testem:run:short
                reporter: "tap"
        long:
            report_file: ".report.tap"
            options:
                src_files: [
                    "bower_components/**/*.js"
                    "src/**/*.js"
                    "spec/**/*.js"
                ]
                serve_files: [
                    "bower_components/jquery/dist/jquery.min.js"
                    "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
                    ".tmp/instrument/util.js"
                    ".tmp/instrument/strip.js"
                    ".tmp/instrument/multi_strip.js"
                    ".tmp/instrument/player.js"
                    ".tmp/instrument/appearance_detector.js"
                    ".tmp/instrument/player_event_dispatcher.js"
                    ".tmp/instrument/controller.js"
                    "spec/**/*.js"
                ]
                parallel: 8
                timeout: 60
                framework: "jasmine2"
                test_page: "tests.mustache"
                on_start: require("./coverage_server")
                before_tests: "./node_modules/istanbul/lib/cli.js instrument --output .tmp/instrument/ src"
                after_tests: "./node_modules/istanbul/lib/cli.js report"
                launch_in_ci: ["PhantomJS", "Chrome", "Firefox"]
                launch_in_dev: ["PhantomJS", "Chrome", "ChromeCanary", "Firefox", "Safari", "IE7", "IE8", "IE9"] # allow to use only: grunt testem:run:long
                reporter: "tap"


    ####
    ## compile
    ####
    clean: [".tmp", "dist"]

    copy:
        main:
            files: [
                expand: true
                dot: true
                cwd: "src/"
                dest: "dist/"
                src: [
                    "**/*.html"
                    "assets/**"
                    "!assets/**/*.mp4"
                ]
                filter: "isFile"
            ]

    useminPrepare:
        options:
            root: "src"
            dest: "dist"
        html: ["dist/**/*.html"]

    filerev:
        options:
            algorithm: "md5"
            length: 8
        main:
            src: [
                "dist/**/*.js"
                "dist/assets/**/*"
            ]

    usemin:
        options:
            dirs: ["dist/"]
        html: ["dist/**/*.html"]

  grunt.registerTask "build", ["jshint", "testem:ci:short", "clean", "copy", "useminPrepare",
                              "concat", "uglify", "filerev", "usemin"]

  grunt.registerTask "server", (target) ->

    if (target != "dist")
      return grunt.task.run ["jshint", "testem:ci:short", "run"]
    else
      return grunt.task.run ["connect:dist", "watch:dist"]

  grunt.registerTask "test", ["jshint", "testem:ci:long"]

  grunt.registerTask "run", ["connect:dev", "watch:dev"]

  grunt.registerTask "default", ["build", "server:dist"]

  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks
