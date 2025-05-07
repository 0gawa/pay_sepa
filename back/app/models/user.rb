class User < ApplicationRecord
  belongs_to :group
  
  has_many :transaction_data, dependent: :destroy, class_name: 'Transaction'

  validates :name, presence: true, length: {maximum: 50}
  validates :group_id, presence: true
end
