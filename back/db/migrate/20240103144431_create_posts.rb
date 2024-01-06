class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true, type: :bigint
      t.references :category, null: false, foreign_key: true, type: :bigint
      t.string :title, null: false
      t.datetime :start_date, null: false
      t.datetime :end_date, null: false
      t.bigint :recruiting_count, null: false
      t.text :description, null: false
      t.string :status, default: 'open', null: false  # 初期状態を 'open' としておく

      t.timestamps
    end
  end
end
