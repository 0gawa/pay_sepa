class V1::BalancesController < ApplicationController
  # for_whomには取引に関わった全ての人が保存される
  # 例） A,B,Cがタクシーに乗り、Aがタクシー代を支払った場合
  # payer: A, for_whom: [A, B, C]となる
  # 自分自身Aも含まれることに注意
  def index
    group = Group.find(params[:group_id])
    transactions = group.transaction_data

    if !transactions.present?
      render json: {error: "Transactions not found"}, status: :not_found
      return
    end

    render json: {"settlements": BalanceCalculatorService.call(transactions)}, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: {error: "Group not found"}, status: :not_found
  rescue => e
    render json: {error: e.message}, status: :unprocessable_entity
  end
end
