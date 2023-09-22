
import './App.css';
import React from 'react';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
import noImage from '../images/download.jpeg';

const MyLocations = (props) => {

  const {loading, error, data} = useQuery(queries.GET_USERPOSTED_LOCATIONS, {fetchPolicy: 'cache-and-network'});

  const [updateLocation] = useMutation(queries.UPDATE_LOCATION
  //   , {
  //   update(cache, {data: {updateLocation}}) {
  //     const {userPostedLocations} = cache.readQuery({
  //       query: queries.GET_USERPOSTED_LOCATIONS
  //     });
  //     cache.writeQuery({
  //       query: queries.GET_USERPOSTED_LOCATIONS,
  //       data: {userPostedLocations: userPostedLocations}
  //     });
  //   }
  // }
  );

  const [deleteLocation] = useMutation(queries.DELETE_LOCATION
  , {
    update(cache, {data: {deleteLocation}}) {
      const {userPostedLocations} = cache.readQuery({
        query: queries.GET_USERPOSTED_LOCATIONS
      });
      console.log('-->',userPostedLocations)
      cache.writeQuery({
        query: queries.GET_USERPOSTED_LOCATIONS,
        data: {userPostedLocations: userPostedLocations.filter((e) => e.id !== deleteLocation.id)}
      });
    }
  }
  );



  if (data) {
    const {userPostedLocations} = data;
    //console.log('>>',userPostedLocations)
    return (
      <div>
        <br />

        {userPostedLocations.map((location) => {
          return (
            <div className='card' key={location.id}>
              <div className='card-body'>
              <img src={location.image.length > 0 ? location.image : noImage} alt="location" className="image"/>
                <h5 className='card-title'>
                  {location.name}<br/>
                  {location.address}<br/>
                </h5>
                <br />
                {location.liked === false ? 
                  <button
                    className='button'
                    onClick={() => {
                      updateLocation({
                        variables: {
                          "updateLocationId": location.id,
                          "image": location.image,
                          "name": location.name,
                          "address": location.address,
                          "liked": true,
                          "userPosted": location.userPosted
                        }
                      });
                      alert('Location Liked');
                    }}
                  >
                    Like
                  </button> 
                  : 
                  <button
                    className='button'
                    onClick={() => {
                      updateLocation({
                        variables: {
                          "updateLocationId": location.id,
                          "image": location.image,
                          "name": location.name,
                          "address": location.address,
                          "liked": false,
                          "userPosted": location.userPosted
                        }
                      });
                      alert('Location DisLiked');
                    }}
                  >
                    DisLike
                  </button>}
                  <br/>
                  <br></br>
                  <button
                    className='button'
                    onClick={() => {
                      deleteLocation({
                        variables : {
                          "deleteLocationId": location.id
                        }
                      });
                      alert('Location Deleted');
                    }}
                  >
                    Delete
                  </button>
                <br />
              </div>
            </div>
          );
        })}
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default MyLocations;