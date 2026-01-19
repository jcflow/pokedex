require 'capybara/rspec'
require 'selenium-webdriver'

Capybara.register_driver :selenium_chrome_headless do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument('--headless')
  options.add_argument('--disable-gpu')
  options.add_argument('--window-size=1400,1400')
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-dev-shm-usage')

  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
end

Capybara.javascript_driver = :selenium_chrome_headless
Capybara.default_driver = :selenium_chrome_headless

# Configure Capybara to run the server on port 8080 (where Next.js expects API)
Capybara.server_port = 8080
Capybara.server_host = '0.0.0.0'

# Point Capybara to the Next.js frontend
Capybara.app_host = 'http://localhost:3000'
Capybara.run_server = true # We need the Rails server running for API calls
