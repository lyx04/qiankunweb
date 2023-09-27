<template>
  <div>
    <modal
      :visible="dialogVisibleBatchProcess"
      customClass="customer-modal Miniform"
      :destroyOnClose="false"
      @on-closed="batchProcessClosed"
    >
      <template slot="head">
        <span>{{ detailObj.title }}</span>
      </template>
      <template slot="body">
        <el-form
          :model="detailObj"
          :rules="rules"
          ref="detailObj"
          label-width="auto"
        >
          <el-row>
            <el-form-item label="处理结果：" prop="handlerRemark">
              <el-input
                placeholder="请输入处理备注信息"
                type="textarea"
                v-model="detailObj.handlerRemark"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </template>
      <template slot="foot">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="batchProcessClosed">取 消</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "hlcx-qiankun-commonservice/components/Modal";
import { PUT_MONITOR_ALARM_HANDLE } from "hlcx-qiankun-commonservice/utils/api/monitor/alarm";

export default {
  name: "BatchProcessModal",
  components: { modal },
  props: {
    dialogVisibleBatchProcess: {
      type: Boolean,
      default: false
    },
    detailObj: {
      type: Object
    }
  },
  data() {
    return {
      rules: {
        handlerRemark: [
          { required: true, message: "请输入处理备注信息", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //  关闭弹框
    batchProcessClosed() {
      this.$emit("batchProcessClosed");
    },
    //  提交
    submitForm() {
      this.$refs["detailObj"].validate(valid => {
        if (valid) {
          PUT_MONITOR_ALARM_HANDLE(this.detailObj).then(() => {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$emit("refreshList");
            this.batchProcessClosed();
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep.el-textarea {
  width: 80% !important;
  textarea {
    height: 120px !important;
    resize: none;
  }
}
</style>
