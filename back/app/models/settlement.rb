class Settlement < ApplicationRecord
  belongs_to :group
  belongs_to :from_user, class_name: 'User'
  belongs_to :to_user  , class_name: 'User'

  validates :group_id,  presence: true
  validates :amount,    presence: true, numericality: { greater_than: 0 }
  validates :from_user, presence: true
  validates :to_user,   presence: true
  validate :from_and_to_users_must_be_different

  private

  def from_and_to_users_must_be_different
    if from_user_id == to_user_id
      errors.add(:base, "支払元と支払先のユーザーは異なる必要があります")
    end
  end
end
