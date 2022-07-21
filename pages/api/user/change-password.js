import { getSession } from "next-auth/client"

import { connectToDatabase } from "../../../lib/db"
import { hashPassword, verifyPassword } from "../../../lib/auth"


const handler = async (req, res) => {
    if (req.method !== "PATCH") {
        return
    }

    const session = await getSession({ req: req })

    if (!session) {
        res.status(401).json({ message: "User not authenticated" })
        return
    }

    const userEmail = session.user.email
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    const client = await connectToDatabase()
    const usersCollection = client.db().collection("users")

    const user = await usersCollection.findOne({ email: userEmail })

    if (!user) {
        res.status(401).json({ message: "User not found" })
        client.close()
        return
    }

    const currentPassword = user.password

    const passwordMatch = await verifyPassword(oldPassword, currentPassword)

    if (!passwordMatch) {
        res.status(403).json({ message: "password invalid" })
        client.close()
        return
    }

    const hashedPassword = await hashPassword(newPassword)

    await usersCollection.updateOne(
        { email: userEmail },
        { $set: { password: hashedPassword } })


    client.close()
    res.status(200).json({ message: "password successfully changed." })
}


export default handler