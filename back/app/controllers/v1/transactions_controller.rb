class V1::TransactionsController < ApplicationController
  def index
    transactions = Transaction.includes(:payer, :participants).order(created_at: :desc)
    render json: transactions.as_json(
      include: {
        payer: { only: [:id, :name] },
        participants: { only: [:id, :name] }
      },
      methods: [], # 必要に応じて仮想属性を追加
      only: [:id, :date, :amount, :description, :payer_id]
    )
  end

  def create
    # participant_ids を受け取る想定
    participant_ids = params[:transaction].delete(:participant_ids) || []
    transaction = Transaction.new(transaction_params)
    set_group
    transaction.group_id = @group.id

    if participant_ids.empty?
      render json: { errors: ["対象者が選択されていません"] }, status: :unprocessable_entity
      return
    end

    # トランザクション内で参加者も保存
    ActiveRecord::Base.transaction do
      transaction.save!
      participants = User.where(id: participant_ids)
      if participants.size != participant_ids.size
        raise ActiveRecord::RecordInvalid, "無効な対象者が含まれています"
      end
      transaction.participants = participants
    end

    render json: transaction.as_json(include: [:payer, :participants]), status: :created

  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: transaction.errors.full_messages + [e.message] }, status: :unprocessable_entity
  end

  def destroy
    transaction = Transaction.find(params[:id])
    transaction.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Transaction not found" }, status: :not_found
  end

  private

  def transaction_params
    params.require(:transaction).permit(:payer_id, :amount, :description)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end
end
