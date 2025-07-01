export default function AlgorithmDescription() {
  return (
    <div className="font-sans leading-relaxed text-gray-700 max-w-4xl mx-auto p-5 bg-gray-50 rounded-lg shadow-sm">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">最適精算アルゴリズムに関する説明</h1>

      <p className="mb-4">このセクションでは、本Webアプリケーションに採用されている<strong className="text-red-500">精算アルゴリズム</strong>について詳細に解説いたします。本アルゴリズムは、グループ内における金銭の貸し借り状況を効率的に解消し、<strong className="text-red-500">精算回数を最小化</strong>することを主眼に置いて設計されております。</p>

      <hr className="my-6 border-t-2 border-gray-300" />

      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">1. 精算回数の最小化</h2>
      <p className="mb-4">本アルゴリズムの主要な目的は、グループ内における債務者と債権者の関係を解消する際の<strong className="text-red-500">取引回数を最小限に抑制</strong>することにございます。これは、複数の人間が介在する複雑な金銭授受の状況において、個々人が行うべき精算手続きの煩雑さを軽減し、円滑な会計処理を促進するための設計思想に基づいております。</p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-5 rounded-md">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">例1：複数人における最小回数精算</h3>
        <ul className="list-disc ml-5 mb-3">
          <li className="mb-2"><strong>取引状況</strong>:
            <ul className="list-disc ml-5 mt-1">
              <li>AがBとCにそれぞれ1,000円貸している。</li>
              <li>BがDに2,000円貸している。</li>
            </ul>
          </li>
          <li className="mb-2"><strong>個別精算の場合</strong>:
            <ul className="list-disc ml-5 mt-1">
              <li>BはAに1,000円支払い、Dから2,000円受け取る。</li>
              <li>CはAに1,000円支払う。</li>
              <li>合計3回の精算が発生します。</li>
            </ul>
          </li>
          <li><strong>本アルゴリズムによる最適精算</strong>:
            <ul className="list-disc ml-5 mt-1">
              <li>DはAに1,000円支払う。</li>
              <li>DはBに1,000円支払う。</li>
              <li>CはAに1,000円支払う。</li>
              <li>これにより、合計3回の精算となります。<br />（※本例では精算回数の削減が見られませんが、さらに複雑な取引では効果が顕著になります。例えば、BがCから1000円借りている場合など、複数の貸し借りがある状況で、純粋な貸し借り関係を抽出することで、より少ない回数での精算経路を特定いたします。）</li>
            </ul>
          </li>
        </ul>
      </div>

      <hr className="my-6 border-t-2 border-gray-300" />

      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">2. 端数処理に関する方針</h2>
      <p className="mb-4">金銭の授受においては、割り切れない端数が発生する場合がございます。本アルゴリズムでは、この端数処理に対し、以下の明確な規則を設けております。</p>

      <ul className="list-disc ml-5 mb-4">
        <li><strong>基本原則</strong>: 取引金額を参加者全員で均等に分割し、1円未満の端数が発生した場合は、その端数を<strong className="text-red-500">メンバーの登録順が早い者から順に1円ずつ加算</strong>して負担を割り振ります。これにより、計算の透明性と公平性を確保いたします。</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-5 rounded-md">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">例2：割り切れない金額の精算（端数処理）</h3>
        <ul className="list-disc ml-5 mb-3">
          <li className="mb-2"><strong>取引状況</strong>: 3人で合計1,000円の飲食費が発生。</li>
          <li className="mb-2"><strong>通常分割</strong>: 1,000円 ÷ 3人 = 333.333...円</li>
          <li><strong>本アルゴリズムによる割り振り</strong>:
            <ul className="list-disc ml-5 mt-1">
              <li>登録順1番目のメンバー: 334円</li>
              <li>登録順2番目のメンバー: 333円</li>
              <li>登録順3番目のメンバー: 333円</li>
              <li>合計1,000円となり、端数なく精算されます。</li>
            </ul>
          </li>
        </ul>
      </div>

      <hr className="my-6 border-t-2 border-gray-300" />

      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">3. グループメンバー削除時の精算処理</h2>
      <p className="mb-4">グループの運用中にメンバーが削除されるケースを考慮し、その際の未精算取引に対する処理を以下のように定めております。</p>

      <ul className="list-disc ml-5 mb-4">
        <li><strong>原則</strong>: メンバーが削除された場合、当該メンバーが関与していた全ての未精算取引について、その取引の<strong className="text-red-500">残りの参加メンバーで金額を再計算し、精算を行います</strong>。削除されたメンバーの未払いや未回収の金額は、残りのメンバー間で再分配されます。これにより、グループの金銭的整合性を維持いたします。</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-5 rounded-md">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">例3：メンバー削除時の精算金額再計算</h3>
        <ul className="list-disc ml-5 mb-3">
          <li className="mb-2"><strong>初期取引状況</strong>:
            <ul className="list-disc ml-5 mt-1">
              <li>Aがタクシー代3,000円を立て替え。参加者はA, B, C, Dの4名。</li>
              <li>各人が負担すべき金額は3,000円 ÷ 4人 = 750円。</li>
            </ul>
          </li>
          <li className="mb-2"><strong>途中状況</strong>: Bがグループから削除された。</li>
          <li><strong>本アルゴリズムによる精算額再計算</strong>:
            <ul className="list-disc ml-5 mt-1">
              <li>残りの参加者はA, C, Dの3名。</li>
              <li>未精算の3,000円を3名で再配分。</li>
              <li>各人が最終的に負担すべき金額は3,000円 ÷ 3人 = 1,000円。</li>
              <li>精算時には、Aは2,000円を受け取り（3,000円支払い - 1,000円負担）、CとDはそれぞれ1,000円をAに支払う、といった形での精算が提案されます。</li>
            </ul>
          </li>
        </ul>
      </div>

      <p className="mt-6 mb-4">本アルゴリズムは、これらの規則に基づき、ユーザーの皆様が安心してグループ内での金銭管理を行えるよう設計されております。ご不明な点がございましたら、お気軽にお問い合わせください。</p>

    </div>
  );
};
