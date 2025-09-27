// controllers/resourceController.js
import Resource from "../../models/Resources_model/career_resources_model.js";

const createResource = async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  }
    catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

const getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);    
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const displayResourceByID = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);    
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json(resource);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req
        .params.id
        , req.body
        , { new: true }
        );
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }   
        res.status(200).json({ message: "Resource deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

export { createResource, getResources, getResource, updateResource, deleteResource,displayResourceByID };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   