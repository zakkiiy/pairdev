module Api
  module V1
    class PostsController < ApplicationController
      
      def index
        
        posts = Post.includes(:category).order(created_at: :desc).all
        posts_with_category_names = posts.map do |post|
          post.attributes.merge({ 
            'category_name' => post.category.name,
            'start_date' => post.formatted_start_date,
            'end_date' => post.formatted_end_date,
            })
        end
        render json: posts_with_category_names
      end

      def show
        post = Post.includes(:category).find(params[:id])
        post_with_category_name = post.attributes.merge({ 
          'category_name' => post.category.name,
          'start_date' => post.formatted_start_date,
          'end_date' => post.formatted_end_date,
        })
        render json: post_with_category_name
      end
    end
  end
end
