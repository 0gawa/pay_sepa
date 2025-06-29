import { Transaction } from '@/lib/types/transaction';

export default function TransactionDetail({ transaction }: { transaction: Transaction }){
  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">支払い者</p>
        <p className="text-xl font-bold text-gray-800">{transaction.payer.name}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">取引金額</p>
        <p className="text-2xl font-extrabold text-indigo-600">¥{transaction.amount | 0}</p>
      </div>

      <div className="mb-4 border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">参加者</p>
        <ul className="list-disc list-inside text-gray-700">
          {transaction.participants.map((debtor) => (
            <li key={debtor.id}>{debtor.name}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4 border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">内容</p>
        <p className="text-gray-700 whitespace-pre-wrap">{transaction.description || '説明はありません。'}</p>
      </div>
      
      <div className="mb-4 border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">1人あたりの金額</p>
        <p className="text-gray-700 whitespace-pre-wrap">{(transaction.amount / transaction.participants.length).toFixed(0)}</p>
      </div>
    </div>
  )
}
