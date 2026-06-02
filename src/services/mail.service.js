const nodemailer = require("nodemailer");

// Create Ethereal transporter
async function createTransporter() {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
}

// TEST EMAIL
async function sendTestEmail(toEmail) {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
        from: "auth@test.dev",
        to: toEmail,
        subject: "Test Email",
        html: "<h1>Hello from Node.js 🚀</h1>"
    });

    console.log("📩 PREVIEW URL:");
    console.log(nodemailer.getTestMessageUrl(info));
}

// VERIFICATION EMAIL
async function sendVerificationEmail(email, token) {
    const transporter = await createTransporter();

    const link = `${process.env.BASE_URL}/api/users/verify/${token}`;

    const info = await transporter.sendMail({
        from: "auth@test.dev",
        to: email,
        subject: "Verify your account",
        html: `
            <h2>Welcome 👋</h2>
            <p>Please verify your account:</p>
            <a href="${link}">Click here to verify</a>
        `
    });

    console.log("📩 VERIFY EMAIL PREVIEW:");
    console.log(nodemailer.getTestMessageUrl(info));
}

module.exports = {
    sendTestEmail,
    sendVerificationEmail
};