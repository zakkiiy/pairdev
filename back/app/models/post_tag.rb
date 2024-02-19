# The PostTag model represents the association between a post and a tag in the application.
class PostTag < ApplicationRecord
  belongs_to :post
  belongs_to :tag
end
