// turn(">") = 'v' ...
function turn(direc){ //turn('<') va changer la direction vers la droite.
	var seqOfTurns="<^>v<"; //regarder cela comme des fleches
	var foundAt = seqOfTurns.indexOf(direc);
	return(seqOfTurns.charAt(foundAt+1));
}

String.prototype.makeAStep=function(){
	if(/^[GN]/i.test(this)){
		return(this.substring(1).makeAStep());
	}
	var dir=this.charAt(0);
	var numSteps = parseInt(this.substr(1));
	var leftOut = this.substr(1).replace(/^[0-9]*/,"");
	if(numSteps==1){
		return leftOut;
	}else{
		return(dir + (numSteps - 1) +leftOut);
	}
};


function LabyrinthGameState(str){
	this.labyrinth=str;
	//this.mouseDirec=str.charAt(0);
	this.gameOver=false;
	
	this.getLabOrient = function(){
		if(/^[GN]/i.test(this.labyrinth)){//ignorer mur gris mur noir
			return this.labyrinth.charAt(1);
		}else{
			return this.labyrinth.charAt(0);
		}
	};
	
	this.mouseDirec=this.getLabOrient();
	
	this.execInstruction=function(ins){
		console.log("fait: " + ins);
		switch(ins){
			case "VIR":
				this.mouseDirec=turn(this.mouseDirec);
				break;
			case "PAS":
				if(this.mouseDirec == this.getLabOrient()){
					this.labyrinth=this.labyrinth.makeAStep();
					console.log(this.labyrinth);
					if(this.labyrinth.length===0){
						this.gameOver=true;
						
					}
				}else{
					console.log("Erreur: Souris est oriente" + this.mouseDirec + " alors que labyrinth est oriente " + this.getLabOrient());
					this.gameOver=true;
				}
				break;
			case "DEB":
				break;
			case "FIN":
				this.gameOver=true;
				break;
		}
	};	
	this.toString=function(){
		return(this.labyrinth +"\n" + this.mouseDirec);		
	};
	this.isMurNoir=function(){
		return(/^N/i.test(this.labyrinth));  //commence par n ?
	};
	this.isMurGris=function(){
		return(/^G/i.test(this.labyrinth)); //commence par g ?
	};
}


Array.prototype.last=function(){
	return(this[this.length-1]);
};



function MouseLangInterpreter( labyrinth, seqOfInstructions){
	this.labyrinth = new LabyrinthGameState(labyrinth);
	this.seqOfInstructions = seqOfInstructions;
	
	this.index=10; //on commence avec l'instruction 10
	this.ended=false;
	this.tests=[];
	this.siExec=[]; // chaque 'si' est execute ou pas...
	this.toString=function(){
		return this.labyrinth.toString()+ "\n" +this.tests +"\n\n";
	};
	
	this.execute= function(){
		while(!this.ended){
			var ins = this.seqOfInstructions[this.index];
			console.log( this.tests, this.siExec , ins);
			if(/^GOLN/.test(ins)){
				//console.log(ins.replace(/^[^0-9]*/,""));
				if(this.tests.length==0 || this.tests.last()){
					var destination=parseInt(ins.replace(/^[^0-9]*/,""));
					//console.log(destination);
					this.index=destination;
					this.tests=[]; //tous les tests ne servent plus
					continue;
				}else{
					this.index+=10;
				}
			}
			
			switch(ins){
				case "SIMUG":
					if(this.tests.length==0 || this.tests.last()){
						this.tests.push(this.labyrinth.isMurGris());
						this.siExec.push(true);
					}else{
						this.siExec.push(false);
					}
					this.index+=10;
					break;
				case "SIMUN":
					if(this.tests.length==0 || this.tests.last()){
						this.tests.push(this.labyrinth.isMurNoir());	
						this.siExec.push(true);
					}else{
						this.siExec.push(false);
					}
					this.index+=10;
					break;
				case "SIBUT":
					if(this.tests.length==0 || this.tests.last()){
						this.tests.push(
									this.labyrinth.gameOver 
						);	
						this.siExec.push(true);
					}else{
						this.siExec.push(false);
					}
					this.index+=10;
					break;
				case "SINON":
					if(!this.tests.last() && this.siExec.last()){
						this.tests.push(!this.tests.pop());	//faire la negation du dernier test; en case de si execute
					}
						
					this.siExec.pop();
					this.index+=10;
					break;
				case "FINSI":
					this.tests.pop();	//jeter la valeur du dernier test
				
					this.index+=10;
					break;
				case "FIN":
					this.ended=true;
					break;
				case "DEB":
					this.index+=10
					continue;
					break;
				case "VIR":
				case "PAS":
					if(this.tests.length==0 || this.tests.last()){
						this.labyrinth.execInstruction(ins);
					}
					this.index+=10;
					break;
				
					
			}
		}
	};
	
	
}

var lab = new LabyrinthGameState("<1G^3N");

var prog1 ={
	10:"DEB",
	
	20:"SIMUG",
	30:"VIR",
	40:"SINON",
	50:"SIMUN",
	60:"VIR",
	70:"VIR",
	80:"VIR",
	90:"SINON",
	100:"SIBUT",
	110:"GOLN 180",
	120:"SINON",
	130:"PAS",
	140:"FINSI",
	150:"FINSI",
	160:"FINSI",
	170:"GOLN 20",
	180:"FIN"
};

var prog2 = 
{
10:"DEB",
20:"SIBUT",
30:"SIMUG",
40:"VIR",
50:"GOLN 20",
60:"FINSI",
70:"SIMUN",
80:"VIR",
90:"VIR",
100:"VIR",
110:"GOLN 20",
120:"FINSI",
130:"GOLN 190",
140:"FINSI",
150:"SINON",
160:"PAS",
170:"GOL 20",
180:"FINSI",
190:"FIN"
}
;
var msli = new MouseLangInterpreter("^3G>14N^4N<10G^10", prog2);
console.log(msli.toString());
msli.execute();
console.log(msli.toString());
/*
//lab.execInstruction("VIR");
lab.execInstruction("PAS");

lab.execInstruction("VIR");

console.log(lab.toString());
lab.execInstruction("PAS");
console.log(lab.toString());
lab.execInstruction("PAS");
lab.execInstruction("PAS");
console.log(lab.toString());

*/

String.prototype.asSeqOfInsObject=function(){
	var obj = new Object();
	var lines = this.split("\n");
	for(var i = 0; i <lines.length; i++){
		var line = lines[i];
		var nb = parseInt(line);
		var ins = line.replace(/^[0-9]*/,"").trim();
		obj[nb]=ins;		
	}
	return obj;
}

//console.log("10 PAS\n20 VIR".asSeqOfInsObject()[10]);


/*

10 DEB
20SIMUG
30VIR
40SINON
50SIMUN
60VIR
70VIR
80VIR
90SINON
100SIBUT
110GOLN 180
120 SINON
130PAS
140FINSI
150FINSI
160FINSI
170GOLN 20
180FIN

*/