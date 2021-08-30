// 游戏配置
export default {
  // 面板宽高
  panelSize:{
    width:16,
    height:20
  },
  // 显示下一个方块的区域宽高
  nextSize:{
    width:6,
    height:6
  },
  // 游戏的难度级别
  levels:[
    {score:0,duration:1000},
    {score:200,duration:800},
    {score:500,duration:700},
    {score:800,duration:600},
    {score:1000,duration:500},
  ]
}