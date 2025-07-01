export default function Page() {
  return (
  <div className="container mx-auto p-6 md:p-10 max-w-4xl bg-white shadow-lg rounded-lg my-8">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center border-b-2 border-blue-500 pb-4">
      プライバシーポリシー
    </h1>

    <p className="text-lg text-gray-700 mb-8">
      このプライバシーポリシーは、<strong className="text-blue-600">Just Pay</strong>（以下、「本アプリ」といいます）が提供するサービス（以下、「本サービス」といいます）における、お客様の個人情報の取り扱いについて定めます。<strong className="text-blue-600">Just Pay</strong>は割り勘サービスという性質上、金銭に関する情報を取り扱います。お客様の情報を細心の注意を払って適切に取り扱うことをお約束します。
    </p>

    <hr className="my-8 border-t-2 border-gray-200" />

    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
      1. 取得する情報とその方法
    </h2>
    <p className="text-gray-700 mb-4">
      <strong className="text-blue-600">Just Pay</strong>は、本サービスの提供にあたり、以下の情報を取得する場合があります。
    </p>
    <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
      <li><strong>グループおよび取引情報</strong>: ご利用されるグループ名、各取引における債務者、債権者、取引金額、参加者、取引に関する説明文など、割り勘計算に必要な情報。</li>
      <li><strong>通信情報</strong>: 本サービスのご利用に伴う通信履歴など。</li>
      <li><strong>技術情報</strong>: ご利用の端末情報（OSバージョン、端末モデルなど）、IPアドレス、Cookie情報、アクセスログなど。</li>
    </ul>
    <p className="text-gray-700">
      これらの情報は、お客様が本アプリをご利用になる際に、お客様ご自身による入力、または自動的に取得されます。
    </p>

    <hr className="my-8 border-t-2 border-gray-200" />

    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
      2. 取得した情報の利用目的
    </h2>
    <p className="text-gray-700 mb-4">
      <strong className="text-blue-600">Just Pay</strong>が取得した情報は、以下の目的で利用します。
    </p>
    <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
      <li>本サービスの提供・運営のため（割り勘計算、グループ管理、ユーザー間精算情報の表示など）</li>
      <li>本サービスの改善、新機能の開発のため</li>
      <li>お客様からのお問い合わせへの対応のため</li>
      <li>利用規約に違反する行為への対応のため</li>
      <li>本サービスに関するお知らせや情報提供のため</li>
      <li>統計データの作成、分析のため（個人を特定できない形式に加工します）</li>
    </ul>

    <hr className="my-8 border-t-2 border-gray-200" />

    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
      3. 個人情報の第三者提供
    </h2>
    <p className="text-gray-700">
      <strong className="text-blue-600">Just Pay</strong>は、法令で認められる場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
    </p>

    <hr className="my-8 border-t-2 border-gray-200" />

    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
      4. 個人情報の安全管理
    </h2>
    <p className="text-gray-700">
      <strong className="text-blue-600">Just Pay</strong>は、取得した個人情報の漏洩、滅失、毀損の防止、その他個人情報の安全管理のために、必要かつ適切な措置を講じます。
    </p>

    <hr className="my-8 border-t-2 border-gray-200" />

    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
      5. 免責事項
    </h2>
    <p className="text-gray-700">
      本サービスは割り勘計算を円滑に行うための補助ツールであり、金銭の直接的なやり取りを行うものではありません。<strong className="text-blue-600">Just Pay</strong>は、<strong className="text-red-600">細心の注意を払ってサービスの開発および運営にあたっておりますが、バグやシステム上の不具合、その他予期せぬ事態により、お客様に何らかの損害（金銭的損害を含む）が生じた場合であっても、本アプリはその一切の責任を負いません</strong>。お客様は、自己の判断と責任において本サービスをご利用ください。
    </p>

    <hr className="my-8 border-t-2 border-gray-200" />

    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
      6. サービスの変更、中断、終了等
    </h2>
    <p className="text-gray-700">
      <strong className="text-blue-600">Just Pay</strong>は、<strong className="text-red-600">お客様への事前の通知または承諾なしに、本サービスの内容を変更、中断、または終了することができます</strong>。本サービスの変更、中断、または終了によってお客様に生じたいかなる損害についても、<strong className="text-blue-600">Just Pay</strong>は一切の責任を負いません。重要な変更や終了の際には、可能な限り速やかに本アプリ内またはウェブサイト上でお知らせするよう努めます。
    </p>

    <hr className="my-8 border-t-2 border-gray-200" />

    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
      7. 権利義務の譲渡の禁止
    </h2>
    <p className="text-gray-700">
      お客様は、本アプリにおけるお客様の権利または義務を、<strong className="text-blue-600">Just Pay</strong>の書面による事前の承諾なく、第三者に譲渡、承継、担保設定、その他一切の処分をすることはできません。
    </p>

    <hr className="my-8 border-t-2 border-gray-200" />

    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
      8. プライバシーポリシーの変更
    </h2>
    <p className="text-gray-700">
      本プライバシーポリシーは、法令の改正、本サービスの改善、その他必要に応じて変更されることがあります。変更後のプライバシーポリシーは、本アプリ内または本アプリのウェブサイト上に掲載された時点から効力を生じるものとします。
    </p>

    <hr className="my-8 border-t-2 border-gray-200" />

    <p className="text-sm text-gray-500 mt-10 text-center">
      <strong className="text-gray-600">Just Pay 製作者</strong>
    </p>
    <p className="text-sm text-gray-500 text-center">
      制定日: 2025年7月1日
    </p>
  </div>
  );
}
