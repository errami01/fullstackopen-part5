import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('Blog renders the blog\'s title and author',() => {
  const blog ={
    title : 'test blog',
    author : 'tester',
    url: 'hello.com'
  }
  render(<Blog blog={blog} />)
  const element = screen.getByText('test blog tester')
  expect(element).toBeDefined()
})
test('Blog does not render its URL or number of likes by default',() => {
  const blog ={
    title : 'test blog',
    author : 'tester',
    url: 'hello.com'
  }
  const { container } = render(<Blog blog={blog}/>)
  const div = container.querySelector('.hiddenInfo')
  expect(div).toBeNull()
})