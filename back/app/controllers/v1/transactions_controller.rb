class V1::TransactionsController < ApplicationController
  def index
    set_group
    transactions = @group.transaction_data.includes(:payer, :participants)
    render json: transactions.as_json(
      include: {
        group: { only: [:id, :name] },
        payer: { only: [:id, :name] },
        participants: { only: [:id, :name] }
      },
      methods: [], # 必要に応じて仮想属性を追加
      only: [:id, :date, :amount, :description, :payer_id]
    )
  end

  def create
    # paramsからparticipant_idsを取り出す。要素は配列
    participant_ids = params[:transaction].delete(:participant_ids) || []
    
    transaction = Transaction.new(transaction_params)
    
    set_group
    transaction.group_id = @group.id

    if participant_ids.empty?
      render json: { errors: "対象者が選択されていません" }, status: :unprocessable_entity
      return
    end

    # トランザクション内で参加者も保存
    ActiveRecord::Base.transaction do
      transaction.save!
      participants = User.where(id: participant_ids)
      if participants.size != participant_ids.size
        raise ActiveRecord::RecordInvalid
      end
      transaction.participants = participants
    end

    render json: transaction.as_json(include: [:payer, :participants]), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  def destroy
    transaction = Transaction.find(params[:id])
    transaction.destroy
    render json: { message: "Transaction deleted successfully" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Transaction not found" }, status: :not_found
  end

  private

  def transaction_params
    params.require(:transaction).permit(:payer_id, :amount, :description, participant_ids: [])
  end

  def set_group
    @group = Group.find(params[:group_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Group not found" }, status: :not_found
    return
  end
end
