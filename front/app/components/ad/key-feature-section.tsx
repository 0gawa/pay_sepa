import Card from './ui/stamp-expression-card';

export default function KeyFeatureSection() {
  return (
    <section id="features" className="py-16 px-4 bg-white shadow-md mx-auto max-w-7xl">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-12">Just Payが選ばれる理由</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card
            emoji="✨"
            title="複雑な計算も一瞬"
            description="誰がいくら立て替えても、複雑な割り勘計算はJust Payにお任せ。瞬時に最適な清算方法を提示します。"
          />
          <Card
            emoji="🤝"
            title="人間関係もスムーズに"
            description="お金の貸し借りで気まずくなることはもうありません。明確な清算で、友人との関係を良好に保ちます。"
          />
          <Card
            emoji="💡"
            title="最小限の取引回数"
            description="独自のアルゴリズムで、清算に必要な取引回数を最小化。手間なく、効率的に支払いを完了できます。"
          />
        </div>
      </div>
    </section>
  );
}
