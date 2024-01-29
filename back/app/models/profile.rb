class Profile < ApplicationRecord
  belongs_to :user

  enum gender: { undefined: 0, male: 1, female: 2 }
end
