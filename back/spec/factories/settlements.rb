FactoryBot.define do
  factory :settlement do
    association :from_user, factory: :user 
    association :to_user, factory: :user 
    association :group, factory: :group
    amount {Faker::Number.between(from: 10, to: 1000)}
  end
end
