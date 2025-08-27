const express = require('express');
const router = express.Router();
const path = require('path');

const {
    addResources,
    displayResource,
    displayResourceByID,
    deleteResource,
    updateResource
} = require('../../controllers/Resources_con/resources_con');

router.get("/display", displayResource);
router.get('/getid/:id', displayResourceByID);
router.post('/add',addResources);
router.delete('/delete/:id', deleteResource);
router.put('/update/:id', updateResource);

module.exports = router;
