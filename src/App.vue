<template>
  <div
    id="app"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <router-view />
  </div>
</template>

<script>
import { GET_ALL_DICT_DATA_LIST } from "hlcx-qiankun-commonservice/utils/api/system/dictionary";
import { mapMutations  } from "vuex"
export default {
  name: "App",
  mounted() {
    this.getAllDictList();
  },
  methods: {
    ...mapMutations('common',[
      'setDict'
    ]),
    // 获取字典
    getAllDictList() {
      if (JSON.parse(sessionStorage.getItem("access_token"))) {
        const arr = [];
        GET_ALL_DICT_DATA_LIST().then((res) => {
          res.rows.forEach((item) => {
            const parent = arr.find(
              (cur) => Object.keys(cur)[0] === item.dictType
            );
            if (parent) {
              parent[Object.keys(parent)[0]].push(item);
            } else {
              let obj = {
                [item.dictType]: [item],
              };
              arr.push(obj);
            }
          });
          const obj = {};
          arr.forEach((item) => {
            obj[Object.keys(item)[0]] = item[Object.keys(item)[0]];
          });
          this.setDict(obj);
        });
      }
    },
  },
};
</script>

<style></style>
