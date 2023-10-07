# BoreSquare - Location Aggregation Website

BoreSquare is a location aggregation website, inspired by FourSquare, designed to provide users with access to information about various locations. It combines technologies such as Redis, React, and GraphQL to create a user-friendly and interactive web application.

## Overview

At BoreSquare, we aim to offer users an extensive collection of location data. Locations are the primary focus of our website, and they are represented in the following format:

```graphql
type Location {
    id: ID!
    image: String!
    name: String!
    address: String
    userPosted: Boolean!
    liked: Boolean!
}
```

## Backend
BoreSquare's backend is powered by Apollo Server, which supports a variety of queries and mutations to make the web application fully functional:

## Queries
locationPosts(pageNum: Int) -> [Location]: Maps to the Places REST API and fetches location data, including images.  
likedLocations -> [Location]: Retrieves location objects that the user has marked as liked from Redis.  
userPostedLocations -> [Location]: Queries all locations that the user has posted.  

## Mutations
uploadLocation(image: String!, address: String, name: String) -> Location: Creates a new location, which is saved in Redis. It defaults to liked: false, userPosted: true, and assigns a unique ID.  
updateLocation(id: ID!, image: String, name: String, address: String, userPosted: Boolean, liked: Boolean) -> Location: Updates location information, including cache management.  
deleteLocation(id: ID!) -> Location: Deletes a user-posted location from the cache.  

## Frontend Routes
BoreSquare's frontend utilizes Apollo Client to interact with the backend and provide data to the user interface. Here are the key routes:  

### /
Displays a list of location results from the Places API.  
Allows users to like/dislike locations and toggle the "Like" button to "Remove Like."  
Supports pagination to retrieve more location results.  
Each location post includes the name, image, address, and like/dislike button.  

### /my-likes
Shows a list of locations that the user has liked.  
Offers functionality similar to the main page (/).  

### /my-locations
Displays locations that the user has posted.  
Allows users to delete their locations and upload new ones.  
Similar functionality to the main page (/).  

### /new-location
Provides a form for users to upload new locations.  
Requires input for image URL, address, and location name.  
Designed to render a common React component for list logic shared with / and /my-likes.  

## Special Behavior
Liking Locations: When a user adds a location to their liked list, it is saved to the cache. User-posted locations remain in the cache even if not liked.

Graceful Failures: Any failures, such as liking an image or deleting a location, should result in a graceful error message display.


Thank you for joining us on our journey to create BoreSquare - your destination for location exploration! We hope you enjoy exploring various locations with ease and convenience.
