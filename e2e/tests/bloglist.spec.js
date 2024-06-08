const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'nki',
                username: 'abdo',
                password: 'salainen'
            }
    })
        await page.goto('http://localhost:5173')
    })
  
    test('Login form is shown', async ({ page }) => {
        await expect(page.getByTestId('login-form')).toBeVisible();
    })
    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('abdo')
            await page.getByTestId('password').fill('salainen') 
            await page.getByRole('button', { name: 'login' }).click() 
            await expect(page.getByText('nki abdo is logged in')).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('abdo')
            await page.getByTestId('password').fill('salain') 
            await page.getByRole('button', { name: 'login' }).click() 
            await expect(page.getByText('Wrong username or passowrd')).toBeVisible()
        })
      })
      describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByTestId('username').fill('abdo')
            await page.getByTestId('password').fill('salainen') 
            await page.getByRole('button', { name: 'login' }).click() 
        })
      
        test.only('a new blog can be created', async ({ page }) => {
          await page.getByRole('button', {name: 'new blog'}).click()
          await expect(page.getByTestId('blog-form')).toBeVisible();
          await page.getByTestId('title').fill('Tirge')
          await page.getByTestId('author').fill('ahmed')
          await page.getByTestId('url').fill('cocot.com')
          await page.getByRole('button', { name: 'create' }).click()
          await expect(page.getByTestId('blogs-list').getByText('Tirge ahmed')).toBeVisible()
        })
      })
})