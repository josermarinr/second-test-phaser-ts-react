import Phaser from 'phaser'
import {MainScene} from './scene'

export const leaderboardId = 'CgkIkbvdu8ASEAIQCQ'; 
export let score = 0;
export let level = 1;
export let levelChangeScore = 1000;
export let currentActiveTileTypes = 4;
export let bombPowerUps = 3;

export const fukingSizeWidth = () =>{
    if(window.innerWidth<= 700){
        return window.innerWidth;
    }
    if(window.innerWidth > 700){
        return 425
    }
}

export const fukingSizeHeight = () =>{

    if(window.innerHeight > 700){
        return 772
    }
    return window.innerHeight;
}

export const gameInstanceInit = () =>{
    return new Phaser.Game({
        plugins: {
            global: [
                
            ]
        },
        width: fukingSizeWidth(),
        height: fukingSizeHeight(),
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        parent: 'game-main',
        scene: [MainScene],
        fps: {
            forceSetTimeOut: true
        }
    })

}

export function restartStats() {
    score = 0;
    level = 1;
    currentActiveTileTypes = 4;
    bombPowerUps = 3;
}

export function decreasePowerup() {
    bombPowerUps--;
}

export function incrementScore(amount: number) {
    score += amount;
}

export function incrementLevel() {
    level++;
}

export function incrementCurrenActiveTileTypes() {
    currentActiveTileTypes++;
}
