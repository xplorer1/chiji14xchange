
module.exports = {
    'port': process.env.PORT || 9000,

    'database' : process.env.database_uri,

    'cloudinary': {
        'cloud_name': process.env['cloudinary.cloud_name'],
        'api_key': process.env['cloudinary.api_key'],
        'api_secret': process.env['cloudinary.api_secret']
    }
}