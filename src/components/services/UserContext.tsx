import React, { createContext, useState } from "react";

const UserContext = createContext<any>({});

export const UserProvider = (props: any) => {
  const [user, setUser] = useState<any>();
  const [userData, setUserData] = useState<any>();
  return (
    <UserContext.Provider value={{ user, setUser, userData, setUserData }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
