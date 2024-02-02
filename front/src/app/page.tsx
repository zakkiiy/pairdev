import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
    {/* トップセクション */}
      <section className="text-center p-10 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <h1 className="text-3xl font-bold">PairDevで仲間を見つけよう！</h1>
        <p className="text-xl mt-4">
          PairDevは、様々なカテゴリからプログラミング仲間を募集できる場所です。
        </p>
        {/* トップセクションの画像 */}
        <div className="mt-6 flex justify-center">
          <Image src="/twitter-image.jpg" alt="Pair Programming" width={800} height={500} />
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="p-10 bg-gray-100">
        <h2 className="text-2xl font-bold text-center">PairDevでできること</h2>
        <div className="flex flex-wrap justify-center mt-6">
          {/* 特徴：ペア募集 */}
          <div className="w-full md:w-1/3 p-4">
            <h3 className="font-semibold">ペアやグループ募集</h3>
            <p>ペアプログラミングやコードレビューのパートナーを募集できます。</p>
          </div>
          {/* 特徴：チーム開発 */}
          <div className="w-full md:w-1/3 p-4">
            <h3 className="font-semibold">チャットルームの自動生成</h3>
            <p>募集と同時にチャットルームが自動生成されます。</p>
          </div>
          {/* 特徴：リアルタイムコミュニケーション */}
          <div className="w-full md:w-1/3 p-4">
            <h3 className="font-semibold">リアルタイムコミュニケーション</h3>
            <p>リアルタイムチャット機能で、スムーズなコミュニケーションを実現。（実装中）</p>
          </div>
        </div>
      </section>
    </main>
  );
}