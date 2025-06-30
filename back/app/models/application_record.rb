class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  MAX_GROUP_MEMBERS = 15
end
