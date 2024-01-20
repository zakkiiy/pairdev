class Room < ApplicationRecord
  enum status: { open: 0, full: 1 } # 0参加, 1満員
  belongs_to :post
  has_many :room_users, dependent: :destroy

  after_create :add_creator_to_room_users

  # 部屋の満員状態を確認して、更新するメソッド
  def update_room_status
    if room_users.count < post.recruiting_count
      open!
    else
      full!
    end
  end

  private

  # RoomUserのレコード作成（参加）
  def add_creator_to_room_users
    room_users.create(user_id: post.user_id)
  end
end
