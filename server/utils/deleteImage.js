const fs = require('fs')

const deleteImage = (imageName) => {
    const imagePath = "./public/" + imageName
    fs.exists(imagePath, (exists) => {
        if (exists) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting the image:', err)
                    return
                }
                console.log(`Image ${imageName} deleted successfully.`)
            })
        } else {
            console.log('Image not found:', imageName)
        }
    })
}

module.exports = deleteImage
