class V1::BalancesController < ApplicationController
  def index
    group = Group.find(params[:group_id])
    balances = group.users.map do |friend|
      
    end
  end
end
