require 'rails_helper'

RSpec.feature "Pagination", type: :feature, js: true do
  let(:pokemon_list_response) do
    results = 40.times.map do |i|
      { name: "pokemon-#{i + 1}", url: "https://pokeapi.co/api/v2/pokemon/#{i + 1}/" }
    end
    { count: 40, results: results }.to_json
  end

  before do
    stub_request(:get, "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0")
      .to_return(status: 200, body: pokemon_list_response, headers: { 'Content-Type' => 'application/json' })

    login_user
  end

  scenario "User navigates to next page" do
    # Assuming page size 20 (default)
    expect(page).to have_content('Pokemon-1')
    expect(page).not_to have_content('Pokemon-21')

    click_link 'Page 2', match: :first

    expect(page).to have_content('Pokemon-21')
    expect(page).not_to have_content('Pokemon-1')
  end
end
