'use client'
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
const RegisterForm = () => {
const [providers, setProviders] = useState(null);
const [credentials, setCredentials] = useState({username:"", password:""})
const [submitting, setSubmitting] = useState(false)
useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setSubmitting(true);
    try{
      await fetch("/api/users/new", {
        method: "POST",
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (response.ok) {
        router.push("/signin");
      }
    }catch(error){
        console.log(error)
    }finally{
        setSubmitting(false);
    }
  }


  return (
    <section className='w-full max-w-full flex-start flex-col'>
    <h1 className='head_text text-left'>
      <span className='blue_gradient'>Register to SharePoint</span>
    </h1>
    <form
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
      >
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
           Username{" "}
            {/* <span className='font-normal'>
              (#product, #webdevelopment, #idea, etc.)
            </span> */}
          </span>
          <input
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            type='text'
            placeholder='User Name'
            required
            className='form_input'
          />
        </label>
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Password{" "}
            {/* <span className='font-normal'>
              (#product, #webdevelopment, #idea, etc.)
            </span> */}
          </span>
          <input
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            type='password'
            placeholder='Password'
            required
            className='form_input'
          />
        </label>
        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href='/register' className='text-gray-500 text-sm'>
            Register
          </Link>

          <button
            type='submit'
            disabled={submitting}
            className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
          >
            {submitting ? 'processing...' : 'Login'}
          </button>
        </div>
      </form>
    </section>
    // <>
    // {providers &&
    //     Object.values(providers).map((provider) => (         
    //       <button
    //         type='button'
    //         key={provider.name}
    //         onClick={() => {
    //           signIn(provider.id);
    //         }}
    //         className='black_btn'
    //       >
    //         Sign in with {provider.name}
    //       </button>          
    //     ))}
    //     </>
  )
}

export default RegisterForm