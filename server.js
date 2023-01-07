const path = require('path')
const express = require('express')

const app = express()
const port = 3000

app.use('/static', express.static(path.join(__dirname, 'static')))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
