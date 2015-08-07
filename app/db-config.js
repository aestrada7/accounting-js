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

//Import-Export
var fileStream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');
exportDB = function(filename) {
  fileStream.Reader('data').pipe(tar.Pack()).pipe(zlib.Gzip()).pipe(fileStream.Writer(filename)).on('close', function() {
    //alert('Exported OK!'');
    //This should show a notification. Probably from Foundation for Apps if this is changed.
  });
}

importDB = function(filename) {
  fs.createReadStream(filename).pipe(zlib.Gunzip()).pipe(tar.Extract({ path: 'temp' })).on('end', function() {
    fs.exists('temp/data/playground.db', function(exists) {
      if(exists) {
        rimraf('data', function(er) {
          ncp('temp/data', 'data', function() {
            rimraf('temp', function(er) {
              alert('Imported OK!');
              win.reloadDev();
              //This should show a notification. Probably from Foundation for Apps if this is changed.
            });
          });
        });
      } else {
        rimraf('temp', function(er) {
          alert('This file is corrupted');
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