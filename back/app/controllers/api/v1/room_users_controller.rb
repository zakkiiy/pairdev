class Api::V1::RoomUsersController < ApplicationController
  before_action :set_current_user

  # def index
  #   p params
  #   room_users = @current_user.room_users.includes(room: :post)

  #   room_users_data = room_users.map do |room_user|
  #     room = room_user.room
  #     post = room.post

  #     {
  #       room_user_id: room_user.id,
  #       room_id: room.id,
  #       post_id: post.id,
  #       post_title: post.title,
  #     }
  #   end

  #   render json: room_users_data
  # end

  def create
    post = Post.find(params[:post_id])
    room = post.room    

    if room.room_users.count < post.recruiting_count
      room_user = @current_user.room_users.new(room_id: room.id)
      if room_user.save
        render json: { message: "参加成功" }, status: :ok
      else
        render json: { error: "参加失敗" }, status: :unprocessable_entity
      end
    else
      Rails.logger.info "参加失敗: 現在の参加者数 #{room.room_users.count} / 募集人数 #{post.recruiting_count}"
  
    end
  end
end
