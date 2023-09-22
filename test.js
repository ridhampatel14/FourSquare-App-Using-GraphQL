import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => {});


// async function test(){
//     await client.set('visitedLocations',JSON.stringify({nane:'ridham'}));
//     await client.set('userPostedLocations',JSON.stringify({nane:'ridham'}));
//     const temp = await client.get('visitedLocations'); 
//     return temp;
// }

// async function main(){
//     try {
//       const rd = await test();
//       console.log(rd);
//     } catch (error) {
//       console.error(error);
//     }
// }

import axios from 'axios';
async function getData(){
    const {data}=await axios.get('https://api.foursquare.com/v3/places/search',
    {
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3hfiKinptR39GMo8J4dBpCqsPtCXEYqFVMDZfky3Gt6c=',
        }
    });
    return data.results;
}


async function main() {
    try {
      const {data} = await axios.get('https://api.foursquare.com/v3/places/search',
        {
            headers: {
                accept: 'application/json',
                Authorization: 'fsq3hfiKinptR39GMo8J4dBpCqsPtCXEYqFVMDZfky3Gt6c=',
            }
        });
      let rd=data.results;
      let result=await  Promise.all(rd.map(async (location) => {
        const {data}= await axios.get(`https://api.foursquare.com/v3/places/${location.fsq_id}/photos`,
        {
            headers: {
            accept: 'application/json',
            Authorization: 'fsq3hfiKinptR39GMo8J4dBpCqsPtCXEYqFVMDZfky3Gt6c=',
            }
        });
        return {
            id: location.fsq_id,
            image: data[0].prefix + data[0].suffix,
            name: location.name,
            address: location.location.address,
            userPosted: false,
            liked: false
        }
      }));
    console.log(result)
    } catch (error) {
      console.error(error);
    }
}

main();


