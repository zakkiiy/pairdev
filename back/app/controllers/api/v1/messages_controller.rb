module Api
  module V1
    # Api::V1::MessagesController is responsible for handling
    class MessagesController < ApplicationController
      before_action :set_current_user

      def index
        room = Room.find(params[:room_id])
        messages = room.messages.includes(:user).order(created_at: :desc)
        render json: messages.as_json(include: { user: { only: [:id, :name, :uid, :avatar_url] } })
      end

      def create
        room = Room.find(params[:room_id])

        return render json: { error: '参加していないルームにはメッセージを送信できません。' }, status: :forbidden unless @current_user.room_users.exists?(room:)

        message = @current_user.messages.new(message_params.merge(room:))

        if message.save
          ActionCable.server.broadcast "chat_channel_#{message.room_id}", {
            message: {
              id: message.id,
              content: message.content,
              user: {
                id: message.user.id,
                name: message.user.name,
                uid: message.user.uid,
                avatar_url: message.user.avatar_url
              }
            }
          }

          render json: { message: 'メッセージが作成されました。' }, status: :ok
        else
          render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        message = @current_user.messages.find_by(id: params[:id])

        if message.destroy
          render json: { message: 'メッセージが削除されました。' }, status: :ok
        else
          render json: { error: 'メッセージの削除に失敗しました。' }, status: :unprocessable_entity
        end
      end

      private

      def message_params
        params.require(:message).permit(:content)
      end
    end
  end
end
