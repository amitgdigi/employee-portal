class Api::V1::RoomsController < Api::V1::ApplicationController
  def index
    room = Room.new
    rooms = Room.public_rooms
    users = User.all_except(current_user)
    if @single_room.present?
      messages = single_room.messages
    else
      messages = current_user&.messages || []
    end
    render json: { current_user: , room: , rooms: , users: users.map{ |u| u.serialize }, 
      messages: , notice: :success }, status: :ok
  end
  
  def create
    @room = Room.create(name: params["room"]["name"])
    if @room.valid?
      render json: { notice: "Room created success" }, status: :ok
    else
      render json: { error: @room.errors.messages }, status: :ok
    end
  end
  
  def show
   current_user = current_user
   single_room = Room.find(params[:id])
   rooms = Room.public_rooms
   users = User.all_except(current_user)
   room = Room.new
   message = Message.new
   messages = single_room.messages.map{|m| m.serialize }
    render json: { current_user: , single_room:, rooms:, users:, room:, message:, messages: }
  end
end
