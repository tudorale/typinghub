import React, { createContext, useState } from "react";

const PlayZoneContext = createContext<any>({});

export const PlayZoneProvider = (props: any) => {
  const [playzone, setPlayzone] = useState<boolean>(false);
  const [playingText, setPlayingText] = useState<string>("");
  return (
    <PlayZoneContext.Provider value={{ playzone, setPlayzone, playingText, setPlayingText }}>
      {props.children}
    </PlayZoneContext.Provider>
  );
};

export default PlayZoneContext;
