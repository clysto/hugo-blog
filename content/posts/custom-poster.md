---
title: "微信公众号用户专属海报生成"
date: 2019-08-12T02:50:01.698Z
tags:
  - 教程
  - 微信公众号
  - node

---



# 微信公众号用户专属海报生成

前一段公司想做一个七夕策划，用户在公司公众号内回复相应的内容，公众号会自动回复一张**用户专属海报**，为什么是用户专属呢？因为每次回复给用户的图片取决于用户的微信昵称和头像，而图片的底图是固定的。

<!--more-->

一开始我觉得这个需求挺简单的，可是真正实现也花费了一番功夫。我考虑的流程是用Node起一个服务器对接微信公众号，每次在收到用户消息的时候查询该用户的头像，昵称，然后将这些信息“画”在底图上，将这张底图上传为微信公众号临时素材，拿到media_id然后回复给用户。

由于之前没有接触过图像处理，所以这个功能的精力主要耗费在海报图像的合成上了。之前也有考虑过使用HTML模板来生成海报，然后将HTML页面抓取成图片，但是这样的作法比较耗费性能，大部分页面抓取的库都是基于Chromium，最后还是放弃了这个方案。

在经过一番探索之后我发现了[Sharp](https://www.npmjs.com/package/sharp)这个图像处理的库，可以像JQuery那样对图像进行链式操作。关于文字的部分使用[text-to-svg](https://www.npmjs.com/package/text-to-svg)这个库将字符串转换为svg图像然后再拼接到底图上。

服务器的搭建上我选择了常用的Express，然后使用了[wechat](https://www.npmjs.com/package/wechat)这个微信公共平台自动回复消息接口服务中间件来处理用户信息。

## 海报生成部分

首先来解决海报生成的问题，首先制作一张海报模板图片，将用户头像和用户昵称的部分空出。

![微信公众号海报实例-模板.jpg](https://i.loli.net/2019/08/12/SyJV7m6dKjGDiAf.jpg)

接着我们构造一个`PosterMaker`类：

```js
const sharp = require('sharp');
const TextToSVG = require('text-to-svg');

class PosterMaker {
  /**
   * 海报生成类
   * @param {String} fontPath 字体路径
   * @param {String} bg 底图
   */
  constructor(fontPath, bg) {
    this._textToSVG = TextToSVG.loadSync(fontPath);
    this._bg = bg;
    this._options = {
      x: 0,
      y: 0,
      fontSize: 60,
      anchor: 'top',
      attributes: { fill: 'white' }
    };
  }

  /**
   * 根据用户头像和昵称生成海报图片
   * @param {Buffer} avatar
   * @param {String} nickname
   */
  async generatePoster(avatar, nickname) {
    ......
  }
}
      
module.exports = PosterMaker;
```

构造函数中需要指定字体文件的位置和底图的位置，TextToSVG需要知道字体文件才能正确的转换中文。`_options`中也是TextToSVG所需的一些配置。`_bg`是底图的位置，拼接的时时候需要用到。

`generatePoster`接受用户的头像Buffer和昵称，Sharp是可以直接接受Buffer为输入的，所以我们接下来的所有的操作都在内存中进行。首先处理文字部分

```js
const svg = this._textToSVG.getSVG('你好' + nickname, this._options);
const textImg = Buffer.from(svg);
```

由于TextToSVG转换的结果只是svg字符串，我们只需用`Buffer.from()`方法将其转换为Buffer即可。`textImg`就是转换的结果，后续会使用。

接着处理头像，由于avatar已经是Buffer类型我们只需对其尺寸进行调整即可，使用Sharp将底图加载，然后链式调用`composite`方法，根据它的[文档](https://sharp.pixelplumbing.com/en/stable/api-composite/)说明，这个方法接受一个数组，数组中的每一项是一张图片的描述，包括图像输入（input）和位置（left/top）。最后使用`toBuffer()`输出海报。

**拼接示意图**

![1565577417256.png](https://i.loli.net/2019/08/12/rjXxU3cFRY4TvwM.png)

```js
return await sharp(this._bg)
  .composite([
    {
      input: await sharp(avatar)
        .resize(200, 200)
        .toBuffer(),
      left: 63,
      top: 69
    },
    {
      input: textImg,
      top: 307,
      left: 63
    }
  ])
  .toBuffer();
```

总体的代码如下

```js
/**
* 根据用户头像和昵称生成海报图片
* @param {Buffer} avatar
* @param {String} nickname
*/
async generatePoster(avatar, nickname) {
// 生成昵称图像
const svg = this._textToSVG.getSVG('你好' + nickname, this._options);
const textImg = Buffer.from(svg);
return await sharp(this._bg)
  .composite([
    {
      input: await sharp(avatar)
        .resize(200, 200)
        .toBuffer(),
      left: 63,
      top: 69
    },
    {
      input: textImg,
      top: 307,
      left: 63
    }
  ])
  .toBuffer();
}
```

## 临时素材上传部分

微信公众号在自动回复图片时需要将图片上传为临时素材才可以回复，所以拿到生成好的海报之后需要将其上传为临时素材。

> 公众号经常有需要用到一些临时性的多媒体素材的场景，例如在使用接口特别是发送消息时，对多媒体文件、多媒体消息的获取和调用等操作，是通过media_id来进行的。素材管理接口对所有认证的订阅号和服务号开放。通过本接口，公众号可以新增临时素材（即上传临时多媒体文件）。

上传临时素材的接口微信公众号的文档中描述的很详细，不管是任何接口都需要先获取`access_token`才能操作，有关这一部分的内容可以自行阅读官方文档[获取access_token](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183)这一部分。

> access_token是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用access_token。开发者需要进行妥善保存。access_token的存储至少要保留512个字符空间。access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。

所以我们构造一个token管理类：

```js
class AccessTokenManager {
  /**
   * 根据APPID和APPSECRET生成ACCESS_TOKEN管理器
   * @param {String} APPID
   * @param {String} APPSECRET
   * @param {String} path token缓存路径
   */
  constructor(APPID, APPSECRET, path) {
    this._URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
    this._path = path;
    try {
      const buffer = fs.readFileSync(this._path);
      const { token, exp } = JSON.parse(buffer.toString());
      this._token = token;
      this._exp = exp;
    } catch (err) {
      this._token = null;
      this._exp = null;
    }
  }

  async _fetchToken() {
    try {
      const { data } = await axios.get(this._URL);
      // 返回token和过期时间
      // Date.now()返回的是毫秒，微信接口返回的有效时间是秒
      return [data.access_token, Date.now() + data.expires_in * 1000];
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  _persistToken() {
    fs.writeFileSync(
      this._path,
      JSON.stringify({
        token: this._token,
        exp: this._exp
      })
    );
  }

  async getToken() {
    // 如过token还未获取或token已过期则重新获取
    if (!this._token || Date.now() >= this._exp) {
      const [token, exp] = await this._fetchToken();
      // const [token, exp] = ['token', Date.now()];
      this._token = token;
      this._exp = exp;
      // 持久化结果
      this._persistToken();
    }
    return this._token;
  }
}
```

其实就是在获取token的同时记录下来token到期时间，每次获取token先从缓存中查看是否到期若没有到期则直接使用缓存的数据不再重新获取。

接着我们开始编写`uploadTempImg`方法，根据文档：

**接口调用请求说明**

```plaintext
http请求方式：POST/FORM，使用https
https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE
调用示例（使用curl命令，用FORM表单方式上传一个多媒体文件）：
curl -F media=@test.jpg "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE"
```

**参数说明**

| 参数         | 是否必须 | 说明                                                         |
| :----------- | :------- | :----------------------------------------------------------- |
| access_token | 是       | 调用接口凭证                                                 |
| type         | 是       | 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb） |
| media        | 是       | form-data中媒体文件标识，有filename、filelength、content-type等信息 |

由于axios默认不支持multipart/form-data类型的数据的上传我们使用[form-data](https://www.npmjs.com/form-data)库结合axios进行表单数据上传。

```js
async function uploadTempImg(buffer) {
  const token = await accessTokenManager.getToken();
  const url = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${token}&type=image`;
  const formData = new FormData();
  formData.append('media', buffer, {
    filename: 'temp.jpg',
    contentType: 'image/jpeg'
  });
  try {
    const response = await axios({
      method: 'POST',
      url: url,
      data: formData.getBuffer(),
      headers: formData.getHeaders()
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
```

这里还是有坑的，首先由于Buffer类型的数据没有文件名文件类型等信息所以需要我们在formData中手动指定，文件名是可以重复的随便设置一个就可以，**如果这些信息确缺失公众号是不会识别的**。其次，根据form-data的官方文档应当是在axios中的data属性中直接传form本身但是屡次尝试之后，上传的图片均不能被识别，**改用`formData.getBuffer()`后成功了**，最后就是headers了，这里不建议手动设置，form-data已经提供了`getHeaders()`的方法直接调用即可。

## 自动回复部分

我们使用了Express和wechat这两个库来搭建我们的自动回复消息接口服务器。Express已经很熟悉了二话不说先搭建一个Hello World，当然我们也需要进行一些初始化工作：

```js
const express = require('express');
const wechat = require('wechat');
const axios = require('axios');
const FormData = require('form-data');

// 从配置文件读取APPID和APPSECRET
const { APPID, APPSECRET } = require('./wechat.config');
const AccessTokenManager = require('./lib/access-token-manager');
const PosterMaker = require('./lib/poster-maker');

const app = express();
// 初始化海报生成器
const posterMaker = new PosterMaker(
  './fonts/simhei.ttf',
  './images/poster.jpg'
);
// 初始化token管理器
const accessTokenManager = new AccessTokenManager(
  APPID,
  APPSECRET,
  './access_token'
);

// 这里的配置为wechat中间件需要的，详细配置可以去github查找
const config = {
  token: 'token',
  appid: APPID,
  checkSignature: true
};

app.use(express.query());

app.get('/', (req, res, next) => {
  res.send('<h1>wechat</h1>');
});

app.listen(4000, () => {
  console.log('running...');
});

// 为了方便直接将这个函数放在这里了
async function uploadTempImg(buffer) {
  ......
}
```

完成这些操作之后开始编写自动回复部分：

```js
app.use(
  '/wechat',
  wechat(config, async (req, res, next) => {
    if (req.weixin.Content == '奖品') {
      const openID = req.weixin.FromUserName;
      const token = await accessTokenManager.getToken();
      // 获取用户信息
      const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${token}&openid=${openID}&lang=zh_CN`;
      const userInfoResponse = await axios.get(url);
      // 获取用户头像链接和用户昵称
      const { headimgurl, nickname } = userInfoResponse.data;
      // 加载用户头像到buffer
      const avatarResponse = await axios.get(headimgurl, {
        responseType: 'arraybuffer'
      });
      const avatar = avatarResponse.data;
      // 生成海报
      const posterBuffer = await posterMaker.generatePoster(avatar, nickname);
      // 上传临时素材
      const mediaInfo = await uploadTempImg(posterBuffer);
      // 回复信息
      res.reply({
        type: 'image',
        content: {
          mediaId: mediaInfo.media_id
        }
      });
    } else {
      res.reply('回复“奖品”获取您的专属海报！');
    }
  })
);
```

当有信息进来的时候，有关消息的内容会被放进`req.weixin`中，其中包含有消息内容和用户OpenID，通过OpenID就可以获取用户更多的信息。

> 在关注者与公众号产生消息交互后，公众号可获得关注者的OpenID（加密后的微信号，每个用户对每个公众号的OpenID是唯一的。对于不同公众号，同一用户的openid不同）。公众号可通过本接口来根据OpenID获取用户基本信息，包括昵称、头像、性别、所在城市、语言和关注时间。

所以第一步调用[获取用户基本信息](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140839)的接口，获取到用户的头像地址和昵称，得到头像地址就可以通过http将头像加载进Buffer，**这一步注意要设置axios的responseType为arraybuffer**，然后调用我们已经生成好的posterMaker实例去生成海报图像，接着将海报上传到临时素材就可以拿到media_id了。

根据wechat的文档只需要拿到media_id就可以回复给用户了。

```js
// 回复图片
res.reply({
  type: "image",
  content: {
    mediaId: 'mediaId'
  }
});
```

## 效果

![ezgif-4-ba6194f874a3.gif](https://i.loli.net/2019/08/12/pxrBY7ZEkU2Vdcl.gif)

