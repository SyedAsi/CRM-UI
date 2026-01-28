import axios from 'axios'

const URI_USER = 'http://localhost:8080/api/v1/movies/users';
const URI_USER_SERVICES = 'http://localhost:8080/api/v1/movies/services';
const URI_USERS_WITH_SERVICES = 'http://localhost:8080/api/v1/movies/users-with-services';

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
    getUsersWithServices(){
        return axios.get(URI_USERS_WITH_SERVICES);
    }
}
export default new UserService();