import Phaser from 'phaser'
import {MainScene} from './scene'

export const leaderboardId = 'CgkIkbvdu8ASEAIQCQ'; 
export let score = 0;
export let level = 1;
export let levelChangeScore = 1000;
export let currentActiveTileTypes = 4;
export let bombPowerUps = 3;

export const sizeWidth = () =>{
    if(window.innerWidth< 800){
        return window.innerWidth;
    }
    if(window.innerWidth > 700){
        return 375
    }
}

export const sizeHeight = () =>{

    if(window.innerHeight< 800){
        return 812
    }
    return window.innerHeight;
}

export const scaleOrFixingSize = () => {
    if(window.innerWidth< 800){
        return Phaser.Scale.RESIZE
    }
    return Phaser.Scale.FIT
}

export const gameInstanceInit = () =>{
    return new Phaser.Game({
        plugins: {
            global: [
                
            ]
        },
        width: sizeWidth(),
        height: sizeHeight(),
        type: Phaser.AUTO,
        scale: {
            mode: scaleOrFixingSize(),
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
