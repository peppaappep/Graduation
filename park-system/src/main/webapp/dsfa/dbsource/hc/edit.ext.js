! function() {
    page.event.on("loaded", function(args) {
        //页面初始化完成


        //刷新页面执行事件
        page.getControl('ButtonBar3').event.on('buttonbar_click', function(data) {
            if (data.actionName == "refresh") {

                var param = {
                    rmId: dsf.url.queryString('id'),
                    sql: page.getControl('sql').value,
                    sqlParam: page.getControl('replaceparams').value

                };
                console.log(param);

                var url = dsf.url.getWebPath('dbsource/columnInfo');

                var oldData = page.getControl('meta').value.slice(0);



                dsf.http.request(url, param, 'GET')
                    .done(function(response) {
                        if (response.success) {
                            page.getControl('meta').value = [];
                            var dataAll = response.data;
                            console.log(dataAll);
                            var pageDataInfo = page.getControl('meta').value;
                            console.log(pageDataInfo);
                            for (var i = 0; i < dataAll.length; i++) {
                                for (var od = 0; od < oldData.length; od++) {
                                    console.log('替换别名');
                                    if (dataAll[i].colname == oldData[od]['dsfa_dbsource_meta.colname']) {
                                        //替换别名
                                        console.log('替换' + dataAll[i].colname + '的别名');
                                        dataAll[i].name = oldData[od]['dsfa_dbsource_meta.name'];
                                    }
                                }
                                var obj = {};
                                obj['dsfa_dbsource_meta.colname'] = dataAll[i].colname;
                                obj['dsfa_dbsource_meta.name'] = dataAll[i].name;
                                obj['dsfa_dbsource_meta.type'] = dataAll[i].type;
                                page.getControl('meta').value.push(obj);



                                /*if(dataAll[i].dsfa_dbsource_meta_id){
                                    //更新

                                    for(var k = 0; k <pageDataInfo.length; k++){
                                        if(dataAll[i].colname == pageDataInfo[k]['dsfa_dbsource_meta.colname']){
                                            console.log(dataAll[i]);
                                            page.getControl('meta').value[k]['dsfa_dbsource_meta.colname'] = dataAll[i].colname;
                                            page.getControl('meta').value[k]['dsfa_dbsource_meta.name'] = dataAll[i].name;
                                            page.getControl('meta').value[k]['dsfa_dbsource_meta.type'] = dataAll[i].type;
                                        }
                                    }

                                }else{

                                    //新增
                                    var obj = {};
                                    obj['dsfa_dbsource_meta.colname'] = dataAll[i].colname;
                                    obj['dsfa_dbsource_meta.name'] = dataAll[i].name;
                                    obj['dsfa_dbsource_meta.type'] = dataAll[i].type;
                                    page.getControl('meta').value.push(obj);
                                }*/
                            }
                            page.getControl('meta').reload();

                        } else {
                            dsf.layer.message('获取数据失败', false)
                        };
                    })
                    .error(function(response) {
                        dsf.layer.message('获取数据失败', false)
                    }).exec();


            }








        });




        /*page.event.on('save_before',function (data) {

        })*/





    });

}();