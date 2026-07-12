import type { Milestone } from './types';

export const company = {
  name: '星河互動娛樂',
  tagline: '打造下一代線上遊戲體驗',
  intro: '星河互動娛樂專注於高品質 HTML5 遊戲研發,涵蓋老虎機、棋牌與迷你遊戲三大產品線。我們以數學模型驗證、極致美術與流暢體驗為核心,為全球合作夥伴提供穩定可靠的遊戲內容。(示意文案)',
  features: [
    { title: '自研遊戲引擎', description: '跨平台 HTML5 引擎,一次開發全端覆蓋。(示意)' },
    { title: '數學實驗室', description: '每款遊戲數值皆經大規模模擬驗證。(示意)' },
    { title: '美術工作室', description: '主題化視覺與動效,打造沉浸體驗。(示意)' },
    { title: '快速整合', description: '標準化 API,合作夥伴一週內上線。(示意)' },
  ],
  milestones: [
    { year: '2019', title: '公司成立', description: '核心團隊於台北成立工作室。(示意)' },
    { year: '2020', title: '首款老虎機上線', description: '祥龍獻瑞正式發行。(示意)' },
    { year: '2022', title: '棋牌產品線啟動', description: '德州撲克多人平台上線。(示意)' },
    { year: '2024', title: '迷你遊戲系列', description: '快節奏休閒產品線發布。(示意)' },
    { year: '2026', title: '次世代平台', description: '全新遊戲大廳與內容中台。(示意)' },
  ] as Milestone[],
  contact: { email: 'contact@example.com', phone: '+886-2-0000-0000', address: '台北市信義區示意路 100 號 10F' },
};
