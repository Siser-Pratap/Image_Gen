import React, { useEffect, useState } from 'react';

import { Card, FormField, Loader } from '../components';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
      data.map((post) => <Card key={post._id} {...post} />)
    );
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};




const Home = () => {

  const [loading, setLoading] = useState(false);

  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);
  const bg = useRef();


  // useGSAP(()=>{
  //   gsap.to(bg.current, {
  //     backgroundPositionX: "50%", // Moves the background horizontally
  //     duration: 10, // Duration of the animation in seconds
  //     repeat: -1, // Infinite loop
  //     ease: "linear",
  //   })
  // })




  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  useEffect(() => {

    const fetchPosts = async() => {
      
      try {
        
        setLoading(true);
        
        const response = await fetch("https://image-gen-rnty.onrender.com/api/v1/post", {
          method:"GET",
          headers:{
            'Content-Type': 'application/json',
          },
        });

        

        if(response.ok){
          const result = await response.json();
          
          setAllPosts(result.data.reverse());
        }
        
      } catch (error) {
        alert(error.message);
      }
      finally{
        setLoading(false);
      }
    }



    fetchPosts();
  }, []);  



  return (
    <>
      <div ref={bg} className="h-[100vh] bg-love bg-cover w-full p-6">
        {/* <div className="h-auto w-auto flex items-end justify-center">
          <div className='mb-[5vw]'>
            <img
              className="h-[20rem] w-[20rem] max-w-lg transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png"
              alt="image description"
            />
          </div>
        </div>
        <div className="h-auto w-auto flex items-end ">
          <div className='mb-[5vw]'>
            <img
              className="h-[20rem] w-[20rem] max-w-lg transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png"
              alt="image description"
            />
          </div>
        </div>
        <div className="h-auto w-auto flex items-start">
          <div className='mb-[5vw]'>
            <img
              className="h-[20rem] w-[20rem] max-w-lg transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png"
              alt="image description"
            />
          </div>
        </div> */}
      </div>






    <div className='mt-20'>
    <section className="max-w-7xl mx-auto">
    <div>
      <h1 className="font-extrabold text-[#222328] text-[32px]">The Community Showcase</h1>
      <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Browse through a collection of imaginative and visually stunning images generated by DALL-E AI</p>
    </div>

    <div className="mt-16">
      <FormField
        labelName="Search posts"
        type="text"
        name="text"
        placeholder="Search something..."
        value={searchText}
        handleChange={handleSearchChange}
      />
    </div>

    <div className="mt-10">
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          {searchText && (
            <h2 className="font-medium text-[#666e75] text-xl mb-3">
              Showing Resuls for <span className="text-[#222328]">{searchText}</span>:
            </h2>
          )}
          <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
            {searchText ? (
              <RenderCards
                data={searchedResults}
                title="No Search Results Found"
              />
            ) : (
              <RenderCards
                data={allPosts}
                title="No Posts Yet"
              />
            )}
          </div>
        </>
      )}
    </div>
  </section>
  </div>
  </>
   
);
};

export default Home;