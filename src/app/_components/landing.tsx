"use client";

import { api } from "~/trpc/react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useSignIn } from '@clerk/nextjs';
import toast from "react-hot-toast";
import { PostComponent } from "./common/post_v1"
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
      <div>
        <button className="text-white bg-gray-600 h-12 rounded-xl border-2 mb-2 w-11/12 m-auto flex justify-center" onClick={signInWithGoogle}>
            <img className="h-8 w-8 my-auto inline" src="https://www.google.com/favicon.ico" alt={`google`} width={32} height={32} />
            <div className="relative my-auto ml-3">
                Register with Google
            </div>
        </button>
        <button className="text-white bg-gray-600 h-12 rounded-xl border-2 mb-2 w-11/12 m-auto flex justify-center" onClick={signInWithFacebook}>
            <img className="h-8 w-8 my-auto inline" src="https://www.facebook.com/favicon.ico" alt={`google`} width={32} height={32} />
            <div className="relative my-auto ml-3">
                Register with Facebook
            </div>
        </button>
        
      </div>
    );
  };
  
  const postQuery = api.post.getPreview.useQuery()

  const previewPosts = postQuery.data?.map((post) => <PostComponent post={post} />)
  const loadingScreen = (<div className="h-full flex items-center justify-center"><LoadingSpinner size={100}/></div>)
  return (
    <div>
      <style dangerouslySetInnerHTML={{__html: "\n:root {\n--font-family: 'Inter', sans-serif;\n --text-color: #333333;\n--suleat: #fc571a;\n}\n\nbody {\nfont-family: var(--font-family);\ncolor: var(--text-color);\n}\n\n.suleat {\n color: var(--suleat);\n background-color: var(--suleat);\n}\n" }} />
      <button
          className="fixed top-4 right-4 sm:block hidden rounded hover:font-normal hover:bg-[#fc571a] hover:text-white font-semibold py-2 px-4"
          onClick={toggleModal}
        >
          Log In
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="modal-bg fixed inset-0 opacity-50"></div>
          <div className="modal-content bg-transparent p-8 rounded z-50 flex flex-col">
            <SignIn />
            <button
              className="mt-4 mr-7 bg-blue-700 hover:bg-blue-900 text-white py-2 px-4 rounded self-end"
              onClick={toggleModal}
            >
              Close Modal
            </button>
          </div>
        </div>
        )}
      {!pendingVerification && (
        <div className="bg-gray-100 p-0 flex justify-center flex-col items-center">
            <div className="flex flex-row xl:max-w-[60%] p-0 min-[1064.5px]:justify-center max-[1064.5px]:flex-col h-full ">
              <div className="flex flex-col p-6 min-[1064.5px]:w-1/2 min-[1064.5px]:max-w-3xl max-w-[500px] min-[1064.5px]:min-w-[34rem] h-screen justify-center">
                  <div className="min-[1064.5px]:text-7xl text-5xl font-semibold sm:max-[1064.5px]:text-center text-center">Where food <br /> meets friends</div>
                  <br />
                  <div className="min-[1064.5px]:text-xl/6 text-center">Longer but still brief description/motivation. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id lectus risus. Cras hendrerit elit at elit rutrum, sit amet sollicitudin urna gravida.</div>
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
              <div className="flex flex-row p-6 min-[1064.5px]:w-1/2 min-[1064.5px]:max-w-3xl max-w-[500px] min-[1064.5px]:min-w-[34rem] h-screen items-center shrink-0">
                  <div id="frame-post" className="border-8 border-gray-300 h-[512px] w-full rounded-3xl flex flex-col">
                      <div className="flex flex-row items-center relative">
                          <div className="rounded-full border-[6px] w-1 h-1 border-red-500 m-1 absolute left-[0.5rem]"></div>
                          <div className="rounded-full border-[6px] w-1 h-1 border-yellow-400 m-1 absolute left-[1.75rem]"></div>
                          <div className="rounded-full border-[6px] w-1 h-1 border-green-500 m-1 absolute left-[3rem]"></div>
                          <div className="bg-gray-200 border-4 border-gray-200 rounded-lg m-auto w-1/2 text-center my-2">Trending</div>
                      </div>
                      <div className={`${postQuery.isSuccess ? "bg-white" : "bg-gray-300"} h-full rounded-lg flex-1 mx-2 mb-2 p-2 pr-4 overflow-y-scroll`}>
                        { postQuery.isSuccess ? previewPosts : (postQuery.isLoading ? loadingScreen : (<></>))  }
                      </div>
                  </div>
              </div>
          </div>
          <div className="bg-slate-300 h-screen w-32">
          </div>
        </div>
      )}
    </div>
  );
}