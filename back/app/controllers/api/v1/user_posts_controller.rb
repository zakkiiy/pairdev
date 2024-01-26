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
    post = @current_user.posts.new(post_params.except(:tags))
    tags = params[:post][:tags].split(',')

    if post.save
      tags.each do |tag_name|
        tag = Tag.find_or_create_by(name: tag_name.strip)
        post.tags << tag
      end

      @room = post.create_room
      success_message = I18n.t('flash.posts.create.success')
      render json: { status: 'success', message: success_message, data: post }, status: :created
    else
      puts post.errors.full_messages
      Rails.logger.info("バリデーションエラー: #{post.errors.full_messages.join(", ")}")
      failure_message = I18n.t('flash.posts.create.failure')
      render json: { status: 'failure', message: failure_message, data: post }, status: :unprocessable_entity
    end
  end

  def edit_form
    post = Post.includes(:category).find(params[:id])
    post_with_category_name = post.attributes.merge({ 
      'category_name' => post.category.name,
      'start_date' => post.formatted_start_date,
      'end_date' => post.formatted_end_date,
    })
    render json: post_with_category_name
  end

  def update
    p params
    post = @current_user.posts.find_by(id: params[:id])

    if post.update(post_params)
      success_message = I18n.t('flash.posts.update.success')
      render json: { status: 'success', message: success_message, data: post }, status: :ok
    else
      failure_message = I18n.t('flash.posts.update.failure')
      render json: { status: 'failure', message: failure_message, data: post }, status: :unprocessable_entity
    end
  end

  def destroy
    post = @current_user.posts.find_by(id: params[:id])
    if post.destroy
      success_message = I18n.t('flash.posts.destroy.success')
      render json: { status: 'success', message: success_message, data: post }, status: :ok
    else
      failure_message = I18n.t('flash.posts.destroy.failure')
      render json: { status: 'failure', message: failure_message, data: post }, status: :unprocessable_entity
    end
  end

  private
  
  def post_params
    params.require(:post).permit(:title, :description, :start_date, :end_date, :recruiting_count, :status, :category_id, :tags)
  end
end
