import React from "react";

export default function Synonyms({word}) {
    return (
        <>
            <a href = {`https://www.dictionary.com/browse/${word}`} target = "_blank" className = "opacity-100 hover:text-white text-gray-300 transition-all ease-in-out">{word}</a>
        </>
    )
}