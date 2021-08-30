import { IViewer, Point } from "./types"

/**
 * 小方块的类
 */

export class Square {
  private _point: Point = {
    x: 0,
    y: 0
  }
  private _color: string = ""

  constructor() {}

  // 得到坐标
  get point() {
    return this._point;
  }

  // 设置坐标
  set point(val) {
    this._point = val;

    //完成显示
    if (this._viewer) {
      this._viewer.show();
    }
  }

  // 得到颜色
  get color() {
    return this._color;
  }

  set color(val){
    this._color = val;
  }

  // 显示者
  private _viewer?: IViewer

  get viewer() {
    return this._viewer;
  }

  set viewer(val) {
    this._viewer = val;
    if (val) val.show();
  }
}

