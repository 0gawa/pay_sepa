require 'rails_helper'

RSpec.describe "About User", type: :model do
  let!(:group) { create(:group)}

  describe "バリデーションについて" do
    let(:user) { create(:user, group: group) }

    it "nameカラムは30文字以下であること" do
      user.name = 'a' * 30
      expect(user).to be_valid
    end
    it "nameカラムが31文字以上であるときは不可" do
      user.name = 'a' * 31
      expect(user).to be_invalid
    end
  end
  describe "アソシエーションについて" do
    it "GroupとN:1の関係にある" do
      expect(User.reflect_on_association(:group).macro).to eq(:belongs_to)
      expect(Group.reflect_on_association(:users).macro).to eq(:has_many)
    end
  end
end
