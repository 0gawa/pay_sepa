FactoryBot.define do
  factory :group do
    name {Faker::Internet.username(specifier: 5..10)}
    description {Faker::Lorem.sentence(word_count: 10)}
  end
end
