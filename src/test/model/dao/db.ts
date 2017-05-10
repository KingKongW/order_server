import * as dbModel from "./../../../model/dao/db";
import * as Chai from "chai";

describe("the test of db module", function () {

    it(" success: to connect the database", async function (done) {
        let databaseConnect = dbModel.toConnect();
        
        done();
    });

    it(" success: to init the models of database", async function (done) {
        dbModel.initialize();
        done();
    });
});