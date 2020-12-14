import { workshopModel } from "../../models/workshop";
import axios from "axios";
import { DEFAULT_AXIOS_OPTIONS, paypalApiUrl } from "../../paypal/constants";
import { orderModel, paymentStatusCodes } from "../../models/order";

export async function createOrder(orderDetails) {
    const { workshopID, eventID, participants, user, affiliate } = orderDetails;

    console.log(workshopID);

    let workshop = await workshopModel.findOne({ _id: workshopID }), price = 0;

    if (!workshop)
        throw new Error("Didn't find specified workshop");

    workshop.events.forEach((event) => {
        if (event._id.toString() === eventID)
            price = event.price;
    });

    if (price === 0)
        throw new Error("Didn't find specified event");
    if (participants <= 0)
        throw new Error("Participants needs to be greater than 0");

    const paypalOrder = await createPaypalOrder({ ...orderDetails, price }, workshop);

    let order = new orderModel({
        order: paypalOrder.id,
        workshop: workshopID,
        event: eventID,
        user: user._id,
        status: paymentStatusCodes.PENDING,
        affiliate,
        price
    });

    await order.save();

    console.log(`Created order with a price of ${participants * price} for workshop ${workshopID} with title ${workshop.title}`);

    return paypalOrder.id;
}

async function createPaypalOrder(orderDetails, workshop) {
    const { workshopID, eventID, participants, price } = orderDetails;

    const { data } = await axios.post(paypalApiUrl("/v2/checkout/orders"), {
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
    }, DEFAULT_AXIOS_OPTIONS);

    return data;
}