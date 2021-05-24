import React, { useEffect, useState } from 'react';
import { useQuery} from '@apollo/react-hooks';
import ReactMapGL, { Marker, WebMercatorViewport} from 'react-map-gl'
import {motion} from 'framer-motion'

import {GET_PROFILE_QUERY} from '../util/graphql'


function GetAvatar({username}) {
  const {
    data  } = useQuery(GET_PROFILE_QUERY, {
    variables: {
      username
    }
  });
  const avatar = data.getProfile.avatar ? (
  <>
   
  <img src={data.getProfile.avatar} className="transform -rotate-45 h-8 w-8 sm:h-12 sm:w-12 rounded-full" alt={data.getProfile.title}/>
  </>) : (
    <>
      <img src="https://res.cloudinary.com/rushed21/image/upload/v1621689254/foodtruck/avatars/avatar.png" className="transform -rotate-45 h-8 w-8 sm:h-12 sm:w-12 rounded-full" alt={data.getProfile.title}/>

    </>
  )
  return avatar;
}

export function DisplayProfile({username}) {
  const {
    loading,
    error,
    data
  } = useQuery(GET_PROFILE_QUERY, {
    variables: {
      username
    }
  });
  const [viewport, setViewport] = useState({
    latitude: 37.774929,
    longitude: -122.419416,
      width: '100%',
      height: '50vh',
      zoom: 13
  })
  // eslint-disable-next-line
  const latitudePoint = [];
  const longitudePoint = [];
  const locations = [];

  const [mapHeight, setMapHeight] = useState('60vh')

  const [avatar, setAvatar] = useState("https://res.cloudinary.com/rushed21/image/upload/v1621689254/foodtruck/avatars/avatar.png")
  const [cover, setCover] = useState("https://res.cloudinary.com/rushed21/image/upload/v1621762831/foodtruck/covers/cover.png")


  useEffect(() => {
    const loadingScreen = () => {
      return(
        <div className="absolute flex h-screen w-screen justify-center items-center">
              <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">Loading...</h1>
          </div>
      )
    }
    loadingScreen()      
  }, [loading])

  useEffect(() => {
    const errorScreen = () => {
      return(
        <div className="absolute flex h-screen w-screen justify-center items-center">
              <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">An error occured. Please refresh and login again.</h1>
          </div>
      )
    }
    errorScreen()      
  }, [error])


  useEffect(() => {
    if(data && data.getProfile.avatar){
      setAvatar(data.getProfile.avatar)
    }
    if(data && data.getProfile.cover){
      setCover(data.getProfile.cover)
    }
  },[data])


///Show trucks component///

  useEffect(() => {
      if(data && locations[0] ){
    const applyToArray = (func, array) => func.apply(Math, array);
    const getBoundsForPoints = () => {

    const cornersLongLat = [
      [applyToArray(Math.min, longitudePoint), applyToArray(Math.min, latitudePoint)],
      [applyToArray(Math.max, longitudePoint), applyToArray(Math.max, latitudePoint)]
    ]
    if (cornersLongLat[0][0]===cornersLongLat[1][0] && cornersLongLat[0][1]===cornersLongLat[1][1] ){
        return {longitude:cornersLongLat[0][0] , latitude:cornersLongLat[0][1] , zoom: 15}
    } else {
    const view = new WebMercatorViewport({height: 450, width: 250})
      .fitBounds(cornersLongLat, { padding: {top: 120, bottom:20, left: 10, right:10 }})
    const { longitude, latitude, zoom } = view
    return { longitude, latitude, zoom }}
    }
    const bounds = getBoundsForPoints();
     if (window.innerWidth <=450){ 
       setMapHeight(window.innerHeight*0.4) 
      } else if(window.innerWidth >=450){
        setMapHeight(window.innerHeight*0.6) 
      } 
  
    setViewport({
    latitude: bounds.latitude,
    longitude: bounds.longitude,
      width: '100hw',
      height: mapHeight,
      zoom: bounds.zoom
      
        })
      
        
        function updateSize() {
          setViewport({
            latitude: bounds.latitude,
            longitude:  bounds.longitude,
            width: '100%', 
            height: mapHeight,
            zoom: bounds.zoom
          })
          
        }
        window.addEventListener('resize', updateSize);
        updateSize();
      }
  }, [data])
  

  if(data){
        const trucks = data.getProfile.trucks;
        trucks.forEach(e => {
            const [location] = e.location;
            if (location) {
              locations.push(location)
              latitudePoint.push(location.latitude)
              longitudePoint.push(location.longitude)
            }
        });
        
      } else {
            console.log(error)
        }


  ///profile details component///
  function ProfileComponent({title, description}){
    
   const profilecomp = (
    <div className="block -mt-8 md:m-0" >
    <div className="md:flex items-center relative">
    <div className="w-auto md:w-2/5 flex justify-center md:justify-start relative">
          <img src={avatar} className="h-20 w-20 sm:h-32 sm:w-32 xl:h-40 xl:w-40 rounded-2xl sm:rounded-3xl" alt="food truck avatar"/>  
      </div>
      <div className="pb-0 md:pb-8 md:pl-4 w-full md:w-4/5 text-center md:text-left">
            <div className="flex w-full justify-center md:justify-start pt-4 md:p-0">
      <h2 className="font-poppins font-bold text-xl sm:text-3xl text-center md:text-left">{title}</h2>
      </div></div></div>
    <p className="font-mulish pt-4 font-light text-sm text-center md:text-left  md:text-md">{description}</p>
    </div>
    )

    return profilecomp;
  }


  ///menu items component///

  function MenuComponent ({data}) {

    return(
      <div className="pt-14">
      <h1 className="font-poppins font-bold mb-16 text-3xl text-center sm:text-left md:text-4xl"> Menu Card </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 my-4 px-0 md:pr-8">
      {
          data.getProfile.menu.map( (m) => (
            <div className="relative bg-blush py-3 my-4 rounded-2xl" key={m.id}>
              <div className="flex items-center" >
                <div className="relative -mt-16 ml-2 rounded-3xl">
                <img src={m.picture} className="h-32 w-32 md:h-40 md:w-40 rounded-3xl" alt={m.item}/>
                </div>
                <div className="pl-2">
              <h2 className="font-poppins font-semibold px-2 text-xl md:text-3xl" >{m.item}</h2>
             
              <h2 className="font-poppins font-normal px-2 text-lg md:text-xl" >{m.price} $</h2>
              </div>
              </div>
              <div className="">
                <h2 className="font-mulish font-semibold py-4 px-4 text-sm md:text-2xl" >{m.description}</h2>
                </div>
              </div>

          ))
      }
      </div>
  </div>
    )
  }


  const profile = data ? (
      
    <div className="block md:flex md:flex-row-reverse bg-white w-screen min-h-screen">

    <div className="w-screen pl-0 md:pl-4 md:w-2/3">
      <div className="top-0 w-full relative">
      <img src={cover} className="w-full" alt={`${data.getProfile.title} cover`} />      
            </div>
      <div className="hidden md:block">
      <MenuComponent data={data}/> 
      </div>
    </div>

    <div className="w-screen md:w-1/3 pt-0 md:pt-32 px-4" >
    <ProfileComponent title={data.getProfile.title} description={data.getProfile.description} />
    <div className="border-2 rounded-2xl sm:rounded-3xl my-8" >
          <ReactMapGL className="rounded-2xl sm:rounded-3xl"
          {...viewport}
          mapboxApiAccessToken= "pk.eyJ1IjoicnVzaC1lZDIxIiwiYSI6ImNrbjRxNXAwZzA1N3cyb3A4c2F2MmlnZG0ifQ.K6KGGGamSWI5txuvA_3RRw"
            mapStyle="mapbox://styles/rush-ed21/ckob2pyvy0h3i18oafq9fu4up" 
            onViewportChange={viewport => {
              setViewport(viewport);
            }}>
                { locations.map( x => (
              <Marker
              key= {x.longitude}
              latitude = {x.latitude}
              longitude={x.longitude}
              > <a href={`https://www.google.com/maps/dir/?api=1&destination=${x.latitude},${x.longitude}`}>               
                 <div className="rounded-tl-full rounded-tr-full rounded-bl-full 
                 transform -translate-x-full -translate-y-full origin-bottom-right rotate-45"
                 >
                      <div className="border-4 bg-night rounded-tl-full rounded-tr-full rounded-bl-full 
                 transform">
                   <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}>
                   <GetAvatar username={x.username} />
                    </motion.div>
                        </div>
                </div>
                </a>
            </Marker>))}
            </ReactMapGL>
      </div>
     
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

