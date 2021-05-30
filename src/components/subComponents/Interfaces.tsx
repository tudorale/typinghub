import firebase from "firebase/app";

export interface reviewText{
    author: string,
    text: string,
    time?: string,
    id: string, // uid of the user not a normal ID
    typingHubID: string,
}

export interface notification{
    id: number,
    message: string,
    sender: string,
    time: string,
}

export interface chatMessage{
    author: string,
    authorImage: string,
    message: string,
    time: string,
    id?: string, // uid of the user not a normal ID
    typingHubID: string,
}

export interface userInterface{
    id: string,
    username: string,
    races: number,
    role: string,
    points: number,
    description: string,
    pro: boolean,
    rank: string,
    bestWPM: string | number,
    lastWPM: string | number,
    keyboardLayout: string,
    randomTests: number,
    quotesTests: number,
    customTests: number,
    randomHistory: Array<Object>,
    quotesHistory: Array<Object>,
    customHistory: Array<Object>,
    changedUsername: boolean,
    payment: Object,
    typingHubID: string,
    timestamp?: firebase.firestore.FieldValue,
    profileImage: string
}