import { Suspense } from 'react';
import GroupUrlDisplay from './_components/group-url-display';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-lg shadow-xl p-6 sm:p-8 text-center border border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-900">
            グループURL
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-2">
            URLを読み込み中...
          </p>
        </div>
      </div>
    }>
      <GroupUrlDisplay />
    </Suspense>
  );
}
