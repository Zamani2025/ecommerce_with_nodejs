const express = require('express');
const router = express.Router();
const Page = require('../../models/Page');

router.get('/', (req, res) =>{
    Page.find({}).then(pages => { 
        res.render('admin/pages/pages', {
            method: "Admin Pages",
            pages: pages
        });
    });
});

router.get('/add-page', (req, res) =>{
    var title = '';
    var slug = '';
    var content = ''; 
    res.render('admin/pages/add_page', {
        method: "Admin Pages | Add",
        layout: './layouts/admin',
        title: title,
        slug: slug,
        content: content
    });
});

router.post('/add-page', (req, res) => {
    const errors = [];
    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == ""){
        slug = title.replace(/\s+/g, '-').toLowerCase();
    }
    let content = req.body.content

    if(!title){
        errors.push({message: 'Title Field Is Required'})
    }
    if(!content){
        errors.push({message: 'Content Field Is Required'})
    }

    if(errors.length > 0){
        res.render('admin/pages/add_page', {
            method: "Admin Page | Add",
            errors: errors,
            layout: "./layouts/admin",
            title: title,
            content: content,
            slug: slug
        });
    }else {
        Page.findOne({slug: slug}).then(page => {
            if(page){
                req.flash('danger', `${page.title} exists, please choose another`);
                res.redirect('/admin/pages/add-page');
            }else {
                const newPage = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                newPage.save().then(savedPage => {
                    req.flash('success', `${savedPage.title} successfully saved`);
                    res.redirect('/admin/pages');
                }).catch(errors => {
                    console.log(errors);
                });
            }
        });
    }
});

router.get('/edit-page/:slug', (req, res) => {
    Page.findOne({slug: req.params.slug}).then(pages => {
        res.render('admin/pages/edit_page', {
            method: "Admin Page | Edit",
            pages: pages
        });
    });
});

router.post('/edit-page/:slug', (req, res) => {
    Page.findOne({slug: req.params.slug}).then(pages => {

        pages.title = req.body.title;
        pages.slug = req.body.title;
        pages.content = req.body.content;
        pages.sorting = 0;

        pages.save().then(updatePage => {
            req.flash('success', `${pages.title} updated successfull`);
            res.redirect('/admin/pages')
        });
    });
});

router.post('/delete-page/:slug', (req, res) => {
    Page.findOne({slug: req.params.slug}).then(pages => {

        pages.remove().then(removePage => {
            req.flash('success', `${pages.title} deleted successfully`);
            res.redirect('/admin/pages')
        })
    })
});

router.post('/reorder-page', (req, res) => {
    var ids = req.body['id[]'];

    var count = 0;

    for(var i = 0; i < ids; i++){
        var id = ids[i];
        count++;

        (function(count){
            Page.findById(id, function(err, page){
                page.sorting = count;
                page.save(function(err){
                    console.log(err)
                }); 
            });
        })(count);
    }
    console.log(req.body);
});

module.exports = router;