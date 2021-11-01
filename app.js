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
const app = Vue.createApp({
    data(){
        return {
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
                },
                
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
                },
            },
            monsterOriginalHealth: '',
            monsterOriginalMana: '',
            playerOriginalHealth: '',
            playerOriginalMana: '',
            spellMissingMonster: false,
            spellMissingPlayer: false,
            detailsSaved: false,
            sameName: false,
            validForm: false,
            monsterErrorMessage : '',
            playerErrorMessage : '',
            savedDetailsEarlier : this.savedEarlier(),
            showDices : true,
            showDiceOne : true,
            showDiceTwo : true,
            showDiceThree : false,
            showDiceFour : false,
            roundCounter : 0,
            startRound : false,
            useSpellLightning : true,
            useSpellFire : true,
            useSpellhealing : true,
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
        }
    },
    watch:{
    
    },
    methods: {
        
        // compare the monster's and player's name
        checkNamesConflict(){
            // if none of name field is empty
            if(this.monster.name !== '' && this.player.name !== ''){
                // same name for Monster and Player
                if(this.monster.name === this.player.name){
                    this.validForm = false;
                    this.sameName = true;
                }else{
                    this.validForm = true;
                    this.sameName = false;
                }
            }else{
                this.sameName = false;
            }
        },
        clearSpells(input){
            if(input === "monster"){
                if(this.monster.hasMagic === false){
                    this.monster.magic.mana = '';
                    this.monster.magic.fireBallMagic = false;
                    this.monster.magic.lightningBoltMagic = false;
                    this.monster.magic.healingMagic = false;
                    this.spellMissingMonster = false;
                }
            }else{
                if(this.player.hasMagic === false){
                    this.player.magic.mana = '';
                    this.player.magic.fireBallMagic = false;
                    this.player.magic.lightningBoltMagic = false;
                    this.player.magic.healingMagic = false;
                    this.spellMissingPlayer = false;
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
                this.monsterErrorMessage = '';
                this.playerErrorMessage = '';
                this.spellMissingMonster = false;
                this.spellMissingPlayer = false;
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
            if( monsterCheck === "fullValid" && playerCheck === "fullValid" && this.validForm){
                return true;
            }else{
                switch(monsterCheck){
                    case 'missingSpellSelection':
                        this.spellMissingMonster = true;
                        break;
                    case 'manaMissing':
                        this.monsterErrorMessage = "Mana is necessary for spells!"; 
                        break;
                    case 'wrongInput': 
                        this.monsterErrorMessage = "One or more details are invalid!"; 
                        break;
                    default:
                        this.monsterErrorMessage = '';
                        break;
                }
                switch(playerCheck){
                    case 'missingSpellSelection':
                        this.spellMissingPlayer = true;
                        break;
                    case 'manaMissing':
                        this.playerErrorMessage = "Mana is necessary for spells!"; 
                        break;
                    case 'wrongInput': 
                        this.playerErrorMessage = "One or more details are invalid!"; 
                        break;
                    default:
                        this.playerErrorMessage = '';
                        break;
                }

                return false;                
            }
        },
        submitDetails(){
            this.monsterErrorMessage = '';
            this.playerErrorMessage = '';
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
                this.roundCounter++;
            }
        },
        rollDice() {
            console.log("diceroll called")
            const dice = [...document.querySelectorAll(".die-list")];
            const diceResults = [];
            dice.forEach(die => {
                this.toggleClasses(die);
                // dataset : https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
                die.dataset.roll = this.getRandomNumber(1, 6);
                diceResults.push(die.dataset.roll);

            });
            // this.roundCounter++;
            console.log(diceResults);
        },
        
        toggleClasses(die) {
            die.classList.toggle("odd-roll");
            die.classList.toggle("even-roll");
        },
        
        getRandomNumber(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
});
app.mount('#game');

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