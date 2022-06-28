import { IKPI } from '@models/kpi-model';
import { getRandomInt } from '@shared/functions';
import orm from './mock-orm';

/**
 * Get one kpi.
 * 
 * @param kpiName
 * @returns 
 */
async function getOne(kpiName: string): Promise<IKPI | null> {
    const db = await orm.openDb();
    for (const kpi of db.kpis) {
        if (kpi.kpiName === kpiName) {
            return kpi;
        }
    }
    return null;
}


/**
 * See if a kpi with the given id exists.
 * 
 * @param id 
 */
async function persists(id: number): Promise<boolean> {
    const db = await orm.openDb();
    for (const kpi of db.kpis) {
        if (kpi.id === id) {
            return true;
        }
    }
    return false;
}


/**
 * Get all kpis.
 * 
 * @returns 
 */
async function getAll(): Promise<IKPI[]> {
    const db = await orm.openDb();
    return db.kpis;
}


/**
 * Add one kpi.
 * 
 * @param kpi 
 * @returns 
 */
async function add(kpi: IKPI): Promise<void> {
    const db = await orm.openDb();
    kpi.id = getRandomInt();
    db.kpis.push(kpi);
    return orm.saveDb(db);
}


/**
 * Update a kpi.
 * 
 * @param kpi 
 * @returns 
 */
async function update(kpi: IKPI): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.kpis.length; i++) {
        if (db.kpis[i].id === kpi.id) {
            db.kpis[i] = kpi;
            return orm.saveDb(db);
        }
    }
}


// Export default
export default {
    getOne,
    persists,
    getAll,
    add,
    update,
} as const;
