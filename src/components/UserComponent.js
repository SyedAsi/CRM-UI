import React from "react";
import UserService from "../services/UserService";

class UserComponent extends React.Component{

    constructor(props){
        super(props)
        this.state ={
            users:[]
        }
    }
    componentDidMount(){
        UserService.getUser().then((response) =>{
            this.setState({users: response.data})
        });
    }

    static getUsersWithServices = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/movies/users-with-services');
            if (!response.ok) {
                throw new Error('Failed to fetch users with services');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching users with services:', error);
            throw error;
        }
    };

    render(){
        return(
            <div>
                <h1>User List</h1>
                <table>
                    <thead>
                        <tr>
                            <td>user id</td>
                             <td>user name</td>
                            <td>user pass</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map(
                                user =>
                                <tr key = {user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.password}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>

            </div>
        )
    }
}
export default UserComponent