console.log("Start Text-RPG");

// 게임 오버, 전투 중, 코인
var gameOver = false;
var battle = false;
var coin = 3;
// 로그 메세지 출력. 메세지 별 color 적용.
function printLogMsg(msg, color) {
    this.color = color || "black";
    var logWrap = document.getElementById("log");
    var logList = document.createElement("span");
    logList.innerHTML = msg;
    logList.style.color = color;
    logWrap.appendChild(logList);
}
// 기본 메세지
function printDefaultMsg(msg, color){
    var msgDefault = document.getElementById("msgDefault");
    this.msg = msg;
    msgDefault.innerHTML = msg;
}
// 캐릭터 기본 베이스. 이름, 체력, 공격력
function Character(name, hp, att) {
    this.name = name;
    this.hp = hp;
    this.att = att;
}
// 공격 기본 세팅
Character.prototype.attack = function(target) {
    printLogMsg(this.name + "이(가)" + this.att + "의 데미지로 " + target.name + "을 공격합니다.");
    target.attacked(this.att);
}
// 공격 받음 기본 세팅
Character.prototype.attacked = function(damage) {
    this.hp -= damage;
    printLogMsg(this.name + "의 체력이 " + this.hp + "가 되었습니다. 피해: " + damage);
    if(this.hp <= 0){
        battle = false;
    }
}
// 영웅 생성 - Character 상속
function Hero(name, hp, att, lev, xp) {
    Character.apply(this, arguments);
    this.lev = lev || 1;
    this.xp = xp || 0;
}
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;
// 공격
Hero.prototype.attack = function(target) {
    printLogMsg(this.name + "님이" + this.att + "의 데미지로 " + target.name + "을 공격합니다.", "blue");
    target.attacked(this.att);
    if(target.hp <= 0) {
        this.getXp(target);
    }
}
// xp 획득 및 레벨 업
Hero.prototype.getXp = function(target) {
    var maxXp = this.lev * 100 + 10;
    this.xp += target.xp;
    printLogMsg(this.name + "님이 " + target.xp + "의 경험치를 획득하셨습니다.", "green");
    if(this.xp >= maxXp) {
        this.lev++;
        this.xp = 0;
        this.hp = this.lev * 200;
        this.att += 30;
        printLogMsg(this.name + "님이 레벨업을 하셨습니다. 현재 레벨: " + this.lev + " HP: " + this.hp + " ATT: " + this.att, "gold");
    }
}
// 공격 받음
Hero.prototype.attacked = function(damage) {
    this.hp -= damage;
    printLogMsg(this.name + "님이" + damage + "의 공격을 받아 체력이 " + this.hp + "이(가) 되었습니다.", "pink");
    if(this.hp <= 0){
        battle = false;
        printLogMsg(this.name + "님이 전투 불가 상태입니다. 현재 코인: " + coin, "red");
        if(coin > 0){            
            coin --;
            printLogMsg("코인을 사용해 부활합니다. 현재 코인: " + coin, "skyblue");
            battle = true;
        } else {
            gameOver = true;
            printLogMsg("Game Over ... 현재 레벨: " + this.lev, "red");
            alert("최종 레벨: " + this.lev);
        }
    }
}
// 몬스터 생성 - Character 상속 - name, hp, att, lev, xp
function Monster(name, hp, att, lev, xp) {
    Character.apply(this, arguments);
    this.lev = lev || 1;
    this.xp = xp || 10;
}
Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;
// 랜덤 생성 함수 - 몬스터 랜덤 생성에 사용
function makeRandom(num) {
    this.num = num;
    return Math.floor(Math.random() * num);
}
function makeMonster() {
    var monsterArray = [
        ['Ant', 20, 10, 1, 110],
        ['Frog', 30, 20, 2, 110],
        ['Rabbit', 40, 30, 3, 110],
        ['Tiger', 150, 100, 4, 110],
        ['Dragon(king)', 500, 150, 5, 110]
    ];
    var monsters = monsterArray[makeRandom(5)];
    return new Monster(monsters[0], monsters[1], monsters[2], monsters[3], monsters[4]); 
}
// 히어로 생성 - name, hp, att, lev, xp
var newHero = new Hero(window.prompt('영웅의 이름을 입력하세요'), 100, 10);
printDefaultMsg("게임을 시작합니다. " + newHero.name + "은(는) 과연 얼마나 성장할까요?");
var gameNow= {
    sw: false,
    start: function() {
        return this.sw = true;  
    }
}
// 플레이 버튼 클릭시 gameNow.sw = true
var btnPlay = document.getElementById("paly");
btnPlay.onclick = function() {
    gameNow.start();
    playGame();
}
// 게임 실행문
function playGame() {
    if(!gameOver) {
        var newMonster = makeMonster();
        printLogMsg(newMonster.name + "을(를) 만났습니다!");
        battle = true;
        printLogMsg("전투모드!");
        while(battle && gameNow.sw === true) {
            newHero.attack(newMonster);
            if(newMonster.hp > 0) {
                newMonster.attack(newHero);
            } else {
                gameNow.sw = false;
                printLogMsg(newMonster.name + "과의 전투에서 승리! 전투 종료!");
            }
        }
    }
}