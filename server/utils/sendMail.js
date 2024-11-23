const nodemailer = require('nodemailer')

async function sendMail(to, subject, text){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'zhalgas.seidazym2005@gmail.com',
        pass: 'vayc essd annm vvgu'
        }
    })

    let mailOptions = {
        from: 'zhalgas.seidazym2005@gmail.com',
        to: to,         
        subject: subject, 
        text: text,       
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if(error) console.log(error)
        else console.log('Email sent: ' + info.response)
    })
}

module.exports = sendMail