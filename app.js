import { degrees, PDFDocument, rgb, StandardFonts, } from 'pdf-lib'
import data from './json/a.json' assert { type: 'json' }
import fontkit from '@pdf-lib/fontkit'

import { readFileSync, writeFileSync } from 'fs'

data.forEach(async ({ id, Nombres, Apellidos, Email }) => {
  const existingPdfBytes = readFileSync(`./pdf/certificado.pdf`)
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit)
  const fontBytes = readFileSync('./font/ArialCEBoldItalic.ttf')
  const customFont = await pdfDoc.embedFont(fontBytes)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  const nombre = Nombres
    .concat(" ", Apellidos)
    .split(' ')
    .map(item => item.toLocaleUpperCase()[0] + item.toLocaleLowerCase().slice(1))
    .join(' ')

  firstPage.drawText(nombre, {
    x: width / 2 - customFont.widthOfTextAtSize(nombre, 26) / 2,
    y: height / 2 + 26,
    size: 26,
    font: customFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  })

  const pdfBytes = await pdfDoc.save()
  writeFileSync(`./out/${id}-${nombre}-${Email}.pdf`, pdfBytes, err => {
    if (err) console.log(err)
    else {
      console.log('File written successfully\n')
      console.log('The written has the following contents:')
      console.log(fs.readFileSync('books.txt', 'utf8'))
    }
  })
})
