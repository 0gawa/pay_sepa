require 'rails_helper'

RSpec.describe "V1::Settlementsコントローラーについて", type: :request do
  let!(:group) { create(:group) }
  let!(:user1) { create(:user, group: group) }
  let!(:user2) { create(:user, group: group) }
  let!(:user3) { create(:user, group: group) }

  describe "GET /v1/groups/:group_id/settlements (index)" do
    context "清算情報が存在する場合" do
      let!(:settlement1) { create(:settlement, group: group, from_user: user1, to_user: user2, amount: 1000, created_at: 1.day.ago) }
      let!(:settlement2) { create(:settlement, group: group, from_user: user3, to_user: user1, amount: 500, created_at: Time.current) }

      before { get v1_group_settlements_path(group_id: group.id) }

      it "HTTPステータス200(OK)を返すこと" do
        expect(response).to have_http_status(:ok)
      end

      it "清算情報の一覧をJSONで返すこと" do
        json_response = JSON.parse(response.body)
        expect(json_response.size).to eq(2)
      end

      it "レスポンスに必要なキーが含まれていること" do
        json_response = JSON.parse(response.body)
        settlement_keys = json_response.first.keys
        expect(settlement_keys).to include("id", "amount", "from_user_id", "to_user_id", "from_user", "to_user")
        expect(json_response.first["from_user"].keys).to include("id", "name")
        expect(json_response.first["to_user"].keys).to include("id", "name")
      end

      it "作成日時の降順でソートされていること" do
        json_response = JSON.parse(response.body)
        expect(json_response.first["id"]).to eq(settlement2.id)
        expect(json_response.second["id"]).to eq(settlement1.id)
      end
    end

    context "清算情報が存在しない場合" do
      before { get v1_group_settlements_path(group_id: group.id) }

      it "HTTPステータス200(OK)を返すこと" do
        expect(response).to have_http_status(:ok)
      end

      it "空の配列を返すこと" do
        json_response = JSON.parse(response.body)
        expect(json_response).to be_empty
      end
    end

    context "存在しないgroup_idを指定した場合 (エッジケース)" do
      before { get v1_group_settlements_path(group_id: 'invalid_id') }

      it "HTTPステータス404(Not Found)を返すこと" do
        expect(response).to have_http_status(:not_found)
      end

      it "エラーメッセージを返すこと" do
        json_response = JSON.parse(response.body)
        expect(json_response["error"]).to include("Couldn't find Group")
      end
    end
  end

  describe "POST /v1/groups/:group_id/settlements (create)" do
    let(:valid_attributes) do
      {
        settlement: {
          from_user_id: user1.id,
          to_user_id: user2.id,
          amount: 1500
        }
      }
    end

    context "有効なパラメータの場合" do
      it "新しい清算情報を作成し、HTTPステータス201(Created)を返すこと" do
        expect {
          post v1_group_settlements_path(group_id: group.id), params: valid_attributes
        }.to change(Settlement, :count).by(1)
        expect(response).to have_http_status(:created)
      end

      it "作成された清算情報をJSONで返すこと" do
        post v1_group_settlements_path(group_id: group.id), params: valid_attributes
        json_response = JSON.parse(response.body)
        expect(json_response["amount"]).to eq("1500.0")
        expect(json_response["from_user"]["id"]).to eq(user1.id)
        expect(json_response["to_user"]["id"]).to eq(user2.id)
      end
    end

    context "無効なパラメータの場合 (エッジケース)" do
      context "amountが欠けている場合" do
        let(:invalid_attributes) { valid_attributes.deep_merge(settlement: { amount: nil }) }

        it "清算情報を作成せず、HTTPステータス422(Unprocessable Entity)を返すこと" do
          expect {
            post v1_group_settlements_path(group_id: group.id), params: invalid_attributes
          }.not_to change(Settlement, :count)
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "from_user_idが存在しないユーザーIDの場合" do
        let(:invalid_attributes) { valid_attributes.deep_merge(settlement: { from_user_id: 9999 }) }

        it "HTTPステータス422(Unprocessable Entity)を返し、エラーメッセージを含むこと" do
          post v1_group_settlements_path(group_id: group.id), params: invalid_attributes
          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response["errors"]).to include("From user must exist")
        end
      end

      context "支払う人と受け取る人が同じ場合" do
        let(:invalid_attributes) { valid_attributes.deep_merge(settlement: { to_user_id: user1.id }) }

        it "清算情報を作成せず、HTTPステータス422(Unprocessable Entity)を返すこと" do
          expect {
            post v1_group_settlements_path(group_id: group.id), params: invalid_attributes
          }.not_to change(Settlement, :count)
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it "エラーメッセージを返すこと" do
          post v1_group_settlements_path(group_id: group.id), params: invalid_attributes
          json_response = JSON.parse(response.body)
          expect(json_response["errors"]).to include("支払元と支払先のユーザーは異なる必要があります")
        end
      end
    end

    context "存在しないgroup_idを指定した場合 (エッジケース)" do
      it "HTTPステータス404(Not Found)を返すこと" do
        post v1_group_settlements_path(group_id: 'invalid_id'), params: valid_attributes
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "DELETE /v1/groups/:group_id/settlements/:id (destroy)" do
    let!(:settlement) { create(:settlement, group: group, from_user: user1, to_user: user2) }

    context "存在するIDを指定した場合" do
      it "清算情報を削除し、HTTPステータス200(OK)を返すこと" do
        expect {
          delete v1_group_settlement_path(group_id: group.id, id: settlement.id)
        }.to change(Settlement, :count).by(-1)
        expect(response).to have_http_status(:ok)
      end

      it "成功メッセージを返すこと" do
        delete v1_group_settlement_path(group_id: group.id, id: settlement.id)
        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Settlement deleted successfully")
      end
    end

    context "存在しないIDを指定した場合 (エッジケース)" do
      before { delete v1_group_settlement_path(group_id: group.id, id: 'invalid_id') }

      it "HTTPステータス404(Not Found)を返すこと" do
        expect(response).to have_http_status(:not_found)
      end

      it "エラーメッセージを返すこと" do
        json_response = JSON.parse(response.body)
        expect(json_response["error"]).to include("Couldn't find Settlement")
      end
    end

    context "指定した清算がグループに属していない場合 (エッジケース)" do
      let!(:another_group) { create(:group) }
      let!(:another_settlement) { create(:settlement, group: another_group) }

      it "HTTPステータス404(Not Found)を返すこと" do
        delete v1_group_settlement_path(group_id: group.id, id: another_settlement.id)
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end

