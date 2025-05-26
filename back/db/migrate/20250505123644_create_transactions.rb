class CreateTransactions < ActiveRecord::Migration[8.0]
  def change
    create_table :transactions do |t|
      t.references :payer, null: false, foreign_key: { to_table: :users }
      t.string :group_id, null: false
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.string :description
      t.timestamps
    end
  end
end
