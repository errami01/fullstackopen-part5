import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title:'', author:'', url:''})
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedBloglistUser')) || null)
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      localStorage.setItem('loggedBloglistUser', JSON.stringify(user)) 
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogout = ()=>{
    localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }
  const handleCreateBlog = async (event)=>{
    event.preventDefault()
    try{
      const response = await blogService.create(newBlog)
      setNewBlog({title:'', author:'', url:''})
      setBlogs([...blogs, response])
    }
    catch(error){
      console.log(error.message)
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  const blogForm = ()=>(
    <div>
      <h1>create new</h1>
      <form onSubmit={handleCreateBlog}>
        <div>
          title
            <input
            type="text"
            value={newBlog.title}
            name="Username"
            onChange={({ target }) => setNewBlog({
              ...newBlog,
              title: target.value
            })}
          />
        </div>
        <div>
          author
            <input
            type="text"
            value={newBlog.author}
            name="Author"
            onChange={({ target }) => setNewBlog({
              ...newBlog,
              author: target.value
            })}
          />
        </div>
        <div>
          url
            <input
            type="text"
            value={newBlog.url}
            name="Url"
            onChange={({ target }) => setNewBlog({
              ...newBlog,
              url: target.value
            })}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
  const loggedUserElements = ()=> (
    <div>
      <h1>Blogs</h1>
      <p>{user.name} {user.username} is logged in <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
  return (
    <div>
      {!user && loginForm()}
      {user && loggedUserElements()}
    </div>
  )
}

export default App