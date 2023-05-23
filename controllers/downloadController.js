const zip = require('express-zip');
const { getFile } = require("../helpers/files");

const notificationController = {};

notificationController.send = async function (req, res) {
    const files = req.query.plan.split(',');
    const file = getFile(files);

    return file.length > 1
        ? res.status(200).zip(file, 'Quick_Raise_Templates.zip')
        : res.status(200).download(file[0].path);
};

module.exports = notificationController;
