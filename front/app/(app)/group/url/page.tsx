'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Page(){
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="min-h-screen justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full p-6">
        <h1 className="text-center">Group URL</h1>
        <div>
          <Link
            href={`/group/${id}`}
          >
            https://hoge.com/group/{id}
          </Link>
        </div>
      </div>
    </div>
  );
}
