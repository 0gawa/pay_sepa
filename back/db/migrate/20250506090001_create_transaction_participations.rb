class CreateTransactionParticipations < ActiveRecord::Migration[8.0]
  def change
    create_table :transaction_participations do |t|
      t.belongs_to :user
      t.belongs_to :transaction

      t.timestamps
    end
  end
end
