/* eslint-disable no-undef */
Vue.use(Vuex)
export default new Vuex.Store({
  state:{
    comparisonAnalysisNode: [], // 对比分析
    analysisNodeObj: {}, // 对比分析
    analysisRequest: {}, // 对比分析
  },
mutations:{
  comparisonAnalysisNodeStatus (state, user) {
    state.comparisonAnalysisNode = user;
  },
  analysisNodeObjStatus  (state, user)  {
    state.analysisNodeObj = user;
  },
  analysisRequestStatus (state, user)  {
    state.analysisRequest = user;
  }
}
})