import { connectToDatabase } from "../../../lib/db"
import { hashPassword } from "../../../lib/auth"


const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body

        if (!email || !email.includes("@") ||
            !password || password.trim().length < 8
        ) {
            res.status(422).json({ message: "Password should be at least 8 characters" })
            return
        }

        const client = await connectToDatabase()
        const db = client.db()

        const exitentUser = await db.collection("users").findOne({ email: email })
        if (exitentUser) {
            res.status(422).json({ message: "User already exist!" })
            client.close()
            return
        }

        const hashedPassword = await hashPassword(password)

        const response = await db.collection("users").insertOne({
            email: email,
            password: hashedPassword
        })
        console.log(response)

        res.status(200).json({ message: "Successfully SingedUp" })
        client.close()
    }
}

export default handler