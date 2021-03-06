import * as functions from "firebase-functions";

export const PAYPAL_BASE_PATH = functions.config().paypal.basepath, PAYPAL_CLIENT_ID = functions.config().paypal.clientid,
    PAYPAL_SECRET = functions.config().paypal.secret;

export const DEFAULT_API_HEADER = {
    "Content-Type": "application/json",
    "Authorization": `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`
};

export const DEFAULT_AXIOS_OPTIONS = {
    headers: DEFAULT_API_HEADER,
};

export function paypalApiUrl(path) {
    return PAYPAL_BASE_PATH + path;
}