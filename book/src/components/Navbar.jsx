import React, { useState } from 'react';
import axios from 'axios';
import './Navbar.css';

const Navbar = (props) => {
  const [searchInput, setSearchInput] = useState('');
  const [bookResults, setBookResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const handleSearch = async () => {
    setSearchInput('');
    try {
      console.log("Search Input:", searchInput);
      const response = await axios.post('http://127.0.0.1:5000/search', { query: searchInput });
      
      if (response.data.message) {
        console.log(response.data.message);
        setBookResults([]);
      } else {
        setBookResults(response.data);
        console.log("Response Data:", response.data);
        props.onSearch(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlerecommendation = async () => {
    try {
      console.log("Search Input:", searchInput);
      const response = await axios.post('http://127.0.0.1:5000/recommend', { query: searchInput });

      if (response.data.message) {
        console.log(response.data.message);
      } else {
       
        setRecommendations(response.data);
        props.recommend(response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handlekeydown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handletop = () => {
    props.top(true);
  };

  const handlerecommendate = () => {
    handlerecommendation();
    props.top(true);
  };

  return (
    <div className='nav'>
      <div className="head">Book-Recommendation-System</div>
      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handlekeydown}
        />
        <button onClick={handletop}>TOP 30</button>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handlerecommendate}>Recomend</button>
      </div>
      <div className="results">
        {bookResults.length > 0 && (
          <div>
            <h3>Search Results:</h3>
            <ul>
              {bookResults.map((book, index) => (
                <li key={index}>
                  <strong>{book['Book-Title']}</strong> by {book['Book-Author']}
                </li>
              ))}
            </ul>
          </div>
        )}
        {recommendations.length > 0 && (
          <div>
            <h3>Recommendations:</h3>
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index}>
                  <strong>{rec['Book-Title']}</strong> by {rec['Book-Author']}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
