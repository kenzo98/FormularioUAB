Proyecto Formulario UAB:

Se trata de una página “oficial” de la Universidad de Barcelona que incluye un formulario de acceso a estudios que consta de 10 preguntas de tipo test con autocorrección. 
Además del código se ha ideado un logo ficticio y un fondo que se utiliza en todas las páginas.

Para el proyecto he creado tres html diferentes con sus respectivos js y css: INDEX, INSTRUCCIONES, TEST. Se incluye una versión escritorio y una versión responsive. 


INDEX: es la página principal informativa que consta de dos enlaces: instrucciones y test. También consta de otro botón de selección de idioma que he incluído, actualmente sólo es ornamental y es para darle un sentido lingüístico a la página.

INSTRUCCIONES: tiene el mismo estilo y comportamiento que la página de inicio. Aquí se describen las instrucciones del formulario y se enlaza con el propio examen.

TEST: consta de 5 tipos de pregunta: texto, checkbox, select, select multiple y radio. Al cargarse la página se inicia el cronómetro. El usuario dispone de 5 minutos para completar el test. Al acercarse al final el cronómetro cambia de color como aviso.
Al final de la página se incluye un botón tipo submit para enviar las respuestas (en este momento se paralizará el cronómetro); de no contestar todas las preguntas se alertará al usuario de que debe contestar las restantes. También se pide confirmación de envío.
El test se puntúa sobre 10. Cada pregunta vale un punto y en el caso de las múltiples 0’5 por acierto. El resultado final junto a las correcciones aparece en un alert.

JS: la página utiliza json para cargar las preguntas. Funciona de manera dinámica de forma que va pintando el html. Todos los botones son de tipo submit.

ESTILO y CSS: he seleccionado un tema que ayude a una fácil legibilidad en cuanto a colores y contraste entre el fondo y el texto pero que a la vez sea llamativo. Se utilizan las mismas fuentes en todas las páginas (Google Fonts), así como colores y estilos. El logo también se utiliza en todas las páginas. Pensaba utilizar este último como botón para volver pero prefería utilizar un único tipo de botón que hiciera juego con el resto.
Tuve problemas al validar el código con el código transparente, así que decidí cambiarlo por uno sólido.

Se incluye carpeta con los ficheros xml, xsd y dtd. 
Todos los códigos html y css han sido validados e indentados.
