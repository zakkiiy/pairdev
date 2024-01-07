class Api::V1::UserPostsController < ApplicationController
  before_action :set_current_user

  def index
    posts = @current_user.posts.includes(:category).order(created_at: :desc)
    posts_with_category_names = posts.map do |post|
      post.attributes.merge({ 'category_name' => post.category.name })
    end
    render json: posts
  end

  private
  
  def post_params
    params.require(:post).permit(:title, :description, :start_date, :end_date, :recruiting_count)
  end
end
