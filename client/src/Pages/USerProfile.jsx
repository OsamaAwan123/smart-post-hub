import React, { useContext, useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {FaEdit} from 'react-icons/fa'
import {FaCheck} from 'react-icons/fa'
import { UserContext } from '../context/userContext'
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const assetsUrl = import.meta.env.VITE_REACT_APP_ASSETS_URL;
const USerProfile = () => {
  const [avatar, setAvatar] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newConfirmNewPassword, setConfirmNewPasswoed] = useState('')
  const [isAvatarTouched, setIsAvatarTouched] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  // redirect to login page for any user who isn't logged in 
  useEffect(()=>{
   if (!token) {
    navigate('/login')
   }
  }, [])


useEffect(() => {
 const getUser = async () =>{
  const response = await axios.get(`${baseUrl}/users/${currentUser.id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
  const {name, email, avatar} = response.data
  setName(name)
  setEmail(email)
  setAvatar(avatar)
 }

 getUser()
}, [])


const changeAvatarHandler = async() =>{
 setIsAvatarTouched(false);
 try {
   const postData = new FormData();
   postData.set('avatar', avatar);
   const response = await axios.post(`${baseUrl}/users/change-avatar`, postData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
   setAvatar(response?.data.avatar)
 } catch (error) {
  console.log(error)
 }
} 

const updateUserDetails = async (e) =>{
 e.preventDefault();
try {
  const userData = new FormData();
  userData.set('name', name);
  userData.set('email', email);
  userData.set('currentPassword', currentPassword);
  userData.set('newPassword', newPassword);
  userData.set('newConfirmNewPassword', newConfirmNewPassword);
 
  const response = await axios.patch(`${baseUrl}/users/edit-user`, userData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
  if (response.status == 200) {
   // log user out
   navigate('/logout')
  }
} catch (error) {
  setError(error.response.data.message)
}

}
  return (
  <section className="profile">
    <div className="container profile__container">
      <Link to={`/myposts/${currentUser.id}`} className='btn' >My Posts</Link>

      <div className="profile__details">
        <div className="avatar__wrapper">
          <div className="profile__avatar">
            <img src={`${assetsUrl}/uploads/${avatar}`} alt="" />
          </div>
          {/* Form to update avatar */}
          <form className="avatar__form">
            <input type="file" name="avatar" id="avatar" accept='png, jpg, jpeg' onChange={e => setAvatar(e.target.files[0])} />
            <label htmlFor="avatar" onClick={()=> setIsAvatarTouched(true)}><FaEdit/></label>
          </form>
          {isAvatarTouched && <button className='profile__avatar-btn' onClick={changeAvatarHandler}><FaCheck/></button>}
        </div>
        <h1>{currentUser.name}</h1>

        {/* form to update user detail */}
        <form className='form profile__form' onSubmit={updateUserDetails}>
        {error && <p className='form__error-message'>{error}</p>}
        <input type="text" placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder='CurrentPassword' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
        <input type="password" placeholder='New Password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <input type="password" placeholder='Confirm New Password' value={newConfirmNewPassword} onChange={e => setConfirmNewPasswoed(e.target.value)} />
        <button type="submit" className='btn primary'>Update my details</button>
        </form>
      </div>
    </div>
  </section>
  )
}

export default USerProfile