nwStartUp = function(translateService) {
  //nw.js toolbar
  var gui = require('nw.gui');
  var win = gui.Window.get();
  var menu = new gui.Menu({ type: 'menubar' });

  //File menu
  var fileMenu = new gui.Menu();

  fileMenu.append(new gui.MenuItem({
    label: translateService.translate('global.new'),
    click: function() {
    },
    key: 'n',
    modifiers: 'ctrl'
  }));

  fileMenu.append(new gui.MenuItem({
    label: translateService.translate('global.export'),
    click: function() {
      $('#file-export-dialog').click();
    },
    key: 's',
    modifiers: 'ctrl-shift'
  }));

  fileMenu.append(new gui.MenuItem({
    label: translateService.translate('global.import'),
    click: function() {
      $('#file-import-dialog').click();
    },
    key: 'o',
    modifiers: 'ctrl'
  }));

  fileMenu.append(new gui.MenuItem({
    label: translateService.translate($('#quit-link').html()),
    click: function() {
      gui.App.quit();
    },
    key: 'q',
    modifiers: 'ctrl'
  }));

  menu.append(new gui.MenuItem({
    label: translateService.translate('global.file'),
    submenu: fileMenu,
    key: 'f',
    modifiers: 'alt'
  }));

  //Tools menu
  var toolMenu = new gui.Menu();

  toolMenu.append(new gui.MenuItem({
    label: translateService.translate($('#home-link').html()),
    click: function() {
      $('#home-link').click();
      $('body').click();
    },
    key: 'h',
    modifiers: 'alt'
  }));

  toolMenu.append(new gui.MenuItem({
    label: translateService.translate($('#about-link').html()),
    click: function() {
      $('#about-link').click();
      $('body').click();
    },
    key: 'a',
    modifiers: 'alt'
  }));

  toolMenu.append(new gui.MenuItem({
    label: translateService.translate($('#playground-link').html()),
    click: function() {
      $('#playground-link').click();
      $('body').click();
    },
    key: 'p',
    modifiers: 'alt'
  }));

  menu.append(new gui.MenuItem({
    label: translateService.translate('global.tools'),
    submenu: toolMenu,
    key: 't',
    modifiers: 'alt'
  }));

  //Dev menu
  var devMenu = new gui.Menu();
  devMenu.append(new gui.MenuItem({
    label: 'Refresh',
    click: function() {
      win.reloadDev();
    },
    key: 'f5'
  }));

  devMenu.append(new gui.MenuItem({
    label: 'Dev Tools',
    click: function() {
      win.showDevTools();
    },
    key: 'f12'
  }));

  menu.append(new gui.MenuItem({
    label: 'Dev',
    submenu: devMenu,
    key: 'd',
    modifiers: 'alt'
  }));

  win.menu = menu;
}