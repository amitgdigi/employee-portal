class Api::V1::MessagesController < Api::V1::ApplicationController
  def index
    if params[:msg_of] =="room"
      room_messages
    elsif params[:msg_of] == "user"
      user_messages
    end

    render json: { single_room: @single_room, messages: @messages}, status: :ok
  end

  def create
    message = current_user.messages.new(content: msg_params[:content], room_id: params[:room_id])
    if message.save
      render json: { notice: "Message created success" }, status: :ok
    else
      render json: { error: message.errors.messages }, status: :unprocessable_entity
    end
  end

  private
  def get_name(user1, user2)
    users = [user1, user2].sort
    "private_#{users[0].id}_#{users[1].id}"
  end

  def user_messages
    user = User.find(params[:id])
    room_name = get_name(user, current_user)
    @single_room = Room.where(name: room_name).first || Room.create_private_room([user, current_user], room_name)
    @messages = @single_room.messages.last(params[:item] || 20).map{|m| m.serialize }
  end
  
  def room_messages
    @single_room = Room.find(params[:id])
    @messages = @single_room.messages.last(params[:item] || 20).map{|m| m.serialize }
  end
  
  def msg_params
    params.require(:message).permit(:content)
  end
end
