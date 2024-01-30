class Api::V1::RoomsController < ApplicationController
  before_action :set_current_user

  def show
    post = Post.find(params[:post_id])
    @room = post.room
    if @room
      is_creator = @current_user.id == post.user_id
      user_names = @room.users.map(&:name)
      participant_count = @room.current_participant_count
      render json: { room: @room, post: post, isCreator: is_creator, userNames: user_names, participantCount: participant_count }
    else
      render json: { error: "Room not found" }, status: :not_found
    end
  end

  def destroy
    post = Post.find(params[:post_id])
    room = post.room
    room_user = @current_user.room_users.find_by(room: room)

    if room_user
      room_user.destroy
      render json: { message: "部屋から退出しました" }, status: :ok
    else
      render json: { error: "すでに部屋から退出しています" }, status: :not_found
    end
  end

  def status
    post = Post.find(params[:post_id])

    if post && post.room
      post.room.update_room_status # ステータスを更新する場合
      render json: { status: post.room.status }
    else
      render json: { error: "Room not found" }, status: :not_found
    end
  end

  def join_status
    post = Post.find(params[:post_id])
    room = post.room
  
    if RoomUser.exists?(user_id: @current_user.id, room_id: room.id)
      render json: { isJoined: true }
    else
      render json: { isJoined: false }
    end
  end
end
