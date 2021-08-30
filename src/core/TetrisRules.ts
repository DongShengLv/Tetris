/* 方块移动的规则 */

import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { shapes } from "./Tetris";
import { MoveDirection, Point, Shape } from "./types";

// 辅助函数 判断一个对象是否包含坐标信息
function isPoint(obj: any): obj is Point {
  if (typeof obj.x === "undefined") {
    return false;
  }
  return true;
}



// 该类提供一系列的函数 根据游戏规则判断各种情况
export class TetrisRules {
  /**
   * 方块是否能移动
   * @param shape 方块形状 坐标数组
   * @param targetPoint 目标坐标
   * @param exists 游戏面板中已有的小方块数组
   * @returns boolean
   */
  static canIMove(shape: Shape, targetPoint: Point, exists: Square[]): boolean {
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
    // 判断是否与已有的方块有重叠
    const isOverlapping = targetSquarePoints.some(p => exists.some(sq => sq.point.x === p.x && sq.point.y === p.y));
    if (isOverlapping) {
      // 有重叠 不能移动
      return false;
    }
    return true;
  }

  /**
   * 方块移动函数
   * @param tetris 方块数组
   * @param targetPointOrDirection 目标坐标或方向
   * @returns boolean
   */
  static move(tetris: SquareGroup, targetPoint: Point, exists: Square[]): boolean;
  static move(tetris: SquareGroup, direction: MoveDirection, exists: Square[]): boolean;

  static move(tetris: SquareGroup, targetPointOrDirection: Point | MoveDirection, exists: Square[]): boolean {
    if (isPoint(targetPointOrDirection)) {
      // 是坐标
      if (this.canIMove(tetris.shape, targetPointOrDirection, exists)) {
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

      return this.move(tetris, targetPoint, exists);
    }
  }

  /**
   * 方块按照指定方向一直移动
   * @param tetris 方块数组
   * @param direction 方向
   */

  static moveDirectly(tetris: SquareGroup, direction: MoveDirection, exists: Square[]) {
    while (this.move(tetris, direction, exists)) { }
  }

  /**
   * 判断在场景中是否可以旋转
   * @param tetris 方块数组
   */
  static rotate(tetris: SquareGroup, exists: Square[]): boolean {
    // 得到新的形状
    const newShape = tetris.afterRotateShape();
    if (this.canIMove(newShape, tetris.centerPoint, exists)) {
      tetris.rotate();
      return true;
    } else {
      return false;
    }
  }

  /**
   * 根据 Y坐标得到该 Y坐标这一行所有的小方块
   * @param exists 游戏面板上的小方块数组
   * @param y  Y坐标
   */
  private static getLineSquares(exists: Square[], y: number) {
    return exists.filter(sq => sq.point.y === y);
  }

  /**
   * 消除方块方法
   * @param exists 需要消除的方块数组
   * @returns 消除几行
   */
  static deleteSquares(exists: Square[]): number {
    // 1.获得 Y坐标数组
    const ys = exists.map(sq => sq.point.y);
    // 2.获取最大和最小的 Y坐标
    const maxY = Math.max(...ys);
    const minY = Math.min(...ys);
    // 3.循环判断每一行是否可以消除
    let num = 0; // 移除的行数
    for (let i = minY; i <= maxY; i++) {
      if (this.deleteLine(exists, i)) {
        num++;
      }
    }
    return num;
  }

  /**
   *  消除一行小方块
   * @param exists 游戏面板上的小方块数组
   * @param y Y坐标 （第几行）
   */
  private static deleteLine(exists: Square[], y: number): boolean {
    // 得到每一行现有的小方块
    const squares = this.getLineSquares(exists, y);
    // 判断每一行的小方块的数量是否跟游戏面板的宽度相等
    if (squares.length === GameConfig.panelSize.width) {
      // 这一行可以消除
      squares.forEach(sq => {
        if (sq.viewer) {
          // 从界面上移除
          sq.viewer.remove();
        }

        // 从保存小方块的数组中移除被消除的小方块
        const index = exists.indexOf(sq);
        exists.splice(index, 1);
      })
      // 比当前 Y 坐标小的 Y坐标中的小方块 要向下移动一格 也就是 Y+1
      exists.filter(sq => sq.point.y < y).forEach(sq => {
        sq.point = {
          x: sq.point.x,
          y: sq.point.y + 1
        }
      })
      return true;
    }
    return false;
  }


}