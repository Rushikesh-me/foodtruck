import gql from 'graphql-tag';

export const GET_PROFILE_QUERY = gql`
query($username: String!){
  getProfile(username: $username) {
    id
    username
    title
    description
    avatar
    cover
    trucks{
        id
        vehicleNo
        username
        location{
            username
            latitude
            longitude
        }
        status
    }
    menu{
        id
        item
        price
        picture
        category
        description
    }
    
  }
}
`;

export const FETCH_LOCATIONS_QUERY = gql`
query GetLocation{
  getLocation{
    username
    latitude
    longitude
  }
}
`


export const FETCH_PROFILES_QUERY = gql`
query FetchProfiles{
  getProfiles{
    username
    id
    avatar
    cover
    username
    title
    description
    trucks{
        id
        vehicleNo
        username
        location{
            username
            latitude
            longitude
        }
        status
    }
    menu{
        id
        item
        price
        picture
        category
        description
    }
   
  }
}
`

export const UPDATE_AVATAR = gql `
mutation($file: Upload!, $publicId: String!){
updateAvatar(file: $file, publicId: $publicId)}
`;

export const UPDATE_COVER_PICTURE = gql `
mutation($file: Upload!, $username: String!){
updateCoverPicture(file: $file, username: $username)}
`;

export const UPDATE_TEXT = gql `
mutation($title: String, $description: String){
editProfile(title: $title, description: $description)}
`;
export const UPDATE_LOCATION = gql `
mutation($latitude: Float!, $longitude: Float!, $truckId: ID!){
updateLocation(latitude: $latitude, longitude: $longitude, truckId: $truckId)}
`;
export const UPDATE_STATUS = gql `
mutation($status: Boolean!, $truckId: ID!){
updateStatus(status: $status, truckId: $truckId)}
`;
export const ADD_TRUCK = gql `
mutation($vehicleNo: String!){
addTrucks(vehicleNo: $vehicleNo)}
`;
export const DELETE_TRUCK = gql `
mutation($truckId: ID!){
deleteTruck(truckId: $truckId)}
`;
export const ADD_MENU_ITEM = gql `
mutation( $item: String, $price: Float){
addMenuItem(item: $item, price: $price )}
`;
export const DELETE_MENU_ITEM = gql `
mutation($menuId: ID!){
deleteMenuItem(menuId: $menuId)}
`;

export const UPDATE_MENU_PICTURE = gql `
mutation($file: Upload!, $menuId: ID!){
updateMenuPicture(file: $file, menuId: $menuId)}
`;

export const EDIT_MENU_ITEM = gql `
mutation($item: String, $price: Float, $description: String, $menuId: ID!){
editMenuItem(item: $item, price: $price, description: $description, menuId: $menuId)}
`;