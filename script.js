function $(id){
    return document.getElementById(id)
}

function setMode(value){
    mode = value
    calculateDisable()
}
function setField(value){
    if(value=="field-east")field=EAST
    if(value=="field-west")field=WEST
    if(value=="field-south")field=SOUTH
    if(value=="field-north")field=NORTH
}
function setSeat(value){
    if(value=="seat-east")seat=EAST
    if(value=="seat-west")seat=WEST
    if(value=="seat-south")seat=SOUTH
    if(value=="seat-north")seat=NORTH
}
function setAgariWay(value){
    if(value=="tsumo")agariWay=TSUMO
    if(value=='ron')agariWay=RON
}
const paiList = ["1m","1p","1s","1z","2m","2p","2s","2z","3m","3p","3s","3z","4m","4p","4s","4z","5m","5p","5s","5z","6m","6p","6s","6z","7m","7p","7s","7z","8m","8p","8s","9m","9p","9s"]


let mode = "pai"
let paiLeft = {}
let hand=[]
let furo=[]
let dora=[]
let ura=[]
let yakus=[]
let akaDora = 0
let field = EAST
let seat = EAST
let agariWay = TSUMO
let redCnt = 0
function initData(){
    mode = "pai"
    paiLeft = {}
    hand=[]
    furo=[]
    dora=[]
    ura=[]
    yakus=[]
    akaDora = 0
    field = EAST
    seat = EAST
    agariWay = TSUMO
    redCnt = 0
    for(const name of paiList){
        paiLeft[name] = 4
    }
}

function createImage(name,parent){
    var image = document.createElement("img");
    // var imagesrc = imageBase64[name]
    image.classList.add("pai")
    if(name[0]=='H'){
        image.classList.add("horizontal")
    }
    image.src = "./img/"+name+".webp"
    parent.appendChild(image)
    return image
}
function initPaiSelect(){
    let paiSelect = document.getElementById("pai-select-table");
    for (const key of ['m','s','p','z']) {
        let tr = document.createElement("tr")
        paiSelect.appendChild(tr)
        for(var i=1;i<=((key=='z')?7:9);i++){
            let td = document.createElement("td")
            const name = i+key;
            let img = createImage(name,td)
            img.id = "select-"+name;
            img.addEventListener("click",(event)=>{
                if(!img.classList.contains("disabled")){
                    addPai(event,name)
                }
            })
            tr.appendChild(td)
        }
    }
}
function addPai(event,name){
    const localMode = mode
    //手牌
    if(localMode=="pai"){
        let handRow = $("hand-row")
        let img = createImage(name,handRow)
        img.addEventListener("click",(e)=>{
            removePai(e,img,name)
        })
        hand.push(name)
        paiLeft[name]--;
    }
    else if(localMode=="dora"){
        let doraRow = $("dora-row")
        let img = createImage(name,doraRow)
        img.addEventListener("click",(e)=>{
            removeDora(e,img,name)
        })
        dora.push(name)
        paiLeft[name]--;
    }
    else if(localMode=="ura"){
        let uraRow = $("ura-row")
        let img = createImage(name,uraRow)
        img.addEventListener("click",(e)=>{
            removeUra(e,img,name)
        })
        ura.push(name)
        paiLeft[name]--;
    }
    //副露 
    else{
        if(localMode=='chi'){
            let furoRow = $("furo-row")
            let div = document.createElement("div")
            div.classList.add("furo")
            div.addEventListener("click",()=>{
                removeFuro(div,name,localMode)
            })
            paiLeft[name]--
            paiLeft[next(name)]--
            paiLeft[next(next(name))]--
            furoRow.appendChild(div)
            createImage("H"+name,div);
            createImage(next(name),div);
            createImage(next(next(name)),div);
        }
        else if(localMode=="pon"){
            let furoRow = $("furo-row")
            let div = document.createElement("div")
            div.classList.add("furo")
            div.addEventListener("click",()=>{
                removeFuro(div,name,localMode)
            })
            paiLeft[name]-=3
            furoRow.appendChild(div)
            createImage("H"+name,div);
            createImage(name,div);
            createImage(name,div);
        }
        else if(localMode=="kan"){
            let furoRow = $("furo-row")
            let div = document.createElement("div")
            div.classList.add("furo")
            div.addEventListener("click",()=>{
                removeFuro(div,name,localMode)
            })
            paiLeft[name]-=4
            furoRow.appendChild(div)
            createImage("H"+name,div);
            createImage(name,div);
            createImage(name,div);
            createImage(name,div);
        }
        else if(localMode=="ankan"){
            let furoRow = $("furo-row")
            let div = document.createElement("div")
            div.classList.add("furo")
            div.addEventListener("click",()=>{
                removeFuro(div,name,localMode)
            })
            paiLeft[name]-=4
            furoRow.appendChild(div)
            createImage("B",div);
            createImage(name,div);
            createImage(name,div);
            createImage("B",div);
        }
        furo.push({name:name,type:localMode})
    }
    calculateDisable()
}
function removePai(event,obj,name){
    paiLeft[name]++;
    obj.remove()
    hand.splice(hand.findIndex((e)=>{return e==name}),1)
    calculateDisable()
}
function removeFuro(obj,name,type){
    obj.remove()
    if(type=='chi'){
        paiLeft[name]++
        paiLeft[next(name)]++
        paiLeft[next(next(name))]++
    }else if(type=='pon'){
        paiLeft[name]+=3
    }else if(type=='kan'){
        paiLeft[name]+=4
    }else if(type=='ankan'){
        paiLeft[name]+=4
    }
    furo.splice(hand.findIndex((e)=>{return e.name==name && e.type==type}),1)
    calculateDisable()
}
function removeDora(event,obj,name){
    paiLeft[name]++;
    obj.remove()
    dora.splice(hand.findIndex((e)=>{return e==name}),1)
    calculateDisable()
}
function removeUra(event,obj,name){
    paiLeft[name]++;
    obj.remove()
    ura.splice(hand.findIndex((e)=>{return e==name}),1)
    calculateDisable()
}

function disable(name){
    $("select-"+name).classList.add("disabled");
}
function enable(name){
    $("select-"+name).classList.remove("disabled");
}
function next(name){
    return (parseInt(name[0])+1)+name[1]
}
function getNumber(name){
    return parseInt(name[0])
}
function getType(name){
    return name[1]
}
function calculateDisable(){
    if(hand.length + furo.length*3 == 14){
        $("calculate-btn").disabled=false;
    }else{
        $("calculate-btn").disabled=true;
    }

    if(mode=="pai"){
        if(hand.length== (14-furo.length*3)){
            for(const name of paiList){
                disable(name)
            }
            return
        }
        for(const name of paiList){
            if(paiLeft[name]==0){
                disable(name)
            }else{
                enable(name)
            }
        }
    }
    else if(mode == 'dora'){
        if(dora.length==5){
            for(const name of paiList){
                disable(name)
            }
            return
        }
        for(const name of paiList){
            if(paiLeft[name]==0){
                disable(name)
            }else{
                enable(name)
            }
        }
    }
    else if(mode == 'ura'){
        if(ura.length==5){
            for(const name of paiList){
                disable(name)
            }
            return
        }
        for(const name of paiList){
            if(paiLeft[name]==0){
                disable(name)
            }else{
                enable(name)
            }
        }
    }
    else{
        if(furo.length== Math.floor((14-hand.length)/3)){
            for(const name of paiList){
                disable(name)
            }
            return
        }
        if(mode=="chi"){
            for(const name of paiList){
                if(getNumber(name)>7 || getType(name)=='z'){
                    disable(name)
                }
                else{
                    if(paiLeft[name]==0 ||
                    paiLeft[next(name)]==0 ||
                    paiLeft[next(next(name))]==0){
                        disable(name)
                    }else{
                        enable(name)
                    }
                }
            }
        }
        else if(mode=="pon"){
            for(const name of paiList){
                if(paiLeft[name]<3){
                    disable(name)
                }else{
                    enable(name)
                }
            }
        }
        else{
            for(const name of paiList){
                if(paiLeft[name]<4){
                    disable(name)
                }else{
                    enable(name)
                }
            }
        }
    }
}
function clearAll(){
    
    initData();
    for(const x of document.getElementsByTagName("input")){
        if(x.type=='radio'){
            if(x.hasAttribute("checked")){
                x.checked = true
            }
        }
        else if(x.type=='checkbox'){
            x.checked = false
        }
        else if(x.type=="number"){
            x.value = 0
        }
        else{
            console.error("clearAll::UNHANDED INPUT")
        }
    }

    for(const objName of ['hand-row','furo-row','dora-row','ura-row']){
        let x = $(objName)
        // console.log(objName,x)
        while(x.hasChildNodes()){
            x.removeChild(x.firstChild)
        }
    }
    calculateDisable()
}


function myCalculate(){
    let x = $("yaku-list")
    while(x.hasChildNodes()){
        x.removeChild(x.firstChild)
    }
    let c = new Calculator()

    function changePai(s){
        return new Pai(getType(s),getNumber(s))
    }

    function changFuro(s){
        let open = true
        let localType=TRI
        if(s.type=="ankan")open=false

        if(s.type=="chi")localType = SEQ
        else if(s.type=="pon")localType = TRI
        else localType = QUAD
        return new Block(localType,getType(s.name),getNumber(s.name),open)
    }

    let p = []
    let localFuro = []
    let d = []
    let u = []
    
    for(const s of hand){
        p.push(changePai(s))
    }
    for(const s of dora){
        u.push(changePai(s))
    }
    for(const s of ura){
        d.push(changePai(s))
    }
    for(const s of furo){
        localFuro.push(changFuro(s))
    }
    let agariPai = p.pop()

    let s = new State(field,seat,yakus,agariWay,p,localFuro,d,u,agariPai,+redCnt)
    // console.log(s)
    let res = c.calculate(s)
    console.log(res)

    
    let hasYaku = false
    for(const y of res.yaku){
        if(!y.includes("宝牌"))hasYaku=true
    }
    if(res.han == 0 || !hasYaku){
        $("number-div").innerHTML = "无役/无和牌型"
        let x1 = document.createElement("li")
        x1.innerHTML="无"
        x.appendChild(x1)
        $("point-detail").innerHTML="0番 0符"
        return
    }
    if(res.pointType == OYARON || res.pointType==KORON){
        $("number-div").innerHTML = res.point1
    }
    else if(res.pointType == OYATSUMO){
        $("number-div").innerHTML = res.point1 + "ALL"
    }
    else if(res.pointType == KOTSUMO){
        $("number-div").innerHTML = res.point1 + "/" + res.point2
    }


    for(const y of res.yaku){
        let p = document.createElement("li")
        p.innerHTML = y
        x.appendChild(p)
    }
    if(!res.isYakuman){
        s = `${res.han}番`
        if(res.han<5) s += ` ${res.fu}符`

        if(res.manType==MANGAN)s+=" 满贯"
        if(res.manType==HANEMAN)s+=" 跳满"
        if(res.manType==BAIMAN)s+=" 倍满"
        if(res.manType==SANBAIMAN)s+=" 三倍满"
        if(res.manType==KAZOEYAKUMAN)s+=" 累计役满"
        $("point-detail").innerHTML = s
    }
    else{
        $("point-detail").innerHTML = `${res.han}倍役满`
    }
}

$("aka-dora").addEventListener("change",(event)=>{
    redCnt = event.target.value
})
for(const obj of document.getElementsByClassName("yaku-input")){
    obj.addEventListener("change",(e)=>{
        let trueValue = NOMI
        if(e.target.value=="riichi")trueValue=RIICHI
        if(e.target.value=="double-riichi")trueValue=DOUBLE_RIICHI
        if(e.target.value=="ippatsu")trueValue=IPPATSU
        if(e.target.value=="haite")trueValue=HAITEI_RAOYUE
        if(e.target.value=="houte")trueValue=HOUTEI_RAOYUI
        if(e.target.value=="rinnshann")trueValue=RINNSHANN_KAIHOU
        if(e.target.value=="chankan")trueValue=CHANKAN
        if(e.target.value=="tenhou")trueValue=TENHOU
        if(e.target.value=="chiihou")trueValue=CHIIHOU


        if(e.target.checked){
            yakus.push(trueValue)
        }
        else{
            yakus.splice(yakus.findIndex((item)=>{return item==trueValue}),1)
        }
    })
}

const hotKey = (e)=>{
    if(+e.key != NaN && +e.key>0){
        let ls = ['','pai','chi','pon','kan','ankan','dora','ura']
        let n = +e.key
        if(n < ls.length){
            $(ls[n]).checked=true
            setMode(ls[n])
        }
    }
    else if(e.key=='c' && e.ctrlKey){
        clearAll()
    }
    else if(e.key=='v' && e.ctrlKey && !$("calculate-btn").disabled){
        myCalculate()
    }
    
}

initData();
initPaiSelect()
calculateDisable()  

document.onkeydown = hotKey
