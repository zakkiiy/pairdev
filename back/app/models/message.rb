# Message model represents a message in the application.
class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room
end
