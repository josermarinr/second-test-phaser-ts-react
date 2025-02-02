import * as Phaser from 'phaser';
import { bombPowerUps, decreasePowerup, currentActiveTileTypes, score, level, levelChangeScore, incrementScore, incrementLevel, incrementCurrenActiveTileTypes, restartStats } from './phaserInstance';


export class MainScene extends Phaser.Scene {
  static KEY = 'main-scene';
  // private achievements: AchievementsPlugin;

  tileGrid:Phaser.GameObjects.Sprite[][] | null[][]  = [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null]
  ];

  tileTypes = [
    'dinoegg',
    'diplodocusgirl',
    'diplodocusmale',
    'egg',
    'pterodactilo',
    'pterodactiloyellow',
    'rexado',
    'rexbaby',
    'stegosaurus',
    'stegosaurusdad',
    'triceratopsgirl',
    'triceratopsmale',
  ];

  activeTile1: Phaser.GameObjects.Sprite | null = null;
  activeTile2: Phaser.GameObjects.Sprite | null = null;

  startPosX: number = -1;
  startPosY: number = -1;

  canMove = false;

  bombs: Phaser.GameObjects.Image[] = [];

  assetTileSize = 136;
  tileWidth: number = 0;
  tileHeight: number = 0;
  yOffset: number = 0;
  assetScale: number = 0;

  tiles: Phaser.GameObjects.Group | null = null;
  random: Phaser.Math.RandomDataGenerator | null = null;

  matchParticles: Phaser.GameObjects.Particles.ParticleEmitterManager | null = null;
  layer: Phaser.GameObjects.Image | null = null;
  scoreText: Phaser.GameObjects.Text | null = null;
  levelText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: MainScene.KEY });
  }

  preload() {
    this.load.atlas('dinos', 'assets/dinos.png', 'assets/dinos_atlas.json');
    this.load.svg('back-fence', 'assets/backFence.svg', { scale: 3 });
    this.load.svg('meteor', 'assets/meteor.svg', { scale: 0.6 });
    this.load.svg('layer', 'assets/Stonelayer.svg', { scale: 2 });
    this.load.svg('front-fence', 'assets/frontFence.svg', { scale: 3 });
    this.load.svg('bg', 'assets/bg.svg', { scale: 2 });
    this.load.svg('reload', 'assets/refresh.svg', { scale: 2});
    this.load.svg('title', 'assets/title.svg', { scale: 2.5 });
    this.load.image('match-particle', 'assets/white_particle.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#772A1C')

    this.tileWidth = this.game.scale.gameSize.width / 6;
    this.tileHeight = this.game.scale.gameSize.width / 6;
    this.yOffset = this.game.scale.gameSize.height / 4;
    this.assetScale = (this.tileWidth - 10) / this.assetTileSize;

    this.matchParticles = this.add.particles('match-particle');
    this.matchParticles.createEmitter({
      angle: { min: 240, max: 300 },
      speed: { min: 400, max: 600 },
      quantity: { min: 20, max: 50 },
      lifespan: 1000,
      alpha: { start: 1, end: 0 },
      scale: this.assetScale,
      gravityY: 800,
      on: false
    });

    const sky = this.add.rectangle(0, 0, this.game.scale.gameSize.width, this.yOffset - this.tileHeight /2 +30, 0x9ef1ff)
    sky.setOrigin(0); 

    let title = this.add.image(this.game.scale.gameSize.width / 2.5 , 0, 'title').setOrigin(0.5, 0);
    
    title
    .setScale(this.game.scale.gameSize.width / 515)
    .setDepth(1);

    let levelLayer = this.add.image(407 * (this.game.scale.gameSize.width / 515), 168 * (this.game.scale.gameSize.width / 550), 'layer');
    levelLayer
    .setOrigin(0.5)
    .setScale(this.game.scale.gameSize.width / 1021)
    .setDepth(2);

    this.levelText = this.add
    .text(407 * (this.game.scale.gameSize.width / 515), 168 * (this.game.scale.gameSize.width / 515), 'Nivel: 1',
      {
        align: 'center',
        fontSize: '26px',
        color: '#000000',
        stroke: '#000000',
        strokeThickness: 1
      })
    .setOrigin(0.5)
    .setScale(this.game.scale.gameSize.width / 800)
    .setDepth(2);
    this.scoreText = this.add
    .text(407 * (this.game.scale.gameSize.width / 515), 168 * (this.game.scale.gameSize.width / 600), 'Puntos: 0',
      {
        align: 'center',
        fontSize: '26px',
        color: '#000000',
        stroke: '#000000',
        strokeThickness: 1
      })
    .setOrigin(0.5)
    .setScale(this.game.scale.gameSize.width / 800)
    .setDepth(2);
      //todo change the alfa of bg and put more shadow in grid of tile
    const bg = this.add.image(0,this.yOffset - this.tileHeight / 1.6, 'bg');
    bg.setOrigin(0).setScale(this.game.scale.gameSize.width/750).setAlpha(0.5);
    this.add.image(-20, this.yOffset - this.tileHeight / 2, 'back-fence').setOrigin(0).setScale(this.game.scale.gameSize.width / 1021);
    this.add.image(-10, this.yOffset + this.tileHeight * 6, 'front-fence')
    .setOrigin(0).setScale(this.game.scale.gameSize.width / 1021);
    
   

    this.layer = this.add.image(111 * (this.game.scale.gameSize.width / 515), 168 * (this.game.scale.gameSize.width / 515), 'layer')
    .setOrigin(0.5)
    .setScale(this.game.scale.gameSize.width / 1021)
    .setDepth(0);
    this.getPowerups();
    const restartSign = this.add.image(this.game.scale.gameSize.width + 30, this.game.scale.gameSize.height * 0.01, 'reload')
    .setOrigin(1).setScale((this.game.scale.gameSize.width / 6) / 200).setInteractive();
    restartSign.setAngle(-90)
    restartSign.on('pointerdown', () => 
        {
            restartStats();
            this.scene.restart();
        }
    );

  

    this.tiles = this.add.group();

    const seed = Date.now().toString();
    this.random = new Phaser.Math.RandomDataGenerator([seed]);
    this.shuffleTileTypes();
    this.initTiles();

  }

  update() {
    if (this.activeTile1 && !this.activeTile2) {
      const hoverX = this.game.input.activePointer.x;
      const hoverY = this.game.input.activePointer.y;

      const startPosX = Math.floor(this.activeTile1.x / this.tileWidth);
      const startPosY = Math.floor((this.activeTile1.y - this.yOffset) / this.tileHeight);

      const hoverPosX = Math.floor(hoverX / this.tileWidth);
      const hoverPosY = Math.floor((hoverY - this.yOffset) / this.tileHeight);

      let difX = (hoverPosX - this.startPosX);
      let difY = (hoverPosY - this.startPosY);

      if (difX > 0 && difX !== 0) {
        difX = 1;
      }
      if (difX < 0 && difX !== 0) {
        difX = -1;
      }
      if (difY > 0 && difY !== 0) {
        difY = 1;
      }
      if (difY < 0 && difY !== 0) {
        difY = -1;
      }

      if (!(hoverPosY > this.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > this.tileGrid.length - 1 || hoverPosX < 0)) {
        if ((Math.abs(difY) >= 1 && difX === 0) || (Math.abs(difX) >= 1 && difY === 0)) {
          this.canMove = false;
          this.activeTile2 = this.tileGrid[startPosX + difX][startPosY + difY];
          this.swapTiles();
          this.time.addEvent({ delay: 500, callback: () => this.checkMatch() });
        }

      }
    }
  }

  private getPowerups() {
    this.bombs.forEach(bomb => bomb.destroy());
    this.bombs = [];
    const bombs = bombPowerUps;
    for (let i = 0; i < bombs; i++) {
       
      const bomb = this.add.image(i * 111 *  ((this.game.scale.gameSize.width / 515) *1.4/ 2.7 ) + (this.game.scale.gameSize.width * 0.1),
        168 * (this.game.scale.gameSize.width / 515) + 15 - this.layer!.height * this.layer!.scale / 4, 'meteor')
        .setScale(this.assetScale *0.9 ).setOrigin(0.5).setInteractive();
      (bomb as Phaser.GameObjects.Sprite).on('pointerdown', () => this.triggerBomb());
      this.bombs.push(bomb);
    }
  }

  triggerBomb() {
    if (this.canMove && bombPowerUps > 0) {
      this.canMove = false;
      decreasePowerup();
      this.bombs[bombPowerUps].destroy(true);
      this.clearTiles();
      this.time.addEvent({ delay: 500, callback: () => this.checkMatch() });
    }
  }

  private shuffleTileTypes() {
    let j;
    let x;
    for (let i = this.tileTypes.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = this.tileTypes[i];
      this.tileTypes[i] = this.tileTypes[j];
      this.tileTypes[j] = x;
    }
  }

  private initTiles() {
    for (let i = 0; i < this.tileGrid.length; i++) {
      for (let j = 0; j < this.tileGrid.length; j++) {
        const tile = this.addTile(i, j);
        this.tileGrid[i][j] = tile;
      }
    }
    this.time.addEvent({ delay: 500, callback: () => this.checkMatch() });
  }

  private addTile(x: number, y: number) {

    const tileToAdd = this.tileTypes[this.random!.integerInRange(0, currentActiveTileTypes - 1)];
    const tile = this.tiles!.create((x * this.tileWidth) + this.tileWidth / 2, 0, 'dinos', tileToAdd);
    tile.scale = this.assetScale;

    this.add.tween({
      targets: tile,
      duration: 500,
      y: {
        from: tile.y,
        to: y * this.tileHeight + (this.tileHeight / 2) + (this.yOffset),
      }
    });

    tile.setInteractive();
    tile.tileType = tileToAdd;

    (tile as Phaser.GameObjects.Sprite).on('pointerdown', () => this.tileDown(tile));

    return tile;

  }

  private tileDown(tile: Phaser.GameObjects.Sprite) {
 
    if (this.canMove) {
      this.activeTile1 = tile;
      this.startPosX = (tile.x - this.tileWidth / 2) / this.tileWidth;
      this.startPosY = (tile.y - this.tileHeight / 2 - (this.yOffset)) / this.tileHeight;
    }
  }

  private swapTiles() {
    if (this.activeTile1 && this.activeTile2) {
      const tile1Pos = {
        x: (this.activeTile1.x - this.tileWidth / 2) / this.tileWidth,
        y: (this.activeTile1.y - this.tileHeight / 2 - (this.yOffset)) / this.tileHeight
      };

      const tile2Pos = {
        x: (this.activeTile2.x - this.tileWidth / 2) / this.tileWidth,
        y: (this.activeTile2.y - this.tileHeight / 2 - (this.yOffset)) / this.tileHeight
      };

      this.tileGrid[tile1Pos.x][tile1Pos.y] = this.activeTile2;
      this.tileGrid[tile2Pos.x][tile2Pos.y] = this.activeTile1;

      this.add.tween({
        targets: this.activeTile1,
        duration: 200,
        x: {
          from: this.activeTile1.x,
          to: tile2Pos.x * this.tileWidth + (this.tileWidth / 2),
        },
        y: {
          from: this.activeTile1.y,
          to: tile2Pos.y * this.tileHeight + (this.tileHeight / 2) + (this.yOffset),
        }
      });

      this.add.tween({
        targets: this.activeTile2,
        duration: 200,
        x: {
          from: this.activeTile2.x,
          to: tile1Pos.x * this.tileWidth + (this.tileWidth / 2),
        },
        y: {
          from: this.activeTile2.y,
          to: tile1Pos.y * this.tileHeight + (this.tileHeight / 2) + (this.yOffset),
        }
      });
      this.activeTile1 = this.tileGrid[tile1Pos.x][tile1Pos.y];
      this.activeTile2 = this.tileGrid[tile2Pos.x][tile2Pos.y];
    }
  }

  private checkMatch() {
    const matches = this.getMatches(this.tileGrid);
    if (matches.length > 0) {
      this.removeTileGroup(matches);
      this.resetTile();
      this.fillTile();
      this.time.addEvent({ delay: 500, callback: () => this.tileUp() });
      this.time.addEvent({ delay: 600, callback: () => this.checkMatch() });
    }
    else {
      this.swapTiles();
      this.time.addEvent({
        delay: 500, callback: () => {
          this.tileUp();
          this.canMove = !this.checkGameOver();
        }
      });
    }
  }

  private checkGameOver(): boolean {
    const outOfBombs: boolean = bombPowerUps === 0;
    const outOfMoves: boolean = !this.checkSwapPossible();

    if (outOfBombs && outOfMoves) {
      // this.gameInstanceService.submitScore();

      const levelText = this.add
        .text(this.game.scale.gameSize.width / 2, this.game.scale.gameSize.height / 2, 'Game Over \nNo more moves',
          {
            align: 'center',
            fontSize: '32px',
            stroke: '#000000',
            strokeThickness: 5
          })
        .setOrigin(0.5)
        .setDepth(1);

      this.tweens.add({
        targets: levelText,
        scaleX: 1,
        scaleY: 1,
        angle: 360,
        _ease: 'Sine.easeInOut',
        ease: 'Power2',
        duration: 1000,
        delay: 50
      });
      return true;
    }
    return false;
  }

  private clearTiles() {
    this.removeTileGroup(this.tileGrid);
    this.fillTile();
  }

  private tileUp() {
    this.activeTile1 = null;
    this.activeTile2 = null;
  }

  private getMatches(grid: any[][]) {
    const matches = [];
    let groups = [];
    // Check for horizontal matches
    let i = 0;
    let j = 0;

    for (const tempArr of grid) {
      groups = [];
      for (j = 0; j < tempArr.length; j++) {
        if (j < tempArr.length - 2) {
          if (grid[i][j] && grid[i][j + 1] && grid[i][j + 2]) {
            if (grid[i][j].tileType === grid[i][j + 1].tileType &&
              grid[i][j + 1].tileType === grid[i][j + 2].tileType) {
              if (groups.length > 0) {
                if (groups.indexOf(grid[i][j]) === -1) {
                  matches.push(groups);
                  groups = [];
                }
              }

              if (groups.indexOf(grid[i][j]) === -1) {
                groups.push(grid[i][j]);
              }
              if (groups.indexOf(grid[i][j + 1]) === -1) {
                groups.push(grid[i][j + 1]);
              }
              if (groups.indexOf(grid[i][j + 2]) === -1) {
                groups.push(grid[i][j + 2]);
              }
            }
          }
        }
      }
      if (groups.length > 0) {
        matches.push(groups);
      }
      i++;
    }

    i = 0;
    j = 0;

    // Check for vertical matches
    for (const tempArr of grid) {
      groups = [];
      for (i = 0; i < tempArr.length; i++) {
        if (i < tempArr.length - 2) {
          if (grid[i][j] && grid[i + 1][j] && grid[i + 2][j]) {
            if (grid[i][j].tileType === grid[i + 1][j].tileType &&
              grid[i + 1][j].tileType === grid[i + 2][j].tileType) {
              if (groups.length > 0) {
                if (groups.indexOf(grid[i][j]) === -1) {
                  matches.push(groups);
                  groups = [];
                }
              }

              if (groups.indexOf(grid[i][j]) === -1) {
                groups.push(grid[i][j]);
              }
              if (groups.indexOf(grid[i + 1][j]) === -1) {
                groups.push(grid[i + 1][j]);
              }
              if (groups.indexOf(grid[i + 2][j]) === -1) {
                groups.push(grid[i + 2][j]);
              }
            }
          }
        }
      }
      if (groups.length > 0) {
        matches.push(groups);
      }
      j++;
    }
    return matches;
  }

  private checkSwapPossible() {
    const testGrid = [];
    for (const tempArr of this.tileGrid) {
      const testArr = [];
      for (const tempTile of tempArr) {
        testArr.push({ tileType: (tempTile as any).tileType });
      }
      testGrid.push(testArr);
    }

    for (let i = 0; i < testGrid.length; i++) {
      for (let j = 0; j < testGrid[i].length; j++) {
        if (j > 0) {
          const tile1 = testGrid[i][j];
          const tile2 = testGrid[i][j - 1];

          testGrid[i][j] = tile2;
          testGrid[i][j - 1] = tile1;

          if (this.getMatches(testGrid).length > 0) {
            return true;
          }

          testGrid[i][j] = tile1;
          testGrid[i][j - 1] = tile2;
        }

        if (j < testGrid[i].length - 1) {
          const tile1 = testGrid[i][j];
          const tile2 = testGrid[i][j + 1];

          testGrid[i][j] = tile2;
          testGrid[i][j + 1] = tile1;

          if (this.getMatches(testGrid).length > 0) {
            return true;
          }

          testGrid[i][j] = tile1;
          testGrid[i][j + 1] = tile2;
        }

        if (i > 0) {
          const tile1 = testGrid[i][j];
          const tile2 = testGrid[i - 1][j];

          testGrid[i][j] = tile2;
          testGrid[i - 1][j] = tile1;

          if (this.getMatches(testGrid).length > 0) {
            return true;
          }

          testGrid[i][j] = tile1;
          testGrid[i - 1][j] = tile2;
        }

        if (i < testGrid.length - 1) {
          const tile1 = testGrid[i][j];
          const tile2 = testGrid[i + 1][j];

          testGrid[i][j] = tile2;
          testGrid[i + 1][j] = tile1;

          if (this.getMatches(testGrid).length > 0) {
            return true;
          }

          testGrid[i][j] = tile1;
          testGrid[i + 1][j] = tile2;
        }
      }
    }

    return false;
  }

  private removeTileGroup(matches: any[][]) {
    for (const tempArr of matches) {
      for (const tile of tempArr) {
        const tilePos = this.getTilePos(this.tileGrid, tile);
        this.matchParticles!.emitParticleAt(tile.x, tile.y);
        this.tiles!.remove(tile, true);
        this.incrementScore();
        if (tilePos.x !== -1 && tilePos.y !== -1) {
          this.tileGrid[tilePos.x][tilePos.y] = null;
        }
      }
    }
  }

  private incrementScore() {
    incrementScore(10);
    this.scoreText!.setText(`Score: ${score}`);
    //this.achievements.checkScoreAchievementsState(score);
    this.checkLevelChange();
  }

  private checkLevelChange() {
    if (score > 0 && score % levelChangeScore === 0) {
      incrementLevel();
      if (currentActiveTileTypes < this.tileTypes.length) {
        incrementCurrenActiveTileTypes()
      }

      const levelText = this.add.text(this.game.scale.gameSize.width / 2, this.game.scale.gameSize.height / 2, `Level ${level}`,
        {
          fontSize: '32px',
          stroke: '#000000',
          strokeThickness: 5
        }).setOrigin(0.5).setDepth(1);

      this.tweens.add({
        targets: levelText,
        scaleX: 1,
        scaleY: 1,
        angle: 360,
        _ease: 'Sine.easeInOut',
        ease: 'Power2',
        duration: 1000,
        delay: 50
      });

      this.time.addEvent({
        delay: 2000, callback: () => {
          levelText.destroy(true);
        }
      });

      this.levelText!.setText(`Level ${level}`);
    }
  }

  private getTilePos(tileGrid: string | any[], tile: any) {
    const pos = { x: -1, y: -1 };

    for (let i = 0; i < tileGrid.length; i++) {
      for (let j = 0; j < tileGrid[i].length; j++) {
        if (tile === tileGrid[i][j]) {
          pos.x = i;
          pos.y = j;
          break;
        }
      }
    }

    return pos;
  }

  private resetTile() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.tileGrid.length; i++) {
      for (let j = this.tileGrid[i].length - 1; j > 0; j--) {
        if (this.tileGrid[i][j] == null && this.tileGrid[i][j - 1] != null) {
          const tempTile = this.tileGrid[i][j - 1];
          this.tileGrid[i][j] = tempTile;
          this.tileGrid[i][j - 1] = null;

          this.add.tween({
            targets: tempTile,
            duration: 200,
            y: {
              from: tempTile!.y,
              to: (this.tileHeight * j) + (this.tileHeight / 2) + (this.yOffset),
            }
          });

          j = this.tileGrid[i].length;
        }
      }
    }
  }

  private fillTile() {
    for (let i = 0; i < this.tileGrid.length; i++) {
      for (let j = 0; j < this.tileGrid.length; j++) {
        if (this.tileGrid[i][j] == null) {
          const tile = this.addTile(i, j);
          this.tileGrid[i][j] = tile;
        }
      }
    }
  }

}
