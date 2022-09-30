const path = require("path"); // 외부 모듈 갖다쓰는 것
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
  }, // 내가 바꾸고 싶은 파일. 처리하고 싶은 파일
  mode: "development",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/, //모든 js파일을 가져다가 변경하고자 함
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], //sass-loader, css-loader, style-loader 순으로 사용
      },
    ],
  },
};
