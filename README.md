# 俄罗斯方块游戏

> 使用技术:webpack jquery typescript 面向对象开发

webpack:构建工具 根据入口文件寻找依赖 打包

1. 安装 webpack
2. 安装 html-webpack-plugin
3. 安装 clean-webpack-plugin
4. 安装 webpack-dev-server
5. 安装 TS 的相应 loader

运行:npm run dev

ts-loader 官方
awesome-typescript-loader 民间

他们依赖 typescript

TS 配置文件

```json
{
  "compilerOptions": {
    "target": "es2016", //目标配置版本
    "module": "ESNext", // 最新的模块化标准
    "lib": ["ES2016", "dom"], // 环境
    "outDir": "./dist", // 出口
    "sourceMap": true, // 源码
    "strict": true, // 严格模式
    "removeComments": true, // 移除注释
    "esModuleInterop": true, // es模块化和非es模块化进行交互
    "moduleResolution": "node", // 模块解析方式
    "isolatedModules": true // 强制要求单个文件必须是一个模块
  },
  "include": ["./src"]
}
```

# 开发

**单一职责原则**:每个类只做跟他相关的一件事
**开闭原则**:系统中的类应该对扩展开放对修改关闭

基于以上两个原则 系统中使用如下模式
数据-界面分离模式

传统面向对象语言 书写类的属性时 往往会有如下操作:

1. 所有的属性全部私有化
2. 使用公开的方法提供对属性的访问

## 开发小方块

小方块类:它能处理自己的数据 知道什么时候需要现实 但不知道怎么显示

## 小方块的显示类

作用:用于显示一个小方块到页面上

dom 对象的类型为 HTMLElement

## 方块的组合类

组合类的属性:

- 小方块的数组组成不能发生变化 是只读数组
- 一个方块的组合，取决于组合的形状 **一组相对坐标的组合 该组合中有一个特殊坐标 表示形状的中心**

如果知道 形状、中心点坐标、颜色、就可以设置小方块的数组

## 方块的生产者

将需要用到的俄罗斯方块形状跟颜色存储在数组中 利用辅助函数将其返回 返回的是随机颜色、形状的方块组合

```js
export function createTeris(centerPoint: Point) {
  let index = getRandom(0, shapes.length);
  // 获取随机形状
  const shape = shapes[index];

  index = getRandom(0, colors.length);
  // 获取随机颜色
  const color = colors[index];

  return new SquareGroup(shape, centerPoint, color);
}
```

## 规则类

1. 边界判断
   传入方块组的形状、目标坐标，假设中心点已经移动到了目标位置，算出每个小方块的坐标

```js
static canIMove(shape: Shape, targetPoint: Point): boolean {
    // 假设中心点已经移动到了目标位置，算出每个小方块的坐标
    const targetSquarePoints: Point[] = shape.map(item => {
      return {
        x: item.x + targetPoint.x,
        y: item.y + targetPoint.y
      }
    })


    // 边界判断
    const result = targetSquarePoints.some(p => {
      // 判断每个小方块的坐标是否超出了边界
      return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1
    })

    if (result) {
      return false;
    }
    return true;
  }
```

2. 方块移动
   当类中的两个功能取名一样时可以使用 重载 加上判断使其灵活处理各种场景

```js
  // 移动函数
  static move(tetris:SquareGroup,targetPoint:Point):boolean;
  // 方向移动
  static move(tetris:SquareGroup,direction:MoveDirection):boolean;

  static move(tetris: SquareGroup, targetPointOrDirection: Point | MoveDirection): boolean {
    // isPoint为辅助函数 判断传入的参数是否为坐标还是方向
  if (isPoint(targetPointOrDirection)) {
  // 是坐标
  if (this.canIMove(tetris.shape, targetPointOrDirection)) {
  tetris.centerPoint = targetPointOrDirection;
  return true;
  }
  return false;
  } else {
  // 不是坐标 而是方向
  // 方向
  const direction = targetPointOrDirection;
  // 目标坐标
  let targetPoint: Point;

     if (direction === MoveDirection.left) {
       // 向左走
       targetPoint = {
         x: tetris.centerPoint.x - 1,
         y: tetris.centerPoint.y,
       }
     } else if (direction === MoveDirection.right) {
       // 向右走
       targetPoint = {
         x: tetris.centerPoint.x + 1,
         y: tetris.centerPoint.y,
       }
     } else {
       // 向下走
       targetPoint = {
         x: tetris.centerPoint.x,
         y: tetris.centerPoint.y + 1,
       }
     }

     return this.move(tetris, targetPoint);
   }
  }
```

## 旋转

旋转的本质:根据当前形状 ---> 新的形状
旋转后的方块形状 规律 顺：x,y --> -y,x 逆：x,y --> y,-x

- 有些方块不旋转 四方块
- 有些方块旋转的形状只有两种 长条形 S 形

旋转方法有一种通用的实现方式，但是在不同情况下会有不同的具体实现

将 SquareGroup 作为父类，其他的方块都是他的子类，子类可以覆盖父类的方法

- 方块旋转之后不能超出边界

## 游戏类

游戏类清楚什么时候进行显示的切换，但不知道如何显示

需要有一个接口处理如何显示

```js
export interface GameViewer {
  /**
   * 显示下一个方块
   * @param tetris 下一个方块对象
   */
  showNext(tetris: SquareGroup): void;

  /**
   * 切换方块
   * @param tetris 切换的方块对象
   */
  switch(tetris: SquareGroup): void;
}
```

接口实现交给专门跟页面打交道的类

```js
/* 控制显示游戏 */
export class GamePageViewer implements GameViewer {
  showNext(tetris: SquareGroup): void {
    tetris.squares.forEach((sq) => {
      sq.viewer = new SquarePageViewer(sq, $("#tip .next"));
    });
  }
  switch(tetris: SquareGroup): void {
    tetris.squares.forEach((sq) => {
      sq.viewer?.remove();
      sq.viewer = new SquarePageViewer(sq, $("#panel"));
    });
  }
}
```

游戏的类的构造器为 接口 **GameViewer**

## 触底处理

触底: 当前方块到达最底部
什么时候可能发生触底 （什么时候调用函数）

1. 自动下落
2. 玩家控制下落

触底之后做什么  （函数如何编写）

- 切换方块
- 保存已落下的方块
  - 存储在 exists数组
- 消除方块
  - 从界面上移除小方块
  - 从 exists数组中移除
  - 改变 Y坐标小于被消除方块 Y坐标的 Y坐标
- 游戏是否结束

1. 当触底后如何保存已落下的方块
2. 如何根据已保存的方块 判断当前方块是否可以移动

## 分数

根据消除的行数自定义分数加成

## 游戏界面

在控制游戏的显示的类 GameViewer中添加需要的接口
