const express = require('express')
const { requireSignin, adminMiddleware } = require('../controllers/auth')
const { create, list, read, remove } = require('../controllers/category')
const router = express.Router()

//validation
const {runValidation} = require('../validators')
const {categoryCreateValidator} = require('../validators/category')

router.post('/category', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create)
router.get('/categories', list)
router.get('/category/:slug', read)
router.delete('/category/:slug', requireSignin, adminMiddleware, remove)

module.exports = router

