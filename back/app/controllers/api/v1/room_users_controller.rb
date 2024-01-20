
# class Api::V1::RoomUsersController < ApplicationController
#   before_action :set_current_user

#   def create
#     post = Post.find(params[:post_id])
#     room = post.room
#     room_user = @current_user.room_users.new(room_id: room.id)

#     if room_user.save
#       render json: { message: "参加成功" }, status: :ok
#     else
#       render json: { error: "参加失敗" }, status: :unprocessable_entity
#     end
#   end
# end

class Api::V1::RoomUsersController < ApplicationController
  before_action :set_current_user

  def create
    post = Post.find(params[:post_id])
    room = post.room
    p room.room_users.count
    p post.recruiting_count
    

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
