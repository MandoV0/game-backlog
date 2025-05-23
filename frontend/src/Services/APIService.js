import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const APIService = {
    login: (username, password) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        return axios.post(`${API_URL}/login`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

    }
}

export default APIService;