import { workshopModel } from "../../models/workshop";
import { DEFAULT_AXIOS_OPTIONS } from "../constants";
import axios from "axios";

export async function handleOrderApproved(webhook) {

    let purchase_unit = webhook.resource.purchase_units[0], workshopID = purchase_unit.reference_id.split("-")[0], eventID = purchase_unit.reference_id.split("-")[1];

    let workshop = await workshopModel.findOne({ _id: workshopID });
    let event = workshop.events.filter(e => e._id == eventID)[0];
    let participants = purchase_unit.items.map(a => a.quantity).reduce((a, b) => a + b);

    console.logFull(webhook);

    if (purchase_unit.amount.value != event.price * participants) {
        console.error("INVALID PURCHASE");
        // ToDo: invalid purchase
    } else {
        console.info("VALID_PURCHASE");
        try {
            await captureOrder(webhook);
        } catch (e) {
            // ToDo: handle error
        }
    }

}

export async function captureOrder(webhook) {

    if (webhook.resource.intent !== "CAPTURE")
        return true;

    const url = webhook.resource.links.filter(l => l.rel == "capture")[0].href;

    await axios.post(url, {}, DEFAULT_AXIOS_OPTIONS); 

}