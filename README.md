# node自动签到系统

使用无头浏览器 puppeteer ，支持自动登录，滑动验证，定时自动签到等功能

### 目前已经支持掘金：

使用方式

1. npm install
2. 在 config 文件中填写用户名和密码
3. 启动命令 npm run start 启动pm2 （注意，第一次启动请确保puppeteer正常启动，程序正常运行，签到成功后会打印 'sign success'）

登录滑动模块或签到可能1次不成功，已经加入retry机制，请各位不用担心。

本产品本人已经使用1月+，目前系统稳定无故障，有问题提Issues。

欢迎志同道合的同鞋继续添加其他网站的自动签到系统或者其他可自动化的模块。
