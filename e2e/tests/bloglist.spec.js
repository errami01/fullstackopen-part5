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
      
        test('a new blog can be created', async ({ page }) => {
          await page.getByRole('button', {name: 'new blog'}).click()
          await page.getByTestId('title').fill('Tirge')
          await page.getByTestId('author').fill('ahmed')
          await page.getByTestId('url').fill('cocot.com')
          await page.getByRole('button', { name: 'create' }).click()
          await expect(page.getByTestId('blogs-list').getByText('Tirge ahmed')).toBeVisible()
        })
        describe('when blog created', () => {
            beforeEach( async ({ page }) => {
                await page.getByRole('button', {name: 'new blog'}).click()
                await page.getByTestId('title').fill('Tirge')
                await page.getByTestId('author').fill('ahmed')
                await page.getByTestId('url').fill('cocot.com')
                await page.getByRole('button', { name: 'create' }).click()        
            })
            test('a blog can be liked', async ({page}) => {
                await page.getByRole('button', {name: 'view'}).click()
                await expect(page.getByRole('button', {name: 'like'})).toBeVisible()
            })
            test('a blog can be deleted by the creator user', async ({page}) =>{
                await page.getByText('Tirge ahmed').getByRole('button', {name: 'view'}).click()
                page.on('dialog', dialog => dialog.accept())
                await page.getByText('Tirge ahmed').getByRole('button', {name: 'remove'}).click()
                await expect(page.getByText('Tirge ahmed')).toHaveCount(0)
                
            })
            test('only the user who added the blog sees the blog\'s delete button', async ({page, request}) => {
                await request.post('http://localhost:3003/api/users', {
                    data: {
                        name: 'qwe',
                        username: 'asd',
                        password: 'zxc'
                    }
                })
                await page.getByText('Tirge ahmed').getByRole('button', {name: 'view'}).click()
                await expect(page.getByText('Tirge ahmed').getByRole('button', {name: 'remove'}))
                        .toHaveCount(1)
                await page.getByRole('button', {name: 'logout'}).click()
                await page.getByTestId('username').fill('asd')
                await page.getByTestId('password').fill('zxc') 
                await page.getByRole('button', { name: 'login' }).click()
                await page.getByText('Tirge ahmed').getByRole('button', {name: 'view'}).click()
                await expect(page.getByText('Tirge ahmed').getByRole('button', {name: 'remove'}))
                        .toHaveCount(0)

            })
        })
      })
})