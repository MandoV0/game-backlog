import React, { useEffect } from 'react';
import "../Styles/Games.css";

const ProgressDropdown = ({ gameId }) => {
  const [selectedProgress, setSelectedProgress] = React.useState(null);

  useEffect(() => {
    
  });

  return(
    <select className="progress-select" name="gameProgress" id="gameProgress">
      <option value="NotStarted">Not Started</option>
      <option value="Playing">Playing</option>
      <option value="Completed">Completed</option>
      <option value="OnHold">On Hold</option>
      <option value="Dropped">Dropped</option>
    </select>
  );
}

export default ProgressDropdown;

// "Not Started", "Playing", "Completed", "On Hold", or "Dropped"