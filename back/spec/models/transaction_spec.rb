require 'rails_helper'

RSpec.describe "About Transaction", type: :model do
  describe "バリデーションについて" do
    let!(:group) { create(:group) }
    let!(:user1) { create(:user, group: group, name: 'Alice') }
    let!(:user2) { create(:user, group: group, name: 'Bob') }
    let!(:user3) { create(:user, group: group, name: 'Charlie') }
    let(:transaction) { create(:transaction, payer: user1, group: group, participants: [user1, user2, user3]) }

    context "descriptionカラム" do
      it "nilでも有効" do
        transaction.description = ""
        expect(transaction).to be_valid
      end
      it "300文字以下は有効" do
        transaction.description = 'a' * 300
        expect(transaction).to be_valid
      end
      it "301文字以上は無効" do
        transaction.description = 'a' * 301
        expect(transaction).to be_invalid
      end
    end

    context "amountカラムについて" do
      it "負の値は無効" do
        transaction.amount = -1
        expect(transaction).to be_invalid
      end
      it "正の値は有効" do
        transaction.amount = 1
        expect(transaction).to be_valid
      end
      it "小数第２位まで保存できる" do
        transaction.amount = 1.23
        expect(transaction.amount).to eq(1.23)
      end
      it "丸めの確認:繰り上げ" do
        transaction.amount = 1.245
        expect(transaction.amount).to eq(1.25)
      end
      it "丸めの確認:切り捨て" do
        transaction.amount = 1.244
        expect(transaction.amount).to eq(1.24)
      end
    end
  end

  describe "アソシエーションの確認" do
    it "GroupとN:1である" do
      expect(Transaction.reflect_on_association(:group).macro).to eq(:belongs_to)
      expect(Group.reflect_on_association(:transaction_data).macro).to eq(:has_many)
    end
    it "PayerとN:1である" do
      expect(Transaction.reflect_on_association(:payer).macro).to eq(:belongs_to)
      expect(User.reflect_on_association(:transaction_data).macro).to eq(:has_many)
    end
    it "Transaction_participationと1:Nである" do
      expect(Transaction.reflect_on_association(:transaction_participations).macro).to eq(:has_many)
      expect(TransactionParticipation.reflect_on_association(:payment).macro).to eq(:belongs_to)
    end
  end
end
