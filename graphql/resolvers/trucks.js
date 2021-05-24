const { AuthenticationError, UserInputError } = require('apollo-server-express');

const Profile = require('../models/Profile');
const checkAuth = require('../../utils/check-auth');
const { findById } = require('../models/Profile');
const { getLocation } = require('graphql');
const { get } = require('mongoose');

module.exports = {
    Query: {
        async getTrucks() {
            try {
              const profiles = await Profile.find();
              const trucks = [];
              profiles.forEach((e)=> {
                  const data = e.trucks;
                  data.forEach((i) => { 
                      trucks.push(i);
                  });
              });
              return trucks;
            } catch (err) {
              throw new Error(err);
            }
          },
          async getLocation() {
            try {
                const profiles = await Profile.find();
                const locations = [];
                profiles.forEach((e)=> {
                    const data = e.trucks;
                    data.forEach((i) => { 
                        const [location] = i.location;
                        if(location) {
                        locations.push(location);
                        }
                    });
                });
                return locations;
              } catch (err) {
                throw new Error(err);
              }
              }
    },
    Mutation: {
        async addTrucks(_, {vehicleNo}, context) {
            const user = checkAuth(context)
            const [getProfile] = await Profile.find({username: user.username});
            if(getProfile) {
              getProfile.trucks.unshift({
                vehicleNo,
                username: user.username
              });
              await getProfile.save();
              return true;
            }
            
        },
        async deleteTruck(_, {truckId}, context) {
            const user = checkAuth(context);
            const [getProfile] = await Profile.find({username: user.username});
            if(getProfile){
                const truck = getProfile.trucks.find((truck) => truck.id === truckId);
                if(truck){                   
                const truckIndex = getProfile.trucks.findIndex((e) => e.id === truckId)
                
                        await getProfile.trucks.splice(truckIndex,1)
                        await getProfile.save();
                        return true;
                    } else{
                        throw new Error('Truck doesnot Exist');
                    }
            } else {
                throw new UserInputError('Profile not found');
            }            
        },
        async updateLocation(_, {latitude, longitude, truckId}, context) {
            const user = checkAuth(context);
            console.log("Updated");
            const [getProfile] = await Profile.find({username: user.username});
            if(getProfile){                    
                const truck = getProfile.trucks.find((truck) => truck.id === truckId);
                if (truck) {
                    truck.location.splice(0,1,{
                        latitude,
                        longitude,
                        username: user.username
                    });
                    await getProfile.save();
                    return true;
                } else {
                    throw new UserInputError('Truck doesnot exist');
                }
            } else {
                throw new UserInputError('Profile not found');
            }            
        },
        async updateStatus(_, {status, truckId}, context) {
            const user = checkAuth(context);
            console.log("Status Updated");
            const [getProfile] = await Profile.find({username: user.username});
            if(getProfile){                    
                const truck = getProfile.trucks.find((truck) => truck.id === truckId);
                if (truck) {
                    truck.status = status;
                    await getProfile.save();
                    return true;
                } else {
                    throw new UserInputError('Truck doesnot exist');
                }
            } else {
                throw new UserInputError('Profile not found');
            }            
        },
    }
}