require 'rails_helper'

RSpec.feature "Authentication", type: :feature, js: true do
  scenario "User logs in successfully" do
    visit '/login'

    fill_in 'Username', with: 'ash'
    fill_in 'Password', with: 'pikachu'
    click_button 'LOGIN'

    expect(page).to have_current_path('/', ignore_query: true)
    expect(page).to have_content('Pokemon')
  end

  scenario "User enters invalid credentials" do
    visit '/login'

    fill_in 'Username', with: 'ash'
    fill_in 'Password', with: 'wrongpassword'
    click_button 'LOGIN'

    expect(page).to have_content('Invalid username or password')
  end
end
