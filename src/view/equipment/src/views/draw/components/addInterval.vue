<template>
  <comonMondal @on-closed="intervalSub" :visible="show" customClass="Miniform">
    <template slot="head">
      <span>关联间隔</span>
    </template>
    <template slot="body">
      <div class="select">
        <label for="">关联间隔：</label>
        <el-cascader
          ref="intervalcascader"
          :props="caderprops"
          v-model="changeActive"
          :options="list"
          @change="modalSelectChange(14)"
          :show-all-levels="false"
          :placeholder="placeholder"
        >
        </el-cascader>
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
        <el-table-column align="center" prop="date" label="量测量">
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
      <el-button @click="intervalSub">关闭</el-button>
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
      placeholder: "",
      list: [],
      tableDate: [],
      changeActive: "",
      tablelist: [],
      caderprops: {
        lazy: true,
        emitPath: false,
        value: "id",
        label: "name",
        lazyLoad(node, resolve) {
          let { level } = node;
          if (level == 1) {
            GET_METER_SELECT(node.data.id, 14).then(e => {
              e.data.forEach(i => {
                i.leaf = true;
              });
              resolve(e.data);
            });
          }
        }
      },
      parent: this.$parent
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations('common',["drawChangeAction"]),
    //关闭弹窗
    closed() {
      this.$emit("update:show", false);
    },
    init() {
      GET_METER_SELECT(this.parent.drawInfo.power, 5).then(e => {
        this.list = e.data;
        this.rightclickInit(14);
      });
    },
    //间隔的弹框的确认
    intervalSub() {
      var leafNode = this.$refs.intervalcascader.getCheckedNodes(true)[0];
      var arr = [];
      var measureArr = [];
      if (leafNode == null || leafNode.level != 1) {
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
                rotate: 0,
                margin: 0
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
                    rotate: 0,
                    margin: 0
                  },
                  stand: false,
                  hideInput: true,
                  hideSizeCP: true,
                  hideAnchor: true,
                  name: "text",
                  text: i.labels,
                  fontColor: "green",
                  textAlign: "center"
                },
                {
                  rectInParent: {
                    x: "40%",
                    y: 0,
                    width: "40%",
                    height: 15,
                    rotate: 0,
                    margin: 0
                  },
                  stand: false,
                  hideInput: true,
                  hideSizeCP: true,
                  hideAnchor: true,
                  name: "text",
                  text: "00.00",
                  fontColor: "green",
                  textAlign: "center"
                },
                {
                  rectInParent: {
                    x: "80%",
                    y: 0,
                    width: "20%",
                    height: 15,
                    rotate: 0,
                    margin: 0
                  },
                  stand: false,
                  hideInput: true,
                  hideSizeCP: true,
                  hideAnchor: true,
                  name: "text",
                  text: i.unit,
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
      }

      this.closed();
    }
  }
};
</script>
<style lang="scss" scoped></style>
