# db/seeds.rb

# 既存のデータをクリア
Post.delete_all
Category.delete_all
User.delete_all

ActiveRecord::Base.connection.reset_pk_sequence!('categories')
ActiveRecord::Base.connection.reset_pk_sequence!('posts')
ActiveRecord::Base.connection.reset_pk_sequence!('users')

# ユーザーを作成
users = User.create([
  { provider: "github", avatar_url: "https://avatars.githubusercontent.com/u/131367248?v=4", uid: "122", name: "ざっきー" },
  { provider: "github", avatar_url: "https://example.com/avatar0.png", uid: "100", name: "ユーザー1" },
  { provider: "github", avatar_url: "https://example.com/avatar1.png", uid: "101", name: "ユーザー2" },
  { provider: "github", avatar_url: "https://example.com/avatar2.png", uid: "102", name: "ユーザー3" },
  { provider: "github", avatar_url: "https://example.com/avatar3.png", uid: "103", name: "ユーザー4" }
])

# カテゴリーを作成
categories = Category.create([
  { name: "チーム開発" },
  { name: "ペアプログラミング" },
  { name: "GitHub-Flow" }
])

# 各ユーザーに対して投稿を作成
users.each_with_index do |user, index|
  Post.create([
    {
      user: user,
      category: categories[index % categories.length],
      title: "サンプル投稿 #{index + 1}",
      start_date: Date.today,
      end_date: Date.today + 5.days,
      recruiting_count: 5,
      description: "#{user.name}による投稿。",
      status: "open"
    }
  ])
end

puts "Seed data created!"
