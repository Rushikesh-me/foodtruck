const { AuthenticationError, UserInputError } = require('apollo-server-express');
var cloudinary = require('cloudinary').v2
require('dotenv').config()

const Profile = require('../models/Profile');
const checkAuth = require('../../utils/check-auth');

const CLOUD_NAME = process.env.CLOUD_NAME
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET


module.exports = {
  Query: {
    async getProfiles() {
      try {
        const profiles = await Profile.find();
        return profiles;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getProfile(_, { username }) {
      try {
        const [profile] = await Profile.find({username: username});
        if (profile) {
          return profile;
        } else {
          throw new Error('Profile not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {

  async editProfile(_, { title, description }, context) {
    const user = checkAuth(context);


    if (title.trim() === '' && description.trim()=== '') {
      throw new UserInputError('Empty Input', {
        errors: {
          body: 'Input must not be empty'
        }
        });
    } 
    if (title.trim() !== '' && description.trim()=== ''){
    const [getProfile] = await Profile.find({username: user.username});
      if(getProfile) {
        getProfile.title = title;
        const profile = await getProfile.save();
        return true;
      }}
      if (title.trim() === '' && description.trim()!== ''){
  
        const [getProfile] = await Profile.find({username: user.username});
          if(getProfile) {
            getProfile.description = description;
            const profile = await getProfile.save();
            return true;
          }}
          if (title.trim() !== '' && description.trim() !== ''){
      
            const [getProfile] = await Profile.find({username: user.username});
              if(getProfile) {
                getProfile.title = title;
                getProfile.description = description;
                const profile = await getProfile.save();
                return true;
              }}
    
    },
    async addMenuItem(_, {item, price}, context){
      const user = checkAuth(context)
      const [getProfile] = await Profile.find({username: user.username});
      if(getProfile) {
        getProfile.menu.unshift({
          item,
          description: "Write something about your food",
          price
        });
        await getProfile.save();
        return true;
      } else {
        throw new Error('Profile not found');
      }
    },
    async editMenuItem(_, { item, price, description, menuId }, context) {
      const user = checkAuth(context);
      const [getProfile] = await Profile.find({username: user.username});
      console.log("in")
      if(getProfile){
        const menu = await getProfile.menu.find((m) => m.id===menuId);
        if(menu){
        if (item){
         menu.item= item
         await getProfile.save()
        }
        if (price){
          menu.price= price
          await getProfile.save()
         }
         if (description){
          menu.description= description
          await getProfile.save()
         }
         return true
      } else{
        throw new Error("Deleting Menu Failed")
      }
    }else{
      throw new Error("Please Login again")
    }}, 
    async updateMenuPicture(_, {file, menuId}, context){
      const user = checkAuth(context);
      const [getProfile] = await Profile.find({username: user.username});
      cloudinary.config({ 
        cloud_name: CLOUD_NAME, 
        api_key: API_KEY, 
        api_secret: API_SECRET 
      });
      try{
        const menuUploadResponse = await cloudinary.uploader.upload(file , 
          {resource_type: "image", public_id: `foodtruck/menu/items/${menuId}`, invalidate: true,
          overwrite: true, crop: 'fill' ,height: '500', width: '500', quality: 'auto', format: 'png'});
          const uri = await menuUploadResponse.url
          
          if(getProfile){
            const menu = await getProfile.menu.find((m) => m.id===menuId);
            if(menu){
            menu.picture = uri;
            await getProfile.save();
            return true;
            }
      } else {
        throw new Error("Please Login Again");
      }
    } catch (err) {
      throw new Error(err)
    }
      
    },
    async deleteMenuItem(_, {menuId}, context){
      const user = checkAuth(context)
      const [getProfile] = await Profile.find({username: user.username});
      if(getProfile) {
        const menuIndex = getProfile.menu.findIndex((c) => c.id === menuId);

          getProfile.menu.splice(menuIndex, 1);
          await getProfile.save();
          return true;
      } else {
        throw new Error('Profile not found');
      
      }
    },
    async updateAvatar(_, {file, publicId}, context){
      const user = checkAuth(context);
      const [getProfile] = await Profile.find({username: user.username});

      await cloudinary.config({ 
        cloud_name: CLOUD_NAME, 
        api_key: API_KEY, 
        api_secret: API_SECRET  
      });
      try {
        const uploadResponse = await cloudinary.uploader.upload(file , 
          {resource_type: "image", public_id: `foodtruck/avatars/${publicId}`, invalidate: true,
          overwrite: true, crop:'fill', height: '300', width: '300', quality: 'auto', gravity: 'auto', format: 'png'});
          console.log(uploadResponse);
          const uri = await uploadResponse.url
          
          if(getProfile) {
            getProfile.avatar = uri;
            const profile = await getProfile.save();
            return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
        return false;
    }
      
    },


    async updateCoverPicture(_, {file, username}, context){
      const user = checkAuth(context);
      const [getProfile] = await Profile.find({username: user.username});

      await cloudinary.config({ 
        cloud_name: CLOUD_NAME, 
        api_key: API_KEY, 
        api_secret: API_SECRET  
      });
      try {
        const uploadResponse = await cloudinary.uploader.upload(file , 
          {resource_type: "image", public_id: `foodtruck/covers/${username}`, invalidate: true,
          overwrite: true, crop: "fill", aspect_ratio:"2:1", quality: 'auto',  format: 'png'});
          console.log(uploadResponse);
          const uri = await uploadResponse.url
          
          if(getProfile) {
            getProfile.cover = uri;
            const profile = await getProfile.save();
            return true;
      } else {
        throw new Error("Invalid Request. Please try again")
      }
    } catch (err) {
      throw new Error("Please Login Again")
    }
      
    }
}
}