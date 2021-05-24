import React, { useEffect, useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { motion} from "framer-motion";
import EdiText from "react-editext";
import Dropzone from 'react-dropzone';


import { GET_PROFILE_QUERY, UPDATE_STATUS, UPDATE_AVATAR, UPDATE_TEXT, UPDATE_LOCATION, ADD_TRUCK, DELETE_TRUCK, ADD_MENU_ITEM, DELETE_MENU_ITEM , UPDATE_MENU_PICTURE, EDIT_MENU_ITEM, UPDATE_COVER_PICTURE } from '../util/graphql';

import { AuthContext } from '../context/auth';
import Popup from './popup'

function StatusToggle ({id, status}){
  const [ison, setIson] = useState(false);
  const [updateStatus, { loading: statusUpdating, error: statusUpdateError }] = useMutation(UPDATE_STATUS);
  useEffect(() => {
    if (status){setIson(true)} else{ setIson(false)};
  },[status])

  useEffect(() => {
    const loadingScreen = () => {
      return(
        <div className="absolute flex h-screen w-screen justify-center items-center">
              <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">Loading...</h1>
          </div>
      )
    }
    loadingScreen()      
  }, [statusUpdating])

  useEffect(() => {
    const errorScreen = () => {
      return(
        <div className="absolute flex h-screen w-screen justify-center items-center">
              <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">An error occured. Please refresh and login again.</h1>
          </div>
      )
    }
    errorScreen()      
  }, [statusUpdateError])
  
  const toggleSwitch = () => setIson(!ison);
const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};
  
  const Text = () =>{
    const text = ison ? (
      <h3 className="font-mulish font-bold text-sm text-center items-center">Serving</h3>
    ) : (<h3 className="font-mulish font-bold text-sm text-center items-center">Closed</h3>)
    return text;
  }
  
  return (
    <div>
      <div  className="switch" data-ison={ison} onClick={() => {
      updateStatus({variables: {status: !status, truckId: id}})
      toggleSwitch()}}>
      <motion.div className="handle z-20"
      layout transition={spring}>
      </motion.div>
    </div>
        <Text />
        </div>
  )
}

export function EditProfile({username}) {

  const {loading, data, error, refetch} = useQuery(GET_PROFILE_QUERY, {variables: {username}});
  
  const [addAvatar, { loading: avatarUpdating, error: avatarUpdateError, data: Avatar }] = useMutation(UPDATE_AVATAR);
  const [updateText] = useMutation(UPDATE_TEXT);
  const [updateLocation] = useMutation(UPDATE_LOCATION);
  const [addTrucks, { loading: truckAdding, data: truckAdd }] = useMutation(ADD_TRUCK);
  const [deleteTruck, { loading: truckDeleting, data: truckDelete }] = useMutation(DELETE_TRUCK);
  const [addMenuItem, { loading: menuloading, data: menuAdd}] = useMutation(ADD_MENU_ITEM)
  const [deleteMenuItem, { loading: menuDeleting, data: menuDelete}] = useMutation(DELETE_MENU_ITEM)
  const [addMenuPicture, { loading: menuPictureUpdating, error: menuPictureUpdateError, data: menuPicture }] = useMutation(UPDATE_MENU_PICTURE);
  const [editMenuItem, {loading:menuEditing, data:menuEdited}] = useMutation(EDIT_MENU_ITEM);
  const [addCoverPicture, {loading:coverPictureUpdating, error: coverPictureUpdateError, data: coverPicture}] = useMutation(UPDATE_COVER_PICTURE);

  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [descriptionEditing, setDescriptionEditing] = useState(false);

  const [isCoverOpen, setIsCoverOpen] = useState(false);

  const [displayForm, setDisplayForm] = useState(false)
    const [displayMenuForm, setDisplayMenuForm] = useState(false)

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuediting, setmenuediting] = useState(false);
    const [menuEditingIcons, setMenuEditingIcons] = useState("hidden")
    const [profileediting, setprofileediting] = useState(false);
    const [profileEditingIcons, setProfileEditingIcons] = useState("hidden")

    const [avatar, setAvatar] = useState("https://res.cloudinary.com/rushed21/image/upload/v1621689254/foodtruck/avatars/avatar.png")
    const [cover, setCover] = useState("https://res.cloudinary.com/rushed21/image/upload/v1621762831/foodtruck/covers/cover.png")

    useEffect(() =>{
      refetch()
      console.log(Avatar)
    }, [truckAdd, truckDelete, menuAdd, menuDelete, menuEdited])

    useEffect(() => {
      const loadingScreen = () => {
        return(
          <div className="absolute flex h-screen w-screen top-0 right-0 justify-center items-center">
                <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">Loading...</h1>
            </div>
        )
      }
      loadingScreen()      
    }, [loading, avatarUpdating, truckAdding, truckDeleting, menuloading, menuDeleting, menuPictureUpdating, menuEditing, coverPictureUpdating])

    useEffect(() => {
      const errorScreen = () => {
        return(
          <div className="absolute flex h-screen w-screen justify-center items-center">
                <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">An error occured. Please refresh and login again.</h1>
            </div>
        )
      }
      errorScreen()      
    }, [error, menuPictureUpdateError, coverPictureUpdateError, avatarUpdateError])


    useEffect(() => {
      if(data && data.getProfile.avatar){
        setAvatar(data.getProfile.avatar)
      }
      if(data && data.getProfile.cover){
        setCover(data.getProfile.cover)
      }
    },[data, refetch])


    useEffect(() => {
      function avatarStatus() {
       if(Avatar || menuPicture || coverPicture) {
          setIsOpen(false);
        }
        if(menuPicture) {
          setIsMenuOpen(false);
        }
        if(coverPicture) {
          setIsCoverOpen(false);
        } 
        
      }
        
        avatarStatus();
        refetch();
        
      }, [Avatar, menuPicture, coverPicture])
    
   


      ///top profile details component/////

      const togglePopup = () => {
        setIsOpen(!isOpen);
      };
      const handleTitleSave = (value) => {
        console.log(value);
        updateText({variables: {title:value, description:""}})
      };
      const handleDescriptionSave = (value) => {
        console.log(value);
        updateText({variables: {title:"", description: value}})
      };

      function ProfileComponent({title, description}){

        return( 
          <div className="block -mt-8 md:m-0 relative" >
          <div className="md:flex items-center relative">
          <div className="md:w-2/5 xl:w-32 flex justify-center md:justify-start relative">
              <img src={avatar} className="h-20 w-20 sm:h-32 sm:w-32 rounded-2xl sm:rounded-3xl" alt={title} />
              <button onClick={togglePopup} data-profileediting={profileediting} className="profileediting absolute bottom-0 left-55 md:left-75 flex justify-center items-center bg-night h-8 w-8 rounded-lg">
              <svg height="12pt" viewBox="0 0 492.49284 492" width="12pt" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
                            <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
              </svg>
              </button> 
                {isOpen && <Popup
                  content={<>
                    <Dropzone onDrop={ e => {
                      const [file] = e;
                      const reader = new FileReader();
                      if(file){
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        addAvatar({variables: {file: reader.result, publicId: user.username}})}
                      };
                      reader.onerror = () => {
                          return(<h1>Error</h1>);
                      }; 
                      setIsOpen(false);
                    }}>
                      {({getRootProps, getInputProps}) => (
                            <section className= "cursor-pointer border-8 border-dashed border-coral w-full h-full rounded-xl">
                              <div {...getRootProps()} className="flex justify-center items-center  w-full h-full">
                                <input {...getInputProps()} />
                              <p className="font-poppins font-semibold text-xl sm:text-2xl text-center md:text-left">Drag 'n' drop some files here, or click to select files </p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </>}
                handleClose={togglePopup}/>}   
                </div>

          <div className="pb-0 md:pb-8 md:pl-4 w-full md:w-4/5 text-start md:text-left">
            <div className="flex w-full justify-center md:justify-start pt-4 md:p-0 relative">
          <EdiText className="font-poppins font-bold text-xl sm:text-3xl text-center md:text-left"
          value={title}
          type="text"
          onSave={handleTitleSave}
          editing={titleEditing}
          editButtonClassName= {`${profileEditingIcons} flex justify-center items-center bg-night h-6 w-6 sm:w-8 sm:w-8 rounded-md`}
          editButtonContent = {
          <svg height="50%" viewBox="0 0 492.49284 492" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
          <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
          </svg>
          }
          saveButtonClassName = {`flex justify-center items-center bg-night mr-2 h-12 w-12 rounded-md`}
          saveButtonContent = {
            <svg height="50%" viewBox="0 -46 417.81333 417" width="50%"  style={{fill: '#FA9269'}}  xmlns="http://www.w3.org/2000/svg">
                          <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/>
                        </svg>
          }
          cancelButtonClassName = {`flex justify-center items-center bg-night h-12 w-12 rounded-md`}
          cancelButtonContent = {
            <svg height="50%" viewBox="0 0 365.696 365.696" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
              <path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/>
            </svg>
          }
        /></div>
        
          </div>
          </div>
        <EdiText className="font-mulish pt-4 font-light text-sm text-center md:text-left  md:text-md"
          value={description}
          type="textarea"
          onSave={handleDescriptionSave}
          editing={descriptionEditing}
          editButtonClassName= {`${profileEditingIcons} flex justify-center items-center bg-night h-6 w-6 sm:w-8 sm:w-8 rounded-md`}
          editButtonContent = {
          <svg height="50%" viewBox="0 0 492.49284 492" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
          <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
          </svg>
          }
          saveButtonClassName = {`flex justify-center items-center bg-night mr-2 h-12 w-12 rounded-md`}
          saveButtonContent = {
            <svg height="50%" viewBox="0 -46 417.81333 417" width="50%"  style={{fill: '#FA9269'}}  xmlns="http://www.w3.org/2000/svg">
                          <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/>
                        </svg>
          }
          cancelButtonClassName = {`flex justify-center items-center bg-night h-12 w-12 rounded-md`}
          cancelButtonContent = {
            <svg height="50%" viewBox="0 0 365.696 365.696" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
              <path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/>
            </svg>
          }
        />
        <div className="flex justify-center md:justify-end pt-4 pr-4">
                  <button className="flex justify-center items-center bg-night h-8 w-8 rounded-lg" onClick = {(e) => {
                    if(!profileediting) {
                      setProfileEditingIcons("");
                      setprofileediting(true)} else {
                         setProfileEditingIcons("hidden");
                         setprofileediting(false)
                        }
                        }}>{profileediting ? (
                          <svg height="12pt" viewBox="0 -46 417.81333 417" width="12pt"  style={{fill: '#FA9269'}}  xmlns="http://www.w3.org/2000/svg">
                          <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/>
                        </svg>): (
                          <svg height="12pt" viewBox="0 0 492.49284 492" width="12pt" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
                            <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
              </svg>
                        )}</button></div>  
        
          </div>
        )
      }


      ///trucks component///

      const handleUpdateLocation = (id) => {
        navigator.geolocation.getCurrentPosition(sucessLocation, errorLocation, { enableHighAccuracy: true})
        function sucessLocation(position){
          console.log(position)
          updateLocation({variables: {latitude: position.coords.latitude, longitude: position.coords.longitude, truckId: id}})
                }
        function errorLocation() {
          console.log('error');
        }
        }

      function Truckform(){
          const handleAddTruck = (value) => {
            addTrucks({variables: {vehicleNo: value}});
            setDisplayForm(false);
            }
          
          const form = displayForm ? (
          <EdiText className = "font-poppins font-semibold p-2 text-lg md:text-2xl"
          value={"Vehicle Number"}
          type="text"
          onSave={handleAddTruck}
          onCancel= {() => setDisplayForm(false)}
          editing={true}
          saveButtonClassName = {`flex justify-center items-center bg-night mr-2 h-12 w-12 rounded-md`}
          saveButtonContent = {
            <svg height="50%" viewBox="0 -46 417.81333 417" width="50%"  style={{fill: '#FA9269'}}  xmlns="http://www.w3.org/2000/svg">
                          <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/>
                        </svg>
          }
          cancelButtonClassName = {`flex justify-center items-center bg-night h-12 w-12 rounded-md`}
          cancelButtonContent = {
            <svg height="50%" viewBox="0 0 365.696 365.696" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
              <path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/>
            </svg>
          }
        />) : (
          <> </>
        )
        return form;
        }

      function TrucksComponent({data}){
        
        return(
          <div className="pt-14 ">
      <h2 className="font-poppins font-bold text-center sm:text-left text-3xl md:text-4xl">Trucks</h2>
      {
        data.getProfile.trucks.map( t => (
            <div className="block bg-blush max-w-full md:max-w-xl sm:flex md:block items-center justify-between my-4 py-3 px-4 rounded-2xl" key={t.id}>
            <div className="flex justify-between sm:justify-start md:justify-between items-center">
            <h2 className="font-poppins font-semibold pr-4 text-xl md:text-3xl">{t.vehicleNo}</h2>
            <StatusToggle id={t.id} status={t.status} />
            </div>
            <div className="flex items-center justify-between sm:justify-end md:justify-between mt-8 sm:my-4">
            <button className="font-mulish font-bold text-md bg-coral px-4 h-12 text-center mx-4 leading-4  w-24 rounded-xl" onClick= {(e) => {handleUpdateLocation(t.id)}}>Update Location</button>
            <button className="flex items-center justify-center font-mulish font-bold text-md bg-coral h-12 w-12 text-center mx-4 leading-4 rounded-xl" onClick={()=> {deleteTruck({variables: {truckId: t.id}})}} >
              <svg height="2rem" width="2rem" viewBox="-40 0 427 427.00131"xmlns="http://www.w3.org/2000/svg">
                <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/>
                </svg>
                </button>
            </div>
            </div>))
          }
          <div className="flex justify-center sm:justify-start md:justify-between">
          <button className="flex justify-center items-center bg-night h-10 w-10 rounded-xl" onClick = {(e) => setDisplayForm(!displayForm)}>
          <svg height="20pt" viewBox="0 0 469.33333 469.33333" width="20pt" xmlns="http://www.w3.org/2000/svg"  style={{fill: '#FA9269'}}>
            <path d="m437.332031 192h-160v-160c0-17.664062-14.335937-32-32-32h-21.332031c-17.664062 0-32 14.335938-32 32v160h-160c-17.664062 0-32 14.335938-32 32v21.332031c0 17.664063 14.335938 32 32 32h160v160c0 17.664063 14.335938 32 32 32h21.332031c17.664063 0 32-14.335937 32-32v-160h160c17.664063 0 32-14.335937 32-32v-21.332031c0-17.664062-14.335937-32-32-32zm0 0"/>
          </svg>

          </button>
          </div><Truckform />
    </div>
        )
      }


      /// Food menu component
      function Menuform(){
          const [item, setItem] = useState("")
          const [price, setPrice] = useState()
          const handleAddMenu = () => {
            console.log(item)
            console.log(price)
            addMenuItem({variables: {item: item, price: price}});
            setDisplayMenuForm(false);
            }
          
          const menuForm = displayMenuForm ? (
          <form onSubmit={handleAddMenu} className="max-w-xl py-8">
            <div className="py-2">
            <input type="text" placeholder="Name of your Dish" className="font-poppins font-semibold p-2 text-xl md:text-3xl w-full rounded-lg" value={item} onChange={e => setItem(e.target.value)} />
            </div>
            <div className="py-2">
            <input type='number' step="0.01" placeholder="Price of your Dish" className="font-poppins font-semibold p-2 text-xl md:text-3xl w-full rounded-lg" value={price} onChange={e => setPrice(parseFloat(e.target.value, 2))} />
            </div>
            <div className="w-full flex justify-center items-center py-4">
            <input type="submit" className="bg-night text-white font-mulish font-normal text-center text-base w-20 sm:w-24 py-1 sm:py-2 mx-1 sm:mx-3 my-2 rounded-lg " value="Add Item" />
            <button className="bg-night text-white font-mulish font-normal text-center text-base w-20 sm:w-24 py-1 sm:py-2 mx-1 sm:mx-3 my-2 rounded-lg " onClick={() => setDisplayMenuForm(false)}>Cancel</button>
            </div>
            </form>
            ) : (
          <> </>
        )
        return menuForm;
        }
      
      const MenuPicture = ({menuId}) => {
         

          const toggleMenuPopup = () => {
            setIsMenuOpen(!isMenuOpen);
          }

        const menupicture = (
            <div key={menuId}>
            <button onClick={toggleMenuPopup} data-menuediting={menuediting} className="menuediting absolute bottom-0 right-0 flex justify-center items-center bg-night h-8 w-8 rounded-lg">
              <svg height="12pt" viewBox="0 0 492.49284 492" width="12pt" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
                            <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
              </svg>
              </button>
            {isMenuOpen && <Popup
      content={<>
      <Dropzone onDrop={ e => {
                      const [file] = e;
                      const reader = new FileReader();
                      if(file){
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        addMenuPicture({variables: {file: reader.result, menuId: menuId}})}
                      };
                      reader.onerror = () => {
                          console.error('AHHHHHHHH!!');
                      };
                      setIsMenuOpen(false); 
                    }}>
                      {({getRootProps, getInputProps}) => (
                            <section className= "cursor-pointer border-8 border-dashed border-coral w-full h-full rounded-xl">
                              <div {...getRootProps()} className="flex justify-center items-center  w-full h-full">
                                <input {...getInputProps()} />
                              <p className="font-poppins font-semibold text-xl sm:text-2xl text-center md:text-left">Drag 'n' drop some files here, or click to select files</p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                      </>}
                            handleClose={toggleMenuPopup}
                          />}
                                   </div>

          )

          return menupicture;
        }

      function MenuComponent ({data}) {
        const [menuDescriptionEditing, setMenuDescriptionEditing] = useState(false);
        const [menuItemEditing, setMenuItemEditing] = useState(false);
        const [menuPriceEditing, setMenuPriceEditing] = useState(false);
        


        return(
          <div className="pt-14">
          <h1 className="font-poppins font-bold mb-16 text-3xl text-center sm:text-left md:text-4xl"> Menu Card </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 my-4 px-0 md:pr-8">
          {
              data.getProfile.menu.map( (m) => (
                <div className="relative py-3 my-4 rounded-2xl bg-blush" key={m.id}>
                  <div className="flex items-center" >
                    <div className="relative -mt-16 ml-2 rounded-3xl">
                    <img src={m.picture} className="h-32 w-32 md:h-40 md:w-40 rounded-3xl" alt={m.item}/>
                    <MenuPicture menuId={m.id} key={m.id} />
               </div>
                    <div className="pl-2">
                  <EdiText className="font-poppins font-semibold px-2 text-xl md:text-3xl"
          value={m.item}
          type="text"
          onSave={(i) => {
            editMenuItem({variables: {item: i, menuId: m.id}})
          }}
          editing={menuItemEditing}
          editButtonClassName= {`${menuEditingIcons} flex justify-center items-center bg-night h-6 w-6 sm:w-8 sm:w-8 rounded-md`}
          editButtonContent = {
          <svg height="50%" viewBox="0 0 492.49284 492" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
          <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
          </svg>
          }
          saveButtonClassName = {`flex justify-center items-center bg-night mr-2 h-12 w-12 rounded-md`}
          saveButtonContent = {
            <svg height="50%" viewBox="0 -46 417.81333 417" width="50%"  style={{fill: '#FA9269'}}  xmlns="http://www.w3.org/2000/svg">
                          <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/>
                        </svg>
          }
          cancelButtonClassName = {`flex justify-center items-center bg-night h-12 w-12 rounded-md`}
          cancelButtonContent = {
            <svg height="50%" viewBox="0 0 365.696 365.696" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
              <path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/>
            </svg>
          }
        />
                  <EdiText className="font-poppins font-normal px-2 text-lg md:text-xl"
          value={m.price + "$"}
          type="text"
          onSave={(p) => {
            const price = parseFloat(p)
            editMenuItem({variables: {price: price, menuId: m.id}})
          }}
          editing={menuPriceEditing}
          editButtonClassName= {`${menuEditingIcons} flex justify-center items-center bg-night h-6 w-6 sm:w-8 sm:w-8 rounded-md`}
          editButtonContent = {
          <svg height="50%" viewBox="0 0 492.49284 492" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
          <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
          </svg>
          }
          saveButtonClassName = {`flex justify-center items-center bg-night mr-2 h-12 w-12 rounded-md`}
          saveButtonContent = {
            <svg height="50%" viewBox="0 -46 417.81333 417" width="50%"  style={{fill: '#FA9269'}}  xmlns="http://www.w3.org/2000/svg">
                          <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/>
                        </svg>
          }
          cancelButtonClassName = {`flex justify-center items-center bg-night h-12 w-12 rounded-md`}
          cancelButtonContent = {
            <svg height="50%" viewBox="0 0 365.696 365.696" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
              <path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/>
            </svg>
          }
        /> 
                  </div>
                  <div className="absolute top-0 right-0 -mt-2 -mr-6">
                  <button data-menuediting={menuediting} className="menuediting flex items-center justify-center font-mulish font-bold text-md border-2 bg-coral h-12 w-12 text-center mx-4 leading-4 rounded-xl" onClick={()=> {deleteMenuItem({variables: {menuId: m.id}})}} >
                  <svg height="2rem" width="2rem" viewBox="-40 0 427 427.00131"xmlns="http://www.w3.org/2000/svg">
                <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/>
                </svg>
                </button>
                </div>
                  </div>
                  <div className="">
                    <EdiText className=" font-mulish font-semibold py-4 px-4 text-sm md:text-2xl"
          value={m.description}
          type="textarea"
          onSave={(d) => {
            editMenuItem({variables: {description: d, menuId: m.id}})
          }}
          editing={menuDescriptionEditing}
          editButtonClassName= {`${menuEditingIcons} flex justify-center items-center bg-night h-6 w-6 sm:w-8 sm:w-8 rounded-md`}
          editButtonContent = {
          <svg height="50%" viewBox="0 0 492.49284 492" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
          <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
          </svg>
          }
          saveButtonClassName = {`flex justify-center items-center bg-night mr-2 h-12 w-12 rounded-md`}
          saveButtonContent = {
            <svg height="50%" viewBox="0 -46 417.81333 417" width="50%"  style={{fill: '#FA9269'}}  xmlns="http://www.w3.org/2000/svg">
                          <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/>
                        </svg>
          }
          cancelButtonClassName = {`flex justify-center items-center bg-night h-12 w-12 rounded-md`}
          cancelButtonContent = {
            <svg height="50%" viewBox="0 0 365.696 365.696" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
              <path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/>
            </svg>
          }
        /> 
                    </div>
                  </div>

              ))
          }
          </div>
          <div className="flex justify-center sm:justify-start">
          <button className="flex justify-center items-center bg-night h-10 w-10 rounded-xl" onClick = {(e) => setDisplayMenuForm(!displayMenuForm)}>
          <svg height="20pt" viewBox="0 0 469.33333 469.33333" width="20pt" xmlns="http://www.w3.org/2000/svg"  style={{fill: '#FA9269'}}>
            <path d="m437.332031 192h-160v-160c0-17.664062-14.335937-32-32-32h-21.332031c-17.664062 0-32 14.335938-32 32v160h-160c-17.664062 0-32 14.335938-32 32v21.332031c0 17.664063 14.335938 32 32 32h160v160c0 17.664063 14.335938 32 32 32h21.332031c17.664063 0 32-14.335937 32-32v-160h160c17.664063 0 32-14.335937 32-32v-21.332031c0-17.664062-14.335937-32-32-32zm0 0"/>
          </svg>
          </button>
          <button className="flex justify-center items-center bg-night text-white font-mulish font-bold text-center text-lg ml-4 h-10 w-10 rounded-xl" onClick = {(e) => {
            if(!menuediting) {
              setMenuEditingIcons("");
              setmenuediting(true)} else {
                setMenuEditingIcons("hidden");
                setmenuediting(false)
            }
          }}>{menuediting ? (
            <svg height="20pt" viewBox="0 -46 417.81333 417" width="20pt"  style={{fill: '#FA9269'}}  xmlns="http://www.w3.org/2000/svg">
              <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0"/>
            </svg>
          ): (
            <svg height="20pt" viewBox="0 0 492.49284 492" width="20pt" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
              <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
              </svg>
          )}</button></div>
          <Menuform />

      </div>
        )
      }

      const toggleCoverPopup = () => {
        setIsCoverOpen(!isCoverOpen);
      };

const profile = data ? (
  <div className="block md:flex md:flex-row-reverse bg-white w-screen min-h-screen overflow-x-hidden">

    <div className="w-screen pl-0 md:pl-4 md:w-2/3">
      <div className="top-0 w-full relative">
      <img src={cover} className="w-full" alt={data.getProfile.title} />      
      <button onClick={toggleCoverPopup} data-profileediting={profileediting} className="profileediting absolute bottom-0 right-5 flex justify-center items-center bg-night h-8 w-8 md:h-16 md:w-16 rounded-lg md:rounded-2xl -mb-4">
              <svg height="60%" viewBox="0 0 492.49284 492" width="60%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
                            <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"/><path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"/>
              </svg>
              </button> {isCoverOpen && <Popup
                  content={<>
                  <Dropzone onDrop={ e => {
                      const [file] = e;
                      const reader = new FileReader();
                      if(file){
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        addCoverPicture({variables: {file: reader.result, username: data.getProfile.username}})}
                      };
                      reader.onerror = () => {
                          console.error('AHHHHHHHH!!');
                      }; 
                      setIsCoverOpen(false)
                    }}>
                      {({getRootProps, getInputProps}) => (
                            <section className= "cursor-pointer border-8 border-dashed border-coral w-full h-full rounded-xl">
                              <div {...getRootProps()} className="flex justify-center items-center  w-full h-full">
                                <input {...getInputProps()} />
                              <p className="font-poppins font-semibold text-xl sm:text-2xl text-center md:text-left">Drag 'n' drop some files here, or click to select files</p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </>}
                     handleClose={toggleCoverPopup}/>}
            </div>
      <div className="hidden md:block">
      <MenuComponent data={data}/> 
      </div>
    </div>

    <div className="w-screen md:w-1/3 pt-0 md:pt-32 px-4" >
    <ProfileComponent avatar={data.getProfile.avatar} title={data.getProfile.title} description={data.getProfile.description} />
        <TrucksComponent data={data} />
        <div className="block md:hidden">
      <MenuComponent data={data} className=""/> 
      </div>
    </div>
  </div>
  ) : ( 
  <div className="absolute flex h-screen w-screen justify-center items-center">
    <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">Loading...</h1>

  </div>
    )



  return profile
}