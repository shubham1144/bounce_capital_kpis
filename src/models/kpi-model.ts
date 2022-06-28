
// KPI schema
export interface IKPI {
    id: number;
    kpiName: string;
    kpiValue: string;
}


/**
 * Get a new Kpi object.
 * 
 * @returns 
 */
function getNew(kpiName: string, kpiValue: string): IKPI {
    return {
        id: -1,
        kpiValue,
        kpiName,
    };
}


/**
 * Copy a kpi object.
 * 
 * @param kpi 
 * @returns 
 */
function copy(kpi: IKPI): IKPI {
    return {
        id: kpi.id,
        kpiValue: kpi.kpiValue,
        kpiName: kpi.kpiName,
    }
}


// Export default
export default {
    new: getNew,
    copy,
}
