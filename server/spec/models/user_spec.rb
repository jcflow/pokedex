# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    context 'username validations' do
      it 'is valid with a username and password' do
        user = User.new(username: 'testuser', password: 'password123')
        expect(user).to be_valid
      end

      it 'is invalid without a username' do
        user = User.new(username: nil, password: 'password123')
        expect(user).not_to be_valid
        expect(user.errors[:username]).to include("can't be blank")
      end

      it 'is invalid with an empty username' do
        user = User.new(username: '', password: 'password123')
        expect(user).not_to be_valid
        expect(user.errors[:username]).to include("can't be blank")
      end

      it 'is invalid with a duplicate username (case-insensitive)' do
        User.create!(username: 'TestUser', password: 'password123')
        duplicate_user = User.new(username: 'testuser', password: 'password123')
        expect(duplicate_user).not_to be_valid
        expect(duplicate_user.errors[:username]).to include('has already been taken')
      end

      it 'is invalid with a duplicate username with different case' do
        User.create!(username: 'admin', password: 'password123')
        duplicate_user = User.new(username: 'ADMIN', password: 'password123')
        expect(duplicate_user).not_to be_valid
        expect(duplicate_user.errors[:username]).to include('has already been taken')
      end
    end

    context 'password validations' do
      it 'is invalid without a password' do
        user = User.new(username: 'testuser', password: nil)
        expect(user).not_to be_valid
        expect(user.errors[:password]).to include("can't be blank")
      end

      it 'is invalid with a password shorter than 5 characters' do
        user = User.new(username: 'testuser', password: 'test')
        expect(user).not_to be_valid
        expect(user.errors[:password]).to include('is too short (minimum is 5 characters)')
      end

      it 'is valid with a password of exactly 5 characters' do
        user = User.new(username: 'testuser', password: 'admin')
        expect(user).to be_valid
      end

      it 'is valid with a password longer than 5 characters' do
        user = User.new(username: 'testuser', password: 'password123')
        expect(user).to be_valid
      end
    end
  end

  describe 'has_secure_password' do
    it 'encrypts the password' do
      user = User.create!(username: 'testuser', password: 'password123')
      expect(user.password_digest).not_to eq('password123')
      expect(user.password_digest).to be_present
    end

    it 'authenticates with the correct password' do
      user = User.create!(username: 'testuser', password: 'password123')
      expect(user.authenticate('password123')).to eq(user)
    end

    it 'does not authenticate with an incorrect password' do
      user = User.create!(username: 'testuser', password: 'password123')
      expect(user.authenticate('wrongpassword')).to be_falsey
    end

    it 'requires password confirmation to match' do
      user = User.new(username: 'testuser', password: 'password123', password_confirmation: 'different')
      expect(user).not_to be_valid
      expect(user.errors[:password_confirmation]).to include("doesn't match Password")
    end
  end

  describe 'edge cases' do
    it 'handles empty string password' do
      user = User.new(username: 'testuser', password: '')
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include("can't be blank")
    end

    it 'handles whitespace-only username' do
      user = User.new(username: '   ', password: 'password123')
      expect(user).not_to be_valid
      expect(user.errors[:username]).to include("can't be blank")
    end

    it 'sanitizes potential SQL injection attempts in username' do
      malicious_username = "admin'; DROP TABLE users;--"
      user = User.create(username: malicious_username, password: 'password123')
      expect(user).to be_valid
      expect(user.username).to eq(malicious_username)
      # Verify the user can be found safely
      found_user = User.find_by(username: malicious_username)
      expect(found_user).to eq(user)
    end

    it 'handles special characters in username' do
      user = User.new(username: 'user@example.com', password: 'password123')
      expect(user).to be_valid
    end

    it 'handles unicode characters in username' do
      user = User.new(username: 'ユーザー', password: 'password123')
      expect(user).to be_valid
    end
  end

  describe 'database constraints' do
    it 'enforces uniqueness at the database level' do
      User.create!(username: 'testuser', password: 'password123')
      duplicate_user = User.new(username: 'testuser', password: 'password123')

      expect { duplicate_user.save(validate: false) }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end
end
