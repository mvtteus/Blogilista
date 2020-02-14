const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({}).populate('user', { username: 1, name: 1 })
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
  
    const user = await User.findById(body.userId)
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id,
      likes: body.likes
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  
    response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) =>  {
  const id = request.params.id

  await Blog.findByIdAndRemove(id)
  response.status(204).json()
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const update = await Blog.findByIdAndUpdate(id, blog, { new: true })
  response.json(update.toJSON())
})

  module.exports = blogsRouter