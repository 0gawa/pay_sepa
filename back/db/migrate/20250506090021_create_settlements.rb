class CreateSettlements < ActiveRecord::Migration[8.0]
  def change
    create_table :settlements do |t|
      t.references :from_user, null: false, foreign_key: { to_table: :users }
      t.references :to_user, null: false, foreign_key: { to_table: :users }
      t.string :group_id, null: false
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.timestamps
    end
  end
end
