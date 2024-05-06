module Api::V1
class UsersController < ApplicationController
    def index
        @users = User.all
      end
    
      def new
        @user = User.new
      end
    
      def create
        @user = User.new(user_params)

        if @user.save!
          login(@user)
          render json: { notice: "User created successfully", user: @user }, status: :ok
        else
          flash[:alert] = "User not created"
          render json: { error: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end
    
      def edit
        @user = current_user
      end
    
      def update
        if current_user.update(password_params)
          render json: { notice: "Password reset successfully", user: current_user }, status: :ok
        else
          flash[:error] = current_user.errors.full_messages
          render :edit,status: :unprocessable_entity
        end  
      end
      def forgot_password
        @user = User.find_signed!(params[:token], purpose: 'password_reset')
        if @user.update(password_params)
          redirect_to new_session_path, notice: 'Your password was reset succesfully. Please sign in.'
        else
          render 'edit'
        end
      rescue ActiveSupport::MessageVerifier::InvalidSignature
        redirect_to new_session_path, alert: 'Your token has expired. Please try again'
      end
    
      private
    
      def user_params
        params.require(:user).permit(:name, :email, :phone, :password, :password_confirmation)
      end 
       
      def password_params
        params.require(:user).permit(
          :password, 
          :password_confirmation, 
          :password_challenge,
          :token
        ).with_defaults(password_challenge: '')
      end
  end
end