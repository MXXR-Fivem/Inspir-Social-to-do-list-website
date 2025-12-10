const { transporter } = require("./config");

async function sendMail(to, sub, msg) {
    try {
        await transporter.sendMail({
            to: to,
            subject: sub,
            html: msg,
        });
    } catch(error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    sendMail,
}