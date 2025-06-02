export default function KeyFeatureSection() {
  return (
    <section id="features" className="py-16 px-4 bg-white shadow-md mx-auto max-w-7xl">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-12">Just Payが選ばれる理由</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/*TODO: Cardコンポーネントを作成*/}
          <div className="bg-gray-50 p-8 rounded-xl shadow-md transition-transform transform hover:scale-105 duration-300 border border-gray-100">
            <div className="text-5xl mb-6">✨</div>
            <h3 className="text-2xl text-gray-700 font-semibold mb-4">複雑な計算も一瞬</h3>
            <p className="text-gray-700">
              誰がいくら立て替えても、複雑な割り勘計算はJust Payにお任せ。
              瞬時に最適な清算方法を提示します。
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl shadow-md transition-transform transform hover:scale-105 duration-300 border border-gray-100">
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-2xl text-gray-700 font-semibold mb-4">人間関係もスムーズに</h3>
            <p className="text-gray-700">
              お金の貸し借りで気まずくなることはもうありません。
              明確な清算で、友人との関係を良好に保ちます。
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl shadow-md transition-transform transform hover:scale-105 duration-300 border border-gray-100">
            <div className="text-5xl mb-6">💡</div>
            <h3 className="text-2xl text-gray-700 font-semibold mb-4">最小限の取引回数</h3>
            <p className="text-gray-700">
              独自のアルゴリズムで、清算に必要な取引回数を最小化。
              手間なく、効率的に支払いを完了できます。
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
