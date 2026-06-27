const express = require('express');
const { SearchController } = require('../../controllers');
const router = express.Router();

router.get('/cities', SearchController.searchCities);
router.get('/airports', SearchController.searchAirports);

module.exports = router;
