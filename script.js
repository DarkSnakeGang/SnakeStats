const gameIDs = ["o1y9pyk6", "9dow0go1"];
const maxRanglistLength = 17;
var categories = [];
var variables = [];
var levels = [];
var mode = 0;    //0 = main, 1 = cat, 2 = custom;
var requestsMade = 0;
var maxdate = undefined;
var firstdate = undefined;
//nog text toevoegen voor alts!
//test opmaak geen runmode
var appleAmounts = {"1 Apple":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v3/count_00.png",id:"count_00"},
                    "3 Apples":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v3/count_01.png",id:"count_01"},
                    "5 Apples":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v3/count_02.png",id:"count_02"},
		    "Dice":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v17/count_03.png",id:"count_03"}};
var speeds =       {"Standard":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v3/speed_00.png",id:"speed_00"},
                    "Slow":{visible:false,icon:"https://www.google.com/logos/fnbx/snake_arcade/v3/speed_02.png",id:"speed_01"},
                    "Fast":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v3/speed_01.png",id:"speed_02"}};
var sizes =        {"Standard":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v4/size_00.png",id:"size_00"},
                    "Small":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v4/size_01.png",id:"size_01"},
                    "Large":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v4/size_02.png",id:"size_02"}};
var gamemodes =    {"Classic":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_00.png",id:"trophy_01"},
                    "Wall":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_01.png",id:"trophy_02"},
                    "Portal":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_02.png",id:"trophy_03"},
                    "Cheese":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_03.png",id:"trophy_04"},
                    "Borderless":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_04.png",id:"trophy_5"},
                    "Twin":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_05.png",id:"trophy_06"},
                    "Winged":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_06.png",id:"trophy_07"},
                    "Yin Yang":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_07.png",id:"trophy_08"},
                    "Key":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_08.png",id:"trophy_09"},
                    "Sokoban":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_09.png",id:"trophy_10"},
                    "Poison":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_10.png",id:"trophy_11"},
                    "Dimension":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_11.png",id:"trophy_12"},
                    "Minesweeper":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_12.png",id:"trophy_13"},
		    "Statue":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_13.png",id:"trophy_14"},
		    "Light":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_14.png",id:"trophy_15"},
                    "Peaceful":{visible:true,icon:"https://www.google.com/logos/fnbx/snake_arcade/v16/trophy_15.png",id:"trophy_16"}};
var runModes =     {"25 Apples":{visible:true,icon:null,text:"25 Apples",id:"mode_00"},
                    "50 Apples":{visible:true,icon:null,text:"50 Apples",id:"mode_01"},
                    "100 Apples":{visible:true,icon:null,text:"100 Apples",id:"mode_02"},
                    "All Apples":{visible:true,icon:null,text:"All Apples",id:"mode_03"}};
var runs = [];
var bestRuns = [];
var date = "";
var ranglist = [];
var players = [];
var showAmount = false;
if(localStorage.getItem('showAmount') == null){
    localStorage.setItem('showAmount', showAmount);
}
else{
    showAmount = localStorage.getItem('showAmount');
    if(showAmount == "true"){
        showAmount = true;
    }
    else{
        showAmount = false;
    }
}

function generateRunHolder(list){
    //generate list that hold sorted runs in 5d dimensional array (bad coding practice but idc)
    /*  Runs is a 5d dimensional array allowing to sort runs for all game combinations
        1st: appleAmounts
        2nd: speeds
        3rd: sizes
        4th: gamemodes
        5th: runModes
    */
    for(appleAmount in appleAmounts){
        list[appleAmount] = [];
        for(speed in speeds){
            list[appleAmount][speed] = [];
            for(size in sizes){
                list[appleAmount][speed][size] = [];
                for(gamemode in gamemodes){
                    list[appleAmount][speed][size][gamemode] = [];
                    for(runMode in runModes){
                        if(runMode == "100 Apples" && size == "Small"){continue;}    //no 100 apples in small;
                        if(runMode == "69 Apples" && speed != "Slow"){continue;}       //only slow had 69 Apples
                        list[appleAmount][speed][size][gamemode][runMode] = [];
                    }
                }
            }
        }
    }
}

function getSettingsFromRun(run){
    var myAppleAmount = undefined;
    var mySpeed = undefined;
    var mySize = undefined;
    var myRunMode = undefined;
    var myGamemode = undefined;

    var level = levels.find(x => x.id == run.level);
    var category = categories.find(x => x.id == run.category);
    var values = [];
    for(value in run.values){
        values[variables.find(x => x.id == value).name] = variables.find(x => x.id == value).values.values[run.values[value]].label;
    }

    //appleAmount in values
    for(value in values){
        if(value.toLowerCase().indexOf("amount") != -1){
            for(appleAmount in appleAmounts){
                if(values[value].indexOf(appleAmount) != -1){
                    myAppleAmount = appleAmount;
                }
            }
        }
    }

    //size in values
    for(value in values){
        if(value.toLowerCase().indexOf("size") != -1){
            for(size in sizes){
                if(values[value].indexOf(size) != -1){
                    mySize = size;
                }
            }
        }
    }

    //gamemode can be in level name
    if(typeof(level) != "undefined"){
        for(gamemode in gamemodes){
            if(level.name.indexOf(gamemode) != -1){
                myGamemode = gamemode;
            }
        }
    }
    //gamemode of highscore runs are in category
    if(typeof(category) != "undefined" && typeof(myGamemode) == 'undefined'){
        for(gamemode in gamemodes){
            if(category.name.indexOf(gamemode) != -1){
                myGamemode = gamemode;
            }
        }
    }
    //or in values for 69 runs
    if(typeof(myGamemode) == 'undefined'){
        for(value in values){
            if(value.toLowerCase().indexOf('mode') != -1){
                for(gamemode in gamemodes){
                    if(values[value].indexOf(gamemode) != -1){
                        myGamemode = gamemode;
                    }
                }
            }
        }
    }

    //runMode depends on category
    if(typeof(category) != "undefined"){
        for(runMode in runModes){
            if(category.name.indexOf(runMode) != -1){
                myRunMode = runMode;
            }            
        }
        if(typeof(myRunMode) == 'undefined'){
            if(category.name.indexOf("High") != -1){            //set highscores to all apples
                myRunMode = "All Apples";
            }
        }
    }

    //speed can be in level name
    if(typeof(level) != "undefined"){
        for(speed in speeds){
            if(level.name.indexOf(speed) != -1){
                mySpeed = speed;
            }
        }
    }
    //or in values
    if(typeof(mySpeed) == 'undefined'){
        for(value in values){
            if(value.toLowerCase().indexOf('speed') != -1){
                for(speed in speeds){
                    if(values[value].indexOf(speed) != -1){
                        mySpeed = speed;
                    }
                }
            }
        }
    }
    //or in category
    if(typeof(mySpeed) == 'undefined'){
        if(typeof(category) != "undefined"){
            for(speed in speeds){
                if(category.name.indexOf(speed) != -1){
                    mySpeed = speed;
                }
            }
        }
    }
    //or slow if runmode is 69 Apples
    if(typeof(mySpeed) == 'undefined'){
        if(myRunMode == "69 Apples"){
            mySpeed = "Slow";
        }
    }

    return [myAppleAmount, mySpeed, mySize, myGamemode, myRunMode];
}

function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ 
        /* Do nothing */ 
    }
}

function makeAPIrequest(requestURL, callback){
    // Add id to solve query isssue
    hasQuery = requestURL.includes("?")
    url = requestURL
    if(hasQuery){
        url += "&"
    }
    else{
        url += "?"
    }
    url += "id=" + new Date().getTime()
    console.log(url);

    document.getElementById('info').innerHTML = "Getting runs..." + requestsMade;
    let request = new XMLHttpRequest();
	request.open("GET", url);
    request.onload = function(){
        if(request.status == 200){
            requestsMade+=1;
            let response = JSON.parse(request.response);
            callback(response);
        }
        else{
            sleepFor(2000);
            makeAPIrequest(requestURL, callback);
        }
    }
    request.send();
}

function getGameDetails(callback){
    var amount = 3 * gameIDs.length;
    var i = 0
    var ifDone = function(){
        i+=1;
        if(i == amount){
            callback();
        }
    }
    for(gameID of gameIDs){
        makeAPIrequest("https://www.speedrun.com/api/v1/games/"+gameID+"/variables", (x) => {variables.push.apply(variables, x.data); ifDone()});
        makeAPIrequest("https://www.speedrun.com/api/v1/games/"+gameID+"/categories?embed=game", (x) => {categories.push.apply(categories, x.data); ifDone()});
        makeAPIrequest("https://www.speedrun.com/api/v1/games/"+gameID+"/levels", (x) => {categories.push.apply(levels, x.data); ifDone()});
    }
}

function getAllRunsNew(gameID, callback){
    var count = 0;
    var total = 0;

    for(category of categories){
        if(category.game.data.id == gameID){
            total +=1;
        }
    }

    var ifdone = function(){
        count+=1;
        if(count == total){
            callback();
        }
    }

    for(category of categories){
        if(category.game.data.id == gameID){
            getAllRuns(gameID, ifdone, 0, category.id);
        }
    }
}

function getAllRuns(gameID, callback, offset, categorie){
    //set offset to 0 if first request
    if(typeof(offset) == "undefined"){
        var offset = 0;
    }
    const max = 200;
    const maxAPIrequests = 5;
    var done = false;
    var count = 0;

    var ifDone = function(x){
        count+=1; 
        if(x.data.length != 0 && offset<9999){
            //store runs
            for(run of x.data){
                var settings = getSettingsFromRun(run);
                if(settings.indexOf(undefined) == -1){
                    try{
                        runs[settings[0]][settings[1]][settings[2]][settings[3]][settings[4]].push(run);
                        if(typeof(players[run.players.data[0].names.international]) == 'undefined'){
                            players[run.players.data[0].names.international] = run.players.data[0].id;
                        }
                    }
                    catch{//non valid combination
                    }
                }
            }
        }
        else{
            done = true;
        }

        //check if more request are needed
        if(count == maxAPIrequests){
            if(!done){
                getAllRuns(gameID, callback, offset, categorie);
            }
            else if(typeof(callback) != "undefined"){
                callback();
            }
        }
    }  
	// Limit the offset to whatever src supports which right now is up to 10000 - this "if" was added by yarmiplay
	if(offset<9999){
	    for (let i = 0; i < maxAPIrequests; i++) {
		makeAPIrequest("https://www.speedrun.com/api/v1/runs?game="+gameID+"&max="+max+"&embed=players&status=verified&category="+categorie+"&direction=desc&orderby=submitted&offset="+offset, (x) => ifDone(x));
		makeAPIrequest("https://www.speedrun.com/api/v1/runs?game="+gameID+"&max="+max+"&embed=players&status=verified&category="+categorie+"&direction=asc&orderby=submitted&offset="+offset, (x) => ifDone(x));
		offset += max;
	    } 
	}
	else {
		done = true;
	}
}

function calculateBestRuns(callback){
    generateRunHolder(bestRuns);
    for(appleAmount in appleAmounts){
        for(speed in bestRuns[appleAmount]){
            for(size in bestRuns[appleAmount][speed]){
                for(gamemode in bestRuns[appleAmount][speed][size]){
                    for(runMode in bestRuns[appleAmount][speed][size][gamemode]){
                        var localRuns = runs[appleAmount][speed][size][gamemode][runMode];
                        var localBestRuns = [];
                        var bestTime;

                        for(run of localRuns){
                            rundate = new Date(run.date);
                            if(firstdate == undefined){
                                firstdate = rundate;
                            }
                            else if(rundate < firstdate){
                                firstdate = rundate
                            }
                            //check date
                            if(maxdate != undefined){
                                if(rundate > maxdate){
                                    continue;
                                }
                            }
                            //add first run
                            if(localBestRuns.length == 0){
                                localBestRuns = [run];
                                bestTime = run.times.primary_t;
                            }
                            else if(run.times.primary_t == bestTime){   //add if same time
                                //check if not already in list
                                var inList = false;
                                for(bestRun of localBestRuns){
                                    if(run.players.data[0].id == bestRun.players.data[0].id){
                                        inList = true;
                                    }
                                }
                                if(!inList){
                                    localBestRuns.push(run);
                                }
                            }
                            else if((run.times.primary_t < bestTime || bestTime< 1) && run.times.primary_t >=1){    //add if better time
                                localBestRuns = [run];
                                bestTime = run.times.primary_t;
                            }
                            else if(run.times.primary_t < 1 && run.times.primary_t > bestTime){     //for highscore runs
                                localBestRuns = [run];
                                bestTime = run.times.primary_t;
                            }
                        }
                        bestRuns[appleAmount][speed][size][gamemode][runMode] = localBestRuns;
                    }
                }
            }
        }
    }
    if(typeof(callback) != "undefined"){
        callback();
    }
}

function roundNumber(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

function calculateRanglist(){
    ranglist = [];
    //really bad code but yeah....
    for(appleAmount in appleAmounts){
        if(appleAmounts[appleAmount].visible){
            for(speed in runs[appleAmount]){
                if(speeds[speed].visible){
                    for(size in runs[appleAmount][speed]){
                        if(sizes[size].visible){
                            for(gamemode in runs[appleAmount][speed][size]){
                                if(gamemodes[gamemode].visible){
                                    for(runMode in runs[appleAmount][speed][size][gamemode]){
                                        if(runModes[runMode].visible){
                                            for(run of bestRuns[appleAmount][speed][size][gamemode][runMode]){
                                                //if(run.players.data[0].rel != "user"){
                                                //    continue;
                                                //}
                                                var id = run.players.data[0].id;
                                                if(typeof(ranglist[id]) == 'undefined'){
                                                    ranglist[id] = [1, run.players.data[0]];
                                                }
                                                else{
                                                    ranglist[id][0] += 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    //calculate total
    total = 0;
    for(user in ranglist){
        total += ranglist[user][0];
    }
    //calculate percentages
    if(total != 0){
        for(user in ranglist){
            ranglist[user][2] = roundNumber(ranglist[user][0]*100/total,2);
        }
    }

    ranglist = ranglist.sort(function(a, b){return b-a});
}

function createIconElement(setting){
    if(setting.icon == null){
        return document.createTextNode(setting.text);
    }
    else{
        var img = document.createElement('img');
        img.setAttribute('src',setting.icon);
        img.setAttribute('alt',setting.text);
        return img;
    }
}

function createTimeElement(times){
    ptformatter = function primaryTimeFormatter(pt){
        pt = pt.replace("PT","");
        if(pt.indexOf("M") == -1){
            pt = "0M"+pt;
        }
        if(pt.indexOf("S") == -1){
            pt = pt+"0.000S";
        }
        else if(pt.indexOf(".") == -1){
            pt = pt.substring(0,pt.indexOf("S")) +".000S";
        }
        pt = pt.replace("H","<small>h </small>");
        pt = pt.replace("M","<small>m </small>");
        pt = pt.replace(".","<small>s </small>");
        pt = pt.replace("S","<small>ms</small>");
        return pt;
    }

    atformatter = function appleTimeFormatter(pt){
        while(pt.indexOf("PT0.0") != -1){
            pt = pt.replace("PT0.0","PT0.");
        }
        pt = pt.replace("PT0.","");
        pt = pt.replace("S","");
        return pt+ " Apples";
    }

    var span = document.createElement('span');
    span.setAttribute('class','time');
    var text;
    if(times.primary_t < 1){
        text = atformatter(times.primary);
    }
    else{
        text = ptformatter(times.primary);
    }
    span.innerHTML = text;
    return span;
}

function createNameElement(user){
    var span = document.createElement('span');
    span.setAttribute('class', 'name gradient-text');
    var a = document.createElement('a');
    a.setAttribute('href', user.weblink);
    a.setAttribute('target','_blank');
    if(user.rel == "user"){
        span.appendChild(document.createTextNode(user.names.international));
        if(user["name-style"].style == "gradient"){
            var colorfrom = user["name-style"]["color-from"].dark;
            var colorto = user["name-style"]["color-to"].dark;
        }
        else{
            var colorfrom = user["name-style"]["color"].dark;
            var colorto = user["name-style"]["color"].dark;
        }
    }
    else{
        span.appendChild(document.createTextNode(user.name))
        var colorfrom = "#000000";
        var colorto  = "#000000";
    }

    span.style.backgroundImage = "linear-gradient(90deg, "+colorfrom+","+colorto+")";
    a.appendChild(span);
    return a;
}

function generateLeaderboard(settings){
    var table = document.createElement('table');
    table.setAttribute('class','leaderboard');

    //calculate stuff
    var thisBoardRunModes = [];
    var thisBoardRuns = bestRuns[settings[0]][settings[1]][settings[2]];
    for(gamemode in thisBoardRuns){
        if(gamemodes[gamemode].visible){
            for(runMode in thisBoardRuns[gamemode]){
                if(runModes[runMode].visible && thisBoardRunModes.indexOf(runMode) == -1){
                    thisBoardRunModes.push(runMode);
                }
            }
        }
    }
    
    //create thead
    var thead = document.createElement('thead');
    var row;
    var th;
    var td;
    row = document.createElement('tr');
    th = document.createElement('th');
    th.setAttribute('class', 'settingsRow');
    th.setAttribute('colspan', thisBoardRunModes.length+1);
    th.appendChild(createIconElement(appleAmounts[settings[0]]));
    th.appendChild(createIconElement(speeds[settings[1]]));
    th.appendChild(createIconElement(sizes[settings[2]]));
    row.appendChild(th);
    thead.appendChild(row);

    row = document.createElement('tr');
    row.appendChild(document.createElement('th'));
    for(runMode of thisBoardRunModes){
        let th = document.createElement('th');
        th.appendChild(createIconElement(runModes[runMode]));
        row.appendChild(th);
    }
    thead.appendChild(row);
    table.appendChild(thead);

    //creat tbody
    var tbody = document.createElement('tbody');
    for(gamemode in thisBoardRuns){
        if(gamemodes[gamemode].visible){
            row = document.createElement('tr');
            th = document.createElement('th');
            th.appendChild(createIconElement(gamemodes[gamemode]));
            row.appendChild(th);

            for(runMode of thisBoardRunModes){
                td = document.createElement('td');
                if(typeof(thisBoardRuns[gamemode][runMode]) != 'undefined'){
                    td.setAttribute('class','result');
                    if(thisBoardRuns[gamemode][runMode].length != 0){
                        var a = document.createElement('a');
                        a.setAttribute('href', thisBoardRuns[gamemode][runMode][0].weblink);
                        a.setAttribute('target','_blank');
                        a.appendChild(createTimeElement(thisBoardRuns[gamemode][runMode][0].times));
                        for(run of thisBoardRuns[gamemode][runMode]){
                            a.appendChild(createNameElement(run.players.data[0]))
                        }
                        td.appendChild(a);
                    }
                }
                row.appendChild(td);
            }
            tbody.appendChild(row);

        }
    }
    table.appendChild(tbody);

    document.getElementsByClassName("container")[0].appendChild(table);
}

function generateAllLeaderboards(){
    for(appleAmount in appleAmounts){
        if(appleAmounts[appleAmount].visible){
            for(speed in runs[appleAmount]){
                if(speeds[speed].visible){
                    for(size in runs[appleAmount][speed]){
                        if(sizes[size].visible){
                            generateLeaderboard([appleAmount,speed,size]);
                        }
                    }
                }
            }
        }
    }
}

function generateRanglist(){
    var table = document.createElement('table');
    table.setAttribute('class', 'ranglist mode'+mode);
    var thead = document.createElement('thead');
    var row = document.createElement('tr');
    var th = document.createElement('th');
    th.setAttribute('colspan', 2);
    th.appendChild(createIconElement(gamemodes['Classic']));
    row.appendChild(th);
    thead.appendChild(row);
    table.append(thead);

    var i = 0;
    var tbody = document.createElement('tbody');
    var values = []
    var index = 0;
    if(!showAmount){
        var index = 2;
    }
    for(id in ranglist){
        if(values.indexOf(ranglist[id][index]) == -1){
            values.push(ranglist[id][index]);
        }
    }
    values = values.sort(function(a, b){return b-a});
    
    for(value of values){
        for(id in ranglist){
            if(ranglist[id][index] == value){

                //delete anonymous
                if(ranglist[id][1].rel != "user"){
                    continue;
                }
                
                row = document.createElement('tr');
                row.setAttribute('class','ranglistRow result');

                var td = document.createElement('td');
                td.appendChild(createNameElement(ranglist[id][1]))
                row.appendChild(td);

                td = document.createElement('td');
                td.setAttribute('class','percentage result');
                if(index == 2){
                    td.appendChild(document.createTextNode(ranglist[id][index]+"%"));
                }
                else{
                    td.appendChild(document.createTextNode(ranglist[id][index]));
                }
                row.appendChild(td);
                if(i >= maxRanglistLength){
                    row.setAttribute('style','display:none');
                }
                tbody.appendChild(row);
                i+=1;
            }
        }
    }
    if(i >  maxRanglistLength){
        row = document.createElement('tr');
        td = document.createElement('td');
        td.setAttribute('colspan',2);
        b = document.createElement('button');
        b.setAttribute('id','morebutton');
        //a.setAttribute('href','');
        b.appendChild(document.createTextNode("Click here to see all runners.."));
        b.addEventListener('click', () => {
            for(row of document.getElementsByClassName('ranglistRow')){
                row.setAttribute('style','');
            }
            document.getElementById("morebutton").setAttribute('style','display:none');
        });
        td.appendChild(b);
        row.appendChild(td);
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    document.getElementsByClassName("container")[0].appendChild(table);
}

function removeLeaderboards(){
    var root =  document.getElementsByClassName("container")[0]
    while (root.firstChild) {
        root.removeChild(root.lastChild);
    }    
}

function switchMode(newmode){
    document.getElementById('info').setAttribute('style','');
    mode = newmode;
    removeLeaderboards();
    reset = function(){
        //turn everything true
        for(appleAmount in appleAmounts){
            appleAmounts[appleAmount].visible = true;
        }
        for(speed in speeds){
            speeds[speed].visible = true;
        }
        for(size in sizes){
            sizes[size].visible = true;
        }
        for(gamemode in gamemodes){
            gamemodes[gamemode].visible = true;
        }
        for(runMode in runModes){
            runModes[runMode].visible = true;
        }
        //change option buttons
        for(optionButton of document.getElementsByClassName('optionButtonImage')){
            optionButton.setAttribute('class','optionButtonImage');
        }
        for(runMode in runModes){
            document.getElementById('option'+runModes[runMode].id).checked = true;
        }
    }
    switch(mode){
        case 0:
            reset();
            speeds["Slow"].visible = false;
            document.getElementById('optionspeed_01').firstChild.setAttribute('class','optionButtonImage optionButtonImageDisabled');
            //document.getElementById('optionmode_02').checked = false;
            document.getElementById("mainText").setAttribute("style",'');
            document.getElementById("catText").setAttribute("style",'display:none');
            document.getElementById("customText").setAttribute("style",'display:none');
            document.getElementById("switchButton").innerHTML = "Click here to go to Category Extensions";
            break;
        case 1: //slow mode
            reset();
            speeds["Fast"].visible = false;
            speeds["Standard"].visible = false;
            document.getElementById('optionspeed_00').firstChild.setAttribute('class','optionButtonImage optionButtonImageDisabled');
            document.getElementById('optionspeed_02').firstChild.setAttribute('class','optionButtonImage optionButtonImageDisabled');
            document.getElementById("mainText").setAttribute("style",'display:none');
            document.getElementById("catText").setAttribute("style",'');
            document.getElementById("customText").setAttribute("style",'display:none');
            document.getElementById("switchButton").innerHTML = "Click here to go to Main Leaderboard";
            break;
        case 2:
            document.getElementById("mainText").setAttribute("style",'display:none');
            document.getElementById("catText").setAttribute("style",'display:none');
            document.getElementById("customText").setAttribute("style",'');
            document.getElementById("switchButton").innerHTML = "Click here to go to Main Leaderboard";

    }
    calculateRanglist();
    document.getElementById('info').setAttribute('style','display:none');
    generateRanglist();
    generateAllLeaderboards();
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function checkBestDate(name){
    var playerid = players[name];
    if(typeof(playerid) == 'undefined'){
        return "not found";
    }
    var checkdate = firstdate;
    var thisdate = new Date();
    var bestdate = new Date();
    var bestp = 0;
    var index = 0;
    if(!showAmount){
        var index = 2;
    }
    while(true){
        maxdate = checkdate;
        calculateBestRuns();
        calculateRanglist();
        if(typeof(ranglist[playerid]) != 'undefined'){
            if(ranglist[playerid][index] >= bestp){
                bestp = ranglist[playerid][index];
                bestdate = checkdate;
            }
        }
        //increase
        checkdate = addDays(checkdate, 1);
        if(checkdate > thisdate){
            break;
        }
    }
    return bestdate;
}

// Get the modal
var modal = document.getElementById("infoModal");
var btn = document.getElementById("infoBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
}

var modal2 = document.getElementById("settingsModal");
var btn2 = document.getElementById("settingsBtn");
var span2 = document.getElementsByClassName("close")[1];
btn2.onclick = function() {
  modal2.style.display = "block";
}
span2.onclick = function() {
  modal2.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
  else if (event.target == modal) {
    modal.style.display = "none";
  }
}

//datepicker
document.getElementById("datepicker").onchange = function(){
    maxdate = document.getElementById("datepicker").valueAsDate;
    calculateBestRuns();
    switchMode(mode);
}

//option buttons
function createOptionButton(setting){
    var button = document.createElement('button');
    button.setAttribute('class','optionButton');
    button.setAttribute('onclick','optionButtonClick(this.id)');
    button.setAttribute('id','option'+setting.id);
    button.setAttribute('type','button');
    var icon = createIconElement(setting);
    if(setting.visible){
        icon.setAttribute('class','optionButtonImage');
    }
    else{
        icon.setAttribute('class','optionButtonImage optionButtonImageDisabled');
    }
    button.appendChild(icon);
    return button;
}

function optionButtonClick(clicked_id){
    var element = document.getElementById(clicked_id);
    image = element.getElementsByClassName("optionButtonImage")[0];
    setTo = true;
    if(image.classList.contains("optionButtonImageDisabled")){
        image.classList.remove("optionButtonImageDisabled");
    }
    else{
        image.classList.add("optionButtonImageDisabled");
        setTo = false;
    }
    for(gamemode in gamemodes){
        if("option"+gamemodes[gamemode].id == clicked_id){
            gamemodes[gamemode].visible = setTo;
        }
    }
    for(appleAmount in appleAmounts){
        if("option"+appleAmounts[appleAmount].id == clicked_id){
            appleAmounts[appleAmount].visible = setTo;
        }
    }
    for(speed in speeds){
        if("option"+speeds[speed].id == clicked_id){
            speeds[speed].visible = setTo;
        }
    }
    for(size in sizes){
        if("option"+sizes[size].id == clicked_id){
            sizes[size].visible = setTo;
        }
    }
    switchMode(2);
}

//make all optionbuttons
for(gamemode in gamemodes){
    document.getElementById('optionButtons').appendChild(createOptionButton(gamemodes[gamemode]));
}
document.getElementById('optionButtons').appendChild(document.createElement('br'));
for(appleAmount in appleAmounts){
    document.getElementById('optionButtons').appendChild(createOptionButton(appleAmounts[appleAmount]));
}
document.getElementById('optionButtons').appendChild(document.createElement('br'));
for(speed in speeds){
    document.getElementById('optionButtons').appendChild(createOptionButton(speeds[speed]));
}
document.getElementById('optionButtons').appendChild(document.createElement('br'));
for(size in sizes){
    document.getElementById('optionButtons').appendChild(createOptionButton(sizes[size]));
}
for(runMode in runModes){
    document.getElementById('optionButtons').appendChild(document.createElement('br'));
    input = document.createElement('input');
    input.checked = true;
    input.setAttribute('type','checkbox');
    input.setAttribute('id',"option"+runModes[runMode].id);
    label = document.createElement('label');
    label.setAttribute('for',"option"+runModes[runMode].id);
    label.appendChild(document.createTextNode(runModes[runMode].text));
    input.addEventListener('click', ()=> {
        for(runMode in runModes){
            runModes[runMode].visible = document.getElementById('option'+runModes[runMode].id).checked;
            switchMode(2);
        }
    });
    document.getElementById('optionButtons').appendChild(input);
    document.getElementById('optionButtons').appendChild(label);
}
document.getElementById('optionmode_02').checked = false;

//username
document.getElementById('sendusername').addEventListener('click', () =>{
    document.getElementById('usernameResult').setAttribute('style','');
    document.getElementById('usernameResult').innerHTML = "Calculating...";
    requestAnimationFrame(() =>
        requestAnimationFrame(() =>{
        date = checkBestDate(document.getElementById('username').value);
        if(date == "not found"){
            document.getElementById('usernameResult').innerHTML = "Username not found";
        }
        else{
            document.getElementById('datepicker').valueAsDate = date;
            maxdate = date;
            calculateBestRuns();
            switchMode(mode);
            document.getElementById('usernameResult').innerHTML = "Date set!";
        }
    }));
})

function setHighestLabel(){
    if(showAmount){
        document.getElementById('highestLabel').innerHTML = "Enter an username to calculate the date with the highest number of runs from this user";
    }
    else{
        document.getElementById('highestLabel').innerHTML = "Enter an username to calculate the date with the highest percentage of runs from this user";
    }
}
setHighestLabel();
//showamount
document.getElementById('showAmount').checked = showAmount;
document.getElementById('showAmount').addEventListener('click', (e) => {
    showAmount = document.getElementById('showAmount').checked;
    localStorage.setItem('showAmount', showAmount);
    setHighestLabel();
    switchMode(mode);
});

//start downloading runs
generateRunHolder(runs);
getGameDetails(
    () => getAllRunsNew(gameIDs[0],
        () => getAllRunsNew(gameIDs[1],
            () => {
                document.getElementById('info').innerHTML = "Calculating stuff...";
                calculateBestRuns();
                calculateRanglist();
                document.getElementById('info').setAttribute('style','display:none');
                generateRanglist();
                generateAllLeaderboards();
                document.getElementById("switchButton").addEventListener('click', () => {
                    if(mode == 0){
                        switchMode(1);
                    }
                    else{
                        switchMode(0);
                    }
                });
            }
        )
    )
);
