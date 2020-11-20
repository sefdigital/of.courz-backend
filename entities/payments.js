import axios from "axios";
import { workshopModel } from "../models/workshop";
import { DEFAULT_AXIOS_OPTIONS, paypalApiUrl } from "../paypal/constants";

export const mutations = {

    createOrder: async (parent, { workshopID, eventID, participants, affiliate }, { token }) => {

        // ToDo: implement affiliate

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
                        reference_id: `${workshopID}-${eventID}`,
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
        }, DEFAULT_AXIOS_OPTIONS );

        console.log(`Created order with a price of ${participants * price} for workshop ${workshopID} with title ${workshop.title}`)

        return data.id;
    }

}