# 候選配色方案

> **狀態:2026-07-12 Cooper 拍板:採用方案 A(Neon Purple × Rose)。主題系統映射:primary=#7C3AED、secondary=#F43F5E(CTA 玫紅作為可調輔色),#A78BFA 由衍生階(primary-soft)自動產生;bg=#0F0F23、surface=#1E1C35、text=#E2E8F0;字型 Russo One + Chakra Petch。其餘方案保留作為預設主題切換選項。**
>
> 產出方式:ui-ux-pro-max skill `scripts/search.py`(colors.csv / typography.csv 資料庫查詢)。
> 前提:深色背景遊戲官網(參考規格調性 #0b0b14)。
> 拍板後,選定方案將轉為主題系統的 CSS variables 預設主題。

---

## 方案 A:Neon Purple × Rose(霓虹紫 × 玫紅)

- 來源查詢:`gaming entertainment slots casino vibrant --design-system`、`dark neon gaming --domain color`(Gaming 類別,skill 主推方案)
- 風格:霓虹電競感,紫色主調帶能量,玫紅 CTA 搶眼,最貼近「vibrant slots」定位。

| 角色 | Hex |
|------|-----|
| Primary(主色) | `#7C3AED` |
| Secondary(輔色) | `#A78BFA` |
| Accent / CTA | `#F43F5E` |
| Background(背景) | `#0F0F23` |
| Surface(表面/卡片) | `#1E1C35` |
| Text(前景文字) | `#E2E8F0` |
| Muted(次要底) | `#27273B` |
| Muted Text | `#94A3B8` |
| Border | `#4C1D95` |

---

## 方案 B:Arcade Retro Neon(街機復古霓虹)

- 來源查詢:`dark neon gaming` / `playful vibrant arcade --domain color`(Arcade & Retro Game 類別)
- 風格:紅藍霓虹撞色 + 得分綠,街機廳氛圍,活潑高對比,適合強調「玩」的趣味性。

| 角色 | Hex |
|------|-----|
| Primary(主色) | `#DC2626` |
| Secondary(輔色) | `#2563EB` |
| Accent / CTA | `#22C55E` |
| Background(背景) | `#0F172A` |
| Surface(表面/卡片) | `#192134` |
| Text(前景文字) | `#FFFFFF` |
| Muted(次要底) | `#1F1829` |
| Muted Text | `#94A3B8` |
| Border | `rgba(255,255,255,0.08)` |

---

## 方案 C:Spotlight Gold(暗夜聚光金)

- 來源查詢:`esports cyberpunk dark --domain color`(Theater/Cinema 類別)
- 風格:深靛藍舞台底 + 聚光燈金,最接近「casino 奢華」的深色版本;沉穩、劇場感、高級。
- 備註:`casino luxury gold premium` 查詢命中的 Luxury/Premium 方案皆為淺色背景(bg `#FAFAF9`),不符深色前提,故未列入;本方案為資料庫中最貼近的深色金系替代。

| 角色 | Hex |
|------|-----|
| Primary(主色) | `#1E1B4B` |
| Secondary(輔色) | `#312E81` |
| Accent / CTA | `#CA8A04` |
| Background(背景) | `#0F0F23` |
| Surface(表面/卡片) | `#1B1B30` |
| Text(前景文字) | `#F8FAFC` |
| Muted(次要底) | `#27273B` |
| Muted Text | `#94A3B8` |
| Border | `#4338CA` |

---

## 方案 D:Warm Ember(暗夜暖橙)

- 來源查詢:`dark neon gaming` / `esports cyberpunk dark --domain color`(Podcast Platform 類別,深色娛樂調性)
- 風格:深靛底 + 暖橙 accent,娛樂感但比霓虹收斂,介於 A 的張揚與 C 的沉穩之間。

| 角色 | Hex |
|------|-----|
| Primary(主色) | `#1E1B4B` |
| Secondary(輔色) | `#312E81` |
| Accent / CTA | `#F97316` |
| Background(背景) | `#0F0F23` |
| Surface(表面/卡片) | `#1B1B30` |
| Text(前景文字) | `#F8FAFC` |
| Muted(次要底) | `#27273B` |
| Muted Text | `#94A3B8` |
| Border | `#4338CA` |

---

## 字型配對建議

來源查詢:`gaming bold energetic --domain typography`(typography.csv)

### 配對 1:Gaming Bold(skill 主推,配方案 A/B)
- Heading:**Russo One**;Body:**Chakra Petch**
- 調性:gaming、esports、競技、能量
- Import:`@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=Russo+One&display=swap');`

### 配對 2:Music/Entertainment(配方案 C/D)
- Heading:**Righteous**;Body:**Poppins**
- 調性:娛樂、演出、fun、bold,比 Gaming Bold 圓潤親和
- Import:`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Righteous&display=swap');`

---

## 附註

- 完整設計系統(spacing、shadow、component specs、UX checklist、anti-patterns)見 `design-system/game-website/MASTER.md`。
- 各方案的 bg 與規格參考值 `#0b0b14` 相近但非相同;拍板時可決定沿用方案 bg 或統一回 `#0b0b14`。
- 對比度:各方案 Text/Background 對比皆遠超 4.5:1;方案 C 的 `#CA8A04` 金色作大面積文字使用時需另驗證對比(資料庫其他條目曾為 WCAG 3:1 調整為 `#A16207`,可作備援金色)。
