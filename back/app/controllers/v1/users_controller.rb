class V1::UsersController < ApplicationController
  def index
    group = Group.find(params[:group_id])
    render json: { "user": group.users.as_json(only: [:id, :name]) }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Group not found"}, status: :not_found
  end

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
    group = Group.find(params[:group_id])
    user = group.users.find(params[:id])
    user.destroy
    render json: { message: "Deleted user" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    if group.nil?
      render json: { error: "Group not found" }, status: :not_found
    else
      render json: { error: "User not found" },  status: :not_found
    end
  end

  private

  def user_params
    params.require(:user).permit(:name)
  end
end
