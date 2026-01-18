class ApplicationController < ActionController::API
  include ActionController::Cookies

  private

  ##
  # Get current authenticated user from Authorization header token
  #
  # @return [User, nil] The current user or nil if not authenticated
  def current_user
    return @current_user if defined?(@current_user)

    # Check for Authorization header
    auth_header = request.headers["Authorization"]
    return nil unless auth_header&.start_with?("Bearer ")

    # Extract token
    token = auth_header.sub("Bearer ", "")

    # Decode token to get user_id
    begin
      decoded = Base64.strict_decode64(token)
      user_id, _timestamp = decoded.split(":")
      @current_user = User.find_by(id: user_id)
    rescue ArgumentError, StandardError
      @current_user = nil
    end
  end

  ##
  # Require authentication for protected endpoints
  #
  # @return [JSON] Error message with 401 status if not authenticated
  def require_authentication
    render json: { error: "Not authenticated" }, status: :unauthorized unless current_user
  end
end
