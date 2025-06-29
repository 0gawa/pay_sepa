class V1::UsersController < ApplicationController
  before_action :set_group

  def index
    render json: { user: @group.users.as_json(only: [:id, :name]) }, status: :ok
  end

  def create
    user = @group.users.new(user_params)
    if user.save
      render json: user.as_json(only: [:id, :name]), status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @group.users.destroy
    render json: { message: "User deleted successfully" }, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:name)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end
end
