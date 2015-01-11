"use strict"

module.exports = (grunt) ->

  grunt.initConfig

    ####
    # watch
    ####
    watch:
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

  grunt.registerTask "default", ["build", "watch"]

  grunt.registerTask "build", ["clean", "copy", "useminPrepare",
                              "concat", "uglify", "filerev", "usemin"]

  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks
