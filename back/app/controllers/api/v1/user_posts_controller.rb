class Api::V1::UserPostsController < ApplicationController
  before_action :set_current_user

  def index
    posts = @current_user.posts.includes(:category).order(created_at: :desc)
    posts_with_category_names = posts.map do |post|
      post.attributes.merge({ 
        'category_name' => post.category.name,
        'start_date' => post.formatted_start_date,
        'end_date' => post.formatted_end_date,
         })
    end
    render json: posts_with_category_names
  end

  def create
    post = @current_user.posts.new(post_params)

    if post.save
      success_message = I18n.t('flash.posts.create.success')
      render json: { status: 'success', message: success_message, data: post }, status: :created
    else
      failure_message = I18n.t('flash.posts.create.failure')
      render json: { status: 'failure', message: failure_message, data: post }, status: :unprocessable_entity
    end
  end

  private
  
  def post_params
    params.require(:post).permit(:title, :description, :start_date, :end_date, :recruiting_count, :status, :category_id)
  end
end
