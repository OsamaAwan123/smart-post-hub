import React, { useEffect, useState } from "react";
import axios from 'axios';
import PostItem from '../components/PostItem'
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const AuthorPosts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const {id} = useParams()

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/posts/users/${id}`);
        setPosts(response?.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(({_id: id, thumbnail, category, title, description, creator , createdAt}) => (
            <PostItem
              key={id}
              PostID={id}
              thumbnail={thumbnail}
              category={category}
              title={title}
              desc={description}
              createdAt={createdAt}
              authorID={creator} // Corrected spelling of authorID
            />
          ))}
        </div>
      ) : (
        <h2 className="center">No posts found</h2>
      )}
    </section>
  );
}

export default AuthorPosts