# frozen_string_literal: true

##
# API controller for Pokemon data proxy
#
# Proxies requests to the PokeAPI service. All endpoints require authentication
# via session cookies. Responses are cached to improve performance.
#
# @example List Pokemon
#   GET /api/pokemons?page=1&limit=20
#
# @example Get Pokemon detail
#   GET /api/pokemons/1
#   GET /api/pokemons/bulbasaur
#
class Api::PokemonsController < ApplicationController
  before_action :require_authentication

  ##
  # List Pokemon with pagination
  #
  # @param page [Integer] Page number (default: 1)
  # @param limit [Integer] Items per page (default: 20)
  # @return [JSON] Paginated Pokemon list from PokeAPI
  # @return [JSON] Error message with appropriate status on failure
  def index
    page = params[:page]&.to_i || 1
    limit = params[:limit]&.to_i || 20

    pokemon_data = pokemon_service.fetch_list(page: page, limit: limit)
    render json: pokemon_data, status: :ok
  rescue PokemonService::ServiceError => e
    render json: { error: "PokeAPI error: #{e.message}" }, status: :service_unavailable
  end

  ##
  # Get detailed Pokemon information
  #
  # @param id [String] Pokemon ID or name
  # @return [JSON] Detailed Pokemon data from PokeAPI
  # @return [JSON] Error message with 404 if Pokemon not found
  # @return [JSON] Error message with 503 if PokeAPI is unavailable
  def show
    pokemon_data = pokemon_service.fetch_detail(id: params[:id])
    render json: pokemon_data, status: :ok
  rescue PokemonService::NotFoundError
    render json: { error: "Pokemon not found" }, status: :not_found
  rescue PokemonService::ServiceError => e
    render json: { error: "PokeAPI error: #{e.message}" }, status: :service_unavailable
  end

  private

  ##
  # Get or create PokemonService instance
  #
  # @return [PokemonService] The service instance
  def pokemon_service
    @pokemon_service ||= PokemonService.new
  end
end
