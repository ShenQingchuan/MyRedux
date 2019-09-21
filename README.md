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

#### 关于ReducerAction
原文中说 action 为 object，但一定要有一个type属性，
另外带各种与原 state 属性相关的字段
如在 RunTest2() 中我展示了可以修改: `t2state` 的`student`中的`name`属性

- 原文 JavaScript 实现是
    ```javascript
      /*修改 name*/
      store.dispatch({
        type: 'SET_NAME',
        name: '前端九部2号'
      });
    ```
  这里直接传入了name，而在 Typescript 的实现中，
  如果要让某个类或是接口具备一个确定的、必须的属性，而还可以无限拓展属性，
  这恐怕得 **继承了any类，并添加一个必要字段** 了... 然而这是不可能实现的
  
 - 所以我参照了 Vuex 的实现，给 ReducerAction 的定义是

    ```typescript
    export interface ReducerAction {
      type: string,
      mutation?: any,
    }
    ```
   
   在 mutation 处传入需要更改的数据，表示更改的操作。
   
   例如下面这样👇：
   ```typescript
    /*修改 name*/
   t2store.dispatch({
     type: 'SET_NAME',
     mutation: {
       name: '张二狗'
     }
   });
   ```
   
   