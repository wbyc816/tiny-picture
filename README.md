
# Tiny-picture
# 介绍
基于[tinify-nodejs](https://github.com/tinify/tinify-nodejs)封装的图片压缩CLI，支持格式png、jpg，使用前需前往[tinifypng开发者中心](https://tinypng.com/developers)注册获取key，每个key当月可使用500次，可申请多个key。
# 安装

全局环境安装

    $ npm install tiny-picture -g


# 使用

当前目录下压缩图片，压缩完的图片会在目录result下

    $ tiny start

 判断当前目录下是否是GIT项目，会压缩未跟踪及修改的图片,并直接替换

    $ tiny git

设置tinifyAPI的key

    $ tiny set <key>

 打印当前key当月剩余使用次数

    $ tiny count
# 许可证
MIT
