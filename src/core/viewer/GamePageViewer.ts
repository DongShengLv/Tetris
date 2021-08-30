import { SquareGroup } from "../SquareGroup";
import { createTeris } from "../Tetris";
import { GameStatus, GameViewer } from "../types";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from "jquery";
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

/* 控制显示游戏 */
export class GamePageViewer implements GameViewer {
  onGameStart(): void {
    this.msgDom.hide()
  }
  onGamePause(): void {
    this.msgDom.css({
      display: "flex"
    });
    this.msgDom.find("p").html("游戏暂停")
  }
  onGameOver(): void {
    this.msgDom.css({
      display: "flex"
    });
    this.msgDom.find("p").html("游戏结束")
  }

  private panelDom = $("#panel")
  private nextDom = $("#tip .next")
  private msgDom = $("#panel .msg")

  init(game: Game): void {
    // 设置区域的宽高
    this.panelDom.css({
      width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
      height: GameConfig.panelSize.height * PageConfig.SquareSize.height
    })

    this.nextDom.css({
      width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
      height: GameConfig.nextSize.height * PageConfig.SquareSize.height,
    })

    // 注册键盘事件
    $(document).on("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          game.control_left();
          break;
        case "ArrowRight":
          game.control_right();
          break;
        case "ArrowDown":
          game.control_down();
          break;
        case "ArrowUp":
          game.control_rotate();
          break;
        case "Enter":
          game.start();
          break;
        case " ":
          if (game.gameStatus === GameStatus.playing) {
            game.pause();
            break;
          } else {
            game.start();
          }

      }
    })



  }
  showNext(tetris: SquareGroup): void {
    tetris.squares.forEach((sq) => {
      sq.viewer = new SquarePageViewer(sq, this.nextDom)
    })
  }
  switch(tetris: SquareGroup): void {
    tetris.squares.forEach(sq => {
      sq.viewer?.remove();
      sq.viewer = new SquarePageViewer(sq, this.panelDom)
    })
  }

  showScore(score: number): void {
    $("#tip .score").html(score.toString());
  }
}