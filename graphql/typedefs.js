const { gql } = require('apollo-server-express')

module.exports = gql`
    type Location{
        username: String
        latitude: Float
        longitude: Float
    }
    type Truck {
        id: ID!
        vehicleNo: String!
        username: String!
        location: [Location]
        status: Boolean
    }
    type Menu{
        id: ID!
        item: String
        description: String
        price: Float
        picture: String
        category: String
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String
        status: Boolean!,
    }
    type Profile {
        id: ID!
        username: String!
        title: String
        avatar: String
        cover: String
        description: String
        trucks: [Truck]
        menu: [Menu]
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
    getProfiles: [Profile]
    getProfile(username: String!): Profile 
    getTrucks: [Truck]
    getLocation: [Location]
    }    
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        authenticateUser(token:String): Boolean!
        editProfile(title: String, description: String): Boolean
        addMenuItem( item: String, price: Float, category: String ): Boolean
        editMenuItem( item: String, price:Float, description: String, menuId:ID!): Boolean
        deleteMenuItem(menuId: ID!): Boolean
        addTrucks(vehicleNo: String!): Boolean
        deleteTruck(truckId: ID!): Boolean
        updateLocation(latitude: Float!, longitude: Float!, truckId: ID!): Boolean
        updateMenuPicture(file: Upload!, menuId: ID): Boolean
        updateAvatar(file: Upload!, publicId: String!): Boolean
        updateCoverPicture(file: Upload!, username: String!): Boolean
        updateStatus(status: Boolean!, truckId: ID!) : Boolean
    }
`;