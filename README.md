# スピードキューブタイマー アプリケーション仕様書

## 1. アプリケーション概要

### プロジェクト名
**スピードキューブタイマー**

### 目的
ルービックキューブのスピードソルビング用タイマーアプリケーション。WCA（World Cube Association）公式ルールに準拠したao5（average of 5）計算機能を提供。

### ターゲットユーザー
- スピードキューブ愛好者
- 競技練習者
- 初心者から上級者まで

## 2. 機能要件

### 2.1 コア機能

#### タイマー機能
- **精度**: 10ミリ秒単位での計測
- **操作方法**: 
  - スペースキー：準備 → 開始 → 停止
  - タップ/クリック：モバイル対応
- **状態表示**:
  - 準備状態：黄色
  - 計測中：緑色
  - 停止：青色

#### ao5計算（WCA公式ルール準拠）
- 直近5回のタイムから最高・最低を除外
- 残り3回の平均値を算出
- リアルタイム更新

#### データ管理
- タイム履歴の保存（メモリ内）
- セッション管理
- 個別タイム削除機能

### 2.2 表示機能

#### 統計情報
- 現在のao5
- セッションao5
- セッション回数
- 総計測回数

#### タイム履歴
- 最新10回のタイム表示
- 番号付きリスト
- 時刻フォーマット（分:秒.センチ秒）

### 2.3 操作機能

#### ボタン操作
- セッションリセット
- 最後のタイム削除
- 全履歴クリア

#### キーボード操作
- スペースキー：タイマー操作（押下 → 準備、離す → 開始/停止）

## 3. UI/UX要件

### 3.1 デザイン原則
- シンプルで直感的なインターフェース
- 大きく見やすいタイマー表示
- レスポンシブデザイン（モバイル対応）

### 3.2 レイアウト構成
┌─────────────────────────────┐
│        ページタイトル         │
├─────────────────────────────┤
│                             │
│      メインタイマー表示       │
│       （クリック可能）        │
│                             │
├─────────────────────────────┤
│   操作ボタン（3つ横並び）     │
├─────────────────────────────┤
│  統計情報    │   タイム履歴   │
│             │              │
├─────────────────────────────┤
│         使い方説明          │
└─────────────────────────────┘

### 3.3 カラーパレット
- **背景**: グレー系 (`bg-gray-50`)
- **カード**: 白 (`bg-white`)
- **タイマー状態色**:
  - 準備: 黄色 (`text-yellow-500`)
  - 実行中: 緑 (`text-green-500`)
  - 停止: 青 (`text-blue-600`)
- **ボタン色**:
  - リセット: オレンジ (`bg-orange-500`)
  - 削除: 赤 (`bg-red-500`)
  - クリア: グレー (`bg-gray-500`)

## 4. 技術仕様

### 4.1 技術スタック
- **フレームワーク**: Next.js 14.0.3
- **ライブラリ**: React 18
- **スタイリング**: Tailwind CSS 3.3.0
- **言語**: JavaScript (ES6+)
- **デプロイ**: Vercel

### 4.2 プロジェクト構成
speedcube-timer/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .gitignore
├── README.md
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   └── components/
│       └── SpeedCubeTimer.js
└── node_modules/

### 4.3 主要依存関係
```json
{
  "dependencies": {
    "next": "14.0.3",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.3",
    "postcss": "^8",
    "tailwindcss": "^3.3.0"
  }
}
5. WCA公式ルール仕様
5.1 ao5（Average of 5）

定義: 5回の試技から最良と最悪の記録を除いた3回の平均
計算方法:

5回のタイムを取得
昇順でソート
最初と最後を除外
残り3つの平均を計算



5.2 タイム表記

フォーマット: 分:秒.センチ秒
例: 1:23.45, 45.67
精度: センチ秒（0.01秒）単位

6. 実装済み機能
6.1 Reactコンポーネント機能

useStateによる状態管理
useEffectによるタイマー制御
useCallbackによる最適化
useRefによる参照管理

6.2 状態管理
javascriptconst [time, setTime] = useState(0);           // 現在のタイム
const [isRunning, setIsRunning] = useState(false);     // 実行状態
const [isReady, setIsReady] = useState(false);         // 準備状態
const [times, setTimes] = useState([]);               // 全タイム履歴
const [currentSession, setCurrentSession] = useState([]); // セッションタイム
6.3 核心アルゴリズム
javascript// ao5計算
const calculateAo5 = (timeArray) => {
  if (timeArray.length < 5) return null;
  const lastFive = timeArray.slice(-5);
  const sorted = [...lastFive].sort((a, b) => a - b);
  const middle3 = sorted.slice(1, 4);
  return middle3.reduce((sum, time) => sum + time, 0) / 3;
};

// 時間フォーマット
const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
};
7. デプロイ仕様
7.1 ローカル開発
bashnpm install
npm run dev          # http://localhost:3000
7.2 Vercelデプロイ
bash# 方法1: CLI
npx vercel login
npx vercel           # プレビュー
npx vercel --prod    # 本番

# 方法2: Git連携
# GitHubリポジトリからVercel自動デプロイ
7.3 環境設定

フレームワーク: Next.js（自動検出）
ビルドコマンド: next build（自動）
出力ディレクトリ: .next（自動）

8. セットアップ手順
8.1 クローン・セットアップ
bashgit clone https://github.com/YOUR_USERNAME/speedcube-timer.git
cd speedcube-timer
npm install
npm run dev
8.2 デプロイ
bashnpx vercel --prod
9. 今後の拡張可能性
9.1 機能拡張案

ao12（12回平均）対応
ベストタイム記録
スクランブル生成機能
データエクスポート機能
テーマカスタマイズ
音声フィードバック

9.2 技術改善案

TypeScript導入
PWA対応
データ永続化（LocalStorage/DB）
パフォーマンス最適化

10. トラブルシューティング
10.1 よくある問題

Tailwind CSS警告: content配列の設定確認
権限エラー: npx使用を推奨
ビルドエラー: Node.js バージョン確認（v18+推奨）

10.2 デバッグ情報

開発サーバー: npm run dev
ビルドテスト: npm run build
プロダクションテスト: npm start


作成日: 2025年7月3日
バージョン: 1.0
開発言語: 日本語
ライセンス: MIT
🔗 Links

デモサイト: [Coming Soon]
リポジトリ: https://github.com/YOUR_USERNAME/speedcube-timer
