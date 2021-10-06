import PDFDocument from 'pdfkit'
import fs from 'fs'
import sizeOf from 'image-size'
import { UploadFailError } from '../error'
import { FileManager } from '.'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

type ImageUploadType = {
    file: string, ext: string
}

const { JWT_TOKEN } = process.env

const allowedExtension = ['.png', '.jpg', '.jpeg', '.webp']

class PdfManager {
  static async combineImage (images: ImageUploadType[], type: string, password?: string): Promise<any> {
    const pdfOption = {
      ownerPassword: JWT_TOKEN
    } as any
    if (password) {
      pdfOption.userPassword = password
    }
    if (images.length === 0) {
      throw new UploadFailError('No file to merge and upload.')
    }
    let doc = new PDFDocument(pdfOption)
    images.forEach(async (image: ImageUploadType, index: number) => {
      try {
        if (allowedExtension.includes(image.ext)) {
          if (!fs.existsSync(image.file)) {
            throw new Error('File upload failed')
          }
          if (index === 0) {
            doc = new PDFDocument(pdfOption)
          } else {
            doc.addPage()
          }
          const dimension = sizeOf(image.file)
          if (!dimension) {
            throw new Error('File upload failed, image dimension not received.')
          }
          if (dimension.height !== undefined && dimension.width !== undefined && ((dimension.width > dimension.height) || (dimension.width === dimension.height))) {
            doc.image(image.file, 0, 0, { width: doc.page.width })
          } else {
            doc.image(image.file, 0, 0, { height: doc.page.height })
          }
        }
      } catch {
        return null
      }
    })
    const name = `${uuidv4()}.pdf`
    const newpath = path.join(type, name)
    const stream = await FileManager.createFileUploadStream(newpath)
    const filestream = stream.uploadStream
    doc.pipe(filestream)
    doc.end()
    return stream.promise
  }
}

export default PdfManager
