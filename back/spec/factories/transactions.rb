FactoryBot.define do
  factory :transaction do
    description {Faker::Lorem.sentence(word_count: 10)}
    amount {Faker::Number.between(from: 10, to: 1000)}
    association :payer, factory: :user 
    association :group

    transient do
      participants { [payer] }
    end

    after(:create) do |transaction, evaluator|
      participants_to_add = evaluator.participants.presence || [transaction.payer]

      participants_to_add.each do |participant|
        transaction.participants << participant
      rescue ActiveRecord::RecordInvalid => e
        puts "Error adding participant #{participant.id} to transaction #{transaction.id}: #{e.message}"
        raise e
      end
    end
  end
end
