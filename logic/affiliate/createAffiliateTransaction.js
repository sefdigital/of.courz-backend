import { accountModel } from "../../models/account";
import { transactionModel, transactionTypes } from "../../models/transaction";

export async function createAffiliateTransaction({ amount, user }) {

    let account = await getUserAccount(user);

    account.balance += amount;

    const transaction = new transactionModel({
        type: transactionTypes.AFFILIATE,
        account: account._id,
        amount,
    });

    transaction.save();
    account.save();

}

async function getUserAccount(user) {
    let account = await accountModel.findOne({ user });

    if (!account)
        account = new accountModel({ user });

    console.log(account);

    return account;
}