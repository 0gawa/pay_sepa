class V1::TransactionsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity

  before_action :set_group

  def index
    transactions = @group.transaction_data.includes(:payer, :participants)
    render json: transactions.as_json(
      include: {
        group: { only: [:id] },
        payer: { only: [:id, :name] },
        participants: { only: [:id, :name] }
      },
      only: [:id, :date, :amount, :description, :payer_id]
    )
  end

  def create
    # paymentという名を使用しているため、Railsのリレーション機能は使えないことに注意
    participant_ids = transaction_params[:participant_ids]
    if participant_ids.empty?
      render json: { errors: "対象者が選択されていません" }, status: :unprocessable_entity
      return
    end
    # リレーションの機能が利用できないため、participant_idsという変数(has_manyの機能の一部)は利用不可
    transaction = Transaction.new(transaction_params.except(:participant_ids))
    transaction.group_id = @group.id

    ActiveRecord::Base.transaction do
      transaction.save!

      participants = @group.users.where(id: participant_ids)
      # グループにいないメンバーがいるかどうか
      if participants.size != participant_ids.size
        raise ActiveRecord::RecordInvalid
      end
      transaction.participants = participants
    end

    render json: transaction.as_json(
      include: {
        payer: { only: [:id, :name] },
        participants: { only: [:id, :name] }
      },
      only: [:id, :date, :amount, :description, :payer_id]
    ), status: :created
  end

  def destroy
    transaction = @group.transaction_data.find(params[:id])
    transaction.destroy
    render json: { message: "Transaction deleted successfully" }, status: :ok
  end

  private

  def transaction_params
    params.require(:transaction).permit(:payer_id, :amount, :description, participant_ids: [])
  end

  def set_group
    @group = Group.find(params[:group_id])
  end

  def render_not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def render_unprocessable_entity(exception)
    render json: { errors: exception.record&.errors&.full_messages || [exception.message] }, status: :unprocessable_entity
  end
end
