class V1::UsersController < ApplicationController
  def create
    user = User.new(user_params)
    group = Group.find(params[:group_id])
    user.group_id = group.id
    if user.save
      render json: user.as_json(only: [:id, :name]), status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    user = User.find(params[:id])
    user.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: "User not found" }, status: :not_found
  end

  private

  def user_params
    params.require(:user).permit(:name)
  end
end
