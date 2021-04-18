import React from "react";
import "../../style/css/main.css";
import Pro from "../../images/pro.jpg"
import {Link} from "react-router-dom"
const Card = (props:any) => {
    const pro = props.pro;

    return (
        <>
            <h1>{props.title} {pro ? <img src={Pro} /> : ""}</h1> 
            <p className="races">{props.tests}</p>
            <Link to={`/speed/${props.type}`}><button>{props.button}</button></Link>
            <p className="points">{props.points}</p>
            <div className="icons">
                {
                    props.type === "random" ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="6.5" cy="15.5" r="3.5" />
                        <path d="M10 12v7" />
                        <circle cx="17.5" cy="15.5" r="3.5" />
                        <path d="M21 12v7" />
                    </svg>
                    : null
                }

                {
                    props.type === "quotes" ?
                     <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <circle cx="6.5" cy="15.5" r="3.5" />
                            <path d="M10 12v7" />
                            <circle cx="17.5" cy="15.5" r="3.5" />
                            <path d="M21 12v7" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" className='icon' width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <circle cx="18" cy="16" r="3" />
                            <line x1="21" y1="13" x2="21" y2="19" />
                            <path d="M3 19v-10a4 4 0 0 1 4 -4a4 4 0 0 1 4 4v10" />
                            <line x1="3" y1="13" x2="11" y2="13" />
                        </svg>
                        <p className="normalPunctuation">.,;</p>
                     </>
                    : null
                }
                
                {
                    props.type === "custom" ?
                     <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <circle cx="6.5" cy="15.5" r="3.5" />
                            <path d="M10 12v7" />
                            <circle cx="17.5" cy="15.5" r="3.5" />
                            <path d="M21 12v7" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" className='icon' width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <circle cx="18" cy="16" r="3" />
                            <line x1="21" y1="13" x2="21" y2="19" />
                            <path d="M3 19v-10a4 4 0 0 1 4 -4a4 4 0 0 1 4 4v10" />
                            <line x1="3" y1="13" x2="11" y2="13" />
                        </svg>
                        <p className="normalPunctuation">.,;</p>
                        <p className="normalPunctuation">""</p>
                        <p className="normalPunctuation">$</p>
                     </>
                    : null
                }
                
            </div>
        </>
    )
}   

export default Card;