const fs = require('fs')
const path = require('path')

const dbPath = `${path.dirname(__filename)}/../db.json`

// Read on each request rather than `require` once: `require` caches the parsed
// file for the lifetime of the process, so conversations created after startup
// were never returned.
const readDb = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'))

// Need this middleware to catch some requests
// and return both conversations where userId is sender or recipient
module.exports = (req, res, next) => {
  if (/conversations/.test(req.url) && req.method === 'GET') {
    const userId = req.query?.senderId
    const result = readDb()?.conversations?.filter(
      conv => conv.senderId == userId || conv.recipientId == userId
    )

    res.status(200).json(result)
    return
  }

  next()
}
