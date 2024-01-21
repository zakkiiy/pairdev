class Api::V1::MessagesController < ApplicationController
  before_action :set_current_user

  def index
    room = Room.find(params[:room_id])
    messages = room.messages.includes(:user).order(created_at: :desc)
    render json: messages.as_json(include: { user: { only: [:id, :name, :uid] } })
  end

  def create
    p params
    p "あいうえお"
    room = Room.find(params[:room_id])
    message = @current_user.messages.new(message_params.merge(room: room))
    
    if message.save
      p "成功"
    else
      p "失敗"
    end
  end

  private

  def message_params
    params.require(:message).permit(:content)
  end

end
