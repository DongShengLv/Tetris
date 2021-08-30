import { Game } from "./Game";
import { SquareGroup } from "./SquareGroup";

// 小方块的坐标
export interface Point {
  readonly x: number,
  readonly y: number,
}

// 显示者 控制小方块是否显示
export interface IViewer {
  // 显示
  show(): void,
  // 移除 不再显示
  remove(): void
}

// 方块的组合形状 坐标数组
export type Shape = Point[];

// 移动方向 枚举
export enum MoveDirection {
  left,
  right,
  down
}

// 游戏状态 枚举
export enum GameStatus {
  // 未开始
  init,
  // 进行中
  playing,
  // 暂停
  pause,
  // 结束
  over,
}

// 控制游戏的显示
export interface GameViewer {
  /**
   * 显示下一个方块
   * @param tetris 下一个方块对象
   */
  showNext(tetris: SquareGroup): void,

  /**
   * 切换方块
   * @param tetris 切换的方块对象
   */
  switch(tetris: SquareGroup): void

  /**
   * 完成游戏的初始化
   * @param game 游戏类对象
   */
  init(game: Game): void;

  /**
   * 显示分数
   * @param score 分数
   */
  showScore(score: number): void

  /**
   * 当游戏开始
   */
  onGameStart(): void

  /**
   * 当游戏暂停
   */
  onGamePause(): void

  /**
   * 当游戏结束
   */
  onGameOver(): void
}