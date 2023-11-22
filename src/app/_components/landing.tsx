"use client";

import { api } from "~/trpc/react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useSignIn } from '@clerk/nextjs';
import toast from "react-hot-toast";
import { PostComponent } from "./common/post_v1"
import { PostPreviewComponent } from "./common/post_v2"
import { LoadingSpinner } from "./loading";

interface ApiErrorResponse  {
  errors: {
    message: string;
    // Add other properties if necessary
  }[];
}

export function Landing() {

  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const { isLoaded: isLoadedSignUp, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const router = useRouter();
  

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("registering");
    e.preventDefault();
    if (!isLoadedSignUp) {
      return;
    }
    const response = await signUp?.create({
      emailAddress,
      password,
    })
    .then(async (res) => {
      if (res.status === "complete") {
        console.log(res.status);
        void await setActive({ session: res.createdSessionId });
        void await router.push("/");
      } else {
        console.log(res);
      }
    })
    .catch((err:unknown) => {
      if (err instanceof Error) {
        const apiError = err as unknown as ApiErrorResponse;
        // Use optional chaining operator to safely access properties
        const errorMessage = apiError?.errors?.[0]?.message ?? "An error occurred. Please try again later.";
        console.log(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error("An unknown error occurred.");
      }
    })

  };

  const SignInOAuthButtons = () => {
    const { signIn, isLoaded } = useSignIn();
    if (!isLoaded) {
      return null;
    }
    const signInWithGoogle = () =>
      signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      });
      const signInWithFacebook = () =>
      signIn.authenticateWithRedirect({
        strategy: 'oauth_facebook',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      });
      
    return (
      <div className="w-full">
        <div className="w-11/12 m-auto">
          <button className="text-white bg-gray-600 h-12 rounded-xl border-2 mb-2 w-full m-auto flex justify-center" onClick={signInWithGoogle}>
              <img className="h-8 w-8 my-auto inline" src="https://www.google.com/favicon.ico" alt={`google`} width={32} height={32} />
              <div className="relative my-auto ml-3">
                  Register with Google
              </div>
          </button>
          <button className="text-white bg-gray-600 h-12 rounded-xl border-2 mb-2 w-full m-auto flex justify-center" onClick={signInWithFacebook}>
              <img className="h-8 w-8 my-auto inline" src="https://www.facebook.com/favicon.ico" alt={`google`} width={32} height={32} />
              <div className="relative my-auto ml-3">
                  Register with Facebook
              </div>
          </button>
          <button
            className="ml- sm:hidden block rounded text-sm text text-blue-400 hover:underline"
            onClick={toggleModal}
          >
            Already have an account? Log in instead.
          </button>
        </div>
      </div>
    );
  };
  
  const postQuery = api.post.getPreview.useQuery()

  const previewPosts = postQuery.data?.map((post) => <PostPreviewComponent post={post} />)
  const loadingScreen = (<div className="h-full flex items-center justify-center"><LoadingSpinner size={100}/></div>)
  return (
    <div>
      <style dangerouslySetInnerHTML={{__html: "\n:root {\n--font-family: 'Inter', sans-serif;\n --text-color: #333333;\n--suleat: #fc571a;\n}\n\nbody {\nfont-family: var(--font-family);\ncolor: var(--text-color);\n}\n\n.suleat {\n color: var(--suleat);\n background-color: var(--suleat);\n}\n" }} />
      <div>
        <div className="flex justify-start bg-slate-100">
          
        </div>
        <div className="">
          <a className="sm:top-6 top-10 absolute sm:left-4 left-1/2 sm:translate-x-0 transform -translate-x-1/2" href="/">
            <img src="/suleat-icon.png" width="60" className="sm:ml-4"></img>
          </a>
          <div className="top-6 absolute text-md right-4 sm:block hidden">
            <button className=" rounded hover:font-normal hover:bg-[#fc571a] hover:text-white font-semibold py-2 px-4 " ><a href="#aboutArea">About</a></button>
            <button className=" rounded hover:font-normal hover:bg-[#fc571a] hover:text-white font-semibold py-2 px-4 "><a href="#privacySafety">Privacy & Safety</a></button>
            <button className=" rounded hover:font-normal hover:bg-[#fc571a] hover:text-white font-semibold py-2 px-4 "><a href="#contactUs">Contact Us</a></button>
            <button className=" rounded hover:font-normal hover:bg-[#fc571a] hover:text-white font-semibold py-2 px-4 " onClick={toggleModal}>Log In</button>
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
                <div className="modal-bg fixed inset-0 opacity-50"></div>
                <div className="modal-content bg-transparent p-8 rounded z-50 flex flex-col">
                  <SignIn />
                  <button
                    className="mt-4 mr-7 bg-blue-700 hover:bg-blue-900 text-white py-2 px-4 rounded self-end"
                    onClick={toggleModal}
                  >
                    Close
                  </button>
                </div>
            </div>
            )}
        </div>
        </div>
        
      </div>
      
      
      {!pendingVerification && (
        <div className="bg-gray-100 p-0 flex justify-center flex-col items-center">
            <div className="flex flex-row xl:max-w-[60%] p-0 min-[1064.5px]:justify-center max-[1064.5px]:flex-col h-full ">
              <div className="flex flex-col p-6 min-[1064.5px]:w-1/2 min-[1064.5px]:max-w-3xl max-w-[500px] min-[1064.5px]:min-w-[34rem] h-screen justify-center">
                  <div className="min-[1064.5px]:text-6xl text-5xl font-semibold sm:max-[1064.5px]:text-center text-center">Where food <br /> meets friends</div>
                  <div className="flex flex-col justify-center w-full container">
                      <div className="text-center text-2xl p-4">Embrace Your Foodie Destiny!</div>
                      <form className="flex flex-col justify-center" id="form-register">
                        <input onChange={(e) => setEmailAddress(e.target.value)} id="email" name="email" type="email"  placeholder="Email" className="h-12 rounded-xl border-2 p-3 mb-4 w-11/12 m-auto"/>
                        <input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" placeholder="Password" className="h-12 rounded-xl border-2 p-3 mb-4 w-11/12 m-auto"/>
                        <button value="Register Now" className="cursor-pointer text-white bg-[color:var(--suleat)] h-12 rounded-xl border-2 mb-2 w-11/12 m-auto" onClick={handleSubmit}> Register</button>
                      </form>
                      <div className="text-center text-xl mb-2">or</div>
                      <SignInOAuthButtons/>
                  </div>
              </div>
              <div className="flex flex-row p-6 min-[1064.5px]:mb-0 mb-36 max-w-[500px] min-[1064.5px]:min-w-[34rem] items-center shrink-0">
                  <div id="frame-post" className="border-8 sm:mb-0 border-gray-300 h-[512px] w-full rounded-3xl flex flex-col">
                      <div className="flex flex-row items-center relative">
                          <div className="rounded-full border-[6px] w-1 h-1 border-red-500 m-1 absolute left-[1rem]"></div>
                          <div className="rounded-full border-[6px] w-1 h-1 border-yellow-400 m-1 absolute left-[2.25rem]"></div>
                          <div className="rounded-full border-[6px] w-1 h-1 border-green-500 m-1 absolute left-[3.5rem]"></div>
                          <div className="bg-gray-200 border-4 border-gray-200 rounded-lg m-auto w-1/2 text-center my-2">Trending</div>
                      </div>
                      <div className={`${postQuery.isSuccess ? "bg-[#FEEEE8]" : "bg-gray-300"} h-full rounded-lg flex-1 mb-2 p-2 overflow-y-scroll`}>
                        { postQuery.isSuccess ? previewPosts : (postQuery.isLoading ? loadingScreen : (<></>))  }
                      </div>
                  </div>
              </div>
            </div>
        </div>
      )}

        <section className="bg-[url('/aboutUs.png')] bg-center" id ="aboutArea"> 
          <div className="max-w-full mx-auto py-16 px-16 "> 
            <div className="text-left"> 
              <h1 className="mt-1 text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">About Us</h1> 
              <p className="max-w-xl mt-5  text-xl text-white">Our focus is on providing a platform for users to share detailed information about their food experiences, emphasizing factors like taste, location, and satisfaction. We want to help people discover new restaurants, find the best dishes to try, and learn more about the food they love.</p> 
            </div> 
          </div> 
        </section> 
        <section className="bg-gray-100 py-16 px-16" id = "privacySafety">
          <p className="text-center text-5xl font-bold mb-10">Your Privacy is our Priority</p> 
          
          <div className="flex lg:flex-row flex-col text-center lg:justify-between items-center lg:items-start"> 
            <div className="privacy-text-1 lg:w-1/5 w-full lg:mb-0 mb-8">
              <h2 className="text-2xl font-bold tracking-wide text-orange-600 ">Data Encryption</h2> 
              <p className="mt-1 text-xl font-regular text-gray-900 ">Your information is shielded by robust encryption, keeping it secure from prying eyes.</p> 
            </div>
            <div className="privacy-text-2 lg:w-1/5 w-full lg:mb-0 mb-8">
              <h2 className="text-2xl font-bold tracking-wide text-orange-600 ">Compliant with Standards</h2> 
              <p className="mt-1 text-xl font-regular text-gray-900 ">We follow industry regulations, such as SOC 2 Type II compliance, showcasing our commitment to your privacy, as upheld by Clerk and PlanetScale.</p> 
            </div>
            <div className="privacy-text-3 lg:w-1/5 w-full lg:mb-0 mb-8">
              <h2 className="text-2xl font-bold tracking-wide text-orange-600 ">Controlled Data Handling</h2> 
              <p className="mt-1 text-xl font-regular text-gray-900 ">With access control measures, only authorized users can access your information, ensuring your privacy is respected.</p> 
            </div>
            <div className="privacy-text-4 lg:w-1/5 w-full lg:mb-0 mb-8">
              <h2 className="text-2xl font-bold tracking-wide text-orange-600 ">Transparency Matters</h2> 
              <p className="mt-1 text-xl font-regular text-gray-900 ">We conduct regular security checks and maintain transparent practices, following the lead of Clerk and PlanetScale, to ensure your privacy is safeguarded.</p> 
            </div>
          </div>
        </section> 
        <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16 px-16" id="contactUs">
          <div className="flex lg:flex-row flex-col text-center lg:justify-around items-center lg:items-start"> 
            <div className="flex flex-col justify-center items-center lg:w-1/5 w-full lg:mb-0 mb-8">
              <img src="/addressIcon.png" width="150" height="100"></img>
              <p className="mt-1 text-2xl font-bold text-white ">ADDRESS</p>
              <p className="mt-1 text-xl font-regular text-white ">De La Salle University, 2401 Taft Avenue, Malate, Manila 1004, Metro Manila</p> 
            </div>
            <div className="flex flex-col justify-center items-center lg:w-1/5 w-full lg:mb-0 mb-8">
              <img src="/phoneIcon.png" width="150" height="100"></img>
              <p className="mt-1 text-2xl font-bold text-white ">PHONE</p>
              <p className="mt-1 text-xl font-regular text-white ">Landline : 1234-567-8910<br></br>Smart : 1234-567-8910<br></br>Globe : 1234-567-8910</p> 
            </div>
            <div className="flex flex-col justify-center items-center lg:w-1/5 w-full lg:mb-0 mb-8">
              <img src="/emailIcon.png" width="150" height="100"></img>
              <p className="mt-1 text-2xl font-bold text-white ">EMAIL</p>
              <p className="mt-1 text-xl font-regular text-white ">example@gmail.com<br></br>example@yahoo.com</p> 
            </div>
          </div>       
        </section>
        <footer className="bg-gradient-to-r from-orange-500 to-red-500">
          <div className="flex lg:flex-row text-center justify-center lg:justify-start lg:ml-36">
            <p className="text-center text-xs text-white">© Suleat 2023. &nbsp;</p> 
            <p className="text-center text-xs text-white"> Developed by 2324T1CSSWENGS15B</p>
          </div>
        </footer>
        
    </div>
  );
}