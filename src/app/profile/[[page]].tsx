import Head from "next/head";
import { api } from "~/trpc/server";

export default async function Profile() {
  const data = await api.profile.getUserProfile.query();

  return (
    <div className="h-full">
      <Head>
        <title>User Profile</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
        <style>
          {`
          :root {
            --font-family: 'Lato', sans-serif;
            --text-color: #333333;
            --suleat: #fc571a;
          }

          body {
            font-family: var(--font-family);
            color: var(--text-color);
          }

          .suleat {
            color: var(--suleat);
            background-color: var(--suleat);
          }
          `}
        </style>
      </Head>

      <div className="container px-5 mx-auto mt-5 flex justify-center flex-col md:flex-row w-full max-w-screen-lg relative h-[450px] md:h-[330px] items-start">
        <img className="absolute top-0 inset-0 w-full max-w-screen h-60 rounded-lg z-0 object-cover" src={data.banner} alt="" />
        <img className="w-48 h-48 rounded-full absolute object-cover z-10 border-4 border-white-1000 bottom-22 md:bottom-0 md:left-20 left-1/2 transform -translate-x-1/2 md:transform-none" src={data.profilePic} alt="" />
        <div className="absolute left-1/2 transform -translate-x-1/2 md:transform-none container flex flex-col md:flex-row md:w-7/12 md:full bottom-7 md:left-[35%]">
          <div className="w-full max-w-screen md:w-5/12 flex-col flex justify-center items-center md:flex-none md:justify-normal md:items-start">
            <p className="text-xl font-extrabold"> {data.firstName} {data.lastName} <i className="fa-solid fa-circle-plus hover:color-blue-700" style={{ color: '#24a0ed' }}></i></p>
            <p className="text-base font-font-medium color-gray"> @{data.username} </p>
          </div>
          <div className="w-full max-w-screen flex flex-row">
            <div className="w-6/12 flex flex-col justify-center items-center px-0 rounded-full hover:bg-gray-200 transition-colors">
              <p className="text-xl font-extrabold"> {data.postsCount}</p>
              <p className="text-base font-medium text-gray-500">posts</p>
            </div>
            <div className="flex-col w-6/12 flex justify-center items-center px-0 rounded-full hover:bg-gray-200 transition-colors">
              <p className="text-xl font-extrabold"> {data.following} </p>
              <p className="text-base font-medium text-gray-500">following</p>
            </div>
            <div className="flex-col w-6/12 flex justify-center items-center px-0 rounded-full hover:bg-gray-200 transition-colors">
              <p className="text-xl font-extrabold"> {data.followers} </p>
              <p className="text-base font-medium text-gray-500">followers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-5 md:mx-auto mt-5 flex justify-center flex-col md:flex-row w-full max-w-screen-lg">
        <div className="w-full md:w-3/12 order-1">
          <h2 className="text-sm font-bold flex items-center">
            <span className="mr-2 h-4 w-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fill="#fc571a" d="M18 11v7a2 2 0 0 1-4 0v-5h-2V3a3 3 0 0 1 3-3h3v11zM4 10a2 2 0 0 1-2-2V1a1 1 0 0 1 2 0v4h1V1a1 1 0 0 1 2 0v4h1V1a1 1 0 0 1 2 0v7a2 2 0 0 1-2 2v8a2 2 0 0 1-4 0v-8z"></path>
              </svg>
            </span>
            FLAVOR PROFILE
          </h2>

          <div className="flex flex-wrap px-1 justify-center items-center md:justify-normal md:items-start">
            {data.flavorProfile.map((flavor, index) => (
              <button
                key={index}
                className="my-1 mx-2 text-xs hover:bg-orange-700 text-white py-1 px-2 rounded-full suleat"
              >
                {flavor}
              </button>
            ))}
          </div>

        </div>

        <div className="w-full md:w-6/12 order-3 md:order-2 mt-6 md:mt-1">
          <h2 className="text-lg font-bold">Posts</h2>
          <hr className="w-11/12 mt-2 border-1 border-gray-300" />
        </div>
        
        <div className="w-full md:w-3/12 order-2 md:order-3 mt-6 md:mt-1">
          <h2 className="text-base font-semibold">About {data.firstName} </h2>
          <h3 className="mt-2 font-light">
            <i className="mr-2 fa-sharp fa-solid fa-location-dot" style={{ color: 'red' }}></i> {data.location} 
          </h3>
          <p className="mt-2">
            { data.bio }
          </p>
        </div>
      </div>
    </div>
  );
}