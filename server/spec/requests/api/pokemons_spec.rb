# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Pokemons', type: :request do
  let!(:user) { User.create!(username: 'testuser', password: 'password123') }
  let(:base_url) { 'https://pokeapi.co/api/v2' }

  let(:mock_list_response) do
    {
      'count' => 1302,
      'next' => 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      'previous' => nil,
      'results' => [
        { 'name' => 'bulbasaur', 'url' => 'https://pokeapi.co/api/v2/pokemon/1/' },
        { 'name' => 'ivysaur', 'url' => 'https://pokeapi.co/api/v2/pokemon/2/' }
      ]
    }
  end

  let(:mock_detail_response) do
    {
      'id' => 1,
      'name' => 'bulbasaur',
      'base_experience' => 64,
      'height' => 7,
      'weight' => 69,
      'abilities' => [
        {
          'is_hidden' => false,
          'slot' => 1,
          'ability' => { 'name' => 'overgrow', 'url' => 'https://pokeapi.co/api/v2/ability/65/' }
        }
      ],
      'forms' => [
        { 'name' => 'bulbasaur', 'url' => 'https://pokeapi.co/api/v2/pokemon-form/1/' }
      ],
      'moves' => [],
      'sprites' => {
        'front_default' => 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
      },
      'types' => [
        {
          'slot' => 1,
          'type' => { 'name' => 'grass', 'url' => 'https://pokeapi.co/api/v2/type/12/' }
        }
      ]
    }
  end

  before do
    # Clear cache before each test
    Rails.cache.clear
  end

  describe 'GET /api/pokemons' do
    context 'when authenticated' do
      let(:headers) { auth_headers }

      before do
        # Stub the PokeAPI call
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_return(
            status: 200,
            body: mock_list_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )
      end

      it 'returns 200 status' do
        get '/api/pokemons', headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'returns paginated pokemon data' do
        get '/api/pokemons', headers: headers
        json = JSON.parse(response.body)

        expect(json['count']).to eq(1302)
        expect(json['results']).to be_an(Array)
        expect(json['results'].size).to eq(2)
        expect(json['results'].first['name']).to eq('bulbasaur')
      end

      it 'accepts page parameter' do
        stub_request(:get, "#{base_url}/pokemon?offset=20&limit=20")
          .to_return(
            status: 200,
            body: mock_list_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )

        get '/api/pokemons', params: { page: 2 }, headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'accepts limit parameter' do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=50")
          .to_return(
            status: 200,
            body: mock_list_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )

        get '/api/pokemons', params: { limit: 50 }, headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'uses default page and limit when not specified' do
        get '/api/pokemons', headers: headers
        expect(response).to have_http_status(:ok)
        # Should use page 1 and limit 20 by default
        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon?offset=0&limit=20")
      end
    end

    context 'when not authenticated' do
      it 'returns 401 status' do
        get '/api/pokemons'
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns error message' do
        get '/api/pokemons'
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Not authenticated')
      end
    end

    context 'when PokeAPI fails' do
      let(:headers) { auth_headers }

      before do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_return(status: 500, body: 'Internal Server Error')
      end

      it 'returns 503 status' do
        get '/api/pokemons', headers: headers
        expect(response).to have_http_status(:service_unavailable)
      end

      it 'returns error message' do
        get '/api/pokemons', headers: headers
        json = JSON.parse(response.body)
        expect(json['error']).to include('PokeAPI')
      end
    end
  end

  describe 'GET /api/pokemons/:id' do
    context 'when authenticated' do
      let(:headers) { auth_headers }

      before do
        # Stub the PokeAPI call
        stub_request(:get, "#{base_url}/pokemon/1")
          .to_return(
            status: 200,
            body: mock_detail_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )
      end

      it 'returns 200 status' do
        get '/api/pokemons/1', headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'returns detailed pokemon data' do
        get '/api/pokemons/1', headers: headers
        json = JSON.parse(response.body)

        expect(json['id']).to eq(1)
        expect(json['name']).to eq('bulbasaur')
        expect(json['height']).to eq(7)
        expect(json['weight']).to eq(69)
      end

      it 'includes abilities' do
        get '/api/pokemons/1', headers: headers
        json = JSON.parse(response.body)

        expect(json['abilities']).to be_an(Array)
        expect(json['abilities'].first['ability']['name']).to eq('overgrow')
      end

      it 'includes moves' do
        get '/api/pokemons/1', headers: headers
        json = JSON.parse(response.body)

        expect(json['moves']).to be_an(Array)
      end

      it 'includes forms' do
        get '/api/pokemons/1', headers: headers
        json = JSON.parse(response.body)

        expect(json['forms']).to be_an(Array)
        expect(json['forms'].first['name']).to eq('bulbasaur')
      end

      it 'includes sprites' do
        get '/api/pokemons/1', headers: headers
        json = JSON.parse(response.body)

        expect(json['sprites']).to be_a(Hash)
        expect(json['sprites']['front_default']).to be_present
      end

      it 'includes types' do
        get '/api/pokemons/1', headers: headers
        json = JSON.parse(response.body)

        expect(json['types']).to be_an(Array)
        expect(json['types'].first['type']['name']).to eq('grass')
      end

      it 'accepts pokemon name as identifier' do
        stub_request(:get, "#{base_url}/pokemon/bulbasaur")
          .to_return(
            status: 200,
            body: mock_detail_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )

        get '/api/pokemons/bulbasaur', headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['name']).to eq('bulbasaur')
      end
    end

    context 'when not authenticated' do
      it 'returns 401 status' do
        get '/api/pokemons/1'
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns error message' do
        get '/api/pokemons/1'
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Not authenticated')
      end
    end

    context 'when pokemon does not exist' do
      let(:headers) { auth_headers }

      before do
        stub_request(:get, "#{base_url}/pokemon/999999")
          .to_return(status: 404, body: 'Not Found')
      end

      it 'returns 404 status' do
        get '/api/pokemons/999999', headers: headers
        expect(response).to have_http_status(:not_found)
      end

      it 'returns error message' do
        get '/api/pokemons/999999', headers: headers
        json = JSON.parse(response.body)
        expect(json['error']).to include('not found')
      end
    end

    context 'when PokeAPI fails' do
      let(:headers) { auth_headers }

      before do
        stub_request(:get, "#{base_url}/pokemon/1")
          .to_return(status: 500, body: 'Internal Server Error')
      end

      it 'returns 503 status' do
        get '/api/pokemons/1', headers: headers
        expect(response).to have_http_status(:service_unavailable)
      end

      it 'returns error message' do
        get '/api/pokemons/1', headers: headers
        json = JSON.parse(response.body)
        expect(json['error']).to include('PokeAPI')
      end
    end
  end
end
