import axios from 'axios';
import { AuthProvider } from '../Interfaces/auth-provider.interface';

export class Auth0Provider implements AuthProvider {
	async authenticate(code: string): Promise<string> {
		try {
			const apiUrl = 'https://dev-i4yy6aosmfbqnxq3.us.auth0.com/oauth/token'; // replace with your API endpoint
			// create a wrapper for axios
			const response = await axios.post(apiUrl, {
				grant_type: 'authorization_code',
				client_id: '7AtMgepqMwqvlgtKhV2vQy7YmWYCr3oI',
				client_secret: 'LuQJkn0nPJ4KA0MCwycQHeIIE7YXpcn3wtA2s0GqeYnQ0gmVgU6qXtARZpqCUVAX',
				code,
				redirect_uri: 'http://localhost:4200/auth'
			});
			console.log(response.data);

			return response.data;
		} catch (error) {
			// Handle errors
			console.error('Error making API call:', error.message);
			throw error;
		}
	}
}
