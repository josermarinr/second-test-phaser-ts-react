import React, { useEffect } from 'react'
import './Home.css'
import { gameInstanceInit } from "./../phaser/phaserInstance";


export const Home: React.FC = () => {
   /*eslint-disable */
    let gameInstance: Phaser.Game | null = null;

    useEffect(() => {
        window.addEventListener('load', ()=>{
            if(window.innerWidth > 0 && !gameInstance){
                gameInstance = gameInstanceInit();
            }
        });
    });
    return (
        <div id="game-main">
        </div>
    )
}
