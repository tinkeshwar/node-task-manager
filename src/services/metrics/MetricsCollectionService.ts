import IMetricsCollectionService from './IMetricsCollectionService'
import LocalMetricsCollectionService from './LocalMetricsCollectionService'

// eslint-disable-next-line @typescript-eslint/naming-convention
const MetricsCollectionService: IMetricsCollectionService = LocalMetricsCollectionService

export default MetricsCollectionService
