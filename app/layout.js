import './globals.css'

export const metadata = {
  title: 'スピードキューブタイマー',
  description: 'ルービックキューブ用の公式ルール対応タイマーアプリ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
