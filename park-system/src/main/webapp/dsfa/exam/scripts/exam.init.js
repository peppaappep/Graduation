!(function() {
  window.onbeforeunload = function(e) {
    e = e || window.event;
    if (e) {
      e.returnValue = "确定离开当前页面吗?";
    }
    return "确定离开当前页面吗?";
  };

  document.oncontextmenu = function() {
    return false;
  };
  document.onkeydown = function() {
    if (event.ctrlKey) {
      return false;
    }
    if (event.altKey) {
      return false;
    }
    // if (event.shiftKey) {
    //   return false;
    // }
  };
  document.onmousedown = function(e) {
    if (e.which == 3) {
      return false;
    }
  };
  document.oncopy = function() {
    return false;
  };
  document.onpaste = function() {
    return false;
  };

  //加载布局
  // var layoutData = window._layout;
  // var relyFiles = window._relyLibs || [];
  var _tpl = window._tpl;
  var layoutData = _tpl;
  var relyFiles = window._relyLibs || [];
  var files = [];
  dsf.config.files.forEach(function(f) {
    files.push(f);
  });
  // if (layoutData.$useControlsGroup) {
  //     for (var i = 0; i < layoutData.$useControlsGroup.length; i++) {
  //         var ctrl = layoutData.$useControlsGroup[i];
  //         var code = ctrl.code;
  //         for (var k in dsf.JSRely) {
  //             if (code.indexOf(k) == 0) {
  //                 var index = _.findIndex(files, function(o) {
  //                     return o == dsf.JSRely[k];
  //                 });
  //                 if (index < 0) {
  //                     files.push(dsf.JSRely[k]);
  //                 }
  //             }
  //         }
  //     }
  // }

  var page = new dsf.Controls["ExamPage"]();
  page.parentElement = "#view";
  page._isDesign = false;
  window.page = page;

  $(document).ready(function() {
    window.setTimeout(function() {
      _appInit({
        loadFiles: function() {
          return files;
        },
        ready: function() {
          loadPage();
        },
      });
    }, 10);
  });

  function loadPage() {
    if (dsf.url.queryString("isview") == "1") {
      page._isView = true;
    }
    dsf.Import(relyFiles, function() {
      // console.time("加载页面");
      if (layoutData) {
        if (dsf.url.queryString("isview") == "1") {
          page._isView = true;
        }
        dsf.Controls.Page.loadLayout(page, layoutData);
        page.resize();
      } else {
        page.render();
      }
      // console.timeEnd("加载页面");
    });
  }
})();
