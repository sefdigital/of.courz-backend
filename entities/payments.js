import axios from "axios";
import { workshopModel } from "../models/workshop";

const PAYPAL_BASE_PATH = process.env.PAYPAL_BASE_PATH, PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID,
    PAYPAL_SECRET = process.env.PAYPAL_SECRET;

const DEFAULT_API_HEADER = {
    "Content-Type": "application/json",
    "Authorization": `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`
}

function paypalApiUrl(path) {
    return PAYPAL_BASE_PATH + path;
}

export const mutations = {

    createOrder: async (parent, { workshopID, eventID, participants }) => {

        let workshop = await workshopModel.findOne({ _id: workshopID }), price = 0;

        if (!workshop)
            throw new Error("Didn't find specified workshop");

        workshop.events.forEach((event) => {
            if (event._id == eventID)
                price = event.price;
        });

        if (price === 0)
            throw new Error("Didn't find specified event");
        if (participants <= 0)
            throw new Error("Participants needs to be greater than 0");

        let { data } = await axios.post(paypalApiUrl("/v2/checkout/orders"), {
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        amount: {
                            currency_code: "EUR",
                            value: price * participants,
                            breakdown: {
                                item_total: {
                                    currency_code: "EUR",
                                    value: price * participants,
                                }
                            }
                        },
                        description: "Ihre Bestellung bei SEF Workshops. ",
                        items: [{
                            name: `${workshop.title} Workshop`,
                            unit_amount: {
                                currency_code: "EUR",
                                value: price
                            },
                            quantity: participants
                        }]
                    }]
            },
            {
                headers: DEFAULT_API_HEADER,
            });


        return data.id;
    }

}