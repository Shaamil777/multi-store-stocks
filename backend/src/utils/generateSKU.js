const crypto = require('crypto');

const generateSKU = (brand,category)=>{
    const brandCode = brand.substring(0,3).toUpperCase();
    const categoryCode = category.substring(0,3).toUpperCase();
    const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    return `${brandCode}-${categoryCode}-${randomCode}`
}

module.exports = generateSKU