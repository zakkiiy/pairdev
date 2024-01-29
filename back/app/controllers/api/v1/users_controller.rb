module Api
  module V1
    class Api::V1::UsersController < ApplicationController
      def create
        # 既存のユーザーをUIDで検索
        user = User.find_by(provider: params[:provider], uid: params[:uid])
        # ユーザーが存在しなければ新しく作成
        unless user
          user = User.create(provider: params[:provider], avatar_url: params[:avatar_url], uid: params[:uid], name: params[:name])
        end

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