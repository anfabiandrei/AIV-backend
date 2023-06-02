const { packageFiles } = require('../config/files');

const getFile = (files) => {
    return files.reduce((p, n) => [...p, packageFiles[n]],[]).filter(file => file);
}

const getAttachments = (plan) => {
    return plan.reduce((p, n) => [...p, packageFiles[n]], []);
}

const getFileList = (plan) => {
    return plan.reduce((p, n) => p + ', ' + packageFiles[n].name + '.zip', '').slice(2);
}

const getSuggestedPacksList = (plan) => {
    const initialPacks = ['General', 'Financials', 'Technical Q&A'];
    let suggestedPacks = initialPacks.filter(pack => !plan.includes(pack));

    if (suggestedPacks.length === 2) {
        return suggestedPacks;
    } else {
        const packsSet = new Set([...suggestedPacks, ...initialPacks]);
        return [...packsSet].slice(0, 2);
    }
}

module.exports = {
    getFile,
    getFileList,
    getAttachments,
    getSuggestedPacksList
}