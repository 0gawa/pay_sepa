class TransactionParticipation < ApplicationRecord
  belongs_to :user
  belongs_to :payment, class_name: 'Transaction', foreign_key: 'transaction_id'
end
