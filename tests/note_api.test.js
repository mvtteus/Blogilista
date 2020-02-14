const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)
const initialBlogs = [
  {
    title: "hyvää koodia",
    author: "eero perola",
    url: "hyperluettelo.herokuapp.com",
    likes: 420
    },
  {
  title: "huutista",
  author: "eero perola",
  url: "hyperluettelo.herokuapp.com",
  likes: 33
  }
]

beforeEach(async () => {
await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 2 blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(2)
})

test('there is an "id"', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('posting adds up to database and empty likes field defaults to 0', async () => {
  const newBlog = {
    title: "iha ok koodia",
    author: "eero perola",
    url: "hyperluettelo.herokuapp.com",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  const latestLikes = response.body.filter(item => item.title === "iha ok koodia")[0].likes
  // tarkitetaan, että tietokannassa olevien blogien määrä kasvaa yhdellä postattaessa
  expect(response.body.length).toBe(initialBlogs.length + 1)
  // tarkistetaan, että tyhjällä likes-kentällä responseen tulee default 0
  expect(latestLikes).toBe(0)
})

test('empty title and url will result a bad request', async () => {
  const newBlog = {
    author: "eero perola",
    likes: 99
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})


afterAll(() => {
  mongoose.connection.close()
})