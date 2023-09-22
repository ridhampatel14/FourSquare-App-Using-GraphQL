import {gql} from '@apollo/client';


const GET_USERPOSTED_LOCATIONS = gql`
query  {
    userPostedLocations {
      address
      id
      image
      liked
      name
      userPosted
    }
  }
`;

const UPLOAD_LOCATION = gql`
mutation UploadLocation($image: String!, $address: String, $name: String) {
    uploadLocation(image: $image, address: $address, name: $name) {
      id
      address
      image
      liked
      userPosted
      name
    }
  }
`;

const UPDATE_LOCATION= gql`
mutation UpdateLocation($updateLocationId: ID!, $image: String, $name: String, $address: String, $userPosted: Boolean, $liked: Boolean) {
    updateLocation(id: $updateLocationId, image: $image, name: $name, address: $address, userPosted: $userPosted, liked: $liked) {
      userPosted
      name
      image
      id
      liked
      address
    }
  }
`;

const DELETE_LOCATION= gql`
mutation DeleteLocation($deleteLocationId: ID!) {
    deleteLocation(id: $deleteLocationId) {
      address
      id
      image
      liked
      userPosted
      name
    }
  }
`;

const GET_LIKED_LOCATIONS= gql`
query  {
    likedLocations {
      address
      id
      image
      liked
      name
      userPosted
    }
  }
`;

const GET_LOCATIONPOSTS= gql`
query LocationPosts($pageNum: Int) {
  locationPosts(pageNum: $pageNum) {
    address
    id
    image
    liked
    name
    userPosted
  }
}
`;


let exported = {
    GET_USERPOSTED_LOCATIONS,
    UPLOAD_LOCATION,
    UPDATE_LOCATION,
    DELETE_LOCATION,
    GET_LIKED_LOCATIONS,
    GET_LOCATIONPOSTS,
  };
  
  export default exported;