class User < ApplicationRecord
  belongs_to :group
  
  has_many :transaction_data, dependent: :destroy, class_name: 'Transaction', foreign_key: :payer_id 
  has_many :transaction_participations, dependent: :destroy
  has_many :settlements

  validates :name,     presence: true, length: {maximum: 30}
  validates :group_id, presence: true

  validate :group_has_space, on: [:create]

  private

  def group_has_space
    if group && group.users.size > MAX_GROUP_MEMBERS
      errors.add(:group_id, "はすでに#{MAX_GROUP_MEMBERS}人のユーザーが所属しています")
      raise ActiveRecord::RecordInvalid
    end
  end
end
