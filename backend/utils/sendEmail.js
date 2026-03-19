const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 10000 // 10 seconds
        });

        // OPTIONAL: verify (safe to keep but wrapped)
        await transporter.verify();
        console.log('✅ SMTP Connection Established');

        const mailOptions = {
            from: `FlockPilot <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);

        return info;
    } catch (error) {
        console.error('❌ Email Send Error:', error);
        throw error;
    }
};

module.exports = sendEmail;
