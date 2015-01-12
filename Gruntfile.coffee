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
            hostname: "localhost"
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
            files: ["src/**/*.html", "src/**/*.js", "Gruntfile.coffee"]
        dist:
            files: ["src/**/*.html", "src/**/*.js", "Gruntfile.coffee"]
            tasks: ["build"]

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
            algorithm: 'md5'
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

  grunt.registerTask "build", ["clean", "copy", "useminPrepare",
                              "concat", "uglify", "filerev", "usemin"]

  grunt.registerTask "server", (target) ->

    if (target != "dist")
      return grunt.task.run ["connect:dev", "watch:dev"]
    else
      return grunt.task.run ["connect:dist", "watch:dist"]

  grunt.registerTask "default", ["build", "server:dist"]

  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks
