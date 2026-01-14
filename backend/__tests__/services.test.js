const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const servicesController = require("../controllers/servicesController.js");
const adminAuth = require("../middlewares/adminAuth.js");
const { db } = require("../config/db.js");
const fs = require("fs");
const mockFs = require("mock-fs");
const path = require("path");
const { upload } = require("../utils/utils");

jest.mock("../config/db.js");

const app = express();
app.use(bodyParser.json());

// Mock adminAuth to always pass
app.use((req, res, next) => { req.admin = { role: "admin" }; next(); });

// Setup routes for testing
app.get("/api/services", servicesController.GetServices);
app.get("/api/services/:id", servicesController.GetService);
app.post("/api/services", upload.single("image"), servicesController.CreateService);
app.put("/api/services/:id", upload.single("image"), servicesController.UpdateService);
app.delete("/api/services/:id", servicesController.RemoveService);

const { IMAGE_FOLDER } = require("../config/constants.js");

beforeAll(() => {
    const imagesPath = path.join(IMAGE_FOLDER);
    const fakeFs = {};
    fakeFs[imagesPath] = { "old.png": "fake image content" };
    mockFs(fakeFs);
});

afterAll(() => {
    mockFs.restore();
});

describe("Services Controller (MySQL)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /api/services returns all services", async () => {
        const mockServices = [
            { id: 1, title: "Service 1", image: "img1.png", description: "desc", length: 60, price: 50, allowOnline: 1, isActive: 1 },
            { id: 2, title: "Service 2", image: "img2.png", description: "desc", length: 90, price: 80, allowOnline: 0, isActive: 1 },
        ];

        db.query.mockResolvedValue([mockServices, []]);

        const res = await request(app).get("/api/services");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.services.length).toBe(2);
        expect(res.body.services[0].image).toContain("/api/images/");
    });

    test("GET /api/services/:id returns a single service", async () => {
        const mockService = { id: 1, title: "Service 1", image: "img1.png", description: "desc", length: 60, price: 50, allowOnline: 1, isActive: 1 };
        db.query.mockResolvedValue([[mockService], []]);

        const res = await request(app).get("/api/services/1");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.service.id).toBe(1);
    });

    test("POST /api/services creates a service", async () => {
        const insertResult = { insertId: 123 };
        db.query.mockResolvedValue([insertResult, []]);

        const res = await request(app)
            .post("/api/services")
            .field("title", "Test Service")
            .field("description", "Test description")
            .field("length", 60)
            .field("price", 100)
            .field("allowOnline", 1)
            .field("isActive", 1);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.serviceId).toBe(123);
    });

    test("PUT /api/services/:id updates a service", async () => {
        const oldImage = "old.png";

        // Mock select to fetch old service
        db.query.mockResolvedValueOnce([[{ image: oldImage }], []]);
        // Mock update
        db.query.mockResolvedValueOnce([{}, []]);

        jest.spyOn(fs, "unlink").mockImplementation((path, cb) => cb(null));

        const res = await request(app)
            .put("/api/services/1")
            .field("title", "Updated Service")
            .field("description", "Updated description")
            .field("length", 70)
            .field("price", 120)
            .field("allowOnline", 1)
            .field("isActive", 1);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("DELETE /api/services/:id removes a service", async () => {
        const mockRow = { id: 1, title: "Service 1", image: "old.png" };

        // Mock select
        db.query.mockResolvedValueOnce([[mockRow], []]);
        // Mock delete
        db.query.mockResolvedValueOnce([{}, []]);

        jest.spyOn(fs, "unlink").mockImplementation((path, cb) => cb(null));

        const res = await request(app).delete("/api/services/1");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.service.id).toBe(1);
    });

    test("adminAuth blocks requests without token", async () => {
        const req = { headers: {} };
        const res = { status: jest.fn(() => res), json: jest.fn() };
        const next = jest.fn();
        const middleware = require("../middlewares/adminAuth.js");
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
});
