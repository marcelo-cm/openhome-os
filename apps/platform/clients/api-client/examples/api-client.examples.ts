import { api } from '../api-client';

api.setToken('your-auth-token-here');

async function fetchPublicData() {
  try {
    const data = await api.get('/public/data', { auth: false });
    console.log('Public data:', data);
  } catch (error) {
    console.error('Error fetching public data:', error);
  }
}

async function fetchUserProfile() {
  try {
    const profile = await api.get('/user/profile');
    console.log('User profile:', profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

async function createUser(userData: { name: string; email: string }) {
  try {
    const newUser = await api.post('/users', userData);
    console.log('Created user:', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function streamData() {
  try {
    const stream = await api.stream('/data/stream');
    if (stream) {
      // Process the stream...
      console.log('Stream started');
    }
  } catch (error) {
    console.error('Error streaming data:', error);
  }
}

async function customRequest() {
  try {
    const data = await api.fetchJson('/custom/endpoint', {
      method: 'PUT',
      headers: {
        'X-Custom-Header': 'custom-value',
      },
    });
    console.log('Custom request result:', data);
  } catch (error) {
    console.error('Error in custom request:', error);
  }
}

function logout() {
  api.clearToken();
}

export {
  fetchPublicData,
  fetchUserProfile,
  createUser,
  streamData,
  customRequest,
  logout,
};
