import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Bookcard from './components/Bookcard';

function App() {
  const [data, setData] = useState({}); // For default data
  const [searchResults, setSearchResults] = useState([]); // For search results
  const [isSearching, setIsSearching] = useState(false); // To track if a search is active
  const [top, settop] = useState(false);
  const[recommend,setrecommend]=useState(false);
  const[output,setoutput]=useState([]);

  useEffect(() => {
    // Fetching the default data when the component mounts
    fetch('http://127.0.0.1:5000')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  
  // Handler to update search results in App.js
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearching(true);
    setrecommend(false) // Switch to search mode
  };
  const handletop=(x)=>{
    settop(x);
    setIsSearching(false);
    setrecommend(false)
  }

  const recommendation=(x)=>{
    setoutput(x)
   setrecommend(true)
  }

  // Render either search results or default data based on state
  let booksToRender = data['Book-Title'];

  if(top){
    booksToRender=data['Book-Title'];
  }
  if(isSearching){
    booksToRender=searchResults;
  }
  if(recommend){
    booksToRender=output
  }
 
  return (
    <>
      <Navbar onSearch={handleSearchResults} top={handletop} recommend={recommendation}/>
      <div className="list">
        {}
        {booksToRender && booksToRender.length > 0 && booksToRender.map((book, index) => (
          <Bookcard
            key={index}
            title={book['Book-Title'] || data['Book-Title'][index]}
            author={book['Book-Author'] || data['Book-Author'][index]}
            rating={book['Rating'] || data['Rating'][index]}
            votes={book['Votes'] || data['Votes'][index]}
            image={book['Image-URL-M'] || data['Image-URL-M'][index]}
          />
        ))}
      </div>
    </>
  );
}

export default App;
