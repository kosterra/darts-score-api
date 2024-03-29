module.exports = app => {
    const PlayerController = require("../controllers/player.controller");
    const FileController = require("../controllers/file.controller");
    const router = require("express").Router();
    const { body } = require("express-validator");
    const { commonValidation } = require("../validators/common.validation");

    // Create a new Player
    router.post('/',
        FileController.uploadProfileImage,
        [
          body('firstname', 'Use between 3 and 25 characters for firstname').isLength({ min: 3, max: 25 }),
          body('firstname', 'Use characters only for firstname').matches(/^[A-Za-zéèàäöü\s]+$/),
          body('lastname', 'Use between 3 and 25 characters for lastname').isLength({ min: 3, max: 25 }),
          body('lastname', 'Use characters only for lastname').matches(/^[A-Za-zéèàäöü\s]+$/),
          body('nickname', 'Use between 3 and 25 characters for nickname').isLength({ min: 3, max: 25 }),
          body('nickname', 'Use characters only for nickname').matches(/^[A-Za-zéèàäöü\s]+$/),
          commonValidation
        ],
        PlayerController.create);
  
    // Retrieve all Players
    router.get("/", PlayerController.findAll);
  
    // Search Players
    router.get("/search", PlayerController.findBySearchTerm);
    
    // Find Players by Ids
    router.post("/find", PlayerController.findByIds);

    // Retrieve a single Player with id
    router.get("/:id", PlayerController.findOne);
  
    // Update a Player with id
    router.put("/:id",
        FileController.deleteProfileImage,
        FileController.uploadProfileImage,
        [
          body('firstname', 'Use between 3 and 25 characters for firstname').isLength({ min: 3, max: 25 }),
          body('firstname', 'Use characters only for firstname').matches(/^[A-Za-zéèàäöü\s]+$/),
          body('lastname', 'Use between 3 and 25 characters for lastname').isLength({ min: 3, max: 25 }),
          body('lastname', 'Use characters only for lastname').matches(/^[A-Za-zéèàäöü\s]+$/),
          body('nickname', 'Use between 3 and 25 characters for nickname').isLength({ min: 3, max: 25 }),
          body('nickname', 'Use characters only for nickname').matches(/^[A-Za-zéèàäöü\s]+$/),
          commonValidation
        ],
        PlayerController.update);
  
    // Delete a Player with id
    router.delete("/:id",
        FileController.deleteProfileImage,
        PlayerController.delete
    );
  
    app.use("/api/players", router);
};