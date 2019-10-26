const router = require('express').Router();
let Cart = require('../models/cart.model');

router.route('/').get((req, res) => {
    Cart.find()
        .then(carts => res.json(carts))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const num_items = Number(req.body.num_items);
    const alias_list = req.body.alias_list;

    const newCart = new Cart({
        username,
        num_items,
        alias_list
    });

    newCart.save()
    .then(() => res.json('Cart added!'))
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get((req, res) => {
    Cart.findByID(req.params.id)
    .then(cart => res.json(cart))
    .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:id').delete((req, res) => {
    Cart.findByIDandDelete(req.params.id)
    .then(cart => res.json('Cart deleted.'))
    .catch(err => res.status(400).json('Error ' + err));
});

router.route('/update/:id').post((req, res) => {
    Cart.findByID(req.params.id)
    .then(cart => {
        cart.username = req.body.username;
        cart.num_items = Number(req.body.num_items);
        cart.alias_list = Array(req.body.alias_list);

        cart.save()
        .then(() => res.json('Cart updated!'))
        .catch(err => res.status(400).json('Error ' + err));
    })
    .catch(err => res.status(400).json('Error '+ err));
});


module.exports = router;