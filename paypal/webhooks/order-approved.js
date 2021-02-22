import { DEFAULT_AXIOS_OPTIONS } from "../constants";
import axios from "axios";
import { orderModel, paymentStatusCodes } from "../../models/order";

export async function handleOrderApproved(webhook) {

    let purchase_unit = webhook.resource.purchase_units[0],
        order = await orderModel.findOne({ _id: webhook.resource.id }).exec();

    if (purchase_unit.amount.value != order.price / 100) {
        console.error(`INVALID PURCHASE ${order?._id}`);
        // ToDo: invalid purchase
    } else {
        console.info(`VALID PURCHASE ${order._id}`);

        order.updateStatus(paymentStatusCodes.PAYED).save();

        try {
            if (purchase_unit.payments?.captures[0]?.status !== "COMPLETED")
                await captureOrder(webhook);
        } catch (e) {
            console.log(`error occurred when handling capturing for order ${order._id}`);
            // ToDo: handle error
        }
    }

}

export async function captureOrder(webhook) {

    console.log(`CAPTURING FUNDS FOR ${webhook.resource.id}`);

    if (webhook.resource.intent !== "CAPTURE")
        return true;

    const url = webhook.resource.links.filter(l => l.rel == "capture")[0].href;

    await axios.post(url, {}, DEFAULT_AXIOS_OPTIONS);

}