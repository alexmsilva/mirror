var gulp = require("gulp"),
	imagemin = require("gulp-imagemin"),
	clean = require("gulp-clean"),
	concat = require("gulp-concat"),
	htmlReplace = require("gulp-html-replace"),
	uglify = require("gulp-uglify");

// tarefa executada quando nenhuma tarefa for especificada no comando
gulp.task("default", ['copy'], function() {
	gulp.start("build-img", "build-js", "build-html");
})

// Copia a pasta src para a pasta de districuição (dist)
// depende da tarefa clean
gulp.task("copy", ['clean'], function() {
	return gulp.src("src/**/*")
		.pipe(gulp.dest("dist")); // se não existir, a pasta é criada
});

// Apaga a pasta dist
gulp.task("clean", function() {
	// retorna o stream para sinalizar que esta tarefa não pode ser assíncrona
	return gulp.src("dist")
		.pipe(clean());
});

// Faz uma compactação de imagens usando o plugin imagemin do gulp 
// depende da tarefa copy
gulp.task("build-img", function() {
	gulp.src("dist/img/**/*")
		.pipe(imagemin())
		.pipe(gulp.dest("dist/img"));
});

// Concatena os arquivos JS na ordem especificada
gulp.task("build-js", function() {
	gulp.src(['dist/js/jquery.js', 'dist/js/home.js', 'dist/js/produto.js'])
		.pipe(concat("all.js"))
		.pipe(uglify())
		.pipe(gulp.dest("dist/js"));
});

// Altera as inclusões de js no html
gulp.task("build-html", function() {
	gulp.src("dist/**/*.html")
		.pipe(htmlReplace({
			js : "js/all.js"
		}))
		.pipe(gulp.dest("dist"));
});