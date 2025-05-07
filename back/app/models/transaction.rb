class Transaction < ApplicationRecord
  belongs_to :payer, class_name: 'User'
  belongs_to :group
  has_many :transaction_participations, dependent: :destroy
  has_many :participants, through: :transaction_participations, source: :user

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :payer, presence: true
  validates :participants, presence: true # 取引には相手が必ず1人以上いる必要がある
  validates :group, presence: true
  validates :description, length: {maximum: 300}
end
