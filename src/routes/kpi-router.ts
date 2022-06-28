import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import kpiService from '@services/kpi-service';
import { ParamMissingError } from '@shared/errors';


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const path = {
    get: '/all',
    add: '/add',
    update: '/update',
} as const;


/**
 * Get all kpis.
 */
router.get(path.get, async (req: Request, res: Response) => {
    const kpis = await kpiService.getAll();
    return res.status(OK).json({kpis});
});


/**
 * Add one kpi.
 */
router.post(path.add, async (req: Request, res: Response) => {
    const { kpi } = req.body;
    // Check param
    if (!kpi) {
        throw new ParamMissingError();
    }
    // Fetch data
    await kpiService.addOne(kpi);
    return res.status(CREATED).end();
});


/**
 * Update one kpi.
 */
router.put(path.update, async (req: Request, res: Response) => {
    const { kpi } = req.body;
    // Check param
    if (!kpi) {
        throw new ParamMissingError();
    }
    // Fetch data
    await kpiService.updateOne(kpi);
    return res.status(OK).end();
});

// Export default
export default router;
