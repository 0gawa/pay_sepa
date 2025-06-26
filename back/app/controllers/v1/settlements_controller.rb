class V1::SettlementsController < ApplicationController
  def index
    group = Group.find(params[:group_id])
    settlements = group.settlements.includes(:from_user, :to_user).order(created_at: :desc)
    render json: settlements.as_json(
      include: {
        from_user: { only: [:id, :name] },
        to_user: { only: [:id, :name] }
      },
      only: [:id, :amount, :from_user_id, :to_user_id]
    )
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Group not found" }, status: :not_found
  end

  #TODO: createのロジックの修正
  def create
    group = Group.find(params[:group_id])
    settlement = group.settlements.new(settlement_params)
    # 全額清算ロジック (amount がない場合)
    if settlement.amount.blank? && settlement.from_user_id && settlement.to_user_id
      amount_to_settle = BalanceCalculatorService.call(settlement.to_user_id, settlement.from_user_id)
      if amount_to_settle <= 0
        render json: { errors: ["支払うべき残高がありません"] }, status: :unprocessable_entity
        return
      end
      settlement.amount = amount_to_settle
    end

    if settlement.save
      render json: settlement.as_json(include: [:from_user, :to_user]), status: :created
    else
      render json: { errors: settlement.errors.full_messages }, status: :unprocessable_entity
    end
  end

   def destroy
    group = Group.find(params[:group_id])
    settlement = group.settlements.find(params[:id])
    settlement.destroy
    render json: { message: "Group deleted successfully" }, status: :ok
   rescue ActiveRecord::RecordNotFound
    render json: { error: "Settlement not found" }, status: :not_found
   end

  private

  def settlement_params
    params.require(:settlement).permit(:from_user_id, :to_user_id, :amount)
  end
end
