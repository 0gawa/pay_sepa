require 'rails_helper'

RSpec.describe "V1::Transactionsコントローラーについて", type: :request do
  let!(:group) {create(:group)}
  let!(:main_user) {create(:user, group: group)}

  describe "indexアクションについて" do
    it "パスが存在する" do
      get "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id)
      expect(response).to have_http_status(:ok)
    end

    context "取引が存在するとき" do
      let!(:transaction1) {create(:transaction, group: group, payer: main_user)}
      let!(:transaction2) {create(:transaction, group: group, payer: main_user)}
      let(:tp_user1) {create(:user, group: group)} # 取引相手1
      let(:tp_user2) {create(:user, group: group)} # 取引相手2
      let!(:tp1) {transaction1.transaction_participations.create(user_id: tp_user1.id)}
      let!(:tp2) {transaction2.transaction_participations.create(user_id: tp_user2.id)}

      before { get "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id) }

      it "正しいレスポンスをJSON形式で返す" do
        json_response = JSON.parse(response.body)
        expect(json_response.size).to eq(3)
      end
      it "各取引に必要なキーが含まれていること" do
        json_response = JSON.parse(response.body)
        transaction_keys = json_response.first.keys
        expect(transaction_keys).to include("id", "amount", "description", "payer_id", "group", "payer", "participants")
        expect(json_response.first["group"].keys).to include("id", "name")
        expect(json_response.first["payer"].keys).to include("id", "name")
        expect(json_response.first["participants"].first.keys).to include("id", "name")
      end
      it "取引が日付の降順でソートされていること" do
        json_response = JSON.parse(response.body)
        expect(json_response.first["id"]).to eq(transaction1.id)
        expect(json_response.second["id"]).to eq(transaction2.id)
      end
    end

    context "取引が存在しないとき" do
      before { get "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id) }

      it "空の配列を返すこと" do
        json_response = JSON.parse(response.body)
        expect(json_response).to be_empty
      end
    end
  end

  describe "createアクションについて" do
    let(:other_user) {create(:user, group: group)}
    let(:valid_attributes) do
      {
        transaction: {
          payer_id: main_user.id,
          amount: 1500.0,
          description: "Coffee Break",
          participant_ids: [other_user.id]
        }
      }
    end

    context "有効なパラメータの場合" do
      it "新しい取引を作成し、HTTPステータス201を返すこと" do
        expect {
          post "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id), params: valid_attributes
        }.to change(Transaction, :count).by(1).and(
             change(TransactionParticipation, :count).by(1)
           )
        expect(response).to have_http_status(:created)
      end

      it "作成された取引情報をJSONで返すこと" do
        post "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id), params: valid_attributes
        json_response = JSON.parse(response.body)
        expect(json_response["description"]).to eq("Coffee Break")
        expect(json_response["payer"]["id"]).to eq(main_user.id)
        expect(json_response["participants"].size).to eq(1)
        expect(json_response["participants"].map{ |p| p["id"] }).to match_array([other_user.id])
      end
    end
  end

  describe "destroyアクションについて" do
    it "パスが存在する" do
      delete "http://localhost:3001/" + v1_group_transaction_path(group_id: group.id, id: 1)
      expect(response).to have_http_status(:not_found)
    end

    context "削除機能について" do
      it "正しいidの時、正常に削除される" do
      end
      it "不明なidの時、not_foundを返す" do
      end
    end
  end
end
