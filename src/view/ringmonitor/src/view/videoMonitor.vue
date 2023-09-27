<template>
  <div class="main-content">
    <div v-if="videoShow">
      <ul v-if="videoList.length > 0">
        <li v-for="item in videoList" :key="item.id">
          <div class="video-title">{{ item.name }}</div>
          <div class="video-content">
            <!--四角-->
            <div class="angle angle-left-top"></div>
            <div class="angle angle-left-bottom"></div>
            <div class="angle angle-right-top"></div>
            <div class="angle angle-right-bottom"></div>
            <video-player
              class="video-player vjs-custom-skin"
              :playsinline="true"
              ref="videoPlayer"
              :options="item.url | videoOption"
            >
            </video-player>
          </div>
        </li>
      </ul>
      <div v-else class="el__empty-block">
        <span>暂无视频</span>
      </div>
    </div>
    <div v-show="!videoShow" class="main-prompt">
      <i class="iconfont icon-xuanzefenzu"></i><span>请选择配电室哦！</span>
    </div>
  </div>
</template>

<script>
import { GET_VIDEO_URL_LIST } from "hlcx-qiankun-commonservice/utils/api/ringMonitor/index";
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import "videojs-flash";
import "videojs-contrib-hls";

export default {
  name: "videoMonitor",
  data() {
    return {
      videoShow: false,
      videoList: []
    };
  },
  filters: {
    videoOption(val) {
      return {
        live: false,
        preload: "auto",
        autoplay: true,
        language: "zh-CN",
        aspectRatio: "16:8",
        fluid: true,
        sources: [
          {
            type: "application/x-mpegURL",
            src: val
          }
        ],
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          currentTimeDisplay: false, // 当前时间
          volumeControl: false, // 声音控制键
          playToggle: false, // 暂停和播放键
          progressControl: false, // 进度条
          fullscreenToggle: true // 全屏按钮
        },
        flash: {
          hls: {
            withCredentials: false
          }
        },
        html5: { hls: { withCredentials: false } }
      };
    },
    rmptOption(val) {
      return {
        live: false,
        preload: "auto",
        autoplay: true,
        controls: true,
        language: "zh-CN",
        aspectRatio: "16:8",
        fluid: true,
        sources: [
          {
            type: "rtmp/mp4",
            src: val
          },
          {
            withCredentials: false,
            type: "application/x-mpegURL",
            src: val
          }
        ],
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          currentTimeDisplay: false, // 当前时间
          volumeControl: false, // 声音控制键
          playToggle: false, // 暂停和播放键
          progressControl: false, // 进度条
          fullscreenToggle: true // 全屏按钮
        },
        techOrder: ["flash"]
      };
    }
  },
  components: {
    videoPlayer
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  watch: {
    $route() {
      this.videoShow = false;
      if (this.$route.params.roomId && this.decode(this.$route.params.roomId)) {
        this.videoShow = true;
        this.getVideoList(this.decode(this.$route.params.roomId));
      }
    }
  },
  methods: {
    // 获取视频地址
    getVideoList(id) {
      this.videoList = [];
      GET_VIDEO_URL_LIST(id).then(res => {
        this.videoList = res.data;
      });
    }
  },
  mounted() {
    if (this.$route.params.roomId && this.decode(this.$route.params.roomId)) {
      this.videoShow = true;
      this.getVideoList(this.decode(this.$route.params.roomId));
    }
  }
};
</script>

<style scoped lang="scss">
.main-content {
  padding: 30px 115px;
  font-size: 14px;
  min-height: 100%;
  ul {
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
    li {
      width: 48%;
      margin-bottom: 22px;
      .video-title {
        font-size: 16px;
        position: relative;
        padding-left: 23px;
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 16px;
          background: #2bccff;
        }
        &::after {
          content: "";
          position: absolute;
          bottom: -18px;
          left: 0;
          width: 97%;
          height: 24px;
          background-image: url("~@/assets/img/video-title.png");
          background-size: 100%;
        }
      }
      .video-content {
        border: 2px solid #005eb1;
        position: relative;
        margin-top: 24px;
      }
    }
  }
}
</style>
