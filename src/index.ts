import { Game } from "./core/Game";
import { GamePageViewer } from "./core/viewer/GamePageViewer";
import $ from "jquery";

const game = new Game(new GamePageViewer());


$("#start").click(()=>{
  game.start();
})

$("#pause").click(()=>{
  game.pause();
})

$("#left").click(()=>{
  game.control_left();
})

$("#right").click(()=>{
  game.control_right();
})

$("#down").click(()=>{
  game.control_down();
})

$("#rotate").click(()=>{
  game.control_rotate();
})