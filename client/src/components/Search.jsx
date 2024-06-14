// Search.js
import React, { useState } from "react";
import MessageContainer from "./MessageContainer";

const Search = ({ initialResults, name, searchKey }) => {
  const [searchTerm, setSearchTerm] = useState("");
  console.log(initialResults, "ii");
  console.log(name, "name");

  // Handler for input changes
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //Filter results based on search term, case-insensitive

  const filteredResults = initialResults.filter((result) =>
    result[searchKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-3">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={`Search for ${name}...`}
        className="w-full p-2 border rounded-xl border-gray-300 focus:outline-blue-400"
      />
      {/* Pass filtered results to the Messagecontainer component */}
      <MessageContainer list={filteredResults} />
    </div>
  );
};

export default Search;
// {name === "friend" ? (
//   <MessageContainer list={filteredResults} />
// ) : (
//   <div></div>
// )}
