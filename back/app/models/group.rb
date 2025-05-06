class Group < ApplicationRecord
  before_create :set_id
  
  has_many :users, dependent: :destroy
  has_many :transactions, dependent: :destroy
  has_many :settlements, dependent: :destroy

  validates :name, presence: true, length: {maximum: 50}
  validates :description, length: {maximum: 300}

  private

  def set_id
    while self.id.blank? || User.find_by(id: self.id).present? do
      self.id = SecureRandom.urlsafe_base64(20)
    end
  end
end
