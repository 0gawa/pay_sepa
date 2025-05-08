FactoryBot.define do
  factory :transaction do
    description {Faker::Lorem.sentence(word_count: 10)}
    amount {Faker::Number.between(from: 10, to: 1000)}
    association :payer
    group
  end
end
