module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
      useminPrepare: 'grunt-usemin'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: 'index.html',
    },

    usemin: {
      html: 'index.html'
    },

    sass: {
      options: {
        includePaths: [
          'bower_components/',
          'bower_components/bootstrap-sass/assets/stylesheets'
        ],
      },
      dist: {
        options: {
          outputStyle: 'compressed',
          sourceComments: 'none'
        },
        files: {
          'assets/css/app.css': 'assets/scss/app.scss',
        }
      },
      dev: {
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
          sourceComments: 'map'
        },
        files: {
          'assets/css/app.css': 'assets/scss/app.scss',
        }
      }
    },

    browserify: {
      appjs: {
        options: {
          browserifyOptions: {
            paths: ['app/'],
          }
        },
        src: [
          'app/app.module.js',
          'app/**/*.js'
        ],
        dest: 'assets/js/app.js'
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },

      sass: {
        files: 'assets/scss/**/*.scss',
        tasks: ['sass:dev']
      },

      js: {
        files: [
          'app/app.module.js',
          'app/**/*.js'
        ],
        tasks: ['browserify:appjs']
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: 'assets/css/*.css'
        },
        options: {
          watchTask: true,
          notify: false
        }
      }
    }
  });

  grunt.registerTask('allUsemin', ['useminPrepare', 'useminBuild']);
  grunt.registerTask('useminBuild', ['concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin']);

  grunt.registerTask('build', ['sass:dist', 'browserify:appjs', 'useminPrepare', 'useminBuild']);
  grunt.registerTask('default', ['sass:dev', 'browserify:appjs', 'browserSync', 'watch']);
};
