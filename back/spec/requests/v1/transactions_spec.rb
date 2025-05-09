require 'rails_helper'

RSpec.describe "V1::Transactionsコントローラーについて", type: :request do
  let!(:group)        {create(:group)}
  let!(:payer)        { create(:user, name: "Payer User",         group: group) }
  let!(:participant1) { create(:user, name: "Participant User 1", group: group) }
  let!(:participant2) { create(:user, name: "Participant User 2", group: group) }

  describe "indexアクションについて" do
    it "パスが存在する" do
      get "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id)
      expect(response).to have_http_status(:ok)
    end

    context "取引が存在するとき" do
      # transactionデータを2つ生成
      let!(:transaction1) do
        create(:transaction, payer: payer, description: "Lunch", amount: 3000).tap do |t|
          t.transaction_participations.create(user_id: participant1.id)
          t.transaction_participations.create(user_id: participant2.id)
        end
      end
      let!(:transaction2) do
        create(:transaction, payer: participant1, description: "Dinner", amount: 5000).tap do |t|
          t.transaction_participations.create(user_id: payer.id)
          t.transaction_participations.create(user_id: participant2.id)
        end
      end
      
      before { get "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id) }

      it "正しいレスポンスをJSON形式で返す" do
        json_response = JSON.parse(response.body)
        puts json_response
        expect(json_response.size).to eq(2)
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
    let(:valid_attributes) do
      {
        transaction: {
          payer_id: payer.id,
          amount: 1500.0,
          description: "Coffee Break",
          participant_ids: [payer.id, participant1.id]
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
        expect(json_response["payer"]["id"]).to eq(payer.id)
        expect(json_response["participants"].size).to eq(1)
        expect(json_response["participants"].map{ |p| p["id"] }).to match_array([payer.id, participant1.id])
      end
    end

    context "無効なパラメータの場合" do
      context "必須パラメータが欠けている場合 (amountなど)" do
        let(:invalid_attributes_missing_amount) do
          {
            transaction: {
              payer_id: payer.id,
              # amount: nil, # amount を欠けさせる
              description: "Invalid Transaction",
              participant_ids: [payer.id, participant1.id]
            }
          }
        end

        before { post "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id), params: invalid_attributes_missing_amount }

        it "HTTPステータス422を返すこと" do
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it "エラーメッセージをJSONで返すこと" do
          json_response = JSON.parse(response.body)
          expect(json_response["errors"]).to include("Amount can't be blank", "Amount is not a number")
        end

        it "取引を作成しないこと" do
          expect {
            post "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id), params: invalid_attributes_missing_amount
          }.not_to change(Transaction, :count)
        end
      end

      context "participant_ids が空の場合" do
        let(:invalid_attributes_no_participants) do
          {
            transaction: {
              payer_id: payer.id,
              amount: 1000,
              description: "No Participants",
              participant_ids: [] # 参加者なし
            }
          }
        end

        before {  post "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id), params: invalid_attributes_no_participants }

        it "HTTPステータス422を返すこと" do
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it "エラーメッセージを返すこと" do
          json_response = JSON.parse(response.body)
          expect(json_response["errors"]).to include("対象者が選択されていません")
        end
      end

      context "participant_ids に存在しないユーザーIDが含まれる場合" do
        let(:invalid_attributes_invalid_participant) do
          {
            transaction: {
              payer_id: payer.id,
              amount: 1000,
              description: "Invalid Participant",
              participant_ids: [payer.id, 9999] # 9999は存在しないIDと仮定
            }
          }
        end

        before { post "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id), params: invalid_attributes_invalid_participant }

        it "HTTPステータス422を返すこと" do
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it "エラーメッセージを返すこと" do
          json_response = JSON.parse(response.body)
          expect(json_response["errors"]).to include("無効な対象者が含まれています")
        end
      end

      context "payer_id が存在しない場合" do
        let(:invalid_attributes_invalid_payer) do
           {
             transaction: {
               payer_id: 9999, # 存在しないPayer ID
               amount: 1000,
               description: "Invalid Payer",
               participant_ids: [participant1.id]
             }
           }
         end

         before { post "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id), params: invalid_attributes_invalid_payer }

         it "HTTPステータス422を返すこと" do
           expect(response).to have_http_status(:unprocessable_entity)
         end

         it "エラーメッセージを返すこと" do
           json_response = JSON.parse(response.body)
           expect(json_response["errors"]).to include("Payer must exist")
         end
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
