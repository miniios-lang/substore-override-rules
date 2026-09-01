# substore-override-rules

SubStore 订阅转换覆写脚本（基于 [powerfullz/override-rules](https://github.com/powerfullz/override-rules) 定制）。

输入任意 Clash 订阅（`proxies`），输出带**静态代理组 + 静态规则**的 Clash Meta（mihomo）兼容配置。

## 功能特性

- **18 个静态代理组**：`Manual`（全部节点）/ `Global` / `Streaming` / `Apple` / `Microsoft` / `Google` / `AI` / `Social` / `Telegram` / `Game` / `Emby`（全部节点）/ `Spotify` / `Final` / 5 个地区组 / `Other`
- **地区组自动匹配**：香港 / 日本 / 新加坡 / 美国 / 台湾 使用 `include-all` + `filter` 正则自动收纳对应节点，并排除 `Manual`；其余节点自动归入 `Other`
- **XPTV 直连规则内联**：约 360 条 DIRECT 规则（域名/关键字/IP）直接内联，无需外部规则源
- **规则集**：Repcz Egern 规则集（AI / Telegram / Social / Game / Google / Microsoft / Emby / Spotify / Streaming / Apple / DIRECT / REJECT 等），通过 `rule-providers` 远程加载
- 兜底规则：`GEOIP,CN,DIRECT` + `MATCH,Final`

## 支持的传入参数

| 参数 | 说明 | 默认 |
|---|---|---|
| `ipv6` | 启用 IPv6 支持 | `false` |
| `tun` | 启用 TUN 模式 | `false` |
| `full` | 输出完整配置（适合纯内核启动） | `false` |
| `keepalive` | 启用 tcp-keep-alive | `false` |
| `fakeip` | DNS 使用 FakeIP 模式 | `true` |

示例：`https://raw.githubusercontent.com/<user>/substore-override-rules/main/convert.js?full=true&fakeip=false`

## 使用方法（SubStore）

1. 打开 SubStore，进入「覆写」页面
2. 新增覆写脚本，填入脚本地址：
   ```
   https://raw.githubusercontent.com/<user>/substore-override-rules/main/convert.js
   ```
   （国内网络可用 jsdelivr 加速：`https://cdn.jsdelivr.net/gh/<user>/substore-override-rules@main/convert.js`）
3. 将覆写绑定到目标订阅，即可生成带以上代理组与规则的配置

## 地区组匹配规则

| 地区组 | filter 摘要 |
|---|---|
| HongKong | `🇭🇰` / 香港 / HongKong / Hongkong / HKG / `\bHK\b` / `\bHong\b` |
| Japan | `🇯🇵` / 日本 / 东京 / JPN / `\bJP\b` / `\bJapan\b` |
| Singapore | `🇸🇬` / 新加坡 / 狮 / SIN / `\bSG\b` / `\bSingapore\b` |
| United States | `🇺🇸` / 美国 / 洛杉矶 / 圣何塞 / USA / UnitedStates / `\bUS\b` / `\bUnited States\b` |
| Taiwan | `🇨🇳` / `🇹🇼` / 台湾 / TWN / TPE / `\bTW\b` / `\bTai\b` / `\bTaiwan\b` |
| Other | 未被以上地区匹配的其余节点 |

> 所有地区组均带 `exclude-filter: (?i)Manual`，不会把 `Manual` 组算进成员。

## 输出结构

```
proxies          # 原样透传
proxy-groups     # 18 个静态组（见上）
rule-providers   # 21 个 Repcz 规则集（http / classical / yaml）
rules            # IP-CIDR → XPTV 内联 DIRECT → 21 个 RULE-SET → GEOIP,CN,DIRECT → MATCH,Final
dns / tun / sniffer / geox-url   # 内核配置
```

## 注意事项

- 需要 **Clash Meta（mihomo）** 或兼容内核；`include-all` / `filter` / `flatten` / `rule-providers` 为 Meta 特性
- 仓库须为 **Public**，默认分支为 `main`
- 脚本依赖 SubStore 覆写环境（`$arguments`），不能直接在 Node 中独立执行

## 免责声明

本项目仅用于学习与技术交流，请遵守当地法律法规与相关服务条款。
