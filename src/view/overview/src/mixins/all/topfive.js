import { GET_COMRANKELECQUALITY } from "hlcx-qiankun-commonservice/utils/api/overview/all";
export default {
  data() {
    return {
      topfiveList: [{}, {}],
    };
  },
  methods: {
    //获取top5
    topfive() {
      var params = {
        beginDate: `${this.jstool.jshandle.getcurrentTime("yyyy-MM")}-01`,
        endDate: `${this.jstool.jshandle.getcurrentTime("yyyy-MM")}-31`,
        m: "Eptp",
        orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
      };
      GET_COMRANKELECQUALITY(params).then((e) => {
        if (e.data.length) {
          // eslint-disable-next-line no-unused-vars
          // e.data.sort((a, b) => {
          //   return -1;
          // });
          var max = e.data[0].v;
          e.data.forEach((i, v) => {
            i.index = v + 1;
            i.percent = max ? Math.round((i.v / max) * 100) : 0;
          });
          this.topfiveList = e.data;
        } else {
          this.topfiveList = [];
        }
      });
    },
  },
};
