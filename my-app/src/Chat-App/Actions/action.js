import { client } from '../../App'

export const logout = ()=>{ // we can use actions to do some operations about the login state

        localStorage.removeItem('token');
        client.clearStore();

        return {
           type:'LOGOUT',
           payload:{
               user:{},
               error:{}
           }
        }

}