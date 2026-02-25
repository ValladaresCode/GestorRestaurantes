import { Router } from 'express'
import { getStatistics, exportStatisticsPDF } from './statistics.controller.js'

const router = Router()

router.get('/:restaurantId', getStatistics)
router.get('/:restaurantId/pdf', exportStatisticsPDF)

export default router