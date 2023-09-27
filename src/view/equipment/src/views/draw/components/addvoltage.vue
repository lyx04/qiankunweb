<template>
  <comonMondal @on-closed="voltageSub" :visible="show" customClass="Miniform">
    <template slot="head">
      <span>关联变压器</span>
    </template>
    <template slot="body">
      <div class="select">
        <label for="">关联变压器：</label>
        <el-select
          v-model="changeActive"
          @change="modalSelectChange(4)"
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
        empty-text="请新增量测量"
        @selection-change="tableSelectChange"
        class="modal"
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
      <el-button @click="voltageSub">关闭</el-button>
    </template>
  </comonMondal>
</template>
<script>
import comonMondal from "hlcx-qiankun-commonservice/components/Modal";
import measureOption from "./mixin/measureOption";
import { GET_METER_SELECT } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { Node } from "@topology/core";
import { mapMutations } from "vuex";

export default {
  components: { comonMondal },
  mixins: [measureOption],
  props: {
    show: Boolean
  },
  data() {
    return {
      list: [],
      tableDate: [],
      changeActive: "",
      tablelist: [],
      parent: this.$parent
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations('common',["drawChangeAction"]),

    init() {
      // 选当前配电室下的变压器
      GET_METER_SELECT(this.parent.drawInfo.power, 4).then(e => {
        this.list = e.data;
        this.rightclickInit(4);
      });
    },
    //关闭弹窗
    closed() {
      this.$emit("update:show", false);
    },
    //变压器的弹框的确认
    voltageSub() {
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
      var fatcherchild = new Node({
        name: "ltee",
        text: "变压器",
        data: {
          type: "DataModal"
        },
        strokeStyle: "white",
        stand: false,
        fontSize: 12,
        fontColor: "white",
        rectInParent: {
          width: 150,
          height: 15 * (this.tableDate.length + 1) + 10,
          x: -150,
          y: 0
        },
        children: arr
      });
      this.parent.props.node.children = [fatcherchild];
      this.parent.returnCanvas().updateProps(this.parent.props.node);
      this.drawChangeAction(true);

      var parentNode = this.parent
        .returnCanvas()
        .find(this.parent.props.node.id).children[0];
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
