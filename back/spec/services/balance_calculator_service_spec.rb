require 'rails_helper'

class MockUser
  attr_reader :id, :name

  def initialize(id, name)
    @id = id
    @name = name
  end

  def as_json(options = {})
    { id: id, name: name }
  end

  def ==(other)
    other.is_a?(MockUser) && id == other.id && name == other.name
  end

  def hash
    [id, name].hash
  end

  def eql?(other)
    self == other
  end
end

class MockTransactionData
  attr_reader :payer, :amount, :participants

  def initialize(payer, amount, participants)
    @payer = payer
    @amount = amount
    @participants = participants
  end
end


RSpec.describe BalanceCalculatorService, type: :service do
  let(:user1) { MockUser.new(1, 'Alice') }
  let(:user2) { MockUser.new(2, 'Bob') }
  let(:user3) { MockUser.new(3, 'Charlie') }
  let(:user4) { MockUser.new(4, 'David') }

  describe '.call' do
    context '基本的な清算シナリオ' do
      it 'シンプルな取引の清算を正しく計算すること' do
        transactions = [
          MockTransactionData.new(user1, 1500, [user1, user2, user3])
        ]

        settlements = BalanceCalculatorService.call(transactions)

        expected_settlements = [
          { payer: { id: user2.id, name: user2.name }, receiver: { id: user1.id, name: user1.name }, amount: 500 },
          { payer: { id: user3.id, name: user3.name }, receiver: { id: user1.id, name: user1.name }, amount: 500 }
        ]

        sorted_actual = settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }
        sorted_expected = expected_settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }

        expect(sorted_actual).to eq(sorted_expected)
      end

      it '複数の取引がある場合の清算を正しく計算すること' do
        transactions = [
          MockTransactionData.new(user1, 3000, [user1, user2, user3]),
          MockTransactionData.new(user2, 2000, [user1, user2, user3])
        ]

        settlements = BalanceCalculatorService.call(transactions)

        expected_settlements = [
          { payer: { id: user3.id, name: user3.name }, receiver: { id: user2.id, name: user2.name }, amount: 333 },
          { payer: { id: user3.id, name: user3.name }, receiver: { id: user1.id, name: user1.name }, amount: 1333 }
        ]

        sorted_actual = settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }
        sorted_expected = expected_settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }

        expect(sorted_actual).to eq(sorted_expected)
      end
    end

    context 'エッジケース' do
      it '取引がない場合は空の清算リストを返すこと' do
        transactions = []
        settlements = BalanceCalculatorService.call(transactions)
        expect(settlements).to be_empty
      end

      it '全員の残高が0になる場合は空の清算リストを返すこと' do
        transactions = [
          MockTransactionData.new(user1, 1000, [user1, user2]),
          MockTransactionData.new(user2, 1000, [user1, user2])
        ]
        settlements = BalanceCalculatorService.call(transactions)
        expect(settlements).to be_empty
      end

      it '端数が発生する清算を正しく処理すること' do
        transactions = [
          MockTransactionData.new(user1, 1000, [user1, user2, user3])
        ]
        settlements = BalanceCalculatorService.call(transactions)

        expected_settlements = [
          { payer: { id: user2.id, name: user2.name }, receiver: { id: user1.id, name: user1.name }, amount: 333 },
          { payer: { id: user3.id, name: user3.name }, receiver: { id: user1.id, name: user1.name }, amount: 333 }
        ]

        sorted_actual = settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }
        sorted_expected = expected_settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }

        expect(sorted_actual).to eq(sorted_expected)
      end

      it '一人の債務者と一人の債権者の場合' do
        transactions = [
          MockTransactionData.new(user1, 2000, [user1, user2])
        ]
        settlements = BalanceCalculatorService.call(transactions)
        expected_settlements = [
          { payer: { id: user2.id, name: user2.name }, receiver: { id: user1.id, name: user1.name }, amount: 1000 }
        ]
        expect(settlements).to eq(expected_settlements)
      end

      it '複数の債務者から一人の債権者への清算' do
        transactions = [
          MockTransactionData.new(user1, 5000, [user1, user2, user3, user4])
        ]
        settlements = BalanceCalculatorService.call(transactions)

        expected_settlements = [
          { payer: { id: user2.id, name: user2.name }, receiver: { id: user1.id, name: user1.name }, amount: 1250 },
          { payer: { id: user3.id, name: user3.name }, receiver: { id: user1.id, name: user1.name }, amount: 1250 },
          { payer: { id: user4.id, name: user4.name }, receiver: { id: user1.id, name: user1.name }, amount: 1250 }
        ]
        sorted_actual = settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }
        sorted_expected = expected_settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }
        expect(sorted_actual).to eq(sorted_expected)
      end

      it '一人の債務者から複数の債権者への清算' do
        transactions = [
          MockTransactionData.new(user4, 10000, [user1, user2, user3, user4]),
          MockTransactionData.new(user1, 1000, [user1, user2, user3])
        ]
        settlements = BalanceCalculatorService.call(transactions)

        expected_settlements = [
          { payer: { id: user1.id, name: user1.name }, receiver: { id: user4.id, name: user4.name }, amount: 1834 },
          { payer: { id: user2.id, name: user2.name }, receiver: { id: user4.id, name: user4.name }, amount: 2833 },
          { payer: { id: user3.id, name: user3.name }, receiver: { id: user4.id, name: user4.name }, amount: 2833 }
        ]

        sorted_actual = settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }
        sorted_expected = expected_settlements.sort_by { |s| [s[:amount], s[:payer][:id], s[:receiver][:id]] }
        expect(sorted_actual).to eq(sorted_expected)
      end
    end

    context '金額が自然数であることの確認 (清算する金額を自然数にする)' do
      it 'amountが整数で計算されること' do
        # 意図的に端数が出るような金額と人数を設定: 100/3 = 33 余り1
        transactions = [
          MockTransactionData.new(user1, 100, [user1, user2, user3])
        ]
        settlements = BalanceCalculatorService.call(transactions)

        settlements.each do |s|
          expect(s[:amount]).to be_kind_of(Integer)
          expect(s[:amount]).to be > 0
        end
      end
    end
  end
end
