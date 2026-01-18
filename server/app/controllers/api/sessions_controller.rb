# frozen_string_literal: true

##
# API controller for user session management (login/logout)
#
# Handles authentication using session cookies. Passwords are verified
# using bcrypt via the User model's has_secure_password.
#
# @example Login request
#   POST /api/login
#   { username: "admin", password: "password" }
#
# @example Logout request
#   POST /api/logout
#
# @example Check session
#   GET /api/session
#
class Api::SessionsController < ApplicationController
  ##
  # Authenticate user and return session token
  #
  # @return [JSON] User data and session token on success
  # @return [JSON] Error message with 400/401 status on failure
  def create
    # Validate required parameters
    unless params[:username].present? && params[:password].present?
      return render json: { error: "Username and password are required" }, status: :bad_request
    end

    # Find user (case-insensitive username lookup)
    user = User.find_by("LOWER(username) = ?", params[:username].downcase)

    # Authenticate user
    if user&.authenticate(params[:password])
      # Generate session token (user_id encoded with timestamp)
      token = Base64.strict_encode64("#{user.id}:#{Time.now.to_i}")

      # Store token in session for server-side validation
      session[:token] = token
      session[:user_id] = user.id

      render json: { user: user_json(user), token: token }, status: :ok
    else
      render json: { error: "Invalid username or password" }, status: :unauthorized
    end
  end

  ##
  # Destroy current session (logout)
  #
  # @return [JSON] Success message
  def destroy
    session[:user_id] = nil
    render json: { message: "Logged out successfully" }, status: :ok
  end

  ##
  # Check current session status
  #
  # @return [JSON] Current user data if authenticated
  # @return [JSON] Error message with 401 status if not authenticated
  def show
    if current_user
      render json: { user: user_json(current_user) }, status: :ok
    else
      render json: { error: "Not authenticated" }, status: :unauthorized
    end
  end

  private

  ##
  # Serialize user to JSON, excluding password_digest
  #
  # @param user [User] The user to serialize
  # @return [Hash] User data safe for API response
  def user_json(user)
    {
      id: user.id,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  end
end
