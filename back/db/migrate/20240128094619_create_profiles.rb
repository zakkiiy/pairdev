class CreateProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :profiles do |t|
      t.string :local_name
      t.integer :gender, default: 0, null: false
      t.integer :age, null: true
      t.integer :experience, default: 0, null: false
      t.text :description
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
