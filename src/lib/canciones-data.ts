export interface LineaCancion {
  id: string;       // format: songId-lineNumber e.g. "01-1"
  texto: string;
  orden: number;
  songId: string;   // which song this line belongs to
}

export interface Cancion {
  id: string;        // "01" through "15"
  nombre: string;
  publicada: boolean; // true for 5 published songs
  lineas: LineaCancion[];
}

const SONG_01: LineaCancion[] = [
  { id: '01-1', texto: 'Bájame del trono, no soy diosa', orden: 1, songId: '01' },
  { id: '01-2', texto: 'Quiero salir corriendo y huir de ti', orden: 2, songId: '01' },
  { id: '01-3', texto: 'Aquí no quiero estar', orden: 3, songId: '01' },
  { id: '01-4', texto: 'No es este mi lugar', orden: 4, songId: '01' },
  { id: '01-5', texto: 'Yo me quiero escapar', orden: 5, songId: '01' },
  { id: '01-6', texto: 'Y tú bájame del trono', orden: 6, songId: '01' },
  { id: '01-7', texto: 'No quiero el altar', orden: 7, songId: '01' },
  { id: '01-8', texto: 'Yo solo pienso en ayudarme y ayudar', orden: 8, songId: '01' },
  { id: '01-9', texto: 'Eso no es la vibe', orden: 9, songId: '01' },
  { id: '01-10', texto: 'What you want from me?', orden: 10, songId: '01' },
  { id: '01-11', texto: 'Esa no es mi vibe', orden: 11, songId: '01' },
  { id: '01-12', texto: 'Quiero hacerlo mal, quiero cagarla', orden: 12, songId: '01' },
  { id: '01-13', texto: 'Quiero ser tu mujer y no tu reina', orden: 13, songId: '01' },
  { id: '01-14', texto: 'Que me beses los labios, no los pies', orden: 14, songId: '01' },
  { id: '01-15', texto: 'No soy Hello Kitty, solo hell', orden: 15, songId: '01' },
  { id: '01-16', texto: 'Quiero ser real y no una reina', orden: 16, songId: '01' },
  { id: '01-17', texto: 'Quiero que me bajes a la tierra', orden: 17, songId: '01' },
  { id: '01-18', texto: 'Quiero que me quieras y te quieras', orden: 18, songId: '01' },
  { id: '01-19', texto: 'Quiero que me digas dónde voy', orden: 19, songId: '01' },
  { id: '01-20', texto: 'Y si te digo la verdad, da-da-da', orden: 20, songId: '01' },
  { id: '01-21', texto: 'Tengo tus mensajes en spam', orden: 21, songId: '01' },
  { id: '01-22', texto: 'No me hagas masajes que no cal', orden: 22, songId: '01' },
  { id: '01-23', texto: 'Compro donde tú compras el pan', orden: 23, songId: '01' },
];

const SONG_02: LineaCancion[] = [
  { id: '02-1', texto: 'I think you lucky, lucky', orden: 1, songId: '02' },
  { id: '02-2', texto: 'De probar este pussy', orden: 2, songId: '02' },
  { id: '02-3', texto: 'T-tengo ganas, sí', orden: 3, songId: '02' },
  { id: '02-4', texto: 'Tú quédate aquí', orden: 4, songId: '02' },
  { id: '02-5', texto: 'Yo te traigo el cowboy, Rolls-Royce', orden: 5, songId: '02' },
  { id: '02-6', texto: 'Todo lo que quieras', orden: 6, songId: '02' },
  { id: '02-7', texto: 'Desde que te conozco', orden: 7, songId: '02' },
  { id: '02-8', texto: 'Solo pienso en ser tu lady', orden: 8, songId: '02' },
  { id: '02-9', texto: 'Llego en corto, estate atento', orden: 9, songId: '02' },
  { id: '02-10', texto: 'Soy tan porno que ensayo mis movimientos', orden: 10, songId: '02' },
  { id: '02-11', texto: 'Sé muy bien lo que quiero de ti', orden: 11, songId: '02' },
  { id: '02-12', texto: 'Rosas de cristal que no se rompan', orden: 12, songId: '02' },
  { id: '02-13', texto: 'Que cuando sea el verano', orden: 13, songId: '02' },
  { id: '02-14', texto: 'Seamos la luna que el océano corta', orden: 14, songId: '02' },
  { id: '02-15', texto: 'Noche corta para regalarnos tanto amor', orden: 15, songId: '02' },
  { id: '02-16', texto: 'Lo sabes tú bien', orden: 16, songId: '02' },
  { id: '02-17', texto: 'Que yo te traigo el cowboy, Rolls-Royce', orden: 17, songId: '02' },
  { id: '02-18', texto: 'Todo lo que quieras, papi', orden: 18, songId: '02' },
  { id: '02-19', texto: 'Aunque esté en el campo tengo wifi', orden: 19, songId: '02' },
  { id: '02-20', texto: 'Hacemos sexting a kilómetros de ti', orden: 20, songId: '02' },
  { id: '02-21', texto: 'Cabalgando mi potro', orden: 21, songId: '02' },
];

const SONG_03: LineaCancion[] = [
  { id: '03-1', texto: 'Ayer saliste a tomarla', orden: 1, songId: '03' },
  { id: '03-2', texto: 'Y justo fue luna llena', orden: 2, songId: '03' },
  { id: '03-3', texto: 'Qué bueno que es luna llena', orden: 3, songId: '03' },
  { id: '03-4', texto: 'Otra vez es luna llena', orden: 4, songId: '03' },
  { id: '03-5', texto: "Tú le contagias tu baile a to' el que te mira", orden: 5, songId: '03' },
  { id: '03-6', texto: 'Eres dura como calle, cara como gasolina', orden: 6, songId: '03' },
  { id: '03-7', texto: 'Noto química en el aire, Miss Catalina', orden: 7, songId: '03' },
  { id: '03-8', texto: 'Cuando dices que te vas, sé que te quedas en la esquina', orden: 8, songId: '03' },
  { id: '03-9', texto: 'Dices que a mí no me vendes tu amor', orden: 9, songId: '03' },
  { id: '03-10', texto: 'Me regalas tu amor', orden: 10, songId: '03' },
  { id: '03-11', texto: 'Que me quieras es una bomba de amor', orden: 11, songId: '03' },
  { id: '03-12', texto: 'Una bomba', orden: 12, songId: '03' },
  { id: '03-13', texto: 'Quiero morderte esa bemba fuera de liga', orden: 13, songId: '03' },
  { id: '03-14', texto: 'No hay manera de que algo tú me pidas', orden: 14, songId: '03' },
  { id: '03-15', texto: 'Y yo, por conseguirlo, no me juegue hasta la vida', orden: 15, songId: '03' },
  { id: '03-16', texto: 'Eres divina al natural, crudita yo te como', orden: 16, songId: '03' },
  { id: '03-17', texto: 'Sin limón y sal', orden: 17, songId: '03' },
  { id: '03-18', texto: 'Qué bonito sería hacerte el amor', orden: 18, songId: '03' },
  { id: '03-19', texto: 'Quiero hacerte el amor', orden: 19, songId: '03' },
  { id: '03-20', texto: 'Que me quieras es una bomba de amor', orden: 20, songId: '03' },
];

const SONG_04: LineaCancion[] = [
  { id: '04-1', texto: 'Yo daría por ti más de lo que tengo', orden: 1, songId: '04' },
  { id: '04-2', texto: 'Tenerte nunca eso no pretendo', orden: 2, songId: '04' },
  { id: '04-3', texto: 'Cero dudas tiene mi corazón', orden: 3, songId: '04' },
  { id: '04-4', texto: 'Si después de tantos años sigue vivo el amor', orden: 4, songId: '04' },
  { id: '04-5', texto: 'Ven, dame la mano, vamos a un lugar mejor', orden: 5, songId: '04' },
  { id: '04-6', texto: 'Yo soy la tierra, tú eres el conquistador', orden: 6, songId: '04' },
  { id: '04-7', texto: 'Yo me voy al cielo a buscar a tu abuelo', orden: 7, songId: '04' },
  { id: '04-8', texto: "Pa' que duerma a tu lado, mi amor", orden: 8, songId: '04' },
  { id: '04-9', texto: 'Te veo atrás, baby tú atrás', orden: 9, songId: '04' },
  { id: '04-10', texto: 'Y ya no veo el final', orden: 10, songId: '04' },
  { id: '04-11', texto: "Pa' volver a empezar las dos con un poco de madera", orden: 11, songId: '04' },
  { id: '04-12', texto: 'Tenemos tumba para dos', orden: 12, songId: '04' },
  { id: '04-13', texto: 'Para dos, para dos ah-ah', orden: 13, songId: '04' },
  { id: '04-14', texto: 'Una con forma de corazón', orden: 14, songId: '04' },
  { id: '04-15', texto: 'Una donde quepamos dos', orden: 15, songId: '04' },
  { id: '04-16', texto: 'Una tumba donde estar tumba-dos', orden: 16, songId: '04' },
  { id: '04-17', texto: 'Con los huesos fríos como hela-dos', orden: 17, songId: '04' },
  { id: '04-18', texto: 'Como tras la guerra dos solda-dos', orden: 18, songId: '04' },
  { id: '04-19', texto: 'Por azar, como quien tira dados', orden: 19, songId: '04' },
  { id: '04-20', texto: 'Lo hemos perdido todo hasta el espacio-tiempo', orden: 20, songId: '04' },
];

const SONG_05: LineaCancion[] = [
  { id: '05-1', texto: 'Me quedo pensando, yo no sé', orden: 1, songId: '05' },
  { id: '05-2', texto: 'Creo que sigo vivo, no lo sé', orden: 2, songId: '05' },
  { id: '05-3', texto: 'Esperando me dormí, yo qué sé', orden: 3, songId: '05' },
  { id: '05-4', texto: 'Si veré salir el sol, otra vez', orden: 4, songId: '05' },
  { id: '05-5', texto: 'No quiero sentirme sola y me dan', orden: 5, songId: '05' },
  { id: '05-6', texto: 'Mucho miedo las personas', orden: 6, songId: '05' },
  { id: '05-7', texto: 'Quizás simplemente deba irme, sin más', orden: 7, songId: '05' },
  { id: '05-8', texto: '¿Habrá algo para mí más allá?', orden: 8, songId: '05' },
  { id: '05-9', texto: 'Entre caminos opuestos', orden: 9, songId: '05' },
  { id: '05-10', texto: 'Ando hacia un futuro incierto', orden: 10, songId: '05' },
  { id: '05-11', texto: 'Es mi cru-u-u-uz', orden: 11, songId: '05' },
  { id: '05-12', texto: 'No sé si estoy vivo o muerto', orden: 12, songId: '05' },
  { id: '05-13', texto: 'Si estoy dormido o despierto', orden: 13, songId: '05' },
  { id: '05-14', texto: 'Si estoy en la oscuridad o en la lu-u-u-uz', orden: 14, songId: '05' },
  { id: '05-15', texto: 'Sabes que me quiero morir, honey', orden: 15, songId: '05' },
  { id: '05-16', texto: 'Y con las mismas ganas vivir, honey', orden: 16, songId: '05' },
  { id: '05-17', texto: 'Creo que después de todo me quedaré aquí', orden: 17, songId: '05' },
  { id: '05-18', texto: 'Intentando descifrar si soy real', orden: 18, songId: '05' },
  { id: '05-19', texto: 'Pellizcando cada poro de mi piel', orden: 19, songId: '05' },
  { id: '05-20', texto: 'Me pregunto cuánto tiempo pasará', orden: 20, songId: '05' },
];

const SONG_06: LineaCancion[] = [
  { id: '06-1', texto: 'Mi palabra favorita es iglú', orden: 1, songId: '06' },
  { id: '06-2', texto: 'Y el olor a lavanda', orden: 2, songId: '06' },
  { id: '06-3', texto: 'Te cuento de mi pasado, y tú, ni mu', orden: 3, songId: '06' },
  { id: '06-4', texto: 'Ni una palabra', orden: 4, songId: '06' },
  { id: '06-5', texto: 'Mi animal preferido', orden: 5, songId: '06' },
  { id: '06-6', texto: 'Si quieres, yo te lo digo', orden: 6, songId: '06' },
  { id: '06-7', texto: 'Con una condición', orden: 7, songId: '06' },
  { id: '06-8', texto: 'Quiero verte sorprendido', orden: 8, songId: '06' },
  { id: '06-9', texto: 'Es un okapi, mitad zebra, mitad Bambi', orden: 9, songId: '06' },
  { id: '06-10', texto: 'Me gustaría saber tocar el arpa', orden: 10, songId: '06' },
  { id: '06-11', texto: 'Y todos los instrumentos', orden: 11, songId: '06' },
  { id: '06-12', texto: 'Me gusta la música porque me acompaña', orden: 12, songId: '06' },
  { id: '06-13', texto: 'En lo que siento', orden: 13, songId: '06' },
  { id: '06-14', texto: 'Años atrás me daban pataletas', orden: 14, songId: '06' },
  { id: '06-15', texto: 'Con los demás, pero nunca con mi abuela', orden: 15, songId: '06' },
  { id: '06-16', texto: 'Y ahora que soy mayor, estoy haciendo la maleta', orden: 16, songId: '06' },
  { id: '06-17', texto: 'Para irme a un lugar donde nadie me vea', orden: 17, songId: '06' },
  { id: '06-18', texto: 'Aúllo a la luna y miro las estrellas', orden: 18, songId: '06' },
  { id: '06-19', texto: 'Porque si de alguien soy', orden: 19, songId: '06' },
  { id: '06-20', texto: 'Yo soy de ellas', orden: 20, songId: '06' },
];

const SONG_07: LineaCancion[] = [
  { id: '07-1', texto: 'No sé en qué momento dejé de ser yo', orden: 1, songId: '07' },
  { id: '07-2', texto: 'La luna me mira', orden: 2, songId: '07' },
  { id: '07-3', texto: 'Como si supiera algo de mí que yo olvidé', orden: 3, songId: '07' },
  { id: '07-4', texto: 'Me acerco a ella y siento frío', orden: 4, songId: '07' },
  { id: '07-5', texto: 'Pero se abre un camino brillante', orden: 5, songId: '07' },
  { id: '07-6', texto: 'Donde cada sombra me devuelve luz', orden: 6, songId: '07' },
  { id: '07-7', texto: 'Si cruzo este umbral', orden: 7, songId: '07' },
  { id: '07-8', texto: 'Ya no hay vuelta atrás', orden: 8, songId: '07' },
];

const SONG_08: LineaCancion[] = [
  { id: '08-1', texto: 'Todos quieren que sea de una manera', orden: 1, songId: '08' },
  { id: '08-2', texto: 'Si estoy contento o contenta, eso ya se verá', orden: 2, songId: '08' },
  { id: '08-3', texto: 'De momento me queda sonrisita perfecta', orden: 3, songId: '08' },
  { id: '08-4', texto: 'Minifalda vaquera y todo lo demás', orden: 4, songId: '08' },
  { id: '08-5', texto: 'Curiosidad levanto', orden: 5, songId: '08' },
  { id: '08-6', texto: 'En un mundo binario, real pero falso', orden: 6, songId: '08' },
  { id: '08-7', texto: 'Paso del negro o blanco', orden: 7, songId: '08' },
  { id: '08-8', texto: 'He cruzado de acera, he cambiado de barrio', orden: 8, songId: '08' },
  { id: '08-9', texto: 'Qué pereza me da', orden: 9, songId: '08' },
  { id: '08-10', texto: 'No quiero ser ejemplar, voy a contracorriente', orden: 10, songId: '08' },
  { id: '08-11', texto: 'Porque a mí me da igual, complacer a la gente', orden: 11, songId: '08' },
  { id: '08-12', texto: "Quieren etiquetarme pa' que sea uno más", orden: 12, songId: '08' },
  { id: '08-13', texto: 'Yo me siento mitad', orden: 13, songId: '08' },
  { id: '08-14', texto: '¿Cómo quieres que quepa en cualquier sistema?', orden: 14, songId: '08' },
  { id: '08-15', texto: 'Y solo me sostenga la oscuridad', orden: 15, songId: '08' },
  { id: '08-16', texto: 'De este planeta que solo se enferma', orden: 16, songId: '08' },
  { id: '08-17', texto: 'Junto con sus mentes, miedo me da', orden: 17, songId: '08' },
  { id: '08-18', texto: "Quieren etiquetarme pa' que sea uno más", orden: 18, songId: '08' },
  { id: '08-19', texto: 'Jamás', orden: 19, songId: '08' },
];

const SONG_09: LineaCancion[] = [
  { id: '09-1', texto: "Necesito fumar algo bueno pa'l corazón", orden: 1, songId: '09' },
  { id: '09-2', texto: 'No me meto en la piscina por si hay un tiburón', orden: 2, songId: '09' },
  { id: '09-3', texto: 'No me fío de mí si hasta a la doctora le miento', orden: 3, songId: '09' },
  { id: '09-4', texto: 'Y por nada dejo todo lo que tengo', orden: 4, songId: '09' },
  { id: '09-5', texto: 'Tengo un gato de carreras y un caballo siamés', orden: 5, songId: '09' },
  { id: '09-6', texto: 'Tengo ganas de ir a Cuba para hablar en japonés', orden: 6, songId: '09' },
  { id: '09-7', texto: 'Tengo la puta regla todos los días del mes', orden: 7, songId: '09' },
  { id: '09-8', texto: 'Tengo una amiga ciega que ve más de lo que ves', orden: 8, songId: '09' },
  { id: '09-9', texto: 'Porque estamos aquí pero estamos pallá', orden: 9, songId: '09' },
  { id: '09-10', texto: 'Todo lo que hago te hace gracia', orden: 10, songId: '09' },
  { id: '09-11', texto: 'Y a mí tu risa se me contagia', orden: 11, songId: '09' },
  { id: '09-12', texto: 'Estamos conectados, eso es magia', orden: 12, songId: '09' },
  { id: '09-13', texto: 'Un avión en piloto automático', orden: 13, songId: '09' },
  { id: '09-14', texto: 'Tú por mi persona estás lunático', orden: 14, songId: '09' },
  { id: '09-15', texto: 'Y yo por la tuya, eso es mágico', orden: 15, songId: '09' },
  { id: '09-16', texto: 'Una navaja de seda, algo caliente en la nevera', orden: 16, songId: '09' },
  { id: '09-17', texto: 'Cosas sin explicación, son todo lo que tengo', orden: 17, songId: '09' },
  { id: '09-18', texto: 'Tengo miedo del rugido de un diente de león', orden: 18, songId: '09' },
  { id: '09-19', texto: 'De mascota un arcoíris de color marrón', orden: 19, songId: '09' },
  { id: '09-20', texto: 'Tengo ganas de viajar en diagonal en ascensor', orden: 20, songId: '09' },
];

const SONG_10: LineaCancion[] = [
  { id: '10-1', texto: "It's not death what I'm afraid of", orden: 1, songId: '10' },
  { id: '10-2', texto: 'Feels nice when you slow down', orden: 2, songId: '10' },
  { id: '10-3', texto: 'Then you hit the ground, honey', orden: 3, songId: '10' },
  { id: '10-4', texto: "It's not fair 'cause you're an angel", orden: 4, songId: '10' },
  { id: '10-5', texto: "I'm sad but I know now", orden: 5, songId: '10' },
  { id: '10-6', texto: "You've got to go, honey", orden: 6, songId: '10' },
  { id: '10-7', texto: "It's never the time to let go, stop", orden: 7, songId: '10' },
  { id: '10-8', texto: "You're breaking my heart like LEGO", orden: 8, songId: '10' },
  { id: '10-9', texto: 'Even if I knew before we met, I would have met you', orden: 9, songId: '10' },
  { id: '10-10', texto: 'You and me will last forever, baby we are meant to', orden: 10, songId: '10' },
  { id: '10-11', texto: 'A-N-G-E-L, I will always be your friend', orden: 11, songId: '10' },
  { id: '10-12', texto: 'When you miss me call my name', orden: 12, songId: '10' },
  { id: '10-13', texto: 'I will always be your friend', orden: 13, songId: '10' },
  { id: '10-14', texto: "Guess I'll see you back in hell", orden: 14, songId: '10' },
  { id: '10-15', texto: "And I guess that I won't see your face", orden: 15, songId: '10' },
  { id: '10-16', texto: 'After keeping you safe from the bonfire', orden: 16, songId: '10' },
  { id: '10-17', texto: 'Now that I made my way', orden: 17, songId: '10' },
  { id: '10-18', texto: "You'll be missing the days", orden: 18, songId: '10' },
  { id: '10-19', texto: 'Que te cuidé, sin poder cuidarte', orden: 19, songId: '10' },
  { id: '10-20', texto: 'Ahora me toca hacerme un té sin tu miel', orden: 20, songId: '10' },
];

const SONG_11: LineaCancion[] = [
  { id: '11-1', texto: 'Y ya estamos en abril', orden: 1, songId: '11' },
  { id: '11-2', texto: 'Queda mucho por sufrir', orden: 2, songId: '11' },
  { id: '11-3', texto: 'Cada abril yo me acuerdo de ti', orden: 3, songId: '11' },
  { id: '11-4', texto: 'Cada nit, sí cada nit', orden: 4, songId: '11' },
  { id: '11-5', texto: 'Que no estás, junto a mí', orden: 5, songId: '11' },
  { id: '11-6', texto: 'Con una sonrisa, Carmen', orden: 6, songId: '11' },
  { id: '11-7', texto: 'Como para olvidarte no me hicieron a mí', orden: 7, songId: '11' },
  { id: '11-8', texto: 'Ni valiente ni cobarde', orden: 8, songId: '11' },
  { id: '11-9', texto: 'Arte hasta para morir', orden: 9, songId: '11' },
  { id: '11-10', texto: "Ojalá tuvieras alas, pa' volar sobre Madrid", orden: 10, songId: '11' },
  { id: '11-11', texto: 'Vuela alto, vuela libre, mi pequeño colibrí', orden: 11, songId: '11' },
  { id: '11-12', texto: 'Fue tu pecado de artista morir a los 27', orden: 12, songId: '11' },
  { id: '11-13', texto: 'Lo que no acabaste en vida', orden: 13, songId: '11' },
  { id: '11-14', texto: 'Acabarán los que te quieren', orden: 14, songId: '11' },
  { id: '11-15', texto: 'Una pena que sufrieras, como todas las mujeres', orden: 15, songId: '11' },
  { id: '11-16', texto: 'Dicen que eras una joya y una joya nunca muere', orden: 16, songId: '11' },
];

const SONG_12: LineaCancion[] = [
  { id: '12-1', texto: 'Hoy te he conocido', orden: 1, songId: '12' },
  { id: '12-2', texto: 'Y te he besado, porqué me has gustado tanto', orden: 2, songId: '12' },
  { id: '12-3', texto: 'Pero en la lluvia, donde no se ve mi llanto', orden: 3, songId: '12' },
  { id: '12-4', texto: 'He corrido, huyendo de ti', orden: 4, songId: '12' },
  { id: '12-5', texto: 'La simple idea de volver a amar', orden: 5, songId: '12' },
  { id: '12-6', texto: 'Es como zarpar en barco', orden: 6, songId: '12' },
  { id: '12-7', texto: 'A otra isla con otro cuarto', orden: 7, songId: '12' },
  { id: '12-8', texto: 'Cuando en el mío es que yo canto', orden: 8, songId: '12' },
  { id: '12-9', texto: 'Hoy te he sentido', orden: 9, songId: '12' },
  { id: '12-10', texto: 'Como un disparo, dulce y amargo', orden: 10, songId: '12' },
  { id: '12-11', texto: 'Y aunque tus ojos no me hagan daño', orden: 11, songId: '12' },
  { id: '12-12', texto: 'Todavía escucho un eco pasado', orden: 12, songId: '12' },
  { id: '12-13', texto: 'Y no es tu culpa si me enredo en sombras', orden: 13, songId: '12' },
  { id: '12-14', texto: 'Si cada abrazo me desordena', orden: 14, songId: '12' },
  { id: '12-15', texto: 'Si cada paso me lleva a un lugar del cuál ya no salgo', orden: 15, songId: '12' },
  { id: '12-16', texto: 'Pero si esperas y no me nombras', orden: 16, songId: '12' },
  { id: '12-17', texto: 'Quizá regrese una de estas olas', orden: 17, songId: '12' },
  { id: '12-18', texto: 'Quizá despierte y ya no huya de lo que me asombra', orden: 18, songId: '12' },
];

const SONG_13: LineaCancion[] = [
  { id: '13-1', texto: 'Pensé que la noche iba a quedarse para siempre', orden: 1, songId: '13' },
  { id: '13-2', texto: 'Pero la luna, antes de irse me enseñó un truco', orden: 2, songId: '13' },
  { id: '13-3', texto: 'Incluso el hielo más duro', orden: 3, songId: '13' },
  { id: '13-4', texto: 'Cambia de forma cuando lo tocas con verdad', orden: 4, songId: '13' },
  { id: '13-5', texto: 'Siento algo nuevo, algo bueno', orden: 5, songId: '13' },
  { id: '13-6', texto: 'Como si el mundo por fin me hiciera hueco', orden: 6, songId: '13' },
  { id: '13-7', texto: 'Soy luz, soy magia', orden: 7, songId: '13' },
  { id: '13-8', texto: 'Soy Luna y ahora sí estoy lista', orden: 8, songId: '13' },
];

const SONG_14: LineaCancion[] = [
  { id: '14-1', texto: 'No queda tequila en la botella', orden: 1, songId: '14' },
  { id: '14-2', texto: 'Ni me quedan pilas para ella', orden: 2, songId: '14' },
  { id: '14-3', texto: 'No quiero que pienses que tú-tururú', orden: 3, songId: '14' },
  { id: '14-4', texto: 'Cuando por mi parte, na-na-ná', orden: 4, songId: '14' },
  { id: '14-5', texto: 'Si me pillo de ti no te pases', orden: 5, songId: '14' },
  { id: '14-6', texto: 'Si te pillas de mí no te cases', orden: 6, songId: '14' },
  { id: '14-7', texto: 'Las relaciones son como los compases', orden: 7, songId: '14' },
  { id: '14-8', texto: 'Están para romperse está escrito en las bases', orden: 8, songId: '14' },
  { id: '14-9', texto: 'No tengo filtros, tengo frases', orden: 9, songId: '14' },
  { id: '14-10', texto: 'Barras como panes que por desgracia', orden: 10, songId: '14' },
  { id: '14-11', texto: 'No te quitan el hambre', orden: 11, songId: '14' },
  { id: '14-12', texto: 'Sigo enferma, pero no me rindo', orden: 12, songId: '14' },
  { id: '14-13', texto: 'Tú intentas imitarme, pero no sigues el ritmo', orden: 13, songId: '14' },
  { id: '14-14', texto: 'He vivido buenos momentos', orden: 14, songId: '14' },
  { id: '14-15', texto: 'Que ahora no recuerdo, soy Memento', orden: 15, songId: '14' },
  { id: '14-16', texto: 'Estoy ocupado, por supuesto', orden: 16, songId: '14' },
  { id: '14-17', texto: 'Haciendo un huevo duro que no llega ni a revuelto', orden: 17, songId: '14' },
  { id: '14-18', texto: 'Soy un pringao lo acepto, llevo años en esto', orden: 18, songId: '14' },
  { id: '14-19', texto: 'Y es que soy un experto en causar efecto', orden: 19, songId: '14' },
  { id: '14-20', texto: 'Porque soy muy rara', orden: 20, songId: '14' },
];

const SONG_15: LineaCancion[] = [
  { id: '15-1', texto: 'Cada día me despierto y me sorprende estar aquí', orden: 1, songId: '15' },
  { id: '15-2', texto: 'Como si fuera un regalo que se olvidaron de abrir', orden: 2, songId: '15' },
  { id: '15-3', texto: 'El reloj nunca descansa y yo tampoco sé dormir', orden: 3, songId: '15' },
  { id: '15-4', texto: 'Si las horas se me escapan las detengo al escribir', orden: 4, songId: '15' },
  { id: '15-5', texto: 'En el espejo, un reflejo que no es el de ayer', orden: 5, songId: '15' },
  { id: '15-6', texto: 'Y aunque el tiempo sea poco, reclamarlo es mi poder', orden: 6, songId: '15' },
  { id: '15-7', texto: 'Todo es tiempo prestado, un segundo en tus manos', orden: 7, songId: '15' },
  { id: '15-8', texto: 'Un latido robado que se va sin avisar', orden: 8, songId: '15' },
  { id: '15-9', texto: 'Y aunque todo se acabe, aunque nada se guarde', orden: 9, songId: '15' },
  { id: '15-10', texto: 'Si me queda este instante, ya no me importa el final', orden: 10, songId: '15' },
  { id: '15-11', texto: "No me asusta la caída, ni perder lo que he ganao'", orden: 11, songId: '15' },
  { id: '15-12', texto: "Me da miedo lo callado lo que guardo con candao'", orden: 12, songId: '15' },
  { id: '15-13', texto: 'Y si mañana me apago, aquí dejo grabado', orden: 13, songId: '15' },
  { id: '15-14', texto: "Que sobrevivir yo he intentao'", orden: 14, songId: '15' },
  { id: '15-15', texto: 'Si me toca irme pronto, liberen mis canciones', orden: 15, songId: '15' },
  { id: '15-16', texto: 'Sin ellas no soy nada y ellas son tanto sin mí', orden: 16, songId: '15' },
  { id: '15-17', texto: 'Por favor, no me llores, espero que perdones', orden: 17, songId: '15' },
  { id: '15-18', texto: 'Que algún día existí y otro dejé de existir', orden: 18, songId: '15' },
];

export const ALL_SONGS: Cancion[] = [
  { id: '01', nombre: 'No Soy Diosa', publicada: true, lineas: SONG_01 },
  { id: '02', nombre: 'Tu Lady', publicada: true, lineas: SONG_02 },
  { id: '03', nombre: 'Bomba de Amor', publicada: true, lineas: SONG_03 },
  { id: '04', nombre: 'Para 2', publicada: true, lineas: SONG_04 },
  { id: '05', nombre: 'Honey', publicada: true, lineas: SONG_05 },
  { id: '06', nombre: 'Iglú', publicada: false, lineas: SONG_06 },
  { id: '07', nombre: 'Luna Nueva', publicada: false, lineas: SONG_07 },
  { id: '08', nombre: 'Voy a Contracorriente', publicada: false, lineas: SONG_08 },
  { id: '09', nombre: 'Magia', publicada: false, lineas: SONG_09 },
  { id: '10', nombre: 'A-N-G-E-L', publicada: false, lineas: SONG_10 },
  { id: '11', nombre: 'Abril', publicada: false, lineas: SONG_11 },
  { id: '12', nombre: 'En la lluvia', publicada: false, lineas: SONG_12 },
  { id: '13', nombre: 'Luna Llena', publicada: false, lineas: SONG_13 },
  { id: '14', nombre: 'TEKiLA', publicada: false, lineas: SONG_14 },
  { id: '15', nombre: 'Tiempo Prestado', publicada: false, lineas: SONG_15 },
];

// Fisher-Yates shuffle algorithm
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
