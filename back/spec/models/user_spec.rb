require 'rails_helper'

RSpec.describe "About User", type: :model do
  context "バリデーションについて" do
    it "nameカラムが空でないこと" do
      user = User.new(name: nil, group_id: "group1")
      expect(user.valid?).to be_falsey
    end
    it "group_idカラムが空でないこと" do
      user = User.new(name: "Test User", group_id: nil)
      expect(user.valid?).to be_falsey
    end
  end

  context "アソシエーションについて" do
    it "GroupとN:1である" do
      expect(User.reflect_on_association(:group).macro).to eq(:belongs_to)
      expect(Group.reflect_on_association(:users).macro).to eq(:has_many)
    end
    it "TransactionParticipationと1:Nである" do
      expect(User.reflect_on_association(:transaction_participations).macro).to eq(:has_many)
      expect(TransactionParticipation.reflect_on_association(:user).macro).to eq(:belongs_to)
    end
    it "TransactionとN:Mである" do
      expect(User.reflect_on_association(:transaction_data).macro).to eq(:has_many)
      expect(Transaction.reflect_on_association(:participants).macro).to eq(:has_many)
      expect(TransactionParticipation.reflect_on_association(:payment).macro).to eq(:belongs_to)
    end
  end
end
