import toSnakeCase from 'to-snake-case'
import QueueList from './QueueList'

// eslint-disable-next-line @typescript-eslint/naming-convention

const QueueWorker = (queueName: string) => <T>(target: T): T => {
  if (!QueueList[queueName]) {
    QueueList[queueName] = toSnakeCase(queueName)
  }

  return target
}

export default QueueWorker
