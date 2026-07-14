import type { Game } from './types';

export const games: Game[] = [
  { slug: 'fortune-dragon', name: '祥龍獻瑞', category: 'slots', status: 'live', thumbnail: 'fortune-dragon.avif', screenshots: [], specs: { reels: '5×3', lines: '243 ways', rtp: '(示意值)96.5%', maxWin: '(示意值)10,000x', features: ['免費旋轉', '倍數符號', '巨額獎池'] } },
  { slug: 'golden-pyramid', name: '黃金金字塔', category: 'slots', status: 'live', thumbnail: 'golden-pyramid.avif', screenshots: [], specs: { reels: '6×4', lines: 'Megaways', rtp: '(示意值)96.2%', maxWin: '(示意值)12,000x', features: ['連鎖消除', '累積倍數'] } },
  { slug: 'neon-city', name: '霓虹都市', category: 'slots', status: 'live', thumbnail: 'neon-city.avif', screenshots: [], specs: { reels: '5×4', lines: '40 lines', rtp: '(示意值)95.8%', maxWin: '(示意值)8,000x', features: ['夜間模式輪盤', 'Wild 擴展'] } },
  { slug: 'ocean-treasure', name: '深海寶藏', category: 'slots', status: 'dev', thumbnail: 'ocean-treasure.avif', screenshots: [], specs: { reels: '5×3', lines: '25 lines', rtp: '(示意值)96.0%', maxWin: '(示意值)5,000x', features: ['漸進式獎池'] } },
  { slug: 'candy-burst', name: '糖果爆爆樂', category: 'slots', status: 'dev', thumbnail: 'candy-burst.avif', screenshots: [], specs: { reels: '7×7', lines: 'Cluster Pays', rtp: '(示意值)96.4%', maxWin: '(示意值)15,000x', features: ['集群支付', '炸彈符號'] } },
  { slug: 'samurai-legend', name: '武士傳說', category: 'slots', status: 'dev', thumbnail: 'samurai-legend.avif', screenshots: [], specs: { reels: '5×3', lines: '30 lines', rtp: '(示意值)95.5%', maxWin: '(示意值)6,000x', features: ['對決加碼關卡'] } },
  { slug: 'texas-holdem', name: '德州撲克', category: 'card', status: 'live', thumbnail: 'texas-holdem.avif', screenshots: [], specs: { features: ['多人同桌', '錦標賽模式', '快速配桌'] } },
  { slug: 'big-two', name: '大老二', category: 'card', status: 'live', thumbnail: 'big-two.avif', screenshots: [], specs: { features: ['2~4 人對戰', '好友房'] } },
  { slug: 'mahjong-16', name: '十六張麻將', category: 'card', status: 'dev', thumbnail: 'mahjong-16.avif', screenshots: [], specs: { features: ['台灣規則', 'AI 補位'] } },
  { slug: 'landlord', name: '鬥地主', category: 'card', status: 'dev', thumbnail: 'landlord.avif', screenshots: [], specs: { features: ['經典三人', '加倍機制'] } },
  { slug: 'lucky-wheel', name: '幸運轉盤', category: 'mini', status: 'live', thumbnail: 'lucky-wheel.avif', screenshots: [], specs: { features: ['每日轉盤', '連擊獎勵'] } },
  { slug: 'coin-pusher', name: '推金幣', category: 'mini', status: 'live', thumbnail: 'coin-pusher.avif', screenshots: [], specs: { features: ['物理引擎', '道具系統'] } },
  { slug: 'fishing-master', name: '捕魚達人', category: 'mini', status: 'dev', thumbnail: 'fishing-master.avif', screenshots: [], specs: { features: ['多人同池', 'Boss 魚潮'] } },
  { slug: 'crash-rocket', name: '火箭衝天', category: 'mini', status: 'dev', thumbnail: 'crash-rocket.avif', screenshots: [], specs: { features: ['即時倍數曲線', '自動兌現'] } },
];

export const gamesByCategory = (slug: string) => games.filter((g) => g.category === slug);
export const getGame = (category: string, slug: string) =>
  games.find((g) => g.category === category && g.slug === slug);
