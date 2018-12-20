ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
Object.send(:remove_const, :ActiveRecord)
require 'rails/test_help'


class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  # fixtures :all

  # Add more helper methods to be used by all tests here...

  # Remove the ActiveRecord constant, because it is autloaded by
  # ActiveStorage and not needed for our application. The presence
  # of the ActiveRecord constant causes rspec-rails to include
  # extra fixture support, which results in:
  #
  #   ActiveRecord::ConnectionNotEstablished:
  #     No connection pool with 'primary' found.
  #

end
