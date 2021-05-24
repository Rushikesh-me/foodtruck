const { model, Schema } = require('mongoose');

const profileSchema = new Schema({
    username: String,
    createdAt: String,
    title: String,
    description: String,
    avatar: String,
    cover: String,
    trucks: [
      {
        vehicleNo: String,
        username: String,
        status: Boolean,
        location: [
          {
            username: String,
            latitude: Number,
            longitude: Number
          }
        ]
      }
    ],
      menu: [
        {
          item: String,
          price: Number,
          description: String,
          category: String,
          picture: String,
        }
      ],
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
  });
  
  module.exports = model('Profile', profileSchema);