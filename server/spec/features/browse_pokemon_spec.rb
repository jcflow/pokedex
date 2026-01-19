require 'rails_helper'

RSpec.feature "Browse Pokemon", type: :feature, js: true do
  let(:types_response) do
    {
      results: [
        { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" }
      ]
    }.to_json
  end

  let(:pokemon_list_response) do
    {
      count: 1302,
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" }
      ]
    }.to_json
  end

  before do
    # Stub fetching types (often called by backend or metadata)
    stub_request(:get, "https://pokeapi.co/api/v2/type")
      .to_return(status: 200, body: types_response, headers: { 'Content-Type' => 'application/json' })

    # Stub full list fetch (for caching)
    stub_request(:get, "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0")
      .to_return(status: 200, body: pokemon_list_response, headers: { 'Content-Type' => 'application/json' })

    login_user
  end

  scenario "User views the list of Pokemon" do
    expect(page).to have_content('Bulbasaur')
    expect(page).to have_content('#1')
    expect(page).to have_content('Ivysaur')
    expect(page).to have_content('#2')
  end
end
