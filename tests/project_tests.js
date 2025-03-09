const request = require("supertest");
const express = require("express");
const routes = require("../routes");
const config = require("../config/dbConfig");

const app = express();
app.use(express.json());
const apiVersion = config.API_VERSION;
app.use(`${apiVersion}/ingestion`, routes.ingestion);
app.use(`${apiVersion}/users`, routes.users);
app.use(`${apiVersion}/auth`, routes.auth);
app.use(`${apiVersion}/roles`, routes.roles);


describe("Project API Tests", () => {
    // Authentication Tests
    test("Should return error for invalid login", async () => {
        const response = await request(app).post(`${apiVersion}/auth/login`).send({ username: "wrong", password: "wrong" });
        expect(response.status).toBe(401);
    });
    
    // User Management Tests
    test("Should create a new user", async () => {
        const response = await request(app).post(`${apiVersion}/users`).send({ username: "testuser", password: "password123" });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });
    
    test("Should fetch user list", async () => {
        const response = await request(app).get(`${apiVersion}/users`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    
    // Role Management Tests
    test("Should fetch roles", async () => {
        const response = await request(app).get(`${apiVersion}/roles`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    
    // Ingestion API Tests
    test("Should trigger an ingestion process", async () => {
        const response = await request(app).post(`${apiVersion}/ingestion/trigger`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("processId");
    });

    test("Should get ingestion process status", async () => {
        await request(app).post(`${apiVersion}/ingestion/trigger`); // Trigger first
        const response = await request(app).get(`${apiVersion}/ingestion/status`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("processes");
        expect(Array.isArray(response.body.processes)).toBe(true);
    });
    
    // General API Tests
    test("Should return 404 for invalid route", async () => {
        const response = await request(app).get(`${apiVersion}/nonexistent`);
        expect(response.status).toBe(404);
    });
});
