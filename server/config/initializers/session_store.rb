# frozen_string_literal: true

# Configure session store to use cookies
# This allows the frontend to maintain authentication state
Rails.application.config.session_store :cookie_store, key: "_pokedex_session", same_site: :lax, secure: false
