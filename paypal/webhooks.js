import axios from "axios";
import { DEFAULT_API_HEADER, paypalApiUrl } from "./constants";
import { handleOrderApproved } from "./webhooks/order-approved";
import * as functions from "firebase-functions";

// ToDo: API idempotency https://developer.paypal.com/docs/platforms/develop/idempotency/

export function handleWebhook(req, res) {

    validateWebhook(req.body, req.headers).then(valid => {
        if (valid)
            handleWebhookEvents(req.body);
        else
            console.error("RECEIVED INVALID WEBHOOK");
    });

    res.status(204).send();
}

function handleWebhookEvents(webhook) {
    switch (webhook.event_type) {
        case "CHECKOUT.ORDER.APPROVED":
            handleOrderApproved(webhook);
            break;
        default:
            console.log("Received unsupported webhook", webhook.event_type);
    }
}

// validate webhook with paypal webhook api
async function validateWebhook(body, header, retries = 10) {

    try {
        let { data } = await axios.post(paypalApiUrl("/v1/notifications/verify-webhook-signature"), {
            transmission_id: header["paypal-transmission-id"],
            transmission_time: header["paypal-transmission-time"],
            cert_url: header["paypal-cert-url"],
            auth_algo: header["paypal-auth-algo"],
            transmission_sig: header["paypal-transmission-sig"],
            webhook_id: functions.config().paypal.webhookid,
            webhook_event: body
        }, { headers: DEFAULT_API_HEADER, });

        if (data.verification_status !== "SUCCESS")
            throw new Error("Webhook not valid");

        return true;
    } catch (e) {
        if (retries < 0) return false;
        else return await new Promise(function (resolve) {
            console.log("RETRYING WEBHOOK");
            setTimeout(async function () {
                const a = await validateWebhook(body, header, retries - 1);
                resolve(a);
            }, 2500);
        });
    }
}