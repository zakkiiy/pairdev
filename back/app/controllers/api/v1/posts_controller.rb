module Api
  module V1
    # Api::V1::PostsController is responsible for handling
    class PostsController < ApplicationController
      before_action :set_current_user, only: [:show]

      def index
        posts = Post.includes(:category, :tags, :user).order(created_at: :desc)
        posts_with_category_names = posts.map do |post|
          post.attributes.merge({
                                  'name' => post.user.name,
                                  'avatar_url' => post.user.avatar_url,
                                  'participant_count' => post.room.current_participant_count,
                                  'tags' => post.tags.map(&:name),
                                  'category_name' => post.category.name,
                                  'start_date' => post.formatted_start_date,
                                  'end_date' => post.formatted_end_date
                                })
        end
        render json: posts_with_category_names
      end

      def show
        post = Post.includes(:category, :tags).find(params[:id])
        is_poster = @current_user.id == post.user_id
        post_with_category_name = post.attributes.merge({
                                                          'participant_count' => post.room.current_participant_count,
                                                          'tags' => post.tags.map(&:name),
                                                          'category_name' => post.category.name,
                                                          'start_date' => post.formatted_start_date,
                                                          'end_date' => post.formatted_end_date
                                                        })
        render json: { post: post_with_category_name, is_poster: }
      end
    end
  end
end
