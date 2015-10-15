module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      css: {
        files: ['app/features/**/*.scss', 'app/styles/*.scss', 'app/styles/components/*.scss', 'app/components/**/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      }
    },

    sass: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['features/**/*.scss', 'styles/*.scss'],
            ext: '.css',
            dest: 'app/build'
          }
        ]
      }
    },

    clean: {
      bower: ['bower_components'],
      vendor: ['app/vendor'],
      develop: ['app/build'],
      ftue: ['data/ftues.db']
    },

    bower: {
      install: {
        options: {
          targetDir: './app/vendor',
          cleanTargetDir: true,
          layout: 'byComponent'
        }
      }
    },

    'http-server': {
      'dev': {
        root: './app',
        port: 8010,
        host: '0.0.0.0',
        runInBackground: true,
        logFn: function(req, res, error) {}
      }
    },

    shell: {
      'npm': {
        command: 'npm install'
      },
      'git-pull': {
        command: 'git pull --ff-only --all -p',
        options: {
          failOnError: false
        }
      },
      'nw-es': {
        command: '"node_modules/.bin/nw" accounting-js --lang=es'
      },
      'nw': {
        command: '"node_modules/.bin/nw" accounting-js'
      }
    },

    copy: {
      main: {
        src: 'node_modules/nedb/browser-version/out/*',
        dest: 'app/vendor/nedb/',
        flatten: true,
        filter: 'isFile',
        expand: true
      }
    },

    parallel: {
      watchers: {
        tasks: [{
          grunt: true,
          args: ['shell:nw']
        }, {
          stream: true,
          args: ['watch']
        }]
      },

      "watchers-es": {
        tasks: [{
          grunt: true,
          args: ['shell:nw-es']
        }, {
          stream: true,
          args: ['watch']
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-connect-rewrite');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('clean-instance', ['clean:bower', 'clean:vendor', 'clean:develop']);
  grunt.registerTask('update', ['shell:git-pull', 'shell:npm', 'clean-instance', 'bower', 'copy']);
  grunt.registerTask('develop-es', ['sass', 'parallel:watchers-es']);
  grunt.registerTask('develop', ['sass', 'parallel:watchers']);
};