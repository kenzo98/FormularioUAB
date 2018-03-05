var nota = 0; //nota sobre 10

var alerta=false;

var url = "json/Preguntas.json";
var xhttp = new XMLHttpRequest();

var nPreg;
var respuestaSelect = [];
var respuestaCorrecta = [];
var respuestaIncorrecta = [];

xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		gestionarJson(this.responseText);
	}
};

xhttp.open("GET", url, true); 
xhttp.send();


window.onload = function() {



    //CORREGIR al apretar el botón
    formElement = document.getElementById('myform');
	formElement.onsubmit = function() {
	//Esta función se ejecuta al enviar el formulario (botón submit). Se encarga de poner en marcha el flujo de comprobación, corrección y presentación de nota
			inicializar();
			if (comprobar()){
				if (confirm("¿Quieres corregir el examen?")){
					corregir();
					presentarNota()
					document.getElementById("cronometro").style.display="none";
				}
			}
			return false;		
	}
}

function gestionarJson(dadesJson){
	//Parseamos el JSON
	var object = JSON.parse(dadesJson);
	
	//En esta variable inyectamos dinámicamente HTML en función del tipo de pregunta que se cargue desde el JSON
	var html = "";
	//Contamos las preguntas e iteramos por ellas
	nPreg = object.questions.question.length;
	
	for (var i=0;i<nPreg;i++){
		html +='<div id="pregunta'+(i+1)+'" >'
		var question = object.questions.question[i];
		html += '<h2>' + question.title + '</h2>';
		
		//Si hay imágenes en la pregunta las ponemos
		if(question.hasOwnProperty('image')){
			html += '<img id="pulpito" src=' + question.image +' alt="pulpo" />';
		}
		
		//En función del tipo de pregunta se pinta el HTML correspondiente y se mete en la variable 'html'
		//Los ids, names y demás atributos se crean dinámicamente
		//También almacenamos el texto de las respuestas para la posterior corrección
		if(question.type == "text"){
			html += '<input class="input" id="p'+(i+1)+'" name="p'+(i+1)+'" type="text">';
			respuestaCorrecta.push(question.answer);
		}
		else if(question.type == "select"){
			if(question.hasOwnProperty('option')){
				html +='<select class="select" id="p'+(i+1)+'" name="p'+(i+1)+'" >';
				for(var y = 0; y < question.option.length; y++){
					html +='<option value='+(y+1)+'>'+question.option[y]+'</option>'
				}
				html +='</select>';
				respuestaCorrecta.push(question.option[question.answer-1]);
			}
		}
		else if(question.type == "multiple"){
			if(question.hasOwnProperty('option')){
				html +='<select class="multiple" id="p'+(i+1)+'" name="p'+(i+1)+'" multiple>';
				html +='<option value="-1" class="disabled" disabled>Selecciona al menos una opción</option>';
				for(var y = 0; y < question.option.length; y++){
					html +='<option value='+(y+1)+'>'+question.option[y]+'</option>'
				}
				html +='</select>';
				
				var res = [];
				for (var j=0;j<question.answer.length;j++){
					res.push(question.option[question.answer[j]-1])
				}
				respuestaCorrecta.push(res);
			}
		}
		else if(question.type == "checkbox"){
			if(question.hasOwnProperty('option')){
				//Agrupamos los input del checkbox en un div
				html +='<div id="p'+(i+1)+'" class="checkboxDiv">'
				for(var y = 0; y < question.option.length; y++){
					html += '<input class="checkbox" id="p'+(i+1)+'_'+y+'" type="checkbox" name="p'+(i+1)+'" value="'+(y+1)+'">';
					html += '<label for="lbl_'+(i+1)+'_'+y+'">'+question.option[y]+'</label><br/>';
				}
				html +="</div><br/>"
				respuestaCorrecta.push(question.option[question.answer-1]);
			}	
		}
		else if(question.type == "radio"){
			if(question.hasOwnProperty('option')){
				//Agrupamos los radioButton del checkbox en un div
				html +='<div id="p'+(i+1)+'" class="radioDiv">'
				for(var y = 0; y < question.option.length; y++){
					html += '<input class="radio" id="p'+(i+1)+'_'+y+'" type="radio" name="p'+(i+1)+'" value="'+(y+1)+'">';
					html += '<label for="lbl_'+(i+1)+'_'+y+'">'+question.option[y]+'</label><br/>';
				}
				html +="</div><br/>"
				respuestaCorrecta.push(question.option[question.answer-1]);
			}
		}
		html +="</div><br/>"
		respuestaSelect[i] = question.answer;
	}
	//finalmente inyectamos el contenido de 'html' en el form
	document.getElementById("myform").innerHTML = html+'<input type="submit" class="submit" value="Enviar"/>';
}

function inicializar() {
	//Esta función resetea la nota y las respuestas incorrectas en caso de correcciones consecutivas
    nota = 0.0;
	respuestaIncorrecta = [];
}

function comprobar(){
	// Esta función comprueba que las preguntas estén respondidas y en caso contrario avisa de la pregunta no respondida y hace focus en ella
	for(numPreg=0;numPreg<nPreg;numPreg++){
		var f = document.getElementById("p" + (numPreg+1));

		if (f.className =="input"){
			if (f.value=="") {
				f.focus();
				alert("Por favor, responde la pregunta "+(numPreg+1));
				return false;
			}
		}else if(f.className == "select"){
			if (f.selectedIndex==0) {
				f.focus();
				alert("Por favor, selecciona una opcion en la pregunta "+(numPreg+1));
				return false;
			}
		}
		else if(f.className == "multiple"){
			var multRespondido=false;
			for(i=1;i<(f.length);i++){
				var opt=f.options[i];
				if(opt.selected){
					multRespondido=true;
				}
			}
			if (!multRespondido) {
				f.focus();
				alert("Por favor, selecciona al menos una opcion en la pregunta "+(numPreg+1));
				return false;
			}
		}else if(f.className == "checkboxDiv"){
			var checked=false;
			var nombre = f.getElementsByTagName("input")
			for (i = 0; i < nombre.length; i++) {  
				if (nombre[i].checked) {
					checked=true;
				}
			}
			if (!checked) {
				nombre[0].focus();
				alert("Por favor, selecciona al menos una opcion en la pregunta "+(numPreg+1));
				return false;
			}				
		}else if(f.className == "radioDiv"){
			var checked=false;
			var nombre = f.getElementsByTagName("input")
			for (i = 0; i < nombre.length; i++) {  
				if (nombre[i].checked) {
					checked=true;
				}
			}
			if (!checked) {
				nombre[0].focus();
				alert("Por favor, selecciona al menos una opcion en la pregunta "+(numPreg+1));
				return false;
			}			
		}
	}
	return true;
}

function corregir() {
	//Esta función corrige las preguntas dinámicamente, actualiza la nota y anota las preguntas que han sido respondidas incorrectamente
	for(numPreg=0;numPreg<nPreg;numPreg++){
		var f = document.getElementById("p" + (numPreg+1));
		if (f.className =="input"){
			if (f.value == respuestaSelect[numPreg]) {
				nota += 1;
			}else{
				respuestaIncorrecta.push(numPreg);
			}
		}else if(f.className == "select"){
			if ((f.selectedIndex)+1 == respuestaSelect[numPreg]) {
				nota += 1;
			}else{
				respuestaIncorrecta.push(numPreg);
			}
		}
		else if(f.className == "multiple"){
			var notaFlotante = 0;
			var notaPorcentaje = 1/respuestaSelect[numPreg].length;
			//La nota de los select multiple se aplica en porciones, ya que tiene varias respuestas y todas tienen que ser respondidas para tener el punto completo
			loop1:
			for(i=0;i<(f.length);i++){
				var opt = f.options[i];
				if(opt.disabled==false){
					if(opt.selected){
						loop2:
						for(j=0;j<(respuestaSelect[numPreg].length);j++){
							if(opt.value==respuestaSelect[numPreg][j]){
								notaFlotante += notaPorcentaje;
								continue loop1;
							}
						}
						notaFlotante -= notaPorcentaje;
						continue loop1;
					}
				}
			}
			//Verificamos que la nota de la pregunta no pueda restar, aunque se responda mal del todo
			if(notaFlotante < 0){
				notaFlotante = 0;
			}
			if(notaFlotante <1){
				respuestaIncorrecta.push(numPreg);
			}
			if(notaFlotante > 0){
				nota +=notaFlotante;
			}
		}else if(f.className == "checkboxDiv"){
			var nombre = f.getElementsByTagName("input")
			var notaFlotante = 0;
			var notaPorcentaje = 1/respuestaSelect[numPreg].length;
			
			loop1:
			for(i=0;i<(nombre.length);i++){
				var opt = nombre[i];
				if(opt.checked){
					loop2:
					for(j=0;j<(respuestaSelect[numPreg].length);j++){
						if(opt.value==respuestaSelect[numPreg][j]){
							notaFlotante += notaPorcentaje;
							continue loop1;
						}
					}
					notaFlotante -= notaPorcentaje;
					continue loop1;
				}
			}
			//Verificamos que la nota de la pregunta no pueda restar, aunque se responda mal del todo
			if(notaFlotante < 0){
				notaFlotante = 0;
			}
			if(notaFlotante <1){
				respuestaIncorrecta.push(numPreg);
			}
			if(notaFlotante > 0){
				nota +=notaFlotante;
			}
		}else if(f.className == "radioDiv"){
			var nombre = f.getElementsByTagName("input")
			for (i = 0; i < nombre.length; i++) {
				if (nombre[i].checked){
					if (nombre[i].value == respuestaSelect[numPreg]) {
						nota += 1;
					}else{
						respuestaIncorrecta.push(numPreg);
					}	
				}
			}	
		}
	}
}

function presentarNota() {
	//Esta función informa del resultado de la corrección
    if(nota==10){
		//Si la nota es perfecta, te da la enhorabuena
		alert("Enhorabuena! Has sacado un 10. Todo bien, todo correcto.");
	}else{
		//Si alguna pregunta es incorrecta, incluso parcialmente, informa de ella y de la respuesta que era correcta
		var msg ="Has fallado "+ respuestaIncorrecta.length +" preguntas:\n";
		for (var i=0;i<respuestaIncorrecta.length;i++){
			var respuesta = respuestaIncorrecta[i];
			//En función de si había varias respuestas el texto cambia
			if(respuestaCorrecta[respuesta] && respuestaCorrecta[respuesta].constructor === Array){
				msg+="Las respuestas de la pregunta "+(respuesta)+" son:" + respuestaCorrecta[respuesta]+"\n";
			}else{
				msg+="La respuesta de la pregunta "+(respuesta)+" era:" + respuestaCorrecta[respuesta]+"\n";
			}
		}
		msg+="Tu nota final es "+nota;
		alert(msg);
	}
}

//TIMER

var second = 59;
var minute = 4;
  
setInterval(function(){
	if(second <10){
		document.getElementById("crono").innerHTML = "00:0"+ minute + ":0" + second;
	}else{
		document.getElementById("crono").innerHTML = "00:0"+ minute + ":" + second;
	}

	second--;

	if(second == 00){
		minute--;
		second = 59;
	}

	else if(minute < 1 ) {
		document.getElementById("crono").style.color = 'red';    
	}

	if(minute == 0 && second == 1){
		document.getElementById("crono").innerHTML = "Tiempo!";
		alert("Lo sentimos, se ha acabado el tiempo.");
	}

	if(minute <= -1) {
		document.getElementById("crono").innerHTML = " ";
	}

}, 1000);







