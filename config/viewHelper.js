const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = function(app){
    // return relative filename to views acc. to environment mode (development, production)
    // fileName --> actual filename, type --> type of file (css, js, image)
    app.locals.assetPath = function(fileName, type){
        if(env.name == 'development'){
            return `/${type}/${fileName}`;
        }

        const newFileName = `/${type}/${JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[fileName]}`;
        return newFileName;
    }
}