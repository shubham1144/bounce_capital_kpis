import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import kpiRepo from '@repos/kpi-repo';
import Kpi, { IKPI } from '@models/kpi-model';
import { pErr } from '@shared/functions';
import { path as kpiPaths } from '@routes/kpi-router';
import { ParamMissingError, KpiNotFoundError } from '@shared/errors';

type TReqBody = string | object | undefined;

describe('kpi-router', () => {

    const kpisPath = '/api/kpis';
    const getKpisPath = `${kpisPath}${kpiPaths.get}`;
    const addKpisPath = `${kpisPath}${kpiPaths.add}`;
    const updateKpiPath = `${kpisPath}${kpiPaths.update}`;

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });


    /***********************************************************************************
     *                                    Test Get
     **********************************************************************************/

    describe(`"GET:${getKpisPath}"`, () => {

        it(`should return a JSON object with all the kpis and a status code of "${OK}" if the
            request was successful.`, (done) => {
            // Setup spy
            const kpis = [
                Kpi.new('Active Scooters', '50'),
                Kpi.new('Monthly Active Users', '10000'),
                Kpi.new('Yearly Revenue', 'EUR 600K'),
            ];
            spyOn(kpiRepo, 'getAll').and.returnValue(Promise.resolve(kpis));
            // Call API
            agent.get(getKpisPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'Kpi' objects
                    const respKpis = res.body.kpis;
                    const retKpis: IKPI[] = respKpis.map((kpi: IKPI) => {
                        return Kpi.copy(kpi);
                    });
                    expect(retKpis).toEqual(kpis);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not fetch kpis.';
            spyOn(kpiRepo, 'getAll').and.throwError(errMsg);
            // Call API
            agent.get(getKpisPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    console.log(res.body)
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Post
     **********************************************************************************/

    describe(`"POST:${addKpisPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.post(addKpisPath).type('form').send(reqBody);
        };
        const kpiData = {
            kpi: Kpi.new('Active Scooters', '70'),
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            // Setup Spy
            spyOn(kpiRepo, 'add').and.returnValue(Promise.resolve());
            // Call API
            agent.post(addKpisPath).type('form').send(kpiData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a status
            code of "${BAD_REQUEST}" if the kpi param was missing.`, (done) => {
            // Call API
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not add kpi.';
            spyOn(kpiRepo, 'add').and.throwError(errMsg);
            // Call API
            callApi(kpiData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Put
     **********************************************************************************/

    describe(`"PUT:${updateKpiPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.put(updateKpiPath).type('form').send(reqBody);
        };
        const kpiData = {
            kpi: Kpi.new('Active Scooters', '50'),
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Setup spy
            spyOn(kpiRepo, 'persists').and.returnValue(Promise.resolve(true));
            spyOn(kpiRepo, 'update').and.returnValue(Promise.resolve());
            // Call Api
            callApi(kpiData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a
            status code of "${BAD_REQUEST}" if the kpi param was missing.`, (done) => {
            // Call api
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with the error message of ${KpiNotFoundError.Msg} 
            and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
            // Call api
            callApi(kpiData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(KpiNotFoundError.HttpStatus);
                    expect(res.body.error).toBe(KpiNotFoundError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            spyOn(kpiRepo, 'persists').and.returnValue(Promise.resolve(true));
            // Setup spy
            const updateErrMsg = 'Could not update kpi.';
            spyOn(kpiRepo, 'update').and.throwError(updateErrMsg);
            // Call API
            callApi(kpiData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                });
        });
    });

});
