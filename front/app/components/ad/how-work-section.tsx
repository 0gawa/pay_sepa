export default function HowWorkSection() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-gray-100 shadow-md mx-auto max-w-7xl">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-12">Just Payの使い方</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-indigo-600 mb-2">1. 取引を登録</h3>
              <p className="text-gray-700">誰が、誰のために、いくら支払ったかを簡単に入力します。</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-indigo-600 mb-2">2. 自動で計算</h3>
              <p className="text-gray-700">入力された情報に基づき、アプリが最適な清算方法を自動で算出します。</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-indigo-600 mb-2">3. スムーズに清算</h3>
              <p className="text-gray-700">誰が誰にいくら支払うべきか一目瞭然。あとは支払うだけです。</p>
            </div>
          </div>
          {/* App Screenshot Placeholder */}
          <div className="flex justify-center items-center">
            <img src="https://placehold.co/600x400/E0F2F7/000?text=App+Screenshot" alt="アプリのスクリーンショット" className="rounded-xl shadow-2xl max-w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
