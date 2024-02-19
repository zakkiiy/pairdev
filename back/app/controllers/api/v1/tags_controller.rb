module Api
  module V1
    # Api::V1::TagsController handles API requests for posts.
    class TagsController < ApplicationController
      def index
        tags = Tag.all
        render json: tags
      end
    end
  end
end
