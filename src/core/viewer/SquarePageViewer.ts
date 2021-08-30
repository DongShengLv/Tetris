/* 显示一个小方块到页面上 */

import { Square } from "../Square";
import { IViewer } from "../types";
import $ from "jquery";
import PageConfig from "./PageConfig";

export class SquarePageViewer implements IViewer {

  constructor(private square: Square, private container: JQuery<HTMLElement>) {

  }
  
  // dom对象
  private dom?: JQuery<HTMLElement>
  // 是否已移除
  private isRemove:boolean = false

  show(): void {
    if(this.isRemove) return;
    if (!this.dom) {
      this.dom = $("<div>").css({
        position: "absolute",
        width: PageConfig.SquareSize.width,
        height: PageConfig.SquareSize.height,
        border: "1px solid gray",
        boxSizing: "border-box",
      }).appendTo(this.container)
    }

    this.dom.css({
      left: this.square.point.x * PageConfig.SquareSize.width,
      top: this.square.point.y * PageConfig.SquareSize.height,
      background: this.square.color,
    })
  }

  remove(): void {
    if(this.dom && !this.isRemove){
      this.dom.remove();
      this.isRemove = true;
    }
  }
}
