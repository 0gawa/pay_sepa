class User < ApplicationRecord
  belongs_to :group
  
  has_many :transaction_data, dependent: :destroy, class_name: 'Transaction', foreign_key: :payer_id 
  has_many :transaction_participations, dependent: :destroy
  has_many :settlements

  validates :name,     presence: true, length: {maximum: 50}
  validates :group_id, presence: true
end
