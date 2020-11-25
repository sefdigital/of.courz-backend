
export const PAYPAL_BASE_PATH = process.env.PAYPAL_BASE_PATH, PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID,
    PAYPAL_SECRET = process.env.PAYPAL_SECRET;

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