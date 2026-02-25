"use strict";

import Inventory from "./inventory.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createInventory = async (req, res) => {
    try {
        const data = { ...(req.body || {}) };
        if (req.file) {
            data.productPhoto = req.file.path;
        }

        const inventory = new Inventory(data);
        await inventory.save();

        return res.status(201).json({ success: true, inventory });
    } catch (error) {
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (err) {
                console.error("Error cleaning up image:", err);
            }
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getInventories = async (_req, res) => {
    try {
        const inventories = await Inventory.find();
        return res.json({ success: true, inventories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({ success: false, message: "Inventory not found" });
        }
        return res.json({ success: true, inventory });
    } catch (error) {
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (err) {
                console.error("Error cleaning up image:", err);
            }
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateInventory = async (req, res) => {
    try {
        const updateData = { ...(req.body || {}) };
        const inventoryBefore = await Inventory.findById(req.params.id);
        if (!inventoryBefore) {
            return res.status(404).json({ success: false, message: "Inventory not found" });
        }

        if (req.file) {
            updateData.productPhoto = req.file.path;
        }

        const inventory = await Inventory.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!inventory) {
            return res.status(404).json({ success: false, message: "Inventory not found" });
        }

        // If a new file was uploaded, try to remove the previous Cloudinary asset
        if (req.file && inventoryBefore.productPhoto) {
            try {
                const prevUrl = inventoryBefore.productPhoto;
                const parts = prevUrl.split('/');
                const last = parts[parts.length - 1];
                const publicId = last.includes('.') ? last.substring(0, last.lastIndexOf('.')) : last;
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error('Error removing previous Cloudinary asset:', err);
            }
        }

        return res.json({ success: true, inventory });
    } catch (error) {
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (err) {
                console.error("Error cleaning up image:", err);
            }
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!inventory) {
            return res.status(404).json({ success: false, message: "Inventory not found" });
        }

        if (inventory.productPhoto) {
            try {
                const parts = inventory.productPhoto.split('/');
                const last = parts[parts.length - 1];
                const publicId = last.includes('.') ? last.substring(0, last.lastIndexOf('.')) : last;
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error('Error removing Cloudinary asset during delete:', err);
            }
        }

        return res.json({ success: true, message: "Inventory deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    createInventory,
    getInventories,
    getInventoryById,
    updateInventory,
    deleteInventory,
};
