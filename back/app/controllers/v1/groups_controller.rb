class V1::GroupsController < ApplicationController
  def create
    group = Group.new(group_params)
    if group.save
      render json: group.as_json(only: [:id, :name, :description]), status: :created
    else
      render json: { errors: group.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    group = Group.find(params[:id])
    group.destroy
    render json: { message: "Group deleted successfully" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Group not found" }, status: :not_found
  end

  private

  def group_params
    params.require(:group).permit(:name, :description)
  end
end
