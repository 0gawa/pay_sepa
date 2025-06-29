class V1::BalancesController < ApplicationController
  before_action :set_group
  # for_whomには取引に関わった全ての人が保存される
  # 例） A,B,Cがタクシーに乗り、Aがタクシー代を支払った場合
  # payer: A, for_whom: [A, B, C]となる
  # 自分自身Aも含まれることに注意
  def index
    transactions = @group.transaction_data

    if transactions.empty?
      render json: { error: "Transactions not found" }, status: :not_found
      return
    end

    render json: { balance: BalanceCalculatorService.call(transactions) }, status: :ok
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_group
    @group = Group.find(params[:group_id])
  end
end
