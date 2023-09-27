<template>
  <comonMondal @on-closed="monitorSub" :visible="show" customClass="Miniform">
    <template slot="head">
      <span>关联动环监控</span>
    </template>
    <template slot="body">
      <div class="select">
        <label for="">选择动环监控：</label>
        <el-select
          v-model="changeActive"
          @change="modalSelectChange(9)"
          :placeholder="placeholder"
        >
          <el-option
            v-for="item in list"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="option">
        <el-button type="primary" @click="addMeasure">新增</el-button>
        <el-button type="primary" @click="deleteMeasure">删除</el-button>
      </div>
      <el-table
        @selection-change="tableSelectChange"
        class="modal"
        empty-text="请新增量测量"
        :data="tableDate"
        style="width: 100%"
      >
        <el-table-column align="center" type="selection"> </el-table-column>
        <el-table-column align="center" prop="name" label="量测量">
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <!-- 取企业下的所有量测量 -->
              <el-select
                filterable
                @change="MeasureTableChange(scope)"
                v-model="scope.row.data"
              >
                <el-option
                  v-for="item in tablelist"
                  :key="item.id"
                  :value="item"
                  :label="item.name"
                ></el-option>
              </el-select>
            </template>
            <template v-else>
              <span>{{ scope.row.name }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="labels" label="标签">
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <span></span>
            </template>
            <template v-else>
              <span>{{ scope.row.labels }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="unit" label="单位">
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <span></span>
            </template>
            <template v-else>
              <span>{{ scope.row.unit }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template slot="foot">
      <el-button @click="monitorSub">关闭</el-button>
    </template>
  </comonMondal>
</template>
<script>
import comonMondal from "hlcx-qiankun-commonservice/components/Modal";
import { GET_METER_SELECT } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import measureOption from "./mixin/measureOption";
import { Node } from "@topology/core";
import { mapMutations } from "vuex";

export default {
  mixins: [measureOption],
  components: {
    comonMondal
  },
  props: {
    show: Boolean
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      //动环监控关联配电室下的量测量
      list: [],
      tableDate: [],
      changeActive: "",
      tablelist: [],
      parent: this.$parent,
      iconfont: {
        fontSize: 12,
        color: "green",
        textAlign: "center"
      }
    };
  },
  methods: {
    ...mapMutations('common',["drawChangeAction"]),

    //关闭弹窗
    closed() {
      this.$emit("update:show", false);
    },
    init() {
      GET_METER_SELECT(this.parent.drawInfo.power, 9).then(e => {
        this.list = e.data;
        this.rightclickInit(9);
      });
    },
    //动环监控弹框的确认
    monitorSub() {
      var arr = [];
      var measureArr = [];

      this.tableDate.forEach((i, v) => {
        if (!i.commId) {
          this.tableDate.pop();
        } else {
          i["equipmentSelectId"] = this.changeActive;
          i["parentId"] = this.parent.props.node.id;
          var obj = {
            rectInParent: {
              x: 0,
              y: v == 0 ? 10 : 15 * v + 10,
              width: "100%",
              height: 15,
              rotate: 0
            },
            stand: false,
            hideInput: true,

            hideSizeCP: true,
            hideAnchor: true,
            name: "text",
            strokeStyle: "transparent",
            children: [
              {
                rectInParent: {
                  x: 0,
                  y: 0,
                  width: "40%",
                  height: 15,
                  rotate: 0
                },
                stand: false,
                hideInput: true,

                hideSizeCP: true,
                hideAnchor: true,
                name: "text",
                text: i.labels,
                fontSize: 12,
                fontColor: "green",
                textAlign: "center"
              },
              {
                rectInParent: {
                  x: "40%",
                  y: 0,
                  width: "40%",
                  height: 15,
                  rotate: 0
                },
                stand: false,
                hideInput: true,

                hideSizeCP: true,
                hideAnchor: true,
                name: "text",
                text: "00.00",
                fontSize: 12,
                fontColor: "green",
                textAlign: "center"
              },
              {
                rectInParent: {
                  x: "80%",
                  y: 0,
                  width: "20%",
                  height: 15,
                  rotate: 0
                },
                stand: false,
                hideInput: true,

                hideSizeCP: true,
                hideAnchor: true,
                name: "text",
                text: i.unit,
                fontSize: 12,
                fontColor: "green",
                textAlign: "center"
              }
            ]
          };
          var node = new Node(obj);
          arr.push(node);
        }
      });
      this.parent.props.node.children = arr;
      this.parent.props.node.rect.height =
        15 * (this.tableDate.length + 1) + 10;
      this.parent.returnCanvas().updateProps(this.parent.props.node);
      this.drawChangeAction(true);

      var parentNode = this.parent
        .returnCanvas()
        .find(this.parent.props.node.id);
      this.tableDate.forEach((i, v) => {
        i["drawNodeId"] = parentNode.children[v].id;
        measureArr.push(i);
      });
      this.parent.drawNodeInfoList[this.parent.props.node.id] = measureArr;
      this.closed();
    }
  }
};
</script>
<style lang="scss" scoped></style>
