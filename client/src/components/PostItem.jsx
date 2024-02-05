import React from 'react'
import {Link} from 'react-router-dom'
import PostAuthor from './PostAuthor'
const assetsUrl = import.meta.env.VITE_REACT_APP_ASSETS_URL;
const PostItem = ({PostID, category, title, desc, authorID, thumbnail, createdAt}) => {
    const shortDescription = desc.length > 145 ? desc.substr(0, 145) +  '...' : desc;
    const postTitle = title.length > 30 ? title.substr(0, 145) +  '...' : title;

  return (
    <article className="post">
        <div className="post__thumbnail">
            <img src={`${assetsUrl}/uploads/${thumbnail}`} alt="" />
        </div>
        <div className="post__content">
            <Link to={`/posts/${PostID}`}>
                <h3>{postTitle}</h3>
            </Link>
            <p dangerouslySetInnerHTML={{__html: shortDescription}}/>
            <div className="post__footer">
                <PostAuthor authorID={authorID} createdAt ={createdAt} />
                <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
            </div>
        </div>
    </article>
  )
}

export default PostItem