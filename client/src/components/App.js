import React from 'react';
import './App.css';
import { NavLink, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
import Home from './Home';
import MyLikes from './MyLikes';
import MyLocations from './MyLocations';
import NewLocation  from './NewLocation';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});



function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h2>BoreSquare</h2>
            <nav>
              <NavLink className='navlink' to='/'>
                Home
              </NavLink>
              <NavLink className='navlink' to='/my-likes'>
                my-likes
              </NavLink>
              <NavLink className='navlink' to='/my-locations'>
                my-locations
              </NavLink>
              <NavLink className='navlink' to='/new-location'>
                new-location
              </NavLink>
            </nav>
          </header>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/my-likes/' element={<MyLikes/>} />
            <Route path='/my-locations/' element={<MyLocations/>} />
            <Route path='/new-location/' element={<NewLocation/>} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
