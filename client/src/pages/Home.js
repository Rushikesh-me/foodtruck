import React, { useState, useEffect, lazy, Suspense} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { NavigationControl, Marker} from "react-map-gl";
import mapboxgl from "mapbox-gl";
import {motion} from 'framer-motion';

import {FETCH_PROFILES_QUERY, GET_PROFILE_QUERY} from '../util/graphql'
import { Link } from 'react-router-dom';

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
const ReactMapGL = lazy(() => import ('react-map-gl'))


function GetAvatar({username}) {
  const { data  } = useQuery(GET_PROFILE_QUERY, {
    variables: {
      username
    }
  });
  const avatar = data ? (
  <>
   
  <img src={data.getProfile.avatar} className="transform -rotate-45 h-12 w-12 rounded-full" alt="Food Truck Marker"/>
  </>) : (
    <>
    <img src="https://res.cloudinary.com/rushed21/image/upload/v1621689254/foodtruck/avatars/avatar.png" className="transform -rotate-45 h-12 w-12 rounded-full" alt="Food Truck Marker"/>
    </>
  )
  return avatar;
}

function Home() {
  const location = [];
  const truck = []
  const [markerState, setMarkerState] = useState(false);
  const [markerProfile, setMarkerProfile] = useState();
  const [markerLoc, setMarkerLoc] = useState();
  const [vehicleNumber, setVehicleNumber] = useState("");
  
    const [viewport, setViewport] = useState({
      latitude: 19.075983,
      longitude: 72.877655,
      width: window.innerWidth, 
      height: window.innerHeight,
      zoom: 13
    });

    const [userViewport, setUserViewport] = useState({})

  useEffect(() => {
    function updateSize() {
      setViewport({
        latitude: viewport.latitude,
        longitude:  viewport.longitude,
        width: window.innerWidth, 
        height: window.innerHeight,
        zoom: 13
      })

    }
    window.addEventListener('resize', updateSize);
    updateSize();
  },[ window.innerWidth, window.innerHeight] );

  useEffect(() => {
    navigator.geolocation.watchPosition(sucessLocation, errorLocation, { enableHighAccuracy: true})
    function sucessLocation(position){
      if(position){
        console.log(position)
      setUserViewport({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        width: window.innerWidth, 
        height: window.innerHeight,
        zoom: 13
      })}
    }
   function errorLocation() {
      console.log("Error getting location. Pleas allow website to use your location")
    }
  })
  const {
    loading,
    error,
    data
  } = useQuery(FETCH_PROFILES_QUERY);

////////////////////  Display Truck Info of Selected Marker///////////

const getMarkerProfile = async (markerClick) => {

    if(data && markerClick){
      const dataObj = await data.getProfiles;
      dataObj.forEach((d) => {
          if (d.username === markerClick.username){
            setMarkerProfile(d)
          }
        }) 
        truck.map((e) =>{
        const [loc] = e.location
          if(loc.latitude === markerClick.latitude){
            setVehicleNumber(e.vehicleNo)
          }
        })
   
    }
  }
function DisplayTab() {
      

 const displayProfile = markerState && markerProfile ? (
  <div className="absolute bottom-0 md:bottom-25 md:left-5 w-screen md:w-1/3 xl:w-96  p-2 sm:px-32 md:p-4 bg-coral z-30 rounded-3xl">
    <div className="flex justify-center -mt-12"> <img src={markerProfile.avatar} className=" h-24 w-24 rounded-3xl" alt={markerProfile.title} />  </div>
    <h2 className="font-poppins font-extrabold text-lg text-center md:text-2xl subpixel-antialiased">{markerProfile.title}</h2>
    <div className="flex justify-center px-8">
    <h3 className="font-mulish font-light text-sm text-center px-2 sm:px-4 subpixel-antialiased">@{markerProfile.username}</h3>
    <h3 className="font-mulish font-light text-sm text-center px-2 sm:px-4 subpixel-antialiased">{vehicleNumber}</h3>
    </div>
    
    <p className="font-mulish font-normal pt-4 text-sm text-center md:text-md subpixel-antialiased">"{markerProfile.description}"</p>
    <div className="flex justify-center px-2 pt-4">
    <motion.p className="bg-night text-white font-mulish font-normal text-center text-base w-24 py-2 mx-1 my-2 rounded-xl z-40"  whileHover={{ scale: 1.1 }} whileFocus={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => {setMarkerState(false)}}>Cancel</motion.p>
    <Link to={`/profile/${markerProfile.username}`}><motion.p className="bg-night text-white font-mulish font-normal text-center text-base w-24 py-2 mx-1 my-2 rounded-xl z-40"  whileHover={{ scale: 1.1 }} whileFocus={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>Profile</motion.p></Link>
    <a href={`https://www.google.com/maps/dir/?api=1&destination=${markerLoc.latitude},${markerLoc.longitude}`}><motion.p className="bg-night text-white font-mulish font-normal text-center text-base w-24 py-2 mx-1 my-2 rounded-xl z-40"  whileHover={{ scale: 1.1 }} whileFocus={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>Directions</motion.p></a>
    </div>
  </div>
 ) : (<></>)
 return displayProfile;
}



  


//////////////Get Locations of Trucks////////////////////
 
      if (loading) {
        return (
          <div className="absolute flex h-screen w-screen justify-center items-center">
          <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">Loading...</h1>
      
        </div>
          )
      } else if(data){
        const dataObj = data.getProfiles;
        dataObj.map(p => {
          const trucks = p.trucks;
          trucks.forEach(t => {
            const [locationObj] = t.location;
            if(locationObj && t.status){
              location.push(locationObj)
              truck.push(t)
            }
          });
        })
    } else if(error){
        return <h1>{error}</h1>
      }








//////////////// Handle Map Viewports///////////////

  
  const getmyLocation = async (e) => {setViewport({
    latitude: userViewport.latitude,
        longitude: userViewport.longitude,
        width: window.innerWidth, 
        height: window.innerHeight,
        zoom: 13
  })}
  
  
  

  
   
    return (
      <div className="top-0 left-0 z-0">

            <div className="h-screen w-screen">
            <div className="bg-gradient-to-b from-night30 via-transparent pointer-events-none"></div>
            <Suspense fallback={
          <div className="absolute flex h-screen w-screen justify-center items-center">
          <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">Loading...</h1>
          </div>}>
           <ReactMapGL
            {...viewport}
            mapboxApiAccessToken= "pk.eyJ1IjoicnVzaC1lZDIxIiwiYSI6ImNrbjRxNXAwZzA1N3cyb3A4c2F2MmlnZG0ifQ.K6KGGGamSWI5txuvA_3RRw"
            mapStyle="mapbox://styles/rush-ed21/ckob2pyvy0h3i18oafq9fu4up"
            onViewportChange={viewport => {
              setViewport(viewport);
            }}>
              <div className="absolute bottom-70 md:bottom-25 right-0 sm:right-2.5 w-20 h-20 py-12 pl-6 sm:p-24 z-50">
            <button type = "button" onClick={() => {getmyLocation()}} className="flex justify-center items-center p-1 sm:p-0 h-10 w-10 sm:h-16 sm:w-16 rounded-lg  sm:rounded-2xl bg-coral">
            <svg height="3rem" viewBox="0 0 512.001 512" width="3rem" xmlns="http://www.w3.org/2000/svg"><path d="m255.863281 168.699219c-48.046875 0-87.140625 39.09375-87.140625 87.144531 0 48.046875 39.09375 87.140625 87.140625 87.140625 48.050781 0 87.144531-39.09375 87.144531-87.140625 0-48.050781-39.09375-87.144531-87.144531-87.144531zm0 0"/><path d="m497.003906 240.84375h-55.054687c-7.269531-91.003906-80.082031-163.820312-171.089844-171.085938v-54.761718c0-8.28125-6.714844-14.996094-14.996094-14.996094s-14.996093 6.714844-14.996093 14.996094v54.761718c-91.007813 7.265626-163.820313 80.082032-171.089844 171.085938h-54.78125c-8.28125 0-14.996094 6.714844-14.996094 15 0 8.28125 6.714844 14.996094 14.996094 14.996094h54.78125c7.269531 91.003906 80.082031 163.820312 171.089844 171.089844v54.757812c0 8.28125 6.714843 14.996094 14.996093 14.996094 8.285157 0 14.996094-6.714844 14.996094-14.996094v-54.757812c91.007813-7.269532 163.824219-80.085938 171.089844-171.089844h55.054687c8.28125 0 14.996094-6.714844 14.996094-14.996094 0-8.285156-6.714844-15-14.996094-15zm-241.140625 171.695312c-86.402343 0-156.695312-70.296874-156.695312-156.695312 0-86.402344 70.292969-156.699219 156.695312-156.699219 86.402344 0 156.695313 70.296875 156.695313 156.699219 0 86.398438-70.292969 156.695312-156.695313 156.695312zm0 0"/></svg>
            </button>
            <NavigationControl showCompass = {false}/>
              </div>


            {location.map( x => (
              <Marker
              key= {`${x.username} and ${x.latitude} and ${x.status}`}
              latitude = {x.latitude}
              longitude={x.longitude}
              onClick = {() => {
                getMarkerProfile(x);
                setMarkerState(true);
                setMarkerLoc(x)
              }}>


                 <div className="rounded-tl-full rounded-tr-full rounded-bl-full 
                 transform -translate-x-full -translate-y-full origin-bottom-right rotate-45"
                 >
                      <div className="border-4 bg-night rounded-tl-full rounded-tr-full rounded-bl-full 
                 transform m-0.5">
                   <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}>
                   <GetAvatar username={x.username} />
                   </motion.div>
                        </div>
                </div>


            </Marker>))}
{/* )} */}

              </ReactMapGL>
              </Suspense>
              </div>
              <DisplayTab />            
        </div>
    )

  } 


export default Home;
