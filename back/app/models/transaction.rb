class Transaction < ApplicationRecord
  belongs_to :payer, class_name: 'User'
  belongs_to :group
  has_many :transaction_participations, dependent: :destroy
  has_many :participants, through: :transaction_participations, source: :user

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :payer,  presence: true
  validates :group,  presence: true
  validates :description, length: {maximum: 300}

  # TODO: 取引の相手が存在するかのロジックを作成
end
