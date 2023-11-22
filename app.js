import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import data from './json/a.json' assert { type: 'json' }
import fontkit from '@pdf-lib/fontkit'

import { readFileSync, writeFileSync } from 'fs'

data.forEach(async ({ id, nombres, apellido_materno, apellido_paterno }) => {
  const existingPdfBytes = readFileSync(`./pdf/pdf.pdf`)
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit)
  const fontBytes = readFileSync('./font/opensans.ttf')
  const customFont = await pdfDoc.embedFont(fontBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  const existingPng = readFileSync(`./out/img/${id}.png`)
  const pngImage = await pdfDoc.embedPng(existingPng)
  const nombre = nombres
    .split(' ')
    .map(
      item => item.toLocaleUpperCase()[0] + item.toLocaleLowerCase().slice(1)
    )
    .join(' ')
  const apellido = (apellido_materno + ' ' + apellido_paterno)
    .split(' ')
    .map(
      item => item[0].toLocaleUpperCase() + item.toLocaleLowerCase().slice(1)
    )
    .join(' ')
  firstPage.drawText(nombre, {
    x: (width - 240) / 2 + 240 - (nombre.length * 35) / 2,
    y: height / 2 - 300,
    size: 70,
    font: customFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  })
  firstPage.drawText(apellido, {
    x: (width - 240) / 2 + 240 - (apellido.length * 35) / 2,
    y: height / 2 - 400,
    size: 70,
    font: customFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  })
  firstPage.drawImage(pngImage, {
    x: width / 2 - 180,
    y: height / 2 - 200,
    width: 600,
    height: 600,
  })
  const pdfBytes = await pdfDoc.save()
  writeFileSync(`./out/${id}.pdf`, pdfBytes, err => {
    if (err) console.log(err)
    else {
      console.log('File written successfully\n')
      console.log('The written has the following contents:')
      console.log(fs.readFileSync('books.txt', 'utf8'))
    }
  })
})
