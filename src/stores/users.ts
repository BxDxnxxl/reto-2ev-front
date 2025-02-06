import { defineStore } from "pinia";
import { ref } from "vue";
import UserDto from "./dtos/user.dto";

export const useUsersStore = defineStore('users', () =>{
    
    const users = ref(new Array<UserDto>());
    
    function findAll(){
        //fetch()
        //res.json
        //let data = [{}]
        //users.value.splice(0, users.value.length, ...data)
    }
    function createUser(){}
    function deleteUser(){}
    function updateUser(){}
    
    return {
        users,
        createUser,
        findAll,
        deleteUser,
        updateUser
    }
})