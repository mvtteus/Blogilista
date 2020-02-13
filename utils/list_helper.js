const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((s, p) => s + p.likes,0)
}

const favoriteBlog = (blogs) => {
    let mostLikes = Math.max.apply(null, blogs.map(blog => blog.likes))
    return blogs.filter(blog => blog.likes === mostLikes)[0]
}

const mostBlogs = (blogs) => {
    let grouped = lodash.chain(blogs).groupBy('author')
    .toPairs().map(pair => lodash.zipObject(['author', 'blogs'], pair)).value()
    let mostBlgs = Math.max.apply(null, grouped.map(author => author.blogs.length))
    let found = grouped.filter(author => author.blogs.length === mostBlgs).map((value, key) => ({author: value.author, blogs: value.blogs.length}))
    return found[0]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }