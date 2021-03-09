var dsf;
(function(dsf) {
  if (!dsf.seatOptions) {
    dsf.seatOptions = {};
  }
  dsf.seatOptions = {
    // "useTypes": [
    //   { text: "教室", "value": "classroom" },
    //   { text: "会议室", "value": "meetingroom" },
    //   { text: "宿舍", "value": "dormplan" }
    // ],
    "default": {
      text: "",
      //左侧组织架构配置
      frame: {
        title: "人员架构",
        //获取组织架构接口
        url: function() {
          return "/dsfa/pd/tempdata/getframe.json?c=" + dsf.url.queryString('id');
        },
        params: function() {
          return {};
        },
        data: {
          id: "id",
          name: "name",
          type: "type",
          children: "children" //model为“tree"时有效
        },
        //展示形式
        //tree:属性结构，
        //list:列表,
        model: "tree",
        //tree配置当model为tree时有效
        tree: {
          //树结构初始化加载时默认展开层级
          openLevel: 4,
          //节点图标
          icon: "",
          showIcon: true
        },
        user: function() {
          return true;
        },
        //拖拽配置
        drag: {
          //允许拖动的节点表达式
          allow: function(item) {
            return true;
          }
        },
        //自动排座时人员排序方式
        sort: null
      },
      //保存数据配置
      save: {
        //保存时的提交地址
        url: "",
        //调用保存接口的提交参数
        params: function(data) {
          return {};
        }
      },
      //加载排座数据接口
      load: {
        //
        url: function() {
          return ""
        },
        //调用保存接口的提交参数
        params: function(data) {
          return {};
        }
      }
    },
    //排教室
    "classroom": {
      text: "排教室",
      frame: {
        model: "tree",
        //获取组织架构接口
        url: function() {
          return "/teas/jwgl/bjxygl/edit/findStudentByRleId";
        },
        params: function() {
          return {
            relId: dsf.url.queryString("relid")
          }
        },
        data: {
          id: "_id",
          name: "_name",
          type: "_level",
          children: "children" //model为“tree"时有效
        },
        tree: {
          icon: function(node) {
            var icon = ""
            switch (node.attrs._level) {
              case 1:
                icon = "icon-class.png";
                break;
              case 2:
                icon = "icon-branchid.png";
                break;
              case 3:
                icon = "icon-group.png";
                break;
              case 4:
                icon = "icon-studist.png";
                break;
              // default:
              //     icon="";
              //     break;
            }
            icon = icon ? "/res/dsf_styles/themes/img/tree_img/" + icon : "";
            return icon;
          }
        },
        user: function(data) {
          return data.attrs._level == 4;
        },
        drag: {
          //允许拖动的节点表达式
          allow: function(item) {
            return true;
          },
        },
        //人员排序方式
        sort: {
          size: ["400px", "400px"],
          items: [{
            "text": "职级",
            "field": "jb",
            "selectedValue": "asc",
            "options": [{ "text": "升序", "value": "asc" }, { "text": "降序", "value": "desc" }]
          },
            {
              "text": "性别",
              "field": "xb",
              "selectedValue": "",
              "options": [{ "text": "先男后女", "value": "asc" }, { "text": "先女后男", "value": "desc" }]
            },
            {
              "text": "学号",
              "field": "xh",
              "selectedValue": "",
              "options": [{ "text": "从小到大", "value": "asc" }, { "text": "从大到小", "value": "desc" }]
            }
          ]
        }
      },
      //保存数据配置
      save: {
        //保存时的提交地址
        url: "/dsfa/seat/person/seatPerson",
        //调用保存接口的提交参数
        params: function(data) {
          var seats = [];
          seats = _.map(data, function(item) {
            var obj = {
              'personId': item.user.userId,
              'personName': item.user.userName,
              'seatNumber': item.seatId,
              'statusText': item.seatState.text,
              'statusValue': item.seatState.value
            }
            return obj;
          })
          return {
            'relId': dsf.url.queryString("relid"),
            'seatId': dsf.url.queryString("id"),
            'seats': JSON.stringify(seats)
          }
        }
      },
      load: {
        url: "/dsfa/seat/person/findSeatPersonByRelId",
        //调用保存接口的提交参数
        params: function(data) {
          return {
            'relId': dsf.url.queryString("relid"),
            'seatId': dsf.url.queryString("id")
          };
        }
      }
    },
    //排会议
    "meetingroom": {
      text: "排会议室",
      frame: {
        //获取组织架构接口
        url: function() {
          return "/teas/conference/findConferencePersonById";
        },
        params: function() {
          return {
            id: dsf.url.queryString("relid")
          }
        },
        data: {
          id: "_id",
          name: "_name",
          type: "_level",
          children: "children" //model为“tree"时有效
        },
        tree: {
          icon: function(node) {
            var icon = "";
            switch (node.attrs._level) {
              case 1:
                icon = "icon-class.png";
                break;
              case 2:
                icon = "icon-branchid.png";
                break;
              case 3:
                icon = "icon-group.png";
                break;
              case 4:
                icon = "icon-studist.png";
                break;
              // default:
              //     icon="";
              //     break;
            }
            icon = icon ? "/res/dsf_styles/themes/img/tree_img/" + icon : "";
            return icon;
          }
        },
        drag: {
          //允许拖动的节点表达式
          allow: function(item) {
            return item.attrs.isPerson == "1";
          },
        },
        //自动排座时人员排序方式
        sort: {
          // width: "800px",
          // height: "600px",
          // //排序列表附加字段
          // items: [
          //     { 'attr': "xb_text", 'text': "性别" },
          //     { 'attr': "dwjzw", 'text': "职务" },
          //     { 'attr': "jb_text", 'text': "职级" }
          // ]
        }
      },
      //保存数据配置
      save: {
        //保存时的提交地址
        url: "/dsfa/seat/person/seatPerson",
        //调用保存接口的提交参数
        params: function(data) {
          var seats = [];
          seats = _.map(data, function(item) {
            var obj = {
              'personId': item.user.userId,
              'personName': item.user.userName,
              'seatNumber': item.seatId,
              'statusText': item.seatState.text,
              'statusValue': item.seatState.value
            }
            return obj;
          })
          return {
            'relId': dsf.url.queryString("relid"),
            'seatId': dsf.url.queryString("id"),
            'seats': JSON.stringify(seats)
          }
        }
      },
      load: {
        url: "/dsfa/seat/person/findSeatPersonByRelId",
        //调用保存接口的提交参数
        params: function(data) {
          return {
            'relId': dsf.url.queryString("relid"),
            'seatId': dsf.url.queryString("id")
          };
        }
      }
    },
    //排宿舍
    "dormplan": {
      text: "排宿舍",
      attachProps: {
        "roomNum": {
          caption: "宿舍号"
        }
      },
      frame: {
        //获取组织架构接口
        url: function() {
          return "/teas/jwgl/bjxygl/edit/findDormPersonListByBranchId";
        },
        params: function() {
          return {
            relId: dsf.url.queryString("relid"),
            seatId: dsf.url.queryString("id")
          }
        },
        data: {
          id: "_id",
          name: "_name",
          type: "_level",
          children: "children" //model为“tree"时有效
        },
        user: function(data) {
          return data.attrs._level == 3;
        },
        tree: {
          icon: function(node) {
            var icon = "";
            switch (node.attrs._level) {
              case 1:
                icon = "icon-class.png";
                break;
              case 2:
                icon = "icon-branchid.png";
                break;
              case 3:
                icon = "icon-group.png";
                break;
              case 4:
                icon = "icon-studist.png";
                break;
              // default:
              //     icon="";
              //     break;
            }
            icon = icon ? "/res/dsf_styles/themes/img/tree_img/" + icon : "";
            return icon;
          }
        },
        drag: {
          //允许拖动的节点表达式
          allow: function(item) {
            return item.attrs.isPerson == "1";
          },
        },
        //自动排座时人员排序方式
        sort: {
          size: ["400px", "400px"],
          items: [{
            "text": "年龄",
            "field": "age",
            "selectedValue":"",
            "options": [{ "text": "升序", "value": "ASC" }, { "text": "降序", "value": "DESC" }]
          },
            {
              "text": "性别",
              "field": "xb_value",
              "selectedValue":"",
              "options": [{ "text": "升序", "value": "ASC" }, { "text": "降序", "value": "DESC" }]
            },
            {
              "text": "地区",
              "field": "dwszdq_value",
              "selectedValue":"",
              "options": [{ "text": "合肥市外优先", "value": "ASC" }]
            }
          ]
        }
      },
      //保存数据配置
      save: {
        //保存时的提交地址
        url: "/dsfa/seat/person/seatPerson",
        //调用保存接口的提交参数
        params: function(data) {
          var seats = [];
          seats = _.map(data, function(item) {
            var obj = {
              'personId': item.user.userId,
              'personName': item.user.userName,
              'seatNumber': item.seatId,
              'statusText': item.seatState.text,
              'statusValue': item.seatState.value
            }
            return obj;
          })
          return {
            'relId': dsf.url.queryString("relid"),
            'seatId': dsf.url.queryString("id"),
            'seats': JSON.stringify(seats)
          }
        }
      },
      load: {
        url: "/teas/jwgl/ssgl/findDormPersonByRelId",
        //调用保存接口的提交参数
        params: function(data) {
          return {
            'relId': dsf.url.queryString("relid"),
            'seatId': dsf.url.queryString("id")
          };
        }
      }
    }
  }
  
})(dsf)