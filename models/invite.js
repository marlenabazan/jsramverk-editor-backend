require('dotenv').config()

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const invite = {
    send: function send(req, res) {

        const mailgun = new Mailgun(formData);
        const client = mailgun.client({username: 'api', key: API_KEY});

        const recipient = req.body.recipient;
        const title = req.body.title;

        const messageData = {
        from: `Marlena's editor <mabn21@student.bth.se>`,
        to: `${recipient}`,
        subject: 'Shared document',
        text: `Marlena shared document "${title}" with you.\nRegister or log in to view or edit the document https://www.student.bth.se/~mabn21/editor/`
        };

        client.messages.create(DOMAIN, messageData)
        .then((res) => {
        console.log(res);
        })
        .catch((err) => {
        console.error(err);
        });
    }
}

module.exports = invite;