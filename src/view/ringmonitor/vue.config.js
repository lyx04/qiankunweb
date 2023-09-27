let path = require("path");
// const isProduction = process.env.NODE_ENV;
const VueLoaderPlugin = require("vue-loader/lib/plugin");
let timeStamp = new Date().getTime();
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "/all/",
  outputDir: "all",
  assetsDir: "assets",
  filenameHashing: false,
  productionSourceMap: false, // 关闭生产环境的 source map
  devServer: {
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    hotOnly: true,
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: 0,
    },
  },
  css: {
    extract: {
      // 打包后css文件名称添加时间戳
      filename: `css/[name].${timeStamp}.css`,
      chunkFilename: `css/[name].${timeStamp}.css`
    }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "sass",
      patterns: [],
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src")); // key,value自行定义，比如.set('@@', resolve('src/components'))
    //打包配置时间戳
    // if (isProduction == "own") {
    //   // 给js和css配置版本号
    //   config.output
    //     .filename("index/overview/js/[name]." + timeStamp + ".js")
    //     .end();
    //   config.output
    //     .chunkFilename("index/overview/js/[name]." + timeStamp + ".js")
    //     .end();
    // }
    config.plugins.delete("prefetch");
    config.plugins.delete("preload");
    config.plugin("html").tap((args) => {
      args[0].template = "../../../public/index.html";
      return args;
    });
    config.module
      .rule("vue")
      .test(/\.vue$/)
      .use("vue-loader")
      .loader("vue-loader")
      .tap(() => {
        return {
          compilerOptions: {
            whitespace: "condense",
          },
        };
      })
      .end();
  },
  configureWebpack: {
    externals: {
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      axios: "axios",
      mqtt: "mqtt",
      "element-ui": "ELEMENT",
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `all-[name]`,
      libraryTarget: "umd",
    },
    plugins: [new VueLoaderPlugin()],
  },
};
