
const yargs = require('yargs');
const fs = require('fs-extra');
const replace = require('replace-in-file');
const gulp = require('gulp');
const babel = require("gulp-babel");
const concat = require('gulp-concat');
const cheerio = require('cheerio')

const handleCopyFolder = (targetFolder, choosenFolderName) => {
    const folderName = choosenFolderName.toLocaleLowerCase();
    fs.copy(`template/${targetFolder}`, `src/${targetFolder}/${folderName}`)
        .then(() => {
            replace.sync({
                files: `${targetFolder}/${folderName}/*`,
                from: 'TEMPLATE',
                to: folderName
            });
            console.log('Create file success !');
        })
        .catch((error) => {
            console.log('Sorry something went wrong !');
            console.log(error);
        });
}

const appendHtmlToFile = (fromFile, toFile) => {
    const fileContent = fs.readFileSync(fromFile, 'utf8');
    fs.appendFileSync(toFile, fileContent);
}

const buildHtml = (folderName) => {
    fs.readFile(`src/pages/${folderName}/index.html`, 'utf8', (error, content) => {
        if (!error) {
            let listComponent = [];
            const $ = cheerio.load(content);
            $('div.include').each(function(index, element) {
                const componentSrc = $(this).data('source').replace('../../', 'src/');
                const classList = $(element).attr('class');
                const component = {
                    src: componentSrc,
                    class: classList
                };
                listComponent.push(component);
            });
            if (fs.existsSync(`dist/${folderName}.html`)) {
                fs.unlinkSync(`dist/${folderName}.html`);
            }
            appendHtmlToFile('template/_header.html', `dist/${folderName}.html`);
            listComponent.map(component => {
                const content = fs.readFileSync(component.src, 'utf8');
                const $ = cheerio.load(content);
                const html = `<div class="${component.class}">\n${$('body').html().trim('\n')}</div>\n`;
                fs.appendFileSync(`dist/${folderName}.html`, html);
            });
            appendHtmlToFile('template/_footer.html', `dist/${folderName}.html`);
        }
    });
}

const scanDir = () => {
    const pageList = fs.readdirSync('src/pages');

    return pageList;
}

yargs.command({
    command: 'cc',
    describe: 'Copy new component from template',
    builder: {
        name: {
            describe: 'Component name',
            alias: 'n',
            demandOption: true
        }
    },
    handler: function (argv) {
        handleCopyFolder('components', argv.name);
    }
})
.command({
    command: 'cp',
    describe: 'Copy new page from template',
    builder: {
        name: {
            describe: 'Page name',
            alias: 'n',
            demandOption: true
        },
        component: {
            describe: 'Components list',
            alias: 'c',
            demandOption: false
        }
    },
    handler: function (argv) {
        handleCopyFolder('pages', argv.name);
        const componentList = argv.component.split(',');
        const componentScriptList = [];
        componentList.map(component => {
            const assetPath = `src/components/${component}/assets`;
            const scriptPath = `src/components/${component}/app.js`;
            if (fs.existsSync(assetPath)) {
                fs.copySync(assetPath, `src/pages/${argv.name}/assets`);
            }
            if (fs.existsSync(scriptPath)) {
                componentScriptList.push(scriptPath);
            }
        });
        gulp.task('build-js', () => {
            return gulp.src(componentScriptList)
                .pipe(babel())
                .pipe(concat('app.js'))
                .pipe(gulp.dest(`src/pages/${argv.name}`))
        });
        gulp.start('build-js');
    }
})
.command({
    command: 'build',
    describe: 'Build html page',
    handler: function(argv) {
        const dirList = scanDir();
        dirList.map(dirName => {
            buildHtml(dirName);
        });
    }
})
.help()
.argv;
