module Api::V1
class SessionsController < ApplicationController
  def new
  end

  def create
    @user = User.find_by_email(user_params[:email])

    if @user && @user.authenticate(user_params[:password])
      flash[:notice] = "User login successfully"
      login @user
      render json: {notice: "User login successfully", user: @user}, status: :ok
    else  
      render json: { error: "Email or Password is not correct" }, status: :unprocessable_entity
    end
  end

  def destroy
    logout current_user
    render json: { notice: "User Logout successfully" }, status: :ok
  end

  def reset_password
    if current_user
      render json: { notice: "Password reset successfully", user: current_user }, status: :ok
    end
  end
  private
  def user_params
    params.require(:user).permit(:email, :password)
  end

end
end