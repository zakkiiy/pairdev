class Post < ApplicationRecord
  belongs_to :user
  belongs_to :category

  validates :category_id, presence: true
  validates :title, presence: true #, length: { maximum: 12 }
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :recruiting_count, presence: true
  validates :description, presence: true
  validates :status, presence: true
  

  def formatted_start_date
    start_date.strftime("%Y-%m-%d %H:%M:%S")
  end

  def formatted_end_date
    end_date.strftime("%Y-%m-%d %H:%M:%S")
  end
end
