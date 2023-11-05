const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createServer } = require("../utils/serverUtils");
const User = require("../models/userModel");

const app = createServer();

describe("Job", () => {
    jest.setTimeout(30000);
    let authToken;
    let newUser;

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        newUser = {
            firstName: "Mohamed",
            lastName: "HARBAOUI",
            email: "harbeouimohamed@gmail.com",
            password: "123456789",
            dateOfBirth: Date.UTC(1997, 6, 16),
            role: "RECRUTER"
        };

        await request(app)
            .post("/api/register")
            .send(newUser)
            .then(response => {
                authToken = response.body.token
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
            .set({ authorization: `Bearer ${authToken}` })
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
            createdBy: newUser
        };

        await request(app)
            .post("/api/job")
            .send(job)
            .expect(200)
            .set({ authorization: `Bearer ${authToken}` })
            .then((response) => {
                console.log(response.body.createdBy);
                expect(response.body).toBeTruthy();
                expect(response.body.name).toBe(job.name);
                expect(response.body.description).toBe(job.description);
                expect(response.body.company).toBe(job.company);
                expect(response.body.location).toBe(job.location);
                expect(response.body.salary).toBe(job.salary);
                expect(response.body.contract).toBe(job.contract);
                expect(response.body.createdBy.firstName).toBe(job.createdBy.firstName);
                expect(response.body.createdBy.lastName).toBe(job.createdBy.lastName);
                expect(response.body.createdBy.email).toBe(job.createdBy.email);
                expect(new Date(response.body.createdBy.dateOfBirth)).toBeInstanceOf(Date);
                expect(Date.parse(response.body.createdBy.dateOfBirth)).toBe(job.createdBy.dateOfBirth);
                expect(response.body.createdBy.role).toBe(job.createdBy.role);
            });
    });

});