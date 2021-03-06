
// validation off all details
function checkValidation(inputObject) {
    let selectedName = inputObject.name,
    health = inputObject.health,
    speed = inputObject.speed,
    attack = inputObject.attack,
    minDamage = inputObject.damageMin,
    maxDamage = inputObject.damageMax,
    defense = inputObject.defense,
    hasMagic = inputObject.hasMagic,
    mana = inputObject.magic.mana,
    fire = inputObject.magic.fireBallMagic,
    lightning = inputObject.magic.lightningBoltMagic,
    heal = inputObject.magic.healingMagic;

    if (selectedName !== "" && health >= 1 && health <= 100 && speed >= 1 && speed <= 10 && attack >= 25 && attack <= 50 && minDamage >= 1 && minDamage <= 6 && maxDamage >= 7 && maxDamage <= 15 && defense >= 1 && defense <= 50) {
        if (hasMagic === true) {
            const spells = [fire, lightning, heal];
            const isLearned = (learned) => learned === true;
            // use .some() to find that any spell is selected (true)
            if (spells.some(isLearned)) {
                if (mana >= 1 && mana <= 100) { console.log("TRUE - fully valid");  logDetails(inputObject);    return "fullValid";
                } else { console.log("FALSE - no mana added");   return "manaMissing"; }
            } else { console.log("FALSE - missing spell selection");    return "missingSpellSelection"; }
        } else { console.log("TRUE - no magic selected but valid");  logDetails(inputObject);    return "fullValid"; }
    } else { console.log("FALSE - invalid details..");   return "wrongInput"; }
}

// validation for only number
function isNumber(e) {
    let char = String.fromCharCode(e.keyCode);
    if (/^[0-9]+$/.test(char)) { return true; 
    } else { return false; }
}

// validation for only text
function isString(e) {
    let char = String.fromCharCode(e.keyCode);
    if (/^[A-Za-z\s]+$/.test(char)) { return true;
    } else { return false; }
}

function logDetails(input) {
    // console.log(input.name + " [hp:" + input.health + "] - [speed:" + input.speed + "] - [attack:" + input.attack + "] - [minDmg:" + input.damageMin + 
    // "] - [maxDmg:" + input.damageMax + "] - [defense:" + input.defense + "] - [hasMagic:" + input.hasMagic +  "] - [mana:" + input.magic.mana + 
    // "] - [fire:" + input.magic.fireBallMagic + "] - [lightning:" + input.magic.lightningBoltMagic + "] - [heal:" + input.magic.healingMagic + "]");
}

function capitalizeName(input) {
    //split the above string into an array of strings whenever a blank space is encountered
    const splittedInput = input.split(" ");
    //loop through each element of the array and capitalize the first letter.
    for (var i = 0; i < splittedInput.length; i++) {
        splittedInput[i] = splittedInput[i].charAt(0).toUpperCase() + splittedInput[i].slice(1);
    }
    //Join all the elements of the array back into a string using a blank-space as a separator
    const modifiedInput = splittedInput.join(" ");
    return modifiedInput;
}

function spellSelected(checkBoxesName) {
    const checkBoxes = document.getElementsByName(checkBoxesName);
    let status = false;
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            status = true;
            break;
        }
    }
    if (status) { console.log("selected one");    return false;
    } else { console.log("none selected");   return true; }
}

// -------------------------
// ----- VUE APP CODE ------
// -------------------------
const { ref, createApp } = Vue.createApp({
    data() {
        return {
            classNames: {
                evenRoll: true,
                oddRoll: false,
            },
            errors: {
                spellMissingMonster: false,
                spellMissingPlayer: false,
                sameName: false,
                validForm: false,
                monsterErrorMessage: "",
                playerErrorMessage: "",
                differentNamesRequested : "Names cannot be the same!",
                spellRequested : "Select at least one spell!"
            },
            monster: {
                name: "",
                health: "",
                speed: "",
                attack: "",
                damageMin: "",
                damageMax: "",
                defense: "",
                hasMagic: false,
                magic: {
                mana: "",
                fireBallMagic: false,
                lightningBoltMagic: false,
                healingMagic: false,
                },
                originalHealth: "",
                originalMana: "",
                monsterImageSource: 'img/monster.png',
            },
            player: {
                name: "",
                health: "",
                speed: "",
                attack: "",
                damageMin: "",
                damageMax: "",
                defense: "",
                hasMagic: false,
                magic: {
                mana: "",
                fireBallMagic: false,
                lightningBoltMagic: false,
                healingMagic: false,
                },
                originalHealth: "",
                originalMana: "",
                playerImageSource: 'img/player.png',
            },
            dices: {
                dicesNumber: 4,
                dieSides: 6,
                dieSpots: 0,
                dieVisible: [
                { number: 1, active: true },
                { number: 2, active: true },
                { number: 3, active: false },
                { number: 4, active: false },
                ],
            },
            fightDetails: {
                startRound: false,
                roundCounter: 1,
                playerFullSpeed : '',
                monsterFullSpeed: '',
                roundsOrder: [false, false],
                actionImageSource: 'img/hourglass.gif',
            },

            currentDices:[],
            detailsSaved: false,
            savedDetailsEarlier: this.savedEarlier(),
            

            actionButton: true,

            attackAction: true,
            fireBallAction: true,
            lightningBoltAction: true,
            healingAction: true,
            surrender: false,

            attackOrSpell: [0,0,1,0,0,1,0,1,0,0],

            logMessages: []

        };
    },
    computed: {
        savedBefore() { return !this.savedDetailsEarlier; },

        monsterCurrentHealth() { 
            if(this.monster.health<0){
                this.monster.health = 0;
                return "0%";
            }else{
                return this.monster.health + "%";
            }
        },

        monsterCurrentMana() { return this.monster.magic.mana + "%"; },

        playerCurrentHealth() { 
            if(this.player.health<0){
                this.player.health = 0;
                return "0%";
            }else{
                return this.player.health + "%";
            }
        },

        playerCurrentMana() { return this.player.magic.mana + "%"; },

        visibleDices() {
            return this.dices.dieVisible.filter( function(u){
                return u.active === true;
            });
        },
    },
    watch: {
        'player.health'(value){
            if(value <=0){
                this.player.playerImageSource = 'img/graveyard.png';
                this.fightDetails.actionImageSource = 'img/playerLose.png'; 
            }else{
                this.player.playerImageSource = 'img/player.png';
            }
        },
        'monster.health'(value){
            if(value <=0){
                this.monster.monsterImageSource = 'img/graveyard.png';
                this.fightDetails.actionImageSource = 'img/playerWin.png';
            }else{
                this.monster.monsterImageSource = 'img/monster.png';
            }
        }
        
    },
    methods: {

        checkNamesConflict() {
            // if none of name field is empty
            if (this.monster.name !== "" && this.player.name !== "") {
                // same name for Monster and Player
                if (this.monster.name === this.player.name) {
                    this.errors.validForm = false;
                    this.errors.sameName = true;
                } else {
                    this.errors.validForm = true;
                    this.errors.sameName = false;
                }
            } else { this.errors.sameName = false; }
        },

        clearSpells(input) {
            if (input === "monster") {
                if (this.monster.hasMagic === false) {
                    this.monster.magic.mana = "";
                    this.monster.magic.fireBallMagic = false;
                    this.monster.magic.lightningBoltMagic = false;
                    this.monster.magic.healingMagic = false;
                    this.errors.spellMissingMonster = false;
                }
            } else {
                if (this.player.hasMagic === false) {
                    this.player.magic.mana = "";
                    this.player.magic.fireBallMagic = false;
                    this.player.magic.lightningBoltMagic = false;
                    this.player.magic.healingMagic = false;
                    this.errors.spellMissingPlayer = false;
                }
            }
        },

        savedEarlier() {
            if (localStorage.getItem("monsterDetails") !== null && localStorage.getItem("playerDetails") !== null) { return true;
            } else { return false; }
        },

        validateDetails() {
            // console.log('validation called');
            let monsterCheck = checkValidation(this.monster);
            let playerCheck = checkValidation(this.player);
            this.checkNamesConflict();
            if (monsterCheck === "fullValid" && playerCheck === "fullValid" && this.errors.validForm) { return true;
            } else {
                switch (monsterCheck) {
                    case "missingSpellSelection":
                        this.errors.spellMissingMonster = true;
                        break;
                    case "manaMissing":
                        this.errors.monsterErrorMessage = "Mana is necessary for spells!";
                        break;
                    case "wrongInput":
                        this.errors.monsterErrorMessage = "One or more details are invalid!";
                        break;
                    default:
                        this.errors.monsterErrorMessage = "";
                        break;
                }
                switch (playerCheck) {
                    case "missingSpellSelection":
                        this.errors.spellMissingPlayer = true;
                        break;
                    case "manaMissing":
                        this.errors.playerErrorMessage = "Mana is necessary for spells!";
                        break;
                    case "wrongInput":
                        this.errors.playerErrorMessage = "One or more details are invalid!";
                        break;
                    default:
                        this.errors.playerErrorMessage = "";
                        break;
                }
                return false;
            }
        },

        actionButtons() {
            if(this.monster.health <=0 || this.player.health <=0) { this.actionButton= false; return false}
            else { this.actionButton = true; return true;}
        },

        startRoundRoll(){
            //change the button to disabled to prevent double clicks
            this.fightDetails.startRound = true;
            this.surrender = false;
            
            this.showTwoDice();

            let playerSpeed = [];
            let monsterSpeed = [];

            //user roll
            playerSpeed = this.rolling();
            
            //monster roll
            //use setTimeout to make sure animation is ending
            setTimeout(() => {
                monsterSpeed = this.rolling();
            }, 2000);
            //using another setTimeout to make sure the monster roll is done before calling the calculateWhoIsFaster()
            setTimeout(() => {
                this.calculateWhoIsFaster(playerSpeed, monsterSpeed);        
            }, 4000);
        },

        rolling() {
            const diceResults = [];
            //using setTimeout() to give small amount of time for Vue to refresh DOM from computed property visibleDices()
            setTimeout(() => {
                //now used querySelectorAll but later it must be changed to $refs and made all the dice to component
                const dice = [...document.querySelectorAll(".die-list")];
                //toggle die's classes
                this.classNames.evenRoll = !this.classNames.evenRoll;
                this.classNames.oddRoll = !this.classNames.oddRoll;
                dice.forEach((die) => {
                // dataset : https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
                die.dataset.roll = this.getRandomNumber(1, 6);
                diceResults.push(die.dataset.roll);
                });
                //console.log(diceResults);
                this.currentDices = [...diceResults];
            }, 10);
            return diceResults;
        },

        getRandomNumber(min, max) {
            const minimum = Math.ceil(min);
            const maximum = Math.floor(max);
            return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        },

        checkEnoughMana(arg){
            if(arg === "player"){
                return (this.player.magic.mana >= 20) ? true : false;
            } else {
                return (this.monster.magic.mana >= 20) ? true : false;
            }
        },

        woIsNext(){
            //if the game is not ended with the monster or player death, then check who is the next
            let message = '';
            if(this.actionButtons()){
                //one second break for make sure user can read the battleLog and display action image
                setTimeout(()=>{
                                
                    //when monster and player is finished their action in the current round then start a new round
                    if ( this.fightDetails.roundsOrder[0] === true && this.fightDetails.roundsOrder[1] === true ) {
                        message = '----- Round ' + (parseInt(this.fightDetails.roundCounter,10)+1) + ' -----';
                        this.addLogMessage('', '', 'message', 0, message);
                        this.fightDetails.actionImageSource = "img/hourglass.gif"
                        this.newRound(1)
                    } 
                    //when monster done with action and the next is the player
                    else if ( this.fightDetails.roundsOrder[0] === true && this.fightDetails.roundsOrder[1] === false ) {
                        // console.log("*** Player ***");
                        this.activatePlayerActions();
                    }
                    //when player done with action and the next is the monster
                    else {
                        // console.log("*** Monster ***");
                        this.monsterAILogic();
                    }
                }, 1000)
            }
        },

        newRound(increment){
            //increment the round IF its a new round ELSE do not increment -- (1 or 0)
            this.fightDetails.roundCounter += increment;
            //change back roundsOrder[] to the original status
            this.fightDetails.roundsOrder = [false, false];
            //activate the button
            this.fightDetails.startRound = false;
        },

        disableActionButtons(){
            this.attackAction = true;
            this.fireBallAction = true;
            this.lightningBoltAction = true;
            this.healingAction = true;
        },

        showTwoDice(){
            this.dices.dieVisible[2].active = false;
            this.dices.dieVisible[3].active = false;
        },

        showFourDice(){
            for (let i = 0; i < this.dices.dieVisible.length; i++) {
                this.dices.dieVisible[i].active = true;
            }
        },

        calculateWhoIsFaster( playerSpeed, monsterSpeed ){
            //parse all the elements in the arrays to Integer
            for(let i=0; i<playerSpeed.length; i++){
                playerSpeed[i] = parseInt(playerSpeed[i], 10);
                monsterSpeed[i] = parseInt(monsterSpeed[i], 10);
            }
            this.fightDetails.playerFullSpeed = parseInt(this.player.speed, 10) + playerSpeed[0] + playerSpeed[1];
            this.fightDetails.monsterFullSpeed = parseInt(this.monster.speed, 10) + monsterSpeed[0] + monsterSpeed[1];
            
            //update battleLog here ...
            // console.log(this.fightDetails.playerFullSpeed);
            // console.log(this.fightDetails.monsterFullSpeed);
            let message= '';

            if( this.fightDetails.playerFullSpeed > this.fightDetails.monsterFullSpeed ){
                message = "With " + this.fightDetails.playerFullSpeed + " ("+ this.player.speed + "+" + playerSpeed[0] + "+" + playerSpeed[1]+ ") " + this.player.name +  " starts the round.";
                this.addLogMessage('', '', 'message', 0, message);
                //player's round
                this.activatePlayerActions();
            }
            else if( this.fightDetails.playerFullSpeed < this.fightDetails.monsterFullSpeed ) { 
                message = "With " + this.fightDetails.monsterFullSpeed + " ("+ this.monster.speed + "+" + monsterSpeed[0] + "+" + monsterSpeed[1]+ ") " + this.monster.name +  " starts the round.";
                this.addLogMessage('', '', 'message', 0, message);
                //monster's round
                this.monsterAILogic();
            }
            else { 
                //equal, so roll again
                message = "Equal Roll ... Roll again!"
                //update battleLog
                this.addLogMessage('', '', 'message', 0, message);
                // console.log("Equal! Roll Again");
                //new round necessary
                this.newRound(0);
            }
        },

        playerAction(rollFor) {
            // console.log("diceRoll called for " + rollFor);
            switch (rollFor) {
                case "attack":
                    //change the button to disabled to prevent double clicks
                    this.disableActionButtons();
                    this.doAttack(this.player, this.monster, 1);
                    break;
                case "fire":
                    this.disableActionButtons();
                    this.doFireBall(this.player, this.monster, 1);
                    break;
                case "lightning":
                    this.disableActionButtons();
                    this.doLightningBolt(this.player, this.monster, 1);
                    break;
                case "heal":
                    this.disableActionButtons();
                    const isEnoughMana = this.checkEnoughMana("player");
                    if(isEnoughMana){
                        this.doHealing(this.player, 1);
                    } else {
                        //TODO: todo?
                        //do not activate heal because not enough mana -> display as error
                        console.log("Player has not enough mana for healing");
                    }
                    this.fightDetails.roundsOrder[1] = true;
                    break;
            }
        },

        monsterAILogic(){
            const monsterHealth = this.monster.health;
            const monsterMana = this.monster.magic.mana;
            const monsterFireBall = this.monster.magic.fireBallMagic;
            const monsterLightningBolt = this.monster.magic.lightningBoltMagic;
            const monsterHealing = this.monster.magic.healingMagic;

            //First of all, when the monster health is higher than 15 then if that possible then the monster try to 
            //execute the player with spell (or attack if has not enough mana)
            if(this.player.health <= 10 && monsterHealth > 20){
                if ((monsterFireBall === true || monsterLightningBolt === true)) {
                        // console.log("Monster try to execute player with Magic!");
                        this.selectMonsterSpellForUse(monsterFireBall, monsterLightningBolt);
                } else {
                    //without mana just attack
                    // console.log("Monster try to execute player with Attack!");
                    this.doAttack(this.monster, this.player, 0);
                }
            }
            //secondly, the monster try to survive the battle, so if he/she has healing + mana + level of his/her health based on 
            //randomHealthLevelForMonsterHealing() or less health than 20 (and originally was more)then try to heal himself/herself
            else if( (monsterHealth <= (this.randomHealthLevelForMonsterHealing())) || (this.monster.originalHealth >= 20 && monsterHealth < 20) ){
                if( this.checkEnoughMana("monster") ){
                    if( monsterHealing ){
                        // console.log("monster HEALING ...");
                        this.doHealing(this.monster, 0);
                        this.fightDetails.roundsOrder[0] = true;
                    } 
                    else if ( monsterMana >= 40 ) {
                        // console.log( "monster DON'T HAS healing ... but ..." );
                        this.selectMonsterSpellOrAttack(monsterFireBall, monsterLightningBolt, 10);
                    } else {
                        this.selectMonsterSpellOrAttack(monsterFireBall, monsterLightningBolt, 5);
                    }
                }
                else {
                    this.doAttack(this.monster, this.player, 0);
                }
            } else{
                //if monster has enough mana for 2 spell then he choose randomly between attack and magic
                //(a bit more chance for attack)
                if(monsterMana >= 35){
                    this.selectMonsterSpellOrAttack(monsterFireBall, monsterLightningBolt, 10);
                } 
                //if mana not enough for 2 spell then chance to use spell is reduced
                else if(monsterMana >= 16 && monsterMana <= 34){
                    this.selectMonsterSpellOrAttack(monsterFireBall, monsterLightningBolt, 5)
                }
                //just attack
                else{
                    this.doAttack(this.monster, this.player, 0);
                }
            }
        },

        selectMonsterSpellOrAttack(fireBall,lightningBolt,range){
            let selectAction = this.attackOrSpell[this.getRandomNumber(1,range)-1];
            if(selectAction === 1){
                this.selectMonsterSpellForUse(fireBall, lightningBolt);
            }else{
                this.doAttack(this.monster, this.player, 0);
            }
        },

        selectMonsterSpellForUse(fire, lightning){
            //if mana is minimum 20 then monster has enough mana for any spell
            if(this.monster.mana >=20){
                //if both spell is learned choose one randomly
                if(fire === true && lightning === true){
                    let whichSpell = this.getRandomNumber(1,2);
                    if(whichSpell === 1){
                        this.doFireBall(this.monster, this.player, 0);
                    }else{
                        this.doLightningBolt(this.monster, this.player, 0);
                    }
                }
                //choose fireBall
                else if(fire === true && lightning === false){
                    this.doFireBall(this.monster, this.player, 0);
                }
                //choose lightningBolt
                else{
                    this.doLightningBolt(this.monster, this.player, 0);
                }
            } 
            //mana enough just for fireBall
            else {
                this.doFireBall(this.monster, this.player, 0);
            }
            
        },

        randomHealthLevelForMonsterHealing(){
            const randomHealRules = [(this.monster.originalHealth/3), (this.monster.originalHealth/2), (this.monster.originalHealth/4), (this.monster.originalHealth-20)];
            let index = Math.floor(Math.random() * randomHealRules.length);
            // console.log(index)
            return randomHealRules[index];
        },

        activatePlayerActions(){
            this.attackAction = false;

            if(this.player.magic.fireBallMagic === true && this.player.magic.mana >= 20){
                this.fireBallAction = false;
            }
            if(this.player.magic.lightningBoltMagic === true && this.player.magic.mana >= 20){
                this.lightningBoltAction = false;
            }
            if(this.player.magic.healingMagic === true && (this.player.health < this.player.originalHealth)
                && this.player.magic.mana >= 20){
                this.healingAction = false;
            }
            
        },

        /*  ---------------------------
            --------- ACTIONS ---------
            ---------------------------
        */ 
        doAttack(arg1, arg2, arg3){
            let who = arg1;
            let whom = arg2;
            // console.log(who.name + " attacking " + whom.name);
            this.showFourDice();
            this.rolling();
            //need to wait a small amount of time to let the rolling() finish the process
            setTimeout(() => {
                let finalAttack = parseInt(who.attack, 10);
                let dicesSum = 0;
                this.currentDices.forEach(x => {
                    dicesSum += parseInt(x,10);
                });
                finalAttack += dicesSum;
                // console.log("Attack: " + finalAttack + " / Defense: " + whom.defense)
                this.changeImageSource("attack", arg3);
                if(finalAttack > whom.defense){
                    //calculate the damage
                    let damage = this.getRandomNumber(who.damageMin, who.damageMax);
                    //check that the attack is critical hit or not (15 points or more over defense points => critical hit => + 5dmg)
                    if ( (finalAttack - whom.defense) >= 15 ){
                        // console.log( "Wow, it was a critical hit! Damage is " + (damage + 5) );
                        this.addLogMessage(who.name, whom.name, 'crit-attack', damage+5, '');
                        //add delay on changing to let dices finish the roll
                        setTimeout(() => {
                            whom.health -= (damage + 5);
                        }, 2000);
                    }else{
                        // console.log( "Success! Damage is " + damage );
                        this.addLogMessage(who.name, whom.name, 'attack', damage, '');
                        //add delay on changing to let dices finish the roll
                        setTimeout(() => {
                            whom.health -= damage;
                        }, 2000);
                    }
                }else{
                    this.addLogMessage(who.name, whom.name, 'defended', 0, '');
                    // console.log("Unsuccessful! Not enough attack points...")
                }
                this.fightDetails.roundsOrder[arg3] = true;
                //add delay on changing to let dices finish the roll
                setTimeout(()=>{
                    this.woIsNext();
                }, 2000);
            }, 20);
            
        },

        doFireBall(arg1, arg2, arg3){
            let who = arg1;
            let whom = arg2;
            this.changeImageSource("fireBall", arg3);
            // console.log(who.name + " used FireBall against " + whom.name);
            who.magic.mana -= 15;
            whom.health -= 10;
            this.fightDetails.roundsOrder[arg3] = true;
            this.addLogMessage(who.name, whom.name, 'fireball', 10, '');
            //add delay on changing properties
            setTimeout(()=>{
                this.woIsNext();
            }, 1500);

        },

        doLightningBolt(arg1, arg2, arg3){
            let who = arg1;
            let whom = arg2;
            this.changeImageSource("lightningBolt", arg3);
            // console.log(who.name + " used LightningBolt against " + whom.name);
            who.magic.mana -= 20;
            whom.health -= 15;
            this.fightDetails.roundsOrder[arg3] = true;
            this.addLogMessage(who.name, whom.name, 'lightning', 10, '');
            setTimeout(()=>{
                this.woIsNext();
            }, 2000);
        },

        doHealing(arg1, arg2){
            console.log(arg1 + "and" + arg2)
            let who = arg1;
            console.log(who.name + " wants to heal.");
            
            if(who.health < who.originalHealth){
                console.log("health is smaller than originalHealth")
                if( (who.health + 20) <= who.originalHealth){
                    this.changeImageSource("healing", arg2);
                    console.log("+20 health is NOT MORE than originalHealth")
                    who.health = who.health + 20;
                    who.magic.mana -= 20;
                    this.fightDetails.roundsOrder[arg2] = true;
                    this.addLogMessage(who.name, who.name, 'heal', 20, '');
                    setTimeout(() => {
                        this.woIsNext();
                    }, 1000);
                } else {
                    this.changeImageSource("healing", arg2);
                    console.log("+20 health is MORE than originalHealth, so just heal to originalHealth");
                    who.health = who.originalHealth;
                    who.magic.mana -= 20;
                    this.fightDetails.roundsOrder[arg2] = true;
                    this.addLogMessage(who.name, who.name, 'heal', 20, '');
                    setTimeout(() => {
                        this.woIsNext();
                    }, 1000);
                }
            } else {
                //do not activate heal, and display an error to user
                console.log("health is not smaller than originalHealth");
                //TODO: hmmm ...
            }
        },

        /*  ----------------------------
            ------ Images Source -------
            ----------------------------
        */ 
        changeImageSource(actionType, whoUsed){
            switch(actionType){
                case "attack":
                    if(whoUsed===1){this.fightDetails.actionImageSource = "img/swordLeft.png"}
                    else{this.fightDetails.actionImageSource = "img/swordRight.png"}
                    break;
                case "fireBall":
                    if(whoUsed===1){this.fightDetails.actionImageSource = "img/fireballLeft.png"}
                    else{this.fightDetails.actionImageSource = "img/fireballRight.png"}
                    break;
                case "lightningBolt":
                    if(whoUsed===1){this.fightDetails.actionImageSource = "img/lightningBoltLeft.png"}
                    else{this.fightDetails.actionImageSource = "img/lightningBoltRight.png"}
                    break;
                case "healing":
                    if(whoUsed===1){this.fightDetails.actionImageSource = "img/healingRight.png"}
                    else{this.fightDetails.actionImageSource = "img/healingLeft.png"}
                    break;
                default:
                    break;
            }
        },

        /*  ----------------------------
            ------- GAME OPTIONS -------
            ----------------------------
        */ 
        //START game if everything valid
        submitDetails() {
            this.errors.monsterErrorMessage = "";
            this.errors.playerErrorMessage = "";
            const validOrNot = this.validateDetails();
            if (validOrNot) {
                this.monster.originalHealth = this.monster.health;
                this.monster.originalMana = this.monster.magic.mana;
                this.player.originalHealth = this.player.health;
                this.player.originalMana = this.player.magic.mana;
                this.monster.name = capitalizeName(this.monster.name);
                this.player.name = capitalizeName(this.player.name);
                this.detailsSaved = true;
                this.actionButton = true;

                this.surrender = true;
                this.showTwoDice();
                //this.fightDetails.startRound = false;
                this.resetFightDetails();
                let message = '----- Round ' + this.fightDetails.roundCounter + ' -----';
                this.addLogMessage('', '', 'message', 0, message);
            }
        },

        //SAVE Form to LocalStorage
        saveDetails() {
            const validationForSave = this.validateDetails();
            if (validationForSave) {
                console.log("Save the details ...");
                this.errors.monsterErrorMessage = "";
                this.errors.playerErrorMessage = "";
                this.errors.spellMissingMonster = false;
                this.errors.spellMissingPlayer = false;
                localStorage.setItem("monsterDetails", JSON.stringify(this.monster));
                localStorage.setItem("playerDetails", JSON.stringify(this.player));
                this.savedDetailsEarlier = true;

                this.resetFightDetails();

                alert("Details are saved!");
            }
        },

        //LOAD saved details from LocalStorage
        loadDetails() {
            // this.resetData();
            if (this.savedDetailsEarlier) {
                let monster = JSON.parse(localStorage.getItem("monsterDetails"));
                let player = JSON.parse(localStorage.getItem("playerDetails"));
                this.monster = monster;
                this.player = player;

                this.resetFightDetails();

                console.log(monster);
                console.log(player);
            }
        },

        //RESET all the data
        resetData(){
            // window.location.reload();

            //it is not the best way to reset data() properties, so must be changed later
            //classNames{}
            this.classNames.evenRoll= true;
            this.classNames.oddRoll= false;
            //errors{}
            
            this.errors.spellMissingMonster= false;
            this.errors.spellMissingPlayer= false;
            this.errors.sameName= false;
            this.errors.validForm= false;
            this.errors.monsterErrorMessage= "";
            this.errors.playerErrorMessage= "";
            this.errors.differentNamesRequested = "Names cannot be the same!";
            this.errors.spellRequested = "Select at least one spell!";
            //monster{}
            this.monster.name = '';
            this.monster.health = '';
            this.monster.speed = '';
            this.monster.attack = '';
            this.monster.damageMin = '';
            this.monster.damageMax = '';
            this.monster.defense = '';
            this.monster.hasMagic = false;
            this.monster.magic.mana = '';
            this.monster.magic.fireBallMagic = false;
            this.monster.magic.lightningBoltMagic = false;
            this.monster.magic.healingMagic = false;
            this.monster.originalHealth = '';
            this.monster.originalMana = '';
            this.monster.monsterImageSource = 'img/monster.png';
            //player{}
            this.player.name = '';
            this.player.health = '';
            this.player.speed = '';
            this.player.attack = '';
            this.player.damageMin = '';
            this.player.damageMax = '';
            this.player.defense = '';
            this.player.hasMagic = false;
            this.player.magic.mana = '';
            this.player.magic.fireBallMagic = false;
            this.player.magic.lightningBoltMagic = false;
            this.player.magic.healingMagic = false;
            this.player.originalHealth = '';
            this.player.originalMana = '';
            this.player.playerImageSource = 'img/player.png';
            //dices{}
            this.dices.dicesNumber = 4;
            this.dices.dieSides = 6;
            this.dices.dieSpots = 0;
            this.dices.dieVisible = [
                { number: 1, active: true },
                { number: 2, active: true },
                { number: 3, active: false },
                { number: 4, active: false },
                ],
            //fightDetails{}
            this.resetFightDetails();
            //battleLog messages
            this.logMessages = [];
            //another properties
            this.currentDices = [],
            this.detailsSaved= false,
            this.savedDetailsEarlier= this.savedEarlier();
            
            this.actionButton= true,
            this.attackAction= true,
            this.fireBallAction= true,
            this.lightningBoltAction= true,
            this.healingAction= true,

            this.surrender = false;

            this.attackOrSpell= [0,0,1,0,0,1,0,1,0,0];
        },
        //Reset the fight's 'maybe' earlier changed details
        resetFightDetails(){
            this.fightDetails.startRound = false;
            this.fightDetails.roundCounter = 1;
            this.playerFullSpeed = '',
            this.monsterFullSpeed= '',
            this.fightDetails.roundsOrder = [false,false];
            this.fightDetails.actionImageSource= 'img/hourglass.gif';
        },
        //SURRENDER the game
        surrenderGame(){
            this.player.playerImageSource = "img/graveyard.png";
            this.fightDetails.actionImageSource= 'img/playerLose.png';
            setTimeout(() => {
                this.newGame();
            }, 1500);
            
        },
        //Start a NEW GAME
        newGame(){
            this.monster.health = this.monster.originalHealth;
            this.monster.magic.mana = this.monster.originalMana;

            this.player.health = this.player.originalHealth;
            this.player.magic.mana = this.player.originalMana;

            this.resetFightDetails();

            this.monster.monsterImageSource = 'img/monster.png';
            this.player.playerImageSource = 'img/player.png';

            this.logMessages = [];

            this.detailsSaved = false;

            this.actionButton = true;
        },

        addLogMessage(who, whom, action, value, message){
            //use .unshift() for put messages to top of the list, or .push() to put at the bottom
            this.logMessages.push({
                actionWho: who,
                actionWhom: whom,
                actionType: action,
                actionValue: value,
                actionMessage: message
            });

            //focus on last <li> element in the battleLog
            setTimeout(() => {
                let items = document.querySelectorAll(".logElements");
                if(items.length > 0){
                    let last = items[items.length-1];
                    last.scrollIntoView();
                }
            }, 10);
            
            
        }
    },
}).mount("#game");

/* 
    TODO:
    Steps of the fight...

    (d6 = dice with 6 side)

    1. - in every round increase the round counter
    
    2. - figure out who is faster in the current round
        -> for this we need 2*d6 roll and add that to the monster/player speed
        -> example: - player speed is 5 and 2*d6 will be 2*3=6, so his speed is 5+6=11 in this round
                    - if the monster speed is 7 but he rolling 3 with 2*d6 (1+2) then his speed will be 7+3=10, so in this round the player will the faster
    
    3. - at this point the player/monster have to decide that he will attack the enemy with weapon, or he will use a magic spell (if he has any -> must check it) 

    4. - to calculate the attack power first roll with 4*d6+1 and add that to the previously selected attack power
        -> if the monster/player attack power + the result of the 4*d6+1 is higher than the enemy defense, then the attack was successfully, otherwise failed
        -> example: - the player attack power is 32 and the 4*d6+1 result is 15 (2+4+6+2+1), so his attack power overall is 47 (32+15)
                    - if the monster defense is less than 47, then he punched his opponent's defense

    4.a - to calculate the damage in the case of a successful attack use a formula with maximum and minimum damage
        Formula: Math.floor(Math.random(maxDamage - minDamage)) + minDamage
        Critical hit: add extra 5 point to damage if the attack point is over defense with 15
    
    5.
    
    TODO: disable surrender button when action is happening do fix a bug + https://jsfiddle.net/rvnj6mc3/
*/
