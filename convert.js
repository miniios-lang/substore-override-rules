/*!
powerfullz 的 Substore 订阅转换脚本（已定制：静态代理组 + 静态规则）
https://github.com/powerfullz/override-rules

支持的传入参数：
- ipv6: 启用 IPv6 支持（默认 false）
- tun: 启用 TUN 模式（默认 false）
- full: 输出完整配置（适合纯内核启动，默认 false）
- keepalive: 启用 tcp-keep-alive（默认 false）
- fakeip: DNS 使用 FakeIP 模式（默认 true；传 false 时为 RedirHost）

代理组与规则为静态配置：
- 代理组：Manual（全节点）/ Global / Streaming / Apple / Microsoft / Google / AI / Social / Telegram / Game / Emby / Spotify / Final / 香港/美国/新加坡/日本/台湾
- 地区组使用 include-all + filter 自动匹配节点，无匹配节点时回落 DIRECT
- 规则：XPTV 直连列表（内联）+ Repcz Egern 规则集（rule-providers）+ GEOIP,CN,DIRECT + MATCH,Final
*/
"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/utils.ts
  function parseBool(value, defaultValue = false) {
    if (typeof value === "undefined") return defaultValue;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return value.toLowerCase() === "true" || value === "1";
    }
    return false;
  }
  function isNotNull(v) {
    return v !== null;
  }
  var init_utils = __esm({
    "src/utils.ts"() {
      "use strict";
    }
  });

  // src/constants.ts
  var CDN_URL;
  var init_constants = __esm({
    "src/constants.ts"() {
      "use strict";
      init_utils();
      CDN_URL = "https://cdn.jsdelivr.net";
    }
  });

  // src/args.ts
  function buildFeatureFlags(args) {
    return {
      ipv6Enabled: parseBool(args.ipv6),
      fullConfig: parseBool(args.full),
      keepAliveEnabled: parseBool(args.keepalive),
      fakeIPEnabled: parseBool(args.fakeip, true),
      tunEnabled: parseBool(args.tun)
    };
  }
  var init_args = __esm({
    "src/args.ts"() {
      "use strict";
      init_utils();
    }
  });

  // src/proxy_groups.ts
  function buildProxyGroups({ allNodes, nodes }) {
    const regionGroups = ["HongKong", "Japan", "Singapore", "United States", "Taiwan"];
    const regionPolicies = [...regionGroups, "Other", "Manual"];
    const regionFilters = {
      HongKong: "(?i)🇭🇰|香港|HongKong|Hongkong|HKG|\\bHK\\b|\\bHong\\b",
      Japan: "(?i)🇯🇵|日本|东京|JPN|\\bJP\\b|\\bJapan\\b",
      Singapore: "(?i)🇸🇬|新加坡|狮|SIN|\\bSG\\b|\\bSingapore\\b",
      "United States": "(?i)🇺🇸|美国|洛杉矶|圣何塞|USA|UnitedStates|\\bUS\\b|\\bUnited States\\b",
      Taiwan: "(?i)🇨🇳|🇹🇼|台湾|TWN|TPE|\\bTW\\b|\\bTai\\b|\\bTaiwan\\b"
    };
    const isRegionNode = (name) => Object.values(regionFilters).some((f) => new RegExp(f.replace(/^\(\?i\)/, ""), "i").test(name));
    const otherNodes = (nodes || []).filter((node) => !isRegionNode(node.name || "")).map((node) => node.name);
    return [
      {
        name: "Manual",
        type: "select",
        proxies: allNodes,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png"
      },
      {
        name: "Global",
        type: "select",
        proxies: regionPolicies,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Global.png"
      },
      {
        name: "Streaming",
        type: "select",
        proxies: regionPolicies,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/YouTube.png"
      },
      {
        name: "Apple",
        type: "select",
        proxies: ["DIRECT", ...regionPolicies],
        icon: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/qure/color/Apple_2.png"
      },
      {
        name: "Microsoft",
        type: "select",
        proxies: ["DIRECT", ...regionPolicies],
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png"
      },
      {
        name: "Google",
        type: "select",
        proxies: regionPolicies,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Google_Search.png"
      },
      {
        name: "AI",
        type: "select",
        proxies: regionPolicies,
        icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/OpenAI.png"
      },
      {
        name: "Social",
        type: "select",
        proxies: regionPolicies,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Twitter.png"
      },
      {
        name: "Telegram",
        type: "select",
        proxies: regionPolicies,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Telegram.png"
      },
      {
        name: "Game",
        type: "select",
        proxies: ["DIRECT", ...regionPolicies],
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Game.png"
      },
      {
        name: "Emby",
        type: "select",
        proxies: allNodes,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Emby.png"
      },
      {
        name: "Spotify",
        type: "select",
        proxies: regionPolicies,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Spotify.png"
      },
      {
        name: "Final",
        type: "select",
        proxies: regionPolicies,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png"
      },
      {
        name: "HongKong",
        type: "select",
        "include-all": true,
        filter: regionFilters.HongKong,
        "exclude-filter": "(?i)Manual",
        flatten: true,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png"
      },
      {
        name: "Japan",
        type: "select",
        "include-all": true,
        filter: regionFilters.Japan,
        "exclude-filter": "(?i)Manual",
        flatten: true,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png"
      },
      {
        name: "Singapore",
        type: "select",
        "include-all": true,
        filter: regionFilters.Singapore,
        "exclude-filter": "(?i)Manual",
        flatten: true,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png"
      },
      {
        name: "United States",
        type: "select",
        "include-all": true,
        filter: regionFilters["United States"],
        "exclude-filter": "(?i)Manual",
        flatten: true,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png"
      },
      {
        name: "Taiwan",
        type: "select",
        "include-all": true,
        filter: regionFilters.Taiwan,
        "exclude-filter": "(?i)Manual",
        flatten: true,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png"
      },
      {
        name: "Other",
        type: "select",
        proxies: otherNodes,
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Area.png"
      }
    ];
  }
  var init_proxy_groups = __esm({
    "src/proxy_groups.ts"() {
      "use strict";
      init_constants();
      init_utils();
    }
  });

  // src/node_parser.ts
  function parseTailscale(nodes) {
    return (nodes || []).filter((proxy) => proxy.type === "tailscale" || false);
  }

  // src/rules.ts
  var XPTV_RULES = [
    "DOMAIN-SUFFIX,xptvhelper.link,DIRECT",
    "DOMAIN,gateway.icloud.com,DIRECT",
    "DOMAIN,metrics.icloud.com,DIRECT",
    "DOMAIN-SUFFIX,doubanio.com,DIRECT",
    "DOMAIN,image.tmdb.org,DIRECT",
    "DOMAIN,dandanplay.net,DIRECT",
    "DOMAIN-SUFFIX,aliyundrive.com,DIRECT",
    "DOMAIN-SUFFIX,voicehub.top,DIRECT",
    "DOMAIN-SUFFIX,quark.cn,DIRECT",
    "DOMAIN-SUFFIX,189.cn,DIRECT",
    "DOMAIN-SUFFIX,ctyunxs.cn,DIRECT",
    "DOMAIN-SUFFIX,115.com,DIRECT",
    "DOMAIN-SUFFIX,uc.cn,DIRECT",
    "DOMAIN-SUFFIX,xiaoya.pro,DIRECT",
    "DOMAIN,mihdr.top,DIRECT",
    "DOMAIN-SUFFIX,mogg.top,DIRECT",
    "DOMAIN-SUFFIX,wogg.one,DIRECT",
    "DOMAIN,www.leijing.xyz,DIRECT",
    "DOMAIN,xzys.fun,DIRECT",
    "DOMAIN-SUFFIX,duopan.fun,DIRECT",
    "DOMAIN,www.nanf.cc,DIRECT",
    "DOMAIN,yydsys.top,DIRECT",
    "DOMAIN,woog.nxog.eu.org,DIRECT",
    "DOMAIN,yunpan8.cc,DIRECT",
    "DOMAIN-SUFFIX,bilivideo.com,DIRECT",
    "DOMAIN,slink.ltd,DIRECT",
    "DOMAIN-SUFFIX,douyincdn.com,DIRECT",
    "DOMAIN-SUFFIX,douyinpic.com,DIRECT",
    "DOMAIN-SUFFIX,douyucdn.cn,DIRECT",
    "DOMAIN-SUFFIX,douyucdn2.cn,DIRECT",
    "DOMAIN-SUFFIX,huya.com,DIRECT",
    "DOMAIN-SUFFIX,msstatic.com,DIRECT",
    "DOMAIN,lemonlive.deno.dev,DIRECT",
    "DOMAIN-SUFFIX,ddys.pro,DIRECT",
    "DOMAIN-SUFFIX,agedm.org,DIRECT",
    "DOMAIN,anime.girigirilove.com,DIRECT",
    "DOMAIN,love.girigirilove.com,DIRECT",
    "DOMAIN,m3u8.girigirilove.com,DIRECT",
    "DOMAIN,api.9cec79d.com,DIRECT",
    "DOMAIN,wjm.kemfsj.com,DIRECT",
    "DOMAIN,www.4k-av.com,DIRECT",
    "IP-CIDR,43.142.232.217/32,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,fanchenstatic.com,DIRECT",
    "DOMAIN,i0.hdslb.com,DIRECT",
    "DOMAIN-SUFFIX,bsgslb.cn,DIRECT",
    "DOMAIN-SUFFIX,bytetos.com,DIRECT",
    "DOMAIN-SUFFIX,douyinvod.com,DIRECT",
    "DOMAIN-SUFFIX,byteimg.com,DIRECT",
    "IP-CIDR,110.41.171.181/32,DIRECT,no-resolve",
    "IP-CIDR,49.235.143.104/32,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,xhscdn.com,DIRECT",
    "DOMAIN-SUFFIX,bdxiguastatic.com,DIRECT",
    "DOMAIN-SUFFIX,zshtys888.com,DIRECT",
    "DOMAIN,www.libvio.cc,DIRECT",
    "DOMAIN-SUFFIX,mcloud.139.com,DIRECT",
    "DOMAIN-SUFFIX,libvio.cloud,DIRECT",
    "DOMAIN-SUFFIX,anfuns.org,DIRECT",
    "DOMAIN-SUFFIX,bytegiftia.top,DIRECT",
    "DOMAIN-SUFFIX,lenovo.com.cn,DIRECT",
    "DOMAIN,image.zhihuishu.com,DIRECT",
    "DOMAIN,presale.111.com.cn,DIRECT",
    "DOMAIN,hdmoli.pro,DIRECT",
    "DOMAIN,v.damoli.pro,DIRECT",
    "DOMAIN,www.xlys01.com,DIRECT",
    "DOMAIN,saohuo.tv,DIRECT",
    "DOMAIN-SUFFIX,video.iqiyi.com,DIRECT",
    "DOMAIN-SUFFIX,qitu-zuida.com,DIRECT",
    "DOMAIN,om.tc.qq.com,DIRECT",
    "DOMAIN-SUFFIX,ibytedtos.com,DIRECT",
    "DOMAIN-SUFFIX,1ljx.com,DIRECT",
    "DOMAIN-SUFFIX,smtcdns.com,DIRECT",
    "DOMAIN,cme-video.vod-qcloud.com,DIRECT",
    "DOMAIN,hhjx.hhplayer.com,DIRECT",
    "DOMAIN,www.novipnoad.net,DIRECT",
    "DOMAIN-SUFFIX,novipnoad.net,DIRECT",
    "DOMAIN,www.hanjukankan.com,DIRECT",
    "DOMAIN,glzx.thekutv.com,DIRECT",
    "DOMAIN-SUFFIX,thehanju.com,DIRECT",
    "DOMAIN-SUFFIX,vvddoo.com,DIRECT",
    "DOMAIN,qiniu.rongjuwh.cn,DIRECT",
    "DOMAIN,app.whjzjx.cn,DIRECT",
    "DOMAIN,u.shytkjgs.com,DIRECT",
    "IP-CIDR,218.22.23.189/32,DIRECT,no-resolve",
    "IP-CIDR,117.68.35.135/32,DIRECT,no-resolve",
    "IP-CIDR,218.22.23.229/32,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,qnqcdn.net,DIRECT",
    "DOMAIN-SUFFIX,xingya.com.cn,DIRECT",
    "IP-CIDR,117.68.35.139/32,DIRECT,no-resolve",
    "IP-CIDR,163.123.192.184/32,DIRECT,no-resolve",
    "IP-CIDR,148.59.74.50/32,DIRECT,no-resolve",
    "IP-CIDR,205.178.182.17/32,DIRECT,no-resolve",
    "IP-CIDR,163.123.192.169/32,DIRECT,no-resolve",
    "IP-CIDR,163.123.192.68/32,DIRECT,no-resolve",
    "IP-CIDR,163.123.192.182/32,DIRECT,no-resolve",
    "IP-CIDR,205.178.182.8/32,DIRECT,no-resolve",
    "IP-CIDR,163.123.192.108/32,DIRECT,no-resolve",
    "IP-CIDR,163.123.192.29/32,DIRECT,no-resolve",
    "IP-CIDR,205.178.182.52/32,DIRECT,no-resolve",
    "IP-CIDR,163.123.192.17/32,DIRECT,no-resolve",
    "DOMAIN,c.xpgtv.net,DIRECT",
    "DOMAIN,www.czzyvideo.com,DIRECT",
    "DOMAIN,qimgs.qunarzz.com,DIRECT",
    "DOMAIN,lf16-fe.resso.me,DIRECT",
    "DOMAIN-SUFFIX,akamaized.net,DIRECT",
    "DOMAIN,t001.czzy.fun,DIRECT",
    "DOMAIN,vunyundun.czys.art,DIRECT",
    "DOMAIN-SUFFIX,larksuitecdn.com,DIRECT",
    "DOMAIN,dc.xhscdn.com,DIRECT",
    "DOMAIN,mdn.alipayobjects.com,DIRECT",
    "DOMAIN,op.ysdqjs.cn,DIRECT",
    "DOMAIN-SUFFIX,zxzja.com,DIRECT",
    "DOMAIN,www.subaibaiys.com,DIRECT",
    "DOMAIN,360zy.com,DIRECT",
    "DOMAIN,vod.lyhuicheng.com,DIRECT",
    "DOMAIN-KEYWORD,ffzy,DIRECT",
    "DOMAIN,www.mdzyapi.com,DIRECT",
    "DOMAIN-SUFFIX,heimuer.tv,DIRECT",
    "DOMAIN-SUFFIX,heimuer.xyz,DIRECT",
    "DOMAIN,2bzfvku2xwu7.com,DIRECT",
    "DOMAIN,n9ihkvv1ytjr.com,DIRECT",
    "DOMAIN,0cicgw0mte7y.com,DIRECT",
    "DOMAIN,r5oa1oqwh6gz.com,DIRECT",
    "DOMAIN,knfuzimvbmwr.com,DIRECT",
    "DOMAIN,ucul8pjt6v6h.com,DIRECT",
    "DOMAIN,5pvheva17etb.com,DIRECT",
    "DOMAIN,k6qgunhk9wuk.com,DIRECT",
    "DOMAIN,0uxzzy8thov3.com,DIRECT",
    "DOMAIN,5dagx9am9sai.com,DIRECT",
    "DOMAIN,omgyesityyhl.com,DIRECT",
    "DOMAIN,eucjzvub6vhr.com,DIRECT",
    "DOMAIN,tficf2xx0qxr.com,DIRECT",
    "DOMAIN,zqmdvefdijjx.com,DIRECT",
    "DOMAIN,jzuqfavoibww.com,DIRECT",
    "DOMAIN,in1eab44tnda.com,DIRECT",
    "DOMAIN,nfysfaemv1m2.com,DIRECT",
    "DOMAIN,rfjyb3bu5j0r.com,DIRECT",
    "DOMAIN,wjmgijixqcbc.com,DIRECT",
    "DOMAIN,jvgcazuedspp.com,DIRECT",
    "DOMAIN,fmxjkp6ekzcg.com,DIRECT",
    "DOMAIN,zea35s3nhdbn.com,DIRECT",
    "DOMAIN,zehnaxihujfi.com,DIRECT",
    "DOMAIN,0nzuqy0k3c35.com,DIRECT",
    "DOMAIN,yvocwep63nev.com,DIRECT",
    "DOMAIN,navogkbbnjl4.com,DIRECT",
    "DOMAIN,xgwr4phkkafo.com,DIRECT",
    "DOMAIN,om43531gxybq.com,DIRECT",
    "DOMAIN,3lky1u69bdx2.com,DIRECT",
    "DOMAIN,438pnr4dyywt.com,DIRECT",
    "DOMAIN,mdghhsgc4iiy.com,DIRECT",
    "DOMAIN,m3u8.hmrvideo.com,DIRECT",
    "DOMAIN,hw8.live,DIRECT",
    "DOMAIN,selfcdn.simaguo.com,DIRECT",
    "DOMAIN,m3u.nikanba.live,DIRECT",
    "DOMAIN,www.fuju2024.cc,DIRECT",
    "DOMAIN-SUFFIX,yishihui.com,DIRECT",
    "DOMAIN,image.jinyingimage.com,DIRECT",
    "DOMAIN,jinyingzy.com,DIRECT",
    "DOMAIN,c.baisiweiting.com,DIRECT",
    "DOMAIN,hd.ijycnd.com,DIRECT",
    "DOMAIN,pic.okzy.xyz,DIRECT",
    "DOMAIN,wakdj.com,DIRECT",
    "DOMAIN-SUFFIX,noop44.com,DIRECT",
    "DOMAIN-SUFFIX,bxgbnet.com,DIRECT",
    "DOMAIN-SUFFIX,xxya88.com,DIRECT",
    "DOMAIN,zpsps.com,DIRECT",
    "DOMAIN-KEYWORD,bbffvip.com,DIRECT",
    "DOMAIN-KEYWORD,rrcdnbf,DIRECT",
    "DOMAIN,iqyi.xiaohuangrentv.com,DIRECT",
    "DOMAIN-KEYWORD,.jisu.com,DIRECT",
    "DOMAIN,pic.niuniuzy.info,DIRECT",
    "DOMAIN-SUFFIX,qrstt.com,DIRECT",
    "DOMAIN-SUFFIX,stuuvwy.com,DIRECT",
    "DOMAIN-SUFFIX,xingchongwang.com,DIRECT",
    "DOMAIN-SUFFIX,uvvv77.com,DIRECT",
    "DOMAIN-SUFFIX,jklnopq.com,DIRECT",
    "DOMAIN,cj.yayazy.net,DIRECT",
    "DOMAIN-SUFFIX,qdhdcate.com,DIRECT",
    "DOMAIN,cj.vodimg.top,DIRECT",
    "DOMAIN-SUFFIX,ghij11.com,DIRECT",
    "DOMAIN-SUFFIX,tlkqc.com,DIRECT",
    "DOMAIN,pic.picturecdn.com,DIRECT",
    "DOMAIN,tlkqc.com,DIRECT",
    "DOMAIN-SUFFIX,xaab57.com,DIRECT",
    "DOMAIN,api.ukuapi.com,DIRECT",
    "DOMAIN-KEYWORD,ukzy.ukubf,DIRECT",
    "DOMAIN,hhzyapi.com,DIRECT",
    "DOMAIN,play.hhuus.com,DIRECT",
    "DOMAIN,p.hhwenjian.com,DIRECT",
    "DOMAIN,jszyapi.com,DIRECT",
    "DOMAIN,snzypic.vip,DIRECT",
    "DOMAIN-KEYWORD,.hiij,DIRECT",
    "DOMAIN-SUFFIX,nopqq.vip,DIRECT",
    "DOMAIN-SUFFIX,uvwwx.vip,DIRECT",
    "DOMAIN-SUFFIX,pqqrs.vip,DIRECT",
    "DOMAIN-SUFFIX,qrssv.com,DIRECT",
    "DOMAIN,www.imgikzy.com,DIRECT",
    "DOMAIN,kkzycdn.com,DIRECT",
    "DOMAIN,bfikuncdn.com,DIRECT",
    "DOMAIN,cj.lziapi.com,DIRECT",
    "DOMAIN,img.lzzyimg.com,DIRECT",
    "DOMAIN-KEYWORD,v.cdnlz,DIRECT",
    "DOMAIN-SUFFIX,bfzypic.com,DIRECT",
    "DOMAIN,bfzyapi.com,DIRECT",
    "DOMAIN-SUFFIX,bfllvip.com,DIRECT",
    "DOMAIN,www.hongniuzy2.com,DIRECT",
    "DOMAIN,hn.bfvvs.com,DIRECT",
    "DOMAIN,hnts.ymuuy.com,DIRECT",
    "DOMAIN,caijl.kczyapi.com,DIRECT",
    "DOMAIN-SUFFIX,fghjklm.com,DIRECT",
    "DOMAIN-SUFFIX,ijkklmn.com,DIRECT",
    "DOMAIN-SUFFIX,longshengtea.com,DIRECT",
    "DOMAIN-SUFFIX,stuuv.vip,DIRECT",
    "DOMAIN,sdzyapi.com,DIRECT",
    "DOMAIN-SUFFIX,qrrs56.com,DIRECT",
    "DOMAIN-SUFFIX,wwxy0.com,DIRECT",
    "DOMAIN-SUFFIX,fentvoss.com,DIRECT",
    "DOMAIN,m3u8.apiyhzy.com,DIRECT",
    "DOMAIN-SUFFIX,ijkkl.vip,DIRECT",
    "DOMAIN-SUFFIX,abcce.vip,DIRECT",
    "DOMAIN-SUFFIX,mmnn34.com,DIRECT",
    "DOMAIN-SUFFIX,vwxx78.com,DIRECT",
    "DOMAIN-SUFFIX,stttu.vip,DIRECT",
    "DOMAIN-SUFFIX,tuvvv.vip,DIRECT",
    "DOMAIN-SUFFIX,ijkmnno.com,DIRECT",
    "DOMAIN-SUFFIX,deefg.vip,DIRECT",
    "DOMAIN-SUFFIX,lmnoprs.com,DIRECT",
    "DOMAIN-KEYWORD,shes,DIRECT",
    "DOMAIN-SUFFIX,yhzybf.com,DIRECT",
    "DOMAIN-SUFFIX,wgslsw.com,DIRECT",
    "DOMAIN,pic.jegms.com,DIRECT",
    "DOMAIN,collect.wolongzyw.com,DIRECT",
    "DOMAIN,pic.wlongimg.com,DIRECT",
    "DOMAIN-KEYWORD,cdn.wls,DIRECT",
    "DOMAIN-KEYWORD,cdn.wlcdn,DIRECT",
    "DOMAIN-KEYWORD,.huya,DIRECT",
    "DOMAIN,p2100.net,DIRECT",
    "DOMAIN,api.wujinapi.com,DIRECT",
    "DOMAIN-SUFFIX,stuv67.com,DIRECT",
    "DOMAIN-SUFFIX,hjjk22.com,DIRECT",
    "DOMAIN-SUFFIX,jkkl23.com,DIRECT",
    "DOMAIN,v5.xyaa88.com,DIRECT",
    "DOMAIN-KEYWORD,subo,DIRECT",
    "DOMAIN,play.subokk.com,DIRECT",
    "DOMAIN-SUFFIX,xlzyd.com,DIRECT",
    "DOMAIN,caiji.moduapi.cc,DIRECT",
    "DOMAIN,www.mdzypic.com,DIRECT",
    "DOMAIN-KEYWORD,play.modujx,DIRECT",
    "DOMAIN,ok.zuidapic.com,DIRECT",
    "DOMAIN,zuidazy.me,DIRECT",
    "DOMAIN-SUFFIX,daayee.com,DIRECT",
    "DOMAIN,xinlangtupian.com,DIRECT",
    "DOMAIN,play.xluuss.com,DIRECT",
    "DOMAIN-SUFFIX,monidai.com,DIRECT",
    "DOMAIN-SUFFIX,hdslb.pro,DIRECT",
    "DOMAIN,vdownload.hembed.com,DIRECT",
    "DOMAIN,surrit.com,DIRECT",
    "DOMAIN,streamtape.com,DIRECT",
    "DOMAIN-SUFFIX,tapecontent.net,DIRECT",
    "DOMAIN,api.maiyoux.com,DIRECT",
    "DOMAIN-SUFFIX,xinzhisoft.xyz,DIRECT",
    "DOMAIN-SUFFIX,zhenyidaoxinxi.top,DIRECT",
    "DOMAIN-SUFFIX,xinzhitushu.xyz,DIRECT",
    "DOMAIN-SUFFIX,dmtmax.cn,DIRECT",
    "DOMAIN-SUFFIX,anfangmart.cn,DIRECT",
    "DOMAIN-SUFFIX,dapengjiaoyu.top,DIRECT",
    "DOMAIN-SUFFIX,aliyuncs.com,DIRECT",
    "DOMAIN-SUFFIX,kdfwz.top,DIRECT",
    "DOMAIN-SUFFIX,knzaol.cn,DIRECT",
    "DOMAIN-SUFFIX,bndmpsjx.com,DIRECT",
    "DOMAIN,slapibf.com,DIRECT",
    "DOMAIN,fmtu.sltututu.com,DIRECT",
    "DOMAIN-SUFFIX,bbffsl.com,DIRECT",
    "DOMAIN,apittzy.com,DIRECT",
    "DOMAIN,vod1.ttbfp2.com,DIRECT",
    "DOMAIN,aosikazy.com,DIRECT",
    "DOMAIN,bfaskcdn.com,DIRECT",
    "DOMAIN,uqetyzxa.com,DIRECT",
    "DOMAIN,api.apilyzy.com,DIRECT",
    "DOMAIN,img.lytuchuang91.com,DIRECT",
    "DOMAIN-SUFFIX,laoyacdn.com,DIRECT",
    "DOMAIN,666529.xyz,DIRECT",
    "DOMAIN,91md.me,DIRECT",
    "DOMAIN-SUFFIX,97img.com,DIRECT",
    "DOMAIN,cctv123456.com,DIRECT",
    "DOMAIN-SUFFIX,cdn2020.com,DIRECT",
    "DOMAIN,img.yikanimg.top,DIRECT",
    "DOMAIN,api.yikanapi.com,DIRECT",
    "DOMAIN,v.ykv3.com,DIRECT",
    "DOMAIN,fm.fhpicpic.com,DIRECT",
    "DOMAIN,fhapi9.com,DIRECT",
    "DOMAIN,v2024.fhbbff.com,DIRECT",
    "DOMAIN,sycdn.ddljsytt.com,DIRECT",
    "DOMAIN,v2024.sysybf.com,DIRECT",
    "DOMAIN,fm.lbpicpic.com,DIRECT",
    "DOMAIN,lbapiby.com,DIRECT",
    "DOMAIN,vip3.lbbf9.com,DIRECT",
    "DOMAIN,player.hgplayer00.com,DIRECT",
    "DOMAIN,img.hgimg00.com,DIRECT",
    "DOMAIN,sbzytpimg2.com,DIRECT",
    "DOMAIN,apiyutu.com,DIRECT",
    "DOMAIN,yutubf.lsbbf3.com,DIRECT",
    "DOMAIN-SUFFIX,newljlj.com,DIRECT",
    "DOMAIN,ljcdn.ddljsytt.com,DIRECT",
    "DOMAIN,guzwiayz.com,DIRECT",
    "DOMAIN,naixxzy.com,DIRECT",
    "DOMAIN,nxxplayurl.com,DIRECT",
    "DOMAIN,jinpinxm.com,DIRECT",
    "DOMAIN-KEYWORD,jingpinx.com,DIRECT",
    "DOMAIN,05hao.top,DIRECT",
    "DOMAIN,www.caoliuzyw.com,DIRECT",
    "DOMAIN-SUFFIX,comodoca.com,DIRECT",
    "DOMAIN-SUFFIX,usertrust.com,DIRECT",
    "DOMAIN-SUFFIX,sectigo.com,DIRECT",
    "DOMAIN-SUFFIX,caoliuzywimg.com,DIRECT",
    "DOMAIN,player.cl9987.com,DIRECT",
    "DOMAIN,apilsbzy1.com,DIRECT",
    "DOMAIN,img.kuaichezy.net,DIRECT",
    "DOMAIN,puui.qpic.cn,DIRECT",
    "DOMAIN-SUFFIX,jisuimage.com,DIRECT",
    "DOMAIN-SUFFIX,toutiaoimg.com,DIRECT",
    "DOMAIN-SUFFIX,yzzyimages.com,DIRECT",
    "DOMAIN,hhmage.com,DIRECT",
    "DOMAIN,wework.qpic.cn,DIRECT",
    "DOMAIN,pic.rmb.bdstatic.com,DIRECT",
    "DOMAIN-SUFFIX,alicdn.com,DIRECT",
    "DOMAIN-SUFFIX,ykimg.com,DIRECT",
    "DOMAIN-SUFFIX,netease.com,DIRECT",
    "DOMAIN-SUFFIX,gtimg.cn,DIRECT",
    "DOMAIN-SUFFIX,meituan.net,DIRECT",
    "DOMAIN,mdn.alipay.com,DIRECT",
    "DOMAIN,fc.sinaimg.cn,DIRECT",
    "DOMAIN,img.moegirl.org.cn,DIRECT",
    "DOMAIN,pic8.iqiyipic.com,DIRECT",
    "DOMAIN,p0.qhimg.com,DIRECT",
    "DOMAIN-SUFFIX,iqiyipic.com,DIRECT",
    "DOMAIN,api.zaqohu.com,DIRECT",
    "DOMAIN,images.67c6c7a.com,DIRECT",
    "DOMAIN,pic7.58cdn.com.cn,DIRECT",
    "DOMAIN,help-ol.bj.bcebos.com,DIRECT",
    "DOMAIN-SUFFIX,loli.net,DIRECT",
    "DOMAIN-SUFFIX,360buyimg.com,DIRECT",
    "DOMAIN,pic1.imgyzzy.com,DIRECT",
    "DOMAIN,get.sogou.com,DIRECT",
    "DOMAIN,open.bigmodel.cn,DIRECT",
    "DOMAIN,vcover-vt-pic.puui.qpic.cn,DIRECT",
    "DOMAIN,fs-im-kefu.7moor-fs1.com,DIRECT",
    "DOMAIN,img.image8899.net,DIRECT",
    "DOMAIN,img.picgo.net,DIRECT",
    "DOMAIN,pic3.yzzyimages.com,DIRECT",
    "DOMAIN,647bc185.szrtcpa.com,DIRECT",
    "DOMAIN,img.98ha.com,DIRECT",
    "DOMAIN,challenge.rivers.chaitin.cn,DIRECT",
    "DOMAIN,image.maimn.com,DIRECT",
    "DOMAIN-SUFFIX,baidu.com,DIRECT",
    "DOMAIN,img.liangzipic.com,DIRECT",
    "DOMAIN,imagev2.xmcdn.com,DIRECT",
    "DOMAIN,pic.imgdb.cn,DIRECT",
    "DOMAIN,pic3.yzzyimg.online,DIRECT",
    "DOMAIN,wx4.sinaimg.cn,DIRECT",
    "DOMAIN,img.jisuimage.com,DIRECT",
    "DOMAIN,pic.wujinpp.com,DIRECT",
    "DOMAIN,suboimage.com,DIRECT",
    "DOMAIN,img.ffzy888.com,DIRECT"
  ];
  function buildRules() {
    return [
      `IP-CIDR,65.49.212.137/32,DIRECT`,
      ...XPTV_RULES,
      `DOMAIN-SUFFIX,apps.apple.com,Apple`,
      `RULE-SET,Direct,DIRECT`,
      `RULE-SET,Reject,REJECT`,
      `RULE-SET,AI,AI`,
      `RULE-SET,Telegram,Telegram`,
      `RULE-SET,Twitter,Social`,
      `RULE-SET,Facebook,Social`,
      `RULE-SET,TikTok,Social`,
      `RULE-SET,Game,Game`,
      `RULE-SET,Google,Google`,
      `RULE-SET,Github,Microsoft`,
      `RULE-SET,Microsoft,Microsoft`,
      `RULE-SET,Emby,Emby`,
      `RULE-SET,Spotify,Spotify`,
      `RULE-SET,Bahamut,Streaming`,
      `RULE-SET,Netflix,Streaming`,
      `RULE-SET,Disney,Streaming`,
      `RULE-SET,PrimeVideo,Streaming`,
      `RULE-SET,HBO,Streaming`,
      `RULE-SET,Proxy,Global`,
      `RULE-SET,AppleServers,Apple`,
      `RULE-SET,Lan,DIRECT`,
      `GEOIP,CN,DIRECT`,
      `MATCH,Final`
    ];
  }
  var init_rules = __esm({
    "src/rules.ts"() {
      "use strict";
      init_constants();
      init_utils();
    }
  });

  // src/rule_providers.ts
  var ruleProviders;
  var init_rule_providers = __esm({
    "src/rule_providers.ts"() {
      "use strict";
      init_constants();
      ruleProviders = {
        Direct: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Direct.yaml",
          path: "./ruleset/Direct.yaml"
        },
        Reject: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Reject.yaml",
          path: "./ruleset/Reject.yaml"
        },
        AI: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/AI.yaml",
          path: "./ruleset/AI.yaml"
        },
        Telegram: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Telegram.yaml",
          path: "./ruleset/Telegram.yaml"
        },
        Twitter: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Twitter.yaml",
          path: "./ruleset/Twitter.yaml"
        },
        Facebook: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Facebook.yaml",
          path: "./ruleset/Facebook.yaml"
        },
        TikTok: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/TikTok.yaml",
          path: "./ruleset/TikTok.yaml"
        },
        Game: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Game.yaml",
          path: "./ruleset/Game.yaml"
        },
        Google: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Google.yaml",
          path: "./ruleset/Google.yaml"
        },
        Github: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Github.yaml",
          path: "./ruleset/Github.yaml"
        },
        Microsoft: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Microsoft.yaml",
          path: "./ruleset/Microsoft.yaml"
        },
        Emby: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Emby.yaml",
          path: "./ruleset/Emby.yaml"
        },
        Spotify: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Spotify.yaml",
          path: "./ruleset/Spotify.yaml"
        },
        Bahamut: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Bahamut.yaml",
          path: "./ruleset/Bahamut.yaml"
        },
        Netflix: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Netflix.yaml",
          path: "./ruleset/Netflix.yaml"
        },
        Disney: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Disney.yaml",
          path: "./ruleset/Disney.yaml"
        },
        PrimeVideo: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/PrimeVideo.yaml",
          path: "./ruleset/PrimeVideo.yaml"
        },
        HBO: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/HBO.yaml",
          path: "./ruleset/HBO.yaml"
        },
        Proxy: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Proxy.yaml",
          path: "./ruleset/Proxy.yaml"
        },
        AppleServers: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/AppleServers.yaml",
          path: "./ruleset/AppleServers.yaml"
        },
        Lan: {
          type: "http",
          behavior: "classical",
          format: "yaml",
          interval: 86400,
          url: "https://github.com/Repcz/Tool/raw/X/Egern/Rules/Lan.yaml",
          path: "./ruleset/Lan.yaml"
        }
      };
    }
  });

  // src/dns.ts
  function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  function getStringList(value) {
    return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : void 0;
  }
  function mergeStringLists(current, upstream) {
    const upstreamList = getStringList(upstream);
    if (!current && !upstreamList) return void 0;
    return [.../* @__PURE__ */ new Set([...current ?? [], ...upstreamList ?? []])];
  }
  function isLocalDnsServer(value) {
    return /^(?:(?:udp|tcp|tls|https?|quic):\/\/)?(?:localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|::1|\[::1\])(?::\d+)?(?:\/|$)/i.test(
      value
    );
  }
  function mergeDnsPolicies(current, upstream) {
    if (!isRecord(upstream)) return current;
    const upstreamPolicy = {};
    for (const [key, value] of Object.entries(upstream)) {
      if (typeof value === "string") {
        upstreamPolicy[key] = value;
      } else if (getStringList(value)) {
        upstreamPolicy[key] = value;
      }
    }
    return { ...current ?? {}, ...upstreamPolicy };
  }
  function inheritDnsFields(generated, upstream) {
    if (!isRecord(upstream)) return generated;
    const merged = { ...generated };
    for (const field of DNS_LIST_FIELDS) {
      const values = mergeStringLists(merged[field], upstream[field]);
      if (values) merged[field] = values;
    }
    const hasUpstreamListen = typeof upstream.listen === "string" && upstream.listen.length > 0;
    if (hasUpstreamListen) merged.listen = upstream.listen;
    if (upstream["cache-algorithm"] === "lru" || upstream["cache-algorithm"] === "arc") {
      merged["cache-algorithm"] = upstream["cache-algorithm"];
    }
    for (const field of ["use-hosts", "use-system-hosts", "respect-rules"]) {
      if (typeof upstream[field] === "boolean") merged[field] = upstream[field];
    }
    for (const field of ["fake-ip-range", "fake-ip-range6"]) {
      if (typeof upstream[field] === "string") merged[field] = upstream[field];
    }
    if (upstream["fake-ip-filter-mode"] === "blacklist" || upstream["fake-ip-filter-mode"] === "whitelist" || upstream["fake-ip-filter-mode"] === "rule") {
      merged["fake-ip-filter-mode"] = upstream["fake-ip-filter-mode"];
    }
    if (typeof upstream["direct-nameserver-follow-policy"] === "boolean") {
      merged["direct-nameserver-follow-policy"] = upstream["direct-nameserver-follow-policy"];
    }
    if (isRecord(upstream["fallback-filter"])) {
      merged["fallback-filter"] = upstream["fallback-filter"];
    }
    for (const field of DNS_POLICY_FIELDS) {
      const policy = mergeDnsPolicies(merged[field], upstream[field]);
      if (policy) merged[field] = policy;
    }
    if (!hasUpstreamListen) {
      merged["proxy-server-nameserver"] = merged["proxy-server-nameserver"].filter(
        (server) => !isLocalDnsServer(server)
      );
    }
    const fakeIpFilter = mergeStringLists(merged["fake-ip-filter"], upstream["fake-ip-filter"]);
    if (fakeIpFilter) merged["fake-ip-filter"] = fakeIpFilter;
    return merged;
  }
  function buildDnsConfig({ mode, ipv6Enabled, fakeIpFilter }) {
    const config = {
      enable: true,
      ipv6: ipv6Enabled,
      "prefer-h3": true,
      "enhanced-mode": mode,
      nameserver: ["system", "223.5.5.5", "119.29.29.29", "180.184.1.1"],
      fallback: [
        "quic://dns0.eu",
        "https://dns.cloudflare.com/dns-query",
        "https://dns.sb/dns-query",
        "tcp://208.67.222.222",
        "tcp://8.26.56.2"
      ],
      "proxy-server-nameserver": ["tls://dot.pub", "quic://223.5.5.5"]
    };
    if (fakeIpFilter) {
      config["fake-ip-filter"] = fakeIpFilter;
    }
    return config;
  }
  function buildDns({ fakeIPEnabled, ipv6Enabled, upstreamDns }) {
    const generated = fakeIPEnabled ? buildDnsConfig({ mode: "fake-ip", ipv6Enabled, fakeIpFilter: FAKE_IP_FILTER }) : buildDnsConfig({ mode: "redir-host", ipv6Enabled });
    return inheritDnsFields(generated, upstreamDns);
  }
  var FAKE_IP_FILTER, snifferConfig, DNS_LIST_FIELDS, DNS_POLICY_FIELDS;
  var init_dns = __esm({
    "src/dns.ts"() {
      "use strict";
      FAKE_IP_FILTER = [
        "geosite:connectivity-check",
        "Mijia Cloud",
        "dig.io.mi.com",
        "localhost.ptlogin2.qq.com",
        "*.icloud.com",
        "*.stun.*.*",
        "*.stun.*.*.*",
        "*.lan",
        "*.localdomain",
        "*.example",
        "*.invalid",
        "*.localhost",
        "*.test",
        "*.local",
        "*.home.arpa",
        "time.*.com",
        "time.*.gov",
        "time.*.edu.cn",
        "time.*.apple.com",
        "time1.*.com",
        "time2.*.com",
        "time3.*.com",
        "time4.*.com",
        "time5.*.com",
        "time6.*.com",
        "time7.*.com",
        "ntp.*.com",
        "ntp1.*.com",
        "ntp2.*.com",
        "ntp3.*.com",
        "ntp4.*.com",
        "ntp5.*.com",
        "ntp6.*.com",
        "ntp7.*.com",
        "*.time.edu.cn",
        "*.ntp.org.cn",
        "+.pool.ntp.org",
        "time1.cloud.tencent.com",
        "stun.*.*",
        "stun.*.*.*",
        "swscan.apple.com",
        "mesu.apple.com",
        "music.163.com",
        "*.music.163.com",
        "*.126.net",
        "musicapi.taihe.com",
        "music.taihe.com",
        "songsearch.kugou.com",
        "trackercdn.kugou.com",
        "*.kuwo.cn",
        "api-jooxtt.sanook.com",
        "api.joox.com",
        "y.qq.com",
        "*.y.qq.com",
        "streamoc.music.tc.qq.com",
        "mobileoc.music.tc.qq.com",
        "isure.stream.qqmusic.qq.com",
        "dl.stream.qqmusic.qq.com",
        "aqqmusic.tc.qq.com",
        "amobile.music.tc.qq.com",
        "localhost.ptlogin2.qq.com",
        "*.msftconnecttest.com",
        "*.msftncsi.com",
        "*.xiami.com",
        "*.music.migu.cn",
        "music.migu.cn",
        "+.wotgame.cn",
        "+.wggames.cn",
        "+.wowsgame.cn",
        "+.wargaming.net",
        "*.*.*.srv.nintendo.net",
        "*.*.stun.playstation.net",
        "xbox.*.*.microsoft.com",
        "*.*.xboxlive.com",
        "*.ipv6.microsoft.com",
        "teredo.*.*.*",
        "teredo.*.*",
        "speedtest.cros.wr.pvp.net",
        "+.jjvip8.com",
        "www.douyu.com",
        "activityapi.huya.com",
        "activityapi.huya.com.w.cdngslb.com",
        "www.bilibili.com",
        "api.bilibili.com",
        "a.w.bilicdn1.com",
        "+.apt-agent.com"
      ];
      snifferConfig = {
        sniff: {
          TLS: {
            ports: [443, 8443]
          },
          HTTP: {
            ports: [80, 8080, 8880]
          },
          QUIC: {
            ports: [443, 8443]
          }
        },
        "override-destination": false,
        enable: true,
        "force-dns-mapping": true,
        "skip-domain": ["Mijia Cloud", "dlg.io.mi.com", "+.push.apple.com"]
      };
      DNS_LIST_FIELDS = [
        "default-nameserver",
        "nameserver",
        "fallback",
        "proxy-server-nameserver",
        "direct-nameserver"
      ];
      DNS_POLICY_FIELDS = ["nameserver-policy", "proxy-server-nameserver-policy"];
    }
  });

  // src/tun.ts
  function buildTunConfig(tunEnabled, tailscale) {
    return {
      enable: tunEnabled,
      stack: "gvisor",
      device: "mihomo",
      "route-exclude-address": [
        !tailscale ? "100.64.0.0/10" : null,
        !tailscale ? "fd7a:115c:a1e0::/48" : null,
        "192.168.0.0/16"
      ].filter(isNotNull),
      "dns-hijack": ["any:53"],
      mtu: 1500
    };
  }
  var init_tun = __esm({
    "src/tun.ts"() {
      "use strict";
      init_utils();
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_constants();
      init_args();
      init_proxy_groups();
      init_rules();
      init_rule_providers();
      init_dns();
      init_tun();
      var geoxURL = {
        geoip: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/geoip.dat`,
        geosite: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/geosite.dat`,
        mmdb: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/country.mmdb`,
        asn: `${CDN_URL}/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb`
      };
      function getRawArgs() {
        try {
          return $arguments;
        } catch {
          return {};
        }
      }
      var rawArgs = getRawArgs();
      var {
        ipv6Enabled,
        fullConfig,
        keepAliveEnabled,
        fakeIPEnabled,
        tunEnabled
      } = buildFeatureFlags(rawArgs);
      function main(config) {
        if (!config.proxies || !Array.isArray(config.proxies)) {
          throw new Error("[powerfullz 的覆写脚本] 错误：Clash 配置中缺少有效的 proxies 字段");
        }
        const allNodes = config.proxies.map((node) => node.name);
        const tailscaleNodes = parseTailscale(config.proxies);
        const hasTailscale = tailscaleNodes.length > 0;
        const proxyGroups = buildProxyGroups({ allNodes, nodes: config.proxies });
        const finalRules = buildRules();
        return {
          proxies: config.proxies,
          ...config.hosts !== void 0 && { hosts: config.hosts },
          ...fullConfig && {
            "mixed-port": 7890,
            "redir-port": 7892,
            "tproxy-port": 7893,
            "routing-mark": 7894,
            "allow-lan": true,
            "bind-address": "*",
            ipv6: ipv6Enabled,
            mode: "rule",
            "unified-delay": true,
            "tcp-concurrent": true,
            "find-process-mode": "off",
            "log-level": "info",
            "geodata-loader": "standard",
            "external-controller": ":9999",
            "disable-keep-alive": !keepAliveEnabled,
            profile: { "store-selected": true }
          },
          "proxy-groups": proxyGroups,
          "rule-providers": ruleProviders,
          rules: finalRules,
          sniffer: snifferConfig,
          dns: buildDns({ fakeIPEnabled, ipv6Enabled, upstreamDns: config.dns }),
          tun: buildTunConfig(tunEnabled, hasTailscale),
          "geodata-mode": true,
          "geox-url": geoxURL
        };
      }
      globalThis.main = main;
    }
  });
  require_main();
})();
