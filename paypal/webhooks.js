import { chainResolvers } from "apollo-server-cloud-functions";
import axios from "axios";
import { DEFAULT_API_HEADER, paypalApiUrl } from "./constants";
import { handleOrderApproved } from "./webhooks/order-approved";

export function handleWebhook(req, res) {
    validateWebhook(req.body, req.headers).then(valid => {
        if (valid)
            handleWebhookEvents(req.body);
        else
            console.error("recieved invalid webhook");
    })

    res.status(204).send();
}

function handleWebhookEvents(webhook) {
    switch (webhook.event_type) {
        case "CHECKOUT.ORDER.APPROVED": handleOrderApproved(webhook); break;
        default: console.log("Recieved unsupported webhook", webhook.event_type);
    }
}

// validate webhook with paypal webhook api
async function validateWebhook(body, header) {
    try {

        let { data } = await axios.post(paypalApiUrl("/v1/notifications/verify-webhook-signature"), {
            transmission_id: header['paypal-transmission-id'],
            transmission_time: header['paypal-transmission-time'],
            cert_url: header['paypal-cert-url'],
            auth_algo: header['paypal-auth-algo'],
            transmission_sig: header['paypal-transmission-sig'],
            webhook_id: process.env.PAYPAL_WEBHOOK_ID,
            webhook_event: body
        }, { headers: DEFAULT_API_HEADER, });

        if (data.verification_status !== "SUCCESS")
            throw new Error("Webhook not valid");
            
        return true;
    } catch (e) {
        return false;
    }
}