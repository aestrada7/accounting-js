var Datastore = require('nedb');
var path = require('path');
var gui = require('nw.gui');
var db = new Datastore({ filename: path.join(gui.App.dataPath, 'acc.db'), autoload: true });