require 'rails_helper'

RSpec.describe "About Group", type: :model do
  describe "バリデーションについて" do
    let(:group) {create(:group)}

    context "nameカラムについて" do
      it "空はNG" do
        group.name = ""
        expect(group).to be_invalid
      end
      it "50文字以下は有効" do
        group.name = "a" * 50
        expect(group).to be_valid
      end
      it "51文字以上は無効" do
        group.name = "a" * 51
        expect(group).to be_invalid
      end
    end

    context "descriptionカラムについて" do
      it "空でもOKになること" do
        group.description = ""
        expect(group).to be_valid
      end
      it "300文字以下は有効" do
        group.description = "a" * 300
        expect(group).to be_valid
      end
      it "301文字以上は無効" do
        group.description = "a" * 301
        expect(group).to be_invalid
      end
    end
  end

  describe "アソシエーションのチェック" do
    it "Userと1:Nの関係にある" do
      expect(Group.reflect_on_association(:users).macro).to eq(:has_many)
      expect(User.reflect_on_association(:group).macro).to eq(:belongs_to)
    end
    it "Settlementと1:Nの関係にある" do
      expect(Group.reflect_on_association(:settlements).macro).to eq(:has_many)
      expect(Settlement.reflect_on_association(:group).macro).to eq(:belongs_to)
    end
    it "Transactionと1:Nの関係にある" do
      expect(Group.reflect_on_association(:transaction_data).macro).to eq(:has_many)
      expect(Transaction.reflect_on_association(:group).macro).to eq(:belongs_to)
    end
  end
end
