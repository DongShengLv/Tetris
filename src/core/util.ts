/* 工具方法 */

// 根据最大值和最小值得到该范围内的随机数 无法取到最大值
export function getRandom(min: number, max: number) {
  const dec = max - min;
  return Math.floor(Math.random() * dec + min);
}