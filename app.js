// validation off all details
function checkValidation(inputObject){
    let selectedname = inputObject.name, 
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

    if( selectedname!=='' 
        && (health>=1 && health <=100) && (speed>=1 && speed <=10) && (attack>=25 && attack<=50)  && (minDamage>=1 && minDamage<=6) && (maxDamage>=7 && maxDamage<=15) && (defense>=1 && defense<=50)){
            if(hasMagic === true){
                const spells = [fire, lightning, heal];
                const isLearned = (learned) => learned === true;
                // use .some() to find that any spell is selected (true)
                if(spells.some(isLearned)){
                    if(mana>=1 && mana<=100){
                        console.log("TRUE - fully valid")
                        logDetails(inputObject);
                        return "fullValid";
                        // return true;
                    }else{
                        console.log("FALSE - no mana added")
                        // return false;
                        return "manaMissing";
                    }
                }else{
                    console.log("FALSE - missing spell selection");
                    // return false;
                    return "missingSpellSelection";
                }
            }else{
                console.log("TRUE - no magic selected but valid")
                logDetails(inputObject);
                // return true;
                return "fullValid";
            }
    }else{
        console.log("FALSE - invalid details..") 
        // return false;
        return "wrongInput";
    }
}

// validation for only number
function isNumber(e) {
    let char = String.fromCharCode(e.keyCode);
    if (/^[0-9]+$/.test(char)){
        //return character when that is a number
        return true;
    }else {
        // e.preventDefault();
        return false;
    }
}

// validation for only text
function isString(e) {
    let char = String.fromCharCode(e.keyCode);
    if (/^[A-Za-z\s]+$/.test(char)) {
        //return character when that is a character
        return true;
    }else{
        // e.preventDefault();
        return false;
    }
}

function logDetails(input){
//     console.log(input.name + " [hp:" + input.health + "] - [speed:" + input.speed + "] - [attack:" + input.attack + "] - [minDmg:" + input.damageMin +
//                 "] - [maxDmg:" + input.damageMax + "] - [defense:" + input.defense + "] - [hasMagic:" + input.hasMagic +  "] - [mana:" + input.magic.mana + 
//                 "] - [fire:" + input.magic.fireBallMagic + "] - [lightning:" + input.magic.lightningBoltMagic + "] - [heal:" + input.magic.healingMagic + "]");
}

function capitalizeName(input){
    //split the above string into an array of strings whenever a blank space is encountered
    const splittedInput = input.split(" ");
    //loop through each element of the array and capitalize the first letter.
    for (var i = 0; i < splittedInput.length; i++) {
        splittedInput[i] = splittedInput[i].charAt(0).toUpperCase() + splittedInput[i].slice(1);
    }
    //Join all the elements of the array back into a string using a blankspace as a separator 
    const modifiedInput = splittedInput.join(" ");
    return modifiedInput;
}

function spellSelected(checkboxesName){
    const checkboxs = document.getElementsByName(checkboxesName);
    let status=false;
    for(let i = 0; i< checkboxs.length; i++){
        if(checkboxs[i].checked)
        {
            status = true;
            break;
        }
    }

    if(status){
        console.log("selected one")
        return false;
    }else{
        console.log("none selected")
        return true
    };
}

// -------------------------
// ----- VUE APP CODE ------
// -------------------------
const {ref, createApp} = Vue.createApp({
    data(){
        return {

            classNames: {
                evenRoll: true,
                oddRoll: false
            },
            errors:{
                spellMissingMonster: false,
                spellMissingPlayer: false,
                sameName: false,
                validForm: false,
                monsterErrorMessage : '',
                playerErrorMessage : '',
            },
            monster: {
                name: '',
                health: '',
                speed : '',
                attack: '',
                damageMin: '',
                damageMax: '',
                defense: '',
                hasMagic: false,
                magic: {
                    mana: '',
                    fireBallMagic: false,
                    lightningBoltMagic: false,
                    healingMagic: false
                }
            },
            player: {
                name: '',
                health: '',
                speed : '',
                attack: '',
                damageMin: '',
                damageMax: '',
                defense: '',
                hasMagic: false,
                magic: {
                    mana: '',
                    fireBallMagic: false,
                    lightningBoltMagic: false,
                    healingMagic: false
                }
            },
            dices:{
                dicesNumber: 4,
                dieSides: 6,
                dieSpots: 0,
                dieVisible: [{number: 1, active:true},{number: 2, active:true},{number: 3, active:false},{number: 4, active:false}],
            },

            monsterOriginalHealth: '',
            monsterOriginalMana: '',
            playerOriginalHealth: '',
            playerOriginalMana: '',

            detailsSaved: false,
            savedDetailsEarlier : this.savedEarlier(),
            roundCounter : 1,

            
            startRound : false,
            attackAction: true,
            fireBallAtcion: true,
            lightningBoltAtcion: true,
            healingAtcion: true,

            surrend : true
        }
    },
    computed:{
        savedBefore(){
            // console.log("savedBefore called");
            return !this.savedDetailsEarlier;
        },
        monsterCurrentHealth(){
            return this.monster.health + "%";
        },
        monsterCurrentMana(){
            return this.monster.magic.mana + "%";
        },
        playerCurrentHealth(){
            return this.player.health + "%";
        },
        playerCurrentMana(){
            return this.player.magic.mana + "%";
        },
        visibleDices(){
            return this.dices.dieVisible.filter(function(u){
                return u.active === true;
            })
        },  
    },
    watch:{
        
        
    },
    methods: {
        checkNamesConflict(){
            // if none of name field is empty
            if(this.monster.name !== '' && this.player.name !== ''){
                // same name for Monster and Player
                if(this.monster.name === this.player.name){
                    this.errors.validForm = false;
                    this.errors.sameName = true;
                }else{
                    this.errors.validForm = true;
                    this.errors.sameName = false;
                }
            }else{
                this.errors.sameName = false;
            }
        },
        clearSpells(input){
            if(input === "monster"){
                if(this.monster.hasMagic === false){
                    this.monster.magic.mana = '';
                    this.monster.magic.fireBallMagic = false;
                    this.monster.magic.lightningBoltMagic = false;
                    this.monster.magic.healingMagic = false;
                    this.errors.spellMissingMonster = false;
                }
            }else{
                if(this.player.hasMagic === false){
                    this.player.magic.mana = '';
                    this.player.magic.fireBallMagic = false;
                    this.player.magic.lightningBoltMagic = false;
                    this.player.magic.healingMagic = false;
                    this.errors.spellMissingPlayer = false;
                }
            }
        },
        savedEarlier(){
            if(localStorage.getItem('monsterDetails') !== null && localStorage.getItem('playerDetails') !== null){
                return true;
            }else{
                return false;
            }
        },
        saveDetails(){
            const validationForSave = this.validateDetails();
            if(validationForSave){
                console.log("Save the details ...");
                this.errors.monsterErrorMessage = '';
                this.errors.playerErrorMessage = '';
                this.errors.spellMissingMonster = false;
                this.errors.spellMissingPlayer = false;
                localStorage.setItem('monsterDetails', JSON.stringify(this.monster));
                localStorage.setItem('playerDetails', JSON.stringify(this.player));
                this.savedDetailsEarlier = true;
                alert("Details are saved!");
            }
        },
        loadDetails(){
            if(this.savedDetailsEarlier){
                let monster = JSON.parse(localStorage.getItem('monsterDetails'));
                let player = JSON.parse(localStorage.getItem('playerDetails'));
                this.monster = monster;
                this.player = player;
                console.log(monster);
                console.log(player);
            }
        },
        validateDetails(){
            // console.log('validation called');
            let monsterCheck = checkValidation(this.monster);
            let playerCheck = checkValidation(this.player);
            this.checkNamesConflict();
            if( monsterCheck === "fullValid" && playerCheck === "fullValid" && this.errors.validForm){
                return true;
            }else{
                switch(monsterCheck){
                    case 'missingSpellSelection':
                        this.errors.spellMissingMonster = true;
                        break;
                    case 'manaMissing':
                        this.errors.monsterErrorMessage = "Mana is necessary for spells!"; 
                        break;
                    case 'wrongInput': 
                        this.errors.monsterErrorMessage = "One or more details are invalid!"; 
                        break;
                    default:
                        this.errors.monsterErrorMessage = '';
                        break;
                }
                switch(playerCheck){
                    case 'missingSpellSelection':
                        this.errors.spellMissingPlayer = true;
                        break;
                    case 'manaMissing':
                        this.errors.playerErrorMessage = "Mana is necessary for spells!"; 
                        break;
                    case 'wrongInput': 
                        this.errors.playerErrorMessage = "One or more details are invalid!"; 
                        break;
                    default:
                        this.errors.playerErrorMessage = '';
                        break;
                }

                return false;                
            }
        },
        submitDetails(){
            this.errors.monsterErrorMessage = '';
            this.errors.playerErrorMessage = '';
            const validOrNot = this.validateDetails();
            // console.log("Validation is " + validOrNot);
            if(validOrNot){
                this.monsterOriginalHealth = this.monster.health;
                this.monsterOriginalMana = this.monster.magic.mana;
                this.playerOriginalHealth = this.player.health;
                this.playerOriginalMana = this.player.magic.mana;
                this.monster.name = capitalizeName(this.monster.name);
                this.player.name = capitalizeName(this.player.name);
                this.detailsSaved = true;
            }
        },
        rollDice(rollFor) {
            console.log("diceroll called for " + rollFor)

            switch(rollFor){
                case 'agility':
                    console.log("agility rolled");
                    this.rolling();
                    this.dices.dieVisible[2].active = false;
                    this.dices.dieVisible[3].active = false;
                    this.startRound = true;
                    this.attackAction = false;
                    this.fireBallAtcion = false;
                    this.lightningBoltAtcion = false;
                    this.healingAtcion = false;
                    break;
                case 'attack':
                    console.log("attack rolled");
                    this.rolling();
                    this.startRound = false;
                    this.attackAction = true;
                    this.fireBallAtcion = true;
                    this.lightningBoltAtcion = true;
                    this.healingAtcion = true;
                    break;
            }
        },
        rolling(){
            //using setTimeout() to give small amount of time for Vue to refresh DOM from computed property visibleDices()
            setTimeout(() => {
                //now used querySelectorAll but later it must be changed to $refs and made all the dice to component
                const dice = [...document.querySelectorAll(".die-list")];
                const diceResults = [];

                //toggle die's classes
                this.classNames.evenRoll = !this.classNames.evenRoll;
                this.classNames.oddRoll = !this.classNames.oddRoll;

                dice.forEach(die => {
                    // this.toggleClasses(die);



                    // dataset : https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
                    die.dataset.roll = this.getRandomNumber(1, 6);
                    diceResults.push(die.dataset.roll);

                });
                // this.roundCounter++;
                console.log(diceResults);
            }, 10);

            for(let i=0; i<this.dices.dieVisible.length; i++){
                this.dices.dieVisible[i].active = true;
            }

        },
        
        getRandomNumber(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        returnCalcStr(arg1, arg2){
            const result = arg1 + arg2;
            // console.log(result)
            return result;
        }
    }
}).mount('#game');

/* 
    Steps of the fight...

    (d6 = dice with 6 side)

    1 - in every round increase the round counter
    
    2 - figure out who is faster in the current round
        -> for this we need 2*d6 roll and add that to the monster/player speed
        -> example: - player speed is 5 and 2*d6 will be 2*3=6, so his speed is 5+6=11 in this round
                    - if the monster speed is 7 but he rolling 3 with 2*d6 (1+2) then his speed will be 7+3=10, so in this round the player will the faster
    
    3 - at this point the player/monster have to decide that he will attack the enemy with weapon, or he will use a magic spell (if he has any -> must check it) 

    3 - to calculate the attack power first roll with 4*d6+1 and add that to the previously selected attack power
        -> if the monster/player attack power + the result of the 4*d6+1 is higher than the enemy defense, then the attack was successfully, otherwise failed
        -> example: - the player attack power is 32 and the 4*d6+1 result is 15 (2+4+6+2+1), so his attack power overall is 47 (32+15)
                    - if the monster defense is less than 47, then he punched his opponent's defense

    4 - to calculate the damage in the case of a successful attack use a formula with maximum and minimum damage
        Formula: Math.floor(Math.random(maxdamage - mindamage)) + mindamage
                    
                    
*/