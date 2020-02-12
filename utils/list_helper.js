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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }