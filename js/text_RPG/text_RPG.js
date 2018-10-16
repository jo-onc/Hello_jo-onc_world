console.log("Start Text-RPG");

// 로그 메세지 출력. #log 태그에 로그 메세지 추가. color 값을 인자로 제공. 해당하는 색의 에러 메시지가 표시.
function printLogMsg(msg, color) {
    if(!color) {
        color = "black";
    }
    var logWrap = document.getElementById("log");
    var logList = document.createElement("span");
    logList.innerHTML = msg;
    logList.style.color = color;
    logWrap.appendChild(logList);
}
// 게임 오버, 전투 중, 코인
var gameOver = false;
var battle = false;
var coin = 3;
// 캐릭터 기본 세팅. 이름, 체력, 공격력
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
// 영웅 생성 - basicCharacter 상속
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
        printLogMsg(this.name + "님이 전투 불가 상태입니다. 코인 사용 가능 여부를 파악합니다.", "red");
        if(coin > 0){
            printLogMsg("코인을 사용해 부활합니다. 현재 코인: " + coin, "skyblue");            
            coin --;
            battle = true;
        } else {
            printLogMsg("Game Over ... 현재 레벨: " + this.lev, "red");            
            gameOver = true;
        }
    }
}
// 몬스터 생성 - basicCharacter 상속 - name, hp, att, lev, xp
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
        ['Tiger', 60, 40, 4, 110],
        ['Dragon', 200, 100, 5, 110]
    ];
    var monsters = monsterArray[makeRandom(5)];
    return new Monster(monsters[0], monsters[1], monsters[2], monsters[3], monsters[4]); 
}
// 히어로 생성 - name, hp, att, lev, xp
var newHero = new Hero(prompt('영웅 이름을 입력하세요'), 500, 10);
// 전투 진행
while(!gameOver) {
    battle = true;
    printLogMsg("게임을 시작합니다." + newHero.name + "은(는) 얼마나 성장할 수 있을까요?");
    var newMonster = makeMonster();
    printLogMsg(newMonster.name + "을(를) 만났습니다! 전투 모드!");
    while(battle) {
        newHero.attack(newMonster);
        if(newMonster.hp > 0) {
            newMonster.attack(newHero);
        }
    }
}




/**************************************************************************/
// function logMessage(msg, color) {
//     if (!color) { color = 'black'; }
//     var div = document.createElement('div');
//     div.innerHTML = msg;
//     div.style.color = color;
//     document.getElementById('log').appendChild(div);
//   }
//   var gameover = false;
//   var battle = false;
//   function Character(name, hp, att) {
//     this.name = name;
//     this.hp = hp;
//     this.att = att;
//   }
//   Character.prototype.attacked = function (damage) {
//     this.hp -= damage;
//     logMessage(this.name + '의 체력이 ' + this.hp + '가 되었습니다');
//     if (this.hp <= 0) {
//       battle = false;
//     }
//   };
//   Character.prototype.attack = function (target) {
//     logMessage(this.name + '이 ' + target.name + '을 공격합니다');
//     target.attacked(this.att);
//   };
//   function Hero(name, hp, att, lev, xp) {
//     Character.apply(this, arguments);
//     this.lev = lev || 1;
//     this.xp = xp || 0;
//   }
//   Hero.prototype = Object.create(Character.prototype);
//   Hero.prototype.constructor = Hero;
//   Hero.prototype.attacked = function(damage) {
//     this.hp -= damage;
//     logMessage(this.name + '님의 체력이 ' + this.hp + '남았습니다');
//     if (this.hp <= 0) {
//       logMessage('죽었습니다. 레벨' + this.lev + '에서 모험이 끝납니다. F5를 눌러 다시 시작하세요', 'red');
//       battle = false;
//       gameover = true;
//     }
//   };
//   Hero.prototype.attack = function (target) {
//     logMessage(this.name + '님이 ' + target.name + '을 공격합니다');
//     target.attacked(this.att);
//     if (target.hp <= 0) {
//       this.gainXp(target);
//     }
//   };
//   Hero.prototype.gainXp = function(target) {
//     logMessage('전투에서 승리하여 ' + target.xp + '의 경험치를 얻습니다', 'blue');
//     this.xp += target.xp;
//     if (this.xp > 100 + 10 * this.lev) {
//       this.lev++;
//       logMessage('레벨업! ' + this.lev + ' 레벨이 되었습니다', 'blue');
//       this.hp = 100 + this.lev * 10;
//       this.xp -= 10 * this.lev + 100;
//     }
//   };
//   function Monster(name, hp, att, lev, xp) {
//     Character.apply(this, arguments);
//     this.lev = lev || 1;
//     this.xp = xp || 10;
//   }
//   Monster.prototype = Object.create(Character.prototype);
//   Monster.prototype.constructor = Monster;
//   function makeMonster() {
//     var monsterArray = [
//       ['rabbit', 25, 3, 1, 35],
//       ['skeleton', 50, 6, 2, 50],
//       ['soldier', 80, 4, 3, 75],
//       ['king', 120, 9, 4, 110],
//       ['devil', 500, 25, 6, 250]
//     ];
//     var monster = monsterArray[Math.floor(Math.random() * 5)];
//     return new Monster(monster[0], monster[1], monster[2], monster[3], monster[4]);
//   }

//   var hero = new Hero(prompt('이름을 입력'), 100, 10);
//   logMessage(hero.name + '님이 모험을 시작합니다. 어느 정도까지 성장할 수 있을까요?');
//   while (!gameover) {
//     var monster = makeMonster();
//     logMessage(monster.name + '을 마주쳤습니다. 전투가 시작됩니다', 'green');
//     battle = true;   while(battle) {
//       hero.attack(monster);
//       if (monster.hp > 0) {
//         monster.attack(hero);
//       }
//     }
//   }