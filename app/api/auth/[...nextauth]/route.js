import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from '@utils/database'
import User from '@models/user';
import { compare } from 'bcrypt'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
      
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
            
            return userData
            
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
      async signIn({ user }) {             
          return true;          
      },
      async jwt ({ token, user }){            
          if(user){
              token = { user }
          }    
          return Promise.resolve(token) 
      },

      async session({ session, token, user }) {
          
          if(token.user){ 
              if(session.user){
                  session.user.name = token.user.username   
                  session.user.id = token.user._id
              }
          }            
          return Promise.resolve(session)
      },
    }
  })
  
  export { handler as GET, handler as POST }