import './App.css';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
import noImage from '../images/download.jpeg';

const MyLikes = (props) => {
  const {loading, error, data} = useQuery(queries.GET_LIKED_LOCATIONS, {fetchPolicy: 'cache-and-network'});

  const [updateLocation] = useMutation(queries.UPDATE_LOCATION
     , {
     update(cache, {data: {updateLocation}}) {
       const {likedLocations} = cache.readQuery({
         query: queries.GET_LIKED_LOCATIONS
       });
       cache.writeQuery({
         query: queries.GET_LIKED_LOCATIONS,
         data: {likedLocations: likedLocations.filter((e) => e.id !== updateLocation.id)}
       });
     }
   }
  );

  if (data) {
    const {likedLocations} = data;
    console.log('>>',likedLocations)
    return (
      <div>
        <br />

        {likedLocations.map((location) => {
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

export default MyLikes;