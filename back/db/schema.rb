# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_06_090021) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "groups", id: :string, force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "settlements", force: :cascade do |t|
    t.bigint "from_user_id", null: false
    t.bigint "to_user_id", null: false
    t.string "group_id", null: false
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["from_user_id"], name: "index_settlements_on_from_user_id"
    t.index ["to_user_id"], name: "index_settlements_on_to_user_id"
  end

  create_table "transaction_participations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "transaction_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["transaction_id"], name: "index_transaction_participations_on_transaction_id"
    t.index ["user_id", "transaction_id"], name: "index_transaction_participations_on_user_id_and_transaction_id", unique: true
    t.index ["user_id"], name: "index_transaction_participations_on_user_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.bigint "payer_id", null: false
    t.string "group_id", null: false
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["payer_id"], name: "index_transactions_on_payer_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.integer "group_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "settlements", "users", column: "from_user_id"
  add_foreign_key "settlements", "users", column: "to_user_id"
  add_foreign_key "transaction_participations", "transactions"
  add_foreign_key "transaction_participations", "users"
  add_foreign_key "transactions", "users", column: "payer_id"
end
