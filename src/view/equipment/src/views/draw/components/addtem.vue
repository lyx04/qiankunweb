<!-- 保存模板的 -->
<template>
  <comonMondal @on-closed="closed" :visible="show" customClass="Miniform">
    <template slot="head">
      <span>存为模板</span>
    </template>
    <template slot="body">
      <el-form
        :model="temForm"
        :rules="temFormrules"
        ref="temForm"
        label-width="120px"
      >
        <el-form-item label="类型：" prop="componentType">
          <el-select v-model="temForm.componentType">
            <el-option label="系统模板" value="1" v-if="userAuth"></el-option>
            <el-option label="单位模板" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input v-model.trim="temForm.name"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template slot="foot">
      <el-button @click="closed">取消</el-button>
      <el-button type="primary" @click="temSub">保存</el-button>
    </template>
  </comonMondal>
</template>
<script>
import { uploadFile } from "hlcx-qiankun-commonservice/utils/api/file";
import comonMondal from "hlcx-qiankun-commonservice/components/Modal";
import { ADD_CDC } from "hlcx-qiankun-commonservice/utils/api/equipment/draw";
import * as pako from "pako";
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
export default {
  components: { comonMondal },
  props: {
    show: Boolean
  },
  computed: {
    userAuth() {
      return (
        JSON.parse(sessionStorage.getItem("userInfo")).roles[0].roleKey ==
        "superadmin"
      );
    }
  },
  data() {
    return {
      parent: this.$parent,
      temForm: {
        componentType: "",
        name: ""
      },
      temFormrules: {
        componentType: [
          {
            required: true,
            message: "请选择组件类型",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //保存模板的弹框确认
    temSub() {
      this.$refs.temForm.validate(e => {
        if (e) {
          var fileUrl = dataURLtoFile(
            this.parent.returnCanvas().toImage(0, "image/png"),
            "drwaFile"
          );
          let fd = new FormData();
          fd.append("file", fileUrl);
          fd.append("bucket", "equipment");
          uploadFile(fd).then(res => {
            if (res.code == 200) {
              var data = pako.deflate(
                JSON.stringify(this.parent.returnCanvas().data),
                {
                  to: "string",
                  level: 9
                }
              );
              // eslint-disable-next-line no-unused-vars
              var params = {
                jsonData: btoa(data),
                componentType: this.temForm.componentType,
                name: this.temForm.name,
                picPath: res.data,
                orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
                tenantId: JSON.parse(sessionStorage.getItem("userInfo"))
                  .tenantId
              };
              this.show = false;
              ADD_CDC(params).then(e => {
                if (e.code == 200) {
                  this.$message.success("添加成功");
                }
              });
            }
          });
        }
      });
    },
    //关闭弹窗
    closed() {
      this.$emit("update:show", false);
    }
  }
};
</script>
<style lang="scss" scoped></style>
