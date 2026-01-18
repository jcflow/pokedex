# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PokemonService do
  let(:service) { described_class.new }
  let(:base_url) { 'https://pokeapi.co/api/v2' }

  before do
    # Clear cache before each test
    Rails.cache.clear
  end

  describe '#fetch_list' do
    let(:mock_response) do
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

    context 'with successful API response' do
      before do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_return(
            status: 200,
            body: mock_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )
      end

      it 'returns paginated pokemon list' do
        result = service.fetch_list(page: 1, limit: 20)

        expect(result).to be_a(Hash)
        expect(result['count']).to eq(1302)
        expect(result['results']).to be_an(Array)
        expect(result['results'].size).to eq(2)
        expect(result['results'].first['name']).to eq('bulbasaur')
      end

      it 'calculates correct offset for page 2' do
        stub_request(:get, "#{base_url}/pokemon?offset=20&limit=20")
          .to_return(
            status: 200,
            body: mock_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )

        service.fetch_list(page: 2, limit: 20)

        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon?offset=20&limit=20")
      end

      it 'uses default limit of 20 when not specified' do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_return(
            status: 200,
            body: mock_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )

        service.fetch_list(page: 1)

        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon?offset=0&limit=20")
      end
    end

    context 'with caching' do
      before do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_return(
            status: 200,
            body: mock_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )
      end

      it 'caches the response on first call' do
        service.fetch_list(page: 1, limit: 20)
        service.fetch_list(page: 1, limit: 20)

        # Should only make one HTTP request due to caching
        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon?offset=0&limit=20").once
      end

      it 'uses different cache keys for different pages' do
        stub_request(:get, "#{base_url}/pokemon?offset=20&limit=20")
          .to_return(
            status: 200,
            body: mock_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )

        service.fetch_list(page: 1, limit: 20)
        service.fetch_list(page: 2, limit: 20)

        # Should make two requests for different pages
        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon?offset=0&limit=20").once
        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon?offset=20&limit=20").once
      end
    end

    context 'with API errors' do
      it 'raises error on timeout' do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_timeout

        expect { service.fetch_list(page: 1, limit: 20) }
          .to raise_error(PokemonService::ServiceError, /timeout/i)
      end

      it 'raises error on 404' do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_return(status: 404, body: 'Not Found')

        expect { service.fetch_list(page: 1, limit: 20) }
          .to raise_error(PokemonService::NotFoundError)
      end

      it 'raises error on 500' do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_return(status: 500, body: 'Internal Server Error')

        expect { service.fetch_list(page: 1, limit: 20) }
          .to raise_error(PokemonService::ServiceError, /500/)
      end

      it 'raises error on network failure' do
        stub_request(:get, "#{base_url}/pokemon?offset=0&limit=20")
          .to_raise(SocketError.new('Failed to connect'))

        expect { service.fetch_list(page: 1, limit: 20) }
          .to raise_error(PokemonService::ServiceError, /network error/i)
      end
    end
  end

  describe '#fetch_detail' do
    let(:mock_detail_response) do
      {
        'id' => 1,
        'name' => 'bulbasaur',
        'base_experience' => 64,
        'height' => 7,
        'weight' => 69,
        'is_default' => true,
        'order' => 1,
        'abilities' => [
          {
            'is_hidden' => false,
            'slot' => 1,
            'ability' => {
              'name' => 'overgrow',
              'url' => 'https://pokeapi.co/api/v2/ability/65/'
            }
          },
          {
            'is_hidden' => true,
            'slot' => 3,
            'ability' => {
              'name' => 'chlorophyll',
              'url' => 'https://pokeapi.co/api/v2/ability/34/'
            }
          }
        ],
        'forms' => [
          {
            'name' => 'bulbasaur',
            'url' => 'https://pokeapi.co/api/v2/pokemon-form/1/'
          }
        ],
        'moves' => [
          {
            'move' => {
              'name' => 'razor-wind',
              'url' => 'https://pokeapi.co/api/v2/move/13/'
            },
            'version_group_details' => [
              {
                'level_learned_at' => 0,
                'move_learn_method' => {
                  'name' => 'egg',
                  'url' => 'https://pokeapi.co/api/v2/move-learn-method/2/'
                },
                'version_group' => {
                  'name' => 'gold-silver',
                  'url' => 'https://pokeapi.co/api/v2/version-group/3/'
                }
              }
            ]
          }
        ],
        'species' => {
          'name' => 'bulbasaur',
          'url' => 'https://pokeapi.co/api/v2/pokemon-species/1/'
        },
        'sprites' => {
          'back_default' => 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
          'front_default' => 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          'front_shiny' => 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
          'other' => {
            'dream_world' => {
              'front_default' => 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg'
            },
            'official-artwork' => {
              'front_default' => 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
            }
          }
        },
        'types' => [
          {
            'slot' => 1,
            'type' => {
              'name' => 'grass',
              'url' => 'https://pokeapi.co/api/v2/type/12/'
            }
          },
          {
            'slot' => 2,
            'type' => {
              'name' => 'poison',
              'url' => 'https://pokeapi.co/api/v2/type/4/'
            }
          }
        ]
      }
    end

    context 'with successful API response' do
      before do
        stub_request(:get, "#{base_url}/pokemon/1")
          .to_return(
            status: 200,
            body: mock_detail_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )
      end

      it 'returns detailed pokemon information' do
        result = service.fetch_detail(id: 1)

        expect(result).to be_a(Hash)
        expect(result['id']).to eq(1)
        expect(result['name']).to eq('bulbasaur')
        expect(result['height']).to eq(7)
        expect(result['weight']).to eq(69)
      end

      it 'includes abilities array' do
        result = service.fetch_detail(id: 1)

        expect(result['abilities']).to be_an(Array)
        expect(result['abilities'].size).to eq(2)
        expect(result['abilities'].first['ability']['name']).to eq('overgrow')
      end

      it 'includes moves array' do
        result = service.fetch_detail(id: 1)

        expect(result['moves']).to be_an(Array)
        expect(result['moves']).not_to be_empty
      end

      it 'includes forms array' do
        result = service.fetch_detail(id: 1)

        expect(result['forms']).to be_an(Array)
        expect(result['forms'].first['name']).to eq('bulbasaur')
      end

      it 'includes sprites object' do
        result = service.fetch_detail(id: 1)

        expect(result['sprites']).to be_a(Hash)
        expect(result['sprites']['front_default']).to be_present
      end

      it 'includes types array' do
        result = service.fetch_detail(id: 1)

        expect(result['types']).to be_an(Array)
        expect(result['types'].size).to eq(2)
        expect(result['types'].first['type']['name']).to eq('grass')
      end

      it 'accepts pokemon name as identifier' do
        stub_request(:get, "#{base_url}/pokemon/bulbasaur")
          .to_return(
            status: 200,
            body: mock_detail_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )

        result = service.fetch_detail(id: 'bulbasaur')

        expect(result['name']).to eq('bulbasaur')
      end
    end

    context 'with caching' do
      before do
        stub_request(:get, "#{base_url}/pokemon/1")
          .to_return(
            status: 200,
            body: mock_detail_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )
      end

      it 'caches the response on first call' do
        service.fetch_detail(id: 1)
        service.fetch_detail(id: 1)

        # Should only make one HTTP request due to caching
        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon/1").once
      end

      it 'uses different cache keys for different pokemon' do
        stub_request(:get, "#{base_url}/pokemon/2")
          .to_return(
            status: 200,
            body: mock_detail_response.to_json,
            headers: { 'Content-Type' => 'application/json' }
          )

        service.fetch_detail(id: 1)
        service.fetch_detail(id: 2)

        # Should make two requests for different pokemon
        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon/1").once
        expect(WebMock).to have_requested(:get, "#{base_url}/pokemon/2").once
      end
    end

    context 'with API errors' do
      it 'raises error on timeout' do
        stub_request(:get, "#{base_url}/pokemon/1")
          .to_timeout

        expect { service.fetch_detail(id: 1) }
          .to raise_error(PokemonService::ServiceError, /timeout/i)
      end

      it 'raises error on 404' do
        stub_request(:get, "#{base_url}/pokemon/999999")
          .to_return(status: 404, body: 'Not Found')

        expect { service.fetch_detail(id: 999999) }
          .to raise_error(PokemonService::NotFoundError)
      end

      it 'raises error on 500' do
        stub_request(:get, "#{base_url}/pokemon/1")
          .to_return(status: 500, body: 'Internal Server Error')

        expect { service.fetch_detail(id: 1) }
          .to raise_error(PokemonService::ServiceError, /500/)
      end

      it 'raises error on network failure' do
        stub_request(:get, "#{base_url}/pokemon/1")
          .to_raise(SocketError.new('Failed to connect'))

        expect { service.fetch_detail(id: 1) }
          .to raise_error(PokemonService::ServiceError, /network error/i)
      end
    end
  end
end
