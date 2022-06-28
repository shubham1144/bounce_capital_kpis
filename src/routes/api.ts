import { Router } from 'express';
import kpiRouter from './kpi-router';


// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/kpis', kpiRouter);

// Export default.
export default baseRouter;
