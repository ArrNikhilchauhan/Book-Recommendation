import React from 'react'
import './Bookcard.css'

const Bookcard = (props) => {
  return (
    <div className='book'>
<div className="card">
<img src={props.image} alt="" />
      <p className='title'>{props.title}</p>
      <br />
      <p>Author:{props.author}</p>
      <p>votes:{props.votes}</p>
      <p>Rating:{props.rating.toFixed(2)}</p>
</div>
    </div>
  )
}

export default Bookcard
