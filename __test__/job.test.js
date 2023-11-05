const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createServer } = require("../utils/serverUtils");

const app = createServer();

describe("Job", () => {
    jest.setTimeout(30000);
    let authToken;

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        const mockUser = {
            _id: new mongoose.Types.ObjectId(),
            email: "test@example.com",
            password: "123456789"
        };

        authToken = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });


    test("should not create a job when user not authorised", async () => {
        await request(app)
            .post("/api/job")
            .send({})
            .expect(401);
    });

    test("should not create an empty job", async () => {
        await request(app)
            .post("/api/job")
            .set('Authorization', `Bearer ${authToken}`)
            .send({})
            .expect(400);
    });

    test("should create a job", async () => {
        const job = {
            name: "Software Developer",
            description: "We are looking for a skilled software developer...",
            company: "Tech Company XYZ",
            location: "Tunisia",
            salary: 5000,
            contract: "CDI",
            createdBy: authToken._id
        };

        await request(app)
            .post("/api/job")
            .set('Authorization', `Bearer ${authToken}`)
            .send(job)
            .expect(200)
            .then((response) => {
                expect(response.body).toBeTruthy();
                expect(response.body.name).toBe(job.name);
                expect(response.body.description).toBe(job.description);
                expect(response.body.company).toBe(job.company);
                expect(response.body.location).toBe(job.location);
                expect(response.body.salary).toBe(job.salary);
                expect(response.body.contract).toBe(job.contract);
                expect(response.body.createdBy).toBe(job.createdBy);
            });
    });

});