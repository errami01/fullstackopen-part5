import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach } from 'vitest'

let container
beforeEach(() => {
  const blog ={
    title : 'test blog',
    author : 'tester',
    url: 'hello.com'
  }
  container = render(<Blog blog={blog} />).container
})
test('Blog renders the blog\'s title and author',() => {
  const element = screen.getByText('test blog tester')
  expect(element).toBeDefined()
})
test('Blog does not render its URL or number of likes by default',() => {
  const div = container.querySelector('.hiddenInfo')
  expect(div).toBeNull()
})
test('Blog render URL and number of likes after view button click', async () => {
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const div = container.querySelector('.hiddenInfo')
  expect(div).toBeDefined()
  expect(div).toHaveTextContent(
    'hello.comlikes'
  )
})