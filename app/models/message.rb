class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room
  before_create :confirm_participant

  def confirm_participant
    if self.room.is_private
      is_participant = Participant.where(user_id: self.user.id, room_id: self.room.id).first
      throw :abort unless is_participant
    end
  end

  def serialize
    {
      user_id: user_id,
      username: user.email.split("@").first,
      room_id: room_id,
      content: content
    }
  end
end
