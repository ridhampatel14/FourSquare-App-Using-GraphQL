import './App.css';
import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
import noImage from '../images/download.jpeg';


const Home = (props) => {
  const [pageNum, setPageNum] = useState(1);
  const {loading, error, data, refetch} = useQuery(queries.GET_LOCATIONPOSTS, {fetchPolicy: 'cache-and-network', variables: {pageNum: pageNum}});

  useEffect(() => {
    refetch({ pageNum });
  }, [pageNum, refetch]);

  const [updateLocation] = useMutation(queries.UPDATE_LOCATION
     , {
     update(cache, {data: {updateLocation}}) {
       const {locationPosts} = cache.readQuery({
         query: queries.GET_LOCATIONPOSTS,
         variables: {pageNum: pageNum},
       });
       cache.writeQuery({
         query: queries.GET_LOCATIONPOSTS,
         variables: {pageNum: pageNum},
         data: {locationPosts: locationPosts}
       });
     }
   }
  );

  if (data) {
    const {locationPosts} = data;
    console.log('>>',locationPosts)
    return (
      <div>
        <br />

        {locationPosts.map((location) => {
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
        <button
          className='button'
          onClick={() => {
            setPageNum(pageNum+1)
            alert('more Location added');
          }
        }>
          Get More
        </button>
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default Home;