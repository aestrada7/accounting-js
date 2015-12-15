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
        command: '"node_modules/.bin/nw" accounting-js --lang=es --dev'
      },
      'nw': {
        command: '"node_modules/.bin/nw" accounting-js --dev'
      },
      'deploy-nw-win': {
        command: [
          'cd release',
          'copy /b nw.exe+app.nw acctjs.exe',
          'del nw.exe',
          'del app.nw',
          'del credits.html',
          'del ffmpegsumo.dll',
          'del nwjc.exe',
          'echo start acctjs.exe --lang=es >> run.bat'
        ].join('&&')
      },
      'installer-win': {
        command: [
          'cd release',
          'del script.nsi',
          'echo !include MUI.nsh >> script.nsi',
          'echo Name "AccountingJS <%= pkg.version %>" >> script.nsi',
          'echo OutFile "acctjs-<%= pkg.version %>.exe" >> script.nsi',
          'echo !insertmacro MUI_PAGE_WELCOME >> script.nsi',
          'echo !insertmacro MUI_PAGE_DIRECTORY >> script.nsi',
          'echo !insertmacro MUI_PAGE_INSTFILES >> script.nsi',
          'echo !insertmacro MUI_PAGE_FINISH >> script.nsi',
          'echo !insertmacro MUI_LANGUAGE "Spanish" >> script.nsi',
          'echo !insertmacro MUI_LANGUAGE "English" >> script.nsi',
          'echo InstallDir "$PROGRAMFILES\\AccountingJS" >> script.nsi',
          'echo InstallDirRegKey HKLM "SOFTWARE\\AccountingJS" "installdir" >> script.nsi',
          'echo Section >> script.nsi',
          'echo   SetShellVarContext all >> script.nsi',
          'echo   WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AccountingJS" "AccountingJS" "AccountingJS" >> script.nsi',
          'echo   WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AccountingJS" "UninstallString" "$INSTDIR\\uninstall.exe" >> script.nsi',
          'echo   SetOutPath $INSTDIR >> script.nsi',
          'echo   File /r "*.*" >> script.nsi',
          'echo   CreateShortCut "$DESKTOP\\AccountingJS.lnk" "$OUTDIR\\acctjs.exe" "--lang=es" >> script.nsi',
          'echo   WriteUninstaller "$INSTDIR\\uninstall.exe" >> script.nsi',
          'echo SectionEnd >> script.nsi',
          'echo Section "Uninstall" >> script.nsi',
          'echo   SetShellVarContext all >> script.nsi',
          'echo   Delete "$DESKTOP\\AccountingJS.lnk" >> script.nsi',
          'echo   RMDir /r "$PROGRAMFILES\\AccountingJS" >> script.nsi',
          'echo   RMDir /r "$INSTDIR" >> script.nsi',
          'echo   Delete $INSTDIR\\uninstall.exe >> script.nsi',
          'echo   DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AccountingJS" >> script.nsi',
          'echo SectionEnd >> script.nsi',
          'echo Function .onInit >> script.nsi',
          'echo   !insertmacro MUI_LANGDLL_DISPLAY >> script.nsi',
          'echo FunctionEnd >> script.nsi'
        ].join('&&')
      }
    },

    copy: {
      vendor: {
        src: 'node_modules/nedb/browser-version/out/*',
        dest: 'app/vendor/nedb/',
        flatten: true,
        filter: 'isFile',
        expand: true
      },
      'nw': {
        src: '**',
        dest: 'release/',
        cwd: 'node_modules/nw/nwjs/',
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
    },

    compress: {
      deploy: {
        options: {
          archive: 'release/app.zip'
        },
        files: [
          { src: ['package.json'] },
          { src: ['app/**'] },
          { src: ['static/**'] },
          { src: ['node_modules/fstream/**'] },
          { src: ['node_modules/ncp/**'] },
          { src: ['node_modules/nedb/**'] },
          { src: ['node_modules/rimraf/**'] },
          { src: ['node_modules/tar/**'] }
        ]
      }
    },

    rename: {
      deploy: {
        files: [
          { src: ['release/app.zip'], dest: ['release/app.nw'] }
        ]
      }
    },

    'winresourcer': {
      'set-icon': {
        operation: 'Update',
        exeFile: 'release/nw.exe',
        resourceType: 'Icongroup',
        resourceName: 'IDR_MAINFRAME',
        lang: 1033,
        resourceFile: 'static/icon/icon.ico'
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-makensis');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('winresourcer');

  grunt.registerTask('clean-instance', ['clean:bower', 'clean:vendor', 'clean:develop']);
  grunt.registerTask('update', ['shell:git-pull', 'shell:npm', 'clean-instance', 'bower', 'copy:vendor']);
  grunt.registerTask('develop-es', ['sass', 'parallel:watchers-es']);
  grunt.registerTask('develop', ['sass', 'parallel:watchers']);
  grunt.registerTask('deploy-win', ['sass', 'compress', 'rename', 'copy:nw', 'winresourcer:set-icon', 'shell:deploy-nw-win']);
  grunt.registerTask('installer-win', ['shell:installer-win']);
  grunt.registerTask('deploy-linux', ['sass', 'compress', 'rename', 'copy:nw']);
};