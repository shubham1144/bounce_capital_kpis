
import kpiRepo from '@repos/kpi-repo';
import { IKPI } from '@models/kpi-model';
import { KpiNotFoundError } from '@shared/errors';



/**
 * Get all kpis.
 * 
 * @returns 
 */
function getAll(): Promise<IKPI[]> {
    return kpiRepo.getAll();
}


/**
 * Add one kpi.
 * 
 * @param kpi 
 * @returns 
 */
function addOne(kpi: IKPI): Promise<void> {
    return kpiRepo.add(kpi);
}


/**
 * Update one kpi.
 * 
 * @param kpi 
 * @returns 
 */
async function updateOne(kpi: IKPI): Promise<void> {
    const persists = await kpiRepo.persists(kpi.id);
    if (!persists) {
        throw new KpiNotFoundError();
    }
    return kpiRepo.update(kpi);
}

// Export default
export default {
    getAll,
    addOne,
    updateOne,
} as const;
