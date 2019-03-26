
const yargs = require('yargs');
const fs = require('fs-extra');
const replace = require('replace-in-file');

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
        }
    },
    handler: function (argv) {
        handleCopyFolder('pages', argv.name);
    }
})
.help()
.argv;
