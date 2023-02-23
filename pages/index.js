import React, { useState, useEffect } from "react";
import Image from "next/image";
import Synonyms from "./components/Synonyms";
import Rhymes from "./components/Rhymes";
import Describes from "./components/Describes";
import Head from 'next/head';

// instantiating luxon's DateTime object
const { DateTime } = require('luxon');

// initializing a const to DateTime's .now method which returns the current time
const currentTime = DateTime.now(); 

export default function Home() {

  // the following three "Active" sets of states controls whether the on-screen query column of that type is hidden or not
  const [synonymsVisible, setSynonymsVisible] = useState(0);
  const [rhymesVisible, setRhymesVisible] = useState(0);
  const [describesVisible, setDescribesVisible] = useState(0);

  // the following three control the data for all three queries from the datamuse API
  const [synonymsData, setSynonymsData] = useState("");
  const [rhymesData, setRhymesData] = useState("");
  const [describesData, setDescribesData] = useState("");

  // controls the "awaiting query" loader,
  const [awaitingQuery, setAwaitingQuery] = useState(true); // controls initial screen prior to loading in the "word" area
  const [query, setQuery] = useState(""); // set null to comply with submit conditional
  const [submit, setSubmit] = useState(false);

  const adjustedHours = currentTime.hour - 12;

  // controls width of on-screen elements depending on how many are enabled
  let visibleCount = synonymsVisible + rhymesVisible + describesVisible;
 
  useEffect(() => {
    // data fetching operation
    if (submit) {
      async function wordCall() {
        const synonymRes = await fetch(
          `https://api.datamuse.com/words?ml=${query}`
        );
        const rhymeRes = await fetch(
          `https://api.datamuse.com/words?rel_rhy=${query}`
        );
        const describeRes = await fetch(
          `https://api.datamuse.com/words?rel_jjb=${query}`
        );
        const synonymData = await synonymRes.json();
        const rhymeData = await rhymeRes.json();
        const describeData = await describeRes.json();
        awaitingQuery
          ? (setSynonymsVisible(1), setRhymesVisible(1), setDescribesVisible(1))
          : "";
        setSynonymsData(synonymData);
        setRhymesData(rhymeData);
        setDescribesData(describeData);
        setAwaitingQuery(false);
        setSubmit(false);
      }
      wordCall();
    }
  }, [submit]);

  {/* below two handlers deal with observing changes in input as well as submitting them */}

  function handleChange(e) {
    setQuery(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query) {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  }

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      
        {/* displays image based on user's time of day*/}
        <Image
          className="absolute mt-6 ml-6 transition-all ease-in-out"
          src={currentTime.hour >= 21 || currentTime.hour < 6 ? "/night.png" : currentTime.hour >= 6 && currentTime.hour <= 12 ? "/sunrise.png" : currentTime.hour > 12 && currentTime.hour < 18 ? "/afternoon.png" : "/sunset.png"}  
          alt={currentTime.hour >= 21 || currentTime.hour < 6 ? "night icon" : currentTime.hour >= 6 && currentTime.hour <= 12 ? "morning icon" : currentTime.hour > 12 && currentTime.hour < 18 ? "afternoon icon" : "evening icon"}
          width={50}
          height={50}
        />

        {/* displays time relative to the user - luxon object defaults to military time, corrects to standard time */}
        <div className="absolute text-4xl top-6 right-6 transition-all">
          {currentTime.hour > 12 ? (adjustedHours + ":" + currentTime.minute) : (currentTime + ":" + currentTime.minute)}
        </div>
        
        <div className="h-[35vh]">
          <h1 className="text-gray-300 flex flex-row text-9xl sm:text-7xl items-center justify-center mx-3 transition-all">
            Thesaurus
          </h1>

          {/* search input form */}
          <div className="flex flex-row justify-center items-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-row text-2xl items-center bg-gray-700 hover:bg-gray-600 transition-all rounded-full ease-out w-1/3 mb-2 mt-12"
            >
              <button type="submit">
                <img
                  src={`search.png`}
                  className="mx-4 h-8 fill-gray-300 w-8"
                />
              </button>

              <input
                type="text"
                placeholder="Enter term..."
                value={query}
                onChange={handleChange}
                className={`my-auto w-full h-12 rounded bg-transparent rounded-full`}
              ></input>
            </form>
          </div>

          {/* beginning of area that provides the toggle subsections (synonyms, rhymes, describes */}
          <div
            className={`${
              awaitingQuery ? "text-gray-600" : "text-gray-300"
            } flex flex-row items-center justify-center text-center mt-2`}
          >
            Includes...
          </div>
          <div className="flex flex-row h-12 w-full">
          
          {/* toggles which of the 3 present options are enabled or not */}
            <div
              className={`text-4xl h-10 w-full flex flex-row justify-center items-center text-gray-600`}
            >
              {/* each button element represents a toggle for that query type (synonyms, rhymes, describes) */}
              {/* additionally, each button element's css is kept fully stateful, personally allowing flexibility beyond normal pseudo-classes */}
              <div className = "w-1/5 sm:w-1/3 items-center justify-center flex">
                <button
                  type="button"
                  onClick={() => {
                    setSynonymsVisible(synonymsVisible == 0 ? 1 : 0);
                  }}
                  className={`${
                    synonymsVisible == 1
                      ? "border-gray-300 text-gray-300 hover:text-gray-100 hover:border-gray-100"
                      : "border-gray-700 text-gray-600 hover:text-gray-500 hover:border-gray-500"
                  } border-b h-14 transition-all`}
                  htmlFor="synonyms"
                >
                  Synonyms
                </button>
              </div>
              
              <div className = "w-1/5 sm:w-1/3 items-center justify-center flex">        
                <button
                  type="button"
                  onClick={() => {
                    setRhymesVisible(rhymesVisible == 0 ? 1 : 0);
                  }}
                  className={`${
                    rhymesVisible == 1
                      ? "border-gray-300 text-gray-300 hover:text-gray-100 hover:border-gray-100"
                      : "border-gray-700 text-gray-600 hover:text-gray-500 hover:border-gray-500"
                  } border-b h-14 transition-all`}
                  htmlFor="rhymes"
                >
                  Rhymes
                </button>
              </div>
              <div className = "w-1/5 sm:w-1/3  items-center justify-center flex">
                <button
                  type="button"
                  onClick={() => {
                    setDescribesVisible(describesVisible == 0 ? 1 : 0);
                  }}
                  className={`${
                    describesVisible == 1
                      ? "border-gray-300 text-gray-300 hover:text-gray-100 hover:border-gray-100"
                      : "border-gray-700 text-gray-600 hover:text-gray-500 hover:border-gray-500"
                  } border-b h-14 transition-all`}
                  htmlFor="describes"
                >
                  Describes
                </button>
              </div>
              
            </div>
          </div>
        </div>
 
        {/* handles area of returned query, conditionally renders a "waiting" screen until a user-input query is sent by our API, after which list(s) of results are rendered on-screen */}
        {/* the below conditional statement determines whether a query has been sent by the user or not (and if not, to display a phase that fades in and out */}
        {/* each "visible" state handles whether their respective word columns appear on screen or not */}

        {awaitingQuery || synonymsData === undefined ? (
          <h1 className="loader items-center text-3xl text-center mt-40 transition-all">
            Awaiting search term...
          </h1>
        ) : (
          <main className="flex flex-row w-full h-screen items-center justify-center text-center mx-auto text-3xl sm:text-2xl xs:text-xl">
            <div
              className={`${synonymsVisible ? "opacity-100" : "opacity-0"} ${
                visibleCount > 0 && synonymsVisible ? "w-1/5 sm:w-1/3 " : "w-0"
              } h-full flex flex-col space-y-4 overflow-y-scroll transition-all`}
            >
              {synonymsData.map((synonym, i) => {
                return <Synonyms key={synonym[i]} {...synonym} />;
              })}
            </div>
            <div
              className={`${rhymesVisible ? "opacity-100" : "opacity-0"} ${
                visibleCount > 0 && rhymesVisible ? "w-1/5 sm:w-1/3 " : "w-0"
              } h-full flex flex-col space-y-4 overflow-y-scroll overflow-x-hidden transition-all`}
            >
              {rhymesData.map((rhyme, i) => {
                return <Rhymes key={rhyme[i]} {...rhyme} />;
              })}
            </div>
            <div
              className={`${describesVisible ? "opacity-100" : "opacity-0"} ${
                visibleCount > 0 && describesVisible ? "w-1/5 sm:w-1/3 " : "w-0"
              } h-full flex flex-col space-y-4 overflow-y-scroll overflow-x-hidden transition-all`}
            >
              {describesData.map((describe, i) => {
                return <Describes key={describe[i]} {...describe} />;
              })}
            </div>
          </main>
        )}
       
    </>
  );
}
