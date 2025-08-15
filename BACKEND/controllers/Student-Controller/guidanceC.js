const guidanceModel = require("../../models/Student_model/guidance");

const addGuidance = async(req,res) =>{

    if (!req.body) {
    return res.status(400).json({ error: 'No request body found' });
  }

    const{
        studentGName,
        guidanceTitle,
        guidanceDiscription,
        guidanceDate,
    } = req.body;

    let guidance;

    try{
        guidance = new guidanceModel({
            studentGName,
            guidanceTitle,
            guidanceDiscription,
            guidanceDate,
        });
        await guidance.save();
        return res
            .status(200)
            .json({message : "Guidance added successfully",guidance});
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

const displayGuidance = async(req,res) =>{

    let guidances;

    try{
        guidances = await guidanceModel.find();
        if(guidances == 0){
            return res.status(404).json({message:"Guidance not found"});
        }

        return res.status(200).json({guidances});

    }catch(error){
        console.error("Error fetching donations:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }

};

const displayByIDGuidance = async(req,res) =>{

    const id = req.params.id;

    try{
        const guidance = await guidanceModel.findById(id);

        if(!guidance){
            return res.status(404).json({message:"Guidance not found"});
        }

        return res.status(200).json({message:"Guidance find successfully",guidance});

    }catch(error){
        console.log("Error fetching donations:",error.message);
        return res.status(500).json({message:"Internal server Error"});
    }

};

const deleteGuidance = async(req,res) =>{

    const id = req.params.id

    try{
        const deleteguidance = await guidanceModel.findByIdAndDelete(id);

    if(!deleteguidance){
        return res.status(404).json({message:"Guidance not found & Cannot delete"});
    }

    return res.status(200).json({message:"Guidance  found & successfully delete",deleteguidance});
    }catch(error){
        console.log("Error fetching donations:",error.message);
        return res.status(500).json({message:"Internal server Error"});
    }
    
};

const updateGuidance = async(req,res) =>{

   const id = req.params.id;

   const {

        studentGName,
        guidanceTitle,
        guidanceDiscription,
        guidanceDate,

   } = req.body;

   try{

        const updateguidance = await guidanceModel.findByIdAndUpdate(id,
            {
                studentGName,
                guidanceTitle,
                guidanceDiscription,
                guidanceDate,
            },
            {new:true}
        );

        if(!updateguidance){
            return res.status(404).json({message:"Guidance not found and cannot update"});
        }

        return res
            .status(200)
            .json({message:"Guidance found and successfully update",updateguidance});
   }catch(error){
        console.log("Error fetching donations:",error.message);
        return res.status(500).json({message:"Internal server Error"});
   }

};

exports.addGuidance = addGuidance;
exports.displayGuidance = displayGuidance;
exports.displayByIDGuidance = displayByIDGuidance;
exports.deleteGuidance = deleteGuidance;
exports.updateGuidance = updateGuidance;



