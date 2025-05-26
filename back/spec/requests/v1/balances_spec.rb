require 'rails_helper'

RSpec.describe "V1::Balances", type: :request do
  describe "Indexアクションについて" do
    let(:group) {create(:group)}
    let(:user1) {create(:user, group: group)}
    let(:user2) {create(:user, group: group)}
    let(:user3) {create(:user, group: group)}
    let(:user4) {create(:user, group: group)}

    context "グループの清算を正しく出力すること（割り切れる場合）" do
      it "1対1の清算を正しく出力すること" do
        transaction = create(:transaction, payer: user1, group: group, amount: 1000)
        transaction.participants << user1
        transaction.participants << user2
        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)
        expect(json_response["settlements"].length).to eq(1)
        expect(json_response["settlements"]).to include(
          {"payer" => set_jpayer(user2), "receiver" => set_jreceiver(user1), "amount" => 500.0}
        )
      end

      # payer    for_whom       amount
      #   1   :   1, 2, 3   :    900
      #   2   :   2, 3, 4   :   1500
      #   3   :   3, 4      :    400
      # answer: 3 to 1: 600, 4 to 2: 700
      it "複数の取引がある場合に正しく清算すること" do
        transaction1 = create(:transaction, payer: user1, group: group, amount: 900)
        transaction1.participants << user1
        transaction1.participants << user2
        transaction1.participants << user3

        transaction2 = create(:transaction, payer: user2, group: group, amount: 1500)
        transaction2.participants << user2
        transaction2.participants << user3
        transaction2.participants << user4

        transaction3 = create(:transaction, payer: user3, group: group, amount: 400)
        transaction3.participants << user3
        transaction3.participants << user4

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        # puts json_response
        # expected response: payer, receiver, amount
        expect(json_response["settlements"].length).to eq(2)
        expect(json_response["settlements"]).to include(
            {"payer" => set_jpayer(user3), "receiver" => set_jreceiver(user1), "amount" => 600.0},
            {"payer" => set_jpayer(user4), "receiver" => set_jreceiver(user2), "amount" => 700.0}
          )
      end
      it "一人が複数人から受け取る清算を正しく行うこと" do
        transaction = create(:transaction, payer: user1, group: group, amount: 1000)
        transaction.participants << user1
        transaction.participants << user2
        transaction.participants << user3
        transaction.participants << user4

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(json_response["settlements"].length).to eq(3)
        expect(json_response["settlements"]).to include(
            {"payer" => set_jpayer(user2), "receiver" => set_jreceiver(user1), "amount" => 250.0},
            {"payer" => set_jpayer(user3), "receiver" => set_jreceiver(user1), "amount" => 250.0},
            {"payer" => set_jpayer(user4), "receiver" => set_jreceiver(user1), "amount" => 250.0}
          )
      end
      it "複数人が一人のために清算を正しく行うこと" do
        transaction1 = create(:transaction, payer: user1, group: group, amount: 1000)
        transaction2 = create(:transaction, payer: user3, group: group, amount: 2000)

        transaction1.participants << user1
        transaction1.participants << user2
        transaction2.participants << user3
        transaction2.participants << user2

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(json_response["settlements"].length).to eq(2)
        expect(json_response["settlements"]).to include(
            {"payer" => set_jpayer(user2), "receiver" => set_jreceiver(user1), "amount" => 500.0},
            {"payer" => set_jpayer(user2), "receiver" => set_jreceiver(user3), "amount" => 1000.0},
          )
      end
      # エッジケース
      it "清算が不要な場合（全員の残高がゼロ）は空の配列を返すこと" do
        trasaction = create(:transaction, payer: user1, group: group, amount: 1000)
        transaction.participants << user1
        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)
        expect(json_response["settlements"]).to eq([])
      end
      it "清算が不要な別のケース（帳尻が合っている）は空の配列を返すこと" do
        transaction1 = create(:transaction, payer: user1, group: group, amount: 1000)
        transaction1.participants << user1
        transaction1.participants << user2

        transaction2 = create(:transaction, payer: user2, group: group, amount: 1000)
        transaction2.participants << user2
        transaction2.participants << user1

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)
        expect(json_response["settlements"]).to eq([])
      end
      it "単一のユーザーのみが関わる取引の場合に空の配列を返すこと" do
        transaction = create(:transaction, payer: user1, group: group, amount: 500)
        transaction.participants << user1
        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)
        expect(json_response["settlements"]).to eq([])
      end
    end

    context "グループの清算を正しく出力すること（割り切れない場合）" do
      it "小数点以下の金額を含む清算を正しく行うこと" do
        transaction = create(:transaction, payer: user1, group: group, amount: 1000)
        transaction.participants << user1
        transaction.participants << user2
        transaction.participants << user3
        get v1_group_balances_path(group_id: group.id)  
        json_response = JSON.parse(response.body)
        # TODO: expect
      end
    end

    context "グループに取引が存在しないとき" do
      it "not_foundを返すこと" do
      end
    end

    context "その他のエラーが発生したとき" do
    end
  end 
end

# レスポンスのuserに関するjsonをセットするためのヘルパーメソッド
def set_jpayer(user)
  {"id" => user.id, "name" => user.name}
end

def set_jreceiver(user)
  {"id" => user.id, "name" => user.name}
end
