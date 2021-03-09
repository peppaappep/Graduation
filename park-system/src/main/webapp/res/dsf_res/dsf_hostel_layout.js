//排宿舍的配置
(function (dsf) {
  dsf.hostelOption = {
    // "useTypes": [
    //   { text: "发布宿舍", "value": "setHostel" },
    //   { text: "人员入住", "value": "setPerson" },
    // ],

    /**
     *接口配置说明，每一个接口都具有以下属性
     * url  [Function|String]  请求的url
     * params  [Function|Object]  请求的参数
     * resultBabel  [Object]  接口返回数据别名 map映射
     * staticResult  [Function|Object]  静态数据，不会再去请求后端接口 url、params失效
     * loading [Boolean] 调起接口时是否显示loading UI，默认false
     **/


    //基本配置, 无论是发布宿舍还是人员入住都会加载default里面的配置
    default: {
      //班级Id 表明用哪一个url 参数字段
      classId: "classId",

      queryByClassId: {
        url: function () {
          return "/teas/zsgl/room/reserve/findClassInfo";
        },
        //查询参数
        params: function () {
          return {
            id: "classId"
          };
        },
        //别名转换，用于转换此接口返回的参数名
        resultBabel: {
          className: "className",
          totalPerson: "studentNum",
          startTime: "startDate",
          endTime: "endDate"
        },
      },

      //宿舍楼查询
      dormitoryList: {
        label: "宿舍楼号",
        //获取宿舍楼接口
        url: "/teas/zsgl/room/reserve/findBuildingInfo",
        //查询参数
        params: {
          id: "classId"
        },
        //别名转换，用于转换此接口返回的参数名
        resultBabel: {
          id: "buildingId",
          dormName: "buildingName",
        },
        //展示形式
        //list: 左侧列表(暂不支持),
        //nav: 顶部的导航栏
        model: "nav",
      },

      //房间类型查询配置
      roomList: {
        label: "房间类型",
        url: function () {
          return "/dict/getList/5dc632232fc6440b89c2ef5050e8e05d"
        },
        resultBabel: {
          roomName: "text",
          id: "value"
        },
      },
    },

    //发布可用宿舍页面的配置
    "setHostel": {
      title: "宿舍分配",
      //房间分布查询配置
      roomStatus: {
        url: "/teas/zsgl/room/reserve/findRoomList",
        loading: true,
        //配置查询参数, data为前端传递出来的queryData
        params: {
          startTime: "startDate",
          endTime: "endDate",
          currentClassId: "classId",
          roomId: "roomType",
          dormId: "buildingId"
        },
        resultBabel:{
          level: "_level",
          floorName: "floorName",
          children: {
            __name: "children",
            "roomType": "roomTypeValue",
            "roomTypeText": "roomTypeText",
            "occupyStartTime": "occupyDateSDate",
            "roomNum": "roomNum",
            "status": "statusValue",
            "statusText": "statusText",
            "occupyEndTime": "occupyDateEDate",
            "level": "_level",
            "roomId": "roomId"
          }
        }
      },

      //分配房间接口配置
      /**
       * contentType 定义ajax 的contentType 只有POST请求有效
       * json|formData 默认 formData
       * */
      publish: {
        url: function () {
          return "/teas/zsgl/room/reserve/saveReserve"
        },
        contentType: "json",
        params: function () {
          return {
            businessId: "businessId",
            businessName: "businessName",
            startTime: "startDate",
            endTime: "endDate",
            roomIdList: "roomIds"
          };
        },
      },

      //清除预留房间
      restore: {
        url: "/teas/zsgl/room/reserve/cancelReserve",
        params: {
          businessId: "businessId"
        }
      }
    },

    //人员入住页面的配置
    "setPerson": {
      title: "人员入住",

      //左侧人员列表配置
      personList: {
        url: function () {
          return "/teas/api/zsgl/ssap/person/list";
        },
        // data为前端传递出来的queryData
        params: {
          classId: "classId"
        },
        resultBabel: {
          className: "className",
          personList: {
            __name: "persons",
            personName: "personName",
            id: "personId",
            sex: "sexValue",
            sexText: "sexText",
            picture: "picture",
            studentNum: "stuNo",
            roomId: "roomId"
          },
        },
      },

      //自动排座的配置
      autoSort: {
        url: "/teas/api/zsgl/ssap/auto/assign",
        contentType: "json",
        params: {
          personIds: "personIds",
          roomIds: "roomIds",
          reserveId: "reserveId",
          classId: "classId"
        },
      },

      clearAllSeatInfo: {
        url: "/teas/api/zsgl/ssap/clear/assign",
        params: {
          //classId: "classId",
          reserveId: "reserveId"
        },
      },

      //保存数据配置
      save: {
        //保存时的提交地址
        url: "/teas/api/zsgl/ssap/assign/person",
        loading: true,
      },

      //已入住人员查询配置
      querySeated: {
        url: "/teas/api/zsgl/ssap/building/list",
        loading: true,
        //调用加载接口的提交参数
        params:  {
          classId: "classId",
          buildingId: "buildingId",
          reserveId: "reserveId",
          roomType: "roomType",
        },
        resultBabel: {
          buildingName: "buildingName",
          reserveInfo: {
            __name: "reserveDateDtos",
            reserveId: "reserveId",
            className: "className",
            startTime: "sdate",
            endTime: "edate"
          },
          floorList:{
            __name: "floors",
            floorName: "floorName",
            roomList:{
              __name: "roomBoxes",
              roomId: "roomId",
              occupyId: "occupyId",
              roomType: "roomTypeValue",
              roomTypeText: "roomTypeText",
              roomNum: "roomNum",
              status: "statusValue",
              statusText: "statusText",
              personList: {
                __name: "persons",
                personId: "personId",
                personName: "personName",
                stuNum: "stuNo",
                sex: "sexValue",
                sexText: "sexText",
                picture: "picture",
                roomId: "roomId"
              }
            }
          }
        }
      },

      //单个人员退房
      cancelOneSeated: {
        url: "teas/api/zsgl/ssap/delete/person",
        params: {
          personId: "personId",
          occupyId: "occupyId"
        }
      }
    }
  }
})(dsf)