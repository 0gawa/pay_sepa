class TransactionParticipation < ApplicationRecord
  belongs_to :user
  belongs_to :payment, class_name: 'Transaction', foreign_key: "transaction_id"

  validates :user_id, uniqueness: { scope: :transaction_id, message: "は既にこの取引に参加しています" }
end
