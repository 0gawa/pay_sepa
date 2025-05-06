class User < ApplicationRecord
  belongs_to :user
  
  validates :name, presence: true, length: {maximum: 50}
  validates :group_id, presence: true
end
