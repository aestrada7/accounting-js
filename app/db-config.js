var Datastore = require('nedb');
var path = require('path');
var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require('fs');
var rimraf = require('rimraf');
var ncp = require('ncp').ncp;

//Schema
var playgroundDB = new Datastore({ filename: 'data/playground.db', autoload: true });
var organizationDB = new Datastore({ filename: 'data/organization.db', autoload: true });
var accountsDB = new Datastore({ filename: 'data/accounts.db', autoload: true });
var vouchersDB = new Datastore({ filename: 'data/vouchers.db', autoload: true });
var voucherEntriesDB = new Datastore({ filename: 'data/voucherEntries.db', autoload: true });
var ftuesDB = new Datastore({ filename: 'data/ftues.db', autoload: true });

//Unique fields
accountsDB.ensureIndex({ fieldName: 'key', unique: true });
accountsDB.ensureIndex({ fieldName: 'name', unique: true });
vouchersDB.ensureIndex({ fieldName: 'key', unique: true });

//Preloaded records
var preloaded = {
  accounts: [
    { '_id': 1, 'parentId': 0, 'key': '1000', 'level': 1, 'name': 'features.accounts.active-assets.name', 'inverted': false, 'blocked': true },
    { '_id': 2, 'parentId': 0, 'key': '2000', 'level': 1, 'name': 'features.accounts.passive-assets.name', 'inverted': false, 'blocked': true },
    { '_id': 3, 'parentId': 1, 'key': '1100', 'level': 2, 'name': 'features.accounts.active-assets.floating-assets', 'inverted': false },
    { '_id': 4, 'parentId': 3, 'key': '1101', 'level': 3, 'name': 'features.accounts.active-assets.cash', 'inverted': false },
    { '_id': 5, 'parentId': 3, 'key': '1102', 'level': 3, 'name': 'features.accounts.active-assets.banks', 'inverted': false },
    { '_id': 6, 'parentId': 3, 'key': '1103', 'level': 3, 'name': 'features.accounts.active-assets.investments', 'inverted': false },
    { '_id': 7, 'parentId': 3, 'key': '1104', 'level': 3, 'name': 'features.accounts.active-assets.clients', 'inverted': false },
    { '_id': 8, 'parentId': 3, 'key': '1105', 'level': 3, 'name': 'features.accounts.active-assets.various-debtors', 'inverted': false },
    { '_id': 9, 'parentId': 1, 'key': '1200', 'level': 2, 'name': 'features.accounts.active-assets.properties', 'inverted': false },
    { '_id': 10, 'parentId': 9, 'key': '1201', 'level': 3, 'name': 'features.accounts.active-assets.terrains', 'inverted': false },
    { '_id': 11, 'parentId': 9, 'key': '1202', 'level': 3, 'name': 'features.accounts.active-assets.buildings', 'inverted': false },
    { '_id': 12, 'parentId': 9, 'key': '1203', 'level': 3, 'name': 'features.accounts.active-assets.building-depreciation', 'inverted': false },
    { '_id': 13, 'parentId': 9, 'key': '1204', 'level': 3, 'name': 'features.accounts.active-assets.machinery', 'inverted': false },
    { '_id': 14, 'parentId': 1, 'key': '1300', 'level': 2, 'name': 'features.accounts.active-assets.deferred', 'inverted': false },
    { '_id': 15, 'parentId': 2, 'key': '2100', 'level': 2, 'name': 'features.accounts.passive-assets.short-term', 'inverted': false },
    { '_id': 16, 'parentId': 2, 'key': '2200', 'level': 2, 'name': 'features.accounts.passive-assets.long-term', 'inverted': false },
    { '_id': 17, 'parentId': 15, 'key': '2101', 'level': 3, 'name': 'features.accounts.passive-assets.suppliers', 'inverted': false },
    { '_id': 18, 'parentId': 15, 'key': '2102', 'level': 3, 'name': 'features.accounts.passive-assets.sundry-creditors', 'inverted': false },
    { '_id': 19, 'parentId': 16, 'key': '2201', 'level': 3, 'name': 'features.accounts.passive-assets.long-term-to-pay', 'inverted': false },
    { '_id': 20, 'parentId': 16, 'key': '2202', 'level': 3, 'name': 'features.accounts.passive-assets.mortgages', 'inverted': false },
    { '_id': 21, 'parentId': 3, 'key': '1106', 'level': 3, 'name': 'features.accounts.active-assets.notes-receivable', 'inverted': false },
    { '_id': 22, 'parentId': 3, 'key': '1107', 'level': 3, 'name': 'features.accounts.active-assets.warehouse', 'inverted': false },
    { '_id': 23, 'parentId': 3, 'key': '1108', 'level': 3, 'name': 'features.accounts.active-assets.advances-to-suppliers', 'inverted': false },
    { '_id': 24, 'parentId': 3, 'key': '1109', 'level': 3, 'name': 'features.accounts.active-assets.creditable-taxes', 'inverted': false },
    { '_id': 25, 'parentId': 9, 'key': '1205', 'level': 3, 'name': 'features.accounts.active-assets.machinery-depreciation', 'inverted': false },
    { '_id': 26, 'parentId': 9, 'key': '1206', 'level': 3, 'name': 'features.accounts.active-assets.transport-equipment', 'inverted': false },
    { '_id': 27, 'parentId': 9, 'key': '1207', 'level': 3, 'name': 'features.accounts.active-assets.transport-equipment-depreciation', 'inverted': false },
    { '_id': 28, 'parentId': 9, 'key': '1208', 'level': 3, 'name': 'features.accounts.active-assets.computer-equipment', 'inverted': false },
    { '_id': 29, 'parentId': 9, 'key': '1209', 'level': 3, 'name': 'features.accounts.active-assets.computer-equipment-depreciation', 'inverted': false },
    { '_id': 30, 'parentId': 9, 'key': '1210', 'level': 3, 'name': 'features.accounts.active-assets.office-furniture', 'inverted': false },
    { '_id': 31, 'parentId': 9, 'key': '1211', 'level': 3, 'name': 'features.accounts.active-assets.office-furniture-depreciation', 'inverted': false },
    { '_id': 32, 'parentId': 15, 'key': '2103', 'level': 3, 'name': 'features.accounts.passive-assets.notes-to-pay', 'inverted': false },
    { '_id': 33, 'parentId': 15, 'key': '2104', 'level': 3, 'name': 'features.accounts.passive-assets.taxes-to-pay', 'inverted': false },
    { '_id': 34, 'parentId': 15, 'key': '2105', 'level': 3, 'name': 'features.accounts.passive-assets.salaries-to-pay', 'inverted': false },
    { '_id': 35, 'parentId': 15, 'key': '2106', 'level': 3, 'name': 'features.accounts.passive-assets.profit-sharing-to-pay', 'inverted': false },
    { '_id': 36, 'parentId': 15, 'key': '2107', 'level': 3, 'name': 'features.accounts.passive-assets.transferred-taxes', 'inverted': false },
    { '_id': 37, 'parentId': 0, 'key': '3000', 'level': 1, 'name': 'features.accounts.stockholders-equity.name', 'inverted': false, 'blocked': true },
    { '_id': 38, 'parentId': 37, 'key': '3100', 'level': 2, 'name': 'features.accounts.stockholders-equity.contributed-capital', 'inverted': false },
    { '_id': 39, 'parentId': 38, 'key': '3101', 'level': 3, 'name': 'features.accounts.stockholders-equity.social-capital', 'inverted': false },
    { '_id': 40, 'parentId': 38, 'key': '3102', 'level': 3, 'name': 'features.accounts.stockholders-equity.future-increases-contributions', 'inverted': false },
    { '_id': 41, 'parentId': 37, 'key': '3200', 'level': 2, 'name': 'features.accounts.stockholders-equity.earned-capital', 'inverted': false },
    { '_id': 42, 'parentId': 41, 'key': '3201', 'level': 3, 'name': 'features.accounts.stockholders-equity.retained-earnings', 'inverted': false },
    { '_id': 43, 'parentId': 41, 'key': '3202', 'level': 3, 'name': 'features.accounts.stockholders-equity.net-income', 'inverted': false },
    { '_id': 44, 'parentId': 41, 'key': '3203', 'level': 3, 'name': 'features.accounts.stockholders-equity.legal-reserve', 'inverted': false }
  ],
  ftues: [
    { '_id': 1, 'key': 'voucher-order', 'displayed': false },
    { '_id': 2, 'key': 'voucher-click-to-edit', 'displayed': false },
    { '_id': 3, 'key': 'menu-shortcuts', 'displayed': false },
    { '_id': 4, 'key': 'dashboard-items', 'displayed': false }
  ]
};

dbStartUp = function(notificationService, translateService, confirmService) {
  //Import-Export
  var fileStream = require('fstream');
  var tar = require('tar');
  var zlib = require('zlib');

  exportDB = function(filename) {
    fileStream.Reader('data').pipe(tar.Pack()).pipe(zlib.Gzip()).pipe(fileStream.Writer(filename)).on('close', function() {
      notificationService.show('components.import-export.export-success', 'success', 'top right');
    });
    $('#file-export-dialog').val('');
  }

  importDB = function(filename) {
    fs.createReadStream(filename).on('error', function(err) {
      notificationService.show('components.import-export.file-removed', 'alert', 'top right', '', true);
    }).pipe(zlib.Gunzip()).on('error', function(err) {
      notificationService.show('components.import-export.file-corrupted', 'alert', 'top right', '', true);
    }).pipe(tar.Extract({ path: 'temp' })).on('error', function(err) {
      notificationService.show('components.import-export.file-corrupted', 'alert', 'top right', '', true);
    }).on('end', function() {
      fs.exists('temp/data/playground.db', function(exists) {
        if(exists) {
          rimraf('data', function(er) {
            $('.loading').show();
            ncp('temp/data', 'data', function() {
              rimraf('temp', function(er) {
                window.location.href += '?imported';
                win.reloadDev();
              });
            });
          });
        } else {
          rimraf('temp', function(er) {
            notificationService.show('components.import-export.file-corrupted', 'alert', 'top right', '', true);
          });
        }
      });
    });
    $('#file-import-dialog').val('');
  }

  newDB = function() {
    var confirmOptions = {
      label: 'components.import-export.confirm-overwrite',
      icon: 'fi-trash',
      kind: 'warning',
      cancelLabel: 'global.cancel',
      confirmLabel: 'global.ok'
    }

    confirmService.show(confirmOptions).then(function(result) {
      fs.exists('data/playground.db', function(exists) {
        if(exists) {
          rimraf('data', function(er) {
            $('.loading').show();
            buildDefaultData();
            win.reloadDev();
          });
        }
      });
    });
  }

  checkIfFileImported = function() {
    if(window.location.href.indexOf('?imported') !== -1) {
      notificationService.show('components.import-export.import-success', 'success', 'top right', '', false);
      window.location.href = window.location.href.split('?imported').join('');
    }
  }

  hasDefaultData = function() {
    fs.readFile('data/accounts.db', 'utf8', function(err, data) {
      if(err) {
        buildDefaultData();
      } else {
        if(data === '') {
          buildDefaultData();
        }
      }
    });
    fs.readFile('data/ftues.db', 'utf8', function(err, data) {
      if(err) {
        buildFTUEList();
      }
    });
  }

  buildDefaultData = function() {
    for(var i = 0; i < preloaded.accounts.length; i++) {
      accountsDB.insert(preloaded.accounts[i]);
    }
    buildFTUEList();
  }

  buildFTUEList = function() {
    for(var i = 0; i < preloaded.ftues.length; i++) {
      ftuesDB.insert(preloaded.ftues[i]);
    }
  }

  checkIfFileImported();
  hasDefaultData();

  $('#file-export-dialog').on('change', function() {
    var exportPath = $('#file-export-dialog').val();
    if(exportPath) exportDB(exportPath);
  });

  $('#file-import-dialog').on('change', function() {
    var importPath = $('#file-import-dialog').val();
    if(importPath) importDB(importPath);
  });

  $('body').on('new-clicked', function() {
    newDB();
  });
}