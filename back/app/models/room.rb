# Room model represents a room in the application.
class Room < ApplicationRecord
  enum status: { open: 0, full: 1, joined: 2 } # 0参加, 1満員, 2参加済み
  belongs_to :post
  has_many :room_users, dependent: :destroy
  has_many :users, through: :room_users
  has_many :messages, dependent: :destroy

  after_create :add_creator_to_room_users

  # 部屋の満員状態を確認して、更新するメソッド
  def update_room_status
    if room_users.count < post.recruiting_count
      open!
    else
      full!
    end
  end

  def current_participant_count
    users.count
  end

  private

  # RoomUserのレコード作成（参加）
  def add_creator_to_room_users
    room_users.create(user_id: post.user_id)
  end
end
