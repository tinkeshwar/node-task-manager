import path from 'path'
import urljoin from 'url-join'
import { Readable, Writable } from 'stream'
import IFileDescription from './IFileDescription'
import IFileSystemConnector from './IFileSystemConnector'
import OSFileConnector from './OSFileConnector'
import S3Connector from './S3Connector'
import { Dispatchable } from '../event'
import { IEventDispatcher } from '../event/ListenManager'
import { FileAlreadyExistsError, UploadFailError } from '../error'
import { Document, Image } from '../../models'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import PdfManager from './PdfManager'

interface IFileCreationOptions {
  rewrite: boolean;
  upsert: boolean;
}

interface IFileBulk {
  file: string,
  ext: string
}

@Dispatchable
class FileManager {
  private static connected: IFileSystemConnector;
  public readonly basepath: string;

  public constructor (basepath = '') {
    this.basepath = path.normalize(basepath).replace(/^(\.\.(\/|\\|$))+/, '')
  }

  private static get connector () {
    if (!this.connected) {
      this.initConnector()
    }
    return this.connected
  }

  public static async fileExists (filepath: string): Promise<boolean> {
    return this.connector.fileExists(filepath)
  }

  public static async saveFile (filepath: string, ext: string, type: 'image'|'file'): Promise<IFileDescription> {
    const data = fs.readFileSync(filepath)
    const name = `${uuidv4()}${ext}`
    const newpath = path.join(type, name)
    return this.createFile(newpath, data)
  }

  public static async savePdf (files: IFileBulk[], type: 'image'|'file', password?: string): Promise<IFileDescription> {
    return await PdfManager.combineImage(files, type, password)
  }

  public static async createFile (
    filepath: string,
    data: string | Buffer,
    options: Partial<IFileCreationOptions> = { rewrite: false, upsert: false }
  ): Promise<IFileDescription> {
    try {
      return await this.connector.createFile(filepath, data, options.rewrite)
    } catch (error) {
      const err: Error = error as any
      if ((err.constructor === FileAlreadyExistsError) && options.upsert) {
        return (await this.connector.getFile(filepath)).file
      }
      throw err
    }
  }

  public static async createFileUploadStream (
    filepath: string,
    options: { rewrite: boolean; } | undefined = { rewrite: false }
  ): Promise<{ uploadStream: Writable; promise: Promise<IFileDescription>; }> {
    return this.connector.createFileUploadStream(filepath, options.rewrite)
  }

  public static async getFile (filepath: string): Promise<{ file: IFileDescription; data: string | Buffer; }> {
    return this.connector.getFile(filepath)
  }

  public static async createFileDownloadStream (
    filepath: string
  ): Promise<{ downloadStream: Readable; promise: Promise<IFileDescription>; }> {
    return this.connector.createFileDownloadStream(filepath)
  }

  public static async updateFile (filepath: string, data: string | Buffer): Promise<IFileDescription> {
    return this.connector.updateFile(filepath, data)
  }

  public static async copyFile (srcFilepath: string, destFilepath: string): Promise<IFileDescription> {
    return this.connector.copyFile(srcFilepath, destFilepath)
  }

  public static async deleteFile (filepath: string): Promise<IFileDescription> {
    return this.connector.deleteFile(filepath)
  }

  public static async getJSON (filepath: string): Promise<Record<string, any>> {
    const { data } = await this.connector.getFile(filepath)
    return JSON.parse(data.toString()) as Record<string, any>
  }

  public static async createJSON (
    filepath: string,
    data: Record<string, any>,
    options: Partial<IFileCreationOptions>
  ): Promise<IFileDescription> {
    return this.createFile(filepath, JSON.stringify(data), options)
  }

  public static async patchJSON (filepath: string, data: Record<string, any>): Promise<IFileDescription> {
    const originalData = await this.getJSON(filepath)
    const patchedData = Object.assign({}, originalData, data)
    return this.connector.updateFile(filepath, JSON.stringify(patchedData))
  }

  public static async listFiles (dirpath: string): Promise<IFileDescription[]> {
    return this.connector.listFiles(dirpath)
  }

  public static create (basepath = ''): FileManager {
    return new this(basepath)
  }

  private static initConnector () {
    switch (process.env.NODE_ENV) {
      case 'development':
        this.connected = new OSFileConnector(); break
      case 'test':
        this.connected = new OSFileConnector('./data/test'); break
      default:
        this.connected = new S3Connector(process.env.AWS_S3_PUBLIC_BUCKET_NAME as string)
    }
  }

  public get publicUrl (): string {
    return urljoin(FileManager.connector.publicUrl, this.basepath)
  }

  public async fileExists (filepath: string): Promise<boolean> {
    return FileManager.fileExists(this.fullpath(filepath))
  }

  public async saveFile (path: string, ext: string, type: 'image'|'file'): Promise<IFileDescription> {
    return FileManager.saveFile(path, ext, type)
  }

  public async savePdf (files: IFileBulk[], type: 'image'|'file', password?: string): Promise<IFileDescription> {
    return FileManager.savePdf(files, type, password)
  }

  public async createFile (
    filepath: string,
    data: string | Buffer,
    options: Partial<IFileCreationOptions>
  ): Promise<IFileDescription> {
    return FileManager.createFile(this.fullpath(filepath), data, options)
  }

  public async getFile (filepath: string): Promise<{
    file: IFileDescription;
    data: string | Buffer;
  }> {
    return FileManager.getFile(this.fullpath(filepath))
  }

  public async updateFile (filepath: string, data: string | Buffer): Promise<IFileDescription> {
    return FileManager.updateFile(this.fullpath(filepath), data)
  }

  public async deleteFile (filepath: string): Promise<IFileDescription> {
    return FileManager.deleteFile(this.fullpath(filepath))
  }

  public async getJSON (filepath: string): Promise<Record<string, any>> {
    return FileManager.getJSON(this.fullpath(filepath))
  }

  public async createJSON (
    filepath: string,
    data: Record<string, any>,
    options: Partial<IFileCreationOptions>
  ): Promise<IFileDescription> {
    return FileManager.createJSON(this.fullpath(filepath), data, options)
  }

  public async patchJSON (filepath: string, data: Record<string, any>): Promise<IFileDescription> {
    return FileManager.patchJSON(this.fullpath(filepath), data)
  }

  private fullpath (filepath: string) {
    return path.join(this.basepath, path.normalize(filepath))
  }

  public static subscribe (dispatcher: IEventDispatcher): void {
    dispatcher.on('IMAGE_UPLOADED', async (data: {
      imageId: string;
      existingImage?: string
    }) => {
      const { imageId, existingImage } = data
      const image = await Image.findByPk(imageId)
      if (!image) {
        throw new UploadFailError('Image not found.')
      }
      image.update({ status: 1 })
      if (existingImage !== null && existingImage !== undefined) {
        this.deleteFile(existingImage)
      }
    })

    dispatcher.on('FILE_UPLOADED', async (data: {
        fileId: string;
        existingFile?: string
    }) => {
      const { fileId, existingFile } = data
      const file = await Document.findByPk(fileId)
      if (!file) {
        throw new UploadFailError('File not found.')
      }
      file.update({ status: 1 })
      if (existingFile !== null && existingFile !== undefined) {
        this.deleteFile(existingFile)
      }
    })
  }
}

export default FileManager
