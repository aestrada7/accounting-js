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
      if(this.enabled) $('body').trigger('new-clicked');
    },
    key: 'n',
    modifiers: 'ctrl'
  }));

  fileMenu.append(new gui.MenuItem({
    label: translateService.translate('features.organization.title'),
    click: function() {
      if(this.enabled) $('#organization-link').click();
    },
    key: 'd',
    modifiers: 'ctrl'
  }));

  fileMenu.append(new gui.MenuItem({
    label: translateService.translate('global.export'),
    click: function() {
      if(this.enabled) $('#file-export-dialog').click();
    },
    key: 's',
    modifiers: 'ctrl'
  }));

  fileMenu.append(new gui.MenuItem({
    label: translateService.translate('global.import'),
    click: function() {
      if(this.enabled) $('#file-import-dialog').click();
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
    modifiers: 'ctrl',
    icon: true
  }));

  menu.append(new gui.MenuItem({
    label: translateService.translate('global.file'),
    submenu: fileMenu,
    icon: true
  }));

  //Tools menu
  var toolMenu = new gui.Menu();

  toolMenu.append(new gui.MenuItem({
    label: translateService.translate($('#home-link').html()),
    click: function() {
      if(this.enabled) $('#home-link').click();
    },
    key: 'h',
    modifiers: 'ctrl+alt'
  }));

  toolMenu.append(new gui.MenuItem({
    label: translateService.translate($('#catalogs-link').html()),
    click: function() {
      if(this.enabled) $('#catalogs-link').click();
    },
    key: 'c',
    modifiers: 'ctrl+alt'
  }));

  toolMenu.append(new gui.MenuItem({
    label: translateService.translate($('#vouchers-link').html()),
    click: function() {
      if(this.enabled) $('#vouchers-link').click();
    },
    key: 'p',
    modifiers: 'ctrl+alt'
  }));

  toolMenu.append(new gui.MenuItem({
    label: translateService.translate($('#about-link').html()),
    click: function() {
      if(this.enabled) $('#about-link').click();
    },
    key: 'a',
    modifiers: 'ctrl+alt'
  }));

  toolMenu.append(new gui.MenuItem({
    label: translateService.translate($('#playground-link').html()),
    click: function() {
      if(this.enabled) $('#playground-link').click();
    },
    key: 'p',
    modifiers: 'ctrl+alt'
  }));

  menu.append(new gui.MenuItem({
    label: translateService.translate('global.tools'),
    submenu: toolMenu
  }));

  //Reports menu
  var reportMenu = new gui.Menu();

  reportMenu.append(new gui.MenuItem({
    label: translateService.translate($('#account-balance-link').html()),
    click: function() {
      if(this.enabled) $('#account-balance-link').click();
    },
    key: 'r',
    modifiers: 'ctrl+alt'
  }));

  menu.append(new gui.MenuItem({
    label: translateService.translate('global.reports'),
    submenu: reportMenu
  }));

  //Dev menu
  var devMenu = new gui.Menu();
  devMenu.append(new gui.MenuItem({
    label: 'Refresh',
    click: function() {
      win.reloadDev();
    },
    key: 'f5',
    icon: true
  }));

  devMenu.append(new gui.MenuItem({
    label: 'Dev Tools',
    click: function() {
      win.showDevTools();
    },
    key: 'f12',
    icon: true
  }));

  devMenu.append(new gui.MenuItem({
    label: 'Dev Guide',
    click: function() {
      if(this.enabled) $('#dev-link').click();
    },
    key: 'i',
    modifiers: 'ctrl+alt'
  }));

  menu.append(new gui.MenuItem({
    label: 'Dev',
    submenu: devMenu,
    icon: true
  }));

  win.menu = menu;
  $('.loading').fadeOut(200);

  //alt menus
  var localeValue = 'en';
  var navigatorLanguage = window.navigator.language;

  if(navigatorLanguage != 'en' && navigatorLanguage != 'en-us') {
    localeValue = navigatorLanguage;
  }

  var fileMenuKey = 70; //f
  var toolsMenuKey = 84; //t
  var devMenuKey = 68; //d
  var reportsMenuKey = 82; //r
  var menuKey = 77; //m

  if(localeValue === 'es') {
    fileMenuKey = 65; //a
    toolsMenuKey = 72; //h
    devMenuKey = 68; //d
  }

  $(document).on('keydown', function(event) {
    if(event.altKey && event.keyCode == menuKey) {
      win.menu.popup(0, 0);
    }
    if(event.altKey && event.keyCode == fileMenuKey) {
      win.menu.items[0].submenu.popup(0, 0);
    }
    if(event.altKey && event.keyCode == toolsMenuKey) {
      win.menu.items[1].submenu.popup(0, 0);
    }
    if(event.altKey && event.keyCode == reportsMenuKey) {
      win.menu.items[2].submenu.popup(0, 0);
    }
    if(event.altKey && event.keyCode == devMenuKey) {
      win.menu.items[3].submenu.popup(0, 0);
    }
  });
}

setMenuBarEnabled = function(isEnabled) {
  var menuItems = win.menu.items;
  var subMenuItems = [];
  for(var i in menuItems) {
    if(!menuItems[i].icon) menuItems[i].enabled = isEnabled;
    subMenuItems = menuItems[i].submenu.items;
    for(var k in subMenuItems) {
      if(!subMenuItems[k].icon) subMenuItems[k].enabled = isEnabled;
    }
  }
}