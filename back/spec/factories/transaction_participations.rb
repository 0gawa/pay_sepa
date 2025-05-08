FactoryBot.define do
  factory :transaction_participation do
    association :user, factory: :user
    association :payment, factory: :transaction
  end
end
