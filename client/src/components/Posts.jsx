import React, { useEffect, useState } from "react";
import axios from 'axios';
import PostItem from "./PostItem";
import Loader from './Loader';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Posts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/posts`);
        setPosts(response?.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

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
};

export default Posts;
