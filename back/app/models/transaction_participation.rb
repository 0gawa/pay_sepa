class TransactionParticipation < ApplicationRecord
  belongs_to :user
  belongs_to :payment, class_name: 'Transaction'
end
