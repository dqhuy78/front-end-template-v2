const fs = require('fs');
const DomParser = require('dom-parser');
const async = require('async');

const targetFile = JSON.parse(fs.readFileSync('config.json', 'utf8')).source;
const handleCreateHtmlBuild = (pageName, componentList) => {
    async.map(componentList, (filePath, cb) => {
        fs.readFile(filePath, 'utf8', cb);
    }, (error, result) => {
        if (!error) {
            let htmlBody;
            result.map(htmlString => {
                const parser = new DomParser();
                const docObject = parser.parseFromString(htmlString);
                const body = docObject.getElementsByTagName('body')[0].innerHTML;
                htmlBody += body;
            });
            const parser = new DomParser();
            const headerHtml = parser.parseFromString(fs.readFile('template/_header.html', 'utf8', (error, result) => result));
            const footerHtml = parser.parseFromString(fs.readFile('template/_footer.html', 'utf8', (error, result) => result));
            fs.appendFile(`dist/${pageName}.html`, `${headerHtml}\n${htmlBody.replace(new RegExp('undefined', 'g'))}\n${footerHtml}`, (error) => {
                if (!error) {
                    console.log('Combine file success');
                } else {
                    console.log('Something went wrong while combine file');
                }
            });
        } else {
            console.log('Sorry something went wrong !');
        }
    });
}
const handleReadStruct = (filePath) => {
    const jsonObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const pageName = jsonObj.name;
    const componentList = jsonObj.content;
    handleCreateHtmlBuild(pageName, componentList);
}

targetFile.map(filePath => {
    handleReadStruct(filePath);
});
