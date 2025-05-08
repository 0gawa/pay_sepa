require 'rails_helper'

RSpec.describe "V1::Transactionsコントローラーについて", type: :request do
  let(:group) {create(:group)}

  describe "indexアクションについて" do
    it "パスが存在する" do
      get "http://localhost:3001/" + v1_group_transactions_path(group_id: group.id)
      expect(response).to have_http_status(:ok)
    end

    context "正しいレスポンスを返す" do
      it "あるグループに対して何も取引がない時" do
      end
      it "あるグループに対して2つの取引がある時" do
      end
    end
  end

  describe "createアクションについて" do
    it "パスが存在する" do
      post "http://localhost:3001/" +  v1_group_transactions_path(group_id: group.id)
      expect(response).to have_http_status(:unprocessable_entity)
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
