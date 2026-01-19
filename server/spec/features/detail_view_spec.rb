require 'rails_helper'

RSpec.feature "Pokemon Detail View", type: :feature, js: true do
  let(:pokemon_list_response) do
    {
      count: 1,
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }
      ]
    }.to_json
  end

  let(:pokemon_detail_response) do
    {
      id: 1,
      name: "bulbasaur",
      height: 7,
      weight: 69,
      base_experience: 64,
      types: [
        { slot: 1, type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" } },
        { slot: 2, type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" } }
      ],
      stats: [
        { base_stat: 45, stat: { name: "hp" } }
      ],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
          }
        }
      },
      moves: []
    }.to_json
  end

  let(:pokemon_species_response) do
    {
      flavor_text_entries: [
        { flavor_text: "A strange seed was planted on its back at birth.", language: { name: "en" } }
      ]
    }.to_json
  end

  before do
    stub_request(:get, "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0")
      .to_return(status: 200, body: pokemon_list_response, headers: { 'Content-Type' => 'application/json' })

    stub_request(:get, "https://pokeapi.co/api/v2/pokemon/1/")
      .to_return(status: 200, body: pokemon_detail_response, headers: { 'Content-Type' => 'application/json' })

    stub_request(:get, "https://pokeapi.co/api/v2/pokemon-species/1/")
      .to_return(status: 200, body: pokemon_species_response, headers: { 'Content-Type' => 'application/json' })

    login_user
  end

  scenario "User views pokemon details" do
    click_link 'Bulbasaur'
    # Or find by test id if available, but link text is good for accessibility verification

    expect(page).to have_current_path('/pokemon/1', ignore_query: true)
    expect(page).to have_content('Bulbasaur')
    expect(page).to have_content('grass')
    expect(page).to have_content('poison')
    expect(page).to have_content('45') # HP
  end
end
