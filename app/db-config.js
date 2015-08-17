var Datastore = require('nedb');
var path = require('path');
var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require('fs');
var rimraf = require('rimraf');
var ncp = require('ncp').ncp;

//Schema
//var playground = new Datastore({ filename: path.join(gui.App.dataPath, 'data/playground.db'), autoload: true });
var playgroundDB = new Datastore({ filename: 'data/playground.db', autoload: true });

dbStartUp = function(notificationService) {
  //Import-Export
  var fileStream = require('fstream');
  var tar = require('tar');
  var zlib = require('zlib');
  exportDB = function(filename) {
    fileStream.Reader('data').pipe(tar.Pack()).pipe(zlib.Gzip()).pipe(fileStream.Writer(filename)).on('close', function() {
      notificationService.show('components.import-export.export-success', 'success', 'top right');
    });
  }

  importDB = function(filename) {
    fs.createReadStream(filename).on('error', function(err) {
      notificationService.show('components.import-export.file-removed', 'alert', 'top right');
    }).pipe(zlib.Gunzip()).on('error', function(err) {
      notificationService.show('components.import-export.file-corrupted', 'alert', 'top right');
    }).pipe(tar.Extract({ path: 'temp' })).on('error', function(err) {
      notificationService.show('components.import-export.file-corrupted', 'alert', 'top right');
    }).on('end', function() {
      fs.exists('temp/data/playground.db', function(exists) {
        if(exists) {
          rimraf('data', function(er) {
            ncp('temp/data', 'data', function() {
              rimraf('temp', function(er) {
                notificationService.show('components.import-export.import-success', 'success', 'top right');
                win.reloadDev();
              });
            });
          });
        } else {
          rimraf('temp', function(er) {
            notificationService.show('components.import-export.file-corrupted', 'alert', 'top right');
          });
        }
      });
    });
  }

  $('#file-export-dialog').on('change', function() {
    var exportPath = $('#file-export-dialog').val();
    if(exportPath) exportDB(exportPath);
  });

  $('#file-import-dialog').on('change', function() {
    var importPath = $('#file-import-dialog').val();
    if(importPath) importDB(importPath);
  });
}