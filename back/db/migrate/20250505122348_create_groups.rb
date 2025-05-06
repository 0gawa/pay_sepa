class CreateGroups < ActiveRecord::Migration[8.0]
  def change
    create_table :groups, id: :string do |t|
      t.string :name, null: false
      t.text :description
      t.timestamps
    end
  end
end
