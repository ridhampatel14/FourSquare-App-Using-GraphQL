import {ApolloServer, gql} from 'apollo-server';
import {v4 as uuid} from 'uuid';
import axios from 'axios';
import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => {});

const typeDefs= gql`
    type Query {
        likedLocations: [Location]
        userPostedLocations: [Location]
        locationPosts(pageNum: Int): [Location]
    }

    type Location {
        id: ID!
        image: String!
        name: String!
        address: String
        userPosted: Boolean!
        liked: Boolean!
    }

    type Mutation {
        uploadLocation(
            image: String!, 
            address: String, 
            name: String
            ): Location
        updateLocation(
            id: ID!, 
            image: String, 
            name: String, 
            address: String, 
            userPosted: Boolean, 
            liked: Boolean
            ): Location
        deleteLocation(
            id: ID!
            ): Location
    }
`;

const resolvers = {
    Query: {
        locationPosts: async (_, args) => {
            let f_link='https://api.foursquare.com/v3/places/search'
            let rd=[]
            const regex = /<([^>]+)>;\s*rel="next"/;
            //console.log('locations posts function called');
            for (let i = 0; i < args.pageNum; i++) {
                const {headers, data} = await axios.get(f_link,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: 'fsq3hfiKinptR39GMo8J4dBpCqsPtCXEYqFVMDZfky3Gt6c=',
                        }
                    });
                const match = regex.exec(headers.link);
                if(match){
                    f_link=match[1]
                }
                rd = [...rd , ...data.results];
            }
            // const {headers, data} = await axios.get(link,
            // {
            //     headers: {
            //         accept: 'application/json',
            //         Authorization: 'fsq3hfiKinptR39GMo8J4dBpCqsPtCXEYqFVMDZfky3Gt6c=',
            //     }
            // });
            // rd = [...rd , ...data.results];
            let result=await  Promise.all(rd.map(async (location) => {
                const {data}= await axios.get(`https://api.foursquare.com/v3/places/${location.fsq_id}/photos`,
                {
                    headers: {
                    accept: 'application/json',
                    Authorization: 'fsq3hfiKinptR39GMo8J4dBpCqsPtCXEYqFVMDZfky3Gt6c=',
                    }
                });
                let image_url=''
                if(data.length !== 0){
                    image_url=data[0].prefix + 'original'  + data[0].suffix
                }
                let InLiked= await client.HEXISTS('likedLocations',location.fsq_id);
                //console.log(InLiked)
                return {
                    id: location.fsq_id,
                    image: image_url,
                    name: location.name,
                    address: location.location.address,
                    userPosted: false,
                    liked: InLiked==true ? true : false
                }
            })); 
            // console.log(result)
            return result;        
        },
        likedLocations: async () => {
            //console.log('liked locations function called');
            const data=await client.HVALS('likedLocations');
            let result=data.map((d) => {
                return JSON.parse(d);
            })
            return result;          
        },
        userPostedLocations: async () => {
            //console.log('user posted locations function called');
            const data=await client.HVALS('userPostedLocations');
            let result=data.map((d) => {
                return JSON.parse(d);
            })
            return result;  

        }
    },
    Mutation: {
        uploadLocation: async (_, args) => {      
            const location = {
              id: uuid(),
              image: args.image, 
              address: args.address, 
              name: args.name,
              liked: false,
              userPosted: true,
            };
            await client.HSET('userPostedLocations',location.id,JSON.stringify(location));
            return location;
        }, 
        updateLocation: async (_, args) => {      
            const location = {
              id: args.id,
              image: args.image, 
              address: args.address, 
              name: args.name,
              liked: args.liked,
              userPosted: args.userPosted,
            };
            const inUserPosted= await client.HEXISTS('userPostedLocations',location.id);
            if(inUserPosted){
                await client.HSET('userPostedLocations',location.id,JSON.stringify(location));
            }
            if(args.liked===true){
                await client.HSET('likedLocations',location.id,JSON.stringify(location));
            }else{
                await client.HDEL('likedLocations',location.id)
            }
            return location;
        }, 
        deleteLocation: async (_, args) => {      
            let loc=await client.HGET('userPostedLocations',args.id);
            loc=JSON.parse(loc)
            let val= await client.HDEL('userPostedLocations',args.id);
            const inLikedPosts= await client.HEXISTS('likedLocations',args.id);
            if(inLikedPosts){
                await client.HDEL('likedLocations',args.id)
            }
            return loc;
        }, 
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});