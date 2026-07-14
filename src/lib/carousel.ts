// 輪播用純函式:索引運算與滑動手勢判斷,方便單元測試,不依賴任何 DOM/React API。

/** 目前索引往「下一張」移動,length 為 0 時回傳 0 避免除以 0。 */
export function nextIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}

/** 目前索引往「上一張」移動,length 為 0 時回傳 0 避免除以 0。 */
export function prevIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current - 1 + length) % length;
}

export type SwipeDecision = 'next' | 'prev' | 'none';

/**
 * 依拖曳的水平位移與放開瞬間的速度判斷該切到下一張、上一張,或距離不夠彈回原位。
 * 往左拖(offsetX 為負)視為「下一張」,往右拖(offsetX 為正)視為「上一張」。
 */
export function resolveSwipe(
  offsetX: number,
  velocityX: number,
  distanceThreshold = 80,
  velocityThreshold = 500,
): SwipeDecision {
  if (offsetX <= -distanceThreshold || velocityX <= -velocityThreshold) return 'next';
  if (offsetX >= distanceThreshold || velocityX >= velocityThreshold) return 'prev';
  return 'none';
}
