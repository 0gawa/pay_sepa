class User < ApplicationRecord
  belongs_to :group
  
  validates :name, presence: true, length: {maximum: 50}
  validates :group_id, presence: true
end
