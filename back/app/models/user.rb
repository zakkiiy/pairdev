class User < ApplicationRecord
  has_many :posts
  has_many :room_users
  has_many :messages
end
