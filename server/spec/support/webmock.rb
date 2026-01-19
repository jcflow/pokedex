require 'webmock/rspec'

RSpec.configure do |config|
  config.before(:each) do
    # Allow local connections for Capybara (Selenium/Chrome) and Next.js
    WebMock.disable_net_connect!(allow_localhost: true)
  end
end
