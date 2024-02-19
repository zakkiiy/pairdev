# User model represents a user in the application.
class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :room_users, dependent: :destroy
  has_many :rooms, through: :room_users
  has_many :messages, dependent: :destroy
  has_one :profile, dependent: :destroy

  after_create :create_default_profile

  private

  def create_default_profile
    create_profile
  end
end
