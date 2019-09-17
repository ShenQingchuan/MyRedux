# 练习：掘金大佬分享的手写Redux(Typescript版)

> **\# 本项目为对照教程自己手写实现的过程，在原版文章的基础上自己进行修改实现了 Typescript 的版本。**
>
> 原文地址：
>
> - **掘金：**（代码格式似乎出了Bug不太好看） https://juejin.im/entry/5d802a09e51d4561c541a763
> - **微信公众号原文：**（代码格式完整）https://mp.weixin.qq.com/s/idWmfUbPVVqK7Yi0_9NC4A

## 项目结构

```bash
├── dist											# Typescript编译打包后的目录
│   ├── src
│   │   ├── Reducer.js
│   │   └── ReduxStore.js
│   └── test
│       └── RunTest.js
├── gulpfile.js								# gulp 自动化打包的配置
├── package.json							# npm/yarn 依赖管理
├── src												# 项目源码文件夹
│   ├── Reducer.ts						# Reducer（即 changeState）
│   └── ReduxStore.ts					# ReduxStore 类的实现
├── test						
│   └── RunTest.ts						# 测试样例
├── README.md	
├── tsconfig.json							# Typescript 环境配置
└── yarn.lock
```

### 针对原版的一些改动：

由于原教程带着读者一起从头实现，所以先展示了通过 **`state.changeState()`** 来随意更改 `store` 中的 `state` 数据值，甚至本来原数据是 `number` 类型，却可以被改为 `string` 类型。



原文有这样提到：

> **我们把这个计划告诉 store，store.changeState 以后改变 state 要按照我的计划来改。**

故而 Redux 创建 Store 实例时应该先传入更改的策略、计划 Reducer，原文的代码中创建 Store 是以函数的形式，然后返回带有三个方法的 JavaScript 对象 ...

```javascript
const createStore = function (plan, initState) { ... }
// 原文后面提到 plan 其实就是 reducer
```

所以我的项目中：**并没有对之前那些错误传入的测试实现，我的 ReduxStore 必须传入 实现了 Reducer 接口的函数**

