class CreateTransactionParticipations < ActiveRecord::Migration[8.0]
  def change
    create_table :transaction_participations do |t|
      t.references :user, null: false, foreign_key: true
      t.references :transaction, null: false, foreign_key: true

      t.timestamps
    end
    add_index :transaction_participations, [:user_id, :transaction_id], unique: true
  end
end
