const path = require('path');

module.exports = {

    uploadDir: path.join(__dirname, '../public/product_images/'),

    isEmpty: function(obj){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    }
}