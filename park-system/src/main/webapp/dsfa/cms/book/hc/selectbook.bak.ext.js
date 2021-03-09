!function () {
    page.event.on("loaded", function (args) {
        window.getCheckedData = function () {

            var list = page.getControl('selector').value;
            var data = list[0];
            var selectedData = {};

            selectedData['bookId'] = data.dsfa_cms_book_id; // 书籍ID
            selectedData['name'] = data._name;　　// 书籍名称
            selectedData['tag'] = data.gjc;     // 关键词
            selectedData['author'] = data.zz;   // 作者
            selectedData['source'] = data.ly;   // 来源
            selectedData['cover'] = data.fm;   // 书籍封面
            selectedData['order'] = data.ds_order;

            selectedData['columnId'] = dsf.url.queryString('lmid');
            selectedData['lmname'] = dsf.url.queryString('lmname');
            selectedData['wzsj_text'] =  dsf.url.queryString('wzsjtext');
            selectedData['wzsj_value'] =  dsf.url.queryString('wzsjvalue');

            return selectedData;
        }
    });

}();
