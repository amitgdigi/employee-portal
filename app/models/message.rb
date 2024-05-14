class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room
  before_create :confirm_participant
  after_commit :broadcast_message

  def confirm_participant
    if self.room.is_private
      is_participant = Participant.where(user_id: self.user.id, room_id: self.room.id).first
      throw :abort unless is_participant
    end
  end

  def serialize
    {
      id:,
      user_id:,
      username: user.username,
      room_id:,
      content: 
    }
  end

  def broadcast_message
    ActionCable.server.broadcast('message_channel', self)
  end
end
