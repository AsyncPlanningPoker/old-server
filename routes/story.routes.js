const verifyJwt = require('../middlewares/verifyJwt')

module.exports = app => {
    const storyController = require("../controllers/storyController");
  
    var router = require("express").Router();
    
    
    router.use(verifyJwt)

    // New Story
    router.post("/", storyController.create);
    
    app.use('/api/story', router);
  };