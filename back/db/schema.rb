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

ActiveRecord::Schema[7.0].define(version: 2024_01_20_045517) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "user_id", null: false
    t.bigint "room_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["room_id"], name: "index_messages_on_room_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "category_id", null: false
    t.string "title", null: false
    t.datetime "start_date", null: false
    t.datetime "end_date", null: false
    t.bigint "recruiting_count", null: false
    t.text "description", null: false
    t.string "status", default: "open", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_posts_on_category_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "room_users", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "room_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["room_id"], name: "index_room_users_on_room_id"
    t.index ["user_id", "room_id"], name: "index_room_users_on_user_id_and_room_id", unique: true
    t.index ["user_id"], name: "index_room_users_on_user_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.bigint "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", default: 0, null: false
    t.index ["post_id"], name: "index_rooms_on_post_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", null: false
    t.string "avatar_url", null: false
    t.string "uid", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "messages", "rooms"
  add_foreign_key "messages", "users"
  add_foreign_key "posts", "categories"
  add_foreign_key "posts", "users"
  add_foreign_key "room_users", "rooms"
  add_foreign_key "room_users", "users"
  add_foreign_key "rooms", "posts"
end
