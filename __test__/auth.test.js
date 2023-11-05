const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { createServer } = require("../utils/serverUtils");

const app = createServer();

describe("Authentication | Unit Test", () => {
    jest.setTimeout(30000);

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    test("should register a new user", async () => {
        const newUser = {
            firstName: "Mohamed",
            lastName: "HARBAOUI",
            email: "harbeouimohamed@gmail.com",
            password: "123456789",
            dateOfBirth: Date.UTC(1997, 6, 16),
            role: "CANDIDATE"
        };

        await request(app)
            .post("/api/register")
            .send(newUser)
            .expect(200)
            .then((response) => {
                expect(response.body).toBeTruthy();
                expect(response.body.user.firstName).toBe(newUser.firstName);
                expect(response.body.user.lastName).toBe(newUser.lastName);
                expect(response.body.user.email).toBe(newUser.email);
                expect(new Date(response.body.user.dateOfBirth)).toBeInstanceOf(Date);
                expect(Date.parse(response.body.user.dateOfBirth)).toBe(newUser.dateOfBirth);
                expect(response.body.user.role).toBe(newUser.role);
            });
    });

    test("should not register an empty user", async () => {
        await request(app)
            .post("/api/login")
            .send({})
            .expect(400)
            .then((response) => {
                expect(response.body).toBeTruthy();
            });
    });

    test("should not register an existing user", async () => {
        const newUser = {
            firstName: "Mohamed",
            lastName: "HARBAOUI",
            email: "harbeouimohamed@gmail.com",
            password: "123456789",
            dateOfBirth: Date.UTC(1997, 6, 16),
            role: "CANDIDATE"
        };

        await request(app)
            .post("/api/register")
            .send(newUser)
            .expect(401);
    });

    test("should not login with no credentials", async () => {
        await request(app)
            .post("/api/register")
            .send({})
            .expect(400);
    });

    test("should not login with wrong email", async () => {
        const user = {
            email: "example@test.com",
            password: "123456789"
        }

        await request(app)
            .post("/api/login")
            .send(user)
            .expect(401);
    });

    test("should not login with wrong password", async () => {
        const user = {
            email: "harbeouimohamed@gmail.com",
            password: "1234567890"
        };

        await request(app)
            .post("/api/login")
            .send(user)
            .expect(401);
    });

    test("should login an existing user", async () => {
        const user = {
            email: "harbeouimohamed@gmail.com",
            password: "123456789"
        };

        await request(app)
            .post("/api/login")
            .send(user)
            .expect(200);
    });

});