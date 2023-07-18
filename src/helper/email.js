const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'vincent.ernser@ethereal.email',
        pass: 'kNyBJWursejg8jTQMj'
    }
});


const emailWithNodemailler = async(mailData)=>{

        try {           
            const mailOption = {
                from: 'vincent.ernser@ethereal.email', // sender address
                to: mailData.email, // list of receivers
                subject: mailData.subject, // Subject line
                html: mailData.html, // html body
            }

            const info = await transporter.sendMail(mailOption)
            console.log(info.response)

        } catch (error) {   
            console.log(error)
            throw error
        }
}

module.exports = emailWithNodemailler;