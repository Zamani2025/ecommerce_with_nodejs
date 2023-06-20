const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

router.get('/', (req, res) =>{
    Category.find({}).then(categories => {
        res.render('admin/categories/categories', {
            method: "Admin Categories",
            categories: categories
        });
    })

});

router.get('/add-category', (req, res) => {
    res.render('admin/categories/add_category', {
        method: "Admin Categories | Add"
    });
});

router.post('/add-category', (req, res) => {
    let title = req.body.title;
    let errors = [];
    if(!title){
        errors.push({message: 'Title field is required'});
    }

    if(errors.length > 0){
        res.render('admin/categories/add_category', {
            method: "Admin Categories | Add",
            title: title,
            errors: errors
        });
    }else {
        Category.findOne({title: title}).then(category => {
            if(category){
                req.flash('danger', `${category.title} exists, choose another`);
                res.redirect('/admin/categories/add-category');
            }else {
                const newCategory = new Category({
                    title: title,
                    slug: title.replace(/\s+/g, '-').toLowerCase()
                });
                newCategory.save().then(savedCategory => {
                    req.flash('success', `${savedCategory.title} saved successfully`);
                    res.redirect('/admin/categories');
                });
            }
        });
    }
});

router.get('/edit-category/:slug', (req, res) => {
    Category.findOne({slug: req.params.slug}).then(categories => {
        res.render('admin/categories/edit_category', {
            method: "Admin Categories | Edit",
            categories: categories
        });
    });
});

router.post('/edit-category/:slug', (req, res) => { 
    Category.findOne({slug: req.params.slug}).then(categories => {
        categories.title = req.body.title;
        categories.slug = req.body.title;

        categories.save().then(updateCategory => {
            req.flash('success', `${categories.title} updated successfully`);
            res.redirect('/admin/categories');
        });
    });  
});

router.post('/delete-category/:slug', (req, res)  => {
    Category.findOne({slug: req.params.slug}).then(categories => {
        categories.remove().then(removeCategory => {
            req.flash('success', `${categories.title} deleted successfully`);
            res.redirect('/admin/categories');
        });
    });
});


module.exports = router