# @upace/use-shared-instance

React hooks，用于组件间共享 `class` 实例，所有引用的组件卸载后，该实例会被销毁。

## 安装
```sh
yarn add @upace/use-shared-instance
```

## 使用
```ts
// 假设你有 class A

class A {
    do() {
        // ...
    }

    // 实例销毁前会执行
    dispose() {
        // ...
    }
}


import useSharedInstance from '@upace/use-shared-instance';

// 组件A
const a1 = useSharedInstance(A);

// 组件B
const a2 = useSharedInstance(A)

// a1,a2 为同一个实例， a1 === a2
```