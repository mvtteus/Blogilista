const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {
  const body = request.body
  const userr = User.findById(body.userId)
  
  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    user: userr._id,
    likes: body.likes
  })

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).json()
  } else {
    blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
  }
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