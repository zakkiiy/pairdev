class Post < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_one :room, dependent: :destroy
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags

  validates :category_id, presence: true
  validates :title, presence: true, length: { minimum: 5, maximum: 100 }
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :recruiting_count, presence: true
  validates :description, presence: true, length: { minimum: 30, maximum: 2000 }
  validates :status, presence: true
  
  def formatted_start_date
    start_date.strftime("%Y-%m-%d %H:%M:%S")
  end

  def formatted_end_date
    end_date.strftime("%Y-%m-%d %H:%M:%S")
  end
end
