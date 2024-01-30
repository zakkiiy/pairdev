class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :room_users
  has_many :rooms, through: :room_users
  has_many :messages
  has_one :profile

  after_create :create_default_profile

  private

  def create_default_profile
    create_profile
  end

end
