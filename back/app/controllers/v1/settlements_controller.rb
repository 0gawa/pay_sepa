class V1::SettlementsController < ApplicationController
  before_action :set_group
  before_action :set_settlement, only: [:destroy]

  def index
    settlements = @group.settlements.includes(:from_user, :to_user).order(created_at: :desc)
    render json: settlements.as_json(
      include: {
        from_user: { only: [:id, :name] },
        to_user: { only: [:id, :name] }
      },
      only: [:id, :amount, :from_user_id, :to_user_id]
    )
  end

  def create
    settlement = @group.settlements.new(settlement_params)

    if settlement.save
      render json: settlement.as_json(
        include: {
          from_user: { only: [:id, :name] },
          to_user: { only: [:id, :name] }
        },
        only: [:id, :amount, :from_user_id, :to_user_id]
      ), status: :created
    else
      render json: { errors: settlement.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @settlement.destroy
    render json: { message: "Settlement deleted successfully" }, status: :ok
  end

  private

  def settlement_params
    params.require(:settlement).permit(:from_user_id, :to_user_id, :amount)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end

  def set_settlement
    @settlement = @group.settlements.find(params[:id])
  end
end
