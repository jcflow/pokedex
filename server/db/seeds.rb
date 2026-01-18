# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create default admin user for authentication
# Uses find_or_create_by to ensure idempotent seeding
admin = User.find_or_initialize_by(username: 'admin')
if admin.new_record?
  admin.password = 'admin'
  admin.password_confirmation = 'admin'
  admin.save!
  puts 'Created admin user (username: admin, password: admin)'
else
  puts 'Admin user already exists'
end
