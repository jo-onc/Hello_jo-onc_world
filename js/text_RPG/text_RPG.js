// 게임 오버, 전투 중
var gameOver = false;
var battle = false;
// 코인 만들기
var makeCoin = function() {
    var coin = makeRandom(2) + 3; // 코인 개수 랜덤 적용 3~4개 
    function changeCoin(number) { // 코인 조작 함수
        if(typeof number === "number") { // 매개변수가 숫자라면
            coin += number; // 코인 값 조정
        }
    }
    return {
        decrease: function() { // 코인 감소
            changeCoin(-1);
        },
        getCoin: function() { // 코인 반환
            return coin;
        },
        print: function() { // 코인 출력
            var coinTag = document.getElementById("nowCoin");
            coinTag.innerHTML = this.getCoin();
        }
    }
}
// 코인 생성
var newCoin = makeCoin();
// 로그 메세지 출력. 메세지 별 color 적용.
function printLogMsg(msg, color) {
    var color = color || "black";
    var logWrap = document.getElementById("log");
    var logList = document.createElement("span");
    logList.innerHTML = msg;
    logList.style.color = color;
    logWrap.appendChild(logList); // 실제 메세지 출력
}
// 기본 메세지
function printDefaultMsg(msg, tags){
    var tags = tags;
    var msg = msg;
    var tag = document.getElementById(tags);
    tag.innerHTML = msg;
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
// 영웅의 공격
Hero.prototype.attack = function(target) {
    printLogMsg(this.name + "님이" + this.att + "의 데미지로 " + target.name + "을 공격합니다.", "blue");
    target.attacked(this.att);
    if(target.hp <= 0) {
        this.getXp(target);
    }
}
// xp 획득 및 레벨 업
Hero.prototype.getXp = function(target) {
    var maxXp = this.lev * 100 + 10; // 레벨업을 위한 경험치 비교 기준
    this.xp += target.xp;
    printLogMsg(this.name + "님이 " + target.xp + "의 경험치를 획득하셨습니다.", "green");
    if(this.xp >= maxXp) {
        this.lev++;
        this.xp = 0;
        this.hp = this.lev * 200;
        this.att += 30;
        printLogMsg(this.name + "님이 레벨업을 하셨습니다. 현재 레벨: " + this.lev + " HP: " + this.hp + " ATT: " + this.att, "gold");
        infoLev.print(); // 현재 레벨 표시
    }
}
// 공격 받음
Hero.prototype.attacked = function(damage) {
    this.hp -= damage;
    printLogMsg(this.name + "님이" + damage + "의 공격을 받아 체력이 " + this.hp + "이(가) 되었습니다.", "pink");
    if(this.hp <= 0){
        battle = false;
        printLogMsg(this.name + "님이 전투 불가 상태입니다. 현재 코인: " + newCoin.getCoin(), "red");
        if(newCoin.getCoin() > 0){            
            newCoin.decrease();
            printLogMsg("코인을 사용해 부활합니다. 현재 코인: " + newCoin.getCoin(), "skyblue");
            battle = true;
            newCoin.print(); // 현재 코인 표시
        } else {
            gameOver = true;
            printLogMsg("Game Over ... 현재 레벨: " + this.lev, "red");
            alert("Game Over ... 현재 레벨: " + this.lev);
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
// 난수 생성
function makeRandom(num) {
    this.num = num;
    return Math.floor(Math.random() * num);
}
// 몬스터 정보 - Character 상속 - name, hp, att, lev, xp
function makeMonster() {
    var monsterArray = [
        ['Ant', 20, 4, 1, 50],
        ['Frog', 30, 10, 2, 70],
        ['Rabbit', 35, 15, 3, 90],
        ['Tiger', 90, 100, 4, 110],
        ['hippo', 100, 110, 5, 150],
        ['Tirano', 180, 150, 6, 250],
        ['Dragon(king)', 500, 180, 7, 400]
    ];
    var monsterLength = monsterArray.length; // 몬스터 숫자 구하기
    var monsters = monsterArray[makeRandom(monsterLength)]; // 몬스터 숫자만큼 난수 출력
    return new Monster(monsters[0], monsters[1], monsters[2], monsters[3], monsters[4]); // 몬스터 name, hp, att, lev, xp
}
// 플레이 버튼 정보
var btns = {
    btnPlay: document.getElementById("play"),
    btnTextSw: false, // 무한 반복 방지 스위치
    changeText: function() {
        btns.btnPlay.innerHTML = "클릭시 다음 턴 진행";
    },
    addClass: function(isName) { // 클래스 추가, 편의상 구현
        this.btnPlay.classList.add(isName);
    },
    switching: function(){
        btnTextSw = !btnTextSw;
    }
}
 // 게임 플레이 버튼 첫 클릭 후 버튼 정보 변경
btns.btnPlay.onclick = function() {
    playGame(); // 게임 플레이
    if(!btns.btnTextSw) {
        btns.switching();
        btns.addClass("on");
        btns.changeText();
    } else if(gameOver) {
        alert("새로고침 F5키를 누른 후 새 게임을 진행해주세요. :)");
    }
}
// 히어로 생성 - name, hp, att, lev, xp
var newHero = new Hero(window.prompt('영웅의 이름을 입력하세요'), 200, 20);
// 플레이 상태 - 레벨
var infoLev = {
    levTag: document.getElementById("nowLev"),
    print: function() {
        this.levTag.innerHTML = newHero.lev;
    }
}
infoLev.print(); // 현재 레벨 표시
newCoin.print(); // 현재 코인 표시
printDefaultMsg(newHero.name + "의 운빨 RPG. 시작!!!", "msgDefault");
// 게임 실행문
function playGame() {
    if(!gameOver) { // 게임오버가 아닐 때
        var newMonster = makeMonster();
        printLogMsg(newMonster.name + "을(를) 만났습니다!");
        battle = true;
        printLogMsg("전투모드!");
        while(battle) { // 배틀 && 게임 스위치 true 일 때 진행
            newHero.attack(newMonster); // 영웅이 몬스터를 공격
            if(newMonster.hp > 0) { // 몬스터의 체력이 0보다 클시
                newMonster.attack(newHero); // 몬스터가 영웅 공격
            } else {
                printLogMsg(newMonster.name + "과의 전투에서 승리! 전투 종료!");
                if(newHero.lev >= 10) {
                    gameOver = true;
                    alert("케릭터 만렙(lev. " + newHero.lev + ") 달성! \n " + newHero.name + "님! 운이 좋군요. 오늘 하루는 행운으로 가득할 것입니다.");
                    printLogMsg("케릭터 만렙(lev. " + newHero.lev + ") 달성! \n " + newHero.name + "님! 운이 좋군요. 오늘 하루는 행운으로 가득할 것입니다.", "gold");
                }
            }
        }
    }
}