class User < ApplicationRecord
  has_secure_password :password
  attr_accessor :current_password
  after_commit :broadcast_message
  
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  normalizes :email, with: -> email { email.downcase }
  # normalizes :phone, with: -> phone { phone.delete("^0-9").delete_prefix("0") }
  scope :all_except, ->(user) { where.not(id: user) }

  has_many :messages, :dependent => :destroy
  has_many :participants

  generates_token_for :password_reset, expires_in: 15.minutes do
    password_salt&.last(10)
  end

  def username
    return self.email.split('@').first.titleize
  end

  def serialize
    { id:,
      name:,
      username:,
      message: messages.last&.content || nil
    }
  end

  def broadcast_message
    ActionCable.server.broadcast('user_channel', self)
  end
end
