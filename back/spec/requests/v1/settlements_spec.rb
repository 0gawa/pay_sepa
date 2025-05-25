require 'rails_helper'

RSpec.describe "V1::Settlementsコントローラーについて", type: :request do
  let(:host_name) {"localhost:3001"}

  describe "Indexアクションについて" do
    context "グループの清算を正しく出力すること" do
      let(:group) {create(:group)}
      let(:user1) {create(:user, group: group)}
      let(:user2) {create(:user, group: group)}
      let(:user3) {create(:user, group: group)}
      let(:user4) {create(:user, group: group)}

      # payer    for_whom       amount
      #   1   :   1, 2, 3   :    900
      #   2   :   2, 3, 4   :   1500
      #   3   :   3, 4      :    400
      # answer: 3 to 1: 600, 4 to 2: 700
      it "すべての取引における割り勘が割り切れるとき1" do
        transaction1 = create(:transaction, payer: user1, group: group, amount: 900)
        transaction1.participants << user1
        transaction1.participants << user2
        transaction1.participants << user3

        transaction2 = create(:transaction, payer: user2, group: group, amount: 1500)
        transaction1.participants << user2
        transaction2.participants << user3
        transaction2.participants << user4

        transaction3 = create(:transaction, payer: user3, group: group, amount: 400)
        transaction1.participants << user3
        transaction3.participants << user4

        get host_name + "/v1/groups/#{group.id}/settlements"

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response["settlements"].length).to eq(2)
        expect(json_response["settlements"]).to include(
            {"payer" => user3.name, "receiver" => user1.name, "amount" => 600.0},
            {"payer" => user4.name, "receiver" => user2.name, "amount" => 700.0}
          )
      end
      it "すべての取引における割り勘が割り切れるとき2" do
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
