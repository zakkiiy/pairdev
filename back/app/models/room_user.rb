# The RoomUser model represents the association between a user and a room in the application.
class RoomUser < ApplicationRecord
  belongs_to :user
  belongs_to :room
end
