const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const resizeiImg = require('resize-img');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const {isEmpty, uploadDir} = require('../../helper/upload');
const fs = require('fs');

router.get('/', (req, res) => {
    var count;
    Product.count(function(err, c) {
        count = c;
    });

    Product.find(function(err, products){
        res.render('admin/products/products', {
            method: "Admin Products",
            count: count,
            products: products,
            layout: "./layouts/admin",
        });
    });
});

router.get('/add-product', (req, res) => {
    Category.find(function(err, categories){
        res.render('admin/products/add_product', {
        method: "Admin Product | Add",
        categories: categories,
        layout: "./layouts/admin",
    });
    });
});


router.post('/add-product', (req, res) => {
    let filename = "";
    const errors = [];
    let title = req.body.title;
    let desc = req.body.desc;
    let price = parseFloat(req.body.price).toFixed(2);

    if(!title){
        errors.push({message: 'Title Field Is Required'})
    }
    if(!desc){
        errors.push({message: 'Description Field Is Required'})
    }
    if(!price){
        errors.push({message: 'Price Field Is Required'})
    }

    if(!isEmpty(req.files)){
        let file = req.files.image;
        filename = Date.now() + "-" + file.name;
        file.mv('./public/product_images/' + filename, (err) => {
            return err;
        })
    }


    if(errors.length > 0){
        res.render('admin/products/add_product', {
            method: "Admin Product | Add",
            errors: errors,
            layout: "./layouts/admin",
            title: title,
            content: content,
            slug: slug
        });
    }else {
        Product.findOne({slug: req.params.slug}).then(product => {
            if(product){
                req.flash('danger', `${product.title} exists, please choose another`);
                res.redirect('/admin/products/add-product');
            }else {
                const newProduct = new Product({
                    title: title,
                    desc: desc,
                    slug: title.replace(/\s+/g, '-').toLowerCase(),
                    price: price,
                    category: req.body.category,
                    image: filename
                });
                newProduct.save().then(savedProduct => {
                    req.flash('success', `${savedProduct.title} successfully saved`);
                    res.redirect('/admin/products');
                }).catch(errors => {
                    console.log(errors);
                });
            }
        });
    }
});

router.get('/edit-product/:slug', (req, res) => {
    Category.find({}).then(categories => {
        Product.findOne({slug: req.params.slug}).then(products => {
            res.render('admin/products/edit_product', {
                layout: "./layouts/admin",
                method: "Admin Product | Edit",
                products: products,
                categories: categories
    
            })
        })
    })
})

router.post('/edit-product/:slug', (req, res) => {
    let filename = "";
          
    if(!isEmpty(req.files)){       
        let file = req.files.image;
        filename = Date.now() + "-" + file.name;
        file.mv('./public/product_images/' + filename, (err) => {
            if(err){
                return err;
            }
        });

    }
    Product.findOne({slug: req.params.slug}).then(products => {
        products.title = req.body.title;
        products.desc = req.body.desc;
        products.price = parseFloat(req.body.price).toFixed(2);
        products.image = filename,
        products.category = req.body.category;
  

        products.save().then(updatePost => {
            req.flash('success', `${products.title} updated successfully`);
            res.redirect('/admin/products');
        }).catch(error => {
            console.log(`Could not update post ${error}`);
        });
    });
});
router.delete('/delete-product/:id', (req, res) => {
    Product.findOne({_id: req.params.id}).then(product => {
        fs.unlink(uploadDir + product.image, (err) => {
            product.remove();
            req.flash('success', `${product.title} successfully deleted`);
            res.redirect('/admin/products');
        });
    });
});

module.exports = router;