module Api
  module V1
    class PostsController < ApplicationController
      # def index
      #   posts = Post.all
      #   render json: posts || []
      # end

      def index
        posts = Post.includes(:category).order(created_at: :desc).all
        posts_with_category_names = posts.map do |post|
          post.attributes.merge({ 'category_name' => post.category.name })
        end
        render json: posts_with_category_names
      end
    end
  end
end
