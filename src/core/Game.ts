import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTeris, TShape } from "./Tetris";
import { TetrisRules } from "./TetrisRules";
import { GameStatus, GameViewer, MoveDirection } from "./types";

export class Game {

  constructor(private _viewer: GameViewer) {
    // 重置方块的中心点坐标
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTetris);
    // 显示下一个方块
    this._viewer.showNext(this._nextTetris);
    //初始化
    this._viewer.init(this);
    // 开始显示分数
    this._viewer.showScore(this.score);

  }
  // 游戏状态 初始化
  private _gameStatus: GameStatus = GameStatus.init;

  // 当前玩家操作的方块
  private _curTetris?: SquareGroup;

  // 下一个方块
  private _nextTetris: SquareGroup = createTeris({ x: 0, y: 0 });

  // 计时器
  private _timer?: NodeJS.Timeout | number

  // 自由下落的时间间隔
  private _duration: number = 1000;

  // 当前游戏中 已存在的小方块
  private _exists: Square[] = [];

  // 游戏得分
  private _score: number = 0;

  // 得到分数
  public get score() {
    return this._score;
  }

  // 设置分数
  public set score(val) {
    this._score = val;
    this._viewer.showScore(val);
    // 查看当前游戏难度多少 得到当前游戏难度
    const level = GameConfig.levels.filter(item => item.score <= val).pop()!;
    
    if (level.duration === this._duration) {
      return
    }
    this._duration = level.duration;
    if (this._timer) {
      clearInterval(Number(this._timer))
      this._timer = undefined;
      this.autoDrop();
    }

  }

  // 得到游戏状态
  public get gameStatus() {
    return this._gameStatus;
  }

  // 游戏初始化
  private init() {
    // 界面上清除方块
    this._exists.forEach(sq => {
      if (sq.viewer) {
        sq.viewer.remove();
      }
    })
    // 小方块数组清空
    this._exists = [];
    this._nextTetris = createTeris({ x: 0, y: 0 });
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTetris);
    this._viewer.showNext(this._nextTetris)

    // 将当前的方块设置为 空
    this._curTetris = undefined;
    // 清空得分
    this.score = 0;
  }

  /**
   *  游戏开始
   */
  start() {
    // 如果游戏正在进行中 不做处理
    if (this._gameStatus === GameStatus.playing) {
      return;
    }

    // 如果游戏结束
    if (this._gameStatus === GameStatus.over) {
      // 初始化
      this.init();
    }

    // 否则将游戏状态变成游戏中
    this._gameStatus = GameStatus.playing;
    // 如果当前方块组没有值
    if (!this._curTetris) {
      // 给当前操作的方块赋值为下一个方块的值
      this.switchTetris();
    }

    // 使当前方块自由下落
    this.autoDrop();

    this._viewer.onGameStart();
  }

  /**
   * 游戏暂停
   */
  pause() {
    // 当游戏正在进行中时可以暂停
    if (this._gameStatus === GameStatus.playing) {
      this._gameStatus = GameStatus.pause;
      clearInterval(Number(this._timer))
      this._timer = undefined;
      this._viewer.onGamePause();
    }
  }

  /**
   * 控制功能 
   */

  control_left() {
    if (this._curTetris && this._gameStatus === GameStatus.playing) {
      TetrisRules.move(this._curTetris, MoveDirection.left, this._exists);
    }
  }
  control_right() {
    if (this._curTetris && this._gameStatus === GameStatus.playing) {
      TetrisRules.move(this._curTetris, MoveDirection.right, this._exists);
    }
  }
  control_down() {
    if (this._curTetris && this._gameStatus === GameStatus.playing) {
      if (!TetrisRules.move(this._curTetris, MoveDirection.down, this._exists)) {
        // 触底
        this.hitBottom()
      }
    }
  }
  control_rotate() {
    if (this._curTetris && this._gameStatus === GameStatus.playing) {
      TetrisRules.rotate(this._curTetris, this._exists)
    }
  }


  // 切换方块的辅助方法
  private switchTetris() {
    // 当前方块为下一个方块
    this._curTetris = this._nextTetris;
    this._curTetris.squares.forEach(sq => {
      if (sq.viewer) {
        sq.viewer.remove();
      }
    })
    // 让方块在游戏面板居中
    this.resetCenterPoint(GameConfig.panelSize.width, this._curTetris);
    // 可能出现 当前方块出现时跟之前的的方块重叠 意味着游戏可以结束了
    if (!TetrisRules.canIMove(this._curTetris.shape, this._curTetris.centerPoint, this._exists)) {
      // 游戏结束
      this._gameStatus = GameStatus.over;
      clearInterval(Number(this._timer));
      this._timer = undefined;
      this._viewer.onGameOver();
      return
    }

    // 再创建下一个方块
    this._nextTetris = createTeris({ x: 0, y: 0 });
    // 重置方块的中心点坐标
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTetris);
    // 切换方块
    this._viewer.switch(this._curTetris);
    // 显示下一个方块
    this._viewer.showNext(this._nextTetris);
  }

  // 方块自由下落的辅助函数
  private autoDrop() {
    if (this._timer || this._gameStatus !== GameStatus.playing) {
      return;
    }

    // 没有计时器并且游戏正在进行中
    this._timer = setInterval(() => {
      if (this._curTetris) {
        if (!TetrisRules.move(this._curTetris, MoveDirection.down, this._exists)) {
          // 触底
          this.hitBottom();
        }
      }
    }, this._duration)
  }

  /**
   * 重新设置方块的中心点坐标 让该方块出现在区域的中上方
   * @param width 
   * @param tetris 
   */
  private resetCenterPoint(width: number, tetris: SquareGroup) {
    // 横坐标
    const x = width / 2 - 1;
    let y = 0;
    // 设置方块中心点坐标
    tetris.centerPoint = { x, y };
    // 判断各个小方块的 y坐标是否有小于 0 的 即超出区域
    while (tetris.squares.some(it => it.point.y < 0)) {
      // 向下移动一格
      tetris.centerPoint = {
        x: tetris.centerPoint.x,
        y: tetris.centerPoint.y + 1
      }
    }
  }

  /**
   * 触底之后的操作
   */
  private hitBottom() {
    // 将当前的俄罗斯方块包含的小方块 加入到已存在的 exists小方块数组中
    this._exists.push(...this._curTetris!.squares);
    // 处理移除 界面移除
    const num = TetrisRules.deleteSquares(this._exists);
    // 增加分数
    this.addScore(num);

    // 切换方块
    this.switchTetris();
  }

  /**
   * 增加分数的方法
   * @param lineNum 消除的行数
   */
  private addScore(lineNum: number) {
    switch (lineNum) {
      case 1:
        this.score += 10
        break;
      case 2:
        this.score += 50
        break;
      case 3:
        this.score += 100
        break;
      case 4:
        this.score += 200
    }
  }
}