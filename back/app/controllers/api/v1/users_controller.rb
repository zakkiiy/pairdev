module Api
  module V1
    class Api::V1::UsersController < ApplicationController
      def create
        # 条件に該当するデータがあればそれを返す。なければ新規作成
        user = User.find_or_create_by(provider: params[:provider], avatar_url: params[:avatar_url], uid: params[:uid], name: params[:name])
        if user
          head :ok
        else
          render json: { error: "ログインに失敗しました" }, status: :unprocessable_entity
        end
      rescue StandardError => e
        render json: { error: e.message }, status: :internal_server_error
      end
    end
  end
end