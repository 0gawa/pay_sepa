class Transaction < ApplicationRecord
  belongs_to :payer, class_name: 'User', foreign_key: :payer_id
  belongs_to :group
  has_many :transaction_participations, dependent: :destroy
  has_many :participants, through: :transaction_participations, source: :user

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :payer,  presence: true
  validates :group,  presence: true
  validates :description, length: {maximum: 300}
end
