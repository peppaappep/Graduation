!(function() {
  //加载布局
  var layoutData = window._layout;
  var relyFiles = window._relyLibs || [];

  var files = [];
  dsf.config.files.forEach(function(f) {
    files.push(f);
  });
  if (layoutData.$useControlsGroup) {
    for (var i = 0; i < layoutData.$useControlsGroup.length; i++) {
      var ctrl = layoutData.$useControlsGroup[i];
      var code = ctrl.code;
      for (var k in dsf.JSRely) {
        if (code.indexOf(k) == 0) {
          var index = _.findIndex(files, function(o) {
            return o == dsf.JSRely[k];
          });
          if (index < 0) {
            files.push(dsf.JSRely[k]);
          }
        }
      }
    }
  }

  // files.forEach(function(f) {
  //     var src = dsf.url.getWebPath(f);
  //     document.write("<script src='" + src + "'></script>");
  // })
  var page = new dsf.Controls[layoutData.ctrl_type]();
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
    dsf.Import(relyFiles, function() {
      if (layoutData) {
        if( layoutData.$title.indexOf('@')){
          let exp = dsf.Express;
          var title='';
          if (!$.isEmptyObject(exp.config("options"))) {
            title = exp.replace(layoutData.$title, exp.config("options"));
          }else{
            title = dsf.Express.replace(layoutData.$title);
          }
        }
        document.title = page.$title = title;
        if (dsf.url.queryString("isview") == "1") {
          page._isView = true;
        }
        dsf.Controls.Page.loadLayout(page, layoutData);
        if (dsf.url.queryString("isview") == "1") {
          page.resize();
        }
      } else {
        page.render();
      }
      // console.timeEnd("加载页面");
    });
  }
})();
