const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({}).populate('user', { username: 1, name: 1 })
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.post('/', async (request, response) => {
    const body = request.body
  
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
  
    const user = await User.findById(decodedToken.id)
  
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
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(id)
  const user = await User.findById(decodedToken.id)
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(id)
    response.status(204).json()
  } else {
    return response.status(401).json({ error: 'token does not match blog creators id' })
  }
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