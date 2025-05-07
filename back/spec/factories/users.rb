FactoryBot.define do
  factory :user do
    name {Faker::Internet.username(specifier: 5..10)}
    group
  end
end
