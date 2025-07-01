export default function Page() {
  return (
    <div className="container mx-auto p-6 md:p-10 max-w-2xl bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
        製作者情報
      </h1>

      <p className="text-lg text-gray-700 mb-8 text-center">
        このページでは、本サービスを開発した製作者に関する情報をご紹介します。
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
          製作者プロフィール
        </h2>
        <ul className="list-none space-y-3 text-gray-700">
          <li><strong>名前</strong>: Daiki</li>
          <li><strong>性別</strong>: 男</li>
          <li><strong>年齢</strong>: 20代</li>
          <li><strong>得意な技術スタック</strong>: Docker, Rails, Next.js</li>
          <li><strong>好きなAI</strong>: Gemini</li>
        </ul>
      </div>

      <p className="text-gray-700 mb-4">
        本サービスは、私Daikiが皆様に快適な体験を提供できるよう、上記の技術を活用し、日々情熱を込めて開発しております。特に、モダンなWebアプリケーション開発においては<strong className="text-blue-600">Next.js</strong>を、バックエンドの堅牢な構築には<strong className="text-blue-600">Rails</strong>を、そして開発環境の効率化には<strong className="blue-600">Docker</strong>を積極的に採用しています。
      </p>

      <p className="text-gray-700 mb-4">
        また、最新のAI技術にも強い関心があり、特にGoogleが開発した<strong className="text-blue-600">Gemini</strong>の能力と可能性に魅力を感じています。本サービスにおいても、将来的にAIを活用した機能強化を検討してまいります。
      </p>

      <p className="text-gray-700 mb-7">
        皆様からのフィードバックを励みに、より良いサービスを提供できるよう努めてまいりますので、どうぞよろしくお願いいたします。
      </p>

      <p className="text-gray-700 text-sm">
        * このコンテンツには、Google Geminiが生成した要素が含まれています。
      </p>
    </div>
  );
}
