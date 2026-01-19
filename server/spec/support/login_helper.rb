module LoginHelper
  def login_user(username: 'ash', password: 'password123')
    visit '/login'

    fill_in 'Username', with: username
    fill_in 'Password', with: password

    click_button 'LOGIN'

    # Wait for redirect
    expect(page).to have_current_path('/', ignore_query: true)
  end
end

RSpec.configure do |config|
  config.include LoginHelper, type: :feature
end
