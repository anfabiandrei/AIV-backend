const path = require("path");

const packageFiles = {
    General: { path: path.resolve(__dirname, '../files/Quick_Raise_General_Templates.zip'), name: 'Quick_Raise_General_Templates.zip' },
    Financials: { path: path.resolve(__dirname, '../files/Quick_Raise_Financials_Template.zip'), name: 'Quick_Raise_Financials_Template.zip' },
    'Technical Q&A': { path: path.resolve(__dirname, '../files/Quick_Raise_Technical_Q&A.zip'), name: 'Quick_Raise_Technical_Q&A.zip' },
    Legal: { path: path.resolve(__dirname, '../files/Quick_Raise_Legal_Pack.zip'), name: 'Quick_Raise_Legal_Pack.zip' }
};

module.exports = {
    packageFiles,
};