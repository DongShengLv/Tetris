/* 小方块的组合类 */

import { Square } from "./Square";
import { Point, Shape } from "./types";

export class SquareGroup {
  constructor(private _shape: Shape, private _centerPoint: Point, private _color: string) {
    // 设置小方块的数组
    const arr: Square[] = [];

    // 设置每个方块的坐标跟颜色
    this._shape.forEach(p => {
      const sq = new Square();
      sq.color = this._color;
      sq.point = {
        x: this._centerPoint.x + p.x,
        y: this._centerPoint.y + p.y
      }
      arr.push(sq);
    })

    this._squares = arr;
  }

  // 组成形状的方块数组
  private _squares: readonly Square[];

  // 形状
  public get shape() {
    return this._shape;
  }

  // 方块组合
  public get squares() {
    return this._squares;
  }

  // 中心坐标
  public get centerPoint() {
    return this._centerPoint;
  }

  // 设置中心坐标
  public set centerPoint(val: Point) {
    this._centerPoint = val;
    // 同时设置所有小方块对象的坐标  使页面刷新显示
    this.setSquarePoints();
  }

  // 根据中心点坐标以及形状 设置每个小方块坐标
  private setSquarePoints(){
    this._shape.forEach((p, i) => {
      this._squares[i].point = {
        x: this._centerPoint.x + p.x,
        y: this._centerPoint.y + p.y
      }
    })
  }

  // 旋转方向是否为顺时针
  protected isClock = true;

  // 旋转后的方块形状  规律  顺：x,y --> -y,x  逆：x,y --> y,-x
  afterRotateShape(): Shape {
    if (this.isClock) {
      // 顺时针
      return this._shape.map(p => {
        return {
          x: -p.y,
          y: p.x
        }
      })
    } else {
      // 逆时针
      return this._shape.map(p => {
        return {
          x: p.y,
          y: -p.x
        }
      })
    }
  }

  // 旋转
  rotate(){
    // 得到新的形状
    const newShape = this.afterRotateShape();
    this._shape = newShape;
    // 重新设置各个小方块的坐标
    this.setSquarePoints();
  }
}