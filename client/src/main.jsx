import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import ErrorPage from './Pages/ErrorPage'
import Home from './Pages/Home'
import PostDetail from "./Pages/PostDetail"
import Register from './Pages/Register'
import Login from './Pages/Login'
import USerProfile from './Pages/USerProfile'
import Author from './Pages/Author'
import CreatePost from './Pages/CreatePost'
import EditPost from './Pages/EditPost'
import CategoryPosts from './Pages/CategoryPosts'
import AuthorPosts from './Pages/AuthorPosts'
import Dashboard from './Pages/Dashboard'
import Logout from './Pages/Logout'
import DeletePost from './Pages/DeletePost'
import UserProvider from './context/userContext'

const router = createBrowserRouter ([
  {
    path: "/",
    element: <UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage/>,
    children :[
     {index: true, element: <Home/>},
     {path: "posts/:id", element: <PostDetail/>},
     {path: "register", element: <Register/>},
     {path: "login", element: <Login/>},
     {path: "profile/:id", element: <USerProfile/>},
     {path: "author", element: <Author/>},
     {path: "create", element: <CreatePost/>},
     {path: "posts/categories/:category", element: <CategoryPosts/>},
     {path: "posts/users/:id", element: <AuthorPosts/>},
     {path: "myposts/:id", element: <Dashboard/>},
     {path: "posts/:id/edit", element: <EditPost/>},
     {path: "posts/:id/delete", element: <DeletePost/>},
     {path: "logout", element: <Logout/>},
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
