import Bucket from '../../models/Bucket'
import MasterController from '../master/MasterController'

class BucketController extends MasterController<typeof Bucket> {
  constructor () {
    super(Bucket)
  }
}

BucketController.options = {
  id: 'id',
  searchBy: ['id'],
  sortBy: ['created_at', 'desc'],
  createWith: ['name', 'description'],
  updateWith: ['name', 'description', 'status'],
  included: []
}

export default BucketController
