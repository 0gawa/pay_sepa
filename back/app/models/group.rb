class Group < ApplicationRecord
  before_create :set_id
  
  has_many :users, dependent: :destroy
  has_many :transaction_data, dependent: :destroy, class_name: 'Transaction'
  has_many :settlements, dependent: :destroy

  validates :name, presence: true, length: {maximum: 50}
  validates :description, length: {maximum: 300}

  validate :maximum_users_per_group, on: [:create, :update]

  private

  def set_id
    while self.id.blank? || User.find_by(id: self.id).present? do
      self.id = SecureRandom.urlsafe_base64(20)
    end
  end

  def maximum_users_per_group
    if users.size > MAX_GROUP_MEMBERS
      errors.add(:users, "は最大#{MAX_GROUP_MEMBERS}人までしか登録できません") 
      raise ActiveRecord::RecordInvalid
    end
  end
end
