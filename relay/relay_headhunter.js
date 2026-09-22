// Headhunter
// by VeeArr (#2045369)
//
// Based on spading by MontyPythn (#256896) and Jeparo (#2246666)

const kol = require("kolmafia");

const MY_FILENAME="./relay_headhunter.js";
const TARGET_VERSION=29273;

module.exports.main = function main(){
	if(!checkVersion()){
		kol.write("<font color=red>Requires KoLmafia r"+TARGET_VERSION+" or newer.</font>");
		return;
	}
	
	let output="";
	
	let fields=kol.formFields();
	let action=fields["action"];
	let config=parseConfig(fields);
	
	output+=handleSearchBar(config);
	if(action=="search"){
		output+=handleSearch(config);
	}
	
	let page="<html><head><title>Headhunter</title></head><body><center>\n"+output+"</center></body></html>";
	
	kol.write(page);
}

const FIELD_LABELS={"item":"Item Drop Bonus","meat":"Meat Drop Bonus","hpreg":"HP Regen","mpreg":"MP Regen","physical":"Physical Attack","cold":"Cold Attack","hot":"Hot Attack","sleaze":"Sleaze Attack","stench":"Stench Attack","spooky":"Spooky Attack"};

function parseConfig(fields){
	let pathId=kol.myPathId();
	if("pathId" in fields){
		pathId=parseInt(fields["pathId"]);
	}
	
	let config={pathId};
	if("sortBy" in fields){
		config.sortBy=fields["sortBy"];
	}else{
		config.sortBy="Item Drop Bonus";
	}
	
	if("allowedExtras" in fields){
		config.allowedExtras=parseInt(fields["allowedExtras"]);
	}else{
		config.allowedExtras=0;
	}
	
	for([name,label] in FIELD_LABELS){
		config[name]=(name in fields);
	}
	
	return config;
}

function handleSearchBar(config){
	let rv="";
	rv+="<form action='"+MY_FILENAME+"'>";
	rv+="<input type='hidden' name='relay' value='true'/>";
	rv+="Path: <select name='pathId'>";
	
	let pathListing=[];
	for([idx,path] in Path.all()){
		pathListing.push({id:path.id,name:path.name});
	}
	pathListing.push({id:0,name:"Unrestricted"});
	pathListing.sort((a,b)=>a.id-b.id);
	for([idx,path] in pathListing){
		rv+="<option value='"+path.id+"'"+(path.id==config.pathId?" selected":"")+">"+path.name+"</option>";
	}
	rv+="</select><br/><br/>";
	
	rv+=buildCheckbox(config,"item")+"&nbsp;";
	rv+=buildCheckbox(config,"meat")+"&nbsp;";
	rv+=buildCheckbox(config,"hpreg")+"&nbsp;";
	rv+=buildCheckbox(config,"mpreg")+"<br/>";
	
	rv+=buildCheckbox(config,"physical")+"&nbsp;";
	rv+=buildCheckbox(config,"cold")+"&nbsp;";
	rv+=buildCheckbox(config,"hot")+"&nbsp;";
	rv+=buildCheckbox(config,"sleaze")+"&nbsp;";
	rv+=buildCheckbox(config,"stench")+"&nbsp;";
	rv+=buildCheckbox(config,"spooky")+"<br/>";
	
	rv+="Sort By: <select name='sortBy'>";
	for([name,label] in FIELD_LABELS){
		rv+="<option value='"+label+"'"+(label==config.sortBy?" selected":"")+">"+label+"</option>";
	}
	rv+="</select> ";
	
	rv+="Allow Extras: <select name='allowedExtras'>";
	for(let i=0;i<5;i++){
		rv+="<option value='"+i+"'"+(i==config.allowedExtras?" selected":"")+">"+i+"</option>";
	}
	rv+="</select><br/>";
	
	rv+="<br/><button type='submit' name='action' value='search'>Search</button></form>";
	
	return rv+"\n";
}

function buildCheckbox(config,name,label){
	if(label===undefined){
		label=FIELD_LABELS[name];
	}
	return "<label><input type='checkbox' name='"+name+"'"+(config[name]?"checked":"")+"/>"+label+"</label>";
}

function handleSearch(config){
	let path=kol.toPath(config.pathId);
	
	let results=[];
	monsterloop:for([idx,monster] in Monster.all()){
		if(!monster.copyable || monster.boss){continue;}
		
		let monsterMods=kol.shrunkenHeadZombieWeights(monster,path);
		
		let extras=0;
		for([name,label] in FIELD_LABELS){
			let present=(label in monsterMods);
			let reqd=config[name];
			if(reqd && !present){
				continue monsterloop;
			}else if(!reqd && present){
				extras++;
				if(extras>config.allowedExtras){
					continue monsterloop;
				}
			}
		}
		
		found=true;
		results.push({monster,extras,monsterMods});
	}
	
	let rv="<b>Search Results:</b><br/><br/>";
	if(results.length==0){
		rv+="No monster matches these specifications.<br/>";
	}else{
		results.sort(getResultComparator(config.sortBy));
		rv+="<style>table{border-spacing:0px} tr:nth-child(even){background-color:#FFFFFF} tr:nth-child(odd){background-color:#DDDDDD} td{padding:2px 5px}</style>";
		rv+="<table>";
		for([idx,result] in results){
			rv+="<tr><td><a href='"+kol.toWikiUrl(result.monster)+"' target='_blank'>"+result.monster+"</a></td>"+modsToString(result.monsterMods,config)+"</tr>";
		}
		rv+="</table>";
	}
	
	return rv+"\n";
}

function getResultComparator(sortBy){
	return function resultComparator(a,b){
		let aSortVal=100*(a.monsterMods[sortBy] ?? 0)-a.extras;
		let bSortVal=100*(b.monsterMods[sortBy] ?? 0)-b.extras;
		
		if(aSortVal!=bSortVal){
			return bSortVal-aSortVal;
		}
		
		return a.monster.name.toUpperCase()<b.monster.name.toUpperCase() ? -1 : 1;
	}
}

function modsToString(monsterMods,config){
	function modWithWeight(monsterMods,label){
		if(!(label in monsterMods)){
			return "";
		}
		
		return "<td>"+label+" ("+monsterMods[label]+"%)</td>";
	}
	
	let rv="";
	rv+=modWithWeight(monsterMods,config.sortBy);
	for([name,label] in FIELD_LABELS){
		if(label!=config.sortBy){
			rv+=modWithWeight(monsterMods,label);
		}
	}
	return rv;
}

function checkVersion(){
	let current=kol.getRevision();
	return current>=TARGET_VERSION;
}
