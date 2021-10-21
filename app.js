
// validation off all details
function checkValidation(selectedname, health, speed, attack, minDamage, maxDamage, defense, hasMagic, mana, fire, lightning, heal){
    console.log(selectedname + " [hp:" + health + "] - [speed:" + speed + "] - [attack:" + attack + "] - [minDmg:" + minDamage +
                "] - [maxDmg:" + maxDamage + "] - [hasMagic:" + hasMagic +  "] - [mana:" + mana + "] - [fire:" + fire + "] - [lightning:" + lightning +
                "] - [heal:" + heal + "]");
    if( selectedname!=='' 
        && (health>=1 && health <=100)
        && (speed>=1 && speed <=10)
        && (attack>=25 && attack<=75) 
        && (minDamage>=1 && minDamage<=6) 
        && (maxDamage>=7 && maxDamage<=15) 
        && (defense>=1 && defense<=50)){
            if(hasMagic === true){
                const spells = [fire, lightning, heal];
                const isLearned = (learned) => learned === true;
                if(spells.some(isLearned)){
                    console.log("found selected spell")
                    if(mana>=1 && mana<=100){
                        console.log("fully valid")
                        return true;
                    }else{
                        console.log("no mana added")
                        return false;
                    }
                    
                }else{
                    console.log("missing spell selection");
                    return false;
                }
            }else{
                console.log("no magic selected and valid")
                return true;
            }
    }else{
        console.log("FALSE - invalid details..") 
        return false;
    }
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

// VUE APP CODE
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
            spellMissing: false,
            detailsSaved: false,
            sameName: false,
            monsterS: false,
            validForm: false
        }
    },
    computed:{
        //remove selected spells if monster not using magic
        monsterHasMagicCheck(){
            if(this.monster.hasMagic === false){
                this.monster.magic.mana = '';
                this.monster.magic.fireBallMagic = false;
                this.monster.magic.lightningBoltMagic = false;
                this.monster.magic.healingMagic = false;
                return false;
            }
        },
        //remove selected spells if monster/player not using magic
        playerHasMagicCheck(){
            if(this.player.hasMagic === false){
                this.player.magic.mana = '';
                this.player.magic.fireBallMagic = false;
                this.player.magic.lightningBoltMagic = false;
                this.player.magic.healingMagic = false;
                return false;
            }
        },

        // @click="isRequiredMonsterSpell"
        // :required="isRequiredMonsterSpell"

        // isRequiredMonsterSpell(){
        //     if(!this.monster.magic.fireBallMagic 
        //         && !this.monster.magic.lightningBoltMagic
        //         && !this.monster.magic.healingMagic){
        //             return spellSelected("monsterSpell");
        //         }else{
        //             return
        //         }
                
        // }
    },
    watch:{

    },
    methods: {
        // validation for only number
        isNumber(e) {
            let char = String.fromCharCode(e.keyCode);
            if (/^[0-9]+$/.test(char)){
                return true;
            }else {
                e.preventDefault();
            }
        },
        // validation for only number
        isString(e) {
            let char = String.fromCharCode(e.keyCode);
            if (/^[A-Za-z\s]+$/.test(char)) {
                return true;
            }else{
                e.preventDefault();
            }
        },
        // compare the monster's and player's name
        checkNamesConflict(){
            // console.log("monster: " + this.monster.name + ", player: " + this.player.name)
            if(this.monster.name !== '' && this.player.name !== ''){
                if(this.monster.name === this.player.name){
                    // console.log("same name")
                    this.validForm = false;
                    this.sameName = true;
                }else{
                    // console.log("diff name")
                    this.validForm = true;
                    this.sameName = false;
                }
            }else{
                this.sameName = false;
            }
        },
        
        saveDetails(){

        },
        loadDetails(){

        },
        submitDetails(){
            console.log('submitdetails called')
            if(checkValidation( this.monster.name, this.monster.health, this.monster.speed, this.monster.attack, 
                                this.monster.damageMin, this.monster.damageMax, this.monster.defense, this.monster.hasMagic, this.monster.magic.mana,
                                this.monster.magic.fireBallMagic, this.monster.magic.lightningBoltMagic, this.monster.magic.healingMagic) 
                && checkValidation( this.player.name, this.player.health, this.player.speed, this.player.attack, 
                                this.player.damageMin, this.player.damageMax, this.player.defense, this.player.hasMagic, this.player.magic.mana,
                                this.player.magic.fireBallMagic, this.player.magic.lightningBoltMagic, this.player.magic.healingMagic)
                && this.validForm){
                    this.monster.name = capitalizeName(this.monster.name);
                    this.player.name = capitalizeName(this.player.name);
                    this.detailsSaved = true;
            }else{
                console.log("what the fuck ...")
                console.log(checkValidation( this.monster.name, this.monster.health, this.monster.speed, this.monster.attack, 
                    this.monster.damageMin, this.monster.damageMax, this.monster.defense, this.monster.hasMagic, this.monster.magic.mana,
                    this.monster.magic.fireBallMagic, this.monster.magic.lightningBoltMagic, this.monster.magic.healingMagic)),
                console.log(checkValidation( this.player.name, this.player.health, this.player.speed, this.player.attack, 
                    this.player.damageMin, this.player.damageMax, this.player.defense, this.player.hasMagic, this.player.magic.mana,
                    this.player.magic.fireBallMagic, this.player.magic.lightningBoltMagic, this.player.magic.healingMagic));
                console.log(this.validForm)
            }
        }
    }
});
app.mount('#game');