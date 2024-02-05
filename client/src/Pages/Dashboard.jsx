import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dummy__post } from "../data";
import { UserContext } from "../context/userContext";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const assetsUrl = import.meta.env.VITE_REACT_APP_ASSETS_URL;
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/posts/users/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {}
      setIsLoading(false);
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="dashboard">
      {posts.length ? (
        <div className="container dashboard__container">
          {posts.map((post) => {
            return (
              <article key={post.id} className="dashboard__post">
                <div className="dashboard__post-info">
                  <div className="dashboard__post-thumbnail">
                    <img src={`${assetsUrl}/uploads/${post.thumbnail}`} alt="" />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard__post-actions">
                  <Link to={`/posts/${post._id}`} className="btn sm">
                    View
                  </Link>
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="btn sm primary"
                  >
                    Edit
                  </Link>
                  <DeletePost postId={post._id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">You have no posts yet.</h2>
      )}
    </section>
  );
};

export default Dashboard;
