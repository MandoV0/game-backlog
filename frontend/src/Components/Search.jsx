import { useEffect, useState } from "react";

const searchDelay = 500; // Delay to search for games after we stop typing

export const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState("");

  /* Calls this for every keystroke as the <input> setSearchQuery onChange */
  useEffect(() => {
    const searchDelayHandler = setTimeout(() => {
      setDelayedQuery(searchQuery);
    }, searchDelay);

    return () => clearTimeout(searchDelayHandler);
  }, [searchQuery]);

  /* Basically listens for the delayedQuery to timeout and then invokes an event */
  useEffect(() => {
    console.log("Triggering onSearch for: ", delayedQuery);
    onSearch?.(delayedQuery);
  }, [delayedQuery]);

  return (
    <div className="searchContainer">
      <input
        type="text"
        placeholder="Search Games..."
        className="searchInput"
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }} 
      ></input>
    </div>
  );
}