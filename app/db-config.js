var Datastore = require('nedb');
var path = require('path');
var gui = require('nw.gui');

//Schema
//var playground = new Datastore({ filename: path.join(gui.App.dataPath, 'data/playground.db'), autoload: true });
var playgroundDB = new Datastore({ filename: 'data/playground.db', autoload: true });

//Import-Export
var fileStream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');
exportDB = function(filename) {
	fileStream.Reader('data').pipe(tar.Pack()).pipe(zlib.Gzip()).pipe(fileStream.Writer('data/' + filename));
}

importDB = function() {

}