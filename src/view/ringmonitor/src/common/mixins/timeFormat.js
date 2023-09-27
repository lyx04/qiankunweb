export default {
  methods: {
    getDataArray(startDate, endDate, space) {
      if (!endDate) {
        endDate = new Date();
      } else {
        endDate = new Date(endDate);
      }
      if (!startDate) {
        startDate = new Date(new Date().getTime - 1 * 60 * 60 * 1000);
      } else {
        startDate = new Date(startDate);
      }
      console.log(startDate, endDate, space);
      if (!space) {
        space = 30 * 60 * 100;
      } else {
        space = space * 60 * 1000;
      }
      var endTime = endDate.getTime();
      var startTime = startDate.getTime();
      var mod = endTime - startTime;
      if (mod <= space) {
        return;
      }
      var dateArray = [];
      while (mod >= space) {
        var d = new Date();
        d.setTime(startTime + space);
        dateArray.push(d);
        mod = mod - space;
        startTime = startTime + space;
      }
      // var end = endDate.getTime();
      var start = startDate.getTime();
      dateArray.unshift(new Date(start));
      return dateArray.sort((a, b) => {
        return Date.parse(b) - Date.parse(a);
      });
    },
    getDateDifference(startDate, endDate, space) {
      if (!endDate) {
        endDate = new Date();
      } else {
        endDate = new Date(endDate);
      }
      if (!startDate) {
        startDate = new Date(new Date().getTime - 1 * 60 * 60 * 1000);
      } else {
        startDate = new Date(startDate);
      }
      if (!space) {
        space = 30 * 24 * 60 * 60 * 1000;
      } else {
        space = space * 24 * 60 * 60 * 1000;
      }
      var endTime = endDate.getTime();
      var startTime = startDate.getTime();
      var mod = endTime - startTime;
      if (mod < 0) {
        return "开始时间不能大于结束时间";
      } else {
        if (mod > space) {
          return true;
        } else {
          return false;
        }
      }
    },
    spliceZero(i) {
      if (i.toString().length == 1) {
        i = "0" + i;
      }
      return i;
    },
    timeFormat(dt, type) {
      var year = this.spliceZero(dt.getFullYear());
      var month = this.spliceZero(dt.getMonth() + 1);
      var day = this.spliceZero(dt.getDate());
      var hours = this.spliceZero(dt.getHours());
      var mins = this.spliceZero(dt.getMinutes());
      var secs = this.spliceZero(dt.getSeconds());
      var date = "";
      switch (type) {
        case "yyyy":
          date = year;
          break;
        case "yyyy-MM":
          date = year + "-" + month;
          break;
        case "yyyy-MM-dd":
          date = year + "-" + month + "-" + day;
          break;
        case "yyyy-MM-dd HH:mm:ss":
          date =
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hours +
            ":" +
            mins +
            ":" +
            secs;
          break;
        default:
          date =
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hours +
            ":" +
            mins +
            ":" +
            secs;
      }
      return date;
    },
    getTimeFormat(startDate, endDate, space, type, pop) {
      var result;
      var arrayDate = [];
      if (!startDate) {
        result = this.getDataArray();
      } else {
        result = this.getDataArray(startDate, endDate, space);
      }
      for (var i = result.length - 1; i >= 0; i--) {
        var textnode = this.timeFormat(result[i], type);
        arrayDate.push(textnode);
      }
      if (!pop) {
        arrayDate[0] = arrayDate[0].replace("00:00:00", "24:00:00");
        arrayDate.pop();
        arrayDate.sort((a, b) => {
          return Date.parse(a) - Date.parse(b);
        });
      }
      return arrayDate;
    },
    getLastDay(time) {
      if (time) {
        var createTime = time.substring(0, 19);
        createTime = createTime.replace(/-/g, "/"); // 必须把日期'-'转为'/'
        var timestamp = new Date(createTime).getTime();
        var today = new Date(); //将字符串转化为时间
        today.setTime(timestamp);
        var month = today.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = new Date(today.getFullYear(), month, 0).getDate();
        return day;
      }
    }
  }
};
