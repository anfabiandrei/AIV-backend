const path = require("path");
const fs = require("fs");

const { getFileList, getSuggestedPacksList } = require("../helpers/files");

const downloadLink = (order, plan, payment_method) =>
  `${process.env.HOST}/download?id=${order}&method=${
    payment_method
  }&plan=${encodeURIComponent(plan)}`;

const replaceTemplates = async function (order, plan, payment_method) {
  const packs = getSuggestedPacksList(plan);

  let general = !packs.includes("General")
    ? ""
    : fs.readFileSync(
        path.join(__dirname, "../files/newsletter/templates/general.html"),
        "utf8"
      );
  let financials = !packs.includes("Financials")
    ? ""
    : fs.readFileSync(
        path.join(__dirname, "../files/newsletter/templates/financials.html"),
        "utf8"
      );
  let technical = !packs.includes("Technical Q&A")
    ? ""
    : fs.readFileSync(
        path.join(__dirname, "../files/newsletter/templates/technical.html"),
        "utf8"
      );

  const page = fs.readFileSync(
    path.join(__dirname, "../files/newsletter/templates/index.html"),
    "utf8"
  );

  const websiteUrl = `${process.env.REACT_APP_URL}/pricing`;

  general = general.replace(
    /#{cidChecked}/g,
    `${process.env.IMAGE_HOST}images/checked.png`
  );
  financials = financials.replace(
    /#{cidChecked}/g,
    `${process.env.IMAGE_HOST}images/checked.png`
  );
  technical = technical.replace(
    /#{cidChecked}/g,
    `${process.env.IMAGE_HOST}images/checked.png`
  );

  return page
    .replace("#{description}", "")
    .replace("#{table1}", general || financials)
    .replace("#{table2}", technical || financials)
    .replace(/#{websiteUrl}/g, websiteUrl)
    .replace("#{downloadUrl}", downloadLink(order, plan, payment_method))
    .replace("#{orderNumber}", order)
    .replace("#{packName}", `${getFileList(plan)}`)
    .replace(/#{cidFolder}/g, `${process.env.IMAGE_HOST}images/folder.png`)
    .replace(/#{cidLogo}/g, `${process.env.IMAGE_HOST}images/logo.png`)
    .replace(/#{fontBaseUrl}/g, `${process.env.IMAGE_HOST}fonts`);
};

module.exports = { replaceTemplates };
