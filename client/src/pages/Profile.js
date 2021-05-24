import React, { useContext, useEffect} from 'react';

import { AuthContext } from '../context/auth';

function Profile(props) {
 
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if(user) {
      props.history.push(`/profile/${user.username}`)
  } else {
    props.history.push('/')
  }
  }, [user])
  
 return(
 <div className="absolute flex h-screen w-screen justify-center items-center">
 <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">Loading...</h1>

</div>)
}

export default Profile;
