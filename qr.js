import qr from 'qr-image'
import { createWriteStream } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import data from './json/a.json' assert { type: 'json' }
const id = '6523bd9728d60ceaa6572683'
const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

data.forEach(({ id }) => {
  var qr_svg = qr.image(id, { type: 'png' })
  qr_svg.pipe(createWriteStream(path.join(__dirname, `/out/img/${id}.png`)))
})
