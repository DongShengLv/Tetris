/* 组合方块的形状坐标 */
import { SquareGroup } from "./SquareGroup";
import { Point, Shape } from "./types";
import { getRandom } from "./util";



/**     
 *      #
 *    # # #
 */

export class TShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }], _centerPoint, _color)
  }
}

/**
 *        #
 *    # # #
 */

export class LShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    super([{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }], _centerPoint, _color)
  }
}

/**
 *    #
 *    # # #
 */

export class LMirrorShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    super([{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], _centerPoint, _color)
  }
}

/**
 *      # #
 *    # #
 */

export class SShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -1 }], _centerPoint, _color)
  }

  rotate() {
    super.rotate();
    this.isClock = !this.isClock;
  }
}

/**
 *    # #
 *      # #
 */

export class SMirrorShape extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    super([{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }], _centerPoint, _color)
  }

  rotate() {
    super.rotate();
    this.isClock = !this.isClock;
  }
}

/**
 *     # #
 *     # #
 */
export class SquareSquare extends SquareGroup {
  constructor(_centerPoint: Point, _color: string) {
    super([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }], _centerPoint, _color)
  }

  // 四方块不旋转 重写得到旋转之后形状的方法 返回本来的形状
  afterRotateShape() {
    return this.shape;
  }
}

/**
 *     # # # #
 */
export class LineSquare extends SquareGroup {
  age:string = "chang"
  constructor(_centerPoint: Point, _color: string) {
    super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], _centerPoint, _color)
  }

  rotate() {
    super.rotate();
    this.isClock = !this.isClock;
  }
}

// 方块形状数组
export const shapes = [TShape, LShape, LMirrorShape, SShape, SMirrorShape, SquareSquare, LineSquare];

// 方块颜色数组
export const colors = ["#008c8c", "#373234", "#c8d7d2", "#f4f2f0", "#c0eb6a"]

/* 随机产生一个俄罗斯方块  形状 颜色随机 */
export function createTeris(centerPoint: Point): SquareGroup {
  let index = getRandom(0, shapes.length);
  // 获取随机形状
  const shape = shapes[index];

  index = getRandom(0, colors.length);
  // 获取随机颜色
  const color = colors[index];

  return new shape(centerPoint, color)
}