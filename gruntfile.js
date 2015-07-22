module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      css: {
        files: ['app/features/**/*.scss', 'app/styles/*.scss'],
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
      develop: ['app/build']
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

    express: {
      options: {
        port: 8011,
        bases: ['app']
      },
      server: {
        hostname: 'localhost'
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-connect-rewrite');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('update', ['clean', 'bower']);
  grunt.registerTask('develop', ['http-server:dev', 'sass', 'watch']);
  grunt.registerTask('develop-new', ['express', 'sass', 'watch']);
};