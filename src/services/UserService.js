import axios from 'axios'

const URI_USER = 'http://localhost:8080/api/v1/movies/users';
const URI_USER_SERVICES = 'http://localhost:8080/api/v1/movies/services';

class UserService{
    getUser(){
        return axios.get(URI_USER);
    }
    getUserServices(id){
        return axios.get(`${URI_USER_SERVICES}/${id}`);
    }
    createUser(userData){
        return axios.post(URI_USER, userData);
    }
}
export default new UserService();