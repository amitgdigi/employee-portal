class User < ApplicationRecord
    has_secure_password :password
    validates :name, presence: true
    validates :email, presence: true, uniqueness: true
    normalizes :email, with: -> email { email.downcase }
    # normalizes :phone, with: -> phone { phone.delete("^0-9").delete_prefix("0") }

    attr_accessor :current_password

    generates_token_for :password_reset, expires_in: 15.minutes do
      password_salt&.last(10)
    end
end
