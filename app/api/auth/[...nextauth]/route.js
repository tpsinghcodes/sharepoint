import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from '@utils/database'
import User from '@models/user';
import { compare } from 'bcrypt'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      CredentialsProvider({       
                 
        name: "credentials",
        credentials: {},
        // credentials: {
        //   username: { label: "Username", type: "text", placeholder: "jsmith" },
        //   password: { label: "Password", type: "password" }
        // },
        async authorize(credentials, req){  
            await connectToDB();            
            const {username, password} = credentials         
            const userData = await User.findOne({username})
            if(!userData){
                return null
            }
            const isPasswordCorrect = await compare(
                password,
                userData.password
            )
            
            if(!isPasswordCorrect){
                return null
            }
            if(userData){
                const userInfo = {
                    name: userData.username,
                    email:userData.email,
                    picture:userData.image,
                    id:userData._id.toString(),
                }
                return userInfo
            }
            return null
            
        }
    })
    ],
    pages:{
      signIn: '/signin',
      //signOut: '/auth/signout',
      //error: '/auth/error',
    },
    session: {
      strategy: "jwt",
      maxAge: 10 * 60,   
    },
    jwt: {        
        maxAge: 10 * 60,        
    },
    callbacks: {
      // This will be use if other auth provider is used
      async signIn({ account, profile, user, credentials }) {
        
        try {
            if(profile){
                await connectToDB();
        
                // check if user already exists
                const userExists = await User.findOne({ email: profile.email });
        
                // if not, create a new document and save user in MongoDB
                if (!userExists) {
                    await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ", "").toLowerCase(),
                    image: profile.picture,
                    });
                }
            }
  
          return true
        } catch (error) {
          console.log("Error checking if user exists: ", error.message);
          return false
        }
      },
      async jwt ({ token, user }){                
          if(user){
              token = { user }
          }   
          
          return Promise.resolve(token) 
      },

      async session({ session, token, user }) {
        
        const sessionUser = await User.findOne({ email: token.user.email });
        
          if(token.user){ 
              if(session.user){
                  session.user.name = token.user.name   
                  session.user.id = sessionUser._id.toString();
                  session.user.image = sessionUser.image
              }
          }                               
          return Promise.resolve(session)
      },
    }
  })
  
  export { handler as GET, handler as POST }