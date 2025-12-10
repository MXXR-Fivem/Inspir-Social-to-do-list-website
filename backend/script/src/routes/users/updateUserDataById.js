const express = require("express");
const router = express.Router();
const multer  = require("multer");
const cloudinary = require("../../config/cloudinary");
const { middleware } = require("../../middleware/middleware");
const { getUserInformations, updateUserInformations } = require("./users.query");
const { createError } = require("../../helperError/createError");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.put("/:id", middleware, upload.single("avatar"), async(req, res) => {
    try {
        if (!req.params["id"]) {
            const error = new Error("Id is required");
            error.statusCode = 400;
            error.code = "MISSING_FIELDS";
            throw error;
        }

        const {id, email, name, firstname, description, contactLink, photo} = req.body;
        let photoUrl = photo;

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'etodo/avatars',
                        public_id: `user-${id}-${Date.now()}`,
                        transformation: [
                            { width: 512, height: 512, crop: 'fill', gravity: 'face' },
                            { quality: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(req.file.buffer);
            });

            photoUrl = uploadResult.secure_url;

            if (photo && photo !== "/default-avatar.png" && photo.includes('cloudinary')) {
                try {
                    const publicId = photo.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch(error) {
                    console.log("Error deleting old image from Cloudinary:", error);
                }
            }
        }

        await updateUserInformations(id, email, name || "", firstname || "", description || "", contactLink || "", photoUrl);
        const data = await getUserInformations(id, null);

        res.status(200).json({
            success: true,
            message: "Success updated user data",
            code: "SUCCESS_UPDATE_USER_DATA",
            data: data[0],
        });
    } catch(error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
            code: error.code || "INTERNAL_ERROR"
        });
    }
});

module.exports = router;