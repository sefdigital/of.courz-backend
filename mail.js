import mailjet from "node-mailjet";
import { addDateTimeString } from "./models/workshop";

const mailjetClient = mailjet.connect(process.env.MAILJET_PUBLIC, process.env.MAILJET_PRIVATE);

export async function sendOrderSuccessfulMail(order) {
    try {
        await order.populate("user").populate("workshop").execPopulate();
        await order.workshop.populate("organizer").execPopulate();

        const event = order.workshop.getEventById(order.event._id);

        const variables = {
            "VNTrainer": order.workshop.organizer.firstName,
            "Voraussetzungen": order.workshop.requirements,
            "kursname": order.workshop.title,
            "NotizTrainer": event.notes || "0",
            "Terminliste": event.dates.map(addDateTimeString).map(d => d.timeString).join("<br>"),
            "Ort": event.privateLocation,
            "Einzelpreis": event.price / 100,
            "Menge": order.participants,
            "Gesamtpreis": order.price / 100,
            "Bestellnummer": order._id
        };

        await mailjetClient
            .post("send", { "version": "v3.1" })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "info@courz.de",
                            "Name": "of.courz"
                        },
                        "To": [
                            {
                                "Email": order.user.email,
                                "Name": order.user.firstName
                            }
                        ],
                        "TemplateID": 2446320,
                        "TemplateLanguage": true,
                        "Subject": `Buchungsbestätigung ${order.workshop.title} – of.courz`,
                        "Variables": variables
                    }
                ]
            });
    } catch (e) {
        console.log(`ERROR SENDING ORDER MAIL FOR ORDER ${order._id}`);
    }

}

export async function subscribeNewUser(mail, firstName) {
    const { body: data1 } = await mailjetClient
        .post("contact", { "version": "v3" })
        .request({
            "IsExcludedFromCampaigns": "true",
            "Name": mail,
            "Email": mail
        });

    const contactID = data1.Data[0].ID;

    await mailjetClient
        .put("contactdata", { "version": "v3" })
        .id(contactID)
        .request({
            "Data": [
                {
                    "Name": "vorname",
                    "Value": firstName
                }
            ]
        });

    await mailjetClient
        .post("contact", { "version": "v3" })
        .id(contactID)
        .action("managecontactslists")
        .request({
            "ContactsLists": [
                {
                    "Action": "addforce",
                    "ListID": "8949"
                }
            ]
        });
}