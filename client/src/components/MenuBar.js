import React, { useContext, useEffect, useState } from 'react';
import { useQuery} from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { motion, useTransform, useViewportScroll } from "framer-motion"

import { AuthContext } from '../context/auth';
import {GET_PROFILE_QUERY} from '../util/graphql';

const variants = {
  open: {
    clipPath: `circle(1000px at 0% 100%)`,
    transition: {
      type: "spring",
      stiffness: 10,
      restDelta: 2
    }
  },
  closed: {  
    clipPath: "circle(0px at 90% 10%)",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      bounce:1
    }
  }
}
function GetAvatar({username}) {
  const { data } = useQuery(GET_PROFILE_QUERY, {
    variables: {
      username: username
    }
  });
  const [avatarThumb, setAvatarThumb] = useState("https://res.cloudinary.com/rushed21/image/upload/v1621689254/foodtruck/avatars/avatar.png")
  useEffect(() =>{
    if(data){
      if(data.getProfile.avatar){
      setAvatarThumb(data.getProfile.avatar)}
    }
  }, [data])
  const avatar = (
  <img src={avatarThumb} className="rounded-xl" alt="Food truck avatar" />
 ) 
  return avatar;
}

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useViewportScroll();

  const yPosAnim = useTransform(scrollYProgress, [0, 0.1], [0, -90]);
  // useEffect(() => {
  //   return scrollYProgress.onChange((v) => console.log(v));
  // }, [scrollYProgress]);
      
  const menuBar = user ? (
    <motion.div className="fixed z-50 w-screen flex justify-center " style={{y: yPosAnim}}>
      <div className="flex items-center justify-between px-1.5 md:px-2 lg:px-2 py-1.5 md:py-2 lg:py-2 place-self-center w-11/12 rounded-b-2xl">
      <div className="flex items-center relative outline-none focus:ring-2 focus:ring-night focus:ring-offset-2" tabIndex="0">
      <Link to="/" className="outline-none"><motion.h1 className="font-mulish font-black text-xl md:text-4xl px-2 bg-coral rounded-xl subpixel-antialiased outline-none"> FoodFriends </motion.h1></Link>
      </div>
      <div>
      <div className="flex items-center relative"  onClick={() => setIsOpen(isOpen => !isOpen)}>
          <motion.button type="button" className="focus:outline-none "
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}>
            <span className="sr-only">Open user menu</span>
              <div className="h-10 w-10 md:h-14 md:w-14 lg:h-14 lg:w-14 rounded-xl outline-none focus:ring-2 focus:ring-night focus:ring-offset-2" tabIndex="1">
                <GetAvatar username={user.username} />
           </div>
            </motion.button>
        <motion.div className="absolute right-0 top-100 mt-2 w-48 py-1 rounded-b-xl rounded-tl-xl bg-coral ring-1 ring-black ring-opacity-5 focus:outline-none z-9"
        animate={isOpen ? "open" : "closed"}
        variants={variants}>
              <Link to={`/profile/${user.username}`}> <motion.h3 className="font-poppins font-normal text-2xl px-6 pt-4 pb-1 text-white text-right" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >Profile</motion.h3></Link>
                <motion.h3 className="font-poppins font-normal text-2xl px-6 pt-1 pb-4 text-white text-right" onClick={logout} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Logout</motion.h3>
              </motion.div>
          </div>
      </div>
      </div>
    </motion.div>
  ) : (
    <motion.div className="fixed z-50 w-screen flex justify-center" style={{y: yPosAnim}}>
      <div className="flex items-center justify-between px-1.5 md:px-2 lg:px-2 py-1.5 md:py-2 lg:py-2 w-11/12 rounded-2xl">

      <div className="flex items-center relative">
      <Link to="/"><span className="font-mulish font-black text-xl md:text-4xl px-2 py-1 bg-coral rounded-lg sm:rounded-xl subpixel-antialiased"> FoodFRIENDS </span></Link>
      </div>
        <div className="flex items-center relative">
        <Link to="/login"><motion.h2 className="bg-night text-white font-mulish font-normal text-center text-base w-20 sm:w-24 py-1 sm:py-2 mx-1 sm:mx-3 my-2 rounded-lg sm:rounded-xl"  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Sign In</motion.h2></Link>
          </div>
          </div>
    </motion.div>
  );

  return menuBar;
}

export default MenuBar;
