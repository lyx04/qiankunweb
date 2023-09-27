<template>
  <div class="main-content">
    <div v-if="isShow" style="padding-bottom: 25px;">
      <el-form
        :model="request"
        ref="request"
        :inline="true"
        label-width="108px"
        class="filter-form"
      >
        <!--四角-->
        <div class="angle angle-left-top"></div>
        <div class="angle angle-left-bottom"></div>
        <div class="angle angle-right-top"></div>
        <div class="angle angle-right-bottom"></div>
        <el-row>
          <el-form-item label="时间周期:" prop="cycle">
            <el-radio-group v-model="request.cycle" @change="requestChange">
              <el-radio-button label="1">日</el-radio-button>
              <el-radio-button label="2">月</el-radio-button>
              <el-radio-button label="3">年</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="日期:" prop="day" v-show="request.cycle == 1">
            <el-date-picker
              v-model="request.day"
              :picker-options="pickerOptions"
              :clearable="false"
              :editable="false"
              type="date"
              align="right"
              value-format="yyyy-MM-dd"
              @change="requestChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="日期:" prop="month" v-show="request.cycle == 2">
            <el-date-picker
              v-model="request.month"
              :picker-options="pickerOptions"
              :clearable="false"
              :editable="false"
              type="month"
              align="right"
              value-format="yyyy-MM"
              @change="requestChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="日期:" prop="year" v-show="request.cycle == 3">
            <el-date-picker
              v-model="request.year"
              :picker-options="pickerOptions"
              :clearable="false"
              :editable="false"
              type="year"
              align="right"
              value-format="yyyy"
              @change="requestChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="viewQuery">查询</el-button>
            <el-button @click="addContrast">添加对比</el-button>
            <el-button @click="exportExcel">导出</el-button>
          </el-form-item>
        </el-row>
        <el-row v-if="measuresList.length > 0" style="padding: 0 36px;">
          <el-form-item prop="measures">
            <el-checkbox-group
              v-model="request.measures"
              @change="handleCheckedMeasuresChange"
            >
              <el-checkbox
                v-for="item in measuresList"
                :key="item.labels"
                :label="item.labels"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="table-tags">
        <div class="angle angle-left-top"></div>
        <div class="angle angle-left-bottom"></div>
        <div class="angle angle-right-top"></div>
        <div class="angle angle-right-bottom"></div>
        <!--  标签 -->
        <div class="main-tags">
          <el-tag
            v-for="tag in tagList"
            :key="tag.id"
            closable
            @close="handleClose(tag)"
          >
            {{ tag.name }}（{{ tag.date }}）
          </el-tag>
        </div>
        <!--表格-->
        <div class="h-table stripe-table">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            ref="tableRef"
            max-height="250"
          >
            <el-table-column
              type="index"
              align="center"
              width="50"
              label="序号"
              fixed
            >
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="设备"
              width="200"
              fixed
            >
            </el-table-column>
            <el-table-column
              prop="date"
              align="center"
              label="时间"
              width="160"
              fixed
            >
            </el-table-column>
            <el-table-column
              v-for="item in tableColumns"
              :prop="`${item.labels}_value`"
              :label="`${item.name}${item.unit}`"
              :key="item.labels"
              show-overflow-tooltip
              min-width="180"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row[`${item.labels}_value`] || "--" }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--chart-->
      <div
        class="table-tags"
        v-for="(item, index) in chartData"
        :key="item.labels"
      >
        <div class="angle angle-left-top"></div>
        <div class="angle angle-left-bottom"></div>
        <div class="angle angle-right-top"></div>
        <div class="angle angle-right-bottom"></div>
        <div style="">{{ item.labelName }}{{ item.unit }}</div>
        <div class="chart-labels">
          <div :id="`chartLabels_${index}`"></div>
        </div>
      </div>
    </div>
    <div v-else class="main-prompt">
      <i class="iconfont icon-xuanzefenzu"></i
      ><span>请选择间隔或变压器哦！</span>
    </div>
  </div>
</template>

<script>
import * as ConstVal from "./config/measuresList";
import timeFormatMixins from "@/common/mixins/timeFormat";
import {
  GET_LIST_15_MINUTE_TAGS,
  GET_LIST_DAY_TAGS,
  GET_LIST_MONTH_TAGS,
  GET_EXPORT
} from "hlcx-qiankun-commonservice/utils/api/monitor/comparisonAnalysis";
import { Chart } from "@antv/g2";
import { mapState } from "vuex";

export default {
  mixins: [ timeFormatMixins],
  name: "comparisonAnalysis",
  computed: {
    ...mapState([
      "comparisonAnalysisNode",
      "analysisNodeObj",
      "analysisRequest"
    ])
  },
  data() {
    return {
      isShow: false,
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > Date.now() - 8.64e6;
        }
      },
      request: {
        cycle: "1",
        day: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd"),
        month: this.jstool.jshandle.getcurrentTime("yyyy-MM"),
        year: String(this.jstool.jshandle.getcurrentTime("yyyy")),
        measures: ["P"]
      },
      measuresList: ConstVal.MEASURES_LIST,
      tagList: [],
      contrast: {},
      tableData: [],
      tableColumns: [],
      chartData: [],
      chart: {}
    };
  },
  methods: {
    requestChange() {
      this.$store.commit("analysisRequestStatus", this.request);
    },
    // 去重
    arrayUnique(arr, param = "") {
      let res = new Map();
      return arr.filter(a => !res.has(a[param]) && res.set(a[param], 1));
    },
    // 点击量测量
    handleCheckedMeasuresChange(val) {
      let filter = [];
      this.measuresList.map(item => {
        //从这里开始匹配，如果没有匹配到，
        val.map(p => {
          if (p == item.labels) {
            filter.push(item);
          }
        });
      });
      this.tableColumns = this.arrayUnique(filter, "labels");
      this.getInitializeTableData();
    },
    // 查询
    viewQuery() {
      this.tagList = [this.tagList[this.tagList.length - 1]];
      this.tagList[0].cycle = this.request.cycle;
      if (this.request.cycle == 1) {
        this.tagList[0].date = this.request.day;
      } else if (this.request.cycle == 2) {
        this.tagList[0].date = this.request.month;
      } else if (this.request.cycle == 3) {
        this.tagList[0].date = this.request.year;
      }
      this.getInitializeTableData();
    },
    // 导出
    exportExcel() {
      let data = {
        dataList: this.tableData,
        headInfo: this.tableColumns
      };
      GET_EXPORT(data).then(res => {
        let blob = new Blob([res], { type: "application/force-download" }); // Blob 对象表示一个不可变、原始数据的类文件对象
        let fileReader = new FileReader(); // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
        fileReader.readAsDataURL(blob);
        //开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
        fileReader.onload = e => {
          let a = document.createElement("a");
          a.download = `对比分析数据.xlsx`;
          a.href = e.target.result;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      });
    },
    // 添加对比
    addContrast() {
      if (
        this.contrast &&
        (this.contrast.euqiptreeId == 14 || this.contrast.euqiptreeId == 4)
      ) {
        if (
          this.tagList.length == 0 ||
          (this.tagList.length > 0 &&
            this.contrast.cycle == this.tagList[0].cycle)
        ) {
          if (this.tagList.length <= 7) {
            let flag = this.tagList.findIndex(
              item =>
                item.id &&
                item.id == this.contrast.id &&
                item.date == this.contrast.date
            );
            if (flag == -1) {
              this.tagList.push(this.contrast);
              this.getInitializeTableData();
            } else {
              this.$message.error("该记录已经存在，请重新选择");
            }
          } else {
            this.$message.error("对比数据不能超过8条");
          }
        } else {
          this.$message.error("不同日期类型的数据无法添加对比");
        }
      } else {
        this.$message.error("请选择间隔或变压器");
      }
    },
    //  删除对比
    handleClose(tag) {
      this.tagList.splice(this.tagList.indexOf(tag), 1);
      var datawilldele = [];
      if (this.request.cycle == 1) {
        this.tableData.forEach((item, index) => {
          if (
            tag.date == item.date.slice(0, 10) &&
            tag.sn == item.sn &&
            tag.dev == item.dev &&
            tag.name == item.name
          ) {
            datawilldele.push(index);
          }
        });
        for (let i = 0; i < datawilldele.length; i++) {
          this.tableData.splice(datawilldele[i] - i, 1);
        }
      } else if (this.request.cycle == 2) {
        this.tableData.forEach((item, index) => {
          if (
            tag.date == item.date.slice(0, 7) &&
            tag.sn == item.sn &&
            tag.dev == item.dev &&
            tag.name == item.name
          ) {
            datawilldele.push(index);
          }
        });
        for (let i = 0; i < datawilldele.length; i++) {
          this.tableData.splice(datawilldele[i] - i, 1);
        }
      } else if (this.request.cycle == 3) {
        this.tableData.forEach((item, index) => {
          if (
            tag.date == item.date.slice(0, 4) &&
            tag.sn == item.sn &&
            tag.dev == item.dev &&
            tag.name == item.name
          ) {
            datawilldele.push(index);
          }
        });
        for (let i = 0; i < datawilldele.length; i++) {
          this.tableData.splice(datawilldele[i] - i, 1);
        }
      }
      this.filterChartData();
      if (this.tagList.length == 0) {
        this.$store.commit("comparisonAnalysisNodeStatus", []);
        this.$store.commit("analysisNodeObjStatus", {});
      }
    },
    //   初始化表格数据
    getInitializeTableData() {
      // tableData
      // 判断日期
      this.tableData = [];
      if (this.request.cycle == 1) {
        //  日
        let tagSet = {};
        this.tagList.forEach(a => {
          var key = a.date;
          if (!tagSet[key]) {
            tagSet[key] = [];
          }
          tagSet[key].push(a);
        });
        let arr = [];
        let timeArray = [];
        for (let tag in tagSet) {
          timeArray = this.getTimeFormat(
            tag + " 00:00:00",
            tag + " 24:00:00",
            15,
            "yyyy-MM-dd HH:mm:ss"
          );
          tagSet[tag].forEach(val => {
            timeArray.forEach(item => {
              let o = {};
              o.date = item;
              o.cycle = this.request.cycle;
              o.name = val.name;
              o.sn = val.sn;
              o.dev = val.dev;
              let labelsArr = [];
              this.tableColumns.forEach(p => {
                o[`${p.labels}_value`] = null;
                labelsArr.push(p.labels);
              });
              o.labels = labelsArr.join(",");
              arr.push(o);
            });
          });
          let tagList = this.tagList;
          let tableColumns = this.tableColumns;
          let sn = [];
          let dev = [];
          let tags = [];
          tagList.forEach(item => {
            tableColumns.forEach(val => {
              sn.push(item.sn);
              dev.push(item.dev);
              tags.push(val.labels);
            });
          });
          let data = {
            begintime: tag,
            endTime: tag,
            tags: [...new Set(tags)].join(","),
            sn: [...new Set(sn)].join(","),
            dev: [...new Set(dev)].join(",")
          };
          GET_LIST_15_MINUTE_TAGS(data).then(res => {
            for (var i = 0; i < res.data.length; i++) {
              for (var j = 0; j < arr.length; j++) {
                if (
                  arr[j].date == res.data[i].stringTime + ":00" &&
                  arr[j].sn == res.data[i].m.split("-")[0] &&
                  arr[j].dev == res.data[i].m.split("-")[1]
                ) {
                  for (let key in res.data[i]) {
                    for (let keys in arr[j]) {
                      if (keys == key + "_value") {
                        arr[j][keys] = String(res.data[i][key]);
                        break;
                      }
                    }
                  }
                }
              }
            }
            this.tableData = arr;
            this.filterChartData();
          });
        }
      } else if (this.request.cycle == 2) {
        //  月
        let tagSet = {};
        this.tagList.forEach(a => {
          var key = a.date.slice(0, 7);
          if (!tagSet[key]) {
            tagSet[key] = [];
          }
          tagSet[key].push(a);
        });
        let arr = [];
        let timeArray = [];
        for (let tag in tagSet) {
          timeArray = this.getTimeFormat(
            tag + "-01",
            tag + `-${this.getLastDay(tag)}`,
            60 * 24,
            "yyyy-MM-dd",
            1
          );
          tagSet[tag].forEach(val => {
            timeArray.forEach(item => {
              let o = {};
              o.date = item;
              o.cycle = this.request.cycle;
              o.name = val.name;
              o.sn = val.sn;
              o.dev = val.dev;
              let labelsArr = [];
              this.tableColumns.forEach(p => {
                o[`${p.labels}_value`] = null;
                labelsArr.push(p.labels);
              });
              o.labels = labelsArr.join(",");
              arr.push(o);
            });
          });
          let tagList = this.tagList;
          let tableColumns = this.tableColumns;
          let sn = [];
          let dev = [];
          let tags = [];
          tagList.forEach(item => {
            tableColumns.forEach(val => {
              sn.push(item.sn);
              dev.push(item.dev);
              tags.push(val.labels);
            });
          });
          let data = {
            begintime: tag,
            endTime: tag,
            tags: [...new Set(tags)].join(","),
            sn: [...new Set(sn)].join(","),
            dev: [...new Set(dev)].join(","),
            type: "max"
          };
          GET_LIST_DAY_TAGS(data).then(res => {
            for (var i = 0; i < res.data.length; i++) {
              for (var j = 0; j < arr.length; j++) {
                if (
                  arr[j].date == res.data[i].stringTime &&
                  arr[j].sn == res.data[i].m.split("-")[0] &&
                  arr[j].dev == res.data[i].m.split("-")[1]
                ) {
                  for (let key in res.data[i]) {
                    for (let keys in arr[j]) {
                      if (keys == key + "alue") {
                        arr[j][keys] = String(res.data[i][key]);
                        break;
                      }
                    }
                  }
                }
              }
            }
            this.tableData = arr;
            this.filterChartData();
          });
        }
      } else if (this.request.cycle == 3) {
        //  年
        let tagSet = {};
        this.tagList.forEach(a => {
          var key = a.date.slice(0, 7);
          if (!tagSet[key]) {
            tagSet[key] = [];
          }
          tagSet[key].push(a);
        });
        let arr = [];
        let timeArray = [];
        for (let tag in tagSet) {
          timeArray = this.getTimeFormat(
            tag + "-01-01",
            tag + "-12-31",
            60 * 24 * 31,
            "yyyy-MM",
            1
          );
          tagSet[tag].forEach(val => {
            timeArray.forEach(item => {
              let o = {};
              o.date = item;
              o.cycle = this.request.cycle;
              o.name = val.name;
              o.sn = val.sn;
              o.dev = val.dev;
              let labelsArr = [];
              this.tableColumns.forEach(p => {
                o[`${p.labels}_value`] = null;
                labelsArr.push(p.labels);
              });
              o.labels = labelsArr.join(",");
              arr.push(o);
            });
          });
          let tagList = this.tagList;
          let tableColumns = this.tableColumns;
          let sn = [];
          let dev = [];
          let tags = [];
          tagList.forEach(item => {
            tableColumns.forEach(val => {
              sn.push(item.sn);
              dev.push(item.dev);
              tags.push(val.labels);
            });
          });
          let data = {
            year: tag,
            tags: [...new Set(tags)].join(","),
            sn: [...new Set(sn)].join(","),
            dev: [...new Set(dev)].join(","),
            type: "max"
          };
          GET_LIST_MONTH_TAGS(data).then(res => {
            for (var i = 0; i < res.data.length; i++) {
              for (var j = 0; j < arr.length; j++) {
                if (
                  arr[j].date == res.data[i].stringTime &&
                  arr[j].sn == res.data[i].m.split("-")[0] &&
                  arr[j].dev == res.data[i].m.split("-")[1]
                ) {
                  for (let key in res.data[i]) {
                    for (let keys in arr[j]) {
                      if (keys == key + "_value") {
                        arr[j][keys] = String(res.data[i][key]);
                        break;
                      }
                    }
                  }
                }
              }
            }
            this.tableData = arr;
            this.filterChartData();
          });
        }
      }
    },
    filterChartData() {
      this.chartData = [];
      let tableData = this.tableData;
      let tableColumns = this.tableColumns;
      let arr = [];
      let labelsArr = [];
      tableData.forEach(item => {
        item.labels.split(",").forEach(val => {
          var obj = {};
          if (item.cycle == 1) {
            obj.date = item.date.slice(11, 16);
            obj.type = `${item.name}(${item.date.slice(0, 10)})`;
          } else if (item.cycle == 2) {
            obj.date = this.jstool.jshandle.filtertime(item.date, "dd") + "日";
            obj.type = `${item.name}(${item.date.slice(0, 7)})`;
          } else if (item.cycle == 3) {
            obj.date = this.jstool.jshandle.filtertime(item.date, "MM") + "月";
            obj.type = `${item.name}(${item.date.slice(0, 4)})`;
          }
          obj.labels = val;
          obj.value = item[`${obj.labels}_value`]
            ? Number(item[`${obj.labels}_value`])
            : null;
          arr.push(obj);
          labelsArr.push(val);
        });
      });
      let chartList = [...new Set(labelsArr)];
      let chartData = [];
      chartList.forEach(item => {
        let chartObj = {};
        chartObj.labels = item;
        chartObj.children = [];
        arr.forEach(val => {
          if (item == val.labels) {
            chartObj.children.push(val);
          }
        });
        chartData.push(chartObj);
      });
      let chartArray = [];
      chartData.forEach(item => {
        let chartObj = {};
        tableColumns.forEach(val => {
          if (item.labels == val.labels) {
            chartObj.unit = val.unit;
            chartObj.labelName = val.name;
            chartObj.labels = item.labels;
            chartObj.children = item.children;
          }
        });
        chartArray.push(chartObj);
      });
      this.chartData = chartArray;
      this.getChartCanvas();
    },
    getChartCanvas() {
      this.$nextTick(() => {
        this.chartData.forEach((item, index) => {
          var f = document.getElementById(`chartLabels_${index}`);
          var childs = f.childNodes;
          for (var i = 0; i < childs.length; i++) {
            f.removeChild(childs[i]);
          }
          this.$set(this.chart, `chart${index}`, null);
          this.chart[`chart${index}`] = null;
          this.chart[`chart${index}`] = new Chart({
            container: `chartLabels_${index}`, // 指定图表容器 ID
            autoFit: true,
            height: 300,
            appendPadding: [20, 30, 0, 30]
          });
          this.chart[`chart${index}`].clear();
          var color = [
            "#0CEAF3",
            "#77DA6D",
            "#EF9734",
            "#FFFC00",
            "#21B8FF",
            "#A3D7A6",
            "#F1E986",
            "#E3C5FF"
          ];
          this.chart[`chart${index}`].data(item.children);
          this.chart[`chart${index}`].axis("date", {
            line: null,
            label: {
              autoRotate: false,
              autoHide: false,
              style: {
                fill: "#CCCCCC"
              }
            },
            tickLine: null
          });
          this.chart[`chart${index}`].axis("value", {
            label: {
              style: {
                fill: "#CCCCCC"
              }
            },
            grid: {
              line: {
                style: {
                  stroke: "#FFFFFF",
                  strokeOpacity: 0.2
                }
              }
            }
          });
          this.chart[`chart${index}`].tooltip({
            showCrosshairs: true,
            shared: true,
            domStyles: {
              "g2-tooltip-marker": {
                display: "none"
              },
              "g2-tooltip": {
                background: "#01133B",
                boxShadow: "none"
              },
              "g2-tooltip-title": {
                color: "white"
              },
              "g2-tooltip-list-item": {
                color: "white"
              }
            }
          });
          this.chart[`chart${index}`].scale({
            date: {
              range: [0, 1],
              tickCount: 6,
              type: "cat"
            },
            value: {
              nice: true
            }
          });
          this.chart[`chart${index}`].legend("type", {
            position: "top",
            flipPage: false,
            marker: {
              symbol: "circle",
              style: {
                fillOpacity: 1
              }
            },
            itemName: {
              style: {
                fontSize: 12,
                fill: "#ffffff" // 文本颜色
              }
            }
          });
          this.chart[`chart${index}`]
            .line()
            .position("date*value")
            .color("type", color)
            .shape("smooth");
          this.chart[`chart${index}`].render();
        });
      });
    }
  },
  watch: {
    comparisonAnalysisNode(val) {
      this.tagList = val.concat([]);
      if (this.tagList.length > 0) {
        this.isShow = true;
        this.request.cycle = "1";
        this.request.day = this.jstool.jshandle.getcurrentTime("yyyy-MM-dd");
        this.handleCheckedMeasuresChange(this.request.measures);
      } else {
        this.isShow = false;
      }
    },
    analysisNodeObj: {
      handler: function(val) {
        this.contrast = val;
      },
      deep: true
    }
  },

};
</script>

<style scoped lang="scss">
::v-deep.main-content {
  font-size: 14px;
  padding: 25px 30px;
  height: 100%;
  .angle-left-top {
    top: -1px;
    left: -1px;
  }
  .angle-left-bottom {
    bottom: -1px;
    left: -1px;
  }
  .angle-right-top {
    top: -1px;
    right: -1px;
  }
  .angle-right-bottom {
    bottom: -1px;
    right: -1px;
  }
  .filter-form {
    border: 1px solid #00a0e9;
    padding-top: 25px;
    position: relative;
  }

  .table-tags {
    position: relative;
    border: 1px solid #00a0e9;
    padding: 25px 36px;
    margin-top: 25px;
    .main-tags {
      display: flex;
      flex-wrap: wrap;
      .el-tag {
        width: 22.75%;
        text-align: center;
        font-size: 14px;
        margin-bottom: 10px;
        margin-right: 3%;
        &:nth-child(4n) {
          margin-right: 0;
        }
        &:nth-child(1) {
          background: rgba(12, 234, 243, 0.2);
          border-color: #0ceaf3;
          color: #0ceaf3;
          i {
            color: #0ceaf3;
            &:hover {
              color: #ffffff;
              background-color: rgb(12, 234, 243);
            }
          }
        }
        &:nth-child(2) {
          background: rgba(119, 218, 109, 0.2);
          border-color: #0ceaf3;
          color: #0ceaf3;
          i {
            color: #0ceaf3;
            &:hover {
              color: #ffffff;
              background-color: rgb(119, 218, 109);
            }
          }
        }
        &:nth-child(3) {
          background: rgba(239, 151, 52, 0.2);
          border-color: #ef9734;
          color: #ef9734;
          i {
            color: #ef9734;
            &:hover {
              color: #ffffff;
              background-color: rgb(239, 151, 52);
            }
          }
        }
        &:nth-child(4) {
          background: rgba(255, 252, 0, 0.2);
          border-color: #fffc00;
          color: #fffc00;
          i {
            color: #fffc00;
            &:hover {
              color: #ffffff;
              background-color: rgb(255, 252, 0);
            }
          }
        }
        &:nth-child(5) {
          background: rgba(33, 184, 255, 0.2);
          border-color: #21b8ff;
          color: #21b8ff;
          i {
            color: #21b8ff;
            &:hover {
              color: #ffffff;
              background-color: rgb(33, 184, 255);
            }
          }
        }
        &:nth-child(6) {
          background: rgba(163, 215, 166, 0.2);
          border-color: #a3d7a6;
          color: #a3d7a6;
          i {
            color: #a3d7a6;
            &:hover {
              color: #ffffff;
              background-color: rgb(163, 215, 166);
            }
          }
        }
        &:nth-child(7) {
          background: rgba(241, 233, 134, 0.2);
          border-color: #f1e986;
          color: #f1e986;
          i {
            color: #f1e986;
            &:hover {
              color: #ffffff;
              background-color: rgb(241, 233, 134);
            }
          }
        }
        &:nth-child(8) {
          background: rgba(227, 197, 255, 0.2);
          border-color: #e3c5ff;
          color: #e3c5ff;
          i {
            color: #e3c5ff;
            &:hover {
              color: #ffffff;
              background-color: rgb(227, 197, 255);
            }
          }
        }
      }
    }
  }
  .h-table {
    .el-table {
      .el-table__header-wrapper {
        tr,
        th {
          background: rgb(33, 117, 243);
        }
      }
    }
  }
}
</style>
