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
  validates :description, presence: true, length: { minimum: 10, maximum: 2000 }
  validates :status, presence: true

  validate :start_date_end_date_valid
  
  def formatted_start_date
    start_date.strftime("%Y-%m-%d")
  end

  def formatted_end_date
    end_date.strftime("%Y-%m-%d")
  end

  private
  def start_date_end_date_valid
    if start_date < Date.current - 1.day
      errors.add(:start_date, 'は現在の日付より前の日付は入力できません。')
    end

    if end_date < start_date
      errors.add(:end_date, 'は開始日の翌日以降でなければなりません。')
    end
  end
end
