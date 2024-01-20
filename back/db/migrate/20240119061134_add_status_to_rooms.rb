class AddStatusToRooms < ActiveRecord::Migration[7.0]
  def change
    add_column :rooms, :status, :integer, default: 0, null: false
  end
end
