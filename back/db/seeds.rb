# データを全消しする
Post.delete_all
Category.delete_all
User.delete_all

# カテゴリーを作成
categories = ["チーム開発", "ペアプログラミング", "GitHub-Flow"].map do |name|
  Category.create!(name: name)
end

# 特定のユーザーを作成または取得（既に存在する場合）
user = User.find_or_create_by(uid: "131367248") do |u|
  u.provider = "github"
  u.avatar_url = "https://avatars.githubusercontent.com/u/131367248?v=4"
  u.name = "ざっきー"
end

# 特定のユーザーに対してポストを作成
3.times do |i|
  Post.create!(
    user_id: user.id,
    category_id: categories.sample.id,  # ランダムにカテゴリを選択し、そのIDを設定
    title: "Post #{i+1} by ざっきー",
    start_date: Time.now,
    end_date: Time.now + 5.days,
    recruiting_count: 5,
    description: "This is a sample post #{i+1} by ざっきー.",
    status: 'open'
  )
end

# 新しいユーザーとそのポストを作成
3.times do |n|
  new_user = User.create!(
    provider: "github",
    avatar_url: "https://example.com/avatar#{n}.png",
    uid: "#{n+100}",
    name: "ユーザー#{n+1}"
  )

  3.times do |i|
    Post.create!(
      user: new_user,
      category_id: categories.sample.id,  # ランダムにカテゴリを選択し、そのIDを設定
      title: "Post #{i+1} by ユーザー#{n+1}",
      start_date: Time.now,
      end_date: Time.now + 5.days,
      recruiting_count: 5,
      description: "This is a sample post #{i+1} by ユーザー#{n+1}.",
      status: 'open'
    )
  end
end

puts "Seed data created!"
