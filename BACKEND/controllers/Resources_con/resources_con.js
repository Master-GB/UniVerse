const resourcesModel = require("../../models/Resources_model/resources_model");

const addResources = async (req,res) =>{

    if (!req.body) {
        return res.status(400).json({ error: 'No request body found' });
    }

    const{
        title,
        description,
        category,
        sub_category,
        typeOfRes,
        contentType,
        fileUrl,
        thumbnailUrl,
        updatedAt,
    } = req.body;

    let resource;

    try{
        resource = new resourcesModel({
            title,
            description,
            category,
            sub_category,
            typeOfRes,
            contentType,
            fileUrl,
            thumbnailUrl,
            updatedAt,
        });
        await resource.save();
        return res.status(200).json({message:"Resource added successfully",resource});
    }catch(error){
        console.log("Error" + error.message);

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: "Validation error", errors });
        }

        return res
            .status(500)
            .json({message:"Server error while saving donation"});
            
    }
};

const displayResource = async(req,res) =>{

    let resources;

    try{
        resources = await resourcesModel.find();
        if(resources == 0){
            return res.status(404).json({messge:"Resources not found"});
        }

        return res.status(200).json({message:"Resources are Found Successfully",resources});
    }catch(error){
        console.log("Error fetching Resources:",error.message);
        return res.status(500).json({message:"Internal server Error"});
    }

};

const displayResourceByID = async(req,res)=>{

    const id = req.params.id;

    let resource;

    try{

        resource = await resourcesModel.findById(id);
        if(resource == 0){
            return res.status(404).json({messge:"Resource not found"});
        }

        return res.status(200).json({message:"Resource is Found Successfully",resource});

    }catch(error){
        console.log("Error fetching Resource:",error.message);
        return res.status(500).json({message:"Internal server Error"});
    }
};

const deleteResource = async(req,res) =>{

    const id = req.params.id;

    try{
        const deleteresource = await resourcesModel.findByIdAndDelete(id);
        if(!deleteresource){
            return res.status(404).json({message:"Resource not found & Cannot delete"});
        }

        return res.status(200).json({message:"Resource found & Successfully deleted",deleteresource});

    }catch(error){
        console.log("Error fetching Resource:",error.message);
        return res.status(500).json({message:"Internal server Error"});
    }
};

const updateResource = async(req,res) =>{

    const id = req.params.id;

    const{
        title,
        description,
        category,
        sub_category,
        typeOfRes,
        contentType,
        fileUrl,
        thumbnailUrl,
        updatedAt,
    } = req.body;

    try{
        const updateresource = await resourcesModel.findByIdAndUpdate(id,{
            title,
            description,
            category,
            sub_category,
            typeOfRes,
            contentType,
            fileUrl,
            thumbnailUrl,
            updatedAt,
        },
          {new:true}
        );

        if(!updateresource){
            return res.status(404).json({message:"Resource is not Updated"});
        }
        return res.status(200).json({message:"Resource is Successfully Updated", updateresource});
        

    }catch(error){
        console.log("Error fetching Resource:",error.message);
        return res.status(500).json({message:"Internal server Error"});
    }

};

// When opening the edit modal, use the resource from your backend data
const openEditModal = (resource) => {
  setSelectedResource({ ...resource });
  setShowEditModal(true);
};

exports.addResources = addResources;
exports.displayResource = displayResource;
exports.displayResourceByID = displayResourceByID;
exports.deleteResource = deleteResource;
exports.updateResource = updateResource;
exports.openEditModal = openEditModal;