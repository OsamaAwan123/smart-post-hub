import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Loader from '../components/Loader';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const assetsUrl = import.meta.env.VITE_REACT_APP_ASSETS_URL;

const Author = () => {
  const [authors, setAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
   const getAuthor = async () =>{
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/users`)
      setAuthors(response.data)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
   }

   getAuthor()
  }, [])
  
 if (isLoading) {
  return <Loader/>
 }

  return (
    <section className="authors">
      {authors.length > 0 ? <div className="container authors__container">
       {
        authors.map(({_id: id, avatar, name, posts}) =>{
          return <Link key={id} to={`/posts/users/${id}`} className='author'>
           <div className="author__avatar">
            <img src={`${assetsUrl}/uploads/${avatar}`} alt="" />
           </div>
           <div className="author__info">
            <h4>{name}</h4>
            <p>{posts}</p>
           </div>
          </Link>
        })
       }
      </div>: <h2 className='center'>No users/authors found.</h2>}
    </section>
  )
}

export default Author