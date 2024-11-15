import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';
import { fetchImages } from '../services/model-api';


const CreatePost = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    url:"",
  });

  const handleAvailOptions = (option) => {
    setPromptQuery(option);
  };


  const [generatingImg, setGeneratingImg] = useState(false);

  const [loading, setLoading] = useState(false);
  const [imageResult, setImageResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  
  const handleGenerate = (e) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    const promptQuery = form.prompt;
    console.log(promptQuery);
  
    try {
      setGeneratingImg(true);
      const imageBlob = await fetchImages(
        promptQuery
      );

      
      const fileReaderInstance = new FileReader();
      // This event will fire when the image Blob is fully loaded and ready to be displayed
      fileReaderInstance.onload = () => {
        let base64data = fileReaderInstance.result;
        setImageResult(base64data);
        console.log(base64data)
        setForm({ ...form, url: base64data });
        console.log(form);
      };
      // Use the readAsDataURL() method of the FileReader instance to read the image Blob and convert it into a data URL
      fileReaderInstance.readAsDataURL(imageBlob);
  
      // Create a URL from the image Blob
      
      
      // Set the image URL directly as the result
      
      

      setGeneratingImg(false);
    } catch (error) {
      // Handle error
      console.error("Error fetching images from API:", error);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(form.prompt && form.url){
      setLoading(true);
      
      try {
        const response = await fetch("https://image-gen-rnty.onrender.com/api/v1/post",{
          method:"POST",
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...form}),
        });
        await response.json();
        alert("Success");
        navigate("/");
  
      } catch (error) {
        console.log(error.message);
      }
      finally{
        setLoading(false);
      }
    }
    else{
      alert("'Please generate an image with proper details")
    }

    
    
   
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through DALL-E AI and share it with the community</p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { imageResult ? (
              <img
                src={imageResult}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt=""
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={handleGenerate}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
        
      </form>
    </section>
  );
};

export default CreatePost;