const { Router } = require('express')
const Shop = require('../models').Shop
const Product = require('../models').Product
const auth = require("../authorization/middleware")


const router = new Router()

router.post('/shops', auth, (req, res, next) => {

    Shop
        .create(req.body)
        .then(shop => {
            if (!shop) {
                return res.status(404).send({
                    message: `shop does not exist`
                })
            }
            return res.status(201).send(shop)
        })
        .catch(error => next(error))
})

router.get('/shops', (req, res, next) => {
    Shop
        .findAll()
        .then(shops => {
            res.send(shops)
        })
        .catch(err => {
            res.status(500).send({
                message: 'Something went wrong',
                error: err
            })
        })
})

router.get('/shops/:id', (req, res, next) => {
    Shop
        .findByPk(req.params.id, { include: [Product] })
        .then(shop => {
            if (!shop) {
                return res.status(404).send({
                    message: `shop does not exist`
                })
            }
            return res.send(shop)
        })
        .catch(error => next(error))
})

router.put('/shops/:id', auth, (req, res, next) => {
    Shop
        .findByPk(req.params.id)
        .then(shop => {
            if (!shop) {
                return res.status(404).send({
                    message: `shop does not exist`
                })
            }
            return shop.update(req.body)
                .then(shop => res.send(shop))
        })
        .catch(error => next(error))
})

router.delete('/shops/:id', auth, (req, res, next) => {
    Shop
        .findByPk(req.params.id)
        .then(shop => {
            if (!shop) {
                return res.status(404).send({
                    message: 'shop does not exist'
                })
            }
            return shop.destroy()
                .then(() => res.send({
                    message: 'shop was deleted'
                }))
        })
        .catch(error => next(error))
})

module.exports = router