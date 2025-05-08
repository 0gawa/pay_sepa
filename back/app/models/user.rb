class User < ApplicationRecord
  belongs_to :group
  
  has_many :transaction_data, dependent: :destroy, class_name: 'Transaction'
  has_many :transaction_participations
  has_many :settlements

  validates :name, presence: true, length: {maximum: 50}
  validates :group_id, presence: true
end
