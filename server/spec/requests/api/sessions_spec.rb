# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Sessions', type: :request do
  let!(:user) { User.create!(username: 'testuser', password: 'password123') }

  describe 'POST /api/login' do
    context 'with valid credentials' do
      it 'returns 200 status' do
        post '/api/login', params: { username: 'testuser', password: 'password123' }
        expect(response).to have_http_status(:ok)
      end

      it 'sets session cookie' do
        post '/api/login', params: { username: 'testuser', password: 'password123' }
        expect(session[:user_id]).to eq(user.id)
      end

      it 'returns user data without password_digest' do
        post '/api/login', params: { username: 'testuser', password: 'password123' }
        json = JSON.parse(response.body)
        expect(json['user']['username']).to eq('testuser')
        expect(json['user']['id']).to eq(user.id)
        expect(json['user']).not_to have_key('password_digest')
      end

      it 'matches username case-insensitively' do
        post '/api/login', params: { username: 'TESTUSER', password: 'password123' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['user']['username']).to eq('testuser')
      end
    end

    context 'with invalid credentials' do
      it 'returns 401 status with wrong password' do
        post '/api/login', params: { username: 'testuser', password: 'wrongpassword' }
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns error message with wrong password' do
        post '/api/login', params: { username: 'testuser', password: 'wrongpassword' }
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Invalid username or password')
      end

      it 'returns 401 status with non-existent username' do
        post '/api/login', params: { username: 'nonexistent', password: 'password123' }
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns error message with non-existent username' do
        post '/api/login', params: { username: 'nonexistent', password: 'password123' }
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Invalid username or password')
      end

      it 'does not set session cookie with invalid credentials' do
        post '/api/login', params: { username: 'testuser', password: 'wrongpassword' }
        expect(session[:user_id]).to be_nil
      end
    end

    context 'with missing parameters' do
      it 'returns 400 status when username is missing' do
        post '/api/login', params: { password: 'password123' }
        expect(response).to have_http_status(:bad_request)
      end

      it 'returns error message when username is missing' do
        post '/api/login', params: { password: 'password123' }
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Username and password are required')
      end

      it 'returns 400 status when password is missing' do
        post '/api/login', params: { username: 'testuser' }
        expect(response).to have_http_status(:bad_request)
      end

      it 'returns error message when password is missing' do
        post '/api/login', params: { username: 'testuser' }
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Username and password are required')
      end

      it 'returns 400 status when both parameters are missing' do
        post '/api/login', params: {}
        expect(response).to have_http_status(:bad_request)
      end
    end
  end

  describe 'POST /api/logout' do
    before do
      post '/api/login', params: { username: 'testuser', password: 'password123' }
    end

    it 'returns 200 status' do
      post '/api/logout'
      expect(response).to have_http_status(:ok)
    end

    it 'clears the session' do
      post '/api/logout'
      expect(session[:user_id]).to be_nil
    end

    it 'returns success message' do
      post '/api/logout'
      json = JSON.parse(response.body)
      expect(json['message']).to eq('Logged out successfully')
    end

    it 'works even when not logged in' do
      post '/api/logout'
      post '/api/logout'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /api/session' do
    context 'when authenticated' do
      before do
        post '/api/login', params: { username: 'testuser', password: 'password123' }
      end

      it 'returns 200 status' do
        get '/api/session'
        expect(response).to have_http_status(:ok)
      end

      it 'returns user data' do
        get '/api/session'
        json = JSON.parse(response.body)
        expect(json['user']['username']).to eq('testuser')
        expect(json['user']['id']).to eq(user.id)
      end

      it 'does not return password_digest' do
        get '/api/session'
        json = JSON.parse(response.body)
        expect(json['user']).not_to have_key('password_digest')
      end
    end

    context 'when not authenticated' do
      it 'returns 401 status' do
        get '/api/session'
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns error message' do
        get '/api/session'
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Not authenticated')
      end
    end
  end

  describe 'security' do
    it 'never exposes password_digest in login response' do
      post '/api/login', params: { username: 'testuser', password: 'password123' }
      expect(response.body).not_to include('password_digest')
      expect(response.body).not_to include(user.password_digest)
    end

    it 'never exposes password_digest in session check response' do
      post '/api/login', params: { username: 'testuser', password: 'password123' }
      get '/api/session'
      expect(response.body).not_to include('password_digest')
      expect(response.body).not_to include(user.password_digest)
    end
  end
end
