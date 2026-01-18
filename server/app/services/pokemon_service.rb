# frozen_string_literal: true

# Service for interacting with the PokeAPI
#
# This service provides methods to fetch Pokemon data from the external PokeAPI.
# It includes caching to reduce external API calls and improve performance.
#
# @example Fetch a list of Pokemon
#   service = PokemonService.new
#   pokemon_list = service.fetch_list(page: 1, limit: 20)
#
# @example Fetch details for a specific Pokemon
#   service = PokemonService.new
#   pokemon_detail = service.fetch_detail(id: 1)
class PokemonService
  include HTTParty
  base_uri "https://pokeapi.co/api/v2"

  # Cache expiration time (1 hour)
  CACHE_EXPIRATION = 1.hour

  # Custom error classes
  class ServiceError < StandardError; end
  class NotFoundError < ServiceError; end

  # Fetches a paginated list of Pokemon from PokeAPI
  #
  # @param page [Integer] the page number (1-indexed)
  # @param limit [Integer] the number of results per page (default: 20)
  # @return [Hash] the API response containing count, next, previous, and results
  # @raise [ServiceError] if the API request fails
  #
  # @example
  #   service.fetch_list(page: 1, limit: 20)
  #   # => { "count" => 1302, "next" => "...", "previous" => nil, "results" => [...] }
  def fetch_list(page: 1, limit: 20)
    offset = (page - 1) * limit
    cache_key = "pokemon_list_#{page}_#{limit}"

    Rails.cache.fetch(cache_key, expires_in: CACHE_EXPIRATION) do
      fetch_with_error_handling do
        self.class.get("/pokemon", query: { offset: offset, limit: limit })
      end
    end
  end

  # Fetches detailed information for a specific Pokemon
  #
  # @param id [Integer, String] the Pokemon ID or name
  # @return [Hash] the API response containing detailed Pokemon data
  # @raise [NotFoundError] if the Pokemon is not found (404)
  # @raise [ServiceError] if the API request fails
  #
  # @example
  #   service.fetch_detail(id: 1)
  #   # => { "id" => 1, "name" => "bulbasaur", "abilities" => [...], ... }
  def fetch_detail(id:)
    cache_key = "pokemon_detail_#{id}"

    Rails.cache.fetch(cache_key, expires_in: CACHE_EXPIRATION) do
      fetch_with_error_handling do
        self.class.get("/pokemon/#{id}")
      end
    end
  end

  private

  # Wraps API calls with error handling
  #
  # @yield the block that performs the HTTP request
  # @return [Hash] the parsed JSON response
  # @raise [NotFoundError] if the response status is 404
  # @raise [ServiceError] for other errors
  def fetch_with_error_handling
    response = yield

    case response.code
    when 200
      response.parsed_response
    when 404
      raise NotFoundError, "Pokemon not found"
    else
      raise ServiceError, "PokeAPI returned status #{response.code}"
    end
  rescue Net::OpenTimeout, Net::ReadTimeout
    raise ServiceError, "Request timeout - PokeAPI is not responding"
  rescue SocketError => e
    raise ServiceError, "Network error: #{e.message}"
  rescue StandardError => e
    # Re-raise our custom errors
    raise if e.is_a?(ServiceError)

    # Wrap other errors
    raise ServiceError, "Unexpected error: #{e.message}"
  end
end
