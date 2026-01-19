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
#
# @example Fetch filtered and sorted Pokemon
#   service = PokemonService.new
#   pokemon_list = service.fetch_list(page: 1, limit: 20, search: 'pika', sort: 'name')
class PokemonService
  include HTTParty
  base_uri "https://pokeapi.co/api/v2"

  # Cache expiration time (1 hour)
  CACHE_EXPIRATION = 1.hour

  # Maximum number of Pokemon to fetch for search/sort operations
  MAX_POKEMON_FETCH = 10_000

  # Valid sort options
  VALID_SORT_OPTIONS = %w[name number].freeze

  # Custom error classes
  class ServiceError < StandardError; end
  class NotFoundError < ServiceError; end

  # Fetches a paginated list of Pokemon from PokeAPI
  #
  # When search or sort parameters are provided, fetches the full list and applies
  # filtering/sorting in-memory before pagination.
  #
  # @param page [Integer] the page number (1-indexed)
  # @param limit [Integer] the number of results per page (default: 20)
  # @param search [String, nil] optional search term for case-insensitive partial name matching
  # @param sort [String, nil] optional sort field ('name' or 'number', defaults to 'number')
  # @return [Hash] the API response containing total, total_pages, page, and results
  # @raise [ServiceError] if the API request fails
  #
  # @example Basic pagination
  #   service.fetch_list(page: 1, limit: 20)
  #   # => { "count" => 1302, "next" => "...", "previous" => nil, "results" => [...] }
  #
  # @example With search and sort
  #   service.fetch_list(page: 1, limit: 20, search: 'pika', sort: 'name')
  #   # => { "total" => 1, "total_pages" => 1, "page" => 1, "results" => [...] }
  def fetch_list(page: 1, limit: 20, search: nil, sort: nil)
    # Use search/sort path if either parameter is provided (including empty string search)
    if !search.nil? || sort.present?
      fetch_list_with_search_sort(page: page, limit: limit, search: search, sort: sort)
    else
      fetch_list_basic(page: page, limit: limit)
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

  # Fetches basic paginated list without search/sort (original behavior)
  #
  # @param page [Integer] the page number
  # @param limit [Integer] the number of results per page
  # @return [Hash] the API response
  def fetch_list_basic(page:, limit:)
    offset = (page - 1) * limit
    cache_key = "pokemon_list_#{page}_#{limit}"

    Rails.cache.fetch(cache_key, expires_in: CACHE_EXPIRATION) do
      fetch_with_error_handling do
        self.class.get("/pokemon", query: { offset: offset, limit: limit })
      end
    end
  end

  # Fetches full list and applies search/sort/pagination in-memory
  #
  # @param page [Integer] the page number
  # @param limit [Integer] the number of results per page
  # @param search [String, nil] search term for filtering
  # @param sort [String, nil] sort field
  # @return [Hash] filtered, sorted, and paginated results
  def fetch_list_with_search_sort(page:, limit:, search:, sort:)
    all_pokemon = fetch_full_list

    # Add number (ID) to each Pokemon from URL
    all_pokemon = all_pokemon.map do |pokemon|
      pokemon.merge("number" => extract_pokemon_number(pokemon["url"]))
    end

    # Apply search filter (by name or number)
    filtered = if search.present?
                 all_pokemon.select { |p| matches_search?(p, search) }
    else
                 all_pokemon
    end

    # Apply sorting
    sorted = apply_sorting(filtered, sort)

    # Calculate pagination
    total = sorted.size
    total_pages = (total.to_f / limit).ceil
    offset = (page - 1) * limit
    paginated = sorted.slice(offset, limit) || []

    {
      "total" => total,
      "total_pages" => total_pages,
      "page" => page,
      "results" => paginated
    }
  end

  # Fetches the full list of Pokemon for search/sort operations
  #
  # @return [Array<Hash>] array of Pokemon with name and url
  def fetch_full_list
    cache_key = "pokemon_full_list"

    Rails.cache.fetch(cache_key, expires_in: CACHE_EXPIRATION) do
      response = fetch_with_error_handling do
        self.class.get("/pokemon", query: { offset: 0, limit: MAX_POKEMON_FETCH })
      end
      response["results"]
    end
  end

  # Extracts Pokemon number from PokeAPI URL
  #
  # @param url [String] Pokemon URL (e.g., "https://pokeapi.co/api/v2/pokemon/25/")
  # @return [Integer] the Pokemon number
  def extract_pokemon_number(url)
    url.match(%r{/pokemon/(\d+)/})&.captures&.first&.to_i || 0
  end

  # Applies sorting to Pokemon list
  #
  # @param pokemon_list [Array<Hash>] list of Pokemon
  # @param sort [String, nil] sort field ('name' or 'number')
  # @return [Array<Hash>] sorted list
  def apply_sorting(pokemon_list, sort)
    sort_field = VALID_SORT_OPTIONS.include?(sort) ? sort : "number"

    pokemon_list.sort_by { |p| p[sort_field] }
  end

  # Checks if a Pokemon matches the search term (by name or number)
  #
  # @param pokemon [Hash] Pokemon with 'name' and 'number' keys
  # @param search [String] search term
  # @return [Boolean] true if Pokemon matches
  def matches_search?(pokemon, search)
    search_lower = search.downcase.strip

    # Check if search is a number (for ID search)
    if search_lower.match?(/^\d+$/)
      pokemon["number"].to_s == search_lower
    else
      # Name search (case-insensitive partial match)
      pokemon["name"].downcase.include?(search_lower)
    end
  end

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
