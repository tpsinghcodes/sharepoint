import User from "@models/user";
import { connectToDB } from "@utils/database";
import bcrypt from 'bcrypt'

export const POST = async (request) => {
    const { username, password } = await request.json();
    const email = `${username}@${username}.com`
    const image = "image"
    const hashedPassword = await bcrypt.hash(password, 12)	
    try {
        await connectToDB();
        const newUser = new User({ username, password:hashedPassword, email, image });

        await newUser.save();
        return new Response(JSON.stringify(newUser), { status: 201 })
    } catch (error) {
        return new Response(error+"Failed to create a new prompt", { status: 500 });
    }
}
