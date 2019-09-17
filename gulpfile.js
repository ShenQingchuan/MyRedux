const gulp = require('gulp');
const exec = require('gulp-exec');
const ts = require('gulp-typescript');
const tsproject = ts.createProject('tsconfig.json');

// 0. 第一步：清空 dist 文件夹：
const clean = require('gulp-clean');//清理文件或文件夹
gulp.task('clean',function(){
  return gulp.src('dist/',{
    read: false, 
    allowEmpty: true,
  })
  .pipe(clean());
})

// 2. 第二步是直接 tsc 编译typescript 到 es5目标
gulp.task('tsc', function() {
  return tsproject.src()
  .pipe(tsproject())
  .js.pipe(gulp.dest('dist'));
});

// 3. Run 一下 Test测试吧！
gulp.task('test', function() {
  var reportOptions = {
  	err: true, // default = true, false means don't write err
  	stderr: true, // default = true, false means don't write stderr
  	stdout: true // default = true, false means don't write stdout
  };

  return gulp.src('./')
  .pipe(exec('node ./dist/test/RunTest.js'))
  .pipe(exec.reporter(reportOptions));
});

gulp.task('default',gulp.series('clean', 'tsc', 'test'));
