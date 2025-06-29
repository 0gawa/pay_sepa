require 'rails_helper'

RSpec.describe V1::BalancesController, type: :controller do
  describe '#index' do
    let(:group) { create(:group) }
    let(:user1) { create(:user, name: 'Alice') }
    let(:user2) { create(:user, name: 'Bob') }
    let(:user3) { create(:user, name: 'Charlie') }

    before do
      allow(controller).to receive(:set_group).and_call_original
    end

    context 'グループが見つからない場合' do
      before { get :index, params: { group_id: 9999 } }

      it '404 Not Foundを返すこと' do
        expect(response).to have_http_status(:not_found)
      end

      it 'エラーメッセージを返すこと' do
        expect(json_response['error']).to eq('Couldn\'t find Group with \'id\'=9999')
      end
    end

    context 'トランザクションが存在しない場合' do
      before do
        allow(Group).to receive(:find).with(group.id.to_s).and_return(group)
        allow(group).to receive(:transaction_data).and_return([])
        get :index, params: { group_id: group.id }
      end

      it '404 Not Foundを返すこと' do
        expect(response).to have_http_status(:not_found)
      end

      it 'エラーメッセージを返すこと' do
        expect(json_response['error']).to eq('Transactions not found')
      end
    end

    context 'トランザクションが存在し、正常に精算が計算される場合' do
      let(:transactions) do
        [
          double('Transaction', payer: user1, amount: 1000, participants: [user1, user2, user3]),
          double('Transaction', payer: user2, amount: 500, participants: [user2, user3])
        ]
      end
      let(:expected_balance) do
        [
          { "payer" => { "id" => user3.id, "name" => "Charlie" }, "receiver" => { "id" => user1.id, "name" => "Alice" }, "amount" => 334 },
          { "payer" => { "id" => user3.id, "name" => "Charlie" }, "receiver" => { "id" => user2.id, "name" => "Bob" }, "amount" => 166 }
        ]
      end

      before do
        allow(Group).to receive(:find).with(group.id.to_s).and_return(group)
        allow(group).to receive(:transaction_data).and_return(transactions)
        allow(BalanceCalculatorService).to receive(:call).with(transactions).and_return(expected_balance)
        get :index, params: { group_id: group.id }
      end

      it '200 OKを返すこと' do
        expect(response).to have_http_status(:ok)
      end

      it '計算された精算結果を返すこと' do
        expect(json_response['balance']).to eq(expected_balance)
      end
    end

    context 'BalanceCalculatorServiceがエラーを発生させる場合' do
      let(:transactions) do
        [
          double('Transaction', payer: user1, amount: 1000, participants: [user1, user2, user3])
        ]
      end
      let(:error_message) { '計算中に予期せぬエラーが発生しました' }

      before do
        allow(Group).to receive(:find).with(group.id.to_s).and_return(group)
        allow(group).to receive(:transaction_data).and_return(transactions)
        # BalanceCalculatorService.call がStandardErrorを発生させるようにモック
        allow(BalanceCalculatorService).to receive(:call).and_raise(StandardError, error_message)
        get :index, params: { group_id: group.id }
      end

      it '422 Unprocessable Entityを返すこと' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'エラーメッセージを返すこと' do
        expect(json_response['error']).to eq(error_message)
      end
    end
  end

  def json_response
    JSON.parse(response.body)
  end
end
