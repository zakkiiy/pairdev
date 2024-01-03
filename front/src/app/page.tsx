import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
      <main>
        <section className="text-center p-10 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
          <h1 className="text-3xl font-bold">チーム開発を、もっと身近に。</h1>
          <p className="text-xl mt-4">
            PairDevはあなたのチーム開発をサポートするプラットフォームです。
          </p>
          <div className="mt-6">
            <Image src="" alt="Modern Robot" width={500} height={300} />
          </div>
        </section>

        <section className="p-10 bg-gray-100">
          <h2 className="text-2xl font-bold text-center">PairDevの特徴</h2>
          <div className="flex flex-wrap justify-center mt-6">
            <div className="w-full md:w-1/3 p-4">
              <h3 className="font-semibold">多様な募集</h3>
              <p>幅広い分野とレベルのプロジェクトを見つけることができます。</p>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <h3 className="font-semibold">簡単な連携</h3>
              <p>Github認証で簡単に登録・ログインが可能です。</p>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <h3 className="font-semibold">リアルタイムコミュニケーション</h3>
              <p>リアルタイムチャットでスムーズにコミュニケーションを取ります。</p>
            </div>
          </div>
        </section>

        <section className="p-10 bg-gray-200">
          <h2 className="text-2xl font-bold text-center">はじめ方</h2>
          <p className="text-center mt-4">
            PairDevでのプロジェクトの始め方をご紹介します。
          </p>
          {/* ここにステップなどを詳細に書く */}
        </section>
      </main>
    
  )
}
