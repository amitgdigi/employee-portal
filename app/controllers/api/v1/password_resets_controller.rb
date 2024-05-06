class Api::V1::PasswordResetsController < ApplicationController
  def new
  end

  def create
    if @user = User.find_by_email(params[:email])
      PasswordMailer.with(
          user: @user,
          token: @user.generate_token_for(:password_reset)
        ).reset.deliver_later
    end
    render json: { notice: 'If an account with that email was found, we have sent a link to reset password' }
  
  end

  def edit
    @user = User.find_signed!(params[:token], purpose: 'password_reset')
    rescue ActiveSupport::MessageVerifier::InvalidSignature
    render json: { alert: 'Your token has expired. Please try again' }
  end

  def update
    
    @user = User.find_by_token_for!(:password_reset, params[:token])
    if @user.update(password_params)
      render json: { notice: 'Your password was reset succesfully. Please sign in.' }
    else
      render json: { alert: 'Your token has expired. Please try again' }
    end
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    render json: { alert: 'Your token has expired. Please try again' }
  end
  private

  def password_params
    params.require(:user).permit(
        :password, 
        :password_confirmation,
      )

  end
end
