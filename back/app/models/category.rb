# User Category represents a category in the application.
class Category < ApplicationRecord
  has_many :posts, dependent: :destroy
end
