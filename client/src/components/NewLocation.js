import React from 'react';
import './App.css';
import {useMutation} from '@apollo/client';
import queries from '../queries';

function NewLocation() {

  const [addLocation] = useMutation(queries.UPLOAD_LOCATION
    // , {
    // update(cache, {data: {addLocation}}) {
    //   const {userPostedLocations} = cache.readQuery({
    //     query: queries.GET_USERPOSTED_LOCATIONS
    //   });
    //   cache.writeQuery({
    //     query: queries.GET_USERPOSTED_LOCATIONS,
    //     data: {userPostedLocations: userPostedLocations.concat([addLocation])}
    //   });
    // }
  // }
  );

  let image;
  let address;
  let name;

  return (
    <div>
      <div>
        <h5>NewLocation</h5>
        <form className='form' id='add-employee'
          onSubmit={(e) => {
            e.preventDefault();
            addLocation({
              variables: {
                image: image.value,
                address: address.value,
                name: name.value
              }
            });
            image.value = '';
            address.value = '';
            name.value = '';
            alert('Locations Added');
          }}
        >
        <div className='form-group'>
          <label>
            name:
            <br />
            <input
              ref={(node) => {
                name = node;
              }}
              required
              autoFocus={true}
            />
          </label>
        </div>
        <br />
        <div className='form-group'>
          <label>
            Address:
            <br />
            <input
              ref={(node) => {
                address = node;
              }}
              required
            />
          </label>
        </div>
        <br />

        <div className='form-group'>
          <label>
            image:
            <br />
            <input
              ref={(node) => {
                image = node;
              }}
              required
            />
          </label>
        </div>

        <br />
        <br />
        <button className='button add-button' type='submit'>
          Add Location
        </button>
      </form>
      </div>
    </div>
  );
}

export default NewLocation;