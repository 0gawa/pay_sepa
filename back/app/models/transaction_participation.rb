class TransactionParticipation < ApplicationRecord
  belongs_to :user
  belongs_to :payment, class_name: 'Transaction'

  validates :user_id       , presence: true
  validates :transaction_id, presence: true
end
