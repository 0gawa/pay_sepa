class BalanceCalculatorService
  def self.call(transactions)
    new(transactions).call
  end

  def initialize(transactions)
    @transactions = transactions
  end
# TODO: 清算する金額を自然数にする
  def call
    # 清算するための取引を保存
    settlement_transactions = []
    # 債権者と債務者を保存
    receivers, payers = [], []

    # key: user, value: balance
    # balance > 0は立て替えた分の金額（つまり、清算の際にもらう側） 
    # balance < 0は立て替えた分の金額（つまり、清算の際に支払う側）
    # balance = 0.0は清算の必要がない人（または、清算が完了した人）
    net_balances = Hash.new(0)

    @transactions.each do |transaction|
      payer    = transaction.payer
      amount   = transaction.amount.to_i
      for_whom = transaction.participants

      # 立て替えた金額をpayerの残高に加算(自然数)
      net_balances[payer] += amount
      # 割り勘で負担すべき金額をfor_whomの各メンバーから減算（自然数）
      base_cost_per_beneficiary = amount / for_whom.count # 最小の自然数
      remainder = amount % for_whom.count # 端数

      for_whom.each_with_index do |beneficiary, index|
        cost = base_cost_per_beneficiary
        # 端数を先頭の参加者から順に1円ずつ割り当てる
        cost += 1 if index < remainder
        net_balances[beneficiary] -= cost
      end
    end
    # この段階でnet_balancesの値は整数になっている
   
    # 債権者 (receivers): net_balance > 0
    # 債務者 (payers): net_balance < 0
    receivers = net_balances.select { |_person, balance| balance > 0 }
                          .sort_by { |_person, balance| -balance } # 残高降順
    payers    = net_balances.select { |_person, balance| balance < 0 }
                          .sort_by { |_person, balance| balance } # 残高昇順

    receivers_map = receivers.to_h
    payers_map    = payers.to_h

    while !receivers_map.empty? && !payers_map.empty?
      current_receiver_name, current_receiver_balance = receivers_map.first
      current_payer_name, current_payer_balance = payers_map.first

      # 債務者が支払うべき金額(債務者はbalanceが負の値であるためabsを取る)
      payer_owes_amount = current_payer_balance.abs
      # 清算する金額は、債権者が受け取るべき金額と債務者が支払うべき金額のmin
      amount_to_settle = [payer_owes_amount, current_receiver_balance].min

      settlement_transactions << {
        payer: current_payer_name.as_json(only: [:id, :name]),
        receiver: current_receiver_name.as_json(only: [:id, :name]),
        amount: amount_to_settle
      }

      payers_map[current_payer_name] += amount_to_settle
      receivers_map[current_receiver_name] -= amount_to_settle

      # 清算が完了した人をリストから削除
      payers_map.delete(current_payer_name) if payers_map[current_payer_name] == 0
      receivers_map.delete(current_receiver_name) if receivers_map[current_receiver_name] == 0

      receivers_map = receivers_map.sort_by { |_person, balance| -balance }.to_h
      payers_map    = payers_map.sort_by { |_person, balance| balance }.to_h
    end

    settlement_transactions
  rescue => e
    # 基本的にはコントローラーでエラーハンドリングを行うが、
    # 何らかの理由でエラーが発生した場合は、エラーメッセージを返す
    e.message
  end
end
