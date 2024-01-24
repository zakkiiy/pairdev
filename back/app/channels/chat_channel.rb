class ChatChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "chat_channel_#{params[:room_id]}"
  end

  def speak(data)
    ActionCable.server.broadcast "chat_channel_#{params[:room_id]}", message: data['message']
    
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
