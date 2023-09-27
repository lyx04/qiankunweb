// 变压器 4
// 屏柜 5
// 底层设备 6
// 表计 8
// 动环监控 9
// 通讯终端 11
// 配电室 13
// 间隔 14
import {
  GET_INTERVAL_MEASURE,
  QUERY_ROOM_INFO
} from "hlcx-qiankun-commonservice/utils/api/equipment/device";
export default {
  data() {
    return {
      TableSelect: []
    };
  },
  methods: {
    //新增量测量
    addMeasure() {
      var obj = {
        commId: "",
        identify: "",
        labels: "",
        meterId: "",
        name: "",
        pKey: "",
        sn: "",
        unit: "",
        isEdit: true
      };
      if (this.tableDate.length == 0) {
        this.tableDate.push(obj);
      } else if (this.tableDate[this.tableDate.length - 1].commId) {
        this.tableDate.push(obj);
      }
    },
    //删除表格中的数据
    deleteMeasure() {
      this.TableSelect.forEach(i => {
        var arr = this.tableDate.filter(j => {
          return i.id != j.id;
        });
        this.tableDate = arr;
      });
    },
    //表格的多选框
    tableSelectChange(value) {
      this.TableSelect = value;
    },
    //关联弹框表格中量测量下拉列表的选择
    MeasureTableChange(e) {
      this.tableDate[e.$index] = e.row.data;
      e.row.isEdit = false;
    },
    //弹框关联设备的选择
    modalSelectChange(treeType) {
      return new Promise(resolve => {
        // switch (treeType) {
        //   case 4:
        //     Active = "voltage";
        //     break;
        //   case 14:
        //     Active = "intervalModal";
        //     break;
        //   case 9:
        //     Active = "monitor";
        //     break;
        // }
        this.tableDate = [];
        GET_INTERVAL_MEASURE(this.changeActive, treeType).then(e => {
          this.tablelist = e.data;
          resolve();
        });
      });
    },
    // 右键之后初始化选择
    rightclickInit(treeType) {
      var clientNode = this.parent.drawNodeInfoList[this.parent.props.node.id];
      // 首先判断是否在本地有，没有就直接初始化
      // 要是有，但是为空数组，也初始化
      if (clientNode) {
        if (clientNode.length) {
          this.changeActive = Number(clientNode[0].equipmentSelectId);
          this.modalSelectChange(treeType).then(() => {
            this.tableDate = clientNode;
          });
          //关于关联间隔，通过量测量中保存的间隔id，获取间隔信息
          if (treeType == 14) {
            QUERY_ROOM_INFO(clientNode[0].equipmentSelectId).then(e => {
              this.placeholder = e.data.name;
            });
          }
        }
      }
    }
  }
};
