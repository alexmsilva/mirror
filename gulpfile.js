var gulp = require("gulp"),
	imagemin = require("gulp-imagemin"),
	clean = require("gulp-clean"),
	concat = require("gulp-concat"),
	htmlReplace = require("gulp-html-replace"),
	uglify = require("gulp-uglify"),
	usemin = require("gulp-usemin"),
	cssmin = require("gulp-cssmin"),
	browserSync = require("browser-sync"),
	jshint = require("gulp-jshint"),
	jshintStylish = require("jshint-stylish"),
	csslint = require("gulp-csslint"),
	autoprefixer = require("gulp-autoprefixer"),
	less = require("gulp-less");


// tarefa executada quando nenhuma tarefa for especificada no comando
gulp.task("default", ['copy'], function() {
	gulp.start("build-img", "build-html");
});

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

// Altera as inclusões de js e css no html
gulp.task("build-html", function() {
	gulp.src("dist/**/*.html")
		.pipe(usemin({
			js: [uglify],
			css: [autoprefixer, cssmin]
		}))
		.pipe(gulp.dest("dist"));
});

// Melhor módulo do gulp... 
// Cria um servidor temporário e syncroniza todos os browsers abertos usando esse servidor
gulp.task("server", function() {
	// a porta pradrão do servidor é a 3000
	browserSync.init({
		server: {
			baseDir: "src"
		}
	});

	// escuta apenas os arquivos js para mostrar erros no terminal
	gulp.watch("src/js/**/*.js").on("change", function(event) {
		gulp.src(event.path) // event.path = nome do arquivo que foi alterado
			.pipe(jshint())
			.pipe(jshint.reporter(jshintStylish));
	});

	// escuta arquivos css para mostrar erros no terminal
	gulp.watch("src/css/**/*.css").on("change", function(event) {
		gulp.src(event.path)
			.pipe(csslint())
			.pipe(csslint.reporter());
	});

	// compila o arquivo less e transforma em css
	gulp.watch("src/less/**/*.less").on("change", function(event) {
	   gulp.src(event.path)
			.pipe(less().on("error", function(error) {
				console.log(error.message);
			}))
			.pipe(gulp.dest("src/css"));
	});

	// escutador para disparar o evento change e dar reload no browser automático quando o código for alterado
	gulp.watch("src/**/*").on("change", browserSync.reload);
});