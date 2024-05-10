class Api::V1::MessagesController < Api::V1::ApplicationController
  def index
    messages = Message.all
    render json: { messages: , notice: "success"}, state: :ok
  end

  def create
    message = current_user.messages.create(content: msg_params[:content], room_id: params[:room_id])
    if message.valid?
      ActionCable.server.broadcast('message_channel', message) if message.save
      head :ok
      # render json: { notice: "Message created success" }, status: :ok
    else
      render json: { error: message.errors.messages }
    end
  end
  
  private
  
  def msg_params
    params.require(:message).permit(:content)
  end
end
