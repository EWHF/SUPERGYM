// Определяем переменную "preprocessor"
let preprocessor = 'less'; // Выбор препроцессора в проекте - sass или less

const gulp = require('gulp');

// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Подключаем Browsersync
const browserSync = require('browser-sync').create();

// Подключаем gulp-concat
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass')(require('sass'));
const less = require('gulp-less');

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Подключаем модуль gulp-clean (вместо del)
const clean = require('gulp-clean');

const pug = require('gulp-pug');

const webp = require('gulp-webp');



function scripts() {
  return src([ // Берем файлы из источников
    'app/js/app.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
  ])
    .pipe(concat('app.min.js')) // Конкатенируем в один файл
    .pipe(uglify()) // Сжимаем JavaScript
    .pipe(dest('dist/js/')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

gulp.task('webp', function () {
  return gulp
    .src('app/images/*.jpg')
    .pipe(
      webp({
        quality: 90
      })
    )
    .pipe(gulp.dest('dist/images/'));
});


// Определяем логику работы Browsersync
function browsersync() {
  setTimeout(() => {
    browserSync.init({ // Инициализация Browsersync
      server: { baseDir: 'dist/' }, // Указываем папку сервера
      notify: false, // Отключаем уведомления
      online: true // Режим работы: true или false
    })
  }, 300);

}

async function pugToHtml() {
  return src('app/pug/*.pug')
    .pipe(
      pug({
        // Your options in here.
      })
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы;
}

function startwatch() {

  // Выбираем все файлы JS в проекте
  watch(['app/js/*.js'], scripts);

  // Мониторим файлы препроцессора на изменения
  // watch('app/**/' + preprocessor + '/**/*', styles);

  watch('app/less/*.less', styles);

  // Мониторим файлы HTML на изменения
  watch('app/pug/*.pug', pugToHtml);


}

function styles() {
  return src('app/less/styles.less') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
    .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss({ level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ })) // Минифицируем стили
    .pipe(dest('dist/css/')) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

// async function images() {
// 	imagecomp(
// 		"app/images/src/**/*", // Берём все изображения из папки источника
// 		"app/images/dest/", // Выгружаем оптимизированные изображения в папку назначения
// 		{ compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
// 		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
// 		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
// 		{ svg: { engine: "svgo", command: "--multipass" } },
// 		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
// 		function (err, completed) { // Обновляем страницу по завершению
// 			if (completed === true) {
// 				browserSync.reload()
// 			}
// 		}
// 	)
// }

function cleanimg() {
  return src('app/images/', { allowEmpty: true }).pipe(clean()) // Удаляем папку "app/images/dest/"
}

function buildcopy() {
  return src([ // Выбираем нужные файлы
    'app/less/**/*.less',
    'app/images/*.{svg, jpg, webp}',
    'app/fonts/*'
  ], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
    .pipe(dest('dist/')) // Выгружаем в папку с финальной сборкой
}

function cleandist() {
  return src('dist/', { allowEmpty: true }).pipe(clean()) // Удаляем папку "dist/"
}


// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспортируем функцию cleanimg() как таск cleanimg
exports.cleanimg = cleanimg;

// exports.webp = compileWebp;

exports.views = pugToHtml;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, startwatch);

// Создаем новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist, styles, scripts, pugToHtml, buildcopy, startwatch);