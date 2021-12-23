import dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";

import cleanCss from "gulp-clean-css"; // Сжатие CSS файла
import webpCss from "gulp-webpcss"; // Вывод WEBP изображений
import autoPrefixer from "gulp-autoprefixer"; // Добавление вендарных префиксов
import groupCssMediaQueries from "gulp-group-css-media-queries"; // Группировка медиа запросов

const scss = gulpSass(dartSass);

export const sass = () => {
  return (
    app.gulp
      .src(app.path.src.sass, { sourcemaps: app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "SaSS",
            message: "Error: <%= error.message %>",
          })
        )
      )
      .pipe(app.plugins.replace(/@img\//g, "../img/"))
      .pipe(
        scss({
          outputStyle: "expanded",
        })
      )
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
      .pipe(
        app.plugins.if(
          app.isBuild,
          webpCss({
            webpClass: ".webp",
            noWebpClass: ".no-webp",
          })
        )
      )
      .pipe(
        app.plugins.if(
          app.isBuild,
          autoPrefixer({
            grid: true,
            overrideBrowserlist: ["last 3 versions"],
            cascade: true,
          })
        )
      )
      // Раскомментировать если нужен не сжатый дубль файла стилей
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.if(app.isBuild, cleanCss()))
      .pipe(
        rename({
          extname: ".min.css",
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream())
  );
};
