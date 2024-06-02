import { useState } from "react"

const Blog = ({ blog }) => {
  const [isHidden, setIsHidden] = useState(true)
  const toggleVisibility = ()=> setIsHidden(!isHidden)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return(
  <div style={blogStyle}>
    {blog.title} {blog.author} 
    <button onClick={toggleVisibility}>{isHidden ? 'view':'hide'}</button>
    {!isHidden && <div>
      <p>{blog.url}</p>
      <p>likes {blog.likes} <button>like</button></p>
      <p>{blog.user?.name} {blog.user?.username}</p>
    </div>}
  </div>  
)}

export default Blog