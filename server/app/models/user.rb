# frozen_string_literal: true

##
# User model for authentication
#
# Handles user authentication using bcrypt's has_secure_password.
# Stores username and encrypted password_digest.
#
# @attr [String] username The unique username for authentication
# @attr [String] password_digest The bcrypt-encrypted password
#
# @example Create a new user
#   user = User.create(username: 'admin', password: 'securepassword')
#   user.authenticate('securepassword') # => returns user if valid
#
class User < ApplicationRecord
  has_secure_password

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 5 }, allow_nil: true
end
