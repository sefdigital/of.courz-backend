import mailjet from "node-mailjet";

const mailjetClient = mailjet.connect(process.env.MAILJET_PUBLIC, process.env.MAILJET_PRIVATE);

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