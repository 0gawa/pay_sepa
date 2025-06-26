require 'rails_helper'

RSpec.describe "V1::Balances", type: :request do
  # json形式で全て返却する
  def format_user_for_json(user)
    { "id": user.id, "name": user.name }.as_json
  end

  describe "Indexアクションについて" do
    let!(:group) { create(:group) }
    let!(:user1) { create(:user, group: group, name: 'Alice') }
    let!(:user2) { create(:user, group: group, name: 'Bob') }
    let!(:user3) { create(:user, group: group, name: 'Charlie') }
    let!(:user4) { create(:user, group: group, name: 'David') }
    # 複雑なケースのために追加のユーザーを定義
    let!(:user5) { create(:user, group: group, name: 'Eve') }

    # JSONレスポンスの清算結果をソートし、順序の変動に対応
    def sort_settlements(settlements)
      settlements.sort_by do |s|
        [s["amount"], s["payer"]["id"], s["receiver"]["id"]]
      end
    end

    context "グループの清算を正しく出力すること（割り切れる場合）" do
      it "1対1の清算を正しく出力すること" do
        create(:transaction, payer: user1, group: group, amount: 1000, participants: [user1, user2])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"].length).to eq(1)

        expected_settlements = [
          {"payer" => format_user_for_json(user2), "receiver" => format_user_for_json(user1), "amount" => 500}
        ]
        expect(sort_settlements(json_response["settlements"])).to eq(sort_settlements(expected_settlements))
      end

      it "複数の取引がある場合に正しく清算すること" do
        # Net Balances:
        # User1: +900 (payer) - 300 (own cost) = +600
        # User2: +1500 (payer) - 300 (T1) - 500 (own cost) = +700
        # User3: -300 (T1) - 500 (T2) + 400 (payer) - 200 (own cost) = -600
        # User4: -500 (T2) - 200 (T3) = -700
        # Result: User3 -> User1: 600, User4 -> User2: 700
        create(:transaction, payer: user1, group: group, amount: 900, participants: [user1, user2, user3])
        create(:transaction, payer: user2, group: group, amount: 1500, participants: [user2, user3, user4])
        create(:transaction, payer: user3, group: group, amount: 400, participants: [user3, user4])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"].length).to eq(2)

        expected_settlements = [
          {"payer" => format_user_for_json(user3), "receiver" => format_user_for_json(user1), "amount" => 600},
          {"payer" => format_user_for_json(user4), "receiver" => format_user_for_json(user2), "amount" => 700}
        ]
        expect(sort_settlements(json_response["settlements"])).to eq(sort_settlements(expected_settlements))
      end

      it "一人が複数人から受け取る清算を正しく行うこと" do
        # User1がUser1, User2, User3, User4のために1000円を立て替える
        # 各人の負担: 250
        # Net: User1 = +750, User2 = -250, User3 = -250, User4 = -250
        # Result: User2 -> User1: 250, User3 -> User1: 250, User4 -> User1: 250
        create(:transaction, payer: user1, group: group, amount: 1000, participants: [user1, user2, user3, user4])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"].length).to eq(3)

        expected_settlements = [
          {"payer" => format_user_for_json(user2), "receiver" => format_user_for_json(user1), "amount" => 250},
          {"payer" => format_user_for_json(user3), "receiver" => format_user_for_json(user1), "amount" => 250},
          {"payer" => format_user_for_json(user4), "receiver" => format_user_for_json(user1), "amount" => 250}
        ]
        expect(sort_settlements(json_response["settlements"])).to eq(sort_settlements(expected_settlements))
      end

      it "複数人が一人のために清算を正しく行うこと" do
        # Transaction1: Payer: User1, Amount: 1000, Participants: [User1, User2]
        #   User1_net: +1000 - 500 = +500
        #   User2_net: -500
        # Transaction2: Payer: User3, Amount: 2000, Participants: [User3, User2]
        #   User3_net: +2000 - 1000 = +1000
        #   User2_net: -500 - 1000 = -1500
        # Result: User2 -> User1: 500, User2 -> User3: 1000
        create(:transaction, payer: user1, group: group, amount: 1000, participants: [user1, user2])
        create(:transaction, payer: user3, group: group, amount: 2000, participants: [user3, user2])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"].length).to eq(2)

        expected_settlements = [
          {"payer" => format_user_for_json(user2), "receiver" => format_user_for_json(user1), "amount" => 500},
          {"payer" => format_user_for_json(user2), "receiver" => format_user_for_json(user3), "amount" => 1000}
        ]
        expect(sort_settlements(json_response["settlements"])).to eq(sort_settlements(expected_settlements))
      end

      it "複雑な多数の取引を正しく清算すること" do
        # User Balances (T1: P1=U1(600), P=[U1,U2,U3]) -> U1:+400, U2:-200, U3:-200
        # User Balances (T2: P1=U4(900), P=[U1,U2,U4]) -> U1:+400-300=+100, U2:-200-300=-500, U4:+600
        # User Balances (T3: P1=U5(1000), P=[U3,U5])   -> U3:-200-500=-700, U5:+500
        # User Balances (T4: P1=U2(200), P=[U1,U5])    -> U1:+100-100=0, U2:-500+200=-300, U5:+500-100=+400
        # Final Net: U1: 0, U2: -300, U3: -700, U4: +600, U5: +400
        # Receivers: U4(+600), U5(+400)
        # Payers: U3(-700), U2(-300)
        #
        # Settlement:
        # 1. U3 pays U4: min(700, 600) = 600
        #    U3_net: -100, U4_net: 0
        # 2. U3 pays U5: min(100, 400) = 100
        #    U3_net: 0, U5_net: 300
        # 3. U2 pays U5: min(300, 300) = 300
        #    U2_net: 0, U5_net: 0
        # Result: U3 -> U4: 600, U3 -> U5: 100, U2 -> U5: 300
        create(:transaction, payer: user1, group: group, amount: 600, participants: [user1, user2, user3])
        create(:transaction, payer: user4, group: group, amount: 900, participants: [user1, user2, user4])
        create(:transaction, payer: user5, group: group, amount: 1000, participants: [user3, user5])
        create(:transaction, payer: user2, group: group, amount: 200, participants: [user1, user5])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"].length).to eq(3)

        expected_settlements = [
          {"payer" => format_user_for_json(user3), "receiver" => format_user_for_json(user4), "amount" => 600},
          {"payer" => format_user_for_json(user3), "receiver" => format_user_for_json(user5), "amount" => 100},
          {"payer" => format_user_for_json(user2), "receiver" => format_user_for_json(user5), "amount" => 300}
        ]
        expect(sort_settlements(json_response["settlements"])).to eq(sort_settlements(expected_settlements))
      end

      # エッジケース
      it "清算が不要な場合（全員の残高がゼロ）は空の配列を返すこと" do
        # User1がUser1のためだけに1000円を立て替える -> User1の負担は1000円
        # Net: User1 = 0
        create(:transaction, payer: user1, group: group, amount: 1000, participants: [user1])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"]).to eq([])
      end

      it "清算が不要な別のケース（帳尻が合っている）は空の配列を返すこと" do
        # T1: U1(1000), P=[U1,U2] -> U1:+500, U2:-500
        # T2: U2(1000), P=[U1,U2] -> U1:+500-500=0, U2:-500+500=0
        # Net: U1=0, U2=0
        create(:transaction, payer: user1, group: group, amount: 1000, participants: [user1, user2])
        create(:transaction, payer: user2, group: group, amount: 1000, participants: [user1, user2])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"]).to eq([])
      end

      it "単一のユーザーのみが関わる取引の場合に空の配列を返すこと" do
        # User1がUser1のためだけに500円を立て替える
        # Net: User1 = 0
        create(:transaction, payer: user1, group: group, amount: 500, participants: [user1])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"]).to eq([])
      end
    end

    context "グループの清算を正しく出力すること（割り切れない場合）" do
      it "小数点以下の金額を含む清算を正しく行うこと" do
        # User1がUser1, User2, User3のために1000円を立て替える
        # 各人の負担: 1000/3 = 333 余り1
        # -> User1負担: 334, User2負担: 333, User3負担: 333
        # Net: User1 = +666, User2 = -333, User3 = -333
        # Result: User2 -> User1: 333, User3 -> User1: 333 (残りの1円はサービスロジック次第)
        # Note: サービスのロジックでは、端数を最初の参加者に割り当てているため
        # 1000 / 3 = 333 (余り 1)
        # User1 (-334), User2 (-333), User3 (-333)
        # Net: User1: 1000 - 334 = 666
        #      User2: -333
        #      User3: -333
        # Settlement:
        # User2 -> User1: 333
        # User3 -> User1: 333
        create(:transaction, payer: user1, group: group, amount: 1000, participants: [user1, user2, user3])

        get v1_group_balances_path(group_id: group.id)
        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["settlements"].length).to eq(2)

        # サービスのロジックが端数を最初の参加者 (user1) に割り振っているため、
        # user1は多く負担し、user2とuser3はそれぞれ333を支払う
        expected_settlements = [
            {"payer" => format_user_for_json(user2), "receiver" => format_user_for_json(user1), "amount" => 333},
            {"payer" => format_user_for_json(user3), "receiver" => format_user_for_json(user1), "amount" => 333},
          ]
        expect(sort_settlements(json_response["settlements"])).to eq(sort_settlements(expected_settlements))
      end
    end

    context "グループに取引が存在しないとき" do
      it "not_foundを返すこと" do
        get v1_group_balances_path(group_id: group.id)
        expect(response).to have_http_status(:not_found)
        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Transactions not found")
      end
    end

    context "無効なgroup_idの場合" do
      it "not_foundを返すこと" do
        get v1_group_balances_path(group_id: -1) # 存在しないID
        expect(response).to have_http_status(:not_found)
        json_response = JSON.parse(response.body)
        expect(json_response["error"]).to include("Couldn't find Group")
      end
    end

    context "BalanceCalculatorServiceでエラーが発生したとき" do
      before do
        # サービスのcallメソッドがエラーを発生させるようにモック
        allow(BalanceCalculatorService).to receive(:call).and_raise("Calculation Error!")
        create(:transaction, payer: user1, group: group, amount: 100, participants: [user1])
      end

      it "500 Unprocessable Entityとエラーメッセージを返すこと" do
        get v1_group_balances_path(group_id: group.id)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response["error"]).to eq("Calculation Error!")
      end
    end
  end
end
