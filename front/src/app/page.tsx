import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
    {/* トップセクション */}
    <section className="text-center p-10 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
      <h1 className="text-3xl font-bold">一緒にコードを書こう！</h1>
      <p className="text-xl mt-4">
        PairDevは、プログラミングの学習やプロジェクトで共に成長できる仲間を見つけるためのプラットフォームです。
      </p>
      {/* トップセクションの画像 */}
      <div className="mt-6">
        <Image src="/images/pair-programming.jpg" alt="Pair Programming" width={500} height={300} />
      </div>
    </section>

    {/* 特徴セクション */}
    <section className="p-10 bg-gray-100">
      <h2 className="text-2xl font-bold text-center">PairDevでできること</h2>
      <div className="flex flex-wrap justify-center mt-6">
        {/* 特徴：ペア募集 */}
        <div className="w-full md:w-1/3 p-4">
          <h3 className="font-semibold">ペア募集</h3>
          <p>ペアプログラミングやコードレビューのパートナーを見つけます。</p>
        </div>
        {/* 特徴：チーム開発 */}
        <div className="w-full md:w-1/3 p-4">
          <h3 className="font-semibold">チーム開発</h3>
          <p>小規模から大規模なプロジェクトまで、チームを組んで開発を進めます。</p>
        </div>
        {/* 特徴：リアルタイムコミュニケーション */}
        <div className="w-full md:w-1/3 p-4">
          <h3 className="font-semibold">リアルタイムコミュニケーション</h3>
          <p>リアルタイムチャット機能で、スムーズなコミュニケーションを実現。</p>
        </div>
      </div>
    </section>

    {/* はじめ方セクション */}
    <section className="p-10 bg-gray-200">
      <h2 className="text-2xl font-bold text-center">はじめ方</h2>
      <p className="text-center mt-4">
        PairDevでのペア募集やチーム開発の始め方をご紹介します。
      </p>
      {/* ステップなどの詳細 */}
      {/* ここに詳細なステップを記述 */}
    </section>
  </main>
    
  )
}
