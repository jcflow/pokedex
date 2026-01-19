require 'rails_helper'

RSpec.feature "Search Pokemon", type: :feature, js: true do
  let(:pokemon_list_response) do
    {
      count: 1302,
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
        { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" }
      ]
    }.to_json
  end

  before do
    stub_request(:get, "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0")
      .to_return(status: 200, body: pokemon_list_response, headers: { 'Content-Type' => 'application/json' })

    login_user
  end

  scenario "User searches by name" do
    fill_in 'Search', with: 'Char'
    # Wait for debounce and server response.
    # In a real app we might wait for network idle or specific UI state.
    # Here we just wait for content update.
    verify_search_results([ 'Charmander' ])
    expect(page).not_to have_content('Bulbasaur')
  end

  scenario "User searches by ID" do
    fill_in 'Search', with: '7'
    verify_search_results([ 'Squirtle' ])
    expect(page).not_to have_content('Bulbasaur')
  end

  def verify_search_results(expected_names)
    expected_names.each do |name|
      expect(page).to have_content(name)
    end
  end
end
