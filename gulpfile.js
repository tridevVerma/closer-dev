const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
/**
 * Get all sass files
 * convert them to css
 * compress css files
 * save it to old assets folder
 * 
 * Get all css files
 * rename files with hash
 * store them to new public assets folder
 * map hashed css files in manifest.json
 * store all css in public assets folder
 */
gulp.task('css', async function(done){
    console.log('minifying css...');
    
    let rev = await import('gulp-rev');
    rev = rev.default;
    
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(rev.manifest(
        './public/assets/rev-manifest.json',
        {
            base: 'public/assets',
            merge: true
        }
    ))
    .pipe(gulp.dest('./public/assets'));
    done();
});

/**
 * Get all js files
 * compress js files using uglify-es
 * rename files with hash
 * store them to new public assets folder
 * map hashed js files in manifest.json
 * store all js in public assets folder
 */
gulp.task('js', async function(done){
    console.log('minifying js...');
    
    let rev = await import('gulp-rev');
    rev = rev.default;
    
    gulp.src('./assets/scripts/**/*.js')
    .pipe(terser())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/scripts'))
    .pipe(rev.manifest(
        './public/assets/rev-manifest.json',
        {
            base: 'public/assets',
            merge: true
        }
    ))
    .pipe(gulp.dest('./public/assets'));
    done()
});

/**
 * Get all images --> .png, .jpg, .gif, .svg, .jpeg
 * minify images with imagemin
 * rename images with hash
 * store them in public assets folder
 * map images with hash in manifest.json
 * restore them in public assets folder
 */
gulp.task('images', async function(done){
    console.log('compressing images...');

    let rev = await import('gulp-rev');
    rev = rev.default;

    let imagemin = await import('gulp-imagemin');
    imagemin = imagemin.default;

    gulp.src('./assets/images/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/images'))
    .pipe(rev.manifest(
        './public/assets/rev-manifest.json',
        {
            base: 'public/assets',
            merge: true
        }
    ))
    .pipe(gulp.dest('./public/assets'));
    done();
});


// empty the public/assets directory for each build run
gulp.task('clean', async function(done){
    const del = await import('del');
    del.deleteSync(['./public/assets', './rev-manifest.json']);
    done();
});

// combine all tasks together
gulp.task('build', gulp.series('clean', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});