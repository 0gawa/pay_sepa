require 'rails_helper'

RSpec.describe "About Transaction", type: :model do
  describe "バリデーションについて" do
    let(:transaction) {create(:transaction)}
    context "descriptionカラム" do
      it "nilでも有効" do
      end
      it "300文字以下は有効" do
      end
      it "301文字以上は無効" do
      end
    end

    context "amountカラムについて" do
      it "負の値は無効" do
      end
      it "正の値は有効" do
      end
      it "小数第２位まで保存できる" do
      end
    end
  end

  describe "アソシエーションの確認" do
    it "GroupとN:1である" do
    end
    it "PayerとN:1である" do
    end
    it "Transaction_participateと1:Nである" do
    end
  end
end
