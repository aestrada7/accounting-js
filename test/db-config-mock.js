dbStartUp = function(notificationService, translateService, confirmService) {
  //Import-Export
  exportDB = function(filename) {
    notificationService.show('components.import-export.export-success', 'success', 'top right');
    $('#file-export-dialog').val('');
  }

  importDB = function(filename) {
    window.location.href += '?imported';
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
      $('.loading').show();
    });
  }

  checkIfFileImported = function() {
    if(window.location.href.indexOf('?imported') !== -1) {
      notificationService.show('components.import-export.import-success', 'success', 'top right', '', false);
      window.location.href = window.location.href.split('?imported').join('');
    }
  }

  hasDefaultData = function() {
    buildDefaultData();
  }

  buildDefaultData = function() {
    buildFTUEList();
  }

  buildFTUEList = function() {}

  checkIfFileImported();
  hasDefaultData();

  $('#file-export-dialog').on('change', function() {
    var exportPath = $('#file-export-dialog').val();
    if(exportPath) {
      exportDB(exportPath);
    }
  });

  $('#file-import-dialog').on('change', function() {
    var importPath = $('#file-import-dialog').val();
    if(importPath) {
      importDB(importPath);
    }
  });

  $('body').on('new-clicked', function() {
    newDB();
  });
}