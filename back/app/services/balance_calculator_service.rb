class BalanceCalculatorService
  def self.call(...)
    new(...).call
  end

  private

  def initialize(to_user_id, from_user_id)
    @to_user_id   = to_user_id
    @from_user_id = from_user_id
  end

  def call
    # TODO: ここに残高計算のロジックを実装
  end
end
