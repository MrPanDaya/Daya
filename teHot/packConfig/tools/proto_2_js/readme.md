1、安装 node-js 的proto转js的工具protobufjs，-g代表全局安装:
npm install protobufjs -g

2、执行批处理:
pbjs -t json proto/fishing.proto > json/fishing.js
@pause