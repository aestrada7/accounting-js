locale = 'en'; //change this later on
translate = function(key) {
  return serializeKey(lang['lang'][locale], key);
}

serializeKey = function(obj, key) {
  var arr = key.split(".");
  for(var i = 0; i < arr.length; i++) {
    obj = obj[arr[i]];
  }
  return obj;
}

lang = {
  "lang": {
    "en": {
      "global": {
        "file": "File",
        "edit": "Edit",
        "delete": "Delete",
        "cancel": "Cancel",
        "ok": "Ok",
        "new": "New"
      },
      "features": {
        "main": {
          "title": "Main"
        },
        "playground": {
          "title": "Playground",
          "pageText": "Save and load data in here"
        },
        "about": {
          "title": "About",
          "subtitle": "About AccountingJS",
          "pageText": "Windows x64 app built using the following technologies"
        },
        "exit": {
          "title": "Exit"
        },
        "404": {
          "title": "Not Found",
          "pageText": "File not found"
        }
      }
    },
    "es": {
      "global": {
        "file": "Archivo",
        "edit": "Editar",
        "delete": "Eliminar",
        "cancel": "Cancelar",
        "ok": "Aceptar",
        "new": "Agregar"
      },
      "features": {
        "main": {
          "title": "Inicio"
        },
        "playground": {
          "title": "Sala de juego",
          "pageText": "Carga y guarda datos aquí"
        },
        "about": {
          "title": "Acerca de",
          "subtitle": "Acerca de AccountingJS",
          "pageText": "Aplicación Windows x64 creada utilizando las siguientes tecnologías"
        },
        "exit": {
          "title": "Salir"
        },
        "404": {
          "title": "No Encontrado",
          "pageText": "Archivo no encontrado"
        }
      }
    }
  }
}