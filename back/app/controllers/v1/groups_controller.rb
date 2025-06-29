class V1::GroupsController < ApplicationController
  before_action :set_group, only: [:destroy]

  def create
    group = Group.new(group_params)
    if group.save
      render json: group.as_json(only: [:id, :name, :description]), status: :created
    else
      render json: { errors: group.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @group.destroy
    render json: { message: "Group deleted successfully" }, status: :ok
  end

  private

  def group_params
    params.require(:group).permit(:name, :description)
  end

  def set_group
    @group = Group.find(params[:id])
  end
end
