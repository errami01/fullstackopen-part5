import { useState } from "react"

const Blog = ({ blog, update }) => {
  const [isHidden, setIsHidden] = useState(true)
  const toggleVisibility = ()=> setIsHidden(!isHidden)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const handleLikeClick =async ()=>{
    await update({
      ...blog,
      user: blog.user.id,
      likes: blog.likes+1
    })
  }
  return(
  <div style={blogStyle}>
    {blog.title} {blog.author} 
    <button onClick={toggleVisibility}>{isHidden ? 'view':'hide'}</button>
    {!isHidden && <div>
      <p>{blog.url}</p>
      <p>likes {blog.likes} <button onClick={handleLikeClick}>like</button></p>
      <p>{blog.user?.name} {blog.user?.username}</p>
    </div>}
  </div>  
)}

export default Blog