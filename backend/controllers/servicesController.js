const { db } = require("../config/db.js");
const path = require("path");
const fs = require("fs");
const { IMAGE_FOLDER } = require("../config/constants.js");

const GetServices = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM services WHERE id > 0");

        const services = rows.map((service) => ({
            ...service,
            image: GetImageAsLink(req, service.image),
        }));

        return res.status(200).json({ success: true, services });
    } catch (error) {
        console.error("Error fetching services:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const GetService = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
        const result = rows[0];

        if (!result) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        const service = {
            ...result,
            image: GetImageAsLink(req, result.image),
        };

        return res.status(200).json({ success: true, service });
    } catch (error) {
        console.error("Error fetching service:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const CreateService = async (req, res) => {
    const data = validateAndConvertServiceData(req, res);
    if (!data) return;

    try {
        const [result] = await db.query(
            "INSERT INTO services (title, image, description, length, price, allowOnline, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [data.title, data.image, data.description, data.lengthNum, data.priceNum, data.allowOnlineInt, data.isActiveInt]
        );

        res.status(201).json({ success: true, serviceId: result.insertId });
    } catch (err) {
        console.error("Error creating service:", err);
        res.status(500).json({ error: err.message });
    }
};

const UpdateService = async (req, res) => {
    const { id } = req.params;
    const data = validateAndConvertServiceData(req, res);
    if (!data || !id) return res.status(400).json({ error: "Invalid data or missing ID" });

    try {
        const [rows] = await db.query("SELECT image FROM services WHERE id = ?", [id]);
        const row = rows[0];

        if (!row) return res.status(404).json({ error: "Service not found" });

        const oldImage = row.image;

        const [result] = await db.query(
            `UPDATE services
             SET title = ?, description = ?, length = ?, price = ?, allowOnline = ?, isActive = ?, image = COALESCE(?, image)
             WHERE id = ?`,
            [data.title, data.description, data.lengthNum, data.priceNum, data.allowOnlineInt, data.isActiveInt, data.image, id]
        );

        // Delete old image if replaced
        if (data.image && oldImage && oldImage.trim() !== "") {
            RemoveImage(oldImage);
        }

        res.status(200).json({ success: true, message: "Service updated successfully" });
    } catch (err) {
        console.error("Error updating service:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const RemoveService = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
        const row = rows[0];

        if (!row) return res.status(404).json({ success: false, message: "Service not found" });

        if (row.image) RemoveImage(row.image);

        await db.query("DELETE FROM services WHERE id = ?", [id]);

        return res.status(200).json({ success: true, service: row });
    } catch (error) {
        console.error("Error removing service:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const validateAndConvertServiceData = (req, res) => {
    const { title, description, length, price, allowOnline, isActive } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !description || length === undefined || price === undefined) {
        res.status(400).json({ error: "Missing required fields" });
        return null;
    }

    const lengthNum = Number(length);
    const priceNum = Number(price);
    const allowOnlineInt = Number(allowOnline);
    const isActiveInt = Number(isActive);

    if (isNaN(lengthNum) || isNaN(priceNum)) {
        res.status(400).json({ error: "Invalid number format for length or price" });
        return null;
    }

    return { title, description, lengthNum, priceNum, allowOnlineInt, isActiveInt, image };
};

const RemoveImage = (name) => {
    const filePath = path.join(IMAGE_FOLDER, name);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            if (err.code === "ENOENT") return;
            console.error("Error checking image existence:", err.message);
            return;
        }
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting image:", unlinkErr.message);
        });
    });
};

const GetImageAsLink = (req, img) => {
    return img == null ? "" : `${req.protocol}://${req.get("host")}/api/images/${path.basename(img)}`;
};

module.exports = {
    GetServices,
    GetService,
    CreateService,
    UpdateService,
    RemoveService,
};
