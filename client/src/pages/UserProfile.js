import React, { useContext } from 'react';

import { AuthContext } from '../context/auth';
import { DisplayProfile } from '../components/displayProfile';
import { EditProfile} from '../components/editProfile'



function UserProfile(props) {
  const username = props.match.params.username;
  const {user} = useContext(AuthContext)
  if(user && user.username === username){
    return <EditProfile username={user.username} />
  }else {
    return <DisplayProfile username={username}/>
  }
  
}


export default UserProfile;
