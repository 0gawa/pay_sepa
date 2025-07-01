'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GroupUrlDisplay() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const groupUrl = `https://${process.env.NEXT_PUBLIC_FRONT_GROUP_URL}/group/${id}`;

  // URLをクリップボードにコピーする機能
  const copyToClipboard = () => {
    // navigator.clipboard が利用可能かチェック
    if (navigator.clipboard) {
      navigator.clipboard.writeText(groupUrl)
        .then(() => {
          alert('URLがクリップボードにコピーされました！');
        })
        .catch(err => {
          console.error('URLのコピーに失敗しました:', err);
          alert('URLのコピーに失敗しました。手動でコピーしてください。');
        });
    } else {
      alert('お使いのブラウザでは、自動コピー機能がサポートされていません。手動でURLをコピーしてください。');
      console.warn('Clipboard API not supported.');
    }
  };

  // idが取得できたか確認するデバッグ用
  useEffect(() => {
    console.log("Current ID from URL:", id);
    console.log("Generated Group URL:", groupUrl);
  }, [id, groupUrl]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md rounded-lg shadow-xl p-6 sm:p-8 text-center border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-900">
          グループURL
        </h1>

        <div className="mb-6">
          <p className="text-gray-700 text-base sm:text-lg mb-2">
            以下のURLを共有してください:
          </p>
          {/*TODO: idがnullの場合に備えてフォールバックを提供するか、idが存在しない場合は表示しないなどのロジックを追加する */}
          {id ? (
            <Link
              href={`/group/${id}`}
              className="block w-full px-4 py-3 bg-gray-100 rounded-md break-all text-blue-600 text-sm sm:text-base hover:underline transition-colors duration-200"
              target="_blank" // 新しいタブで開く
              rel="noopener noreferrer"
            >
              {groupUrl}
            </Link>
          ) : (
            <p className="text-red-500">URLにIDが指定されていません。</p>
          )}
        </div>

        {id && (
          <button
            onClick={copyToClipboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            URLをコピー
          </button>
        )}

        <Link
          href="/"
          className="mt-6 inline-block text-gray-600 hover:underline text-sm"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
