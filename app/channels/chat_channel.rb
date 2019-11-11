class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_channel"
  end

  def emit(payload)
    ActionCable.server.broadcast "chat_channel", payload
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
