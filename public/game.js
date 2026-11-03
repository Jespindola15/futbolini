/* Picadito Pixel · juego completo (motor, dibujo, menús, torneos, online) */
'use strict';
/* =====================================================================
   DATA — equipos, camisetas y jugadores (pack de datos, separado del juego)
   st = [velocidad, aceleración, tiro, control, fuerza]
   ===================================================================== */
const SKIN=['#F3CBA5','#DDA77E','#B07A50','#7A4B2C'];
// pelo: n negro · c castaño · r castaño claro · b rubio · p colorado · g canoso
const HAIR={n:'#15100c',c:'#3a2415',r:'#7a4a22',b:'#c99a4a',p:'#a5482a',g:'#9a9a9a'};
// Camiseta: color principal, secundario, diseño, short, medias, número (+ opciones)
// Diseños: solid, vstripes (bastones), hband (franja), sash (banda), halves (mitades), vee (V), vband (franja vertical)
function K(p,s,pat,shorts,socks,num,o){return Object.assign({p,s,pat,sleeve:p,shorts,socks,num,collar:s===p?num:s},o||{});}
function lum(h){const v=parseInt(h.slice(1),16);return 0.3*(v>>16)+0.59*((v>>8)&255)+0.11*(v&255);}
function autoAlt(k){return lum(k.p)>150?{p:'#1C2440',s:'#2C3A66',pat:'solid',sleeve:'#1C2440',shorts:'#1C2440',socks:'#1C2440',num:'#F4F4F2',collar:k.p}:{p:'#F4F4F2',s:'#F4F4F2',pat:'solid',sleeve:'#F4F4F2',shorts:'#F4F4F2',socks:'#F4F4F2',num:k.p,collar:k.p};}
// Jugador: nombre, número, [velocidad, aceleración, tiro, control, fuerza], piel 0-3, pelo
function J(n,num,st,skin,hair){return{n,num,st,skin:skin||0,hair:HAIR[hair||'n']};}
// Arquero: nombre, número, reflejos, alcance, color de buzo
function G(n,num,refl,reach,kit,skin,hair){return{n,num,refl,reach,kit,skin:skin||0,hair:HAIR[hair||'n']};}
function T(cat,id,name,abbr,kit,gk,players,alt){return{cat,id,name,abbr,kit,alt:alt||autoAlt(kit),gk,players};}

const CATS=[
 {id:'sel',name:'Selecciones'},
 {id:'arg',name:'Liga Argentina'},
 {id:'sud',name:'Sudamérica'},
 {id:'pre',name:'Premier League'},
 {id:'lal',name:'LaLiga'},
 {id:'ser',name:'Serie A'},
 {id:'eur',name:'Resto de Europa'},
 {id:'ley',name:'Leyendas'}
];

const TEAMS=[
 /* ---------------- SELECCIONES ---------------- */
 T('sel','arg','Argentina','ARG',K('#7DB9E8','#FFFFFF','vstripes','#16161B','#FFFFFF','#16161B',{sleeve:'#FFFFFF',collar:'#16161B'}),
  G('E. Martínez',23,86,86,'#C6F04F',0,'n'),
  [J('Messi',10,[82,90,90,96,62],0,'c'),J('J. Álvarez',9,[85,87,86,85,74],0,'n'),J('Lautaro',22,[82,84,88,84,82],1,'n'),J('E. Fernández',24,[74,76,82,86,74],0,'c'),J('Mac Allister',20,[72,75,82,87,72],0,'r')],
  {p:'#1F2B52',s:'#2D3E73',pat:'solid',sleeve:'#1F2B52',shorts:'#1F2B52',socks:'#1F2B52',num:'#7DB9E8',collar:'#7DB9E8'}),
 T('sel','bra','Brasil','BRA',K('#FFD60A','#0F8A3C','solid','#1D4CB3','#FFFFFF','#0F8A3C'),
  G('Alisson',1,88,88,'#E7484B',0,'c'),
  [J('Vinícius Jr',7,[95,94,84,90,66],3,'n'),J('Raphinha',11,[88,88,85,86,66],1,'n'),J('Rodrygo',10,[88,90,83,87,62],2,'n'),J('B. Guimarães',8,[70,74,78,86,78],1,'n')],
  {p:'#1D4CB3',s:'#FFD60A',pat:'solid',sleeve:'#1D4CB3',shorts:'#FFFFFF',socks:'#1D4CB3',num:'#FFD60A',collar:'#FFD60A'}),
 T('sel','fra','Francia','FRA',K('#1C2753','#1C2753','solid','#FFFFFF','#D7262E','#FFFFFF',{collar:'#D7262E'}),
  G('Maignan',16,87,85,'#F28C28',3,'n'),
  [J('Mbappé',10,[97,96,91,90,78],2,'n'),J('Dembélé',11,[92,93,85,89,62],3,'n'),J('Tchouaméni',8,[72,74,78,82,86],3,'n'),J('Saliba',17,[80,74,55,78,88],3,'n')]),
 T('sel','esp','España','ESP',K('#C8102E','#C8102E','solid','#0E1E4A','#0E1E4A','#FFC400',{collar:'#FFC400'}),
  G('Unai Simón',23,84,84,'#2BB0A8',0,'n'),
  [J('Lamine Yamal',19,[88,90,84,92,58],2,'n'),J('Nico Williams',17,[93,94,80,87,64],3,'n'),J('Pedri',20,[72,80,76,92,60],0,'c'),J('Rodri',16,[66,70,80,90,84],0,'c')]),
 T('sel','eng','Inglaterra','ING',K('#F4F4F2','#F4F4F2','solid','#1A2A57','#F4F4F2','#1A2A57',{collar:'#1A2A57'}),
  G('Pickford',1,83,80,'#9C4DE0',0,'b'),
  [J('Kane',9,[70,72,94,86,84],0,'c'),J('Bellingham',10,[80,82,85,88,84],2,'n'),J('Saka',7,[86,88,84,88,66],3,'n'),J('Rice',4,[76,76,76,82,86],0,'c')],
  {p:'#C4161C',s:'#C4161C',pat:'solid',sleeve:'#C4161C',shorts:'#C4161C',socks:'#C4161C',num:'#F4F4F2',collar:'#F4F4F2'}),
 T('sel','ale','Alemania','ALE',K('#F4F4F2','#F4F4F2','solid','#16161B','#F4F4F2','#16161B',{collar:'#16161B'}),
  G('Ter Stegen',1,85,84,'#2DB34A',0,'b'),
  [J('Musiala',10,[85,90,84,93,62],1,'c'),J('Wirtz',17,[82,86,85,93,62],0,'c'),J('Havertz',7,[78,78,84,86,78],0,'c'),J('Kimmich',6,[72,76,80,88,72],0,'b')]),
 T('sel','por','Portugal','POR',K('#C8102E','#0B6E3A','solid','#0B6E3A','#C8102E','#F2C200',{collar:'#0B6E3A'}),
  G('Diogo Costa',1,85,84,'#F2C200',0,'n'),
  [J('C. Ronaldo',7,[80,78,92,86,80],1,'n'),J('B. Fernandes',8,[74,78,87,90,70],0,'c'),J('Bernardo Silva',10,[76,84,80,92,58],0,'c'),J('Rafael Leão',17,[94,90,83,87,76],3,'n')]),
 T('sel','uru','Uruguay','URU',K('#5CBFEB','#5CBFEB','solid','#16161B','#16161B','#16161B',{collar:'#16161B'}),
  G('Rochet',1,82,82,'#F28C28',0,'c'),
  [J('Valverde',15,[86,84,86,86,84],0,'c'),J('Darwin Núñez',19,[92,86,85,78,84],1,'n'),J('De Arrascaeta',10,[74,82,84,90,60],0,'n'),J('Araújo',4,[84,78,56,74,90],3,'n')]),
 T('sel','ned','Países Bajos','HOL',K('#F36C21','#F36C21','solid','#F36C21','#F36C21','#16161B',{collar:'#16161B'}),
  G('Verbruggen',1,82,83,'#8BC34A',0,'b'),
  [J('Gakpo',11,[86,84,84,86,76],1,'n'),J('Xavi Simons',7,[84,88,82,89,58],1,'n'),J('F. de Jong',21,[76,80,74,91,70],0,'c'),J('Van Dijk',4,[76,70,64,82,94],2,'n')]),
 T('sel','ita','Italia','ITA',K('#0066B3','#0066B3','solid','#FFFFFF','#0066B3','#FFFFFF',{collar:'#FFFFFF'}),
  G('Donnarumma',1,88,90,'#F2C200',0,'n'),
  [J('Barella',18,[80,82,80,88,72],0,'n'),J('Tonali',8,[76,78,80,86,78],0,'c'),J('Retegui',19,[78,78,86,80,80],0,'c'),J('Kean',20,[88,84,84,80,82],3,'n')]),
 T('sel','col','Colombia','COL',K('#FCD116','#FCD116','solid','#1A2A57','#C8102E','#1A2A57',{collar:'#1A2A57'}),
  G('C. Vargas',12,82,82,'#2BB0A8',1,'n'),
  [J('James',10,[66,70,86,92,62],1,'n'),J('Luis Díaz',7,[92,94,82,88,66],2,'n'),J('Jhon Arias',11,[84,86,78,86,64],3,'n'),J('Jhon Durán',9,[84,82,86,78,84],2,'n')]),

 /* ---------------- LIGA ARGENTINA ---------------- */
 T('arg','riv','River Plate','RIV',K('#F4F4F2','#D71920','sash','#16161B','#F4F4F2','#16161B'),
  G('Armani',1,82,82,'#2F9E44',0,'n'),
  [J('Quintero',10,[64,72,86,92,60],1,'n'),J('Colidio',11,[84,84,80,82,70],0,'c'),J('Driussi',15,[78,80,84,84,70],0,'c'),J('Salas',7,[86,84,80,80,64],0,'n'),J('Montiel',4,[80,78,70,78,76],0,'n')],
  {p:'#D71920',s:'#16161B',pat:'sash',sleeve:'#D71920',shorts:'#D71920',socks:'#D71920',num:'#F4F4F2',collar:'#16161B'}),
 T('arg','boc','Boca Juniors','BOC',K('#0A2D7A','#F5C400','hband','#0A2D7A','#0A2D7A','#F5C400'),
  G('Marchesín',1,80,80,'#7A7A7A',0,'c'),
  [J('Paredes',5,[66,70,82,88,76],0,'n'),J('Cavani',10,[72,72,86,80,80],0,'c'),J('Merentiel',16,[84,84,80,80,72],1,'n'),J('Zeballos',7,[90,92,76,84,58],0,'n'),J('Advíncula',17,[90,86,66,76,74],3,'n')],
  {p:'#F5C400',s:'#0A2D7A',pat:'hband',sleeve:'#F5C400',shorts:'#F5C400',socks:'#F5C400',num:'#0A2D7A',collar:'#0A2D7A'}),
 T('arg','rac','Racing Club','RAC',K('#7DC4EA','#FFFFFF','vstripes','#16161B','#FFFFFF','#16161B',{collar:'#16161B'}),
  G('G. Arias',21,82,82,'#F28C28',0,'n'),
  [J('Maravilla Martínez',9,[76,74,86,78,84],0,'n'),J('Solari',7,[86,84,78,82,66],0,'c'),J('Almendra',10,[70,74,80,88,66],0,'c'),J('Martirena',2,[84,80,66,74,72],0,'c')]),
 T('arg','ind','Independiente','IND',K('#D0021B','#D0021B','solid','#0A2D7A','#D0021B','#FFFFFF',{collar:'#FFFFFF'}),
  G('R. Rey',33,80,80,'#2F9E44',0,'c'),
  [J('Ávalos',9,[74,72,84,74,82],1,'n'),J('Cabral',10,[72,78,82,86,62],0,'c'),J('S. Montiel',7,[86,88,76,82,58],0,'n'),J('Marcone',23,[66,68,70,80,82],0,'c')]),
 T('arg','slo','San Lorenzo','CASLA',K('#0A2D7A','#D0021B','vstripes','#0A2D7A','#0A2D7A','#FFFFFF'),
  G('Gill',1,79,80,'#F2C200',0,'n'),
  [J('Vombergar',9,[72,70,84,74,82],0,'c'),J('Cerutti',7,[80,82,76,82,62],0,'n'),J('N. Barrios',10,[74,80,76,86,58],0,'c'),J('Romaña',3,[74,70,56,70,86],3,'n')]),
 T('arg','est','Estudiantes','EST',K('#E1001A','#FFFFFF','vstripes','#16161B','#16161B','#16161B'),
  G('Muslera',1,80,80,'#2BB0A8',0,'b'),
  [J('José Sosa',10,[62,66,80,88,66],0,'c'),J('G. Carrillo',9,[70,68,84,76,86],0,'n'),J('Ascacíbar',5,[72,74,68,80,82],0,'c'),J('Cetré',7,[88,90,78,82,62],2,'n')]),
 T('arg','vel','Vélez Sarsfield','VEL',K('#F4F4F2','#0A2D7A','vee','#0A2D7A','#F4F4F2','#0A2D7A'),
  G('Marchiori',1,80,81,'#F28C28',0,'c'),
  [J('Braian Romero',9,[76,78,84,78,72],0,'n'),J('Aquino',10,[70,74,82,88,62],0,'c'),J('Bouzat',8,[72,74,74,82,72],0,'c'),J('Elías Gómez',3,[80,78,66,76,72],0,'n')]),
 T('arg','cen','Rosario Central','CEN',K('#003DA5','#FFD100','vstripes','#003DA5','#003DA5','#FFD100'),
  G('Broun',1,81,81,'#2F9E44',0,'c'),
  [J('Di María',11,[80,84,86,92,58],0,'c'),J('Malcorra',10,[70,74,82,86,64],0,'c'),J('Campaz',7,[86,88,78,86,60],2,'n'),J('Copetti',9,[74,72,84,74,82],0,'n')]),
 T('arg','nob',"Newell's Old Boys",'NOB',K('#D0021B','#16161B','halves','#16161B','#16161B','#FFFFFF',{collar:'#16161B'}),
  G('Keylor Navas',1,84,82,'#2BB0A8',1,'n'),
  [J('Banega',10,[60,66,80,90,66],0,'c'),J('F. González',7,[84,86,74,82,58],0,'n'),J('A. Martino',3,[80,78,68,78,70],0,'c')]),
 T('arg','tal','Talleres','TAL',K('#0A2D7A','#FFFFFF','vstripes','#0A2D7A','#0A2D7A','#FFFFFF'),
  G('G. Herrera',22,82,80,'#F28C28',0,'c'),
  [J('Botta',10,[70,76,80,88,58],0,'c'),J('Girotti',9,[74,72,84,74,80],0,'c'),J('Depietri',7,[86,88,76,80,62],0,'n'),J('M. Galarza',5,[72,74,72,82,76],1,'n')]),

 /* ---------------- SUDAMÉRICA ---------------- */
 T('sud','fla','Flamengo','FLA',K('#C8102E','#16161B','hoops','#F4F4F2','#16161B','#F4F4F2',{collar:'#16161B'}),
  G('Rossi',1,84,82,'#2BB0A8',0,'c'),
  [J('De Arrascaeta',10,[74,82,84,90,60],0,'n'),J('Pedro',9,[76,74,88,82,80],1,'n'),J('Bruno Henrique',27,[88,86,82,80,74],3,'n'),J('Luiz Araújo',7,[84,86,78,84,58],1,'n'),J('Jorginho',21,[62,68,74,88,68],0,'c')]),
 T('sud','pal','Palmeiras','PAL',K('#006437','#006437','solid','#F4F4F2','#006437','#F4F4F2',{collar:'#F4F4F2'}),
  G('Weverton',21,82,82,'#F2C200',1,'n'),
  [J('Flaco López',42,[78,76,86,78,82],0,'c'),J('Vitor Roque',9,[88,88,84,80,74],2,'n'),J('R. Veiga',23,[70,74,84,88,64],0,'c'),J('A. Pereira',8,[74,78,80,86,66],0,'c'),J('F. Torres',17,[84,86,80,84,60],0,'n')]),
 T('sud','bot','Botafogo','BOT',K('#16161B','#F4F4F2','vstripes','#16161B','#16161B','#F4F4F2'),
  G('John',12,80,82,'#F28C28',2,'n'),
  [J('Savarino',10,[84,86,80,86,58],1,'n'),J('Arthur Cabral',9,[72,70,86,76,84],0,'c'),J('Alex Telles',13,[74,74,80,84,70],0,'c'),J('Marlon Freitas',17,[70,72,76,84,74],1,'n')]),
 T('sud','sao','São Paulo','SAO',K('#F4F4F2','#D0021B','hband','#F4F4F2','#F4F4F2','#16161B',{collar:'#16161B'}),
  G('Rafael',23,80,80,'#2F9E44',0,'c'),
  [J('Lucas Moura',7,[86,86,82,86,64],1,'n'),J('Calleri',9,[72,72,86,76,84],0,'c'),J('Oscar',8,[64,72,82,90,60],0,'c'),J('Luciano',10,[76,78,84,82,66],1,'n')]),

 /* ---------------- PREMIER LEAGUE ---------------- */
 T('pre','mci','Manchester City','MCI',K('#6CABDD','#6CABDD','solid','#FFFFFF','#6CABDD','#1C2C5B',{collar:'#1C2C5B'}),
  G('Donnarumma',25,88,90,'#F2C200',0,'n'),
  [J('Haaland',9,[88,82,94,80,90],0,'b'),J('Foden',47,[82,86,86,92,60],0,'c'),J('Rodri',16,[66,70,80,90,84],0,'c'),J('Doku',11,[93,95,76,88,64],3,'n')]),
 T('pre','ars','Arsenal','ARS',K('#EF0107','#EF0107','solid','#FFFFFF','#EF0107','#FFFFFF',{sleeve:'#FFFFFF',collar:'#FFFFFF'}),
  G('Raya',1,85,84,'#F2C200',0,'n'),
  [J('Saka',7,[86,88,84,88,66],3,'n'),J('Ødegaard',8,[74,80,84,93,60],0,'b'),J('Gyökeres',14,[86,82,90,78,90],0,'c'),J('Eze',10,[84,86,84,90,64],3,'n'),J('Rice',41,[76,76,76,82,86],0,'c')]),
 T('pre','liv','Liverpool','LIV',K('#C8102E','#C8102E','solid','#C8102E','#C8102E','#FFFFFF',{collar:'#FFFFFF'}),
  G('Alisson',1,88,88,'#2BB0A8',0,'c'),
  [J('Salah',11,[90,90,88,88,70],2,'n'),J('Wirtz',7,[82,86,85,93,62],0,'c'),J('Isak',9,[88,84,88,86,74],3,'n'),J('Mac Allister',10,[72,75,82,87,72],0,'r'),J('Van Dijk',4,[76,70,64,82,94],2,'n')]),
 T('pre','che','Chelsea','CHE',K('#034694','#034694','solid','#034694','#FFFFFF','#FFFFFF',{collar:'#FFFFFF'}),
  G('R. Sánchez',1,80,82,'#F2C200',0,'n'),
  [J('Palmer',10,[78,80,88,90,62],0,'b'),J('E. Fernández',8,[74,76,82,86,74],0,'c'),J('Caicedo',25,[76,78,70,82,84],2,'n'),J('João Pedro',20,[84,84,84,86,70],2,'n')]),
 T('pre','mun','Manchester United','MUN',K('#DA291C','#DA291C','solid','#FFFFFF','#16161B','#FFFFFF',{collar:'#16161B'}),
  G('Lammens',31,80,82,'#2F9E44',0,'b'),
  [J('B. Fernandes',8,[74,78,87,90,70],0,'c'),J('Mbeumo',19,[86,86,84,86,68],3,'n'),J('Cunha',10,[84,86,84,88,70],1,'n'),J('Šeško',30,[86,82,86,78,86],0,'c')]),
 T('pre','tot','Tottenham','TOT',K('#F4F4F2','#F4F4F2','solid','#132257','#F4F4F2','#132257',{collar:'#132257'}),
  G('Vicario',1,83,82,'#F28C28',0,'n'),
  [J('Xavi Simons',7,[84,88,82,89,58],1,'n'),J('Kudus',20,[88,88,82,88,72],3,'n'),J('Solanke',19,[80,78,82,80,80],3,'n'),J('Cuti Romero',17,[76,74,58,74,88],0,'c')]),
 T('pre','new','Newcastle','NEW',K('#16161B','#F4F4F2','vstripes','#16161B','#16161B','#F4F4F2'),
  G('Pope',1,83,84,'#F2C200',0,'c'),
  [J('B. Guimarães',39,[70,74,78,86,78],1,'n'),J('Gordon',10,[90,90,80,84,66],0,'c'),J('Tonali',8,[76,78,80,86,78],0,'c'),J('Woltemade',27,[76,72,84,84,82],0,'b')]),

 /* ---------------- LALIGA ---------------- */
 T('lal','rma','Real Madrid','RMA',K('#F4F4F2','#F4F4F2','solid','#F4F4F2','#F4F4F2','#1C2C5B',{collar:'#C9A227'}),
  G('Courtois',1,88,92,'#2F9E44',0,'c'),
  [J('Mbappé',10,[97,96,91,90,78],2,'n'),J('Vinícius Jr',7,[95,94,84,90,66],3,'n'),J('Bellingham',5,[80,82,85,88,84],2,'n'),J('Valverde',8,[86,84,86,86,84],0,'c'),J('Mastantuono',30,[80,86,82,88,58],0,'c'),J('Arda Güler',15,[74,82,84,91,56],0,'c')]),
 T('lal','fcb','Barcelona','FCB',K('#A50044','#004D98','vstripes','#004D98','#004D98','#F2C200',{collar:'#F2C200'}),
  G('Joan García',13,84,84,'#2BB0A8',0,'n'),
  [J('Lamine Yamal',10,[88,90,84,94,58],2,'n'),J('Pedri',8,[72,80,76,92,60],0,'c'),J('Raphinha',11,[88,88,85,86,66],1,'n'),J('Lewandowski',9,[72,74,90,84,82],0,'c')]),
 T('lal','atm','Atlético de Madrid','ATM',K('#CB3524','#FFFFFF','vstripes','#272E61','#CB3524','#272E61'),
  G('Oblak',13,87,86,'#F2C200',0,'c'),
  [J('J. Álvarez',19,[85,87,86,85,74],0,'n'),J('Griezmann',7,[76,80,86,90,64],0,'b'),J('Baena',10,[80,84,82,88,62],0,'c'),J('G. Simeone',20,[86,86,76,80,70],0,'n')]),
 T('lal','ath','Athletic Club','ATH',K('#EE2523','#FFFFFF','vstripes','#16161B','#16161B','#16161B'),
  G('Unai Simón',1,84,84,'#2BB0A8',0,'n'),
  [J('Nico Williams',10,[93,94,80,87,64],3,'n'),J('Iñaki Williams',9,[92,88,80,80,82],3,'n'),J('Sancet',8,[76,80,82,86,70],0,'c'),J('Berenguer',7,[82,84,78,82,62],0,'c')]),
 T('lal','bet','Real Betis','BET',K('#00954C','#FFFFFF','vstripes','#00954C','#00954C','#FFFFFF'),
  G('Vallés',13,79,80,'#F28C28',0,'c'),
  [J('Isco',22,[62,70,82,92,62],0,'c'),J('Lo Celso',20,[72,76,82,89,62],0,'c'),J('Antony',7,[86,88,80,86,58],2,'n'),J('Cucho Hernández',19,[82,80,84,80,76],2,'n')]),

 /* ---------------- SERIE A ---------------- */
 T('ser','int','Inter','INT',K('#0068A8','#16161B','vstripes','#16161B','#16161B','#F4F4F2'),
  G('Sommer',1,84,82,'#F2C200',0,'c'),
  [J('Lautaro',10,[82,84,88,84,82],1,'n'),J('Thuram',9,[88,82,84,82,86],3,'n'),J('Barella',23,[80,82,80,88,72],0,'n'),J('Çalhanoğlu',20,[66,70,86,88,70],0,'n')]),
 T('ser','mil','Milan','MIL',K('#FB090B','#16161B','vstripes','#F4F4F2','#16161B','#F4F4F2'),
  G('Maignan',16,87,85,'#F28C28',3,'n'),
  [J('Rafael Leão',10,[94,90,83,87,76],3,'n'),J('Pulisic',11,[86,88,82,88,60],0,'b'),J('Modrić',14,[60,70,80,92,62],0,'b'),J('S. Giménez',7,[80,78,86,78,82],0,'c')]),
 T('ser','juv','Juventus','JUV',K('#F4F4F2','#16161B','vstripes','#16161B','#F4F4F2','#16161B'),
  G('Di Gregorio',29,82,82,'#F2C200',0,'c'),
  [J('Yildiz',10,[84,88,84,90,60],0,'c'),J('Vlahović',9,[78,74,88,78,88],0,'c'),J('J. David',30,[84,84,86,84,70],2,'n'),J('Conceição',7,[88,92,78,88,56],0,'n')]),
 T('ser','nap','Napoli','NAP',K('#12A0D7','#12A0D7','solid','#12A0D7','#12A0D7','#F4F4F2',{collar:'#F4F4F2'}),
  G('Meret',1,82,82,'#F2C200',0,'b'),
  [J('De Bruyne',11,[70,74,88,94,72],0,'p'),J('McTominay',8,[76,76,84,82,86],0,'p'),J('Højlund',19,[86,82,84,78,84],0,'b'),J('Politano',21,[84,86,80,86,56],0,'c')]),

 /* ---------------- RESTO DE EUROPA ---------------- */
 T('eur','bay','Bayern Múnich','BAY',K('#DC052D','#DC052D','solid','#DC052D','#DC052D','#F4F4F2',{collar:'#F4F4F2'}),
  G('Neuer',1,84,86,'#2F9E44',0,'b'),
  [J('Kane',9,[70,72,94,86,84],0,'c'),J('Musiala',10,[85,90,84,93,62],1,'c'),J('Olise',17,[84,86,84,90,60],2,'n'),J('Luis Díaz',14,[92,94,82,88,66],2,'n'),J('Kimmich',6,[72,76,80,88,72],0,'b')]),
 T('eur','bvb','Borussia Dortmund','BVB',K('#FDE100','#FDE100','solid','#16161B','#FDE100','#16161B',{collar:'#16161B'}),
  G('Kobel',1,84,84,'#2BB0A8',0,'b'),
  [J('Guirassy',9,[80,78,90,80,84],3,'n'),J('Brandt',10,[74,78,82,88,62],0,'b'),J('Adeyemi',27,[94,94,78,80,68],2,'n'),J('J. Bellingham',7,[76,78,76,84,74],2,'n')]),
 T('eur','psg','Paris Saint-Germain','PSG',K('#1A2A57','#DA291C','vband','#1A2A57','#1A2A57','#F4F4F2'),
  G('Chevalier',30,82,82,'#F2C200',0,'c'),
  [J('Dembélé',10,[92,93,87,89,62],3,'n'),J('Kvaratskhelia',7,[88,90,84,92,66],0,'c'),J('Vitinha',17,[70,78,78,93,58],0,'c'),J('Doué',14,[88,90,82,88,62],3,'n'),J('Hakimi',2,[92,88,76,84,72],2,'n')]),

 /* ---------------- LEYENDAS ---------------- */
 T('ley','lriv','River Leyendas','RIV',K('#F4F4F2','#D71920','sash','#16161B','#16161B','#16161B'),
  G('Fillol',1,88,86,'#2F9E44',0,'c'),
  [J('Francescoli',9,[76,78,88,92,74],0,'c'),J('Ortega',10,[84,90,82,93,60],1,'n'),J('Saviola',7,[90,92,85,88,56],0,'c'),J('Aimar',16,[78,84,80,93,56],0,'c')],
  {p:'#D71920',s:'#16161B',pat:'sash',sleeve:'#D71920',shorts:'#D71920',socks:'#D71920',num:'#F4F4F2',collar:'#16161B'}),
 T('ley','lboc','Boca Leyendas','BOC',K('#0A2D7A','#F5C400','hband','#0A2D7A','#0A2D7A','#F5C400'),
  G('Córdoba',1,89,84,'#7A7A7A',1,'n'),
  [J('Riquelme',10,[66,72,88,96,76],1,'n'),J('Palermo',9,[72,70,92,74,88],0,'b'),J('Tevez',11,[86,88,86,88,82],1,'n'),J('Battaglia',5,[70,72,74,82,86],0,'c')],
  {p:'#F5C400',s:'#0A2D7A',pat:'hband',sleeve:'#F5C400',shorts:'#F5C400',socks:'#F5C400',num:'#0A2D7A',collar:'#0A2D7A'}),
 T('ley','lcen','Central Leyendas','CEN',K('#003DA5','#FFD100','vstripes','#003DA5','#003DA5','#FFD100'),
  G('Abbondanzieri',1,86,84,'#2F9E44',0,'c'),
  [J('Kempes',9,[86,84,92,84,82],0,'c'),J('Aldo Poy',7,[76,78,80,82,66],0,'c'),J('Omar Palma',10,[62,72,84,92,60],0,'c'),J('Bauza',2,[64,62,70,72,90],0,'n')]),
 T('ley','lnob',"Newell's Leyendas",'NOB',K('#D0021B','#16161B','halves','#16161B','#16161B','#FFFFFF',{collar:'#16161B'}),
  G('Scoponi',1,84,82,'#2BB0A8',0,'c'),
  [J('Batistuta',9,[84,82,94,80,88],0,'c'),J('Maxi Rodríguez',11,[78,80,86,86,70],0,'c'),J('G. Martino',10,[64,72,82,92,62],0,'c'),J('Pochettino',6,[66,64,62,76,86],0,'c')]),
 T('ley','larg86','Argentina 86','ARG',K('#7DB9E8','#FFFFFF','vstripes','#16161B','#FFFFFF','#16161B',{sleeve:'#FFFFFF',collar:'#16161B'}),
  G('Pumpido',18,82,82,'#8A8A8A',0,'c'),
  [J('Maradona',10,[88,96,92,99,72],0,'n'),J('Valdano',11,[78,76,88,82,80],0,'c'),J('Burruchaga',7,[78,80,84,86,70],0,'c'),J('Ruggeri',19,[70,68,60,74,90],0,'c')],
  {p:'#1F2B52',s:'#2D3E73',pat:'solid',sleeve:'#1F2B52',shorts:'#1F2B52',socks:'#1F2B52',num:'#7DB9E8',collar:'#7DB9E8'}),
 T('ley','lbra70','Brasil 70','BRA',K('#FFD60A','#0F8A3C','solid','#1D4CB3','#FFFFFF','#0F8A3C'),
  G('Félix',1,78,78,'#6E6E6E',0,'n'),
  [J('Pelé',10,[88,92,96,96,78],3,'n'),J('Jairzinho',7,[90,90,88,86,80],3,'n'),J('Rivelino',11,[76,80,92,92,74],0,'n'),J('Tostão',9,[80,84,88,90,64],0,'c')],
  {p:'#1D4CB3',s:'#FFD60A',pat:'solid',sleeve:'#1D4CB3',shorts:'#FFFFFF',socks:'#1D4CB3',num:'#FFD60A',collar:'#FFD60A'}),
 T('ley','lbra02','Brasil 2002','BRA',K('#FFD60A','#0F8A3C','solid','#1D4CB3','#FFFFFF','#0F8A3C'),
  G('Marcos',1,84,82,'#5A5A5A',0,'n'),
  [J('Ronaldo',9,[94,96,96,92,82],2,'n'),J('Ronaldinho',11,[84,90,88,98,70],2,'n'),J('Rivaldo',10,[80,84,92,92,72],1,'n'),J('Roberto Carlos',6,[92,90,88,82,78],2,'n')],
  {p:'#1D4CB3',s:'#FFD60A',pat:'solid',sleeve:'#1D4CB3',shorts:'#FFFFFF',socks:'#1D4CB3',num:'#FFD60A',collar:'#FFD60A'}),
 T('ley','lfcb','Barcelona Leyendas','FCB',K('#A50044','#004D98','vstripes','#004D98','#004D98','#F2C200',{collar:'#F2C200'}),
  G('Valdés',1,84,82,'#2BB0A8',0,'n'),
  [J('Ronaldinho',10,[84,90,88,98,70],2,'n'),J('Iniesta',8,[74,84,82,97,58],0,'c'),J('Xavi',6,[66,76,78,96,58],0,'n'),J("Eto'o",9,[92,92,90,84,78],3,'n'),J('Puyol',5,[74,72,56,74,92],0,'c')]),
 T('ley','lrma','Real Madrid Leyendas','RMA',K('#F4F4F2','#F4F4F2','solid','#F4F4F2','#F4F4F2','#1C2C5B',{collar:'#C9A227'}),
  G('Casillas',1,90,86,'#2F9E44',0,'n'),
  [J('Zidane',5,[74,80,88,98,82],0,'g'),J('Raúl',7,[80,84,90,90,66],0,'n'),J('Figo',10,[84,86,86,92,70],0,'n'),J('Roberto Carlos',3,[92,90,88,82,78],2,'n'),J('Hierro',4,[70,68,82,82,88],0,'c')]),
 T('ley','lwld','Leyendas del Mundo','MUN',K('#16161B','#C9A227','vband','#16161B','#16161B','#C9A227'),
  G('Yashin',1,90,90,'#16161B',0,'n'),
  [J('Maradona',10,[88,96,92,99,72],0,'n'),J('Pelé',9,[88,92,96,96,78],3,'n'),J('Cruyff',14,[86,90,88,96,62],0,'c'),J('Zidane',5,[74,80,88,98,82],0,'g')],
  {p:'#C9A227',s:'#16161B',pat:'vband',sleeve:'#C9A227',shorts:'#C9A227',socks:'#C9A227',num:'#16161B',collar:'#16161B'})
];

// Camisetas suplentes (colores tradicionales de visitante; los diseños exactos cambian cada temporada)
const ALTS={
 fra:K('#F4F4F2','#F4F4F2','solid','#1C2753','#F4F4F2','#1C2753',{collar:'#D7262E'}),
 esp:K('#EDE7D3','#EDE7D3','solid','#EDE7D3','#EDE7D3','#C8102E',{collar:'#C8102E'}),
 ale:K('#16161B','#D0021B','solid','#16161B','#16161B','#F4F4F2'),
 por:K('#F4F4F2','#0B6E3A','solid','#F4F4F2','#F4F4F2','#0B6E3A'),
 uru:K('#F4F4F2','#5CBFEB','solid','#5CBFEB','#F4F4F2','#5CBFEB'),
 ned:K('#1C2C5B','#F36C21','solid','#1C2C5B','#1C2C5B','#F36C21'),
 ita:K('#F4F4F2','#0066B3','solid','#0066B3','#F4F4F2','#0066B3'),
 col:K('#1A2A57','#FCD116','solid','#1A2A57','#1A2A57','#FCD116'),
 rac:K('#1C2440','#7DC4EA','solid','#1C2440','#1C2440','#7DC4EA'),
 ind:K('#F4F4F2','#D0021B','solid','#F4F4F2','#F4F4F2','#D0021B'),
 slo:K('#F4F4F2','#0A2D7A','hband','#F4F4F2','#F4F4F2','#D0021B',{collar:'#D0021B'}),
 est:K('#16161B','#E1001A','solid','#16161B','#16161B','#E1001A'),
 vel:K('#0A2D7A','#F4F4F2','vee','#F4F4F2','#0A2D7A','#F4F4F2'),
 cen:K('#FFD100','#003DA5','solid','#003DA5','#FFD100','#003DA5'),
 nob:K('#F4F4F2','#D0021B','solid','#16161B','#F4F4F2','#D0021B',{collar:'#16161B'}),
 tal:K('#F4F4F2','#0A2D7A','solid','#0A2D7A','#F4F4F2','#0A2D7A'),
 fla:K('#F4F4F2','#C8102E','solid','#F4F4F2','#F4F4F2','#C8102E'),
 pal:K('#F4F4F2','#006437','solid','#006437','#F4F4F2','#006437'),
 bot:K('#F4F4F2','#16161B','solid','#F4F4F2','#F4F4F2','#16161B'),
 sao:K('#D0021B','#16161B','vstripes','#16161B','#16161B','#F4F4F2'),
 mci:K('#1C2C5B','#6CABDD','solid','#1C2C5B','#1C2C5B','#6CABDD'),
 ars:K('#F7D117','#0A2D7A','solid','#0A2D7A','#F7D117','#0A2D7A'),
 liv:K('#F4F4F2','#C8102E','solid','#F4F4F2','#F4F4F2','#C8102E'),
 che:K('#F4F4F2','#034694','solid','#F4F4F2','#F4F4F2','#034694'),
 mun:K('#F4F4F2','#DA291C','solid','#16161B','#F4F4F2','#DA291C'),
 tot:K('#132257','#F4F4F2','solid','#132257','#132257','#F4F4F2'),
 new:K('#2A9D8F','#16161B','solid','#16161B','#2A9D8F','#F4F4F2'),
 rma:K('#2B1C4D','#C9A227','solid','#2B1C4D','#2B1C4D','#C9A227'),
 fcb:K('#F2C200','#A50044','solid','#F2C200','#F2C200','#A50044'),
 atm:K('#272E61','#CB3524','solid','#272E61','#272E61','#F4F4F2'),
 ath:K('#16161B','#EE2523','solid','#16161B','#16161B','#EE2523'),
 bet:K('#F4F4F2','#00954C','solid','#F4F4F2','#F4F4F2','#00954C'),
 int:K('#F4F4F2','#0068A8','sash','#F4F4F2','#F4F4F2','#0068A8'),
 mil:K('#F4F4F2','#FB090B','solid','#F4F4F2','#F4F4F2','#FB090B'),
 juv:K('#F7A8C4','#16161B','solid','#16161B','#F7A8C4','#16161B'),
 nap:K('#F4F4F2','#12A0D7','solid','#12A0D7','#F4F4F2','#12A0D7'),
 bay:K('#F4F4F2','#DC052D','solid','#F4F4F2','#F4F4F2','#DC052D'),
 bvb:K('#16161B','#FDE100','solid','#16161B','#16161B','#FDE100'),
 psg:K('#F4F4F2','#1A2A57','vband','#F4F4F2','#F4F4F2','#1A2A57'),
 lcen:'cen',lnob:'nob',lfcb:'fcb',lrma:'rma'
};
for(const t of TEAMS){let a=ALTS[t.id];if(typeof a==='string')a=ALTS[a];if(a)t.alt=a;}

function teamOf(id){return TEAMS.find(t=>t.id===id)||TEAMS[0];}

/* =====================================================================
   SIM — simulación pura y determinista. No sabe nada de pantalla ni red.
   Entrada: estado + inputs por jugador. Salida: estado nuevo.
   (Es la pieza que después correrá idéntica en el servidor autoritativo.)
   ===================================================================== */
const SIM=(()=>{
 const KR=0.42+0.17+0.26; // alcance de patada (centro a centro)
 const DT=1/60, PR=0.42, BR=0.17, GD=1.6, BAR=2.0, POSTR=0.12, GRAV=14, HN=32, RC=0, CORNER=1.23, WALL_E=0.62, ROLL=0.75; // cancha rectangular · CORNER: barrera diagonal invisible solo para jugadores · WALL_E: rebote en la valla · ROLL: roce del pasto
 const FORMATS={1:{L:28,W:17,G:5},2:{L:34,W:20,G:5.6},3:{L:40,W:24,G:6.2}};
 const SLOTS={1:[[0.35,0]],2:[[0.25,-0.3],[0.55,0.3]],3:[[0.24,0],[0.52,-0.42],[0.52,0.42]],4:[[0.24,-0.25],[0.24,0.25],[0.55,-0.45],[0.55,0.45]],5:[[0.22,0],[0.4,-0.45],[0.4,0.45],[0.62,-0.2],[0.62,0.2]]};
 const NOIN={mx:0,my:0,kick:false,lob:false,sprint:false,dive:false,slide:false,skill:false,sx:0,sy:0};
 const clamp=(v,a,b)=>v<a?a:v>b?b:v;
 const sf=s=>clamp((s-75)/25,-1,1);
 const wrap=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a;};

 // Estadísticas normalizadas: cada atributo mueve su parámetro como mucho ±7–15%.
 function deriveField(st){const[v,a,t,c,f]=st;return{maxSpd:6.4*(1+0.07*sf(v)),accel:10*(1+0.15*sf(a)),shot:24*(1+0.08*sf(t)),ctrl:sf(c),mass:1+0.25*sf(f),bounce:0.34-0.08*sf(c)};}
 function deriveGK(g){return{maxSpd:5.6,accel:12,shot:20,ctrl:0,mass:1.3,bounce:0.28,diveSpd:7.0*(1+0.06*sf(g.refl)),reach:0.66*(1+0.1*sf(g.reach)),delay:Math.round(10-2.5*sf(g.refl))};}

 function createMatch(cfg){
  const f=FORMATS[cfg.format]||FORMATS[1];
  const s={L:f.L,W:f.W,G:f.G,tick:0,phase:'kickoff',phaseT:0,clock:cfg.duration,duration:cfg.duration,ot:0,golden:false,
   cap:cfg.cap,score:[0,0],penalties:!!cfg.penalties,needPens:false,allowDraw:!!cfg.allowDraw,agg:cfg.agg||[0,0],kickoffTeam:0,pendingEnd:false,players:[],scorers:[],events:[],hist:new Array(HN),
   ball:{x:0,y:0,z:0,vx:0,vy:0,vz:0,spin:0,holder:-1,lastTouch:-1,lastTeam:-1,roll:0}};
  cfg.lineups.forEach((lu,team)=>{
   lu.forEach(e=>{
    const eq=cfg.equal;
    const d=e.gk?deriveGK(eq?{refl:80,reach:80}:e.data):deriveField(eq?[78,78,78,78,78]:e.data.st);
    s.players.push(Object.assign({id:s.players.length,team,role:e.gk?'gk':'field',name:e.data.n,num:e.data.num,
     x:0,y:0,vx:0,vy:0,face:team===0?0:Math.PI,stam:1,charging:false,charge:0,kind:'kick',cool:0,after:0,afterDx:1,afterDy:0,
     dive:null,diveT:0,holdT:0,kickAnim:0,run:0,slideT:0,recoverT:0,stunT:0,slideDx:1,slideDy:0,slideClean:false,slideHit:false,skill:null,skillCd:0},d));
   });
  });
  resetKickoff(s,cfg.kickoffTeam||0);
  for(let i=0;i<HN;i++)s.hist[i]={x:0,y:0,z:0};
  return s;
 }

 function resetKickoff(s,team){
  s.phase='kickoff';s.phaseT=0;s.kickoffTeam=team;
  Object.assign(s.ball,{x:0,y:0,z:0,vx:0,vy:0,vz:0,spin:0,holder:-1,lastTouch:-1,lastTeam:-1,gs:0,px:0,py:0,pz:0});
  for(const t of [0,1]){
   const side=t===0?-1:1;
   const field=s.players.filter(p=>p.team===t&&p.role!=='gk');
   const sl=SLOTS[field.length]||SLOTS[5];
   field.forEach((p,i)=>{
    const[fx,fy]=sl[i%sl.length];
    p.x=side*fx*s.L/2;p.y=fy*s.W/2;
    if(t===team&&i===0){p.x=side*0.8;p.y=0;}
    resetP(p,side);
   });
   for(const g of s.players)if(g.team===t&&g.role==='gk'){g.x=side*(s.L/2-0.9);g.y=0;resetP(g,side);}
  }
  s.events.push({t:'whistle'});
 }
 function resetP(p,side){p.skill=null;p.skillCd=0;p.slideT=0;p.recoverT=0;p.stunT=0;p.vx=p.vy=0;p.charging=false;p.charge=0;p.cool=0;p.after=0;p.dive=null;p.holdT=0;p.face=side<0?0:Math.PI;}

 function step(s,inputs){
  if(s.phase==='end')return;
  s.tick++;
  if(s.phase==='goal'){
   s.phaseT+=DT;
   if(s.phaseT>=2.4){
    if(s.pendingEnd){s.phase='end';s.events.push({t:'end'});return;}
    resetKickoff(s,s.kickoffTeam);
   }
  }
  for(let i=0;i<s.players.length;i++)control(s,s.players[i],inputs[i]||NOIN);
  playerCollisions(s);
  for(const p of s.players)clampPlayer(s,p);
  moveBall(s);
  ballPlayers(s);
  unjam(s);
  walls(s);
  checkGoal(s);
  if(s.phase==='kickoff'&&s.ball.lastTouch>=0)s.phase='play';
  if(s.phase==='play'||s.phase==='kickoff'){
   if(s.golden)s.ot+=DT;
   else{
    s.clock-=DT;
    if(s.clock<=0){
     s.clock=0;
     // empate (contando la ida si es partido de vuelta): gol de oro, salvo en fase de grupos
     const tied=s.score[0]+s.agg[0]===s.score[1]+s.agg[1];
     if(tied&&s.penalties&&!s.allowDraw){s.needPens=true;s.phase='end';s.events.push({t:'end'});}
     else if(tied&&!s.allowDraw){s.golden=true;s.events.push({t:'golden'});}
     else{s.phase='end';s.events.push({t:'end'});}
    }
   }
  }
  const b=s.ball;s.hist[s.tick%HN]={x:b.x,y:b.y,z:b.z};
 }

 function control(s,p,inp){
  const b=s.ball;
  // arquero manejado por una persona: globo = agarrar (y despeje si ya la tiene), barrida = estirada
  if(p.role==='gk'&&p.hgk){p.grab=!!inp.lob;if(b.holder!==p.id)p.needRel=true;else if(!inp.lob)p.needRel=false;inp=Object.assign({},inp,{dive:!!(inp.dive||inp.slide),slide:false,lob:b.holder===p.id&&!p.needRel&&!!inp.lob,skill:false});}
  p.cool=Math.max(0,p.cool-DT);
  if(p.kickAnim>0)p.kickAnim-=DT;
  if(p.role==='gk'){
   if(b.holder===p.id){p.holdT+=DT;if(p.holdT>(p.hgk?6:2.6))throwBall(s,p,null);}
   if(p.dive){
    p.diveT+=DT;
    if(p.diveT>=0.32){const k=Math.exp(-9*DT);p.vx*=k;p.vy*=k;}
    if(p.diveT>0.85)p.dive=null;
    p.x+=p.vx*DT;p.y+=p.vy*DT;p.charging=false;return;
   }
   if(inp.dive&&b.holder!==p.id){
    let dx=inp.mx,dy=inp.my;const l=Math.hypot(dx,dy);
    if(l>0.1){dx/=l;dy/=l;p.dive={dx,dy};p.diveT=0;p.vx=dx*p.diveSpd;p.vy=dy*p.diveSpd;p.x+=p.vx*DT;p.y+=p.vy*DT;s.events.push({t:'dive'});return;}
   }
  }
  // barrida: arranque explosivo, sin control durante el deslizamiento, recuperación lenta
  if(p.stunT>0)p.stunT-=DT;
  if(p.slideT>0){
   p.slideT-=DT;const k=Math.exp(-2.4*DT);p.vx*=k;p.vy*=k;p.x+=p.vx*DT;p.y+=p.vy*DT;
   if(p.slideT<=0)p.recoverT=0.45;p.charging=false;return;
  }
  if(p.recoverT>0)p.recoverT-=DT;
  // filigranas: mientras dura una, el movimiento lo maneja la jugada
  if(p.skillCd>0)p.skillCd-=DT;
  if(p.skill){skillStep(s,p);return;}
  if(inp.skill&&p.role!=='gk'&&p.recoverT<=0&&p.stunT<=0&&!p.charging&&p.skillCd<=0&&startSkill(s,p,inp))return;
  if(inp.slide&&p.role!=='gk'&&p.recoverT<=0&&p.stunT<=0&&!p.charging){
   let dx=p.vx,dy=p.vy,l=Math.hypot(dx,dy);
   if(l<1){dx=Math.cos(p.face);dy=Math.sin(p.face);l=1;}
   dx/=l;dy/=l;const v=Math.max(Math.hypot(p.vx,p.vy),p.maxSpd)*1.45;
   p.slideDx=dx;p.slideDy=dy;p.vx=dx*v;p.vy=dy*v;p.slideT=0.34;p.slideClean=false;p.slideHit=false;
   p.face=Math.atan2(dy,dx);s.events.push({t:'slide',id:p.id});return;
  }
  const busy=p.recoverT>0||p.stunT>0;
  // carga y suelta del tiro
  const want=(inp.kick||inp.lob)&&!busy;
  if(want&&p.cool<=0){
   if(!p.charging){p.charging=true;p.charge=0;p.kind=inp.lob?'lob':'kick';p.wasReach=inReach(s,p);}
   p.charge=Math.min(1.4,p.charge+DT);
   if(inp.hx){const r=inReach(s,p);if(r&&!p.wasReach&&p.charge>=0.1){p.charging=false;doKick(s,p,inp);p.wasReach=true;}else p.wasReach=r;}
  }else if(p.charging){p.charging=false;doKick(s,p,inp);}
  // aftertouch: efecto lateral aplicado justo después del contacto
  if(p.after>0){
   p.after-=DT;
   if(b.lastTouch===p.id&&b.holder<0){
    const nx=-p.afterDy,ny=p.afterDx;const sd=inp.mx*nx+inp.my*ny;
    b.spin=clamp(b.spin+sd*10*DT,-2.4,2.4);
   }
  }
  // movimiento
  p.hx=!!inp.hx;let mx=inp.mx,my=inp.my;const ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml;}
  if(ml>0.3){p.wantX=mx/Math.max(ml,1e-6);p.wantY=my/Math.max(ml,1e-6);}else{p.wantX=0;p.wantY=0;}
  const m=Math.min(1,ml);
  const spr=inp.sprint&&p.stam>0.03&&m>0.1;
  const spd=p.maxSpd*(spr?1.25:1)*(p.charging?0.85:1)*(p.recoverT>0?0.35:1)*(p.stunT>0?0.3:1);p.spr=spr;
  const rate=m>0.1?p.accel:p.accel*1.5;const k=1-Math.exp(-rate*DT);
  p.vx+=(mx*spd-p.vx)*k;p.vy+=(my*spd-p.vy)*k;
  p.stam=spr?Math.max(0,p.stam-0.33*DT):Math.min(1,p.stam+0.18*DT);
  if(m>0.15){const d=wrap(Math.atan2(my,mx)-p.face);p.face=wrap(p.face+clamp(d,-18*DT,18*DT));}
  else if(p.role==='gk'){const tgt=p.team===0?0:Math.PI;const d=wrap(tgt-p.face);p.face=wrap(p.face+clamp(d,-6*DT,6*DT));}
  p.x+=p.vx*DT;p.y+=p.vy*DT;
  p.run+=Math.hypot(p.vx,p.vy)*DT*1.7;
 }

 // Patada determinista: dirección = mezcla entre a dónde apuntás y por dónde tocás la pelota.
 // computeKick no modifica nada: la usa la patada real y la mira de tiro del jugador.
 function computeKick(s,p,inp,charge,kind){
  const b=s.ball;
  let ax=inp.mx,ay=inp.my;const al=Math.hypot(ax,ay);
  if(al<0.3){ax=Math.cos(p.face);ay=Math.sin(p.face);}else{ax/=al;ay/=al;}
  const dx=b.x-p.x,dy=b.y-p.y,d=Math.hypot(dx,dy);
  const reach=d<=KR&&b.z<=1.1&&b.holder<0;
  const cx=d>1e-6?dx/d:ax,cy=d>1e-6?dy/d:ay;
  const dot=ax*cx+ay*cy;
  const pw=clamp(charge/0.75,0,1);
  const perfect=kind==='kick'&&charge>=0.76&&charge<=0.86;
  // como en HaxBall: la pelota sale en la línea que une tu centro con el de la pelota
  let ux=cx,uy=cy,vz,spd,weak=false;
  if(kind==='lob'){spd=7+10*pw;vz=4.5+5.5*pw;}
  else{spd=(10.5+(p.shot-10.5)*Math.pow(pw,1.2))*(perfect?1.05:1);vz=1.0*pw;if(charge>0.86)vz+=Math.min(9,(charge-0.86)*18);}
  return{reach,ux,uy,vz,spd,perfect,weak,ax,ay};
 }
 function inReach(s,p){const b=s.ball;return b.holder<0&&b.z<=1.1&&Math.hypot(b.x-p.x,b.y-p.y)<=KR;}
 function doKick(s,p,inp){
  const b=s.ball;
  if(b.holder===p.id){let ax=inp.mx,ay=inp.my;const al=Math.hypot(ax,ay);if(al<0.3){ax=Math.cos(p.face);ay=Math.sin(p.face);}throwBall(s,p,[ax,ay],p.kind==='lob',p.charge);return;}
  if(b.holder>=0){p.cool=0.15;return;}
  const k=computeKick(s,p,inp,p.charge,p.kind);
  if(!k.reach){p.cool=0.12;s.events.push({t:'whiff',id:p.id});return;}
  b.vx=k.ux*k.spd+p.vx*0.25;b.vy=k.uy*k.spd+p.vy*0.25;b.vz=k.vz;b.spin=0;if(k.vz>0&&b.z<0.01)b.z=0.01;
  b.lastTouch=p.id;b.lastTeam=p.team;
  const bl=Math.hypot(b.vx,b.vy)||1;p.after=0.32;p.afterDx=b.vx/bl;p.afterDy=b.vy/bl;
  p.cool=0.22;p.kickAnim=0.18;
  s.events.push({t:'kick',id:p.id,team:p.team,power:k.spd,perfect:k.perfect&&!k.weak,lob:p.kind==='lob',x:b.x,y:b.y,vx:b.vx,vy:b.vy});
 }
 function previewKick(s,p,inp){return computeKick(s,p,inp,p.charge,p.kind);}

 function throwBall(s,p,dir,punt,charge){
  const b=s.ball;const side=p.team===0?-1:1;
  let [dx,dy]=dir||[-side,0];
  if(dx*side>0)dx=-dx; // nunca hacia el propio arco
  const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
  const pw=charge==null?1:Math.min(1,0.35+charge/0.7);
  b.holder=-1;b.x=p.x+dx*(PR+BR+0.08);b.y=p.y+dy*(PR+BR+0.08);b.z=punt?0.9:0.6;
  // con la mano: rápido y bajo · despeje de volea: largo y alto
  const sp=punt?14+8*pw:8+7*pw;b.vx=dx*sp;b.vy=dy*sp;b.vz=punt?6+3*pw:2.5;b.spin=0;b.lastTouch=p.id;b.lastTeam=p.team;
  p.cool=0.4;p.holdT=0;p.kickAnim=0.18;
  s.events.push({t:'kick',id:p.id,power:14});
 }

 function playerCollisions(s){
  const P=s.players;
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){
   const a=P[i],c=P[j];const dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy);
   if(d>=2*PR||d<1e-6)continue;
   const nx=dx/d,ny=dy/d,ov=2*PR-d,tm=a.mass+c.mass;
   a.x-=nx*ov*c.mass/tm;a.y-=ny*ov*c.mass/tm;c.x+=nx*ov*a.mass/tm;c.y+=ny*ov*a.mass/tm;
   const vn=(c.vx-a.vx)*nx+(c.vy-a.vy)*ny;
   if(vn<0){const J=-(1.2)*vn/(1/a.mass+1/c.mass);a.vx-=J/a.mass*nx;a.vy-=J/a.mass*ny;c.vx+=J/c.mass*nx;c.vy+=J/c.mass*ny;}
   if(a.team!==c.team){slideContact(s,a,c);slideContact(s,c,a);}
  }
 }
 // Barrida limpia (tocó la pelota primero) desparrama al rival; si no, es falta y el que barrió queda tirado.
 function slideContact(s,sl,v){
  if(sl.slideT<=0||sl.slideHit||v.role==='gk')return;
  sl.slideHit=true;
  if(sl.slideClean){v.stunT=Math.max(v.stunT,0.5);v.charging=false;s.events.push({t:'trip',id:v.id,by:sl.id});}
  else{v.stunT=Math.max(v.stunT,0.25);sl.slideT=0;sl.recoverT=0;sl.stunT=1.0;sl.vx*=0.2;sl.vy*=0.2;s.events.push({t:'foul',id:sl.id,x:sl.x,y:sl.y});}
 }

 function clampPlayer(s,p){
  const L2=s.L/2,W2=s.W/2;
  let minX=-L2+PR,maxX=L2-PR,minY=-W2+PR,maxY=W2-PR;
  if(p.role==='gk'&&(!p.hgk||s.ball.holder===p.id)){
   if(p.team===0)maxX=-L2+5;else minX=L2-5;
   minY=-(s.G/2+2.5);maxY=s.G/2+2.5;
  }
  if(s.phase==='kickoff'){
   if(p.team===0)maxX=Math.min(maxX,0);else minX=Math.max(minX,0);
   if(p.team!==s.kickoffTeam){const d=Math.hypot(p.x,p.y),R=3+PR;if(d<R){const k=R/(d||1e-6);p.x*=k;p.y*=k;if(d<1e-6)p.x=p.team===0?-R:R;}}
  }
  if(p.x<minX){p.x=minX;if(p.vx<0)p.vx=0;} if(p.x>maxX){p.x=maxX;if(p.vx>0)p.vx=0;}
  if(p.y<minY){p.y=minY;if(p.vy<0)p.vy=0;} if(p.y>maxY){p.y=maxY;if(p.vy>0)p.vy=0;}
  {const ex=Math.abs(p.x)+Math.abs(p.y)-(L2+W2-CORNER);
   if(ex>0&&Math.abs(p.x)>L2-CORNER-1&&Math.abs(p.y)>W2-CORNER-1){const sx=Math.sign(p.x),sy=Math.sign(p.y),n=Math.SQRT1_2;
    p.x-=sx*ex*0.5;p.y-=sy*ex*0.5;const vn=(p.vx*sx+p.vy*sy)*n;if(vn>0){p.vx-=vn*sx*n;p.vy-=vn*sy*n;}}}
 }

 function moveBall(s){
  const b=s.ball;
  if(b.holder>=0){const k=s.players[b.holder];b.x=k.x+Math.cos(k.face)*0.35;b.y=k.y+Math.sin(k.face)*0.35;b.z=0.7;b.vx=b.vy=b.vz=0;b.spin=0;return;}
  const sp=Math.hypot(b.vx,b.vy);
  if(sp>0.5&&Math.abs(b.spin)>0.01){const nx=-b.vy/sp,ny=b.vx/sp,a=b.spin*sp*0.12;b.vx+=nx*a*DT;b.vy+=ny*a*DT;}
  if(b.z>0.001||b.vz>0){b.vz-=GRAV*DT;const k=Math.exp(-0.15*DT);b.vx*=k;b.vy*=k;b.spin*=Math.exp(-0.8*DT);}
  else{const k=Math.exp(-ROLL*DT);b.vx*=k;b.vy*=k;b.spin*=Math.exp(-3*DT);
   // las esquinas tienen una pendiente mínima: la pelota nunca se queda quieta ahí
   const L2c=s.L/2,W2c=s.W/2,cx=Math.abs(b.x)-(L2c-1.1),cy=Math.abs(b.y)-(W2c-1.1);
   if(cx>0&&cy>0&&Math.abs(b.y)>s.G/2+0.5){const a=1.4*DT;b.vx-=Math.sign(b.x)*a*(0.5+cx);b.vy-=Math.sign(b.y)*a*(0.5+cy);}
   else if(Math.hypot(b.vx,b.vy)<0.05){b.vx=0;b.vy=0;}}
  b.px=b.x;b.py=b.y;b.pz=b.z;
  b.x+=b.vx*DT;b.y+=b.vy*DT;b.z+=b.vz*DT;
  if(b.z<0){b.z=0;if(b.vz<-1.6){b.vz=-b.vz*0.45;b.vx*=0.88;b.vy*=0.88;s.events.push({t:'bounce'});}else b.vz=0;}
  b.roll+=sp*DT;
  walls(s);
 }

 function walls(s){
  const b=s.ball,L2=s.L/2,W2=s.W/2,G2=s.G/2;
  if(b.y>W2-BR){b.y=W2-BR;if(b.vy>0){s.events.push({t:'wall',v:b.vy});b.vy=-b.vy*WALL_E;b.spin=0;}}
  if(b.y<-W2+BR){b.y=-W2+BR;if(b.vy<0){s.events.push({t:'wall',v:-b.vy});b.vy=-b.vy*WALL_E;b.spin=0;}}
  if(b.px==null){b.px=b.x;b.py=b.y;b.pz=b.z;}
  for(const sd of [1,-1]){
   // palos: se revisa todo el recorrido del cuadro, así una pelota muy rápida no los atraviesa
   if(Math.min(b.z,b.pz)<BAR)for(const py of [G2,-G2]){
    const cxp=sd*L2,r=BR+POSTR,ax=b.px,ay=b.py,dx=b.x-ax,dy=b.y-ay,fx=ax-cxp,fy=ay-py;
    const A=dx*dx+dy*dy,B=2*(fx*dx+fy*dy),C=fx*fx+fy*fy-r*r;let t=-1;
    if(C<0)t=0;else if(A>1e-9){const D=B*B-4*A*C;if(D>=0){const t1=(-B-Math.sqrt(D))/(2*A);if(t1>=0&&t1<=1)t=t1;}}
    if(t>=0){let hx=ax+dx*t,hy=ay+dy*t;if(C<0){hx=b.x;hy=b.y;}let nx=hx-cxp,ny=hy-py;const d=Math.hypot(nx,ny)||1;nx/=d;ny/=d;
     b.x=cxp+nx*r;b.y=py+ny*r;b.px=b.x;b.py=b.y;
     const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.8*vn*nx;b.vy-=1.8*vn*ny;s.events.push({t:'post'});}}
   }
   const xr=b.x*sd,xe=L2-BR;
   // la línea de fondo: solo se entra al arco entre los palos y por debajo del travesaño
   if(xr>xe&&b.gs!==sd){
    const pxr=b.px*sd;let yc=b.y,zc=b.z;
    if(pxr<=xe&&xr>pxr){const t=(xe-pxr)/(xr-pxr);yc=b.py+(b.y-b.py)*t;zc=b.pz+(b.z-b.pz)*t;}
    if(Math.abs(yc)<G2&&zc<BAR-BR*0.5)b.gs=sd;
    else{b.x=sd*xe;if(pxr<=xe)b.y=Math.max(-W2+BR,Math.min(W2-BR,yc));if(b.vx*sd>0){s.events.push({t:'wall',v:Math.abs(b.vx)});b.vx=-b.vx*WALL_E;b.spin=0;}continue;}
   }else if(xr<=xe-0.05&&b.gs===sd)b.gs=0;
   if(xr>L2&&b.gs===sd){
    // red lateral: cede un poco y amortigua
    const yl=G2-BR;
    if(Math.abs(b.y)>yl){const sg=Math.sign(b.y),pen=Math.abs(b.y)-yl;
     if(!b.inSide){b.inSide=1;s.events.push({t:'sidenet',sd,y:sg,x:b.x,z:b.z,v:Math.abs(b.vy)});}
     if(pen>0.28){b.y=sg*(yl+0.28);if(b.vy*sg>0)b.vy=0;}
     b.vy-=sg*pen*45*DT;const k=Math.exp(-9*DT);b.vy*=k;b.vx*=Math.exp(-2.5*DT);
    }else b.inSide=0;
    // red de atrás: la pelota se hunde (hasta ~0,55 m), la red la frena y la deja caer
    const xl=L2+GD-BR;
    if(xr>xl){const pen=xr-xl;
     if(!b.inNet){b.inNet=1;s.events.push({t:'net',sd,x:b.x,y:b.y,z:b.z,v:Math.abs(b.vx)});}
     if(pen>0.55){b.x=sd*(xl+0.55);if(b.vx*sd>0)b.vx=0;}
     b.vx-=sd*pen*40*DT;b.vx*=Math.exp(-11*DT);b.vy*=Math.exp(-5*DT);if(b.vz>0)b.vz*=Math.exp(-6*DT);
    }else b.inNet=0;
    // techo de la red
    if(b.z>BAR-BR){const pen=b.z-(BAR-BR);if(pen>0.22){b.z=BAR-BR+0.22;if(b.vz>0)b.vz=0;}b.vz-=pen*60*DT;b.vz*=Math.exp(-6*DT);if(!b.inRoof){b.inRoof=1;s.events.push({t:'roofnet',sd,x:b.x,y:b.y,v:Math.abs(b.vz)});}}else b.inRoof=0;
   }
  }
 }

 // Esquinas redondeadas: la pelota nunca queda trabada en un rincón (como en las canchas de HaxBall).
 function cornerBall(s,b,L2,W2){
  const ax=Math.abs(b.x),ay=Math.abs(b.y);
  if(ax<=L2-RC||ay<=W2-RC||ax>L2)return;
  const cx=Math.sign(b.x)*(L2-RC),cy=Math.sign(b.y)*(W2-RC);
  const dx=b.x-cx,dy=b.y-cy,d=Math.hypot(dx,dy),r=RC-BR;
  if(d>r){const nx=dx/d,ny=dy/d;b.x=cx+nx*r;b.y=cy+ny*r;const vn=b.vx*nx+b.vy*ny;if(vn>0){s.events.push({t:'wall',v:vn});b.vx-=1.72*vn*nx;b.vy-=1.72*vn*ny;b.spin*=0.4;}}
 }
 function cornerPlayer(s,p){
  const L2=s.L/2,W2=s.W/2,ax=Math.abs(p.x),ay=Math.abs(p.y);
  if(ax<=L2-RC||ay<=W2-RC)return;
  const cx=Math.sign(p.x)*(L2-RC),cy=Math.sign(p.y)*(W2-RC);
  const dx=p.x-cx,dy=p.y-cy,d=Math.hypot(dx,dy),r=RC-PR;
  if(d>r){const nx=dx/d,ny=dy/d;p.x=cx+nx*r;p.y=cy+ny*r;const vn=p.vx*nx+p.vy*ny;if(vn>0){p.vx-=vn*nx;p.vy-=vn*ny;}}
 }
 function inOwnBox(s,p){const side=p.team===0?-1:1;return p.x*side>s.L/2-5.2&&Math.abs(p.y)<s.G/2+2.7;}

 /* ---------- FILIGRANAS ----------
    La dirección se interpreta respecto de hacia dónde mira el jugador:
    adelante = sombrerito, atrás = ruleta de Zidane (o chilena si la pelota viene por el aire),
    costados = bicicleta con salida hacia ese lado. Todo determinista. */
 function startSkill(s,p,inp){
  const b=s.ball;if(b.holder>=0)return false;
  const l=Math.hypot(inp.sx,inp.sy);if(l<0.3)return false;
  const ix=inp.sx/l,iy=inp.sy/l,fx=Math.cos(p.face),fy=Math.sin(p.face);
  const fwd=ix*fx+iy*fy,side=fx*iy-fy*ix;
  const d=Math.hypot(b.x-p.x,b.y-p.y);
  let type=fwd>0.6?'flick':fwd<-0.6?'roulette':'stepover';
  // atrás con la pelota en el aire: chilena (la pelota sale por encima de tu cabeza, hacia atrás)
  if(type==='roulette'&&b.z>0.6&&b.z<2.4&&d<PR+BR+1.0)type='chilena';
  if(type!=='chilena'&&(d>PR+BR+0.6||b.z>0.5))return false;
  const k={type,t:0,side:side>=0?1:-1,a0:p.face,fx,fy,x0:p.x,y0:p.y,bx0:b.x,by0:b.y};
  if(type==='flick'){k.dur=0.34;b.vz=7.8;b.z=Math.max(b.z,0.05);b.vx=fx*4.0+p.vx*0.25;b.vy=fy*4.0+p.vy*0.25;b.spin=0;}
  else if(type==='roulette'){
   k.dur=0.62;
   // gira para el lado contrario al rival más cercano (cubre la pelota con el cuerpo)
   let best=null,bd=1e9;for(const q of s.players)if(q.team!==p.team){const dd=Math.hypot(q.x-p.x,q.y-p.y);if(dd<bd){bd=dd;best=q;}}
   k.spin=best?((fx*(best.y-p.y)-fy*(best.x-p.x))>0?-1:1):k.side;
   const tr=k.spin*0.55;k.tx=Math.cos(p.face+tr);k.ty=Math.sin(p.face+tr);
  }
  else if(type==='stepover'){k.dur=0.66;}
  else{k.dur=0.56;}
  p.skill=k;p.skillCd=1.1;p.stam=Math.max(0,p.stam-0.12);p.charging=false;
  b.lastTouch=p.id;b.lastTeam=p.team;
  s.events.push({t:'skill',type,id:p.id,x:p.x,y:p.y});
  return true;
 }
 function skillStep(s,p){
  const k=p.skill,b=s.ball;k.t+=DT;const u=Math.min(1,k.t/k.dur);
  // si un rival tocó la pelota, la jugada se corta
  if((k.type==='roulette'||(k.type==='stepover'&&!k.burst))&&b.lastTouch!==p.id){p.skill=null;return;}
  if(k.type==='flick'){p.vx=k.fx*p.maxSpd*1.05;p.vy=k.fy*p.maxSpd*1.05;p.x+=p.vx*DT;p.y+=p.vy*DT;}
  else if(k.type==='roulette'){
   // la pelota avanza en línea y el cuerpo gira alrededor de ella: eso es la ruleta
   const dist=1.7*u,bxT=k.bx0+k.tx*dist,byT=k.by0+k.ty*dist;
   const ang=Math.atan2(k.y0-k.by0,k.x0-k.bx0)+k.spin*2*Math.PI*u;
   const r=PR+BR+0.05;const nx=bxT+Math.cos(ang)*r,ny=byT+Math.sin(ang)*r;
   p.vx=(nx-p.x)/DT;p.vy=(ny-p.y)/DT;p.x=nx;p.y=ny;
   p.face=wrap(Math.atan2(byT-ny,bxT-nx)+k.spin*0.35);
   b.x=bxT;b.y=byT;b.z=0;b.vx=k.tx*2.75;b.vy=k.ty*2.75;b.vz=0;
   if(k.t>=k.dur){b.vx=k.tx*4.2;b.vy=k.ty*4.2;p.face=Math.atan2(k.ty,k.tx);p.vx=k.tx*p.maxSpd*0.7;p.vy=k.ty*p.maxSpd*0.7;}
  }
  else if(k.type==='stepover'){
   if(k.t<0.38){
    // dos pasadas de pierna por encima de la pelota, casi sin avanzar
    p.vx=k.fx*1.3;p.vy=k.fy*1.3;p.x+=p.vx*DT;p.y+=p.vy*DT;
    b.x=p.x+k.fx*(PR+BR+0.06);b.y=p.y+k.fy*(PR+BR+0.06);b.z=0;b.vx=p.vx;b.vy=p.vy;b.vz=0;
   }else if(!k.burst){
    k.burst=true;const a=Math.atan2(k.fy,k.fx)+k.side*0.78,dx=Math.cos(a),dy=Math.sin(a);k.dx=dx;k.dy=dy;
    b.vx=dx*7.4;b.vy=dy*7.4;b.lastTouch=p.id;b.lastTeam=p.team;
    p.vx=dx*p.maxSpd*1.2;p.vy=dy*p.maxSpd*1.2;p.face=a;
    // el amague engaña a los rivales que estaban de frente
    for(const q of s.players)if(q.team!==p.team&&q.role!=='gk'){const rx=q.x-p.x,ry=q.y-p.y,dd=Math.hypot(rx,ry);if(dd<2.6&&(rx*k.fx+ry*k.fy)>0){q.stunT=Math.max(q.stunT,0.32);s.events.push({t:'feint',id:q.id});}}
    s.events.push({t:'kick',id:p.id,team:p.team,power:7,x:b.x,y:b.y,vx:b.vx,vy:b.vy});
   }else{p.vx=k.dx*p.maxSpd*1.15;p.vy=k.dy*p.maxSpd*1.15;p.x+=p.vx*DT;p.y+=p.vy*DT;}
  }
  else if(k.type==='chilena'){
   p.vx*=0.85;p.vy*=0.85;p.x+=p.vx*DT;p.y+=p.vy*DT;
   if(!k.hit&&k.t>=0.15){
    k.hit=true;const d=Math.hypot(b.x-p.x,b.y-p.y);
    if(d<PR+BR+1.2&&b.z<2.7){const spd=p.shot*0.95;b.vx=-k.fx*spd;b.vy=-k.fy*spd;b.vz=2.2;b.spin=0;b.lastTouch=p.id;b.lastTeam=p.team;
     s.events.push({t:'kick',id:p.id,team:p.team,power:spd,x:b.x,y:b.y,vx:b.vx,vy:b.vy});}
   }
  }
  if(k.t>=k.dur){if(k.type==='chilena')p.stunT=Math.max(p.stunT,0.7);p.skill=null;}
 }
 function ballPlayers(s){
  const b=s.ball;if(b.ghost>0)b.ghost-=DT;if(b.holder>=0)return;
  // el orden se alterna en cada tick para que ningún equipo tenga ventaja por ir primero
  for(const p of (s.tick&1?s.players.slice().reverse():s.players)){
   if(b.z>1.75||b.ghost>0)continue;
   if(p.skill&&!(p.skill.type==='stepover'&&p.skill.burst))continue;
   const r=(p.dive?p.reach:p.slideT>0?PR+0.22:PR)+BR;
   const dx=b.x-p.x,dy=b.y-p.y,d=Math.hypot(dx,dy);
   if(d>=r)continue;
   let nx,ny;if(d<1e-6){nx=Math.cos(p.face);ny=Math.sin(p.face);}else{nx=dx/d;ny=dy/d;}
   if(p.role==='gk'&&inOwnBox(s,p)&&s.phase!=='goal'&&(!p.hgk||p.grab)){
    const rel=Math.hypot(b.vx-p.vx,b.vy-p.vy);
    if(rel<(p.dive?9:7.5)&&b.z<(p.dive?1.5:1.9)){b.holder=p.id;p.holdT=0;b.lastTouch=p.id;b.lastTeam=p.team;b.spin=0;b.vx=b.vy=b.vz=0;s.events.push({t:'catch',v:rel,id:p.id,team:p.team});return;}
   }
   b.x=p.x+nx*r;b.y=p.y+ny*r;
   if(p.slideT>0){
    const v=Math.max(9,Math.hypot(p.vx,p.vy)*1.15);
    b.vx=p.slideDx*v+nx*2.5;b.vy=p.slideDy*v+ny*2.5;b.vz=Math.max(b.vz,0.8);b.spin=0;
    if(!p.slideClean)s.events.push({t:'tackle',id:p.id});
    p.slideClean=true;b.lastTouch=p.id;b.lastTeam=p.team;continue;
   }
   const vn=(b.vx-p.vx)*nx+(b.vy-p.vy)*ny;
   if(vn<0){
    const soft=b.lastTouch===p.id&&p.hx&&!p.spr&&p.role!=='gk'&&-vn<9&&Math.abs(b.x)<s.L/2-0.9&&Math.abs(b.y)<s.W/2-0.9;
    const e=p.role==='gk'?(p.dive?0.45:0.3):soft?Math.max(0.08,0.2-0.07*p.ctrl):p.bounce;
    b.vx-=(1+e)*vn*nx;b.vy-=(1+e)*vn*ny;if(b.z>0.05)b.vz*=0.4;b.spin*=0.3;
    if(soft){const tx=b.vx-p.vx-((b.vx-p.vx)*nx+(b.vy-p.vy)*ny)*nx,ty=b.vy-p.vy-((b.vx-p.vx)*nx+(b.vy-p.vy)*ny)*ny,k=0.22+0.1*p.ctrl;b.vx-=tx*k;b.vy-=ty*k;
     if((p.wantX||p.wantY)&&-vn>2&&b.lastTouch!==p.id){
      // control orientado: el primer toque la acomoda adelante tuyo, para el lado que apuntás
      p.dragT=0.32;p.dragX=p.wantX;p.dragY=p.wantY;p.dragSlow=0.75;s.events.push({t:'dtouch',x:b.x,y:b.y});}}
    s.events.push({t:'touch',v:-vn,gk:p.role==='gk',id:p.id,team:p.team});
   }
   b.lastTouch=p.id;b.lastTeam=p.team;
  }
 }

 // conducción con toquecitos: cuando la pelota llega al pie, el jugador la empuja un poco hacia adelante,
 // se separa y la vuelve a alcanzar. No queda pegada: si girás de golpe o te frenás, la pelota sigue sola.
 function dribble(s){
  for(const q of s.players){if(q.dribCd>0)q.dribCd-=DT;if(q.dragT>0)q.dragT-=DT;}
  const b=s.ball;if(b.holder>=0||b.z>0.3||s.phase!=='play')return;
  // arrastre en curso: la pelota va con la suela hasta quedar adelante, en la dirección nueva
  for(const p of s.players){
   if(!(p.dragT>0))continue;
   if(b.lastTouch!==p.id||p.stunT>0||p.slideT>0){p.dragT=0;continue;}
   const tx=p.x+p.dragX*(PR+BR+0.12),ty=p.y+p.dragY*(PR+BR+0.12),ex=tx-b.x,ey=ty-b.y,el=Math.hypot(ex,ey);
   let vx=ex*10,vy=ey*10;const vl=Math.hypot(vx,vy),cap=4.5+p.ctrl;if(vl>cap){vx*=cap/vl;vy*=cap/vl;}
   b.vx=p.vx+vx;b.vy=p.vy+vy;b.spin=0;
   if(el<0.1){p.dragT=0;p.dribCd=0.08;}
   return;
  }
  if(Math.abs(b.x)>s.L/2-1.2||Math.abs(b.y)>s.W/2-1.2)return;
  let best=null,bd=1e9;for(const p of (s.tick&1?s.players.slice().reverse():s.players)){const d=Math.hypot(b.x-p.x,b.y-p.y);if(d<bd){bd=d;best=p;}}
  const p=best;if(!p||p.role==='gk'||bd>PR+BR+(p.wantX||p.wantY?0.36:0.55)||p.slideT>0||p.skill||p.stunT>0||p.dive||p.charging||b.lastTouch!==p.id)return;
  const sp=Math.hypot(p.vx,p.vy);
  const fx=Math.cos(p.face),fy=Math.sin(p.face),dx=(b.x-p.x)/bd,dy=(b.y-p.y)/bd;
  if(fx*dx+fy*dy<0.05)return;
  for(const q of s.players)if(q!==p&&Math.hypot(b.x-q.x,b.y-q.y)<PR+BR+0.45)return;
  // pisada: soltaste la dirección con la pelota al pie → la frenás con la suela
  if(!p.wantX&&!p.wantY){
   if(Math.hypot(b.vx,b.vy)<8&&(p.pisT||0)<0.35){const k=0.45+0.1*p.ctrl;b.vx+=(p.vx-b.vx)*k;b.vy+=(p.vy-b.vy)*k;if(!p.pisT)s.events.push({t:'dtouch',x:b.x,y:b.y});p.pisT=(p.pisT||0)+DT;}
   return;
  }
  p.pisT=0;
  if(sp<1.2&&!(p.hx&&p.wantX*fx+p.wantY*fy<-0.35))return;
  // arrastre: tirás para atrás con la pelota adelante → la traés con la suela mientras te das vuelta
  if(p.hx&&p.wantX*fx+p.wantY*fy<-0.35){
   if(p.dragT>0)return;
   // se guarda hacia dónde quiere salir; la pelota se lleva con la suela hasta quedar adelante
   p.dragT=0.5;p.dragX=p.wantX;p.dragY=p.wantY;p.dragSlow=0.4;p.dribCd=0.1;s.events.push({t:'dtouch',x:b.x,y:b.y});return;
  }
  // hacia dónde: adónde quiere ir (el control) y, si no, adónde mira
  let ux=p.wantX||fx,uy=p.wantY||fy;ux=ux*0.75+fx*0.25;uy=uy*0.75+fy*0.25;const ul=Math.hypot(ux,uy)||1;ux/=ul;uy/=ul;
  const bv=Math.hypot(b.vx,b.vy),turnNeed=bv>0.5?1-(b.vx*ux+b.vy*uy)/bv:0;
  if(p.dribCd>0&&turnNeed<0.12)return;
  if(turnNeed<0.12&&(b.vx-p.vx)*ux+(b.vy-p.vy)*uy>0.9)return; // ya va adelante
  const knock=sp/p.maxSpd,push=(0.38+0.55*knock)*(p.spr?2.2:1)*(1-0.3*p.ctrl);
  // el toque lleva la pelota en la dirección nueva (así se dobla con la pelota)
  const base=Math.max(sp*0.86,(p.vx*ux+p.vy*uy)*0.94);
  b.vx=ux*(base+push);b.vy=uy*(base+push);b.spin=0;
  p.dribCd=0.16;s.events.push({t:'dtouch',x:b.x,y:b.y});
 }
 function unjam(s){
  const b=s.ball;if(b.holder>=0||s.phase!=='play'){s.jam=0;return;}
  const L2=s.L/2,W2=s.W/2,inCorner=Math.abs(b.x)>L2-1.3&&Math.abs(b.y)>W2-1.3,nearWall=inCorner||Math.abs(b.y)>W2-BR-0.25||(Math.abs(b.x)>L2-BR-0.25&&Math.abs(b.y)>s.G/2);
  let near=0;for(const p of s.players)if(Math.hypot(p.x-b.x,p.y-b.y)<PR+BR+0.25)near++;
  if(nearWall&&near>0&&Math.hypot(b.vx,b.vy)<(inCorner?6:4)&&b.z<0.3)s.jam=(s.jam||0)+DT;else s.jam=Math.max(0,(s.jam||0)-DT*2);
  if(s.jam>(inCorner?0.55:1.1)){let dx=-b.x*0.6,dy=-b.y;const l=Math.hypot(dx,dy)||1;b.vx=dx/l*6.5;b.vy=dy/l*6.5;b.vz=4.2;b.z=0.05;b.spin=0;b.ghost=0.3;s.jam=0;s.events.push({t:'bounce'});}
 }
 function checkGoal(s){
  if(s.phase!=='play'&&s.phase!=='kickoff')return;
  const b=s.ball,L2=s.L/2;let team=-1;
  if(b.x>L2+BR&&Math.abs(b.y)<s.G/2&&b.gs===1&&b.z<BAR)team=0;else if(b.x<-L2-BR&&Math.abs(b.y)<s.G/2&&b.gs===-1&&b.z<BAR)team=1;
  if(team<0)return;
  s.score[team]++;
  const sc=b.lastTouch>=0?s.players[b.lastTouch]:null;const own=!!sc&&sc.team!==team;
  const t=s.golden?s.duration+s.ot:s.duration-s.clock;
  s.scorers.push({team,name:sc?sc.name:'—',own,t,golden:s.golden});
  s.events.push({t:'goal',team,name:sc?sc.name:'',own});
  s.phase='goal';s.phaseT=0;s.kickoffTeam=1-team;s.lastGoalTeam=team;
  if(s.golden||(s.cap>0&&s.score[team]>=s.cap))s.pendingEnd=true;
 }

 function perceive(s,delay){const i=((s.tick-delay)%HN+HN)%HN;return s.hist[i]||s.ball;}
 return{KR,DT,PR,BR,GD,BAR,RC,FORMATS,createMatch,step,perceive,clamp,previewKick};
})();

/* =====================================================================
   AI — produce inputs igual que un humano (mismas reglas, sin trampas).
   ===================================================================== */
const AI=(()=>{
 const{PR,BR,DT,clamp,perceive}=SIM;
 const DIFF={easy:{delay:12,spd:0.8,range:11,aim:0.45,slide:0,pass:0},normal:{delay:8,spd:0.9,range:14,aim:0.85,slide:1,pass:1},hard:{delay:5,spd:1,range:16,aim:1,slide:1.4,pass:1}};
 const blank=()=>({mx:0,my:0,kick:false,lob:false,sprint:false,dive:false,slide:false,skill:false,sx:0,sy:0});
 function moveTo(inp,p,tx,ty,spd,urgent){
  const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);if(d<0.12)return;
  const m=Math.min(1,d/1.1)*spd;inp.mx=dx/d*m;inp.my=dy/d*m;inp.sprint=!!urgent&&d>3.5&&p.stam>0.4;
 }
 function field(s,p,diffName){
  const D=DIFF[diffName]||DIFF.normal,inp=blank();
  if(s.phase==='goal'||s.phase==='end')return inp;
  const b=perceive(s,D.delay),side=p.team===0?-1:1,L2=s.L/2;
  const atkX=-side*L2,ownX=side*L2,ball=s.ball;
  const mates=s.players.filter(q=>q.team===p.team&&q.role!=='gk');
  let best=null,bd=1e9;for(const q of mates){const d=Math.hypot(q.x-b.x,q.y-b.y);if(d<bd){bd=d;best=q;}}
  const oppHolds=ball.holder>=0;
  if(best!==p||oppHolds){
   const idx=mates.indexOf(p);let tx,ty;
   if(b.x*side>0){tx=ownX+(b.x-ownX)*0.5;ty=b.y*0.5+(idx%2?1:-1)*2.2;}
   else{tx=clamp(b.x-side*5,-L2+3,L2-3);ty=(b.y>0?-1:1)*s.W*0.22+(idx%2?1:-1)*1.2;}
   moveTo(inp,p,tx,ty,D.spd,false);return inp;
  }
  if(s.phase==='kickoff'&&s.kickoffTeam!==p.team)return inp;
  // barrida: rival con la pelota, yo cerca y de frente a ella
  if(D.slide>0&&p.recoverT<=0&&p.stunT<=0){
   const opp=s.players.filter(q=>q.team!==p.team&&q.role!=='gk');
   let oc=null,od=1e9;for(const q of opp){const d=Math.hypot(q.x-ball.x,q.y-ball.y);if(d<od){od=d;oc=q;}}
   const myD=Math.hypot(ball.x-p.x,ball.y-p.y);
   if(oc&&od<0.9&&myD<1.9*D.slide&&myD>0.7){
    const fx=(ball.x-p.x)/myD,fy=(ball.y-p.y)/myD;
    const along=Math.hypot(p.vx,p.vy)>1?(p.vx*fx+p.vy*fy)/Math.hypot(p.vx,p.vy):0;
    // solo barre si llega a la pelota antes que al rival
    const toOpp=Math.hypot(oc.x-p.x,oc.y-p.y);
    if(along>0.85&&toOpp>myD-0.1&&((s.tick+p.id*7)%40)<6*D.slide){inp.mx=fx;inp.my=fy;inp.slide=true;return inp;}
   }
  }
  const kp=(s.players.find(q=>q.team!==p.team&&q.role==='gk')||{y:0}).y;
  const aimY=(kp>0?-1:1)*(s.G/2-0.7)*D.aim;
  let dx=atkX-b.x,dy=aimY-b.y;let distGoal=Math.hypot(dx,dy)||1;dx/=distGoal;dy/=distGoal;
  // pase: si no hay tiro y un compañero está más adelantado con la línea libre
  let passTo=null;
  if(D.pass&&distGoal>D.range){
   for(const q of mates){
    if(q===p)continue;
    const adv=(q.x-b.x)*(-side);if(adv<3)continue;
    const lx=q.x-b.x,ly=q.y-b.y,ll=Math.hypot(lx,ly);if(ll>18)continue;
    let clear=true;
    for(const o of s.players){if(o.team===p.team)continue;const t=clamp(((o.x-b.x)*lx+(o.y-b.y)*ly)/(ll*ll),0,1);if(Math.hypot(b.x+lx*t-o.x,b.y+ly*t-o.y)<1.3){clear=false;break;}}
    if(clear&&(!passTo||adv>passTo.adv))passTo={q,adv,ll};
   }
   if(passTo){const tx=passTo.q.x+passTo.q.vx*0.5,ty=passTo.q.y+passTo.q.vy*0.5;dx=tx-b.x;dy=ty-b.y;const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;}
  }
  // pelota pegada a una valla: conducirla a lo largo de la pared (no se puede llegar por detrás)
  const W2=s.W/2,RC=SIM.RC,mg=0.95;let nwx=0,nwy=0,onWall=false;
  const abx=Math.abs(b.x),aby=Math.abs(b.y);
  if(abx>L2-BR-mg-0.4&&aby>W2-BR-mg-0.4&&aby>s.G/2){onWall=true;nwx=-Math.sign(b.x)*Math.SQRT1_2;nwy=-Math.sign(b.y)*Math.SQRT1_2;}
  else if(aby>W2-BR-mg){onWall=true;nwx=0;nwy=-Math.sign(b.y);}
  else if(abx>L2-BR-mg&&aby>s.G/2){onWall=true;nwx=-Math.sign(b.x);nwy=0;}
  const ix=onWall?1:0,iy=0;
  if(onWall){
   let tx=-nwy,ty=nwx;
   const pref=nwy===0?{x:0,y:-Math.sign(b.y)}:{x:Math.sign(atkX-b.x),y:0};
   if(tx*pref.x+ty*pref.y<0){tx=-tx;ty=-ty;}
   dx=tx+0.3*nwx;dy=ty+0.3*nwy;const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
  }
  const rx=p.x-b.x,ry=p.y-b.y,ahead=rx*dx+ry*dy;
  const reach=PR+BR+0.12;
  if(ahead>-0.2){
   const px=-dy,py=dx,sg=(rx*px+ry*py)>=0?1:-1;
   moveTo(inp,p,b.x-dx*1.1+px*sg,b.y-dy*1.1+py*sg,D.spd,true);
   if(p.charging)inp.kick=false;return inp;
  }
  const ax=clamp(b.x-dx*reach,-L2+PR,L2-PR),ay=clamp(b.y-dy*reach,-W2+PR,W2-PR),toA=Math.hypot(ax-p.x,ay-p.y);
  if(toA>0.5)moveTo(inp,p,ax,ay,D.spd,true);else{inp.mx=dx*D.spd;inp.my=dy*D.spd;}
  const dBall=Math.hypot(ball.x-p.x,ball.y-p.y);
  const align=dBall>1e-6?((ball.x-p.x)*dx+(ball.y-p.y)*dy)/dBall:0;
  const inReach=dBall<SIM.KR+0.05;
  const aimed=dBall<=SIM.KR&&align>0.93-0.05*(1-D.aim);
  if(passTo&&(toA<0.9||(inReach&&align>0.6))){
   const need=clamp(0.15+passTo.ll/30,0.2,0.6);
   if(!p.charging||p.charge<need||(!aimed&&p.charge<0.84))inp.kick=true;
  }else if(distGoal<D.range&&(toA<0.9||(inReach&&align>0.6))){
   const need=clamp(0.4+distGoal/22,0.45,0.8);
   if(!p.charging||p.charge<need||(!aimed&&p.charge<0.84))inp.kick=true;
  }else if(inReach&&align>0.35&&(toA>0.5||ix||iy)){
   // pelota trabada (valla, rival encima): despejarla con un toque
   if(!p.charging||p.charge<0.3)inp.kick=true;
  }else{
   // rival cerca adelante: globo por encima
   const blocker=s.players.some(q=>q.team!==p.team&&q.role!=='gk'&&((q.x-p.x)*dx+(q.y-p.y)*dy)>0&&Math.hypot(q.x-p.x,q.y-p.y)<1.8);
   if(blocker&&toA<0.9&&D.pass&&!p.charging&&((s.tick+p.id*13)%5===0)&&p.skillCd<=0){inp.skill=true;const sd=((s.tick>>4)&1)?1:-1;inp.sx=-dy*sd;inp.sy=dx*sd;}
   else if(blocker&&toA<0.9&&(!p.charging||p.charge<0.4))inp.lob=true;
  }
  return inp;
 }
 function keeper(s,p,diffName){
  const inp=blank(),side=p.team===0?-1:1,L2=s.L/2,gx=side*L2,ball=s.ball;
  if(ball.holder===p.id){
   let tgt=null,bestAdv=-1e9;for(const q of s.players)if(q.team===p.team&&q.role!=='gk'){const adv=-side*q.x;if(adv>bestAdv){bestAdv=adv;tgt=q;}}
   let ax=-side,ay=0;if(tgt){ax=tgt.x-p.x;ay=tgt.y-p.y;const l=Math.hypot(ax,ay)||1;ax/=l;ay/=l;}
   inp.mx=ax*0.45;inp.my=ay*0.45;inp.kick=p.holdT<0.7;return inp;
  }
  if(s.phase==='goal'||s.phase==='end')return inp;
  const dl=Math.max(2,p.delay),b=perceive(s,dl),b2=perceive(s,dl+3);
  const vx=(b.x-b2.x)/(3*DT),vy=(b.y-b2.y)/(3*DT),sp=Math.hypot(vx,vy);
  if(vx*side>0&&sp>5&&!p.dive){
   const t=(p.x-b.x)/vx;
   if(t>0&&t<0.6){
    const py=b.y+vy*t;
    if(Math.abs(py)<s.G/2+0.8){
     const dy=py-p.y,walk=p.maxSpd*t*0.7+PR;
     if(Math.abs(dy)>walk&&t<0.42&&b.z<1.6){inp.dive=true;inp.mx=-side*0.25;inp.my=Math.sign(dy);return inp;}
     moveTo(inp,p,p.x,SIM.clamp(py,-s.G/2,s.G/2),1,false);return inp;
    }
   }
  }
  const inBox=Math.abs(b.x-gx)<5&&Math.abs(b.y)<s.G/2+2.5;
  if(inBox&&Math.hypot(ball.vx,ball.vy)<5&&ball.holder<0){
   let closest=true;const dk=Math.hypot(ball.x-p.x,ball.y-p.y);
   for(const q of s.players)if(q!==p&&Math.hypot(ball.x-q.x,ball.y-q.y)<dk)closest=false;
   if(closest){moveTo(inp,p,ball.x,ball.y,1,true);return inp;}
  }
  const bdx=b.x-gx,bdy=b.y,bl=Math.hypot(bdx,bdy)||1;
  const dist=clamp(0.7+bl*0.06,0.7,2.2);
  moveTo(inp,p,gx+bdx/bl*dist,clamp(bdy/bl*dist*1.4,-s.G/2+0.3,s.G/2-0.3),1,false);
  return inp;
 }
 return{field,keeper};
})();

/* =====================================================================
   PENALES — lógica pura (sin pantalla). Coordenadas del arco vistas desde el pateador:
   x = lateral (−3.66 palo izquierdo … +3.66 palo derecho), y = altura (0 … 2.44), distancia 11 m.
   Nada se decide con un dado: el resultado sale de dónde fue la pelota, con qué fuerza,
   y de para dónde y cuándo se tiró el arquero.
   ===================================================================== */
const PEN=(()=>{
 const W=3.66,H=2.44,D=11,BR=0.11;
 const clamp=(v,a,b)=>v<a?a:v>b?b:v;
 const sf=v=>clamp((v-75)/25,-1,1);
 const ease=p=>1-(1-p)*(1-p);
 // Estado del arquero en un instante (tiempo desde la patada). dive.t = cuándo se tiró, relativo a la patada (negativo = antes).
 function keeperAt(dive,tk,gk){
  const rf=1+(gk.reach-80)/180,spd=1+(gk.refl-80)/180;
  const out={kx:0,half:0.72*rf,lo:0,hi:2.0,e:0,side:0,dy:0};
  if(!dive)return out;
  const dt=tk-dive.t;if(dt<=0)return out;
  const e=ease(Math.min(1,dt/(0.5/spd)));out.e=e;out.dy=dive.dy;
  if(Math.abs(dive.dx)>0.3){
   out.side=Math.sign(dive.dx);out.kx=out.side*2.6*rf*e;out.half=(0.58+0.22*e)*rf;
   if(dive.dy>0.3){out.lo=0.6*e;out.hi=2.0+0.5*e;}
   else if(dive.dy<-0.3){out.lo=0;out.hi=2.0-0.6*e;}
   else{out.lo=0.15*e;out.hi=2.0+0.15*e;}
  }else if(dive.dy>0.3){out.hi=2.0+0.5*e;out.half=0.85*rf;}
  else if(dive.dy<-0.3){out.hi=2.0-0.7*e;out.half=(0.72+0.25*e)*rf;}
  return out;
 }
 function resolve(shot,dive,gk){
  const ax=Math.abs(shot.x);
  if(shot.y>H+BR*0.7)return{r:'over'};
  if(ax>W+BR*0.7)return{r:'wide'};
  if(ax>W-BR*1.3)return{r:'post'};
  if(shot.y>H-BR*1.3)return{r:'bar'};
  const T=D/shot.speed,k=keeperAt(dive,T,gk);
  const saved=Math.abs(shot.x-k.kx)<=k.half&&shot.y>=k.lo&&shot.y<=k.hi;
  return{r:saved?'save':'goal',T};
 }
 const isGoal=r=>r==='goal';
 // Patada humana: mira + pulso (que el control del jugador achica) + carga.
 function humanShot(aim,charge,shooter,swayOn,time){
  const ctrl=sf(shooter.st[3]),tiro=sf(shooter.st[2]);
  const perfect=charge>=0.76&&charge<=0.86;
  const A=swayOn?0.42*(1-0.45*ctrl)*(perfect?0.4:1):0;
  const sx=Math.sin(time*2.1)*A,sy=Math.cos(time*1.6)*A*0.6;
  const p=clamp(charge/0.75,0,1);
  let y=aim.y+sy;if(charge>0.86)y+=(charge-0.86)*7;
  return{x:aim.x+sx,y:Math.max(0.05,y),speed:(15+14*Math.pow(p,1.1))*(1+0.08*tiro),perfect};
 }
 function sway(shooter,time,charge){const ctrl=sf(shooter.st[3]);const perfect=charge>=0.76&&charge<=0.86;const A=0.42*(1-0.45*ctrl)*(perfect?0.4:1);return{x:Math.sin(time*2.1)*A,y:Math.cos(time*1.6)*A*0.6};}
 const sideOf=x=>x<-0.8?0:x>0.8?2:1;
 function pickW(w,r){const s=w.reduce((a,b)=>a+b,0);let v=r()*s;for(let i=0;i<w.length;i++){v-=w[i];if(v<=0)return i;}return w.length-1;}
 // Arquero CPU: elige lado leyendo hacia dónde patea el rival habitualmente; reacciona según sus reflejos.
 function cpuDive(gk,shotHist,r){
  const c=[0,0,0];for(const x of shotHist.slice(-6))c[sideOf(x)]++;
  const s=pickW([1+c[0]*1.3,0.45+c[1]*0.9,1+c[2]*1.3],r);
  const dy=r()<0.3?1:r()<0.4?-1:0;
  const t=0.12+0.08*(1-clamp((gk.refl-75)/25,0,1));
  return{dx:s===0?-1:s===2?1:0,dy:s===1&&dy===0?(r()<0.5?-1:0):dy,t};
 }
 // Pateador CPU: evita el lado al que más se tira el arquero; si el arquero se movió antes, patea al otro lado.
 function cpuShot(shooter,diveHist,earlyDive,r){
  const c=[0,0,0];for(const d of diveHist.slice(-6))c[d<0?0:d>0?2:1]++;
  let s=pickW([1+c[2]*1.3,0.5+c[0]*0.2+c[2]*0.2,1+c[0]*1.3],r);
  if(earlyDive&&Math.abs(earlyDive.dx)>0.3)s=earlyDive.dx<0?2:0;
  const acc=sf(shooter.st[2]),ctrl=sf(shooter.st[3]);
  let x=s===0?-(2.2+r()*1.1):s===2?(2.2+r()*1.1):(r()-0.5)*0.9;
  let y=r()<0.3?1.5+r()*0.8:0.2+r()*1.0;
  const err=(1-0.35*(acc+ctrl));
  x+=(r()-0.5)*0.9*err;y+=(r()-0.5)*0.6*err;
  const p=0.72+r()*0.24;
  return{x,y:Math.max(0.05,y),speed:(15+14*Math.pow(p,1.1))*(1+0.08*acc),perfect:false};
 }
 // Tanda completa CPU vs CPU (para los partidos que no juega el usuario)
 function autoShootout(ta,tb,r){
  const order=[ta,tb].map(t=>[...t.players].sort((a,b)=>b.st[2]-a.st[2]));
  const res=[[],[]],hist={shots:[[],[]],dives:[[],[]]};
  for(let k=0;k<40;k++){
   const team=k%2,kt=1-team,sh=order[team][res[team].length%order[team].length],gk=[ta,tb][kt].gk;
   const shot=cpuShot(sh,hist.dives[kt],null,r),dive=cpuDive(gk,hist.shots[team],r);
   res[team].push(isGoal(resolve(shot,dive,gk).r));hist.shots[team].push(shot.x);hist.dives[kt].push(dive.dx);
   if(decided(res))break;
  }
  return[res[0].filter(Boolean).length,res[1].filter(Boolean).length];
 }
 function decided(res){
  const a=res[0].filter(Boolean).length,b=res[1].filter(Boolean).length,ka=res[0].length,kb=res[1].length;
  if(ka<=5&&kb<=5){if(a+(5-ka)<b||b+(5-kb)<a)return true;if(ka===5&&kb===5)return a!==b;return false;}
  return ka===kb&&a!==b;
 }
 return{W,H,D,BR,keeperAt,resolve,isGoal,humanShot,sway,cpuDive,cpuShot,autoShootout,decided};
})();

/* @@DOM — de acá para abajo: input, render, audio e interfaz */
if(typeof document!=='undefined'){

/* ===================== INPUT ===================== */
const keys=new Set(),tapped=new Set(); // tapped: toques rapidísimos que caen entre dos ticks
const PROFILES={
 1:{up:['KeyW'],down:['KeyS'],left:['KeyA'],right:['KeyD'],kick:['Space'],lob:['KeyE'],slide:['KeyQ'],sprint:['ShiftLeft'],skill:['KeyR']},
 2:{up:['ArrowUp'],down:['ArrowDown'],left:['ArrowLeft'],right:['ArrowRight'],kick:['Enter','Numpad0','NumpadEnter'],lob:['ShiftRight','NumpadDecimal'],slide:['ControlRight','Numpad2','Period'],sprint:['Slash','Numpad1'],skill:['Quote','NumpadAdd','Numpad3']}
};
const GAME_KEYS=new Set(Object.values(PROFILES).flatMap(p=>Object.values(p).flat()));
const padPrev={},skillPrev={},padStickPrev={};
// Controles táctiles: se suman al jugador 1. Multitáctil con pointer events (cada dedo tiene su id).
const touch={on:('ontouchstart' in window)||navigator.maxTouchPoints>0||(window.matchMedia&&matchMedia('(pointer: coarse)').matches),mx:0,my:0,joyId:null,ox:0,oy:0,held:{},tap:{}};
// Algunos navegadores (o la página donde se publica el juego) bloquean el joystick y getGamepads() tira error:
// en ese caso se juega solo con teclado, sin congelar el partido.
let padsBlocked=false;
function getPads(){if(padsBlocked||!navigator.getGamepads)return[];try{return navigator.getGamepads()||[];}catch(e){padsBlocked=true;return[];}}
function readHuman(slot){
 // k: teclas mantenidas (movimiento, sprint). kt: además cuenta toques rapidísimos, SOLO para acciones.
 const P=PROFILES[slot],k=a=>a.some(c=>keys.has(c)),kt=a=>a.some(c=>keys.has(c)||tapped.has(c));
 let mx=(k(P.right)?1:0)-(k(P.left)?1:0),my=(k(P.down)?1:0)-(k(P.up)?1:0);
 let kick=kt(P.kick),lob=kt(P.lob),sprint=k(P.sprint),slide=kt(P.slide);
 // filigrana: mantené la tecla de filigrana y tocá una dirección (o mové el stick derecho)
 let skill=false,sx=0,sy=0;
 let sdx=(k(P.right)?1:0)-(k(P.left)?1:0),sdy=(k(P.down)?1:0)-(k(P.up)?1:0),skillHeld=k(P.skill);
 const T=slot===1&&touch.on;
 if(T){
  const jm=Math.hypot(touch.mx,touch.my);
  if(jm>0.15){mx=touch.mx;my=touch.my;}
  kick=kick||!!touch.held.kick||!!touch.tap.kick;lob=lob||!!touch.held.lob||!!touch.tap.lob;slide=slide||!!touch.held.slide||!!touch.tap.slide;sprint=sprint||!!touch.held.sprint;
  if(touch.held.skill){skillHeld=true;if(jm>0.5){sdx=Math.abs(touch.mx)>0.38*jm?Math.sign(touch.mx):0;sdy=Math.abs(touch.my)>0.38*jm?Math.sign(touch.my):0;}}
  touch.tap={};
 }
 const combo=skillHeld&&(sdx||sdy)?sdx+','+sdy:'';
 if(combo&&combo!==skillPrev[slot]){skill=true;sx=sdx;sy=sdy;}
 skillPrev[slot]=combo;
 const pads=getPads();const gp=pads[slot-1];
 if(gp){
  const rx=gp.axes[2]||0,ry=gp.axes[3]||0,rm=Math.hypot(rx,ry);
  if(rm>0.75&&!(padStickPrev[slot]>0.75)){skill=true;sx=rx;sy=ry;}
  padStickPrev[slot]=rm;
  const ax=gp.axes[0]||0,ay=gp.axes[1]||0;if(Math.hypot(ax,ay)>0.22){mx=ax;my=ay;}
  const bt=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed);
  if(bt(14))mx=-1;if(bt(15))mx=1;if(bt(12))my=-1;if(bt(13))my=1;
  kick=kick||bt(0);lob=lob||bt(2);slide=slide||bt(1);sprint=sprint||bt(7)||bt(5);
  const st=bt(9);if(st&&!padPrev[slot])togglePause();padPrev[slot]=st;
 }
 for(const a of [P.kick,P.lob,P.slide])for(const c of a)tapped.delete(c);
 const l=Math.hypot(mx,my);if(l>1){mx/=l;my/=l;}
 return{mx,my,kick,lob,sprint,slide,dive:false,skill,sx,sy,hx:true};
}
// Cada tecla se reconoce de dos formas: por su posición física (e.code) y por la letra que escribe (e.key).
// Algunos teclados, escritorios remotos o vistas embebidas mandan una sola de las dos.
function codesOf(e){
 const out=[];if(e.code)out.push(e.code);
 const k=e.key||'';
 if(k.length===1&&/[a-z]/i.test(k))out.push('Key'+k.toUpperCase());
 else if(k===' '||k==='Spacebar')out.push('Space');
 else if(k.startsWith('Arrow'))out.push(k);
 else if(k==='Shift')out.push(e.location===2?'ShiftRight':'ShiftLeft');
 else if(k==='Control')out.push(e.location===2?'ControlRight':'ControlLeft');
 else if(k==='Enter')out.push('Enter');
 else if(k==='Escape'||k==='Esc')out.push('Escape');
 else if(k==='/')out.push('Slash');else if(k==='.')out.push('Period');
 return[...new Set(out)];
}
const keyLog=[];
function actionOf(c){for(const[slot,P]of Object.entries(PROFILES))for(const[act,list]of Object.entries(P))if(list.includes(c))return'P'+slot+' '+({up:'arriba',down:'abajo',left:'izquierda',right:'derecha',kick:'patear',lob:'globo',slide:'barrida',sprint:'sprint'}[act]);return'—';}
addEventListener('keydown',e=>{
 const cs=codesOf(e);
 if(game&&!game.demo&&cs.some(c=>GAME_KEYS.has(c)))e.preventDefault();
 for(const c of cs){keys.add(c);if(!e.repeat)tapped.add(c);}
 if(!e.repeat){keyLog.unshift(`${e.key===' '?'Espacio':e.key}  ·  ${e.code||'(sin código)'}  →  ${actionOf(cs[cs.length-1]||'')!=='—'?actionOf(cs[cs.length-1]):actionOf(cs[0]||'')}`);keyLog.length=Math.min(keyLog.length,6);const el=document.getElementById('keyTest');if(el)el.textContent=keyLog.join('\n');}
 if(cs.includes('Escape')&&!e.repeat)togglePause();
 if(cs.includes('KeyM')&&!e.repeat)muted=!muted;
},true);
addEventListener('keyup',e=>{const cs=codesOf(e);for(const c of cs)keys.delete(c);if(game&&!game.demo&&cs.some(c=>GAME_KEYS.has(c)))e.preventDefault();},true);
// Si la ventana del juego pierde el foco, el navegador deja de mandarle las teclas: pausamos y avisamos.
addEventListener('blur',()=>{keys.clear();tapped.clear();if(game&&!game.demo&&!game.paused&&!game.netMenu&&game.state.phase!=='end'){togglePause(true);}});

/* ===================== RENDER ===================== */
const LW=540,LH=300,YC=0.72,ZC=0.85;
const screen=document.getElementById('screen'),sctx=screen.getContext('2d');
const buf=document.createElement('canvas');buf.width=LW;buf.height=LH;const bx=buf.getContext('2d');
let view=null,pitch=null,pitchKey='';
const DIG={0:['###','#.#','#.#','#.#','###'],1:['.#.','##.','.#.','.#.','###'],2:['###','..#','###','#..','###'],3:['###','..#','.##','..#','###'],4:['#.#','#.#','###','..#','..#'],5:['###','#..','###','..#','###'],6:['###','#..','###','#.#','###'],7:['###','..#','.#.','.#.','.#.'],8:['###','#.#','###','#.#','###'],9:['###','#.#','###','..#','###']};

function makeView(s){
 // cámara un poco abierta: deja lugar para que se vea el estadio entero alrededor de la cancha
 const ppm=Math.min((LW-150)/(s.L+2*SIM.GD+2.4),(LH-112)/((s.W+2.4)*YC+SIM.BAR*ZC));
 return{ppm,cx:LW/2,cy:LH/2+12};
}
function P(x,y,z=0){return[view.cx+x*view.ppm,view.cy+y*view.ppm*YC-z*view.ppm*ZC];}
function px(c,x,y,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),1,1);}
function pline(c,x0,y0,x1,y1,col){
 x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);c.fillStyle=col;
 const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
 for(let i=0;i<4000;i++){c.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}
}
function pellipse(c,cx,cy,rx,ry,col){const n=Math.max(24,Math.round((rx+ry)*3));c.fillStyle=col;let lx=null,ly=null;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,x=Math.round(cx+Math.cos(a)*rx),y=Math.round(cy+Math.sin(a)*ry);if(x!==lx||y!==ly)c.fillRect(x,y,1,1);lx=x;ly=y;}}
function hexMix(a,b,t){const pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16);const r=(pa>>16)*(1-t)+(pb>>16)*t,g=(pa>>8&255)*(1-t)+(pb>>8&255)*t,bl=(pa&255)*(1-t)+(pb&255)*t;return'#'+((1<<24)|(r<<16)|(g<<8)|bl).toString(16).slice(1).replace(/\..*/,'');}
function mix(a,b,t){const pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16);const ch=s=>Math.round(((pa>>s)&255)*(1-t)+((pb>>s)&255)*t);return`rgb(${ch(16)},${ch(8)},${ch(0)})`;}

/* ===================== ESTADIOS, HINCHADA Y FIESTA =====================
   Cada equipo juega de local en su estadio, dibujado a partir de su arquitectura real:
   cantidad de bandejas, palcos, tipo de techo y lo que lo sostiene (arco, mástiles, torres,
   pilones), iluminación, pista de atletismo, cabeceras y detalles únicos.
   Vista: tribuna de enfrente arriba, cabeceras a los costados (la popular local a la izquierda,
   los visitantes a la derecha) y la tribuna de atrás abajo. */
const ENDW=34; // ancho de las cabeceras
// n nombre · c ciudad · seats colores de butacas por bandeja · tiers bandejas · band separación entre bandejas
// roof techo: none|canti|ring|membrane|retract|wave · sup lo que lo sostiene · lights · track pista · ext detalle único
// shape: box|oval|bowl|cylinder · endL/endR cabeceras · seatMode 'sectors' (sectores de colores) · mosaic texto en butacas
const SD=(n,c,o)=>Object.assign({n,c,seats:['#888','#666'],tiers:2,band:'fascia',roof:'none',roofCol:'#d6d9de',sup:null,lights:'towers',track:null,ext:null,shape:'box',endL:'popular',endR:'std',seatMode:null,mosaic:null,motto:null},o);
const MONUMENTAL=SD('MÂS MONUMENTAL','Buenos Aires',{seats:['#D71920','#F4F4F2','#D71920'],tiers:3,band:'gap',shape:'oval',lights:'poles',endL:'popular',endR:'popular',seatMode:'stripes',motto:'NÚÑEZ'});
const MARACANA=SD('MARACANÃ','Río de Janeiro',{seats:['#FFD60A','#1D4CB3','#F4F4F2'],tiers:2,band:'gap',roof:'membrane',sup:'ringbeam',shape:'oval',lights:'roof',seatMode:'sectors',endL:'curve',endR:'curve'});
const SANSIRO=SD('SAN SIRO','Milán',{seats:['#c81d25','#1e5aa8','#2a9d4a','#e07b1a'],tiers:3,band:'gap',roof:'canti',roofCol:'#4b525a',sup:'towers',shape:'box',lights:'roof',seatMode:'sectors'});
const AZTECA=SD('ESTADIO AZTECA','Ciudad de México',{seats:['#9aa0a8','#b9bcc2'],tiers:2,band:'palcos',roof:'ring',roofCol:'#8d949d',shape:'oval',lights:'roof',endL:'curve',endR:'curve'});
const STADIUMS={
 boc:SD('LA BOMBONERA','Buenos Aires',{seats:['#0A2D7A','#F5C400','#0A2D7A'],tiers:3,band:'gap',ext:'boxwall',lights:'rim',shape:'box',endL:'steep',endR:'steep',motto:'LA 12'}),
 riv:MONUMENTAL,arg:Object.assign({},MONUMENTAL,{motto:'ARGENTINA'}),
 rac:SD('EL CILINDRO','Avellaneda',{seats:['#7DC4EA','#F4F4F2','#7DC4EA'],tiers:3,band:'gap',shape:'cylinder',lights:'rim',endL:'curve',endR:'curve',motto:'LA ACADEMIA'}),
 ind:SD('LIBERTADORES DE AMÉRICA','Avellaneda',{seats:['#D0021B','#D0021B'],tiers:2,band:'fascia',roof:'canti',roofCol:'#ececea',sup:'columns',lights:'roof',motto:'EL ROJO'}),
 slo:SD('NUEVO GASÓMETRO','Bajo Flores',{seats:['#0A2D7A','#D0021B'],tiers:2,band:'gap',lights:'towers',motto:'EL CICLÓN'}),
 est:SD('ESTADIO UNO','La Plata',{seats:['#E1001A','#F4F4F2'],tiers:2,band:'fascia',roof:'canti',roofCol:'#f0f0ec',sup:'truss',lights:'roof',motto:'EL PINCHA'}),
 vel:SD('JOSÉ AMALFITANI','Liniers',{seats:['#F4F4F2','#0A2D7A'],tiers:2,band:'gap',lights:'towers',motto:'EL FORTÍN'}),
 cen:SD('GIGANTE DE ARROYITO','Rosario',{seats:['#003DA5','#FFD100'],tiers:2,band:'gap',lights:'towers',motto:'LA CANALLA'}),
 nob:SD('COLOSO MARCELO BIELSA','Rosario',{seats:['#D0021B','#16161B'],tiers:2,band:'fascia',roof:'canti',roofCol:'#b9bcc2',sup:'columns',lights:'towers',motto:'LA LEPRA'}),
 tal:SD('MARIO ALBERTO KEMPES','Córdoba',{seats:['#0A2D7A','#F4F4F2'],tiers:2,band:'fascia',roof:'canti',roofCol:'#f2f2ee',sup:'cables',track:'#b5523b',shape:'oval',lights:'roof',endL:'curve',endR:'curve',motto:'LA T'}),
 bra:MARACANA,fla:Object.assign({},MARACANA,{motto:'MENGÃO'}),
 fra:SD('STADE DE FRANCE','Saint-Denis',{seats:['#1C2753','#9aa0a8','#1C2753'],tiers:3,band:'fascia',roof:'ring',roofCol:'#d9dbdf',sup:'needles',shape:'oval',lights:'roof',endL:'curve',endR:'curve'}),
 esp:SD('LA CARTUJA','Sevilla',{seats:['#C8102E','#FFC400'],tiers:2,band:'gap',roof:'canti',roofCol:'#e8e8e4',sup:'cables',track:'#c0563a',shape:'oval',lights:'roof',endL:'curve',endR:'curve'}),
 eng:SD('WEMBLEY','Londres',{seats:['#C8102E','#C8102E','#C8102E'],tiers:3,band:'fascia',roof:'retract',roofCol:'#d6d9de',sup:'arch',shape:'bowl',lights:'roof'}),
 ale:SD('OLYMPIASTADION','Berlín',{seats:['#3a4a63','#8d949d'],tiers:2,band:'gap',roof:'membrane',track:'#2457b8',shape:'oval',lights:'roof',endL:'curve',endR:'gate'}),
 por:SD('ESTÁDIO DA LUZ','Lisboa',{seats:['#C8102E','#C8102E','#C8102E'],tiers:3,band:'fascia',roof:'membrane',sup:'arches',shape:'bowl',lights:'roof'}),
 uru:SD('CENTENARIO','Montevideo',{seats:['#5CBFEB','#F4F4F2'],tiers:2,band:'gap',ext:'tower',shape:'oval',lights:'towers',endL:'curve',endR:'curve',motto:'LA OLÍMPICA'}),
 ned:SD('JOHAN CRUIJFF ARENA','Ámsterdam',{seats:['#C8102E','#8d949d'],tiers:2,band:'fascia',roof:'retract',roofCol:'#8d949d',sup:'truss',shape:'bowl',lights:'roof'}),
 ita:SD('STADIO OLIMPICO','Roma',{seats:['#0066B3','#2f7ac0'],tiers:2,band:'gap',roof:'membrane',sup:'cables',track:'#b5523b',shape:'oval',lights:'roof',endL:'curve',endR:'curve'}),
 col:SD('METROPOLITANO','Barranquilla',{seats:['#FCD116','#003893','#CE1126'],tiers:2,band:'gap',lights:'towers',shape:'oval',seatMode:'sectors',endL:'curve',endR:'curve'}),
 pal:SD('ALLIANZ PARQUE','São Paulo',{seats:['#006437','#006437'],tiers:2,band:'fascia',roof:'canti',roofCol:'#e9ebee',sup:'cables',shape:'box',lights:'roof',motto:'VERDÃO'}),
 bot:SD('NILTON SANTOS','Río de Janeiro',{seats:['#16161B','#9aa0a8'],tiers:2,band:'fascia',roof:'canti',roofCol:'#e8e8e4',sup:'arches',track:'#b5523b',shape:'box',lights:'roof',motto:'ENGENHÃO'}),
 sao:SD('MORUMBIS','São Paulo',{seats:['#D0021B','#F4F4F2','#16161B'],tiers:2,band:'gap',shape:'oval',lights:'rim',seatMode:'sectors',endL:'curve',endR:'curve',motto:'TRICOLOR'}),
 mci:SD('ETIHAD STADIUM','Mánchester',{seats:['#6CABDD','#6CABDD','#1C2C5B'],tiers:3,band:'fascia',roof:'canti',roofCol:'#e8ebef',sup:'masts',shape:'bowl',lights:'roof'}),
 ars:SD('EMIRATES STADIUM','Londres',{seats:['#EF0107','#EF0107','#EF0107'],tiers:3,band:'fascia',roof:'ring',roofCol:'#e8ebef',sup:'truss',shape:'bowl',lights:'roof'}),
 liv:SD('ANFIELD','Liverpool',{seats:['#C8102E','#C8102E','#C8102E'],tiers:3,band:'fascia',roof:'canti',roofCol:'#c9ccd1',sup:'truss',shape:'box',lights:'roof',endL:'kop',motto:'THE KOP'}),
 che:SD('STAMFORD BRIDGE','Londres',{seats:['#034694','#034694'],tiers:2,band:'fascia',roof:'canti',roofCol:'#b9bcc2',sup:'columns',shape:'box',lights:'roof'}),
 mun:SD('OLD TRAFFORD','Mánchester',{seats:['#DA291C','#DA291C','#DA291C'],tiers:3,band:'fascia',roof:'canti',roofCol:'#d0d3d8',sup:'truss',shape:'box',lights:'roof',mosaic:'MANCHESTER UNITED',motto:'THEATRE OF DREAMS'}),
 tot:SD('TOTTENHAM HOTSPUR STADIUM','Londres',{seats:['#132257','#132257','#132257'],tiers:3,band:'fascia',roof:'membrane',shape:'bowl',lights:'roof',endL:'wall'}),
 new:SD("ST JAMES' PARK",'Newcastle',{seats:['#16161B','#16161B'],tiers:2,band:'fascia',roof:'canti',roofCol:'#e8e8e4',sup:'bigcanti',shape:'box',lights:'roof'}),
 rma:SD('SANTIAGO BERNABÉU','Madrid',{seats:['#c3c7cd','#c3c7cd','#c3c7cd'],tiers:3,band:'fascia',roof:'retract',roofCol:'#b8bec6',ext:'ribbon',shape:'bowl',lights:'roof',screen:true}),
 fcb:SD('SPOTIFY CAMP NOU','Barcelona',{seats:['#004D98','#A50044','#004D98'],tiers:3,band:'fascia',ext:'cranes',shape:'oval',lights:'poles',mosaic:'MÉS QUE UN CLUB',endL:'curve',endR:'curve',motto:'EN OBRAS'}),
 atm:SD('METROPOLITANO','Madrid',{seats:['#CB3524','#F4F4F2','#CB3524'],tiers:2,band:'fascia',roof:'wave',roofCol:'#eeeeea',sup:'cables',shape:'bowl',lights:'roof'}),
 ath:SD('SAN MAMÉS','Bilbao',{seats:['#EE2523','#F4F4F2'],tiers:2,band:'fascia',roof:'canti',roofCol:'#f0f0ec',ext:'panels',shape:'bowl',lights:'roof'}),
 bet:SD('BENITO VILLAMARÍN','Sevilla',{seats:['#00954C','#F4F4F2'],tiers:3,band:'fascia',roof:'canti',roofCol:'#e8e8e4',shape:'bowl',lights:'roof'}),
 int:SANSIRO,mil:SANSIRO,
 juv:SD('ALLIANZ STADIUM','Turín',{seats:['#F4F4F2','#16161B'],tiers:2,band:'fascia',roof:'canti',roofCol:'#e8e8e4',sup:'pylon2',shape:'box',lights:'roof'}),
 nap:SD('DIEGO ARMANDO MARADONA','Nápoles',{seats:['#12A0D7','#12A0D7'],tiers:2,band:'gap',roof:'canti',roofCol:'#d9dbdf',sup:'truss',shape:'oval',lights:'roof',endL:'curve',endR:'curve'}),
 bay:SD('ALLIANZ ARENA','Múnich',{seats:['#8d949d','#8d949d','#8d949d'],tiers:3,band:'fascia',roof:'membrane',ext:'cushion',shape:'bowl',lights:'roof',endL:'wall',motto:'SÜDKURVE'}),
 bvb:SD('SIGNAL IDUNA PARK','Dortmund',{seats:['#FDE100','#16161B'],tiers:2,band:'fascia',roof:'canti',roofCol:'#9aa0a8',sup:'pylons',shape:'box',lights:'roof',endL:'wall',motto:'SÜDTRIBÜNE'}),
 psg:SD('PARC DES PRINCES','París',{seats:['#1A2A57','#DA291C'],tiers:2,band:'gap',roof:'canti',roofCol:'#8d949d',ext:'ribs',shape:'oval',lights:'roof',endL:'curve',endR:'curve'}),
 larg86:Object.assign({},AZTECA,{motto:'MÉXICO 86'}),lbra70:Object.assign({},AZTECA,{motto:'MÉXICO 70'}),
 lbra02:SD('ESTADIO DE YOKOHAMA','Yokohama',{seats:['#1D4CB3','#F4F4F2'],tiers:2,band:'fascia',roof:'canti',roofCol:'#e8e8e4',sup:'arches',track:'#b5523b',shape:'oval',lights:'roof',endL:'curve',endR:'curve',motto:'2002'}),
 lwld:SD('ESTADIO DE LAS LEYENDAS','Fútbol',{seats:['#C9A227','#16161B'],tiers:3,band:'palcos',roof:'ring',roofCol:'#C9A227',shape:'bowl',lights:'roof'})
};
['lriv:riv','lboc:boc','lcen:cen','lnob:nob','lfcb:fcb','lrma:rma'].forEach(x=>{const[a,b]=x.split(':');STADIUMS[a]=STADIUMS[b];});
function stadiumOf(t){return STADIUMS[t.id]||SD('ESTADIO '+t.name.toUpperCase(),'',{seats:[t.kit.p,t.kit.s===t.kit.p?'#F4F4F2':t.kit.s],roof:'canti'});}

let crowd=null,stadLayout=null,stadPlates=null;
const CROWD_SKIN=['#F3CBA5','#DDA77E','#B07A50','#7A4B2C','#e8b88e'];
function srnd(seed){let x=seed>>>0||1;return()=>((x=Math.imul(x^(x>>>15),2246822507)+0x9e3779b9>>>0)/4294967296);}
function pxText(g,txt,x,y,col,shadow,align){g.font='8px Silkscreen, monospace';g.textBaseline='middle';g.textAlign=align||'center';if(shadow){g.fillStyle=shadow;g.fillText(txt,x+1,y+1);}g.fillStyle=col;g.fillText(txt,x,y);}
function hexA(h,a){const v=parseInt(h.slice(1),16);return`rgba(${v>>16},${(v>>8)&255},${v&255},${a.toFixed(3)})`;}

// ===== ESTADIOS v3: la planta real de cada estadio =====
// Cada estadio se dibuja como una planta vista desde arriba en diagonal: la forma (óvalo, redondo, caja con
// esquinas abiertas o llenas, la "D" de la Bombonera), las bandejas siguiendo esa forma, el techo donde está,
// la fachada, lo que hay afuera (barrio, parque, río, estacionamiento) y las estructuras propias en su lugar.
// Geometría por estadio. T/B/L/R: cuánto del margen ocupa cada tribuna (arriba = la de enfrente).
// n: forma de afuera (2 = óvalo, 3-5 = bowl, 14 = caja) · nIn/kIn: borde de adentro (pista o apron)
// corners: 'open' deja las esquinas libres · roof: fracción techada de cada lado · env: lo que rodea al estadio
const GEO={
 'LA BOMBONERA':{n:16,nB:2.7,nIn:16,T:0.9,B:1,L:0.95,R:0.95,tiers:[0.36,0.33,0.31],band:'gap',far:'palcos',roof:0,env:'boca',facade:'mural',lights:'rim'},
 'MÂS MONUMENTAL':{n:2.25,nIn:5,kIn:1.05,T:1,B:1,L:1,R:1,tiers:[0.52,0.48],band:'gap',roof:{T:0.18,B:0.18,L:0,R:0},roofCol:'#e9ebee',env:'city',river:[1.2,-0.6,0.95],facade:'concrete',lights:'poles'},
 'EL CILINDRO':{n:2,nIn:2,kIn:1.5,circle:1,T:1,B:1,L:1,R:1,tiers:[0.5,0.5],band:'gap',roof:0,env:'city',neighbor:{at:[0.94,0.95],col:'#D0021B',r:44},facade:'concrete',lights:'rim'},
 'LIBERTADORES DE AMÉRICA':{n:6,nIn:14,T:0.9,B:0.9,L:0.85,R:0.85,tiers:[0.55,0.45],band:'fascia',roof:0.42,roofCol:'#ececea',env:'city',neighbor:{at:[0.05,0.07],col:'#7DC4EA',r:44,ring:1},facade:'panels',lights:'roof'},
 'NUEVO GASÓMETRO':{n:14,nIn:14,corners:'open',T:0.7,B:0.75,L:0.85,R:0.6,tiers:[0.55,0.45],band:'gap',roof:0,env:'barrio',lights:'towers'},
 'ESTADIO UNO':{n:4,nIn:12,T:0.95,B:0.85,L:0.85,R:0.85,tiers:[0.5,0.5],band:'fascia',roof:0.5,roofCol:'#f0f0ec',env:'park',lights:'roof',sup:'truss'},
 'JOSÉ AMALFITANI':{n:14,nIn:14,corners:'open',T:0.75,B:0.65,L:0.6,R:0.6,tiers:[1],band:'gap',roof:{T:0.35,B:0,L:0,R:0},roofCol:'#9aa0a8',env:'barrio',lights:'towers'},
 'GIGANTE DE ARROYITO':{n:14,nIn:14,corners:'open',T:0.8,B:0.7,L:0.75,R:0.75,tiers:[0.55,0.45],band:'gap',roof:0,env:'city',river:[-0.2,-1.4,-0.25],lights:'towers'},
 'COLOSO MARCELO BIELSA':{n:9,nIn:14,T:0.95,B:0.85,L:0.75,R:0.75,tiers:[0.55,0.45],band:'fascia',roof:{T:0.5,B:0.45,L:0,R:0},roofCol:'#b9bcc2',env:'park',lights:'towers'},
 'MARIO ALBERTO KEMPES':{n:2.4,nIn:4,kIn:1.18,track:'#b5523b',T:1,B:1,L:1,R:1,tiers:[0.55,0.45],band:'fascia',roof:{T:0.55,B:0.45,L:0,R:0},roofCol:'#f2f2ee',env:'park',lights:'roof',sup:'cables'},
 'MARACANÃ':{n:2.3,nIn:4,kIn:1.1,T:1,B:1,L:1,R:1,tiers:[0.5,0.5],band:'gap',roof:0.62,roofKind:'membrane',env:'plaza',facade:'concrete',lights:'roof'},
 'STADE DE FRANCE':{n:2.6,nIn:4,kIn:1.12,T:1,B:1,L:1,R:1,tiers:[0.38,0.33,0.29],band:'fascia',roof:0.7,roofKind:'glass',roofCol:'#c9ccd1',env:'plaza',river:[0,1.4,1.25],lights:'roof',sup:'needles'},
 'LA CARTUJA':{n:2.4,nIn:4,kIn:1.18,track:'#c0563a',T:1,B:1,L:1,R:1,tiers:[0.55,0.45],band:'gap',roof:{T:0.55,B:0.5,L:0.3,R:0.3},roofCol:'#e8e8e4',env:'park',river:[-1.3,0,-0.12],lights:'roof',sup:'cables'},
 'WEMBLEY':{n:4.5,nIn:10,T:0.95,B:1,L:1,R:1,tiers:[0.38,0.33,0.29],band:'fascia',roof:0.6,roofCol:'#d6d9de',env:'city',facade:'glass',lights:'roof',sup:'arch'},
 'OLYMPIASTADION':{n:2.2,nIn:3.5,kIn:1.2,track:'#2457b8',T:1,B:1,L:1,R:1,tiers:[0.5,0.5],band:'gap',roof:0.5,roofKind:'membrane',env:'park',facade:'stone',gate:'R',lights:'roof'},
 'ESTÁDIO DA LUZ':{n:4.5,nIn:10,T:1,B:1,L:1,R:1,tiers:[0.38,0.33,0.29],band:'fascia',roof:0.55,roofKind:'membrane',env:'city',lights:'roof',sup:'arches'},
 'CENTENARIO':{n:2.5,nIn:4,kIn:1.12,T:1,B:1,L:1,R:1,tiers:[0.55,0.45],band:'gap',roof:0,env:'park',facade:'concrete',lights:'towers',tower:1},
 'JOHAN CRUIJFF ARENA':{n:4,nIn:12,T:1,B:0.85,L:1,R:1,tiers:[0.5,0.5],band:'fascia',roof:0.75,roofKind:'retract',roofCol:'#8d949d',env:'parking',highway:1,lights:'roof',sup:'truss'},
 'STADIO OLIMPICO':{n:2.3,nIn:3.5,kIn:1.2,track:'#2f5fb0',T:1,B:1,L:1,R:1,tiers:[0.5,0.5],band:'gap',roof:0.55,roofKind:'membrane',env:'park',river:[-0.3,-1.6,-0.35],lights:'roof'},
 'METROPOLITANO':{n:2.4,nIn:4,kIn:1.14,T:1,B:1,L:1,R:1,tiers:[0.55,0.45],band:'gap',roof:0,env:'tropic',lights:'towers'},
 'ALLIANZ PARQUE':{n:6,nIn:14,T:0.95,B:0.85,L:0.85,R:0.85,tiers:[0.55,0.45],band:'fascia',roof:0.55,roofCol:'#e9ebee',env:'dense',facade:'glass',lights:'roof'},
 'NILTON SANTOS':{n:12,nIn:6,kIn:1.14,track:'#b5523b',T:1,B:1,L:0.8,R:0.8,tiers:[0.55,0.45],band:'fascia',roof:0.55,roofCol:'#e8e8e4',env:'city',lights:'roof',sup:'arches4'},
 'MORUMBIS':{n:2.2,nIn:3,kIn:1.18,T:1,B:1,L:1,R:1,tiers:[0.55,0.45],band:'gap',roof:0,env:'park',facade:'concrete',lights:'rim'},
 'ETIHAD STADIUM':{n:3.6,nIn:10,T:1,B:1,L:0.95,R:0.95,tiers:[0.38,0.33,0.29],band:'fascia',roof:0.5,roofCol:'#e8ebef',env:'plaza',lights:'roof',sup:'masts'},
 'EMIRATES STADIUM':{n:2.6,nIn:6,kIn:1.03,T:1,B:1,L:1,R:1,tiers:[0.38,0.33,0.29],band:'fascia',roof:0.5,roofKind:'glass',roofCol:'#b8c4cc',env:'city',facade:'glass',lights:'roof'},
 'ANFIELD':{n:14,nIn:14,corners:'half',T:1,B:0.75,L:0.8,R:0.75,tiers:[0.38,0.33,0.29],band:'fascia',sides:{L:{tiers:[1]}},roof:0.45,roofCol:'#c9ccd1',env:'terraced',lights:'roof'},
 'STAMFORD BRIDGE':{n:14,nIn:14,corners:'fill',T:0.75,B:0.7,L:0.65,R:0.65,tiers:[0.55,0.45],band:'fascia',roof:0.5,roofCol:'#b9bcc2',env:'dense',lights:'roof'},
 'OLD TRAFFORD':{n:14,nIn:14,corners:'fill',T:1,B:0.85,L:0.85,R:0.85,tiers:[0.38,0.33,0.29],band:'fascia',roof:0.42,roofCol:'#d0d3d8',env:'industrial',river:[0,-1.5,-0.3],lights:'roof',sup:'redtruss'},
 'TOTTENHAM HOTSPUR STADIUM':{n:5,nIn:12,T:1,B:1,L:1,R:0.9,tiers:[0.38,0.33,0.29],band:'fascia',sides:{L:{tiers:[1]}},roof:0.55,roofKind:'glass',roofCol:'#9aa4ad',env:'city',facade:'glass',lights:'roof'},
 "ST JAMES' PARK":{n:14,nIn:14,corners:'fill',T:1,B:0.5,L:1,R:0.45,tiers:[0.5,0.5],band:'fascia',sides:{B:{tiers:[1]},R:{tiers:[1]}},roof:{T:0.55,L:0.55,B:0.35,R:0.35},roofCol:'#e8e8e4',env:'city',lights:'roof',sup:'bigcanti'},
 'SANTIAGO BERNABÉU':{n:6,nIn:14,T:1,B:1,L:1,R:1,tiers:[0.38,0.33,0.29],band:'fascia',roof:0.62,roofKind:'retract',roofCol:'#b8bec6',env:'dense',facade:'ribbon',lights:'roof',screen:1},
 'SPOTIFY CAMP NOU':{n:2.35,nIn:4,kIn:1.06,T:1,B:1,L:1,R:1,tiers:[0.38,0.33,0.29],band:'fascia',roof:0,env:'city',facade:'concrete',lights:'poles',cranes:1},
 'METROPOLITANO@Madrid':{n:3,nIn:6,kIn:1.04,T:1,B:1,L:1,R:1,tiers:[0.55,0.45],band:'fascia',roof:0.6,roofKind:'membrane',env:'park',lights:'roof',sup:'cables'},
 'SAN MAMÉS':{n:5,nIn:14,T:1,B:0.9,L:0.95,R:0.95,tiers:[0.55,0.45],band:'fascia',roof:0.5,roofCol:'#f0f0ec',env:'city',river:[0,1.5,1.32],facade:'panels',lights:'roof'},
 'BENITO VILLAMARÍN':{n:6,nIn:14,T:1,B:0.9,L:0.95,R:0.95,tiers:[0.38,0.33,0.29],band:'fascia',roof:{T:0.45,B:0.4,L:0.35,R:0.2},roofCol:'#e8e8e4',env:'city',lights:'roof'},
 'SAN SIRO':{n:7,nIn:12,T:0.8,B:0.75,L:0.8,R:0.8,tiers:[0.38,0.33,0.29],band:'gap',roof:0.5,roofCol:'#4b525a',env:'parking',lights:'roof',towers11:1},
 'ALLIANZ STADIUM':{n:14,nIn:14,corners:'fill',T:0.95,B:0.85,L:0.85,R:0.85,tiers:[0.5,0.5],band:'fascia',roof:0.55,roofCol:'#e8e8e4',env:'park',lights:'roof',sup:'pylon2'},
 'DIEGO ARMANDO MARADONA':{n:2.4,nIn:4,kIn:1.18,track:'#2f6fc0',T:1,B:1,L:1,R:1,tiers:[0.5,0.5],band:'gap',roof:0.38,roofCol:'#d9dbdf',env:'dense',lights:'roof',sup:'truss'},
 'ALLIANZ ARENA':{n:3.2,nIn:12,T:1,B:1,L:1,R:1,tiers:[0.38,0.33,0.29],band:'fascia',sides:{L:{tiers:[0.6,0.4]}},roof:0.6,roofKind:'membrane',env:'plaza',facade:'cushion',lights:'roof'},
 'SIGNAL IDUNA PARK':{n:14,nIn:14,corners:'fill',T:1,B:0.85,L:1,R:0.85,tiers:[0.55,0.45],band:'fascia',sides:{L:{tiers:[1]}},roof:0.5,roofCol:'#9aa0a8',env:'park',lights:'roof',pylons:1},
 'PARC DES PRINCES':{n:2.7,nIn:6,kIn:1.03,T:1,B:1,L:1,R:1,tiers:[0.55,0.45],band:'gap',roof:0.5,roofCol:'#8d949d',env:'city',facade:'ribs',lights:'roof'},
 'ESTADIO AZTECA':{n:2.4,nIn:5,kIn:1.07,T:1,B:1,L:1,R:1,tiers:[0.55,0.45],band:'palcos',roof:0.38,roofKind:'glass',roofCol:'#8d949d',env:'parking',facade:'concrete',lights:'roof'},
 'ESTADIO DE YOKOHAMA':{n:2.4,nIn:4,kIn:1.18,track:'#b5523b',T:1,B:1,L:1,R:1,tiers:[0.5,0.5],band:'fascia',roof:{T:0.55,B:0.5,L:0.15,R:0.15},roofCol:'#e8e8e4',env:'park',lights:'roof',sup:'arches'},
 'ESTADIO DE LAS LEYENDAS':{n:3.5,nIn:8,T:1,B:1,L:1,R:1,tiers:[0.38,0.33,0.29],band:'palcos',roof:0.45,roofKind:'glass',roofCol:'#C9A227',env:'plaza',facade:'gold',lights:'roof'}
};
function geoOf(st){
 const g=GEO[st.n+'@'+st.c]||GEO[st.n];
 if(g)return g;
 const roofed=st.roof!=='none';
 const base=st.shape==='oval'?{n:2.4,nIn:4,kIn:st.track?1.18:1.08}:st.shape==='bowl'?{n:4,nIn:10}:st.shape==='cylinder'?{n:2,nIn:2,kIn:1.5,circle:1}:{n:14,nIn:14,corners:roofed?'fill':'open'};
 return Object.assign({T:0.9,B:0.85,L:0.85,R:0.85,tiers:st.tiers===3?[0.38,0.33,0.29]:[0.55,0.45],band:st.band||'fascia',roof:roofed?0.45:0,roofCol:st.roofCol,env:'city',lights:roofed?'roof':'towers',track:st.track},base);
}
const RGBC={};
function rgbOf(h){let v=RGBC[h];if(v)return v;const n=parseInt(h.slice(1),16);return RGBC[h]=[n>>16,(n>>8)&255,n&255];}
function hsh(a,b){let h=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}

function drawStadium(g,st,kits,topEdge,botEdge,W,H,xInL,xInR){
 const G=geoOf(st),seed=st.n.length*977+st.n.charCodeAt(1)*31;
 const yF=Math.floor(topEdge)-3,yB0=Math.ceil(botEdge+6);
 const cx=(xInL+xInR)/2,cy=(yF+yB0)/2,ax=(xInR-xInL)/2,ay=(yB0-yF)/2;
 const kIn=G.kIn||1,nIn=G.nIn||14,nOut=G.n||4;
 let inA={L:ax*kIn,R:ax*kIn,T:ay*kIn,B:ay*kIn};
 let outA={T:ay+yF*G.T,B:ay+(H-yB0)*G.B,L:ax+xInL*G.L,R:ax+(W-xInR)*G.R};
 if(G.circle){const R=Math.min(outA.T,outA.B*1.08)/0.74;outA={T:R*0.74,B:R*0.74*0.94,L:R,R:R};inA={T:ay*1.22,B:ay*1.22,L:ax*1.06,R:ax*1.06};}
 for(const k of ['T','B','L','R'])outA[k]=Math.max(outA[k],inA[k]+10);
 const rho=(A,c,s,n,nB)=>{const nn=s>0&&nB?nB:n;return Math.pow(Math.pow(Math.abs(c)/(c<0?A.L:A.R),nn)+Math.pow(Math.abs(s)/(s<0?A.T:A.B),nn),-1/nn);};
 const roofOf=sd=>(typeof G.roof==='number'?G.roof:((G.roof&&G.roof[sd])||0))*(sd==='T'?0.55:sd==='B'?0.7:0.8);
 const tiersOf=sd=>(G.sides&&G.sides[sd]&&G.sides[sd].tiers)||G.tiers;
 const roofKind=G.roofKind||'solid',rc=G.roofCol||'#d6d9de';
 const img=g.createImageData(W,H),D=img.data;
 const kind=new Uint8Array(W*H); // 0 afuera, 1 butaca, 2 pasillo/banda, 3 techo, 4 fachada, 5 apron/pista, 6 cancha
 const put=(i,c,f)=>{const k=i*4;let r=c[0],gg=c[1],b=c[2];if(f!==undefined&&f!==1){r*=f;gg*=f;b*=f;}D[k]=r;D[k+1]=gg;D[k+2]=b;D[k+3]=255;};
 const mixc=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
 const seats=st.seats.map(rgbOf);
 const RIS=rgbOf('#0b0e12'),STAIR=rgbOf('#4d555e'),BANDG=rgbOf('#5f6770'),BANDF=rgbOf('#14181d'),APRON=rgbOf('#173022'),PAVE=rgbOf('#34383d'),ROOF=rgbOf(rc),WHITE=[245,246,240];
 const envPal={boca:['#b8432f','#2f74b5','#e0b326','#2e9a52','#d4762a','#7d4b9e','#c9c9c2'],barrio:['#7a3d30','#8a5a3c','#5d4a3e','#6e6e66','#9a4c34'],terraced:['#6a3328','#5a2c24','#3d424a','#734034'],city:['#3d4047','#4b4f57','#5a554d','#33373d','#5e5047','#45484c'],dense:['#3a3d44','#51555e','#2c2f35','#5b5f68','#474a52'],industrial:['#3b3e43','#4f4a42','#2f3236','#5a5248']};
 const pal=k=>(envPal[k]||envPal.city).map(rgbOf);
 const PALE=pal(G.env);
 // ---- lo que rodea al estadio (de noche) ----
 const env=(x,y,dist)=>{
  const wx=x,wy=y*1.35,k=G.env;
  if(G.river){const[a,b,c]=G.river;if(a*x/W+b*y/H>c){const sh2=(Math.sin(x*0.35+y*1.7)+Math.sin(x*0.11-y*0.6))*0.5;return sh2>0.75?[40,78,110]:sh2>0.2?[18,44,72]:[11,30,52];}
   if(a*x/W+b*y/H>c-0.025)return[58,62,58];}
  if(G.highway&&Math.abs(y-(H-9))<5)return Math.abs(y-(H-9))<1?[200,180,90]:(x+Math.floor(y))%11===0?[255,240,200]:[36,38,42];
  if(k==='park'||k==='tropic'){const ci=Math.floor(wx/6),cj=Math.floor(wy/6),h=hsh(ci+seed,cj);
   const path=Math.abs(Math.sin(wx*0.02)*40+wy*0.5-((ci*7)%60))<1.4;if(path)return[92,88,74];
   if(h<0.55){const dx=wx-(ci*6+3),dy=wy-(cj*6+3),r=Math.hypot(dx,dy);if(r<2.8+h*2)return k==='tropic'?(r<1.2?[70,140,60]:[38,96,44]):(r<1.4?[46,96,52]:dx+dy<0?[34,78,42]:[22,56,32]);}
   return k==='tropic'?[34,62,34]:[20,42,27];}
  if(k==='plaza'){const t=((wx|0)%8===0||(wy|0)%8===0);const h=hsh(Math.floor(wx/16)+seed,Math.floor(wy/16));
   const lamp=((wx|0)%16===8&&(wy|0)%16===8);if(lamp)return[255,236,180];
   if(h<0.18){const dx=wx%16-8,dy=wy%16-8;if(dx*dx+dy*dy<9)return[30,70,40];}return t?[86,88,92]:[66,68,72];}
  if(k==='parking'){const bi=Math.floor(wy/9),row=wy%9;if(row<2)return[40,42,46];const lot=Math.floor(wx/4),h=hsh(lot+seed,bi);
   if((wx|0)%4===0)return[120,122,126];if(h<0.55&&row>2&&row<8){const cc=[[160,30,30],[30,60,140],[200,200,200],[50,50,55],[120,120,128],[180,150,40]][Math.floor(h*11)%6];return(row===3)?mixc(cc,[255,255,255],0.25):cc;}return[36,38,42];}
  // barrio / ciudad: manzanas y calles
  const BS=k==='dense'?20:k==='boca'||k==='barrio'||k==='terraced'?14:17,SW=2;
  const bx=Math.floor(wx/BS),by=Math.floor(wy/BS),lx=wx-bx*BS,ly=wy-by*BS;
  if(lx<SW||ly<SW){const lamp=(lx<SW&&(ly|0)%7===3&&lx<1)||(ly<SW&&(lx|0)%7===3&&ly<1);if(lamp)return[255,214,140];
   const car=hsh(Math.floor(wx/3)+seed,Math.floor(wy/3))<0.05;if(car)return hsh(wx|0,wy|0)<0.5?[255,250,220]:[220,40,40];return[24,26,30];}
  const lw=k==='terraced'?3:k==='dense'?8:5,lh=k==='terraced'?6:k==='dense'?9:5;
  const li=Math.floor((lx-SW)/lw),lj=Math.floor((ly-SW)/lh),h=hsh(bx*17+li+seed,by*13+lj);
  if(k!=='dense'&&k!=='terraced'&&h>0.93)return[28,64,36];
  let c=PALE[Math.floor(h*PALE.length)];
  const ex=(lx-SW)%lw,ey=(ly-SW)%lh;
  if(ex<0.8||ey<0.8)c=mixc(c,[0,0,0],0.45);else if(ex<1.8&&ey<1.8)c=mixc(c,[255,255,255],0.12);
  if(k==='dense'||k==='city'){if(hsh(wx|0,(wy|0)+seed)<0.04)return[255,226,150];}
  return c;};
 // ---- pixel por pixel ----
 const tierCache={};
 const farSpots=[];const S=[];const occ=new Uint8Array(Math.ceil(W/3)*Math.ceil(H/3));
 const farFront=new Int16Array(W).fill(-1),nearFront=new Int16Array(W).fill(H),Lfront=new Int16Array(H).fill(-1),Rfront=new Int16Array(H).fill(W);
 const bandYs=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const i=y*W+x,dx=x+0.5-cx,dy=y+0.5-cy;
  if(Math.abs(dx)<=ax&&Math.abs(dy)<=ay){kind[i]=6;put(i,APRON);continue;}
  const r=Math.hypot(dx,dy),c=dx/r,s=dy/r;
  const ri=rho(inA,c,s,nIn),ro=rho(outA,c,s,nOut,G.nB);
  const end=Math.abs(dx)*ay>Math.abs(dy)*ax,sd=end?(dx<0?'L':'R'):(dy<0?'T':'B');
  if(r<ri){kind[i]=5;
   if(G.track){const tc=rgbOf(G.track),dd=ri-r;put(i,(dd|0)%3===0&&dd<10?mixc(tc,WHITE,0.45):tc,0.85);}
   else put(i,APRON,0.85);continue;}
  const d=r-ri,Dd=ro-ri,t=d/Dd;
  let outside=t>1;
  const cornerX=Math.abs(dx)-ax,cornerY=Math.abs(dy)-ay;
  if(!outside&&cornerX>2&&cornerY>2){
   if(G.corners==='open')outside=true;
   else if(G.corners==='half'&&((dx<0)!==(dy<0)))outside=true;}
  if(!outside&&G.gate&&sd===G.gate&&Math.abs(dy)<12&&t>0.08)outside=true;
  if(outside){
   // explanada alrededor y luego el barrio
   const dist=t>1?(r-ro):3;
   let c;if(t>1&&dist<3.5)c=PAVE;else c=env(x,y,dist);
   const lit=c[0]>200&&c[1]>180;const fog=lit?1:(0.42+0.22*Math.min(1,y/H*1.6));put(i,c,fog*(t>1&&dist<6&&!lit?0.85:1));kind[i]=0;continue;}
  // fachada (borde exterior)
  if(Dd-d<2.6&&G.facade!=='none'){kind[i]=4;
   const f=G.facade,along=end?y*1.6:x;let c;
   if(f==='cushion'){const q=Math.abs(((x+y*2)%10)-5)+Math.abs(((x-y*2+600)%10)-5);c=q<3?rgbOf('#ff8a9a'):q<6?rgbOf('#e0193b'):rgbOf('#9e0a24');}
   else if(f==='ribbon')c=((along|0)+(d|0))%3===0?[220,226,232]:[150,158,168];
   else if(f==='ribs')c=(along|0)%5<2?[205,200,190]:[90,88,84];
   else if(f==='mural')c=rgbOf(((along/9)|0)%2?'#F5C400':'#0A2D7A');
   else if(f==='panels')c=(along|0)%4===0?rgbOf(st.seats[0]):[236,236,232];
   else if(f==='glass')c=(along|0)%3===0?[120,170,200]:[60,90,110];
   else if(f==='gold')c=(along|0)%3===0?[240,210,120]:[160,130,50];
   else if(f==='stone')c=(along|0)%4===0?[150,140,120]:[196,186,160];
   else c=(along|0)%6===0?[110,114,118]:[150,152,150];
   put(i,c);continue;}
  // techo
  const rf=roofOf(sd);
  if(rf>0&&t>1-rf){kind[i]=3;const rd=Dd*(1-rf),dr=d-rd,along=end?y*1.6:x;
   let c;
   if(roofKind==='membrane'){c=mixc(mixc(seats[0],[0,0,0],0.5),[210,214,220],0.5);if((along|0)%9===0)c=[200,204,210];}
   else if(roofKind==='glass'){c=mixc(ROOF,[30,40,50],0.35);if((dr|0)%5===0)c=mixc(c,[255,255,255],0.25);}
   else if(roofKind==='retract'){c=(along|0)%7===0?mixc(ROOF,[0,0,0],0.4):ROOF;if((dr|0)%4===0)c=mixc(c,[0,0,0],0.2);}
   else{c=ROOF;if((dr|0)%4===0)c=mixc(c,[0,0,0],0.18);if((along|0)%14===0)c=mixc(c,[0,0,0],0.3);}
   if(dr<1.2)c=((along|0)%3===0)?[255,251,224]:[120,122,118]; // borde con luces
   else if(dr<2.4)c=mixc(c,[0,0,0],0.45);
   put(i,c,dr<1.2?1:roofKind==='membrane'?0.9:0.62);continue;}
  // Bombonera: el lado de los palcos es una pared vertical
  if(G.far==='palcos'&&sd==='T'){kind[i]=2;const yy=(d|0),xx=x;const row=yy%6,col=xx%8;
   let c;if(row>=1&&row<=3&&col>=1&&col<=6)c=((xx*7+yy*13)%11===0)?[255,244,176]:[255,210,58];else c=row===4?[6,26,71]:[10,45,122];
   if(t>0.94)c=[245,196,0];put(i,c);if(farFront[x]<y)farFront[x]=y;continue;}
  // bandejas
  const TS=tiersOf(sd),nT=TS.length,bandPx=G.band==='palcos'?5:3,usable=Dd-(nT-1)*bandPx;
  let acc=0,ti=-1,d0=0;
  for(let k=0;k<nT;k++){const h=TS[k]*usable;if(d<acc+h){ti=k;d0=d-acc;break;}acc+=h;if(k<nT-1){if(d<acc+bandPx){ti=-2;d0=d-acc;break;}acc+=bandPx;}}
  if(ti===-1){ti=nT-1;d0=d-acc;}
  if(ti===-2){kind[i]=2;const along=end?y*1.6:x;let c;
   if(G.band==='fascia'){c=d0<1?BANDF:((along|0)%3===0?rgbOf(kits[0].p):BANDF);if(d0>=1&&d0<2&&(along|0)%3!==0)c=[30,34,40];}
   else if(G.band==='palcos'){c=d0>1&&d0<4&&(along|0)%5<3?((along*13|0)%7===0?[255,241,184]:[127,168,200]):[29,36,44];}
   else c=d0<1?[125,133,142]:d0>=2?[48,54,61]:BANDG;
   put(i,c);if(sd==='T'&&Math.abs(x-W*0.25)<1)bandYs.push(y);continue;}
  kind[i]=1;
  const along=end?y*1.6:x,row=(d0/3)|0,pr=d0-row*3;
  if(((along+ti*13+500)|0)%46<3){put(i,STAIR,(y&1)?1:0.75);continue;}
  if(pr>=2){put(i,RIS);continue;}
  let base=seats[ti%seats.length];
  if(st.seatMode==='sectors')base=seats[Math.floor((Math.atan2(dy,dx)+Math.PI)/(Math.PI*2)*14)%seats.length];
  else if(st.seatMode==='stripes')base=seats[(Math.floor(Math.atan2(dy,dx*0.6)/(Math.PI*2)*18+20)+ti)%2===0?0:Math.min(1,seats.length-1)];
  put(i,base,pr<1?0.66:0.46);
  // borde de adentro de cada tribuna (para los trapos)
  if(sd==='T'&&y>farFront[x])farFront[x]=y;else if(sd==='B'&&y<nearFront[x])nearFront[x]=y;else if(sd==='L'&&x>Lfront[y])Lfront[y]=x;else if(sd==='R'&&x<Rfront[y])Rfront[y]=x;
  // lugar para un hincha
  if(pr<0.9){const oi=((y/3)|0)*Math.ceil(W/3)+((x/3)|0);if(!occ[oi]&&x>0&&x<W-2&&y>2){occ[oi]=1;
   const sec=sd==='L'?'barra':sd==='R'?'away':sd==='T'?'far':'near';
   if(!(G.cranes&&sd==='T'&&ti===nT-1))S.push([x,y,sec,ti,nT]);}}
 }
 g.putImageData(img,0,0);
 // ---- mosaico de butacas ----
 if(st.mosaic){const m=document.createElement('canvas');m.width=W;m.height=H;const mg=m.getContext('2d');mg.font='8px Silkscreen, monospace';mg.textAlign='center';mg.textBaseline='middle';mg.fillStyle='#fff';
  const mx=Math.round(W*0.3);let fy=-1;for(let y=0;y<yF;y++){const k=kind[y*W+mx];if(k===1){fy=y;break;}}
  mg.fillText(st.mosaic,mx,Math.round((fy+farFront[mx])/2)||Math.round(yF*0.55));
  const md=mg.getImageData(0,0,W,H).data,col=st.n.includes('CAMP')?'#F5C400':'#f4f4f2';g.fillStyle=col;for(let i=0;i<W*H;i++)if(md[i*4+3]>100&&kind[i]===1)g.fillRect(i%W,(i/W)|0,1,1);
  for(let k=S.length-1;k>=0;k--){const[x,y]=S[k];let hit=false;for(let ddx=0;ddx<2&&!hit;ddx++)for(let ddy=-1;ddy<2&&!hit;ddy++){if(md[((y+ddy)*W+x+ddx)*4+3]>100)hit=true;}if(hit){g.fillStyle=col;g.fillRect(x,y-1,2,2);S.splice(k,1);}}}
 // ---- estructuras (capa de arriba de la gente) ----
 const g0=g;{const oc=document.createElement('canvas');oc.width=W;oc.height=H;g=oc.getContext('2d');}
 const outPt=(c,s,extra)=>{const r=rho(outA,c,s,nOut,G.nB)+(extra||0);return[cx+c*r,cy+s*r];};
 const ang=(a)=>[Math.cos(a),Math.sin(a)];
 const line=(x0,y0,x1,y1,col)=>pline(g,Math.round(x0),Math.round(y0),Math.round(x1),Math.round(y1),col);
 const glow=(x,y,r,col)=>{g.save();g.globalCompositeOperation='lighter';for(let k=r;k>=1;k--){g.fillStyle=hexA(col,0.05);g.fillRect(Math.round(x-k),Math.round(y-k*0.7),k*2+1,Math.round(k*1.4)+1);}g.restore();};
 const diag=[[-ax,-ay],[ax,-ay],[-ax,ay],[ax,ay]].map(([a,b])=>{const l=Math.hypot(a,b);return[a/l,b/l];});
 const gN=g;g=g0;
 // vecino: el otro estadio de Avellaneda a 300 metros
 if(G.neighbor){const[u,v]=G.neighbor.at,nx=u*W,ny=v*H,R=G.neighbor.r;
  for(let y=Math.max(0,ny-R);y<Math.min(H,ny+R);y++)for(let x=Math.max(0,nx-R);x<Math.min(W,nx+R);x++){const q=Math.hypot((x-nx)/R,(y-ny)/(R*0.74));if(q>1||kind[y*W+x])continue;
   g.fillStyle=q>0.86?'#9aa0a8':q>0.5?((Math.floor(q*30))%2?G.neighbor.col:sh(G.neighbor.col,-0.5)):'#1e5a2e';g.fillRect(x,y,1,1);}}
 g=gN;
 // torres de iluminación en las esquinas
 if(G.lights==='towers'){for(const[c,s]of diag){const[px0,py0]=outPt(c,s,G.corners==='open'?-Math.min(ax,ay)*0.35:7);const up=s<0?16:9;
   g.fillStyle='#2b3036';g.fillRect(Math.round(px0)-1,Math.round(py0)-1,3,3);g.fillStyle='#6b737c';for(let k=0;k<up;k++){g.fillRect(Math.round(px0),Math.round(py0)-k,1,1);}
   const hx=Math.round(px0)-4,hy=Math.round(py0)-up-3;g.fillStyle='#1d2126';g.fillRect(hx,hy,9,4);g.fillStyle='#fffbe0';for(let k=0;k<4;k++){g.fillRect(hx+1+k*2,hy+1,1,2);}glow(hx+4,hy+2,9,'#fff3c4');}}
 else if(G.lights==='poles'){for(let a=0;a<Math.PI*2;a+=Math.PI/9){const[c,s]=ang(a);const[px0,py0]=outPt(c,s,-1);g.fillStyle='#8d949d';g.fillRect(Math.round(px0),Math.round(py0)-5,1,5);g.fillStyle='#fffbe0';g.fillRect(Math.round(px0)-1,Math.round(py0)-6,3,1);glow(px0,py0-6,4,'#fff3c4');}}
 else if(G.lights==='rim'){for(let a=0;a<Math.PI*2;a+=Math.PI/40){const[c,s]=ang(a);const[px0,py0]=outPt(c,s,-1.5);g.fillStyle='#fffbe0';g.fillRect(Math.round(px0),Math.round(py0),1,1);}}
 // soportes del techo
 const sup=G.sup;
 if(sup==='arch'){ // Wembley: el arco sobre la tribuna norte
  const xa=cx-outA.L*0.82,xb=cx+outA.R*0.82,base=cy-outA.T*0.55,top=2;
  for(let x=Math.round(xa);x<=xb;x++){const u=(x-(xa+xb)/2)/((xb-xa)/2),y=Math.round(base-(base-top)*(1-u*u));g.fillStyle='#3b4249';g.fillRect(x,y+2,1,1);g.fillStyle='#ffffff';g.fillRect(x,y,1,2);
   if(x%14===0){for(let yy=y+3;yy<cy-outA.T*0.7;yy+=2){g.fillStyle='rgba(230,235,240,0.35)';g.fillRect(x+Math.round((yy-y)*0.15),yy,1,1);}}}
  glow((xa+xb)/2,top+1,6,'#ffffff');}
 if(sup==='arches'||sup==='arches4'){ // arcos sobre las tribunas (Luz, Yokohama) o en las esquinas (Engenhão)
  const arcs=sup==='arches4'?[[cx-outA.L*0.95,cx-ax*0.1,cy-outA.T*0.7,-1],[cx+ax*0.1,cx+outA.R*0.95,cy-outA.T*0.7,-1],[cx-outA.L*0.95,cx-ax*0.1,cy+outA.B*0.85,1],[cx+ax*0.1,cx+outA.R*0.95,cy+outA.B*0.85,1]]
   :[[cx-ax*0.9,cx+ax*0.9,cy-outA.T*0.78,-1],[cx-ax*0.9,cx+ax*0.9,cy+outA.B*0.92,1]];
  for(const[a,b,yb,dir]of arcs){for(let x=Math.round(a);x<=b;x++){const u=(x-(a+b)/2)/((b-a)/2),y=Math.round(yb-(dir<0?10:5)*(1-u*u));g.fillStyle=sup==='arches4'?'#f4f4f2':'#d8282b';g.fillRect(x,y,1,2);}}}
 if(sup==='masts'){for(let k=0;k<12;k++){const a=k/12*Math.PI*2+0.13,[c,s]=ang(a),[px0,py0]=outPt(c,s,4),h=s<0?18:10;
   g.fillStyle='#e9ecef';g.fillRect(Math.round(px0),Math.round(py0)-h,2,h);g.fillStyle='#1f2d4a';g.fillRect(Math.round(px0)+2,Math.round(py0)-h,1,h);
   const[ix,iy]=outPt(c,s,-(rho(outA,c,s,nOut)-rho(inA,c,s,nIn))*0.5);line(px0,py0-h,ix,iy,'rgba(230,236,242,0.55)');line(px0,py0-h,(px0+ix)/2+6,(py0+iy)/2,'rgba(230,236,242,0.35)');}}
 if(sup==='needles'){for(let k=0;k<18;k++){const a=k/18*Math.PI*2,[c,s]=ang(a),[px0,py0]=outPt(c,s,-2);g.fillStyle='#f4f4f2';g.fillRect(Math.round(px0),Math.round(py0)-7,1,7);}}
 if(sup==='pylon2'){for(const s of [-1,1])for(const xx of [cx-ax*0.45,cx+ax*0.45]){const yy=s<0?cy-outA.T+2:cy+outA.B-2,h=s<0?20:10;g.fillStyle='#f4f4f2';g.fillRect(Math.round(xx),Math.round(yy)-h,2,h);
   for(let k=-3;k<=3;k++)if(k)line(xx,yy-h,xx+k*12,s<0?cy-outA.T*0.82:cy+outA.B*0.8,'rgba(255,255,255,0.45)');}}
 if(sup==='truss'||sup==='redtruss'||sup==='bigcanti'){const col=sup==='redtruss'?'rgba(214,40,40,0.75)':'rgba(255,255,255,0.45)';
  for(let x=Math.round(cx-ax);x<cx+ax;x+=sup==='bigcanti'?9:7){const yy=cy-outA.T+3;line(x,yy,x+3,yy+5,col);line(x+3,yy+5,x+7,yy,col);}
  if(sup==='redtruss'){g.fillStyle='#c81d25';g.fillRect(Math.round(cx-ax),Math.round(cy-outA.T+2),Math.round(ax*2),1);}}
 if(sup==='cables'){for(let x=Math.round(cx-ax*0.9);x<cx+ax*0.9;x+=16){line(x,cy-outA.T+1,x+8,cy-outA.T*0.78,'rgba(220,225,230,0.5)');line(x,cy+outA.B-1,x+8,cy+outA.B*0.86,'rgba(220,225,230,0.4)');}}
 if(G.towers11){ // San Siro: las 11 torres de rampas y las vigas rojas del techo
  const tw=[];for(let k=0;k<4;k++){const[c,s]=diag[k];tw.push(outPt(c,s,3));}
  for(const a of [-1.9,-1.25,-0.45,0.35,1.25,1.95,2.75]){const[c,s]=ang(a);tw.push(outPt(c,s,4));}
  for(const[x0,y0]of tw){const R=7;for(let yy=-R;yy<=R;yy++)for(let xx=-R;xx<=R;xx++){const q=Math.hypot(xx,yy*1.3);if(q>R)continue;g.fillStyle=q>R-1.2?'#1d2024':q<2?'#0c0e10':((Math.atan2(yy,xx)*2+q*0.9)|0)%2?'#d5d8dc':'#7d848c';g.fillRect(Math.round(x0+xx),Math.round(y0+yy),1,1);}g.fillStyle='#fffbe0';g.fillRect(Math.round(x0),Math.round(y0-R*0.77),1,1);}
  const beam=(x0,y0,x1,y1)=>{for(let k=-1;k<=1;k++){const v=Math.abs(x1-x0)>Math.abs(y1-y0);line(x0+(v?0:k),y0+(v?k:0),x1+(v?0:k),y1+(v?k:0),k?'#7a0f14':'#d8262e');}};
  const bx0=cx-outA.L*0.82,bx1=cx+outA.R*0.82,by0=cy-outA.T*0.88,by1=cy+outA.B*0.86;beam(bx0,by0,bx1,by0);beam(bx0,by1,bx1,by1);beam(bx0,by0,bx0,by1);beam(bx1,by0,bx1,by1);
  for(let x=Math.round(cx-outA.L*0.8);x<cx+outA.R*0.8;x+=12){line(x,cy-outA.T*0.86,x+6,cy-outA.T*0.7,'rgba(200,29,37,0.8)');line(x,cy+outA.B*0.86,x+6,cy+outA.B*0.74,'rgba(200,29,37,0.8)');}}
 if(G.pylons){ // Signal Iduna Park: 8 pilones amarillos afuera, con los cables al techo
  for(const s of [-1,1])for(const f of [-0.75,-0.25,0.25,0.75]){const xx=cx+f*ax*1.15,yy=s<0?cy-outA.T*0.9:cy+outA.B-1,h=s<0?14:9,y0=Math.round(yy);
   g.fillStyle='#FDE100';g.fillRect(Math.round(xx)-1,y0-h,3,h);g.fillStyle='#b39d00';g.fillRect(Math.round(xx)+1,y0-h,1,h);
   for(const k of [-8,0,8])line(xx,y0-h,xx+k,s<0?cy-outA.T*0.84:cy+outA.B*0.84,'rgba(253,225,0,0.6)');}}
 if(G.tower){ // Centenario: la Torre de los Homenajes sobre la tribuna Olímpica
  const tx=Math.round(cx-ax*0.6),ty0=Math.round(cy-outA.T*0.6);g.fillStyle='#e8e4d8';g.fillRect(tx-3,0,7,ty0);g.fillStyle='#b9b4a6';for(let y=3;y<ty0;y+=5)g.fillRect(tx-3,y,7,1);g.fillStyle='#8f8a7c';g.fillRect(tx+3,0,1,ty0);
  g.fillStyle='#5CBFEB';g.fillRect(tx-1,1,3,3);glow(tx,2,5,'#bfe9ff');}
 if(G.cranes){for(const fx0 of [0.3,0.66]){const xx=Math.round(W*fx0),y1=Math.round(cy-outA.T*0.75);g.fillStyle='#e8b400';
   for(let y=0;y<y1;y++){g.fillRect(xx,y,1,1);g.fillRect(xx+3,y,1,1);if(y%3===0)g.fillRect(xx+1,y,2,1);}g.fillRect(xx-34,2,64,1);g.fillRect(xx-34,4,64,1);for(let x=xx-34;x<xx+30;x+=3)g.fillRect(x,3,1,1);
   g.fillStyle='#ff3b30';g.fillRect(xx+28,1,2,2);line(xx+20,5,xx+20,22,'rgba(200,200,200,0.6)');}}
 if(G.gate){const side=G.gate==='R'?1:-1,gx=Math.round(cx+side*(outA.R*0.94)),gy=Math.round(cy);g.fillStyle='#c9c2ad';g.fillRect(gx-4,gy-14,4,8);g.fillRect(gx-4,gy+6,4,8);g.fillStyle='#8a836f';g.fillRect(gx-4,gy-14,1,8);g.fillRect(gx-4,gy+6,1,8);}
 if(G.screen){g.fillStyle='#05070a';const yy=Math.round(cy-outA.T*(1-roofOf('T'))+1);for(let x=Math.round(cx-ax*0.95);x<cx+ax*0.95;x++){g.fillRect(x,yy,1,2);if(x%2===0){g.fillStyle=(Math.floor(x/30)%2)?'#ffffff':'#7fd0ff';g.fillRect(x,yy,1,1);g.fillStyle='#05070a';}}}
 // nombre del estadio y lema (los dibuja drawTrapos sobre la banda de la tribuna de enfrente)
 stadPlates=null;
 if(G.far!=='palcos'){const by=bandYs.length?bandYs[0]+1:Math.max(8,Math.round((farFront[Math.round(W*0.25)]||yF)*0.6));
  stadPlates={ny:by,acc:lum(st.seats[0])<70||lum(st.seats[0])>200?'#ffd27a':st.seats[0]};}
 else{const ty=Math.round((cy-outA.T+farFront[Math.round(W*0.27)])/2);for(const[xx,tx]of [[W*0.27,'LA BOMBONERA'],[W*0.73,'LA 12']]){g0.font='8px Silkscreen, monospace';const w=Math.ceil(g0.measureText(tx).width)+10;g0.fillStyle='#0A2D7A';g0.fillRect(Math.round(xx-w/2),ty-6,w,12);g0.fillStyle='#F5C400';g0.fillRect(Math.round(xx-w/2),ty-6,w,1);g0.fillRect(Math.round(xx-w/2),ty+5,w,1);pxText(g0,tx,Math.round(xx),ty,'#F5C400','#000');}}
 // frentes de las tribunas, por columna/fila (para colgar los trapos)
 for(let x=0;x<W;x++){if(farFront[x]<0)farFront[x]=yF;if(nearFront[x]>=H)nearFront[x]=yB0;}
 for(let y=0;y<H;y++){if(Lfront[y]<0)Lfront[y]=xInL;if(Rfront[y]>=W)Rfront[y]=xInR;}
 stadLayout={S,yF,yB0,xInL,xInR,roofB:Math.round(cy-outA.T),farFront,nearFront,Lfront,Rfront,kind,over:g.canvas};
 return stadLayout;
}

// capas de la hinchada (quieta y saltando) a partir de los lugares del estadio
function buildCrowd(st,kits,topEdge,botEdge,W,H){
 const L=stadLayout,rnd=srnd(kits[0].p.length*31+st.n.length*7+parseInt(kits[0].p.slice(1),16)%997);
 const mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c;};
 const A=mk(),B=mk(),ga=A.getContext('2d'),gb=B.getContext('2d');
 const home=[],away=[],barra=[];
 const alt=k=>k.s===k.p?(lum(k.p)>150?'#16161B':'#F4F4F2'):k.s;
 const shirt=(k,r,x,y,dense)=>{const zone=(Math.sin(x*0.07+y*0.3)+Math.sin(x*0.023-y*0.11))*0.5,v=r();
  if(v<(dense?0.03:0.07))return v<0.035?'#e8e8e2':'#1b1d22';return zone>0.35?alt(k):(zone<-0.55&&v<0.5?k.shorts:k.p);};
 const fan=(x,y,k,r,dense)=>{
  const sk=CROWD_SKIN[Math.floor(r()*CROWD_SKIN.length)],c=shirt(k,r,x,y,dense),dk=sh(c,-0.3),arm=r()<(dense?0.6:0.35);
  ga.fillStyle=sk;ga.fillRect(x,y-1,1,1);ga.fillStyle=c;ga.fillRect(x,y,2,1);ga.fillStyle=dk;ga.fillRect(x,y+1,2,1);
  gb.fillStyle=sk;gb.fillRect(x,y-2,1,1);gb.fillStyle=c;gb.fillRect(x,y-1,2,1);gb.fillStyle=dk;gb.fillRect(x,y,2,1);if(arm){gb.fillStyle=c;gb.fillRect(x-1,y-3,1,2);gb.fillRect(x+2,y-3,1,2);}
 };
 for(const[x,y,sec,t]of L.S){
  const tierFill=[0.72,0.55,0.42];
  const fill=sec==='barra'?0.95:sec==='away'?0.82:sec==='far'?tierFill[Math.min(2,t)]:0.58;
  if(rnd()>fill)continue;
  const isAway=sec==='away';fan(x,y,isAway?kits[1]:kits[0],rnd,sec==='barra');
  (isAway?away:sec==='barra'?barra:home).push([x,y]);
 }
 // banderas: muchas en la popular local, algunas en la visitante y en las tribunas
 const flags=[];
 const pick=(arr,n,k,w,h)=>{for(let i=0;i<n&&arr.length;i++){const s=arr[Math.floor(rnd()*arr.length)];flags.push({x:s[0],y:s[1]-4,w,h,k,ph:rnd()*6});}};
 pick(barra,7,kits[0],9,6);pick(away,3,kits[1],9,6);pick(home.filter(s=>s[1]<L.yF),4,kits[0],12,7);pick(home.filter(s=>s[1]>L.yB0),3,kits[0],12,6);
 return{A,B,home,away,barra,flags,W,H};
}

// trapos colgados del alambrado (van arriba de la gente), siguiendo el frente de cada tribuna
function drawTrapos(g,st,teams,kits,topEdge,botEdge,W){
 const L=stadLayout;if(L.over)g.drawImage(L.over,0,0);
 const cl=x=>Math.max(0,Math.min(W-1,Math.round(x)));
 const fTop=(x,w)=>{let m=-1;for(let i=x;i<x+w;i++)m=Math.max(m,L.farFront[cl(i)]);return m-7;};
 const fBot=(x,w)=>{let m=1e9;for(let i=x;i<x+w;i++)m=Math.min(m,L.nearFront[cl(i)]);return m+1;};
 const altc=k=>k.s===k.p?(lum(k.p)>150?'#16161B':'#F4F4F2'):k.s;
 const stripes=(x,w,h,yy,k)=>{for(let i=0;i<w;i++){g.fillStyle=Math.floor(i/4)%2?k.p:altc(k);g.fillRect(x+i,yy,1,h);}g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x,yy+h-1,w,1);};
 const cloth=(x,w,yy,k,txt)=>{const h=10;g.fillStyle=k.p;g.fillRect(x,yy,w,h);g.fillStyle=altc(k);g.fillRect(x,yy,w,1);g.fillRect(x,yy+h-1,w,1);
  g.font='8px Silkscreen, monospace';g.textAlign='center';g.textBaseline='middle';g.fillStyle=lum(k.p)>150?'#16161B':'#F4F4F2';g.fillText(txt,x+w/2,yy+h/2+1);};
 const vcloth=(x,yy,h,k)=>{for(let j=0;j<h;j++){g.fillStyle=Math.floor(j/4)%2?k.p:altc(k);g.fillRect(x,yy+j,5,1);}};
 if(stadPlates){const ny=stadPlates.ny;
  const plate=(x,txt,col)=>{g.font='8px Silkscreen, monospace';const w=Math.ceil(g.measureText(txt).width)+8;g.fillStyle='rgba(5,7,10,0.92)';g.fillRect(Math.round(x-w/2),ny-5,w,10);g.fillStyle=col;g.fillRect(Math.round(x-w/2),ny-5,w,1);g.fillRect(Math.round(x-w/2),ny+4,w,1);pxText(g,txt,x,ny,col,'#000');};
  plate(Math.round(W*0.25),st.n,stadPlates.acc);plate(Math.round(W*0.75),st.motto||st.c.toUpperCase(),'#f3f0e2');}
 const nm=teams[0].name.toUpperCase().split(' ')[0];
 const X0=Math.round(L.xInL)+14,X1=Math.round(L.xInR)-14;
 cloth(X0,70,fTop(X0,70),kits[0],nm);stripes(X0+76,22,6,fTop(X0+76,22)+2,kits[0]);cloth(X0+104,58,fTop(X0+104,58),kits[0],st.motto&&st.motto.length<10?st.motto:'VAMOS');
 cloth(X1-136,66,fTop(X1-136,66),kits[0],teams[0].abbr);stripes(X1-64,30,6,fTop(X1-64,30)+2,kits[0]);
 cloth(X0+10,64,fBot(X0+10,64),kits[0],teams[0].abbr);stripes(X0+80,30,6,fBot(X0+80,30)+2,kits[0]);cloth(X1-130,90,fBot(X1-130,90),kits[0],'DALE '+nm.slice(0,8));stripes(X1-34,26,6,fBot(X1-34,26)+2,kits[0]);
 // trapos verticales en las cabeceras: la popular local y la visitante
 for(let i=0;i<4;i++){const yy=L.yF+12+i*40;vcloth(L.Lfront[cl(yy+15)]-5,yy,30,kits[0]);}
 for(let i=0;i<3;i++){const yy=L.yF+18+i*50;vcloth(L.Rfront[cl(yy+15)]+1,yy,30,kits[1]);}
}

/* ---------- efectos de tribuna ---------- */
const party={flares:[],smoke:[],hype:0.25,next:8,beatT:0,chant:0};
function resetParty(){party.flares.length=0;party.smoke.length=0;party.hype=0.3;party.next=10+Math.random()*10;party.chant=0;}
function pickSpot(team){if(!crowd)return null;const L=team===1?crowd.away:(crowd.barra.length&&Math.random()<0.65?crowd.barra:crowd.home);if(!L.length)return null;return L[Math.floor(Math.random()*L.length)];}
function addFlare(team,n,col){for(let i=0;i<n;i++){const s=pickSpot(team);if(!s)return;party.flares.push({x:s[0],y:s[1]-1,t:-Math.random()*1.2,ttl:5+Math.random()*4,col:col||(Math.random()<0.8?'r':'g')});}}
function addSmoke(team,n,col){for(let i=0;i<n;i++){const s=pickSpot(team);if(!s)return;for(let k=0;k<6;k++)party.smoke.push({x:s[0]+(Math.random()-0.5)*6,y:s[1],vx:(Math.random()-0.5)*4+3,vy:-(3+Math.random()*5),r:2+Math.random()*2,t:-k*0.25-Math.random(),ttl:4+Math.random()*2,col});}if(party.smoke.length>260)party.smoke.splice(0,party.smoke.length-260);}
function papelitos(team,n){
 if(!crowd)return;const k=game.kits[team===1?1:0];const cols=['#ffffff','#f3f0e2',k.p,k.s===k.p?'#ffffff':k.s,'#ffffff'];
 for(let i=0;i<n;i++){const s=pickSpot(team);if(!s)break;fx.confetti.push({x:s[0]+(Math.random()-0.5)*10,y:s[1]-6-Math.random()*20,vx:(Math.random()-0.5)*16,vy:-(4+Math.random()*16),col:cols[Math.floor(Math.random()*cols.length)],t:0,ttl:2.4+Math.random()*2.6,paper:1});}
 if(fx.confetti.length>900)fx.confetti.splice(0,fx.confetti.length-900);
}
function crowdEvent(kind,team){
 if(!crowd||!game||game.demo)return;
 if(kind==='kickoff'){party.hype=0.9;addFlare(0,7);addFlare(1,3);addSmoke(0,3,game.kits[0].p);addSmoke(1,1,game.kits[1].p);papelitos(0,260);papelitos(1,70);}
 else if(kind==='goal'){party.hype=1;addFlare(team,team===1?5:9);addSmoke(team,2,game.kits[team].p);papelitos(team,team===1?120:240);}
 else if(kind==='chance'){party.hype=Math.min(1,party.hype+0.35);}
 else if(kind==='save'){party.hype=Math.min(1,party.hype+0.25);}
}
function updateParty(dt){
 if(!crowd||!game)return;
 party.hype=Math.max(0.22,party.hype-dt*0.09);
 party.next-=dt;if(party.next<=0&&!game.demo){party.next=14+Math.random()*16;const t=Math.random()<0.75?0:1;addFlare(t,1+Math.floor(Math.random()*2));if(Math.random()<0.4)addSmoke(t,1,game.kits[t].p);}
 for(let i=party.flares.length-1;i>=0;i--){const f=party.flares[i];f.t+=dt;if(f.t>f.ttl){party.flares.splice(i,1);continue;}if(f.t>0&&Math.random()<dt*9)party.smoke.push({x:f.x+(Math.random()-0.5)*2,y:f.y-1,vx:3+Math.random()*3,vy:-(4+Math.random()*4),r:1.5,t:0,ttl:2.5+Math.random()*1.5,col:f.col==='g'?'#b8f0b2':'#e8c4bc'});}
 for(let i=party.smoke.length-1;i>=0;i--){const m=party.smoke[i];m.t+=dt;if(m.t>m.ttl){party.smoke.splice(i,1);continue;}if(m.t>0){m.x+=m.vx*dt;m.y+=m.vy*dt;m.r+=dt*2.2;}}
}
// dibuja la hinchada (saltando en olas según la emoción), banderas, bengalas y humo
function drawStands(c,now){
 if(!crowd)return;
 if(!crowd.F){crowd.F=document.createElement('canvas');crowd.F.width=crowd.W;crowd.F.height=crowd.H;crowd.fg=crowd.F.getContext('2d');crowd.ft=-1;}
 const fr=Math.floor(now*20);
 if(fr!==crowd.ft){crowd.ft=fr;const g=crowd.fg,W=crowd.W,H=crowd.H,L=stadLayout||{xInL:0,xInR:W,yF:H,yB0:0};
  const x0=L.xInL+2,x1=L.xInR-2,yT=Math.min(H,L.yF+4),yB=Math.max(0,L.yB0-5);
  if(pitch)g.drawImage(pitch,0,0);else g.clearRect(0,0,W,H);
  const h=party.hype,sp=4+6*h,thr=0.85-1.3*h;
  for(let x=0;x<W;x+=4){
   const w=Math.sin(x*0.045-now*sp)+0.35*Math.sin(x*0.13+now*2.3),src=w>thr?crowd.B:crowd.A;
   if(x+4<=x0||x>=x1)g.drawImage(src,x,0,4,H,x,0,4,H);
   else{g.drawImage(src,x,0,4,yT,x,0,4,yT);g.drawImage(src,x,yB,4,H-yB,x,yB,4,H-yB);}
  }
  if(crowd.T)g.drawImage(crowd.T,0,0);
  for(const f of crowd.flags){
   const k=f.k,alt=k.s===k.p?(lum(k.p)>150?'#16161B':'#F4F4F2'):k.s;
   g.fillStyle='#d9d9d9';g.fillRect(f.x-1,f.y-2,1,f.h+5);
   for(let i=0;i<f.w;i++){const dy=Math.round(Math.sin(now*6+f.ph+i*0.5)*(1+h));g.fillStyle=Math.floor(i/3)%2?k.p:alt;g.fillRect(f.x+i,f.y+dy,1,f.h);}
  }
 }
 c.drawImage(crowd.F,0,0);
 for(const m of party.smoke){if(m.t<0)continue;const a=0.42*(1-m.t/m.ttl)*Math.min(1,m.t*3);c.fillStyle=hexA(m.col,a);const r=Math.round(m.r);c.fillRect(Math.round(m.x-r),Math.round(m.y-r*0.7),r*2,Math.max(1,Math.round(r*1.4)));c.fillRect(Math.round(m.x-r*0.6),Math.round(m.y-r),Math.round(r*1.2),r*2);}
 c.save();c.globalCompositeOperation='lighter';
 for(const f of party.flares){if(f.t<0)continue;const fl=0.7+0.3*Math.sin(now*40+f.x),col=f.col==='g'?[90,255,120]:[255,90,40];
  const up=Math.min(1,f.t*2)*(f.t>f.ttl-0.8?(f.ttl-f.t)/0.8:1);
  for(let r=11;r>=2;r-=1){c.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},${0.06*fl*up})`;c.fillRect(Math.round(f.x-r),Math.round(f.y-r*0.8),r*2+1,Math.round(r*1.6)+1);}
  c.fillStyle=f.col==='g'?'#eaffe4':'#fffbe8';c.fillRect(Math.round(f.x),Math.round(f.y)-2,1,3);c.fillStyle=f.col==='g'?'#5aff78':'#ff7a2a';c.fillRect(Math.round(f.x)-1,Math.round(f.y)-1,3,2);
  if(Math.random()<0.5){c.fillStyle='#ffd27a';c.fillRect(Math.round(f.x+(Math.random()-0.5)*4),Math.round(f.y-3-Math.random()*3),1,1);}}
 c.restore();
}

/* ---------- sonido de cancha: murmullo según la emoción y bombo ---------- */
const crowdAudio={src:null,gain:null,filt:null,last:0};
function updateCrowdAudio(dt,active){
 const a=AC;if(!a)return;
 if(!crowdAudio.src){
  try{const n=a.sampleRate*2,buf=a.createBuffer(1,n,a.sampleRate),d=buf.getChannelData(0);let v=0;for(let i=0;i<n;i++){v=v*0.97+(Math.random()*2-1)*0.3;d[i]=v;}
   const src=a.createBufferSource();src.buffer=buf;src.loop=true;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=520;f.Q.value=0.6;const g=a.createGain();g.gain.value=0;src.connect(f).connect(g).connect(a.destination);src.start();crowdAudio.src=src;crowdAudio.gain=g;crowdAudio.filt=f;}catch(e){return;}
 }
 const target=(!active||muted)?0:0.05+0.16*party.hype;
 crowdAudio.gain.gain.setTargetAtTime(target,a.currentTime,0.4);
 crowdAudio.filt.frequency.setTargetAtTime(420+500*party.hype,a.currentTime,0.5);
 // bombo: arranca cuando la hinchada se calienta
 if(!active||muted)return;
 party.chant-=dt;
 if(party.chant<=0&&party.hype>0.45)party.chant=6+Math.random()*4;
 if(party.chant>0){party.beatT-=dt;if(party.beatT<=0){const pat=[0.42,0.21,0.21,0.42,0.42];const i=crowdAudio.last=(crowdAudio.last+1)%pat.length;party.beatT=pat[i];tone(78,46,0.16,'sine',0.22);noise(0.04,0.06,180);}}
}

function buildPitch(s,kits){
 const c=document.createElement('canvas');c.width=LW;c.height=LH;const g=c.getContext('2d');
 const L2=s.L/2,W2=s.W/2,G2=s.G/2,GD=SIM.GD,BAR=SIM.BAR;
 g.fillStyle='#0e1813';g.fillRect(0,0,LW,LH);
 // tribuna con hinchas (colores de los dos equipos)
 let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const crowdCols=[mix(kits[0].p,'#0e1813',0.35),mix(kits[0].s,'#0e1813',0.35),mix(kits[1].p,'#0e1813',0.35),mix(kits[1].s,'#0e1813',0.35),'#2b3a33','#1d2a24','#384a40','#1a2620'];
 const topEdge=P(0,-W2-0.5,1.1)[1],botEdge=P(0,W2+0.5,0)[1];
 const STD=game?game.stadium:stadiumOf(TEAMS[0]);
 const xInL=Math.floor(P(-L2-GD-0.6,0)[0])-3,xInR=Math.ceil(P(L2+GD+0.6,0)[0])+3;
 drawStadium(g,STD,kits,topEdge,botEdge,LW,LH,xInL,xInR);
 // césped con franjas de corte
 const[fx0,fy0]=P(-L2-0.6,-W2-0.4),[fx1,fy1]=P(L2+0.6,W2+0.4);
 g.fillStyle='#2f7d36';g.fillRect(Math.round(fx0),Math.round(fy0),Math.round(fx1-fx0),Math.round(fy1-fy0));
 const band=2.5;for(let x=-L2,i=0;x<L2;x+=band,i++){if(i%2)continue;const[a]=P(x),[b]=P(Math.min(L2,x+band));g.fillStyle='#358a3c';g.fillRect(Math.round(a),Math.round(P(0,-W2)[1]),Math.round(b-a),Math.round(P(0,W2)[1]-P(0,-W2)[1]));}
 // líneas
 const W='rgba(244,242,230,0.92)';
 const rect=(x0,y0,x1,y1)=>{const a=P(x0,y0),b=P(x1,y0),c2=P(x1,y1),d=P(x0,y1);pline(g,...a,...b,W);pline(g,...b,...c2,W);pline(g,...c2,...d,W);pline(g,...d,...a,W);};
 // esquinas redondeadas: lo que queda fuera del arco es valla, no cancha
 const RC=SIM.RC;
 for(const sx of [-1,1])for(const sy of [-1,1]){
  const ccx=sx*(L2-RC),ccy=sy*(W2-RC);
  const[a0,b0]=P(sx<0?-L2-0.6:L2-RC,sy<0?-W2-0.4:W2-RC),[a1,b1]=P(sx<0?-L2+RC:L2+0.6,sy<0?-W2+RC:W2+0.4);
  if(RC>0)for(let yy=Math.floor(b0);yy<=Math.ceil(b1);yy++)for(let xx=Math.floor(a0);xx<=Math.ceil(a1);xx++){
   const wx=(xx+0.5-view.cx)/view.ppm,wy=(yy+0.5-view.cy)/(view.ppm*YC);
   if(Math.abs(wx)>L2+0.01&&Math.abs(wy)<s.G/2)continue;
   if((wx-ccx)*sx>0&&(wy-ccy)*sy>0&&Math.hypot(wx-ccx,wy-ccy)>RC){g.fillStyle='#1c3524';g.fillRect(xx,yy,1,1);}
  }
 }
 pline(g,...P(-L2+RC,-W2),...P(L2-RC,-W2),W);pline(g,...P(-L2+RC,W2),...P(L2-RC,W2),W);
 for(const sx of [-1,1]){pline(g,...P(sx*L2,-W2+RC),...P(sx*L2,W2-RC),W);}
 for(const sx of [-1,1])for(const sy of [-1,1]){
  const ccx=sx*(L2-RC),ccy=sy*(W2-RC);let lp=null;
  if(RC>0)for(let i=0;i<=24;i++){const a=i/24*Math.PI/2,q=P(ccx+sx*Math.cos(a)*RC,ccy+sy*Math.sin(a)*RC);if(lp)pline(g,...lp,...q,W);lp=q;}
  // arco de córner
  lp=null;for(let i=0;i<=8;i++){const a=i/8*Math.PI/2,q=P(sx*(L2-Math.cos(a)*0.9),sy*(W2-Math.sin(a)*0.9));if(lp)pline(g,...lp,...q,W);lp=q;}
  // banderín
  const fp=P(sx*L2,sy*W2);g.fillStyle='#d9d9d2';g.fillRect(Math.round(fp[0]),Math.round(fp[1])-7,1,7);g.fillStyle=kits[0].p;g.fillRect(Math.round(fp[0])+(sx<0?1:-3),Math.round(fp[1])-7,3,2);g.fillStyle=sh(kits[0].p,-0.3);g.fillRect(Math.round(fp[0])+(sx<0?1:-3),Math.round(fp[1])-5,3,1);
 }
 pline(g,...P(0,-W2),...P(0,W2),W);
 pellipse(g,...P(0,0),3*view.ppm,3*view.ppm*YC,W);
 g.fillStyle=W;const cs=P(0,0);g.fillRect(Math.round(cs[0])-1,Math.round(cs[1]),2,1);
 for(const sd of [-1,1]){
  const bw=G2+2.6,bd=5;rect(sd<0?-L2:L2-bd,-bw,sd<0?-L2+bd:L2,bw);
  const aw=G2+0.9,ad=1.8;rect(sd<0?-L2:L2-ad,-aw,sd<0?-L2+ad:L2,aw);
  const ps=P(sd*(L2-3.6),0);g.fillRect(Math.round(ps[0]),Math.round(ps[1]),1,1);
 }
 // vallas publicitarias (son las paredes)
 const ads=['PICADITO','FERNET 1882','CHORI & PAN','MATE COCIDO','EL POTRERO','ASADO FC'];
 const adCols=[['#c8102e','#fff'],['#0b3d91','#ffd400'],['#1f1f1f','#7cfc00'],['#f2a900','#1a1a1a'],['#ffffff','#0b3d91'],['#5b2a86','#ffffff']];
 g.font='8px Silkscreen, monospace';g.textBaseline='middle';
 const boardH=0.9;
 const drawBoardRow=(y,front)=>{const[x0,yt]=P(-L2-GD-0.6,y,boardH),[x1,yb]=P(L2+GD+0.6,y,0);const w=x1-x0,h=Math.max(6,yb-yt);const n=6;
  for(let i=0;i<n;i++){const xa=Math.round(x0+w*i/n),xb=Math.round(x0+w*(i+1)/n);const[bgc,fg]=adCols[(i+(front?3:0))%adCols.length];g.fillStyle=bgc;g.fillRect(xa,Math.round(yt),xb-xa,Math.round(h));g.fillStyle='rgba(0,0,0,.35)';g.fillRect(xa,Math.round(yt+h)-1,xb-xa,1);g.fillStyle=fg;g.textAlign='center';g.fillText(ads[(i+(front?2:0))%ads.length],Math.round((xa+xb)/2),Math.round(yt+h/2)+1);}
 };
 drawBoardRow(-W2-0.25,false);
 // arcos: piso y redes (el marco va encima de los jugadores)
 for(const sd of [-1,1]){
  const xf=sd*L2,xb=sd*(L2+GD);
  const net='rgba(235,235,225,0.32)';
  g.fillStyle='rgba(0,0,0,0.18)';const q=[P(xf,-G2),P(xb,-G2),P(xb,G2),P(xf,G2)];g.beginPath();g.moveTo(...q[0]);for(const v of q)g.lineTo(...v);g.closePath();g.fill();
  void net;
  // sombra de los palos y del travesaño en el pasto
  g.fillStyle='rgba(0,0,0,0.22)';for(const y of [-G2,G2]){const a=P(xf,y,0);g.fillRect(Math.round(a[0])-1,Math.round(a[1]),4,2);}
 }
 return c;
}
/* ---------- arcos con red que se mueve ----------
   La red de atrás es una malla de puntos con resortes: cuando la pelota pega, se abolla y ondula.
   Las redes de los costados y el techo también ceden. Es solo visual: la física de la pelota está en SIM. */
const NET_NY=11,NET_NZ=7;
const nets={};
function netOf(sd){if(!nets[sd]){const n=NET_NY*NET_NZ;nets[sd]={d:new Float32Array(n),v:new Float32Array(n),side:[0,0],sideV:[0,0],roof:0,roofV:0};}return nets[sd];}
function resetNets(){for(const k in nets)delete nets[k];}
function netHit(e){
 const s=game.state,G2=s.G/2,BAR=SIM.BAR,N=netOf(e.sd);
 if(e.t==='net'){for(let i=0;i<NET_NY;i++)for(let j=0;j<NET_NZ;j++){const y=-G2+i*(2*G2)/(NET_NY-1),z=j*BAR/(NET_NZ-1),w=Math.exp(-(((y-e.y)**2)+((z-e.z)**2))/0.55);N.v[i*NET_NZ+j]+=w*Math.min(18,e.v)*0.16;}}
 else if(e.t==='sidenet'){const k=e.y>0?1:0;N.sideV[k]+=Math.min(14,e.v)*0.05+0.25;}
 else if(e.t==='roofnet'){N.roofV+=Math.min(10,e.v)*0.05+0.15;}
}
function updateNets(dt,s){
 if(!(dt>0))return;const L2=s.L/2,G2=s.G/2,GD=SIM.GD,BAR=SIM.BAR,BR=SIM.BR,b=s.ball;
 const steps=Math.min(4,Math.ceil(dt/0.008)),h=dt/steps;
 for(const sd of [-1,1]){const N=netOf(sd);
  for(let st=0;st<steps;st++){
   for(let i=0;i<NET_NY;i++)for(let j=0;j<NET_NZ;j++){const k=i*NET_NZ+j;
    // los bordes están atados al marco
    if(i===0||i===NET_NY-1||j===NET_NZ-1){N.d[k]=0;N.v[k]=0;continue;}
    const nb=(N.d[k-NET_NZ]+N.d[k+NET_NZ]+N.d[k+1]+(j>0?N.d[k-1]:N.d[k]*0.5))*0.25;
    const a=-55*N.d[k]+260*(nb-N.d[k])-5*N.v[k];N.v[k]+=a*h;}
   for(let k=0;k<N.d.length;k++){N.d[k]+=N.v[k]*h;if(N.d[k]<-0.08)N.d[k]=-0.08;if(N.d[k]>0.75)N.d[k]=0.75;}
   for(const q of [0,1]){N.sideV[q]+=(-70*N.side[q]-4*N.sideV[q])*h;N.side[q]+=N.sideV[q]*h;}
   N.roofV+=(-70*N.roof-4*N.roofV)*h;N.roof+=N.roofV*h;
  }
  // la pelota apoyada contra la red la empuja
  const pen=b.x*sd-(L2+GD-BR);
  if(pen>-0.05&&Math.abs(b.y)<G2&&b.z<BAR){for(let i=1;i<NET_NY-1;i++)for(let j=0;j<NET_NZ-1;j++){const y=-G2+i*(2*G2)/(NET_NY-1),z=j*BAR/(NET_NZ-1),w=Math.exp(-(((y-b.y)**2)+((z-b.z)**2))/0.3),k=i*NET_NZ+j,t=(pen+0.12)*w;if(N.d[k]<t)N.d[k]=t;}}
 }
}
// partes de atrás del arco (van detrás de los jugadores): red del fondo, red lateral lejana y techo
function drawGoalBack(c,s){
 const L2=s.L/2,G2=s.G/2,GD=SIM.GD,BAR=SIM.BAR;
 const netC='rgba(238,238,228,0.55)',netD='rgba(238,238,228,0.28)';
 for(const sd of [-1,1]){
  const N=netOf(sd),xf=sd*L2,xb=sd*(L2+GD);
  const node=(i,j)=>{const y=-G2+i*(2*G2)/(NET_NY-1),z=j*BAR/(NET_NZ-1);return P(xb+sd*N.d[i*NET_NZ+j],y,z);};
  // techo (de travesaño a la parte de arriba del fondo)
  for(let i=0;i<NET_NY;i+=2){const y=-G2+i*(2*G2)/(NET_NY-1);const a=P(xf,y,BAR),q=node(i,NET_NZ-1);const m=P((xf+xb)/2,y,BAR-0.12-N.roof*0.6);pline(c,...a,...m,netD);pline(c,...m,...q,netD);}
  for(let t=0.33;t<1;t+=0.33){const x=xf+(xb-xf)*t;pline(c,...P(x,-G2,BAR-N.roof*0.4),...P(x,G2,BAR-N.roof*0.4),netD);}
  // red lateral lejana (y = -G2)
  const sb=N.side[0];
  for(let t=0;t<=1.0001;t+=0.2){const x=xf+(xb-xf)*t,bul=Math.sin(t*Math.PI)*sb;pline(c,...P(x,-G2-bul,0),...P(x,-G2-bul,BAR),netD);}
  for(let z=0.4;z<BAR;z+=0.4)pline(c,...P(xf,-G2,z),...P(xb,-G2-0,z),netD);
  // red de atrás (malla con resortes)
  for(let i=0;i<NET_NY;i++)for(let j=0;j<NET_NZ;j++){
   const a=node(i,j);
   if(i<NET_NY-1){const q=node(i+1,j);pline(c,...a,...q,netC);}
   if(j<NET_NZ-1){const q=node(i,j+1);pline(c,...a,...q,netC);}
  }
  // caños de atrás (base y arriba)
  pline(c,...P(xb,-G2,0),...P(xb,G2,0),'#9aa0a8');pline(c,...P(xf,-G2,0),...P(xb,-G2,0),'#9aa0a8');
 }
}
function drawGoalFrames(c,s){
 const L2=s.L/2,G2=s.G/2,GD=SIM.GD,BAR=SIM.BAR;
 for(const sd of [-1,1]){
  const N=netOf(sd),xf=sd*L2,xb=sd*(L2+GD),netC='rgba(238,238,228,0.42)';
  // red lateral cercana (y = +G2), por delante de la pelota
  const sb=N.side[1];
  for(let t=0;t<=1.0001;t+=0.2){const x=xf+(xb-xf)*t,bul=Math.sin(t*Math.PI)*sb;pline(c,...P(x,G2+bul,0),...P(x,G2+bul,BAR),netC);}
  for(let z=0.4;z<BAR;z+=0.4)pline(c,...P(xf,G2,z),...P(xb,G2,z),netC);
  pline(c,...P(xf,G2,BAR),...P(xb,G2,BAR),'#c9ccd1');pline(c,...P(xb,G2,0),...P(xb,G2,BAR),'#9aa0a8');pline(c,...P(xf,G2,0),...P(xb,G2,0),'#9aa0a8');
  pline(c,...P(xb,-G2,BAR),...P(xb,G2,BAR),'#c9ccd1');
  // palos y travesaño: tubos blancos con sombra
  for(const y of [-G2,G2]){const a=P(xf,y,0),q=P(xf,y,BAR);
   pline(c,a[0]-sd,a[1],q[0]-sd,q[1],'#ffffff');pline(c,...a,...q,'#ffffff');pline(c,a[0]+sd,a[1],q[0]+sd,q[1],'#b9bcc2');
   c.fillStyle='#8d949d';c.fillRect(Math.round(a[0])-1,Math.round(a[1]),3,1);}
  const a=P(xf,-G2,BAR),q=P(xf,G2,BAR);pline(c,...a,...q,'#ffffff');pline(c,a[0],a[1]-1,q[0],q[1]-1,'#ffffff');pline(c,a[0],a[1]+1,q[0],q[1]+1,'#b9bcc2');
 }
 // valla de adelante
 const L=s.L/2+GD+0.6,y=s.W/2+0.3;const[x0,yt]=P(-L,y,0.9),[x1,yb]=P(L,y,0);
 const cols=['#ffffff','#c8102e','#0b3d91','#f2a900','#1f1f1f','#5b2a86'];const n=6,w=x1-x0;
 for(let i=0;i<n;i++){const xa=Math.round(x0+w*i/n),xb=Math.round(x0+w*(i+1)/n);c.fillStyle=cols[i];c.fillRect(xa,Math.round(yb)-3,xb-xa,4);c.fillStyle='rgba(0,0,0,.4)';c.fillRect(xa,Math.round(yb)+1,xb-xa,1);}
}

function patColor(k,i,j){
 switch(k.pat){
  case'vstripes':return Math.floor(i/2)%2===0?k.p:k.s;
  case'hband':return j>=2&&j<=4?k.s:k.p;
  case'sash':{const d=(7-i)-j*1.15;return d>-1.6&&d<1.0?k.s:k.p;}
  case'hoops':return j%2?k.s:k.p;
  case'halves':return i<4?k.p:k.s;
  case'vee':return j<=3&&(i===j||i===7-j||i===j+1||i===6-j)?k.s:k.p;
  case'vband':return i===3||i===4?k.s:k.p;
  default:return k.p;
 }
}
function drawNum(c,num,col){
 const str=String(num);const x0=str.length===1?-2:-4;c.fillStyle=col;
 for(let d=0;d<str.length;d++){const rows=DIG[str[d]];for(let r=0;r<5;r++)for(let q=0;q<3;q++)if(rows[r][q]==='#')c.fillRect(x0+d*4+q,-15+r,1,1);}
}
// Peinado y detalles de cada jugador, fijos según su nombre
const HSTYLE={};
function hairStyle(name){const k=String(name||'');if(HSTYLE[k])return HSTYLE[k];let h=7;for(const ch of k)h=(Math.imul(h,31)+ch.charCodeAt(0))|0;h=Math.abs(h);
 return HSTYLE[k]={st:h%5,beard:(h>>3)%4===0,band:(h>>5)%9===0,acc:['#e8e8e8','#ff5a2a','#3fd8ff','#ffe14d','#7dff4f'][(h>>7)%5]};}
// Jugador chiquito (23 px de alto) con más detalle: sombreado, peinados, barba, orejas, nariz,
// cuello de la camiseta, escudito, medias con vivo, botines con color y carrera de 6 cuadros.
function drawFootballer(c,fx,fy,o){
 c.save();c.translate(Math.round(fx),Math.round(fy));
 if(o.flip)c.scale(-1,1);
 if(o.diveDown){c.scale(1,-1);c.translate(0,-6);}
 const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 const k=o.kit,skin=o.skin,hair=o.hair,boot='#141414',eye='#1b1b1b';
 const hs=hairStyle(o.name||o.num),skD=sh(skin,-0.22),skL=sh(skin,0.12),hairL=sh(hair,0.18);
 const glove='#f0f0ea';
 // carrera: 6 cuadros (antes 4), con el pie que vuelve levantado y el cuerpo que baja en la zancada
 const f6=o.moving?Math.floor((o.phase||0)*1.5)%6:0,a=f6/6*Math.PI*2;
 const swing=o.moving?Math.round(Math.sin(a)*2.4):0,lift=o.moving?Math.cos(a):0;
 const bob=o.moving&&Math.abs(swing)>=2?1:0;
 if(o.view==='side'){
  let fl=swing,bl=-swing,up=o.moving&&lift<-0.4?1:0,up2=o.moving&&lift>0.4?1:0;
  if(o.kick){fl=3;up=2;bl=-1;}
  if(o.heel){bl=-3;up2=3;}
  // pierna de atrás (más oscura)
  const leg=(dx,du,dark)=>{const d=dark?-0.28:0;
   R(-1+dx,-5-du,2,3,sh(k.socks,d));if(k.s!==k.socks)R(-1+dx,-5-du,2,1,sh(k.s===k.p?'#f4f4f2':k.s,d-0.05));
   R(-1+dx,-6-du,2,1,dark?skD:skin);
   R(-1+dx,-2-du,3,2,boot);R(1+dx,-1-du,1,1,dark?sh(hs.acc,-0.4):hs.acc);R(-1+dx,-2-du,1,1,'#2a2a2a');};
  leg(bl,up2,true);
  // short
  R(-3,-9+bob,6,3,k.shorts);R(-3,-7+bob,6,1,sh(k.shorts,-0.25));R(-3,-9+bob,1,2,sh(k.shorts,-0.15));
  leg(fl,up,false);
  // camiseta: la espalda en sombra, el pecho iluminado
  for(let j=0;j<7;j++)for(let i=0;i<6;i++){let col=patColor(k,i+1,j);if(i===0)col=sh(col,-0.25);else if(i===5)col=sh(col,0.1);R(-3+i,-16+j+bob,1,1,col);}
  R(-3,-16+bob,6,1,sh(patColor(k,3,0),0.08));if(k.collar)R(1,-16+bob,2,1,k.collar);
  // brazo: balanceo y mano un poco adelante al correr
  const ao=o.moving?Math.round(Math.sin(a+Math.PI)*1.2):0,hf=o.moving?1:0;
  if(o.armsOut){R(1,-15+bob,3,2,k.sleeve);R(4,-15+bob,2,2,o.gk?glove:skin);R(-4,-15+bob,2,2,sh(k.sleeve,-0.25));R(-6,-15+bob,2,2,o.gk?glove:skD);}
  else{R(-1+ao,-15+bob,2,3,k.sleeve);R(-1+ao,-15+bob,1,3,sh(k.sleeve,-0.2));
   if(o.gk){R(-1+ao+hf*(ao>0?1:0),-12+bob,2,2,k.sleeve);R(-1+ao+hf*(ao>0?1:0),-10+bob,2,2,glove);}
   else{R(-1+ao+(ao>0?hf:0),-12+bob,2,2,skin);R(-1+ao+(ao>0?hf:0),-12+bob,1,2,skD);}}
  // cabeza de perfil: nuca en sombra, oreja, ojo, nariz
  const hy=bob;
  R(0,-17+hy,2,1,skD);
  R(-2,-23+hy,5,6,skin);R(-2,-23+hy,1,6,skD);R(3,-20+hy,1,1,skin);R(2,-22+hy,1,1,skL);
  R(2,-20+hy,1,1,eye);R(0,-20+hy,1,1,sh(skin,-0.35));
  if(hs.beard&&hs.st!==3){R(0,-18+hy,3,1,hair);R(2,-19+hy,1,1,hair);}
  if(hs.st===3){R(-2,-23+hy,5,1,skL);R(-2,-22+hy,1,2,hair);}
  else if(hs.st===2){R(-2,-23+hy,5,1,sh(hair,-0.1));R(-2,-22+hy,2,1,hair);}
  else{R(-2,-23+hy,5,2,hair);R(-2,-21+hy,2,2,hair);R(-1,-23+hy,3,1,hairL);
   if(hs.st===1){R(-3,-22+hy,1,5,hair);R(-2,-19+hy,1,2,hair);}
   if(hs.st===4){R(-3,-24+hy,6,2,hair);R(-3,-22+hy,1,2,hair);R(-2,-24+hy,3,1,hairL);}}
  if(hs.band&&hs.st!==3)R(-2,-21+hy,5,1,k.s===k.p?'#f4f4f2':k.s);
 }else{
  const front=o.view!=='back';
  let lo=o.moving?(lift<-0.4?-1:0):0,ro=o.moving?(lift>0.4?-1:0):0,lx=0,rx=0;
  // bicicleta: una pierna pasa por encima de la pelota, levantada y hacia afuera
  if(o.legOut<0){lo=-3;lx=-2;}else if(o.legOut>0){ro=-3;rx=2;}
  const legF=(x,dy,dark)=>{const d=dark?-0.18:0;
   R(x,-2+dy,2,2,boot);R(x+(x<0?0:1),-1+dy,1,1,hs.acc);
   R(x,-5+dy,2,3,sh(k.socks,d));if(k.s!==k.socks)R(x,-5+dy,2,1,sh(k.s===k.p?'#f4f4f2':k.s,d-0.05));
   R(x,-6+dy,2,1,dark?skD:skin);};
  legF(-3+lx,lo,false);legF(1+rx,ro,true);
  // short con la abertura entre las piernas
  R(-4,-9+bob,8,3,k.shorts);R(-4,-7+bob,8,1,sh(k.shorts,-0.25));R(2,-9+bob,2,2,sh(k.shorts,-0.12));R(-1,-7+bob,2,1,sh(k.shorts,-0.45));
  // camiseta con luz de la izquierda
  for(let j=0;j<7;j++)for(let i=0;i<8;i++){let col=patColor(k,i,j);if(i>=6)col=sh(col,-0.2);else if(i===0)col=sh(col,0.1);if(j===6)col=sh(col,-0.12);R(-4+i,-16+j+bob,1,1,col);}
  if(front){if(k.collar){R(-1,-16+bob,2,1,k.collar);R(-1,-15+bob,1,1,sh(k.collar,-0.2));}
   R(1,-14+bob,1,1,lum(k.p)>150?'#3a3a3a':'#ffd23a');} // escudito
  else{R(-2,-16+bob,4,1,sh(patColor(k,3,0),-0.15));}
  if(o.armsOut){R(-7,-16+bob,3,2,k.sleeve);R(-9,-16+bob,2,2,o.gk?glove:skin);R(4,-16+bob,3,2,sh(k.sleeve,-0.18));R(7,-16+bob,2,2,o.gk?glove:skD);}
  else if(o.armsUp){R(-5,-23,2,3,k.sleeve);R(-5,-27,2,4,o.gk?k.sleeve:skin);R(3,-23,2,3,sh(k.sleeve,-0.18));R(3,-27,2,4,o.gk?sh(k.sleeve,-0.18):skD);if(o.gk){R(-5,-29,2,2,glove);R(3,-29,2,2,glove);}}
  else{const as=o.moving?Math.round(Math.sin(a)*1.3):0;
   R(-6,-16+as+bob,2,3,k.sleeve);R(-6,-16+as+bob,1,3,sh(k.sleeve,0.08));R(-6,-13+as+bob,2,3,o.gk?k.sleeve:skin);
   R(4,-16-as+bob,2,3,sh(k.sleeve,-0.2));R(4,-13-as+bob,2,3,o.gk?sh(k.sleeve,-0.2):skD);
   if(o.gk){R(-6,-11+as+bob,2,2,glove);R(4,-11-as+bob,2,2,glove);}}
  // cabeza
  const hy=bob;
  R(-1,-17+hy,2,1,skD);
  R(-3,-23+hy,6,6,skin);R(2,-23+hy,1,6,skD);R(-4,-20+hy,1,2,skin);R(3,-20+hy,1,2,skD); // orejas
  if(o.view==='back'){
   if(hs.st===3){R(-3,-23+hy,6,2,skL);R(-3,-21+hy,6,1,hair);}
   else if(hs.st===2)R(-3,-23+hy,6,3,sh(hair,-0.1));
   else{R(-3,-23+hy,6,5,hair);R(-2,-23+hy,3,1,hairL);if(hs.st===1)R(-3,-18+hy,6,2,hair);if(hs.st===4){R(-4,-25+hy,8,4,hair);R(-3,-25+hy,4,1,hairL);}}
   if(hs.band&&hs.st!==3)R(-3,-21+hy,6,1,k.s===k.p?'#f4f4f2':k.s);
   if(o.num!=null)drawNum(c,o.num,k.num);
  }else{
   R(-2,-22+hy,2,1,skL);
   R(-2,-20+hy,1,1,eye);R(1,-20+hy,1,1,eye);R(0,-19+hy,1,1,sh(skin,-0.3)); // ojos y nariz
   if(hs.beard&&hs.st!==3){R(-3,-18+hy,6,1,hair);R(-3,-19+hy,1,1,hair);R(2,-19+hy,1,1,hair);R(-1,-18+hy,2,1,sh(hair,0.2));}
   else R(-1,-18+hy,2,1,sh(skin,-0.28)); // boca
   if(hs.st===3){R(-3,-23+hy,6,1,skL);}
   else if(hs.st===2){R(-3,-23+hy,6,1,sh(hair,-0.1));R(-3,-22+hy,1,1,hair);R(2,-22+hy,1,1,hair);}
   else{R(-3,-23+hy,6,2,hair);R(-3,-21+hy,1,1,hair);R(2,-21+hy,1,1,hair);R(-2,-23+hy,3,1,hairL);
    if(hs.st===1){R(-4,-22+hy,1,5,hair);R(3,-22+hy,1,5,hair);}
    if(hs.st===4){R(-4,-25+hy,8,3,hair);R(-4,-22+hy,1,2,hair);R(3,-22+hy,1,2,hair);R(-3,-25+hy,4,1,hairL);}}
   if(hs.band&&hs.st!==3)R(-3,-21+hy,6,1,k.s===k.p?'#f4f4f2':k.s);
  }
 }
 c.restore();
}
const BALL5=['.###.','#####','#####','#####','.###.'];
const BALL7=['..###..','.#####.','#######','#######','#######','.#####.','..###..'];
function drawBall(c,b){
 const[gx,gy]=P(b.x,b.y,0);const a=Math.max(0.15,0.45-b.z*0.08);
 c.fillStyle=`rgba(0,0,0,${a})`;c.fillRect(Math.round(gx)-2,Math.round(gy),5,2);c.fillRect(Math.round(gx)-1,Math.round(gy)-1,3,1);
 const[x,y]=P(b.x,b.y,b.z);const pat=b.z>1.1?BALL7:BALL5,h=pat.length;
 const ox=Math.round(x)-(h>>1),oy=Math.round(y)-h+1;
 const fr=Math.floor(b.roll*3)%4;const spots=h===5?[[1,1],[3,1],[3,3],[1,3]]:[[2,2],[4,2],[4,4],[2,4]];const sp=spots[fr];
 for(let r=0;r<h;r++)for(let q=0;q<h;q++){if(pat[r][q]!=='#')continue;let col=r===h-1||q===h-1?'#cfcfc8':'#fbfbf6';if(q===sp[0]&&r===sp[1])col='#1b1b1b';c.fillStyle=col;c.fillRect(ox+q,oy+r,1,1);}
}

/* ---------- efectos (solo visuales, no tocan la simulación) ---------- */
const fx={shake:0,trail:[],popups:[],confetti:[],flash:0,dust:[]};
function resetFX(){fx.shake=0;fx.trail.length=0;fx.popups.length=0;fx.confetti.length=0;fx.flash=0;}
function popup(text,x,y,col){fx.popups.push({text,x,y,col:col||'#ffb02e',t:0});if(fx.popups.length>6)fx.popups.shift();}
function spawnConfetti(kit){
 const top=P(0,-game.state.W/2-0.5,1.1)[1];
 for(let i=0;i<160;i++){const bottom=i%3===0;fx.confetti.push({x:Math.random()*LW,y:bottom?LH-Math.random()*26:Math.random()*Math.max(10,top-6),vx:(Math.random()-0.5)*24,vy:-(14+Math.random()*30),col:Math.random()<0.5?kit.p:kit.s,t:0,ttl:2+Math.random()*1.6});}
}
function snap(s){return{b:{x:s.ball.x,y:s.ball.y,z:s.ball.z,roll:s.ball.roll,vx:s.ball.vx,vy:s.ball.vy},p:s.players.map(p=>[p.x,p.y,p.face,p.run,p.vx,p.vy,p.dive?p.dive.dy:null,p.diveT,p.kickAnim,p.slideT,p.slideDx,p.stunT,p.skill?{type:p.skill.type,t:p.skill.t,dur:p.skill.dur,burst:p.skill.burst}:null])};}
function snapScene(f){
 const s=game.state;
 const players=s.players.map((p,i)=>{const a=f.p[i],o=Object.create(p);o.x=a[0];o.y=a[1];o.face=a[2];o.run=a[3];o.vx=a[4];o.vy=a[5];o.dive=a[6]==null?null:{dy:a[6]};o.diveT=a[7];o.kickAnim=a[8];o.slideT=a[9];o.slideDx=a[10];o.stunT=a[11];o.skill=a[12]||null;o.charging=false;return o;});
 return{players,ball:f.b,replay:true};
}
function viewOf(p){
 const cs=Math.cos(p.face),sn=Math.sin(p.face);
 if(Math.abs(cs)>0.62)return{view:'side',flip:cs<0};
 return{view:sn>0?'front':'back',flip:false};
}
function drawAim(c,s,p){
 const inp=game.lastInputs&&game.lastInputs[p.id];if(!inp)return;
 const k=SIM.previewKick(s,p,inp),b=s.ball;
 if(!k.reach){
  for(let i=1;i<=3;i++){const q=P(p.x+k.ax*(0.6+i*0.5),p.y+k.ay*(0.6+i*0.5));c.fillStyle='rgba(255,255,255,0.35)';c.fillRect(Math.round(q[0]),Math.round(q[1]),1,1);}
  return;
 }
 const col=k.weak?'#ff5a4f':k.perfect?'#7dff4f':p.charge>0.86?'#ff9b4f':'#ffffff';
 const n=k.weak?4:12;
 for(let i=1;i<=n;i++){
  const t=i*0.055;let z=b.z+k.vz*t-7*t*t;if(z<0)z=0;
  const q=P(b.x+k.ux*k.spd*t,b.y+k.uy*k.spd*t,z);
  if(Math.abs(b.x+k.ux*k.spd*t)>s.L/2+SIM.GD||Math.abs(b.y+k.uy*k.spd*t)>s.W/2)break;
  c.fillStyle=col;c.globalAlpha=1-i/(n+2);c.fillRect(Math.round(q[0]),Math.round(q[1]),2,1);
 }
 c.globalAlpha=1;
}
// anillo pixelado (elipse de puntos), opcionalmente solo un arco desde arriba en sentido horario
function ringPx(c,cx,cy,rx,ry,col,dotted,from,to){
 const n=Math.max(28,Math.round((rx+ry)*4));c.fillStyle=col;from=from||0;to=to==null?1:to;
 let lx=null,ly=null,k=0;
 for(let i=Math.floor(from*n);i<=Math.ceil(to*n);i++){const a=-Math.PI/2+i/n*Math.PI*2,x=Math.round(cx+Math.cos(a)*rx),y=Math.round(cy+Math.sin(a)*ry);if(x===lx&&y===ly)continue;lx=x;ly=y;k++;if(dotted&&k%2)continue;c.fillRect(x,y,1,1);}
}
// medidor de potencia circular alrededor de los pies: amarillo, zona verde = perfecto, rojo = se eleva
function drawChargeRing(c,sx,sy,p,rx,ry){
 rx+=4;ry+=3;
 for(const d of [-1,0,1,2])ringPx(c,sx,sy+d,rx+(d<0?1:0),ry,'rgba(0,0,0,0.6)',false);
 ringPx(c,sx,sy,rx,ry,'rgba(125,255,79,0.35)',false,0.76,0.86);
 const ch=Math.min(1,p.charge);
 ringPx(c,sx,sy,rx,ry,'#e8e24a',false,0,Math.min(ch,0.76));
 if(ch>0.76)ringPx(c,sx,sy,rx,ry,'#7dff4f',false,0.76,Math.min(ch,0.86));
 if(ch>0.86)ringPx(c,sx,sy,rx,ry,p.charge>1&&Math.floor(performance.now()/90)%2?'#ffffff':'#ff3b30',false,0.86,ch);
 // segunda línea para que se lea gruesa
 ringPx(c,sx,sy+1,rx,ry,'#e8e24a',false,0,Math.min(ch,0.76));
 if(ch>0.76)ringPx(c,sx,sy+1,rx,ry,'#7dff4f',false,0.76,Math.min(ch,0.86));
 if(ch>0.86)ringPx(c,sx,sy+1,rx,ry,'#ff3b30',false,0.86,ch);
}
// dónde cae la pelota cuando va por arriba
function drawLanding(c,b){
 if(b.z<0.35&&!((b.vz||0)>1.5))return;
 const vz=b.vz||0,t=(vz+Math.sqrt(vz*vz+28*Math.max(0,b.z)))/14;if(!(t>0.08))return;
 const k=Math.exp(-0.15*t),lx=b.x+(b.vx||0)*t*k,ly=b.y+(b.vy||0)*t*k;
 const[x,y]=P(lx,ly,0);const r=Math.max(4,Math.round(view.ppm*0.55)),ry=Math.max(2,Math.round(r*YC));
 const pul=Math.sin(performance.now()/120)*0.5+0.5;
 for(let yy=-ry;yy<=ry;yy++){const w=Math.round(r*Math.sqrt(1-(yy*yy)/(ry*ry)));c.fillStyle=`rgba(90,230,130,${0.18+0.1*pul})`;c.fillRect(Math.round(x)-w,Math.round(y)+yy,w*2+1,1);}
 ringPx(c,x,y,r,ry,'rgba(140,255,170,0.7)',true);
}
function drawChargeBar(c,sx,sy,p){
 const bw=18,x0=Math.round(sx)-9,y0=Math.round(sy)+3;
 const seg=(a,b2,col)=>{c.fillStyle=col;c.fillRect(x0+Math.round(a*bw),y0,Math.max(1,Math.round((b2-a)*bw)),2);};
 c.fillStyle='#000';c.fillRect(x0-1,y0-1,bw+2,4);
 seg(0,0.76,'#3a3a32');seg(0.76,0.86,'#1f5a2a');seg(0.86,1,'#5a1f1f');
 const ch=Math.min(1,p.charge);
 seg(0,Math.min(ch,0.76),'#e8e24a');if(ch>0.76)seg(0.76,Math.min(ch,0.86),'#7dff4f');if(ch>0.86)seg(0.86,ch,'#ff3b30');
}
const scrSize={w:0,h:0};
try{new ResizeObserver(()=>{scrSize.w=screen.clientWidth;scrSize.h=screen.clientHeight;}).observe(screen);}catch(e){addEventListener('resize',()=>{scrSize.w=0;});}
function render(dt){
 if(!scrSize.w){scrSize.w=screen.clientWidth;scrSize.h=screen.clientHeight;}
 const dpr=Math.min(1.5,window.devicePixelRatio||1);
 const W=Math.round(scrSize.w*dpr),H=Math.round(scrSize.h*dpr);
 if(screen.width!==W||screen.height!==H){screen.width=W;screen.height=H;}
 sctx.fillStyle='#0b1712';sctx.fillRect(0,0,W,H);
 if(!game)return;
 if(game.pens){renderPens(dt,W,H);return;}
 const s=game.state;
 const scn=game.replay?snapScene(game.replay.frames[Math.min(game.replay.frames.length-1,Math.floor(game.replay.t))]):{players:s.players,ball:s.ball,replay:false};
 const key=s.L+'|'+game.kits[0].p+game.kits[1].p+'|'+fontsReady+'|'+game.stadium.n+game.teams[0].id+game.teams[1].id;
 if(key!==pitchKey){view=makeView(s);pitch=buildPitch(s,game.kits);pitchKey=key;
  const W2=s.W/2,tE=P(0,-W2-0.5,1.1)[1],bE=P(0,W2+0.5,0)[1];crowd=buildCrowd(game.stadium,game.kits,tE,bE,LW,LH);
  // trapos colgados: van arriba de la gente
  crowd.T=document.createElement('canvas');crowd.T.width=LW;crowd.T.height=LH;drawTrapos(crowd.T.getContext('2d'),game.stadium,game.teams,game.kits,tE,bE,LW);}
 if(!crowd)bx.drawImage(pitch,0,0); // con hinchada, la cancha ya va en la capa de las tribunas
 updateParty(game.paused?0:dt);drawStands(bx,performance.now()/1000);
 // papelitos en la tribuna
 for(let i=fx.confetti.length-1;i>=0;i--){const q=fx.confetti[i];q.t+=dt;if(q.paper){q.vy=Math.min(q.vy+14*dt,9);q.vx*=Math.exp(-1.5*dt);q.x+=q.vx*dt+Math.sin(q.t*5+i)*0.25;}else{q.vy+=34*dt;q.x+=q.vx*dt+Math.sin(q.t*9+i)*0.3;}q.y+=q.vy*dt;if(q.t>q.ttl){fx.confetti.splice(i,1);continue;}bx.fillStyle=q.col;bx.fillRect(Math.round(q.x),Math.round(q.y),(q.paper&&Math.floor(q.t*6+i)%2)?1:2,1);}
 const b=scn.ball,bsp=Math.hypot(b.vx||0,b.vy||0);
 if(bsp>13)fx.trail.push(P(b.x,b.y,b.z));else if(fx.trail.length)fx.trail.shift();
 while(fx.trail.length>7)fx.trail.shift();
 // mira de tiro del jugador humano
 if(!scn.replay&&!game.demo)for(const p of s.players)if(p.charging&&game.ctrls[p.id].type==='human')drawAim(bx,s,p);
 updateNets(game.paused||scn.replay?0:dt,s);drawGoalBack(bx,s);
 drawLanding(bx,b);
 for(let i=fx.dust.length-1;i>=0;i--){const q=fx.dust[i];q.t+=dt;if(q.t>0.3){fx.dust.splice(i,1);continue;}const[x,y]=P(q.x+q.vx*q.t,q.y+q.vy*q.t,q.t*1.2);bx.fillStyle=`rgba(190,235,170,${0.8*(1-q.t/0.3)})`;bx.fillRect(Math.round(x),Math.round(y),1,1);}
 const ents=scn.players.map(p=>({y:p.y,p}));ents.push({y:b.y-0.01,ball:true});
 ents.sort((a,c)=>a.y-c.y);
 const now=performance.now()/1000;
 for(const e of ents){
  if(e.ball){
   fx.trail.forEach((q,i)=>{bx.fillStyle=`rgba(255,240,200,${(i+1)/(fx.trail.length+1)*0.55})`;bx.fillRect(Math.round(q[0])-1,Math.round(q[1])-2,2,2);});
   drawBall(bx,b);continue;
  }
  const p=e.p,[sx,sy]=P(p.x,p.y,0);
  const human=!game.demo&&game.ctrls[p.id].type==='human';
  const hcol=human?(game.ctrls[p.id].col||(game.ctrls[p.id].slot===1?'#3fd8ff':'#ff5aa8')):null;
  bx.fillStyle='rgba(0,0,0,0.32)';bx.fillRect(Math.round(sx)-4,Math.round(sy)-1,9,2);
  if(human&&!scn.replay){
   // círculo de alcance: se enciende cuando la pelota está a tiro de patada
   const rr=SIM.KR*view.ppm,rx=Math.max(8,Math.round(rr)),ry=Math.max(3,Math.round(rr*YC));
   const bb=s.ball,reach=bb.holder<0&&bb.z<=1.1&&Math.hypot(bb.x-p.x,bb.y-p.y)<=SIM.KR;
   if(reach&&!p.charging){const dd=Math.hypot(bb.x-p.x,bb.y-p.y)||1,ux=(bb.x-p.x)/dd,uy=(bb.y-p.y)/dd;for(let i=1;i<=5;i++){const q=P(bb.x+ux*(0.35+i*0.45),bb.y+uy*(0.35+i*0.45),0);bx.fillStyle=`rgba(255,225,77,${0.9-i*0.15})`;bx.fillRect(Math.round(q[0]),Math.round(q[1]),1,1);}}
   if(reach&&!p.charging){ringPx(bx,sx,sy,rx,ry,'#ffe14d',false);ringPx(bx,sx,sy+1,rx,ry,'rgba(160,120,0,0.8)',false);}
   else if(reach)ringPx(bx,sx,sy,rx,ry,'rgba(255,225,77,0.55)',true);
   else ringPx(bx,sx,sy,rx,ry,hcol,true);
   if(p.charging)drawChargeRing(bx,sx,sy,p,rx,ry);
  }else if(human)pellipse(bx,sx,sy,7,2.5,hcol);
  const kit=p.role==='gk'?game.gkKits[p.team]:game.kits[p.team];
  const spd=Math.hypot(p.vx,p.vy);
  const o=Object.assign({kit,skin:SKIN[p.skin|0],hair:p.hair||'#222',name:p.name,phase:p.run,moving:spd>0.6,num:p.num,gk:p.role==='gk',kick:p.kickAnim>0},viewOf(p));
  let jy=0;
  if(!scn.replay&&s.phase==='goal'&&p.team===s.lastGoalTeam)jy=Math.round(Math.abs(Math.sin(now*9+p.id))*4);
  const sk=p.skill;
  if(sk&&sk.type==='chilena'){
   // chilena: salto y vuelta en el aire de a cuartos de giro (sin perder el pixelado)
   const u=Math.min(1,sk.t/sk.dur),q=Math.min(3,Math.floor(u*5)),lift=Math.round(Math.sin(u*Math.PI)*9);
   bx.save();bx.translate(Math.round(sx),Math.round(sy)-11-lift);if(o.flip)bx.scale(-1,1);bx.rotate(-q*Math.PI/2);bx.translate(0,11);
   drawFootballer(bx,0,0,Object.assign(o,{view:'side',flip:false,kick:u>0.2&&u<0.6,moving:false}));bx.restore();
  }else if(sk&&p.slideT<=0){
   if(sk.type==='flick'){o.heel=sk.t<0.24;o.kick=false;}
   else if(sk.type==='roulette'){o.armsOut=true;o.moving=true;o.phase=sk.t*14;}
   else if(sk.type==='stepover'&&!sk.burst){const alt=Math.floor(sk.t/0.095)%2?1:-1;o.moving=false;o.armsOut=true;if(o.view==='side')o.kick=alt>0;else o.legOut=alt;}
   drawFootballer(bx,sx,sy-jy,o);
   if(sk.type==='roulette'||(sk.type==='stepover'&&!sk.burst)){bx.fillStyle='rgba(255,255,255,0.35)';const a=now*20;bx.fillRect(Math.round(sx+Math.cos(a)*6),Math.round(sy-2+Math.sin(a)*2),1,1);}
  }else if(p.slideT>0){
   bx.save();bx.translate(Math.round(sx),Math.round(sy)-2);if(p.slideDx<0)bx.scale(-1,1);bx.translate(7,0);bx.rotate(-Math.PI/2);
   drawFootballer(bx,0,0,Object.assign(o,{view:'side',flip:false,kick:true,moving:false}));bx.restore();
   bx.fillStyle='rgba(120,90,40,0.6)';bx.fillRect(Math.round(sx)-(p.slideDx<0?-8:12),Math.round(sy),4,1);
  }else if(p.dive){o.view='front';o.flip=false;o.armsUp=true;o.moving=false;o.diveDown=p.dive.dy>0;drawFootballer(bx,sx,sy-(p.diveT<0.32?3:0),o);}
  else if(p.stunT>0&&p.stunT>0.6){bx.save();bx.translate(Math.round(sx),Math.round(sy)-2);if(o.flip)bx.scale(-1,1);bx.rotate(Math.PI/2);bx.translate(-6,0);drawFootballer(bx,0,0,Object.assign(o,{view:'side',flip:false,moving:false}));bx.restore();}
  else drawFootballer(bx,sx,sy-jy,o);
  if(p.stunT>0){for(let k=0;k<2;k++){const a=now*7+k*Math.PI;bx.fillStyle='#ffe14d';bx.fillRect(Math.round(sx+Math.cos(a)*4),Math.round(sy-(p.stunT>0.6?10:27)+Math.sin(a)*1.5),1,1);}}

  if(human){const tx=Math.round(sx),ty=Math.round(sy)-29-jy;
   bx.fillStyle=hcol;bx.fillRect(tx-2,ty,5,1);bx.fillRect(tx-1,ty+1,3,1);bx.fillRect(tx,ty+2,1,1);
   if(p.stam<0.98&&!scn.replay){bx.fillStyle='#000';bx.fillRect(tx-6,ty-3,13,2);bx.fillStyle=p.stam>0.3?'#9be7ff':'#ff8a65';bx.fillRect(tx-6,ty-3,Math.round(13*p.stam),1);}}
 }
 drawGoalFrames(bx,s);
 // componer en pantalla
 const sc=Math.min(W/LW,H/LH);let ox=Math.round((W-LW*sc)/2),oy=Math.round((H-LH*sc)/2);
 if(fx.shake>0){fx.shake=Math.max(0,fx.shake-dt);const m=fx.shake*10*sc;ox+=Math.round((Math.random()-0.5)*m);oy+=Math.round((Math.random()-0.5)*m);}
 sctx.imageSmoothingEnabled=false;
 if(scn.replay){
  const z=1.7,sw=LW/z,sh=LH/z,[bxp,byp]=P(b.x,b.y,0);
  const sx0=SIM.clamp(bxp-sw/2,0,LW-sw),sy0=SIM.clamp(byp-sh/2,0,LH-sh);
  sctx.drawImage(buf,sx0,sy0,sw,sh,ox,oy,Math.round(LW*sc),Math.round(LH*sc));
  const bar=Math.round(H*0.07);sctx.fillStyle='#000';sctx.fillRect(0,0,W,bar);sctx.fillRect(0,H-bar,W,bar);
  const fs2=Math.max(16,Math.round(7*sc));sctx.font=`${fs2}px Silkscreen, monospace`;sctx.textAlign='left';sctx.textBaseline='middle';
  if(Math.floor(now*2)%2===0){sctx.fillStyle='#ff3b30';sctx.beginPath();sctx.arc(24*dpr,bar/2,fs2*0.3,0,Math.PI*2);sctx.fill();}
  sctx.fillStyle='#f3f0e2';sctx.fillText('REPETICIÓN',24*dpr+fs2*0.7,bar/2);
  sctx.font=`${Math.round(fs2*0.9)}px VT323, monospace`;sctx.textAlign='right';sctx.fillStyle='#93ad9f';sctx.fillText('Espacio / Enter: saltar',W-24*dpr,H-bar/2);
  if(game.replay.caption){sctx.textAlign='center';sctx.fillStyle='#ffb02e';sctx.font=`${fs2}px Silkscreen, monospace`;sctx.fillText(game.replay.caption,W/2,H-bar/2);}
 }else{
  sctx.drawImage(buf,ox,oy,Math.round(LW*sc),Math.round(LH*sc));
  // nombres nítidos sobre los jugadores humanos
  const fs=Math.max(14,Math.round(6*sc));
  sctx.font=`${fs}px VT323, monospace`;sctx.textAlign='center';sctx.textBaseline='bottom';
  if(!game.demo){
   const fs3=Math.max(11,Math.round(4.6*sc));sctx.font=`${fs3}px VT323, monospace`;
   for(const p of s.players){
    if(game.ctrls[p.id].type==='human')continue;
    const[sx,sy]=P(p.x,p.y,0);const tx=ox+sx*sc,ty=oy+(sy-26)*sc;const nm=p.name.length>12?p.name.slice(0,11)+'.':p.name;
    sctx.fillStyle='rgba(0,0,0,.6)';sctx.fillText(nm,tx+1,ty+1);sctx.fillStyle=p.team===0?'rgba(255,240,170,.85)':'rgba(220,235,255,.85)';sctx.fillText(nm,tx,ty);
   }
   sctx.font=`${fs}px VT323, monospace`;
  }
  if(!game.demo)for(const p of s.players){
   const c=game.ctrls[p.id];if(c.type!=='human')continue;
   const[sx,sy]=P(p.x,p.y,0);const tx=ox+sx*sc,ty=oy+(sy-33)*sc;
   const label=c.label||('P'+c.slot+' '+p.name);
   sctx.fillStyle='rgba(0,0,0,.75)';sctx.fillText(label,tx+2,ty+2);
   sctx.fillStyle=c.col||(c.slot===1?'#3fd8ff':'#ff5aa8');sctx.fillText(label,tx,ty);
  }
  // carteles: PERFECTO, PALO, ATAJADA, FALTA...
  const pf=Math.max(13,Math.round(5.5*sc));sctx.font=`${pf}px Silkscreen, monospace`;sctx.textAlign='center';sctx.textBaseline='bottom';
  for(let i=fx.popups.length-1;i>=0;i--){const q=fx.popups[i];q.t+=dt;if(q.t>1.1){fx.popups.splice(i,1);continue;}
   const[px2,py2]=P(q.x,q.y,0);const tx=ox+px2*sc,ty=oy+(py2-34-q.t*14)*sc;sctx.globalAlpha=q.t>0.75?1-(q.t-0.75)/0.35:1;
   sctx.fillStyle='#000';sctx.fillText(q.text,tx+2,ty+2);sctx.fillStyle=q.col;sctx.fillText(q.text,tx,ty);sctx.globalAlpha=1;}
 }
 if(fx.flash>0){sctx.fillStyle=`rgba(255,240,200,${fx.flash*0.5})`;sctx.fillRect(0,0,W,H);fx.flash=Math.max(0,fx.flash-dt*1.6);}
 if(game.demo){sctx.fillStyle='rgba(6,13,9,0.35)';sctx.fillRect(0,0,W,H);}
}

/* ===================== TANDA DE PENALES (primera persona) ===================== */
let penCrowd=null;
function startPens(){
 const s=game.state,T=[game.teams[0],game.teams[1]];
 const order=T.map(t=>[...t.players].sort((a,b)=>b.st[2]-a.st[2]));
 const ctrl=[0,1].map(team=>{const p=s.players.find(q=>q.team===team&&game.ctrls[q.id].type==='human');return p?game.ctrls[p.id].slot:0;});
 game.pens={T,order,ctrl,res:[[],[]],k:0,phase:'intro',t:0,clock:0,cur:null,hist:{shots:[[],[]],dives:[[],[]]},r:rng((s.tick*977+s.score[0]*31+13)|0),msg:null};
 penCrowd=null;keys.clear();tapped.clear();
 $('hud').hidden=true;$('banner').hidden=true;$('hint').hidden=true;
 sfx({t:'whistle'});
}
function penNextKick(P){
 const team=P.k%2,kt=1-team,count=P.res[team].length;
 const shooter=P.order[team][count%P.order[team].length],gk=P.T[kt].gk;
 const hs=P.ctrl[team],hk=P.ctrl[kt];
 P.cur={team,kt,shooter,gk,hs,hk,phase:'ready',t:0,aim:{x:0,y:1.1},charge:0,shot:null,dive:null,diveClock:null,kickClock:null,ft:0,result:null,
  cam:hs||!hk?'shooter':'keeper',reticle:!!hs&&!hk,run:0,runDur:0.9+P.r()*0.35,prevKick:true,prevDive:true};
 sfx({t:'whistle'});
}
function penKeeperInput(P,c){
 if(!c.hk)return;
 const inp=readHuman(c.hk);
 if(c.dive){
  // margen corto para que dirección y botón no tengan que caer en el mismo cuadro
  if(c.diveClock!=null&&P.clock-c.diveClock<0.12&&c.dive.dx===0&&c.dive.dy===0){let dx=Math.sign(Math.round(inp.mx)),dy=-Math.sign(Math.round(inp.my));if(c.cam==='keeper')dx=-dx;if(dx||dy){c.dive.dx=dx;c.dive.dy=dy;}}
  return;
 }
 const press=inp.kick&&!c.prevDive;c.prevDive=inp.kick;
 if(press){
  let dx=Math.sign(Math.round(inp.mx)),dy=-Math.sign(Math.round(inp.my));
  // vista del arquero: su izquierda es la derecha del pateador
  if(c.cam==='keeper')dx=-dx;
  c.dive={dx,dy,t:0};c.diveClock=P.clock;
  sfx({t:'dive'});
  if(c.kickClock!=null)c.dive.t=P.clock-c.kickClock;
 }
}
function penKick(P){
 const c=P.cur;c.kickClock=P.clock;
 if(c.hs)c.shot=PEN.humanShot(c.aim,c.charge,c.shooter,c.reticle,P.clock);
 else{const early=c.dive&&c.diveClock!=null?c.dive:null;c.shot=PEN.cpuShot(c.shooter,P.hist.dives[c.kt],early,P.r);}
 if(c.dive&&c.diveClock!=null)c.dive.t=c.diveClock-c.kickClock;
 if(!c.hk)c.dive=PEN.cpuDive(c.gk,P.hist.shots[c.team],P.r);
 c.phase='flight';c.ft=0;c.T=PEN.D/c.shot.speed;
 sfx({t:'kick',power:c.shot.speed});
}
function penUpdate(dt0){
 const P=game.pens;
 if(P.hitstop>0){P.hitstop-=dt0;return;}
 let dt=dt0;
 // cámara lenta en el último tramo de la pelota
 if(P.cur&&P.cur.phase==='flight'&&P.cur.T-P.cur.ft<0.18)dt*=0.35;
 P.t+=dt;P.clock+=dt;
 if(P.phase==='intro'){if(P.t>1.6){P.phase='kicks';penNextKick(P);}return;}
 if(P.phase==='final'){if(P.t>2.6&&!P.ended){P.ended=true;game.pensResult=[P.res[0].filter(Boolean).length,P.res[1].filter(Boolean).length];game.pens=null;$('hint').hidden=true;showEnd();}return;}
 const c=P.cur;c.t+=dt;
 if(c.phase==='ready'){if(c.t>0.9){c.phase='aim';c.t=0;}penKeeperInput(P,c);return;}
 if(c.phase==='aim'||c.phase==='run'){
  penKeeperInput(P,c);
  if(c.hs){
   const inp=readHuman(c.hs);
   c.aim.x=SIM.clamp(c.aim.x+inp.mx*3*dt,-4.6,4.6);c.aim.y=SIM.clamp(c.aim.y-inp.my*2.4*dt,0,3.2);
   if(c.phase==='aim'){if(inp.kick&&!c.prevKick){c.phase='run';c.charge=0;}}
   else{c.charge+=dt;c.run=Math.min(1,c.charge/0.8);if(!inp.kick||c.charge>=1.4)penKick(P);}
   c.prevKick=inp.kick;
  }else{
   if(c.phase==='aim'&&c.t>0.5){c.phase='run';c.t=0;}
   if(c.phase==='run'){c.run=Math.min(1,c.t/c.runDur);if(c.t>=c.runDur)penKick(P);}
  }
  return;
 }
 if(c.phase==='flight'){
  c.ft+=dt;penKeeperInput(P,c);
  if(c.ft>=c.T){
   const o=PEN.resolve(c.shot,c.dive,c.gk);c.result=o.r;c.phase='after';c.t=0;
   const goal=PEN.isGoal(o.r);P.res[c.team].push(goal);P.hist.shots[c.team].push(c.shot.x);P.hist.dives[c.kt].push(c.dive?c.dive.dx:0);
   const humanKeeper=!!c.hk,humanShooter=!!c.hs;
   P.msg={text:goal?'¡GOL!':o.r==='save'?(humanKeeper&&!humanShooter?'¡ATAJASTE!':'¡ATAJÓ!'):o.r==='post'?'¡PALO!':o.r==='bar'?'¡TRAVESAÑO!':'¡AFUERA!',
    col:goal?(humanShooter||!humanKeeper?'#7dff4f':'#ff5a4f'):(humanKeeper&&!humanShooter?'#7dff4f':'#ff5a4f'),t:0};
   if(goal)sfx({t:'goal'});else if(o.r==='save')sfx({t:'catch'});else if(o.r==='post'||o.r==='bar')sfx({t:'post'});else sfx({t:'net'});
   if(goal)fx.shake=0.3;P.hitstop=0.12;P.flash=goal?0.45:0.2;
  }
  return;
 }
 if(c.phase==='after'){
  c.ft+=dt;
  if(c.t>1.9){
   if(PEN.decided(P.res)){P.phase='final';P.t=0;sfx({t:'end'});
    const a=P.res[0].filter(Boolean).length,b=P.res[1].filter(Boolean).length,w=a>b?0:1;
    P.msg={text:'GANA '+P.T[w].abbr,col:'#ffb02e',t:0,sub:`Penales ${a}-${b}`};spawnConfettiPens(game.kits[w]);}
   else{P.k++;penNextKick(P);P.msg=null;}
  }
 }
}
function keeperState(c,P){return PEN.keeperAt(c.dive,c.kickClock!=null?P.clock-c.kickClock:(c.dive&&c.diveClock!=null?P.clock-c.diveClock:0),c.gk);}
function ballPos(c){
 // trayectoria de la pelota: antes de patear está en el punto; después vuela hacia (x,y) del arco
 if(!c.shot)return{x:0,y:PEN.BR,z:0};
 const T=c.T,u=Math.min(1,c.ft/T),s=c.shot;
 let x=s.x*u,z=PEN.D*u,y=PEN.BR+(s.y-PEN.BR)*u+Math.sin(Math.PI*u)*0.25*(1-Math.min(1,s.y/2.44));
 if(c.phase==='after'){
  const a=Math.min(1,c.t/0.6),r=c.result;
  if(r==='goal'){z=PEN.D+1.6*a;y=Math.max(PEN.BR,s.y*(1-a*a));x=s.x*(1+0.1*a);}
  else if(r==='save'){const k=PEN.keeperAt(c.dive,c.T,c.gk);const away=Math.sign(s.x-k.kx||1);x=s.x+away*2.2*a;z=PEN.D-3.5*a;y=Math.max(PEN.BR,s.y*(1-a)+Math.sin(Math.PI*a)*0.6);}
  else if(r==='post'||r==='bar'){x=s.x+Math.sign(s.x||1)*1.5*a;z=PEN.D-2*a;y=Math.max(PEN.BR,s.y+(r==='bar'?0.8:0)*Math.sin(Math.PI*a));}
  else{z=PEN.D+5*a;x=s.x*(1+0.4*a);y=s.y+0.5*a;}
 }
 return{x,y,z};
}
/* ---------- penales: dibujo pixel en alta definición ----------
   Buffer propio de 640×400 (más píxeles que el partido) y personajes grandes dibujados píxel a píxel
   desde un esqueleto: así se pueden animar y rotar (estiradas, caídas) sin perder el pixelado. */
const PW=640,PH=400;
function pproj(cam,X,Y,Z){const d=(Z-cam.z)*cam.dir;if(d<0.15)return null;return[cam.cx+(X-cam.x)*cam.f/d*cam.dir,cam.hy-(Y-cam.y)*cam.f/d,cam.f/d];}
const pbuf=document.createElement('canvas');pbuf.width=PW;pbuf.height=PH;const pg=pbuf.getContext('2d');
const SPANS={};
function spansOf(r){if(SPANS[r])return SPANS[r];const a=[];for(let dy=-r;dy<=r;dy++)a.push(Math.floor(Math.sqrt(Math.max(0,r*r-dy*dy))+0.4));return SPANS[r]=a;}
function disc(g,cx,cy,r,col){const ri=Math.max(0,Math.round(r));const s=spansOf(ri);g.fillStyle=col;const x=Math.round(cx),y=Math.round(cy);for(let i=0;i<s.length;i++)g.fillRect(x-s[i],y-ri+i,s[i]*2+1,1);}
function ellipseF(g,cx,cy,rx,ry,col){g.fillStyle=col;const y0=Math.round(cy-ry),y1=Math.round(cy+ry);for(let y=y0;y<=y1;y++){const t=(y+0.5-cy)/ry;if(Math.abs(t)>1)continue;const hw=rx*Math.sqrt(1-t*t);g.fillRect(Math.round(cx-hw),y,Math.max(1,Math.round(hw*2)),1);}}
function segD(g,a,b,r,col){const d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(d/Math.max(0.8,r*0.55)));for(let i=0;i<=n;i++){const t=i/n;disc(g,a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,r,col);}}
function polyFill(g,pts,col){
 let y0=Infinity,y1=-Infinity;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
 y0=Math.floor(y0);y1=Math.ceil(y1);
 for(let y=y0;y<=y1;y++){const yc=y+0.5;let xl=Infinity,xr=-Infinity;
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc)){const x=a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]);if(x<xl)xl=x;if(x>xr)xr=x;}}
  if(xl>xr)continue;const xa=Math.round(xl),xb=Math.round(xr);if(xb<=xa)continue;
  if(typeof col==='string'){g.fillStyle=col;g.fillRect(xa,y,xb-xa,1);continue;}
  let rc=null,rs=xa;for(let x=xa;x<=xb;x++){const c=x<xb?col(x+0.5,yc):null;if(c!==rc){if(rc){g.fillStyle=rc;g.fillRect(rs,y,x-rs,1);}rc=c;rs=x;}}
 }
}
const SHADE={};
function sh(c,t){const k=c+t;if(SHADE[k])return SHADE[k];const v=parseInt(c.slice(1),16);const f=x=>Math.max(0,Math.min(255,Math.round(t>0?x+(255-x)*t:x*(1+t))));const o='#'+[(v>>16)&255,(v>>8)&255,v&255].map(f).map(x=>x.toString(16).padStart(2,'0')).join('');return SHADE[k]=o;}

/* ---- poses (unidades: el jugador mide 24; origen en los pies; y hacia arriba es negativo) ---- */
const POSE_BASE={hipL:[-1.3,-11],hipR:[1.3,-11],kneeL:[-1.45,-6],kneeR:[1.45,-6],footL:[-1.55,-0.6],footR:[1.55,-0.6],
 shL:[-2.7,-18],shR:[2.7,-18],elL:[-3.5,-14.6],elR:[3.5,-14.6],haL:[-3.8,-11.4],haR:[3.8,-11.4],neck:[0,-19.3],head:[0,-21.8]};
function pose(over){const j={};for(const k in POSE_BASE)j[k]=POSE_BASE[k].slice();if(over)for(const k in over)j[k]=over[k].slice();return j;}
function lerpPose(a,b,t){const o={};for(const k in a)o[k]=[a[k][0]+(b[k][0]-a[k][0])*t,a[k][1]+(b[k][1]-a[k][1])*t];return o;}
function shiftY(j,dy,keepFeet){for(const k in j){if(keepFeet&&(k==='footL'||k==='footR'))continue;j[k][1]+=dy;}return j;}
function poseStand(t){return shiftY(pose(),Math.sin(t*2.4)*0.15,true);}
function poseKeeperReady(t){
 const j=pose({hipL:[-1.5,-9.6],hipR:[1.5,-9.6],kneeL:[-2.6,-5.3],kneeR:[2.6,-5.3],footL:[-2.7,-0.6],footR:[2.7,-0.6],
  shL:[-2.8,-16.6],shR:[2.8,-16.6],elL:[-4.6,-14],elR:[4.6,-14],haL:[-5.4,-15.8],haR:[5.4,-15.8],neck:[0,-17.9],head:[0,-20.4]});
 return shiftY(j,-Math.abs(Math.sin(t*7))*0.55,true);
}
function poseStretch(){return pose({kneeL:[-1.3,-6],kneeR:[1.1,-6.2],footL:[-1.2,-0.6],footR:[0.9,-0.8],elL:[-2.1,-22.8],elR:[2.1,-22.8],haL:[-2.3,-26.6],haR:[2.3,-26.6],head:[0,-21.9]});}
function poseHug(){return pose({kneeL:[-1.6,-6.5],kneeR:[0.8,-7],footL:[-1.4,-1],footR:[1.6,-2.2],elL:[-2.6,-15.2],elR:[2.6,-15.2],haL:[-0.9,-16.4],haR:[0.9,-16.4]});}
function poseSad(t){return pose({elL:[-3.4,-21.4],elR:[3.4,-21.4],haL:[-1.3,-22.9],haR:[1.3,-22.9],head:[0.15,-21.4],neck:[0.05,-19.1]});}
function poseArmsUp(t){const j=pose({elL:[-3.6,-21.6],elR:[3.6,-21.6],haL:[-3.9,-25],haR:[3.9,-25],kneeL:[-1.6,-6.4],kneeR:[1.6,-6.4]});return shiftY(j,-Math.abs(Math.sin(t*9))*2.2,false);}
function poseRun(ph,arms){
 const lL=Math.max(0,Math.sin(ph)),lR=Math.max(0,Math.sin(ph+Math.PI));
 const j=pose({kneeL:[-1.25+lL*0.3,-6-lL*3.4],footL:[-1.35,-0.6-lL*3.9],kneeR:[1.25-lR*0.3,-6-lR*3.4],footR:[1.35,-0.6-lR*3.9],
  shL:[-2.7,-17.4],shR:[2.7,-17.4],neck:[0,-18.7],head:[0,-21.2],
  elL:[-3.6,-14.4-lR*1.6],haL:[-3.4+lR*0.6,-11.6-lR*3.6],elR:[3.6,-14.4-lL*1.6],haR:[3.4-lL*0.6,-11.6-lL*3.6]});
 if(arms==='plane'){j.elL=[-5,-17.4];j.haL=[-7.4,-17.8];j.elR=[5,-17.4];j.haR=[7.4,-17.8];}
 if(arms==='up'){j.elL=[-3.4,-21.2];j.haL=[-3.6,-24.8];j.elR=[3.4,-21.2];j.haR=[3.6,-24.8];}
 return shiftY(j,-Math.abs(Math.sin(ph))*0.7,false);
}
function poseKick(k){
 // tres tiempos: apoyo y pierna atrás → impacto → acompañamiento
 const j=pose({kneeL:[-1.7,-5.6],footL:[-1.9,-0.6],elL:[-5.4,-15.8],haL:[-7,-16.8],elR:[4.4,-12.5],haR:[4.6,-9.6],shL:[-2.8,-17.6],shR:[2.6,-17.8]});
 if(k<0.45){const t=k/0.45;j.kneeR=[1.5,-6-t*2.2];j.footR=[1.7,-1-t*8.5];}
 else{const t=Math.min(1,(k-0.45)/0.35);j.kneeR=[1.4-t*0.6,-8.2-t*1.6];j.footR=[1.6-t*1.2,-9.5-t*3.6];}
 return j;
}

/* ---- dibujo del jugador grande ---- */
const DIGIT3={0:['###','#.#','#.#','#.#','###'],1:['.#.','##.','.#.','.#.','###'],2:['###','..#','###','#..','###'],3:['###','..#','.##','..#','###'],4:['#.#','#.#','###','..#','..#'],5:['###','#..','###','..#','###'],6:['###','#..','###','#.#','###'],7:['###','..#','.#.','.#.','.#.'],8:['###','#.#','###','#.#','###'],9:['###','#.#','###','..#','###']};
function patternAt(k,lx,ly){
 switch(k.pat){
  case'vstripes':return Math.floor((lx+1)*3.2)%2?k.s:k.p;
  case'hband':return ly>0.33&&ly<0.62?k.s:k.p;
  case'sash':return Math.abs(ly-(1-(lx+1)/2))<0.17?k.s:k.p;
  case'hoops':return Math.floor(ly*7)%2?k.s:k.p;
  case'halves':return lx<0?k.p:k.s;
  case'vee':return ly>0.5&&Math.abs(Math.abs(lx)-(ly-0.5)*1.9)<0.16?k.s:k.p;
  case'vband':return Math.abs(lx)<0.22?k.s:k.p;
  default:return k.p;
 }
}
function bigPlayer(g,ox,oy,H,o){
 const u=H/24,J=o.j,rot=o.rot||0,pv=o.pivot||[0,-11],c=Math.cos(rot),s=Math.sin(rot),lift=o.lift||0;
 const T=p=>[ox+(c*(p[0]-pv[0])-s*(p[1]-pv[1])+pv[0])*u,oy+(s*(p[0]-pv[0])+c*(p[1]-pv[1])+pv[1])*u-lift];
 const L=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
 const k=o.kit,skin=o.skin,hair=o.hair,OL='#0c120f';
 const P={};for(const n in J)P[n]=T(J[n]);
 const ru=x=>Math.max(1,x*u);
 // partes: [a,b,radio,color]
 const legs=[],arms=[];
 for(const sd of ['L','R']){
  const hip=J['hip'+sd],kn=J['knee'+sd],ft=J['foot'+sd];
  legs.push([T(hip),T(L(hip,kn,0.5)),1.25,k.shorts],[T(L(hip,kn,0.45)),T(kn),1.0,skin],[T(kn),T(L(kn,ft,0.2)),0.9,skin],[T(L(kn,ft,0.18)),T(ft),0.92,k.socks]);
  const sh0=J['sh'+sd],el=J['el'+sd],ha=J['ha'+sd];
  arms.push([T(sh0),T(L(sh0,el,0.55)),0.88,k.sleeve],[T(L(sh0,el,0.5)),T(el),0.72,skin],[T(el),T(ha),0.66,skin]);
 }
 const boots=['L','R'].map(sd=>{const ft=J['foot'+sd];return[T(ft),T([ft[0]+(sd==='L'?-0.25:0.25),ft[1]+0.35])];});
 const hands=['L','R'].map(sd=>T(J['ha'+sd]));
 const hipC=L(J.hipL,J.hipR,0.5),shC=L(J.shL,J.shR,0.5);
 const torso=[[J.shL[0]-0.3,J.shL[1]-0.35],[J.shR[0]+0.3,J.shR[1]-0.35],[J.hipR[0]+0.55,J.hipR[1]-0.9],[J.hipL[0]-0.55,J.hipL[1]-0.9]].map(T);
 const shorts=[[J.hipL[0]-0.6,J.hipL[1]-1.1],[J.hipR[0]+0.6,J.hipR[1]-1.1],L(J.hipR,J.kneeR,0.4).map((v,i)=>i?v:v+0.95),L(J.hipL,J.kneeL,0.4).map((v,i)=>i?v:v-0.95)].map(T);
 const head=T(J.head),neck=T(J.neck),hr=2.35*u;
 // 1) contorno
 for(const p of [...legs,...arms])segD(g,p[0],p[1],ru(p[2])+1,OL);
 for(const b of boots)segD(g,b[0],b[1],ru(0.95)+1,OL);
 for(const h of hands)disc(g,h[0],h[1],ru(o.gk?1.05:0.72)+1,OL);
 const grow=(pts,d)=>{const cx=pts.reduce((a,p)=>a+p[0],0)/pts.length,cy=pts.reduce((a,p)=>a+p[1],0)/pts.length;return pts.map(p=>{const dx=p[0]-cx,dy=p[1]-cy,l=Math.hypot(dx,dy)||1;return[p[0]+dx/l*d,p[1]+dy/l*d];});};
 polyFill(g,grow(torso,1.4),OL);polyFill(g,grow(shorts,1.4),OL);
 segD(g,neck,head,ru(0.8)+1,OL);disc(g,head[0],head[1],hr+1,OL);
 // 2) relleno: piernas, botines, short, torso, brazos, cabeza
 for(const p of legs){segD(g,p[0],p[1],ru(p[2]),p[3]);}
 for(const p of legs){if(p[3]===k.socks)segD(g,[p[0][0]-ru(0.35),p[0][1]],[p[1][0]-ru(0.35),p[1][1]],Math.max(0.5,ru(0.25)),sh(k.socks,0.25));}
 for(const b of boots){segD(g,b[0],b[1],ru(0.95),'#161616');g.fillStyle='#e8e8e8';g.fillRect(Math.round(b[0][0]-ru(0.5)),Math.round(b[0][1]),Math.max(1,Math.round(ru(1))),1);}
 polyFill(g,shorts,k.shorts);
 polyFill(g,shorts.slice(0,2).concat([L(shorts[1],shorts[2],0.25),L(shorts[0],shorts[3],0.25)]),sh(k.shorts,-0.12));
 // camiseta con diseño en coordenadas del torso (sigue al cuerpo aunque rote)
 const hc=T(hipC),sc=T(shC);let ay=[sc[0]-hc[0],sc[1]-hc[1]];const tl=Math.hypot(...ay)||1;ay=[ay[0]/tl,ay[1]/tl];const ax=[-ay[1],ay[0]];
 const halfW=2.9*u,front=!o.back;
 polyFill(g,torso,(x,y)=>{const dx=x-hc[0],dy=y-hc[1];let lx=(dx*ax[0]+dy*ax[1])/halfW,ly=(dx*ay[0]+dy*ay[1])/tl;
  if(!front)lx=-lx;
  if(front&&ly>0.9&&Math.abs(lx)<0.26)return k.collar||k.s;
  if(front&&ly>0.68&&ly<0.8&&lx>-0.5&&lx<-0.3)return k.s===k.p?(k.collar||k.num):k.s;
  let col=patternAt(k,lx,ly);
  if(lx>0.62)col=sh(col,-0.16);else if(lx<-0.66)col=sh(col,0.12);
  return col;});
 if(o.back&&o.num!=null){const str=String(o.num),ps=Math.max(1,Math.round(u*0.75)),w=str.length*4*ps-ps;const cx=(hc[0]+sc[0])/2,cy=(hc[1]+sc[1])/2-ps*2.5;
  g.fillStyle=k.num;for(let d=0;d<str.length;d++){const rows=DIGIT3[str[d]];for(let r=0;r<5;r++)for(let q=0;q<3;q++)if(rows[r][q]==='#')g.fillRect(Math.round(cx-w/2+d*4*ps+q*ps),Math.round(cy+r*ps),ps,ps);}}
 // número chico en el short
 if(!o.back&&o.num!=null&&u>2.2){const str=String(o.num),p0=shorts[0],ps=1;g.fillStyle=k.num===k.shorts?k.s:k.num;const bx0=Math.round(p0[0]+u*0.9),by0=Math.round(p0[1]+u*1.2);
  for(let d=0;d<str.length;d++){const rows=DIGIT3[str[d]];for(let r=0;r<5;r++)for(let q=0;q<3;q++)if(rows[r][q]==='#')g.fillRect(bx0+d*4+q,by0+r,1,1);}}
 for(const p of arms){segD(g,p[0],p[1],ru(p[2]),p[3]);}
 for(const sd of [0,1]){const p=arms[sd*3];segD(g,[p[0][0]+ru(0.3),p[0][1]],[p[1][0]+ru(0.3),p[1][1]],Math.max(0.5,ru(0.25)),sh(k.sleeve,-0.18));}
 for(const h of hands){if(o.gk){disc(g,h[0],h[1],ru(1.05),'#f1f1ec');disc(g,h[0]+ru(0.25),h[1]+ru(0.25),ru(0.5),'#c9c9c2');}else disc(g,h[0],h[1],ru(0.72),skin);}
 segD(g,neck,head,ru(0.8),sh(skin,-0.1));
 // cabeza píxel a píxel: pelo, cara y expresión, también rotada
 const hx=head[0],hy=head[1],R2=hr*hr,ci=Math.cos(-rot),si=Math.sin(-rot);
 for(let y=Math.floor(hy-hr);y<=Math.ceil(hy+hr);y++){let run=null,rs=0;const x0=Math.floor(hx-hr),x1=Math.ceil(hx+hr);
  for(let x=x0;x<=x1+1;x++){let col=null;const dx=x+0.5-hx,dy=y+0.5-hy;
   if(x<=x1&&dx*dx+dy*dy<=R2){const lx=(ci*dx-si*dy)/hr,ly=(si*dx+ci*dy)/hr;
    if(o.back)col=ly>0.55?skin:hair;
    else if(ly<-0.32||(Math.abs(lx)>0.8&&ly<0.15))col=hair;
    else col=lx>0.55?sh(skin,-0.14):skin;}
   if(col!==run){if(run){g.fillStyle=run;g.fillRect(rs,y,x-rs,1);}run=col;rs=x;}}}
 if(!o.back){
  const F=(lx,ly)=>[hx+(c*lx-s*ly)*hr,hy+(s*lx+c*ly)*hr];const px=Math.max(1,Math.round(u*0.42));
  for(const sx of [-1,1]){const e=F(sx*0.38,0.05);g.fillStyle='#16110d';g.fillRect(Math.round(e[0]-px/2),Math.round(e[1]),px,px+(u>3?1:0));
   const b=F(sx*0.4,-0.2);g.fillStyle=sh(hair,0.1);g.fillRect(Math.round(b[0]-px),Math.round(b[1]),px*2,1);}
  const m=F(0,0.55);g.fillStyle=sh(skin,-0.35);
  if(o.face==='happy'){g.fillRect(Math.round(m[0]-px*1.5),Math.round(m[1]),px*3,px);g.fillStyle='#f5f5f0';g.fillRect(Math.round(m[0]-px),Math.round(m[1]),px*2,1);}
  else if(o.face==='sad'){g.fillRect(Math.round(m[0]-px),Math.round(m[1]+1),px*2,1);g.fillRect(Math.round(m[0]-px*1.5),Math.round(m[1]+2),1,1);g.fillRect(Math.round(m[0]+px*1.5),Math.round(m[1]+2),1,1);}
  else g.fillRect(Math.round(m[0]-px),Math.round(m[1]),px*2,1);
 }
 return{head,hands};
}

/* ---- estadio ---- */
let penScene=null;
function buildPenScene(){
 let seed=9;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const fans=[];const k0=game.kits[0],k1=game.kits[1];
 const neutral=['#2f3f37','#3d4a42','#55606a','#6b5b4a','#283642','#4a3a5a'];
 for(let row=0;row<26;row++){const y=12+row*5.2,s=2+row*0.09;for(let x=-4;x<PW+4;x+=s*1.9+rnd()*1.4){if(rnd()<0.08)continue;
  const team=x<PW/2?0:1,fan=rnd()<0.78,k=team?k1:k0;fans.push({x,y:y+rnd()*1.5,s,c:fan?(rnd()<0.62?k.p:k.s):neutral[Math.floor(rnd()*neutral.length)],sk:SKIN[Math.floor(rnd()*4)],ph:rnd()*6.28,team:fan?team:-1,flag:fan&&rnd()<0.03});}}
 const noise=document.createElement('canvas');noise.width=PW;noise.height=PH;const ng=noise.getContext('2d');
 for(let i=0;i<9000;i++){ng.fillStyle=rnd()<0.5?'rgba(0,0,0,0.11)':'rgba(255,255,255,0.06)';ng.fillRect(Math.floor(rnd()*PW),Math.floor(rnd()*PH),rnd()<0.3?2:1,1);}
 const led=document.createElement('canvas');led.width=900;led.height=14;const lg=led.getContext('2d');
 const ads=[['#c8102e','#ffffff','PICADITO PIXEL'],['#0b3d91','#ffd400','FERNET 1882'],['#141414','#7cfc00','CHORI & PAN'],['#f2a900','#1a1a1a','MATE COCIDO'],['#f4f4f2','#0b3d91','EL POTRERO'],['#5b2a86','#ffffff','ASADO FC']];
 lg.font='8px Silkscreen, monospace';lg.textBaseline='middle';lg.textAlign='center';
 ads.forEach((a,i)=>{lg.fillStyle=a[0];lg.fillRect(i*150,0,150,14);lg.fillStyle=a[1];lg.fillText(a[2],i*150+75,8);});
 return{fans,noise,led};
}
function drawSky(g,hz){
 const gr=g.createLinearGradient(0,0,0,hz);gr.addColorStop(0,'#03070c');gr.addColorStop(1,'#0c1a1d');g.fillStyle=gr;g.fillRect(0,0,PW,hz);
}
function drawLights(g,t){
 for(const sx of [-1,1]){const x=sx<0?36:PW-36,y=10;
  const gl=g.createRadialGradient(x,y+8,2,x,y+8,70);gl.addColorStop(0,'rgba(255,250,220,0.35)');gl.addColorStop(1,'rgba(255,250,220,0)');g.fillStyle=gl;g.fillRect(x-70,y-60,140,140);
  g.fillStyle='#2a2f33';g.fillRect(x-17,y-3,34,22);
  for(let r=0;r<3;r++)for(let q=0;q<5;q++){g.fillStyle=(Math.floor(t*3)+r+q)%9===0?'#ffffff':'#fff6c8';g.fillRect(x-15+q*6,y-1+r*7,5,5);}
  g.fillStyle='#1d2226';g.fillRect(x-2,y+19,4,26);
 }
}
function drawCrowd(g,yTop,yBot,t,cheer){
 const S=penScene;const sc=(yBot-yTop)/150;
 for(const f of S.fans){const y=yTop+f.y*sc;if(y>yBot-2)continue;const s=f.s*Math.max(0.7,sc);
  const ch=cheer&&f.team===cheer.team;const j=ch?Math.abs(Math.sin(t*10+f.ph))*s*1.4:Math.max(0,Math.sin(t*2+f.ph))*s*0.15;
  const yy=Math.round(y-j),xx=Math.round(f.x),w=Math.max(2,Math.round(s*1.5)),h=Math.max(2,Math.round(s*1.4));
  g.fillStyle=f.c;g.fillRect(xx-(w>>1),yy,w,h);
  if(ch){g.fillRect(xx-(w>>1)-1,yy-h,1,h);g.fillRect(xx+(w>>1)+(w%2),yy-h,1,h);}
  g.fillStyle=f.sk;const hs=Math.max(1,Math.round(s*0.9));g.fillRect(xx-(hs>>1),yy-hs,hs,hs);
  if(f.flag){g.fillStyle='#4a3a2a';g.fillRect(xx+w,yy-h*3,1,h*3);g.fillStyle=f.c;const wv=Math.round(Math.sin(t*6+f.ph)*1.5);g.fillRect(xx+w+1,yy-h*3+wv,Math.round(s*3),Math.round(s*2));}
 }
 const sh0=g.createLinearGradient(0,yTop,0,yBot);sh0.addColorStop(0,'rgba(3,7,12,0.55)');sh0.addColorStop(1,'rgba(3,7,12,0)');g.fillStyle=sh0;g.fillRect(0,yTop,PW,yBot-yTop);
}
function drawLED(g,x0,y0,x1,y1,t){
 const S=penScene,w=x1-x0,h=y1-y0;if(w<4||h<2)return;const off=(t*40)%900;
 g.imageSmoothingEnabled=false;
 const sw=w*14/h;let x=0;
 while(x<w){const src=(off+x*14/h)%900,take=Math.min(900-src,(w-x)*14/h);g.drawImage(S.led,src,0,take,14,x0+x,y0,take*h/14,h);x+=take*h/14;}
 g.fillStyle='rgba(0,0,0,0.28)';for(let i=x0;i<x1;i+=2)g.fillRect(Math.round(i),y0,1,h);
 g.fillStyle='rgba(0,0,0,0.5)';g.fillRect(x0,y1-1,w,1);
}
function quadP(g,cam,a,b,c,d,col){const P=[a,b,c,d].map(p=>pproj(cam,...p));if(P.some(q=>!q))return;polyFill(g,P,col);}
function lineW(g,cam,a,b,w,col){const dx=b[2]-a[2],dz=b[0]-a[0];const l=Math.hypot(dx,dz)||1;const nx=-dx/l*w/2,nz=dz/l*w/2;
 quadP(g,cam,[a[0]+nx,0.001,a[2]+nz],[b[0]+nx,0.001,b[2]+nz],[b[0]-nx,0.001,b[2]-nz],[a[0]-nx,0.001,a[2]-nz],col);}
function drawPitch(g,cam,zFrom,zTo){
 const hz=cam.hy;g.fillStyle='#2b7432';g.fillRect(0,Math.floor(hz),PW,PH-hz);
 for(let z=Math.floor(zFrom/2)*2;z<zTo;z+=2){if(((z/2)%2+2)%2)continue;quadP(g,cam,[-40,0,z],[40,0,z],[40,0,z+2],[-40,0,z+2],'#318140');}
 g.drawImage(penScene.noise,0,Math.floor(hz),PW,PH-hz,0,Math.floor(hz),PW,PH-hz);
 const W='#ecebdf',D=PEN.D;
 lineW(g,cam,[-30,0,D],[30,0,D],0.12,W);
 lineW(g,cam,[-9.16,0,D-5.5],[9.16,0,D-5.5],0.12,W);
 for(const sx of [-1,1]){lineW(g,cam,[sx*9.16,0,D-5.5],[sx*9.16,0,D],0.12,W);lineW(g,cam,[sx*20.16,0,D-16.5],[sx*20.16,0,D],0.12,W);}
 lineW(g,cam,[-20.16,0,D-16.5],[20.16,0,D-16.5],0.12,W);
 const sp=pproj(cam,0,0,0);if(sp)ellipseF(g,sp[0],sp[1],0.16*sp[2],0.05*sp[2],W);
}
function drawGoalHD(g,cam,c,P){
 const W=PEN.W,H=PEN.H,Z=PEN.D,ZB=Z+1.9;
 const rip=c&&c.phase==='after'&&c.result==='goal'?{x:c.shot.x,y:c.shot.y,t:c.t}:null;
 const bz=(x,y)=>{if(!rip)return ZB;const d=Math.hypot(x-rip.x,y-rip.y);return ZB+Math.max(0,0.9*Math.exp(-rip.t*2.5)*Math.cos(rip.t*14-d*3))*Math.exp(-d*0.7);};
 const net='rgba(236,236,226,0.45)';
 for(let i=0;i<=24;i++){const x=-W+i*2*W/24;let lp=null;for(let j=0;j<=10;j++){const y=H*j/10,q=pproj(cam,x,y,bz(x,y));if(lp&&q)pline(g,lp[0],lp[1],q[0],q[1],net);lp=q;}}
 for(let j=0;j<=10;j++){const y=H*j/10;let lp=null;for(let i=0;i<=24;i++){const x=-W+i*2*W/24,q=pproj(cam,x,y,bz(x,y));if(lp&&q)pline(g,lp[0],lp[1],q[0],q[1],net);lp=q;}}
 for(const sx of [-1,1]){for(let kk=0;kk<=4;kk++){const z=Z+(ZB-Z)*kk/4;const a=pproj(cam,sx*W,0,z),b=pproj(cam,sx*W,H,z);if(a&&b)pline(g,a[0],a[1],b[0],b[1],net);}
  for(let j=0;j<=10;j++){const y=H*j/10,a=pproj(cam,sx*W,y,Z),b=pproj(cam,sx*W,y,ZB);if(a&&b)pline(g,a[0],a[1],b[0],b[1],net);}}
 for(let i=0;i<=24;i+=2){const x=-W+i*2*W/24,a=pproj(cam,x,H,Z),b=pproj(cam,x,H,bz(x,H));if(a&&b)pline(g,a[0],a[1],b[0],b[1],net);}
 const post=(a,b,w)=>{if(!a||!b)return;segD(g,a,b,w,'#ffffff');segD(g,[a[0]+w*0.5,a[1]],[b[0]+w*0.5,b[1]],Math.max(0.5,w*0.35),'#c8c8c0');};
 const pl=pproj(cam,-W,0,Z),plt=pproj(cam,-W,H,Z),pr=pproj(cam,W,0,Z),prt=pproj(cam,W,H,Z);
 const w=pl?Math.max(1.5,0.06*pl[2]):2;
 if(pl&&pr){g.fillStyle='rgba(0,0,0,0.35)';const sp=pproj(cam,-W+0.5,0,Z+0.6),sp2=pproj(cam,W+0.5,0,Z+0.6);}
 post(pl,plt,w);post(pr,prt,w);post(plt,prt,w);
}
function penBall(g,cam,bp,spin,blur){
 const p=pproj(cam,bp.x,bp.y,bp.z);if(!p)return;
 const r=Math.max(1.6,PEN.BR*p[2]);
 const s=pproj(cam,bp.x,0,bp.z);if(s)ellipseF(g,s[0]+r*0.3,s[1],r*1.05,Math.max(1,r*0.32),'rgba(0,0,0,0.35)');
 if(blur&&blur.length)blur.forEach((q,i)=>{disc(g,q[0],q[1],Math.max(1,q[2]*0.8),`rgba(255,255,240,${0.12+i*0.06})`);});
 disc(g,p[0],p[1],r+1,'#1a1a1a');disc(g,p[0],p[1],r,'#e4e4dc');disc(g,p[0]-r*0.18,p[1]-r*0.18,r*0.8,'#fbfbf6');
 if(r>2.6){for(let i=0;i<5;i++){const a=spin+i*1.2566,dx=Math.cos(a)*r*0.58,vis=Math.sin(a);if(vis<-0.3)continue;disc(g,p[0]+dx,p[1]+(i%2?-1:1)*r*0.3*vis,Math.max(0.6,r*0.2),'#262626');}
  disc(g,p[0]-r*0.4,p[1]-r*0.45,Math.max(0.5,r*0.16),'#ffffff');}
 return[p[0],p[1],r];
}
function penKeeperPose(c,P,t){
 // pose del arquero según su estado (para la vista del pateador)
 const k=keeperState(c,P),res=c.result,after=c.phase==='after';
 let j,rot=0,lift=0,face=null,xOff=0;
 if(k.e>0.02){
  const st=poseStretch(),rd=poseKeeperReady(t);
  j=lerpPose(rd,after&&res==='save'&&c.t>0.35?poseHug():st,Math.min(1,k.e*1.3));
  const ang=k.side?(k.dy<0?1.62:k.dy>0?1.15:1.4):0;
  rot=k.side*ang*Math.min(1,k.e*1.25);
  lift=(k.dy>0?0.75:k.dy<0?0.1:0.42)*Math.sin(Math.min(1,k.e)*Math.PI*(after&&c.t>0.25?0.5:0.85));
  if(!k.side){j=k.dy>0?shiftY(lerpPose(rd,poseArmsUp(0),k.e),-k.e*2.5,false):lerpPose(rd,poseHug(),k.e*0.8);}
  if(after&&c.t>0.25&&k.side)lift=Math.max(0,lift*(1-(c.t-0.25)*3));
 }else{j=poseKeeperReady(t);xOff=c.hk?0:Math.sin(t*2.3)*0.28;}
 if(after&&c.t>1.0){if(res==='save'||res==='post'||res==='bar'||res==='over'||res==='wide'){j=poseArmsUp(t);rot=0;lift=0;face='happy';xOff=SIM.clamp(k.kx*0.5,-2.4,2.4)-k.kx;}else if(res==='goal'&&!k.side){j=poseSad(t);face='sad';}}
 return{j,rot,lift,face,x:k.side&&!(after&&c.t>1&&res!=='goal')?k.kx-k.side*0.55:SIM.clamp(k.kx+xOff,-3.3,3.3)};
}
function penShooterPose(c,P,t){
 const rp=c.phase==='ready'||c.phase==='aim'?0:c.phase==='run'?c.run:1;
 // carrera en curva con paso corto antes del remate
 const ang=Math.PI*0.35*(1-rp);
 const x=-0.55-Math.sin(ang)*2.4,z=-0.45-Math.cos(ang)*2.6*(1-rp)-0.0;
 let j,face=null,rot=0;
 if(c.phase==='flight'||(c.phase==='after'&&c.t<0.5)){const kt=c.phase==='flight'?Math.min(1,0.45+c.ft/0.35*0.55):1;j=poseKick(kt);}
 else if(c.phase==='after'){const goal=PEN.isGoal(c.result);j=goal?poseRun(t*11,'plane'):poseSad(t);face=goal?'happy':'sad';}
 else if(c.phase==='run'){j=poseRun(rp*18,null);}
 else j=poseStand(t);
 return{j,x:c.phase==='after'&&c.t>0.5&&PEN.isGoal(c.result)?x+Math.min(3,(c.t-0.5)*2.5):x,z:c.phase==='after'&&c.t>0.5&&PEN.isGoal(c.result)?z-Math.min(2,(c.t-0.5)*1.5):z,face};
}

/* ---- primera persona: piernas del pateador y guantes del arquero ---- */
/* ---- primera persona: sprites pixel art dibujados a mano (píxeles gordos, paleta corta) ---- */
// Guante derecho visto desde atrás (las palmas miran al pateador). '.' = transparente.
const SPR_GLOVE=[
 '....oo.oo.oo.oo.',
 '...owwowwowwowwo',
 '...owwowwowwowwo',
 '...owgowgowgowgo',
 '...owgowgowgowgo',
 '...owgowgowgowgo',
 '.ooowgowgowgowgo',
 'owwowwwwwwwwwwgo',
 'owwowwwwwwwwwwgo',
 'owgowwwwwwwwwwgo',
 'owgwwwwwwwwwwwgo',
 '.owwwwwwwwwwwwgo',
 '.owwwkkkkkkwwwgo',
 '.owwwwwwwwwwwwgo',
 '.owwwwwwwwwwwggo',
 '..owwwwwwwwwwggo',
 '..oooooooooooooo',
 '..occcccccccccco',
 '..ocssssssssssco',
 '..occcccccccccco',
 '..oCCCCCCCCCCCCo'
];
// Guante cerrado (atajando): dedos doblados hacia adentro
const SPR_GLOVE_FIST=[
 '...oooooooooooo.',
 '..owwowwowwowwo.',
 '..owgowgowgowgo.',
 '.oooggggggggggo.',
 'owwowwwwwwwwwwgo',
 'owgowwwwwwwwwwgo',
 'owgwwwwwwwwwwwgo',
 '.owwwkkkkkkwwwgo',
 '.owwwwwwwwwwwggo',
 '..owwwwwwwwwwggo',
 '..oooooooooooooo',
 '..occcccccccccco',
 '..ocssssssssssco',
 '..occcccccccccco',
 '..oCCCCCCCCCCCCo'
];
// Botín visto desde arriba (punta hacia adelante) con el comienzo de la media
const SPR_BOOT=[
 '...oooo...',
 '..obbbbo..',
 '.obbbbbbo.',
 '.obBbbbbo.',
 '.obBbbbbo.',
 '.obBwwbbo.',
 '.obBbbbbo.',
 '.obBwwbyo.',
 '.obBbbbyo.',
 '.obBwwyyo.',
 '.obBbbyyo.',
 '.obbbbbbo.',
 '.oooooooo.',
 '.osLssSSo.',
 '.osLssSSo.'
];
function drawPix(g,rows,pal,x,y,s,flip){
 const w=rows[0].length;x=Math.round(x/s)*s;y=Math.round(y/s)*s;
 for(let j=0;j<rows.length;j++){const r=rows[j];for(let i=0;i<w;i++){const ch=r[i];if(!ch||ch==='.')continue;const col=pal[ch];if(!col)continue;g.fillStyle=col;g.fillRect(x+(flip?w-1-i:i)*s,y+j*s,s,s);}}
 return{x,y,w:w*s,h:rows.length*s};
}
// columna pixelada (media o manga) desde un punto hasta el borde de abajo
function pixColumn(g,x,y,wCells,s,col,dark,light){
 x=Math.round(x/s)*s;y=Math.round(y/s)*s;const h=PH+s-y;if(h<=0)return;const w=wCells*s;
 g.fillStyle='#0c120f';g.fillRect(x-s,y,w+2*s,h);
 g.fillStyle=col;g.fillRect(x,y,w,h);
 g.fillStyle=light;g.fillRect(x+s,y,s,h);
 g.fillStyle=dark;g.fillRect(x+w-2*s,y,s*2,h);
}
function fpLegs(g,c,P,t){
 const kit=game.kits[c.team],S=5;
 const pal={o:'#0c120f',b:'#1b1b1d',B:'#3b3b40',w:'#f2f2ec',y:'#e8c22a',s:kit.socks,S:sh(kit.socks,-0.28),L:sh(kit.socks,0.3)};
 const kicking=c.phase==='flight'||c.phase==='after';const kp=kicking?Math.min(1,(c.phase==='flight'?c.ft:0.4)/0.18):0;
 // la carrera mueve las piernas de a "pasos" enteros de píxel
 const step=c.phase==='run'?Math.round(Math.sin(P.clock*16)*3):0;
 const bw=SPR_BOOT[0].length*S;
 // pierna de apoyo
 let lx=PW*0.38-bw/2,ly=PH-104+Math.max(0,step)*S;
 let b1=drawPix(g,SPR_BOOT,pal,lx,ly,S,false);
 pixColumn(g,b1.x+2*S,b1.y+b1.h,6,S,kit.socks,sh(kit.socks,-0.28),sh(kit.socks,0.3));
 // pierna que patea: corre, va atrás y sale al golpe
 let rx=PW*0.6-bw/2-kp*70,ry=(kicking?PH-104-Math.sin(kp*Math.PI*0.95)*90:PH-104+Math.max(0,-step)*S);
 const b2=drawPix(g,SPR_BOOT,pal,rx,ry,S,true);
 pixColumn(g,b2.x+2*S,b2.y+b2.h,6,S,kit.socks,sh(kit.socks,-0.28),sh(kit.socks,0.3));
}
function fpGloves(g,c,P,t,k){
 const gk=game.gkKits[c.kt],S=4;
 const pal={o:'#0c120f',w:'#f4f4ee',g:'#c4c4bb',k:sh(gk.p,-0.15),c:gk.p,C:sh(gk.p,-0.3),s:'#ffffff'};
 const caught=c.phase==='after'&&c.result==='save'&&c.t>0.05;const goal=c.phase==='after'&&PEN.isGoal(c.result);
 const ready=c.phase==='run'||c.phase==='flight'?1:0;
 const bob=Math.round(Math.sin(P.clock*4)*1.5)*S;
 const ex=k.side?-k.side*150*k.e:0,ey=-(k.dy>0?120:k.dy<0?-20:55)*k.e;
 const spr=caught?SPR_GLOVE_FIST:SPR_GLOVE,gw=spr[0].length*S;
 for(const s of [-1,1]){
  const cx=PW/2+s*(caught?40:96+ready*20)+ex+(k.side?-k.side*s*20*k.e:0);
  const top=PH-150+bob*(1-k.e)-ready*8+ey+(caught?-30:0)+(goal?70*Math.min(1,c.t):0);
  const gx=Math.round((cx-gw/2)/S)*S,gy=Math.round(top/S)*S;
  // manga del buzo (columna pixelada) alineada con el puño del guante
  pixColumn(g,gx+(s<0?1:3)*S,gy+(spr.length-1)*S,12,S,gk.p,sh(gk.p,-0.3),sh(gk.p,0.25));
  // mano derecha tal cual; la izquierda espejada
  drawPix(g,spr,pal,gx,gy,S,s<0);
 }
 if(caught){const S2=4,bx0=PW/2+ex-7*S2,by0=PH-150-30+ey-6*S2;
  const BALL=['...oooooo...','..owwwwwwo..','.owwbbwwwwo.','owwbbbbwwwwo','owwwbbwwwgwo','owwwwwwwbbgo','owgwwwwbbbgo','owggwwwwbggo','.oggggwwggo.','..ogggggo...','...oooooo...'];
  drawPix(g,BALL,{o:'#0c120f',w:'#f4f4ee',g:'#c4c4bb',b:'#262626'},bx0,by0,S2,false);}
}

/* ---- escena completa ---- */
function renderPens(dt,W,H){
 const P=game.pens,c=P.cur,g=pg,t=P.clock;
 if(!penScene)penScene=buildPenScene();
 g.imageSmoothingEnabled=false;
 const cheer=c&&c.phase==='after'?{team:PEN.isGoal(c.result)?P.T.indexOf(P.T[c.team]):c.kt}:(P.phase==='final'?{team:P.res[0].filter(Boolean).length>P.res[1].filter(Boolean).length?0:1}:null);
 let zoom=1;
 if(!c||c.cam==='shooter'){
  const run=c?c.run:0,kicking=c&&(c.phase==='flight'||c.phase==='after');
  const bob=c&&c.phase==='run'?Math.abs(Math.sin(t*16))*0.06:0;
  const cam={x:0.15-run*0.15,y:1.55+bob-run*0.22,z:-2.7+run*1.55,dir:1,f:505,hy:150,cx:PW/2};
  if(kicking)zoom=1+Math.max(0,0.06-(c.phase==='flight'?Math.abs(c.ft-0.05):1)*0.3);
  drawSky(g,cam.hy);
  const by=pproj(cam,0,0.95,PEN.D+4.2),byb=pproj(cam,0,0,PEN.D+4.2);
  drawCrowd(g,0,by?by[1]:cam.hy-20,t,cheer);drawLights(g,t);
  drawPitch(g,cam,-3,PEN.D+4.2);
  const bl=pproj(cam,-16,0.95,PEN.D+4.2),br=pproj(cam,16,0,PEN.D+4.2);if(bl&&br)drawLED(g,Math.round(bl[0]),Math.round(bl[1]),Math.round(br[0]),Math.round(br[1]),t);
  const bp=c?ballPos(c):{x:0,y:PEN.BR,z:0};
  const inNet=c&&c.phase==='after'&&(c.result==='goal'||c.result==='over'||c.result==='wide');
  if(inNet)penBall(g,cam,bp,t*12,null);
  drawGoalHD(g,cam,c,P);
  if(c){const kp=penKeeperPose(c,P,t),pp=pproj(cam,kp.x,0,PEN.D+0.15);
   if(pp){const Hh=1.95*pp[2];ellipseF(g,pp[0],pp[1],Hh*0.16,Hh*0.03,'rgba(0,0,0,0.35)');
    bigPlayer(g,pp[0],pp[1],Hh,{j:kp.j,rot:kp.rot,lift:kp.lift*pp[2],kit:game.gkKits[c.kt],skin:SKIN[c.gk.skin|0],hair:c.gk.hair||'#222',gk:true,num:c.gk.num,face:kp.face});}}
  if(!inNet){if(c){c.blur=c.blur||[];const q=penBall(g,cam,bp,c.shot?t*22:0,c.phase==='flight'?c.blur:null);if(c.phase==='flight'&&q){c.blur.push(q);if(c.blur.length>4)c.blur.shift();}else c.blur=[];}else penBall(g,cam,bp,0,null);}
  if(c&&c.reticle&&(c.phase==='aim'||c.phase==='run')){
   const sw=PEN.sway(c.shooter,t,c.charge),q=pproj(cam,c.aim.x+sw.x,c.aim.y+sw.y,PEN.D);
   if(q){const col=c.charge>0.86?'#ff3b30':c.charge>=0.76?'#7dff4f':'#ffe14d';const rr=6+Math.sin(t*8);
    for(let a=0;a<16;a++){const an=a/16*Math.PI*2;g.fillStyle=col;g.fillRect(Math.round(q[0]+Math.cos(an)*rr),Math.round(q[1]+Math.sin(an)*rr),1,1);}
    g.fillStyle=col;g.fillRect(Math.round(q[0])-1,Math.round(q[1]),3,1);g.fillRect(Math.round(q[0]),Math.round(q[1])-1,1,3);
    const a0=pproj(cam,c.aim.x,c.aim.y,PEN.D);if(a0){g.fillStyle='rgba(255,255,255,0.5)';g.fillRect(Math.round(a0[0]),Math.round(a0[1]),1,1);}}
  }
  if(c&&c.hs)fpLegs(g,c,P,t);
  if(c&&c.hs&&c.phase==='run'){const bw=150,x0=PW/2-bw/2,y0=PH-14;g.fillStyle='#000';g.fillRect(x0-2,y0-2,bw+4,9);
   const seg=(a,b,col)=>{g.fillStyle=col;g.fillRect(x0+Math.round(a*bw),y0,Math.max(1,Math.round((b-a)*bw)),5);};
   seg(0,0.76,'#3a3a32');seg(0.76,0.86,'#1f5a2a');seg(0.86,1,'#5a1f1f');const ch=Math.min(1,c.charge);
   seg(0,Math.min(ch,0.76),'#e8e24a');if(ch>0.76)seg(0.76,Math.min(ch,0.86),'#7dff4f');if(ch>0.86)seg(0.86,ch,'#ff3b30');}
  P.roll=0;
 }else{
  const k=keeperState(c,P);
  const camY=1.62+(k.side?(k.dy>0?0.55:k.dy<0?-1.05:-0.5)*k.e:(k.dy>0?0.55*k.e:k.dy<0?-0.8*k.e:0));
  const cam={x:k.kx,y:Math.max(0.32,camY),z:PEN.D+0.3,dir:-1,f:445,hy:160,cx:PW/2};
  drawSky(g,cam.hy);
  const by=pproj(cam,0,0.95,-9),bl=pproj(cam,18,0.95,-9),br=pproj(cam,-18,0,-9);
  drawCrowd(g,0,by?by[1]:cam.hy-18,t,cheer);drawLights(g,t);
  drawPitch(g,cam,-9,PEN.D+0.3);
  if(bl&&br)drawLED(g,Math.round(Math.min(bl[0],br[0])),Math.round(bl[1]),Math.round(Math.max(bl[0],br[0])),Math.round(br[1]),t);
  const sp=penShooterPose(c,P,t),sq=pproj(cam,sp.x,0,sp.z);
  const bp=ballPos(c);
  const ballFirst=bp.z<sp.z;
  if(ballFirst&&!(c.phase==='after'&&PEN.isGoal(c.result)))penBall(g,cam,bp,t*20,null);
  if(sq){const Hh=1.85*sq[2];ellipseF(g,sq[0],sq[1],Hh*0.15,Hh*0.03,'rgba(0,0,0,0.35)');
   bigPlayer(g,sq[0],sq[1],Hh,{j:sp.j,kit:game.kits[c.team],skin:SKIN[c.shooter.skin|0],hair:c.shooter.hair,num:c.shooter.num,face:sp.face});}
  const caught=c.phase==='after'&&c.result==='save';
  if(!ballFirst&&!caught&&!(c.phase==='after'&&PEN.isGoal(c.result)&&bp.z>PEN.D)){c.blur=c.blur||[];const q=penBall(g,cam,bp,t*24,c.phase==='flight'?c.blur:null);if(c.phase==='flight'&&q){c.blur.push(q);if(c.blur.length>4)c.blur.shift();}}
  // líneas de velocidad al tirarse
  if(k.side&&k.e>0.1&&k.e<0.95){g.fillStyle='rgba(255,255,255,0.22)';for(let i=0;i<14;i++){const y=(i*37+Math.floor(t*60)*13)%PH;g.fillRect(k.side>0?0:PW-120,y,120*(1-k.e),1);}}
  fpGloves(g,c,P,t,k);
  P.roll=k.side?-k.side*0.3*k.e:0;
 }
 // papelitos y destello
 for(let i=fx.confetti.length-1;i>=0;i--){const q=fx.confetti[i];q.t+=dt;q.vy+=40*dt;q.x+=q.vx*dt+Math.sin(q.t*7+i)*0.4;q.y+=q.vy*dt;if(q.t>q.ttl){fx.confetti.splice(i,1);continue;}g.fillStyle=q.col;g.fillRect(Math.round(q.x),Math.round(q.y),2,(i%3)?1:2);}
 if(P.flash>0){g.fillStyle=`rgba(255,250,230,${P.flash})`;g.fillRect(0,0,PW,PH);P.flash=Math.max(0,P.flash-dt*2.2);}
 // viñeta
 const vg=g.createRadialGradient(PW/2,PH/2,PH*0.45,PW/2,PH/2,PW*0.65);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');g.fillStyle=vg;g.fillRect(0,0,PW,PH);
 // componer en pantalla
 const sc=Math.min(W/PW,H/PH);let ox=Math.round((W-PW*sc)/2),oy=Math.round((H-PH*sc)/2);
 if(fx.shake>0){fx.shake=Math.max(0,fx.shake-dt);ox+=Math.round((Math.random()-0.5)*fx.shake*14*sc);oy+=Math.round((Math.random()-0.5)*fx.shake*14*sc);}
 sctx.imageSmoothingEnabled=false;
 const roll=c&&c.cam==='keeper'?(P.roll||0):0;
 if(roll||zoom!==1){sctx.save();sctx.translate(W/2,H/2);sctx.rotate(roll);const z=(roll?1.4:1)*zoom;sctx.drawImage(pbuf,-PW*sc*z/2,-PH*sc*z/2,PW*sc*z,PH*sc*z);sctx.restore();}
 else sctx.drawImage(pbuf,ox,oy,Math.round(PW*sc),Math.round(PH*sc));
 penOverlay(dt,W,H,sc,ox,oy);
}
function spawnConfettiPens(kit){for(let i=0;i<260;i++)fx.confetti.push({x:Math.random()*PW,y:Math.random()*120,vx:(Math.random()-0.5)*40,vy:-(10+Math.random()*50),col:Math.random()<0.5?kit.p:kit.s,t:0,ttl:2.4+Math.random()*1.8});}
function penOverlay(dt,W,H,sc,ox,oy){
 const P=game.pens,c=P.cur;
 const fs=Math.max(16,Math.round(5.6*sc)),top=Math.round(oy+8*sc);
 sctx.font=`${fs}px Silkscreen, monospace`;sctx.textBaseline='middle';
 const n=Math.max(5,P.res[0].length,P.res[1].length),r0=Math.round(fs*0.3),gap=Math.round(r0*2.8),inner=fs*1.8,span=(n-1)*gap+r0;
 const dots=(team,x,dir)=>{for(let i=0;i<n;i++){const v=P.res[team][i];const cx=x+dir*(r0+i*gap);sctx.beginPath();sctx.arc(cx,top+fs*0.5,r0,0,Math.PI*2);
   if(v===true){sctx.fillStyle='#7dff4f';sctx.fill();}else if(v===false){sctx.fillStyle='#ff3b30';sctx.fill();}else{sctx.strokeStyle='#93ad9f';sctx.lineWidth=2;sctx.stroke();}}};
 const half=inner+span+fs*3.4;
 sctx.fillStyle='rgba(5,11,8,0.82)';sctx.fillRect(W/2-half,top-fs*0.3,half*2,fs*1.6);
 sctx.fillStyle='#f3f0e2';sctx.textAlign='right';sctx.fillText(P.T[0].abbr,W/2-inner-span-fs*0.6,top+fs*0.55);sctx.textAlign='left';sctx.fillText(P.T[1].abbr,W/2+inner+span+fs*0.6,top+fs*0.55);
 dots(0,W/2-inner,-1);dots(1,W/2+inner,1);
 sctx.textAlign='center';sctx.fillStyle='#ffb02e';
 const a=P.res[0].filter(Boolean).length,b=P.res[1].filter(Boolean).length;sctx.fillText(`${a}-${b}`,W/2,top+fs*0.55);
 sctx.font=`${Math.round(fs*0.95)}px VT323, monospace`;sctx.fillStyle='#f3f0e2';
 if(c&&P.phase!=='final'&&P.phase!=='intro'){
  sctx.fillText(`Patea ${c.shooter.n} (${P.T[c.team].abbr}) · ataja ${c.gk.n}`,W/2,top+fs*2.1);
  let help='';
  const mv=sl=>sl===1&&touch.on?'el joystick':sl===1?'WASD':'las flechas',kb=sl=>sl===1&&touch.on?'PATEAR':sl===1?'Espacio':'Enter';
  if(c.hs&&(c.phase==='aim'||c.phase==='run'))help=c.reticle?'Apuntá con '+mv(c.hs)+' · mantené '+kb(c.hs)+' para correr y cargar, soltá para patear':'Apuntá a ciegas con '+mv(c.hs)+' (empieza al medio) · mantené y soltá '+kb(c.hs);
  else if(c.hk&&!c.dive&&c.phase!=='after')help='Elegí lado con '+mv(c.hk)+' y tocá '+kb(c.hk)+' para tirarte · si te tirás antes de la patada, te ven';
  if(help){const hy2=oy+PH*sc-fs*1.1;const tw=sctx.measureText(help).width;sctx.fillStyle='rgba(5,11,8,0.8)';sctx.fillRect(W/2-tw/2-10,hy2-fs*0.6,tw+20,fs*1.2);sctx.fillStyle='#d8e6dc';sctx.fillText(help,W/2,hy2);}
 }
 const m=P.msg||(P.phase==='intro'?{text:'PENALES',col:'#ffb02e',t:0,sub:'Se patean 5 cada uno · después, muerte súbita'}:null);
 if(m){m.t+=dt;const big=Math.round(fs*3.4*(m.t<0.15?0.5+m.t/0.15*0.5:m.t<0.25?1.1-(m.t-0.15):1));sctx.font=`${big}px Silkscreen, monospace`;sctx.textAlign='center';
  sctx.fillStyle='#000';sctx.fillText(m.text,W/2+4,H*0.4+4);sctx.fillStyle=m.col;sctx.fillText(m.text,W/2,H*0.4);
  if(m.sub){sctx.font=`${Math.round(fs*1.15)}px VT323, monospace`;sctx.fillStyle='#000';sctx.fillText(m.sub,W/2+2,H*0.4+big*0.8+2);sctx.fillStyle='#f3f0e2';sctx.fillText(m.sub,W/2,H*0.4+big*0.8);}}
}

/* ===================== AUDIO ===================== */
let AC=null,muted=false;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;}}return AC;}
function tone(f0,f1,dur,type,vol){const a=ac();if(!a||muted)return;const t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+0.02);}
function noise(dur,vol,freq){const a=ac();if(!a||muted)return;const n=Math.floor(a.sampleRate*dur),bb=a.createBuffer(1,n,a.sampleRate),d=bb.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const src=a.createBufferSource();src.buffer=bb;const fl=a.createBiquadFilter();fl.type='bandpass';fl.frequency.value=freq;const g=a.createGain();g.gain.value=vol;src.connect(fl).connect(g).connect(a.destination);src.start();}
function sfx(e){
 if(game&&game.demo)return;
 switch(e.t){
  case'kick':tone(170,55,0.09,'sine',Math.min(0.5,0.12+e.power/50));noise(0.04,0.15,900);break;
  case'touch':if(e.v>2)tone(140,70,0.05,'sine',Math.min(0.25,e.v/30));break;
  case'dtouch':tone(240,170,0.035,'triangle',0.035);break;
  case'wall':if(e.v>2)noise(0.07,Math.min(0.3,e.v/40),420);break;
  case'post':tone(980,700,0.25,'square',0.08);tone(1470,1100,0.2,'triangle',0.05);break;
  case'net':noise(0.18,Math.min(0.35,0.08+(e.v||8)/50),1400);tone(160,90,0.12,'triangle',0.05);break;
  case'sidenet':noise(0.1,0.1,1600);break;
  case'roofnet':noise(0.1,0.08,1800);break;
  case'catch':tone(220,120,0.08,'triangle',0.2);break;
  case'dive':noise(0.12,0.12,600);break;
  case'whistle':tone(2100,2050,0.18,'triangle',0.09);break;
  case'skill':noise(0.14,0.14,1900);tone(600,900,0.1,'triangle',0.05);break;
  case'feint':tone(300,200,0.12,'square',0.04);break;
  case'goal':noise(1.6,0.35,700);tone(523,523,0.14,'square',0.07);setTimeout(()=>tone(659,659,0.14,'square',0.07),140);setTimeout(()=>tone(784,784,0.3,'square',0.07),280);break;
  case'end':tone(2100,2050,0.2,'triangle',0.09);setTimeout(()=>tone(2100,2050,0.2,'triangle',0.09),260);setTimeout(()=>tone(2100,1900,0.5,'triangle',0.09),520);break;
 }
}

/* ===================== UI / PARTIDA ===================== */
const $=id=>document.getElementById(id);
const LS='picadito-setup-v1';
let setup={format:1,duration:180,cap:5,equal:false,diff:'normal',replays:true,mode:'amistoso',tourType:'wc',tsel:{team:'arg',player:0,kit:'auto',ctrl:'P1'},sides:[{team:'arg',player:0,ctrl:'P1'},{team:'bra',player:0,ctrl:'CPU'}]};
try{const sv=JSON.parse(localStorage.getItem(LS)||'null');if(sv&&sv.sides)setup=Object.assign(setup,sv);}catch(e){}
// la v2.0 (modo clásico) guardaba formatos de 5 a 11: se vuelve al picadito
if(![1,2,3].includes(setup.format)){setup.format=2;setup.duration=180;setup.cap=5;}delete setup.play;
// configuraciones viejas guardaban el equipo por posición en la lista
const OLD_IDS=['arg','bra','fra','esp','eng','lriv','lboc'];
for(const sd of setup.sides){if(typeof sd.team==='number')sd.team=OLD_IDS[sd.team]||'arg';if(!TEAMS.some(t=>t.id===sd.team))sd.team='arg';}
function save(){try{localStorage.setItem(LS,JSON.stringify(setup));}catch(e){}}
let fontsReady=0;
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('8px Silkscreen'),document.fonts.load('16px VT323')]).then(()=>{fontsReady=1;}).catch(()=>{});}

function colorDist(a,b){const pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16);return Math.hypot((pa>>16)-(pb>>16),((pa>>8)&255)-((pb>>8)&255),(pa&255)-(pb&255));}
// Camisetas: cada lado puede pedir 'home' (titular), 'away' (suplente) o 'auto'.
// En 'auto' el equipo cambia a la suplente si choca de color con el rival.
function resolveKits(tA,tB,cA,cB){
 cA=cA||'auto';cB=cB||'auto';
 const pick=(t,c)=>c==='away'?t.alt:t.kit,other=(t,k)=>k===t.kit?t.alt:t.kit;
 let kA=pick(tA,cA),kB=pick(tB,cB);
 const clash=()=>kA===kB||colorDist(kA.p,kB.p)<110;
 if(clash()){if(cB==='auto')kB=other(tB,kB);else if(cA==='auto')kA=other(tA,kA);}
 if(clash()&&cA==='auto'&&cB==='auto')kA=other(tA,kA);
 return[kA,kB];
}
function gkKit(t){return{p:t.gk.kit,s:t.gk.kit,pat:'solid',sleeve:t.gk.kit,shorts:'#1b1b1b',socks:t.gk.kit,num:'#111111'};}

let game=null,acc=0,last=performance.now();
function buildGame(cfg,demo,net){
 const lineups=[],ctrls=[];
 cfg.sides.forEach((sd,team)=>{
  const t=teamOf(sd.team);const n=cfg.format;
  const pick=sd.player>=0?sd.player:0;
  const picks=net?net.humans.filter(x=>x.team===team&&!x.gk).map(x=>x.k):[pick];
  const order=[...picks,...t.players.map((_,i)=>i).filter(i=>!picks.includes(i))];
  const lu=[];
  for(let i=0;i<n;i++)lu.push({data:t.players[order[i%order.length]]});
  lu.push({data:t.gk,gk:true});
  lineups.push(lu);
 });
 const tie=cfg.tie||'golden';
 const state=SIM.createMatch({format:cfg.format,duration:cfg.duration,cap:cfg.cap,equal:cfg.equal,lineups,kickoffTeam:0,allowDraw:cfg.allowDraw||(!cfg.tour&&tie==='draw'),penalties:cfg.penalties||(!cfg.tour&&tie==='pens'),agg:cfg.agg});
 state.players.forEach(p=>{
  const sd=cfg.sides[p.team];const t=teamOf(sd.team);
  const d=p.role==='gk'?t.gk:t.players.find(x=>x.n===p.name);p.skin=d.skin;p.hair=d.hair;
  const firstField=state.players.find(q=>q.team===p.team&&q.role!=='gk');
  const gkSel=sd.player===-1&&cfg.format>=2;
  const nh=net&&net.humans.find(x=>x.team===p.team&&(p.role==='gk'?x.gk:(!x.gk&&x.name===p.name)));
  if(net){if(nh){ctrls[p.id]={type:'human',slot:nh.peer===NET.me?1:2,peer:nh.peer};if(p.role==='gk')p.hgk=true;}else ctrls[p.id]={type:'ai',diff:'normal'};}
  else if(!demo&&sd.ctrl!=='CPU'&&(gkSel?p.role==='gk':p===firstField)){ctrls[p.id]={type:'human',slot:sd.ctrl==='P1'?1:2};if(p.role==='gk')p.hgk=true;}
  else ctrls[p.id]={type:'ai',diff:sd.ctrl==='CPU'?cfg.diff:'normal'};
 });
 const tA=teamOf(cfg.sides[0].team),tB=teamOf(cfg.sides[1].team);
 return{stadium:stadiumOf(teamOf(cfg.sides[0].team)),state,ctrls,demo,paused:false,rec:[],replay:null,replayDone:false,lastInputs:[],stats:{shots:[0,0],onTarget:[0,0],saves:[0,0],poss:[0,0],tackles:[0,0],fouls:[0,0]},kits:resolveKits(tA,tB,cfg.sides[0].kit,cfg.sides[1].kit),gkKits:[gkKit(tA),gkKit(tB)],teams:[tA,tB],cfg:JSON.parse(JSON.stringify(cfg)),bannerT:0};
}
function startDemo(){
 const ai=Math.floor(Math.random()*TEAMS.length),bi=(ai+1+Math.floor(Math.random()*(TEAMS.length-1)))%TEAMS.length;const a=TEAMS[ai].id,b=TEAMS[bi].id;
 game=buildGame({format:2,duration:9999,cap:0,equal:false,diff:'normal',sides:[{team:a,player:0,ctrl:'CPU'},{team:b,player:0,ctrl:'CPU'}]},true);
 $('hud').hidden=true;$('hint').hidden=true;
}
function startMatch(cfg,tm,net){
 ac();if(AC&&AC.state==='suspended')AC.resume();
 if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
 cfg=cfg||setup;
 if(!net)save();
 game=buildGame(cfg,false,net);game.net=net||null;game.netMenu=false;game.tourMatch=tm||null;acc=0;resetFX();$('banner').hidden=true;
 const ag=game.state.agg;$('agg').hidden=!(tm&&cfg.agg);$('agg').textContent=cfg.agg?`IDA ${ag[0]}-${ag[1]}`:'';
 if(tm)setTimeout(()=>{if(game&&game.tourMatch)banner(TOURS[tour.type].name.toUpperCase(),tm.stage+' · '+game.stadium.n,2.1);},150);
 showScreen(null);$('hud').hidden=false;$('hint').hidden=false;
 const[kA,kB]=game.kits;$('abbrA').textContent=game.teams[0].abbr;$('abbrB').textContent=game.teams[1].abbr;
 drawBadge($('chipA'),kA);drawBadge($('chipB'),kB);
 const ST=game.stadium;$('hudStadium').textContent=ST.n+(ST.c?' · '+ST.c.toUpperCase():'');$('hud').classList.remove('flash');
 resetParty();resetNets();
 if(!tm)setTimeout(()=>{if(game&&!game.demo&&!game.tourMatch&&game.state.tick<200)banner(ST.n,(ST.c?ST.c+' · ':'')+game.teams[0].name+' vs '+game.teams[1].name,2.1);},120);
 $('hint').textContent=hintText();
 updateHUD();
}
// escudito pixelado con el diseño de la camiseta
function drawBadge(cv,kit){
 const g=cv.getContext('2d');g.clearRect(0,0,12,14);
 for(let y=0;y<14;y++){const inset=y<9?0:y<11?1:y<12?2:y<13?3:4;for(let x=inset;x<12-inset;x++){const edge=x===inset||x===11-inset||y===0||y===13-(y>=13?0:99);g.fillStyle=edge?'#000':patColor(kit,Math.min(7,Math.floor((x-1)*8/10)),Math.min(6,Math.floor((y-1)*7/11)));g.fillRect(x,y,1,1);}}
 g.fillStyle='rgba(255,255,255,.35)';g.fillRect(2,1,1,6);
}
function hudGoal(team){const hd=$('hud');hd.style.setProperty('--fc',game.kits[team].p);hd.classList.remove('flash');void hd.offsetWidth;hd.classList.add('flash');}
function hintText(){
 if(touch.on&&setup.sides.some(sd=>sd.ctrl==='P1'))return'Joystick para moverte · PATEAR: mantené para cargar · FILI + dirección: filigrana';
 const h=[];setup.sides.forEach(sd=>{const gk=sd.player===-1&&setup.format>=2;if(sd.ctrl==='P1')h.push(gk?'P1 arquero: WASD · Espacio sacar/patear · E agarrar (en el área) · Q estirada':'P1: WASD · Espacio patear · E globo · Q barrida · R+dirección filigrana · Shift');if(sd.ctrl==='P2')h.push(gk?'P2 arquero: Flechas · Enter sacar · Shift der agarrar · Ctrl der estirada':'P2: Flechas · Enter · Shift der · Ctrl der');});
 h.push('Esc pausa · M sonido');return h.join('   |   ');
}
function showScreen(id){for(const k of ['menu','pause','end','tour'])$(k).hidden=k!==id;}
function togglePause(fromBlur){
 if(!game||game.demo||(game.state.phase==='end'&&!game.pens))return;
 $('btnRestart').hidden=!!game.net;
 if(game.net){game.netMenu=!game.netMenu;showScreen(game.netMenu?'pause':null);keys.clear();tapped.clear();$('pauseNote').hidden=true;if(game.netMenu)$('btnResume').focus();return;}
 game.paused=!game.paused;showScreen(game.paused?'pause':null);keys.clear();tapped.clear();
 $('pauseNote').hidden=!(game.paused&&fromBlur===true);
 if(game.paused){if(fromBlur!==true)$('btnResume').focus();}
 else{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();try{window.focus();}catch(e){}}
}
function fmt(t){t=Math.max(0,Math.ceil(t));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');}
function updateHUD(){
 const s=game.state;$('scoreA').textContent=s.score[0];$('scoreB').textContent=s.score[1];
 const ck=$('clock');if(s.golden){ck.textContent='ORO '+fmt(s.ot);ck.classList.add('gold');}else{ck.textContent=fmt(s.clock);ck.classList.remove('gold');}
}
function banner(big,small,dur){$('bannerBig').textContent=big;$('bannerSmall').textContent=small||'';$('banner').hidden=false;game.bannerT=dur;}
function handleEvents(){
 const s=game.state,st=game.stats;
 for(const e of s.events){
  sfx(e);
  if(game.demo)continue;
  switch(e.t){
   case'goal':{const tn=game.teams[e.team].abbr;banner('¡GOOOL!',e.own?`${e.name} (en contra) · ${tn}`:`${e.name} · ${tn}`,setup.replays&&!game.net?0.9:2.3);fx.shake=0.5;fx.flash=0.6;spawnConfetti(game.kits[e.team]);crowdEvent('goal',e.team);hudGoal(e.team);
    game.goalCaption=e.own?`${e.name} (en contra)`:e.name;break;}
   case'golden':banner('GOL DE ORO','El próximo gol gana',2);break;
   case'whistle':if(s.tick<5)crowdEvent('kickoff');if(s.phase==='kickoff'&&s.players.some(q=>q.team===s.kickoffTeam&&game.ctrls[q.id].type==='human')&&!s.pendingEnd)setTimeout(()=>{if(game&&!game.demo&&game.state.phase==='kickoff')banner('SAQUE','Tocá la pelota para empezar',1.3);},game.state.tick<5?2400:2600);break;
   case'kick':{if(e.power>16)crowdEvent('chance');
    if(e.perfect&&e.power>14)popup('¡PERFECTO!',e.x,e.y,'#7dff4f');
    if(!e.lob&&e.power>12){
     const atk=e.team===0?1:-1,gx=atk*s.L/2;
     if(e.vx*atk>0){const t=(gx-e.x)/e.vx;const y=e.y+e.vy*t;if(t>0&&t<2.2&&Math.abs(y)<s.G/2+1.5){st.shots[e.team]++;if(Math.abs(y)<s.G/2)st.onTarget[e.team]++;}}
    }
    break;}
   case'skill':{const nm={flick:'¡SOMBRERITO!',roulette:'¡RULETA!',stepover:'¡BICICLETA!',chilena:'¡CHILENA!'}[e.type];popup(nm,e.x,e.y,'#ffe14d');break;}
   case'feint':{const q=s.players[e.id];popup('¡LO DEJÓ PAGANDO!',q.x,q.y,'#9be7ff');break;}
   case'post':crowdEvent('chance');popup('¡PALO!',s.ball.x,s.ball.y,'#f3f0e2');fx.shake=Math.max(fx.shake,0.25);break;
   case'catch':if(e.v>6){crowdEvent('save');st.saves[e.team]++;popup('¡ATAJADA!',s.ball.x,s.ball.y,'#ffb02e');}break;
   case'touch':if(e.gk&&e.v>8){crowdEvent('save');st.saves[e.team]++;popup('¡QUÉ ATAJADA!',s.ball.x,s.ball.y,'#ffb02e');}break;
   case'tackle':st.tackles[s.players[e.id].team]++;break;
   case'trip':popup('¡BARRIDA!',s.players[e.id].x,s.players[e.id].y,'#9be7ff');break;
   case'foul':st.fouls[s.players[e.id].team]++;popup('¡FALTA!',e.x,e.y,'#ff5a4f');break;
   case'wall':if(e.v>16)fx.shake=Math.max(fx.shake,0.12);break;
   case'net':case'sidenet':case'roofnet':netHit(e);break;
   case'dtouch':for(let i=0;i<3;i++)fx.dust.push({x:e.x,y:e.y,vx:(i-1)*0.9,vy:-0.4+i*0.3,t:0});if(fx.dust.length>30)fx.dust.splice(0,fx.dust.length-30);break;
  }
 }
 s.events.length=0;
 if(!game.demo&&s.phase==='play'&&s.ball.lastTeam>=0)st.poss[s.ball.lastTeam]++;
}
function showEnd(){
 const s=game.state;
 const pr=game.pensResult;
 let w=s.score[0]+s.agg[0]===s.score[1]+s.agg[1]?null:s.score[0]+s.agg[0]>s.score[1]+s.agg[1]?0:1;
 if(s.score[0]===s.score[1]&&!(s.agg[0]||s.agg[1]))w=null;
 if(pr)w=pr[0]>pr[1]?0:1;
 $('endTitle').textContent=w==null?'EMPATE':'GANÓ '+game.teams[w].abbr;
 $('endA').textContent=game.teams[0].abbr;$('endB').textContent=game.teams[1].abbr;$('endScore').textContent=s.score[0]+' - '+s.score[1]+(pr?` (${pr[0]}-${pr[1]} pen)`:'');
 const L=s.scorers.filter(x=>x.team===0),R=s.scorers.filter(x=>x.team===1),rows=Math.max(L.length,R.length);
 const fmtS=x=>x?`${x.name}${x.own?' (ec)':''} ${x.golden?'oro':fmt(x.t)}`:'';
 let html='';for(let i=0;i<rows;i++){html+=`<div>${fmtS(L[i])}</div><div>${fmtS(R[i])}</div>`;}
 $('endScorers').innerHTML=html;
 const st=game.stats,tp=st.poss[0]+st.poss[1]||1,pa=Math.round(st.poss[0]/tp*100);
 const row=(l,a,b2)=>`<tr><td>${a}</td><th>${l}</th><td>${b2}</td></tr>`;
 $('endStats').innerHTML=row('Tiros (al arco)',`${st.shots[0]} (${st.onTarget[0]})`,`${st.shots[1]} (${st.onTarget[1]})`)+row('Posesión',pa+'%',(100-pa)+'%')+row('Atajadas',st.saves[0],st.saves[1])+row('Barridas limpias',st.tackles[0],st.tackles[1])+row('Faltas',st.fouls[0],st.fouls[1]);
 const tm=game.tourMatch;
 if(tm&&tour){recordUserResult(tour,tm,s.score,pr);
  const ag=s.agg,glob=ag[0]||ag[1]?` · global ${s.score[0]+ag[0]}-${s.score[1]+ag[1]}`:'';
  $('endTitle').textContent=(w==null?'EMPATE':w===0?'¡GANASTE!':'PERDISTE')+(pr?' POR PENALES':glob.toUpperCase());}
 $('btnRematch').textContent=tm?'Continuar torneo':game.net?(NET.host?'Revancha':'Esperando revancha…'):'Revancha';$('btnRematch').disabled=!!(game.net&&!NET.host);$('btnEndMenu').textContent=game.net?'Volver a la sala':'Volver al menú';
 showScreen('end');$('btnRematch').focus();
}

function padKick(){const pads=getPads();for(const g of pads)if(g&&g.buttons[0]&&g.buttons[0].pressed)return true;return false;}
// Ciclo del juego. Usa siempre performance.now() (no el tiempo que pasa el navegador a requestAnimationFrame,
// que en algunos entornos viene en otra base y dejaba el reloj negativo = partido congelado).
let lastFrameAt=0;
function frame(){
 requestAnimationFrame(frame);
 tickOnce();
}
function tickOnce(){
 lastFrameAt=performance.now();
 try{frameBody(lastFrameAt);}catch(e){showError(e);}
}
// Respaldo: si el navegador deja de llamar a requestAnimationFrame (pasa en algunas vistas embebidas),
// el juego sigue avanzando con un temporizador.
setInterval(()=>{if(performance.now()-lastFrameAt>120)tickOnce();},16);
function showError(e){
 if(showError.shown)return;showError.shown=true;
 console.error('Error en el juego:',e);
 const box=document.createElement('div');
 box.style.cssText='position:absolute;left:12px;right:12px;bottom:44px;z-index:50;background:#3a0d0d;color:#ffd7d0;border:2px solid #ff5a4f;padding:8px 12px;font:18px VT323,monospace;white-space:pre-wrap;max-height:30%;overflow:auto';
 box.textContent='Error (mandale esto a Claude): '+(e&&e.stack?e.stack.split('\n').slice(0,3).join(' | '):String(e));
 document.getElementById('app').appendChild(box);
}
addEventListener('error',ev=>showError(ev.error||ev.message));
function frameBody(t){
 updateTouchUI();
 let dt=(t-last)/1000;last=t;
 if(!(dt>0))dt=0;if(dt>0.1)dt=0.1;
 updateCrowdAudio(dt,!!(game&&!game.demo&&!game.paused&&$('end').hidden&&$('menu').hidden&&$('tour').hidden));
 if(!(acc>=0))acc=0;
 if(game&&game.pens){if(!game.paused)penUpdate(dt);render(game.paused?0:dt);return;}
 if(game&&game.replay&&!game.paused){
  const r=game.replay;r.t+=dt*60*0.6;r.age+=dt;
  const skip=r.age>0.4&&(keys.has('Space')||keys.has('Enter')||keys.has('NumpadEnter')||padKick());
  if(r.t>=r.frames.length-1||skip){game.replay=null;fx.trail.length=0;if(skip){keys.delete('Space');keys.delete('Enter');keys.delete('NumpadEnter');}}
 }else if(game&&game.net&&!game.net.host){netClient(dt);
 }else if(game&&!game.paused&&game.state.phase!=='end'){
  acc+=dt;let n=0;
  while(acc>=SIM.DT&&n<6){
   const s=game.state;
   const inputs=s.players.map(p=>{const c=game.ctrls[p.id];if(c.type==='human')return c.peer&&c.peer!==NET.me?netInput(c.peer):game.netMenu?NEUT():readHuman(c.slot);return p.role==='gk'?AI.keeper(s,p,c.diff):AI.field(s,p,c.diff);});
   game.lastInputs=inputs;
   SIM.step(s,inputs);if(game.net)netCollect(s.events);handleEvents();acc-=SIM.DT;n++;
   if(!game.demo){game.rec.push(snap(s));if(game.rec.length>260)game.rec.shift();}
   if(s.phase==='kickoff')game.replayDone=false;
   if(!game.demo&&!game.net&&setup.replays&&s.phase==='goal'&&s.phaseT>=0.9&&!game.replayDone){
    game.replayDone=true;game.replay={frames:game.rec.slice(-200),t:0,age:0,caption:game.goalCaption||''};$('banner').hidden=true;acc=0;break;
   }
   if(s.phase==='end'){if(game.demo){startDemo();}else if(s.needPens){const g0=game;setTimeout(()=>{if(game===g0&&!game.pens&&!game.pensResult)startPens();},900);}else{setTimeout(showEnd,600);}break;}
  }
  if(acc>SIM.DT*6)acc=0;
 }
 if(game&&game.net&&game.net.host&&NET.sala)netHostPublish();
 if(game&&!game.demo){$('hint').hidden=!!game.replay;if(game.state.phase==='play'&&$('bannerBig').textContent==='SAQUE'&&!$('banner').hidden){$('banner').hidden=true;game.bannerT=0;}updateHUD();if(game.bannerT>0){game.bannerT-=dt;if(game.bannerT<=0)$('banner').hidden=true;}}
 render(dt);
}

/* ===================== TORNEOS =====================
   Formatos adaptados a partidos cortos (8 equipos cada uno):
   · Mundial: 2 grupos de 4 (todos contra todos) → semifinales → final.
   · Champions: fase liga (3 partidos por equipo, tabla única) → semis (1°-4°, 2°-3°) → final.
   · Libertadores: 2 grupos de 4 → semifinales ida y vuelta (si el global empata, penales) → final única.
   En las eliminatorias, si hay empate se define por penales.
   Los partidos entre equipos de la CPU se juegan de verdad con el mismo motor, sin pantalla y en tiempo acelerado. */
const TOURS={
 lib:{name:'Copa Libertadores',cats:['arg','sud'],desc:'8 equipos (4 argentinos y 4 brasileños) · 2 grupos de 4 · semifinales ida y vuelta · final única',groups:true,twoLegs:true},
 ucl:{name:'Champions League',cats:['pre','lal','ser','eur'],desc:'8 clubes europeos · fase liga: 3 partidos cada uno en tabla única · semifinales (1° vs 4°, 2° vs 3°) · final',groups:false},
 wc:{name:'Mundial',cats:['sel'],desc:'8 selecciones · 2 grupos de 4, pasan los dos primeros · semifinales cruzadas · final',groups:true}
};
const TOUR_LS='picadito-tour-v1';
let tour=null;
try{tour=JSON.parse(localStorage.getItem(TOUR_LS)||'null');}catch(e){tour=null;}
function saveTour(){try{if(tour)localStorage.setItem(TOUR_LS,JSON.stringify(tour));else localStorage.removeItem(TOUR_LS);}catch(e){}}
function rng(seed){let x=(seed>>>0)||1;return()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/4294967296);}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const mk=(a,b,o)=>Object.assign({a,b,res:null},o||{});

function newTour(type,userId,kit,player){
 const T=TOURS[type],seed=(Date.now()%2147483647)|0,r=rng(seed);
 const pool=TEAMS.filter(t=>T.cats.includes(t.cat)&&t.id!==userId).map(t=>t.id);
 let others;
 if(type==='lib'){
  const uArg=teamOf(userId).cat==='arg';
  const arg=shuffle(pool.filter(id=>teamOf(id).cat==='arg'),r),sud=shuffle(pool.filter(id=>teamOf(id).cat==='sud'),r);
  others=[...arg.slice(0,uArg?3:4),...sud.slice(0,uArg?4:3)];
 }else others=shuffle(pool,r).slice(0,7);
 const teams=shuffle([userId,...others],r);
 const t={type,seed,user:userId,kit:kit||'auto',player:player||0,teams,rounds:[],ri:0,champion:null,out:null};
 if(T.groups){
  t.groups=[teams.slice(0,4),teams.slice(4,8)];
  const P=[[0,1,2,3],[0,2,1,3],[0,3,1,2]];
  for(let k=0;k<3;k++){const ms=[];for(const g of t.groups){const p=P[k];ms.push(mk(g[p[0]],g[p[1]],{draw:true}),mk(g[p[2]],g[p[3]],{draw:true}));}
   t.rounds.push({name:'Fase de grupos · Fecha '+(k+1)+' de 3',stage:'group',matches:ms});}
 }else{
  const arr=teams.slice();
  for(let k=0;k<3;k++){const ms=[];for(let i=0;i<4;i++)ms.push(mk(arr[i],arr[7-i],{draw:true}));
   t.rounds.push({name:'Fase liga · Fecha '+(k+1)+' de 3',stage:'group',matches:ms});arr.splice(1,0,arr.pop());}
 }
 return t;
}
function standings(t,ids){
 const row={};for(const id of ids)row[id]={id,pj:0,g:0,e:0,p:0,gf:0,gc:0,pts:0};
 for(const rd of t.rounds){if(rd.stage!=='group')continue;for(const m of rd.matches){
  if(!m.res||!row[m.a]||!row[m.b])continue;const[x,y]=m.res,A=row[m.a],B=row[m.b];
  A.pj++;B.pj++;A.gf+=x;A.gc+=y;B.gf+=y;B.gc+=x;
  if(x>y){A.g++;B.p++;A.pts+=3;}else if(x<y){B.g++;A.p++;B.pts+=3;}else{A.e++;B.e++;A.pts++;B.pts++;}
 }}
 return Object.values(row).sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf||t.teams.indexOf(a.id)-t.teams.indexOf(b.id));
}
// global de una serie de ida y vuelta, visto desde el local de la vuelta
function aggFor(t,m){
 if(!m.leg2)return null;const ida=t.rounds[m.idaRound].matches[m.idaIdx];
 return ida.res?[ida.res[1],ida.res[0]]:[0,0];
}
function winnerOf(t,m){
 if(!m.res)return null;
 let a=m.res[0],b=m.res[1];
 if(m.leg2){const g=aggFor(t,m);a+=g[0];b+=g[1];}
 if(a===b&&m.pens)return m.pens[0]>m.pens[1]?m.a:m.b;
 return a>b?m.a:m.b;
}
// Avanza el torneo cuando la fecha actual está completa: arma semifinales, final o corona al campeón.
function advanceTour(t){
 const rd=t.rounds[t.ri];if(!rd||rd.matches.some(m=>!m.res))return false;
 const T=TOURS[t.type];
 if(t.ri<t.rounds.length-1){t.ri++;return true;}
 if(rd.stage==='group'){
  let pairs;
  if(T.groups){const A=standings(t,t.groups[0]),B=standings(t,t.groups[1]);pairs=[[A[0].id,B[1].id],[B[0].id,A[1].id]];}
  else{const S=standings(t,t.teams);pairs=[[S[0].id,S[3].id],[S[1].id,S[2].id]];}
  const q=pairs.flat();if(!q.includes(t.user)&&!t.out)t.out=T.groups?'en la fase de grupos':'en la fase liga';
  if(T.twoLegs){
   const ida=t.rounds.length;
   t.rounds.push({name:'Semifinal · Ida',stage:'semi1',matches:pairs.map(([hi,lo])=>mk(lo,hi,{draw:true}))});
   t.rounds.push({name:'Semifinal · Vuelta',stage:'semi2',matches:pairs.map(([hi,lo],i)=>mk(hi,lo,{leg2:true,idaRound:ida,idaIdx:i}))});
  }else t.rounds.push({name:'Semifinales',stage:'semi',matches:pairs.map(([a,b])=>mk(a,b))});
 }else if(rd.stage==='semi'||rd.stage==='semi2'){
  const fin=rd.matches.map(m=>winnerOf(t,m));
  if(!fin.includes(t.user)&&!t.out)t.out='en semifinales';
  t.rounds.push({name:'Final',stage:'final',matches:[mk(fin[0],fin[1])]});
 }else if(rd.stage==='final'){
  t.champion=winnerOf(t,rd.matches[0]);
  if(t.champion!==t.user&&!t.out)t.out='en la final';
  return false;
 }
 t.ri++;return true;
}
function userMatch(t){const rd=t.rounds[t.ri];if(!rd||t.champion)return null;const i=rd.matches.findIndex(m=>m.a===t.user||m.b===t.user);return i<0?null:{m:rd.matches[i],i};}
function teamRating(t){const top=t.players.map(p=>p.st.reduce((a,b)=>a+b,0)/5).sort((a,b)=>b-a).slice(0,3);return top.reduce((a,b)=>a+b,0)/top.length;}
// Partido CPU vs CPU con el motor real: sin pantalla, 1 vs 1, 90 segundos de juego.
function simMatch(t,m,k){
 const r=rng(t.seed+k*7919);
 const lu=id=>{const tm=teamOf(id),off=Math.floor(r()*tm.players.length);return[{data:tm.players[off%tm.players.length]},{data:tm.gk,gk:true}];};
 const g=m.leg2?aggFor(t,m):null;
 const s=SIM.createMatch({format:1,duration:90,cap:0,equal:false,lineups:[lu(m.a),lu(m.b)],kickoffTeam:r()<0.5?0:1,allowDraw:!!m.draw,penalties:!m.draw,agg:g||[0,0]});
 const diff=id=>{const v=teamRating(teamOf(id));return v>=84?'hard':v>=80?'normal':'easy';};
 const dA=diff(m.a),dB=diff(m.b);
 let n=0;
 while(s.phase!=='end'&&n<60*210){
  const inp=s.players.map(p=>p.role==='gk'?AI.keeper(s,p,'normal'):AI.field(s,p,p.team?dB:dA));
  SIM.step(s,inp);s.events.length=0;n++;
 }
 // empate en eliminatoria: tanda de penales con la misma mecánica que jugás vos
 if(s.needPens)m.pens=PEN.autoShootout(teamOf(m.a),teamOf(m.b),r);
 return[s.score[0],s.score[1]];
}
// Juega todo lo pendiente que no sea del usuario y avanza hasta el próximo partido suyo (o el final).
function progressTour(t){
 let guard=0;
 while(!t.champion&&guard++<20){
  const rd=t.rounds[t.ri];
  rd.matches.forEach((m,i)=>{if(!m.res&&(m.a!==t.user&&m.b!==t.user||t.out))m.res=simMatch(t,m,t.ri*10+i);});
  if(rd.matches.some(m=>!m.res))break;
  if(!advanceTour(t))break;
 }
 saveTour();
}
function recordUserResult(t,tm,score,pens){
 const m=t.rounds[tm.ri].matches[tm.mi];if(m.res)return;
 m.res=tm.swapped?[score[1],score[0]]:[score[0],score[1]];
 if(pens)m.pens=tm.swapped?[pens[1],pens[0]]:[pens[0],pens[1]];
 saveTour();
}

/* ---------- pantalla del torneo ---------- */
function chip(id,kit){const t=teamOf(id);const k=kit||t.kit;return`<span class="tchip" style="background:${k.p};border-color:${k.s===k.p?k.shorts:k.s}"></span>`;}
function tname(id,cls){const t=teamOf(id);return`<span class="${id===tour.user?'me ':''}${cls||''}">${t.name}</span>`;}
function resTxt(m){if(!m.res)return'<span class="vs">vs</span>';return`<b>${m.res[0]} - ${m.res[1]}${m.pens?` <small>(pen ${m.pens[0]}-${m.pens[1]})</small>`:''}</b>`;}
function tableHTML(rows,title,qual){
 return`<div class="ttable">${title?`<p class="label">${title}</p>`:''}<table><thead><tr><th></th><th class="l">Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>DG</th><th>Pts</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i<qual?'q':''}${r.id===tour.user?' meRow':''}"><td>${i+1}</td><td class="l">${chip(r.id)}${teamOf(r.id).name}</td><td>${r.pj}</td><td>${r.g}</td><td>${r.e}</td><td>${r.p}</td><td>${r.gf-r.gc>0?'+':''}${r.gf-r.gc}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table></div>`;
}
let abandonArmed=false;
function showTour(){
 if(!tour){showScreen('menu');renderMenu();return;}
 if(!game||!game.demo)startDemo();
 progressTour(tour);
 const T=TOURS[tour.type],u=userMatch(tour);
 $('tourTitle').textContent=T.name.toUpperCase();
 const rd=tour.rounds[tour.ri];
 $('tourStage').textContent=tour.champion?'Torneo terminado':(rd?rd.name:'');
 // próximo partido / campeón / eliminado
 let next='';
 if(tour.champion){
  const me=tour.champion===tour.user;
  next=`<p class="label">${me?'¡Lo ganaste!':'Campeón'}</p><div class="champ">${chip(tour.champion)}<span>${teamOf(tour.champion).name}</span></div>
   <p class="small-note">${me?`¡${T.name} para ${teamOf(tour.user).name}!`:`Quedaste afuera ${tour.out}.`}</p>
   <button class="play" id="btnTourNew">NUEVO TORNEO</button>`;
 }else if(u){
  const m=u.m,rival=m.a===tour.user?m.b:m.a,g=m.leg2?aggFor(tour,m):null;
  const gTxt=g?`<p class="small-note">Global de la ida: ${teamOf(m.a).abbr} ${g[0]} - ${g[1]} ${teamOf(m.b).abbr}. Si el global empata, penales.</p>`:'';
  const rule=m.draw?'Puede terminar empatado.':m.leg2?'':'Si empatan, penales.';
  next=`<p class="label">Tu próximo partido · ${rd.name}</p>
   <div class="nextm"><div>${chip(m.a)}${tname(m.a)}</div><span class="vs">vs</span><div>${chip(m.b)}${tname(m.b)}</div></div>
   ${gTxt}<p class="small-note">${rule}</p>
   <p class="label">Tu camiseta</p><div class="seg" id="tourKit"></div>
   <button class="play" id="btnTourPlay">JUGAR PARTIDO</button>
   <div class="row2"><button class="btn" id="btnTourSim">Simular mi partido</button><button class="btn" id="btnTourQuit">${abandonArmed?'¿Seguro? Tocá de nuevo':'Abandonar torneo'}</button></div>`;
 }else{
  next=`<p class="label">Quedaste afuera ${tour.out||''}</p><p class="small-note">Podés ver cómo termina el torneo.</p>
   <button class="play" id="btnTourRest">SIMULAR HASTA EL FINAL</button><button class="btn" id="btnTourNew2">Nuevo torneo</button>`;
 }
 $('tourNext').innerHTML=next;
 // tablas
 let tables='';
 if(TOURS[tour.type].groups)tables=tableHTML(standings(tour,tour.groups[0]),'Grupo A',2)+tableHTML(standings(tour,tour.groups[1]),'Grupo B',2);
 else tables=tableHTML(standings(tour,tour.teams),'Tabla de la fase liga',4);
 $('tourTables').innerHTML=tables;
 // fixture: eliminatorias y resultados por fecha
 let fx='';
 for(let i=tour.rounds.length-1;i>=0;i--){
  const r=tour.rounds[i];if(i>tour.ri&&!tour.champion)continue;
  fx+=`<div class="fround"><p class="label">${r.name}</p>${r.matches.map(m=>{const g=m.leg2&&m.res?aggFor(tour,m):null;
   return`<div class="fm${m.a===tour.user||m.b===tour.user?' meRow':''}"><span class="l">${tname(m.a)}${chip(m.a)}</span>${resTxt(m)}<span class="r">${chip(m.b)}${tname(m.b)}</span>${g?`<em>global ${m.res[0]+g[0]}-${m.res[1]+g[1]}</em>`:''}</div>`;}).join('')}</div>`;
 }
 $('tourFixture').innerHTML=fx;
 showScreen('tour');
 const on=(id,f)=>{const el=$(id);if(el)el.onclick=f;};
 if($('tourKit'))seg($('tourKit'),[['auto','Auto'],['home','Titular'],['away','Suplente']],()=>tour.kit,v=>{tour.kit=v;saveTour();showTour();});
 on('btnTourPlay',()=>{abandonArmed=false;startTourMatch();});
 on('btnTourSim',()=>{abandonArmed=false;const m=userMatch(tour);if(m){m.m.res=simMatch(tour,m.m,tour.ri*10+m.i);saveTour();}showTour();});
 on('btnTourQuit',()=>{if(!abandonArmed){abandonArmed=true;showTour();return;}abandonArmed=false;tour=null;saveTour();showScreen('menu');renderMenu();});
 on('btnTourRest',()=>{progressTour(tour);showTour();});
 const toMenuNew=()=>{tour=null;saveTour();setup.mode='torneo';showScreen('menu');renderMenu();};
 on('btnTourNew',toMenuNew);on('btnTourNew2',toMenuNew);
 if(tour.champion&&tour.champion===tour.user&&!tour.celebrated){tour.celebrated=true;saveTour();if(game){fx.confetti.length=0;spawnConfetti(teamOf(tour.user).kit);}}
}
function startTourMatch(){
 const u=userMatch(tour);if(!u)return;
 const m=u.m,swapped=m.b===tour.user,rival=swapped?m.a:m.b;
 let agg=m.leg2?aggFor(tour,m):null;if(agg&&swapped)agg=[agg[1],agg[0]];
 const cfg={format:setup.format,duration:setup.duration,cap:setup.cap,equal:setup.equal,diff:setup.diff,replays:setup.replays,
  sides:[{team:tour.user,player:tour.player||0,ctrl:'P1',kit:tour.kit},{team:rival,player:0,ctrl:'CPU',kit:'auto'}],
  allowDraw:!!m.draw,penalties:!m.draw,tour:true,agg:agg||null};
 startMatch(cfg,{ri:tour.ri,mi:u.i,swapped,stage:tour.rounds[tour.ri].name});
}

/* ---------- menú ---------- */
function seg(el,opts,get,set,cls){
 el.innerHTML='';
 for(const[v,label]of opts){const b=document.createElement('button');b.type='button';b.textContent=label;if(cls)b.className=cls(v);b.setAttribute('aria-pressed',String(get()===v));b.onclick=()=>{set(v);save();renderMenu();};el.appendChild(b);}
}
function sideCard(i){
 const el=$('side'+i),tmode=setup.mode==='torneo';
 if(tmode&&i===1){tourInfo(el);return;}
 const sd=tmode?setup.tsel:setup.sides[i];
 const cats=tmode?CATS.filter(c=>TOURS[setup.tourType].cats.includes(c.id)):CATS;
 if(!cats.some(c=>c.id===teamOf(sd.team).cat)){sd.team=TEAMS.find(x=>x.cat===cats[0].id).id;sd.player=0;}
 const t=teamOf(sd.team);
 const inCat=TEAMS.filter(x=>x.cat===t.cat),ci=inCat.indexOf(t);
 if(sd.player>=t.players.length||(sd.player===-1&&setup.format<2&&!tmode))sd.player=0;
 const isGK=sd.player===-1,pl=isGK?Object.assign({},t.gk,{st:null}):t.players[sd.player];
 const nOpt=t.players.length+((tmode||setup.format>=2)?1:0),optIdx=isGK?t.players.length:sd.player;
 const other=tmode?sd:setup.sides[1-i];
 const kit=tmode?(sd.kit==='away'?t.alt:t.kit):(i===0?resolveKits(t,teamOf(other.team),sd.kit,other.kit):resolveKits(teamOf(other.team),t,other.kit,sd.kit))[i];
 const names=['VEL','ACE','TIR','CON','FUE'];
 el.innerHTML=`
  <div class="side-head"><span class="side-name">${tmode?'TU EQUIPO':i===0?'LOCAL':'VISITANTE'}</span><div class="seg" id="ctrl${i}"></div></div>
  <select class="cat" id="cat${i}" aria-label="Categoría">${cats.map(c=>`<option value="${c.id}"${c.id===t.cat?' selected':''}>${c.name} (${TEAMS.filter(x=>x.cat===c.id).length})</option>`).join('')}</select>
  <div class="picker"><button type="button" id="tp${i}" aria-label="Equipo anterior">◀</button><div class="val" id="tn${i}">${t.name}<span class="count">${ci+1}/${inCat.length}</span></div><button type="button" id="tn2${i}" aria-label="Equipo siguiente">▶</button></div>
  <div class="kit-stage"><canvas id="kit${i}" width="64" height="36"></canvas></div>
  ${i===0||tmode?`<p class="small-note stadium-note">Local en ${stadiumOf(t).n.split(' ').map(w=>w.charAt(0)+w.slice(1).toLowerCase()).join(' ')}</p>`:''}
  <div class="seg kitsel" id="kitsel${i}"></div>
  <p class="label">${!tmode&&sd.ctrl==='CPU'?'Capitán (CPU)':'Tu jugador'}</p>
  <div class="picker"><button type="button" id="pp${i}" aria-label="Jugador anterior">◀</button><div class="val">${isGK?'🧤 ':''}${pl.n} <span style="color:var(--muted)">#${pl.num}${isGK?' · arquero':''}</span></div><button type="button" id="pn${i}" aria-label="Jugador siguiente">▶</button></div>
  <div class="stats">${isGK?[['REF',pl.refl],['ALC',pl.reach]].map(([k,v])=>`<span>${k}</span><span class="bar"><i style="width:${(v-40)/60*100}%"></i></span><span class="n">${setup.equal?80:v}</span>`).join(''):pl.st.map((v,j)=>`<span>${names[j]}</span><span class="bar"><i style="width:${(v-40)/60*100}%"></i></span><span class="n">${setup.equal?78:v}</span>`).join('')}</div>
  ${isGK?'<p class="small-note">Atajás vos: E agarra la pelota con la mano (solo dentro del área) y Q es la estirada.</p>':''}`;
 if(tmode)$('ctrl'+i).innerHTML='<span class="small-note">Jugás con P1</span>';else seg($('ctrl'+i),[['P1','P1'],['P2','P2'],['CPU','CPU']],()=>sd.ctrl,v=>{if(v!=='CPU'&&other.ctrl===v)other.ctrl=v==='P1'?'P2':'P1';sd.ctrl=v;},v=>v==='P1'?'p1':v==='P2'?'p2':'');
 const mod=(a,n)=>(a%n+n)%n;
 seg($('kitsel'+i),[['auto','Auto'],['home','Titular'],['away','Suplente']],()=>sd.kit||'auto',v=>sd.kit=v);
 $('cat'+i).onchange=e=>{sd.team=TEAMS.find(x=>x.cat===e.target.value).id;sd.player=0;save();renderMenu();$('cat'+i).focus();};
 $('tp'+i).onclick=()=>{sd.team=inCat[mod(ci-1,inCat.length)].id;sd.player=0;save();renderMenu();};
 $('tn2'+i).onclick=()=>{sd.team=inCat[mod(ci+1,inCat.length)].id;sd.player=0;save();renderMenu();};
 const setOpt=k=>{sd.player=k===t.players.length?-1:k;save();renderMenu();};
 $('pp'+i).onclick=()=>setOpt(mod(optIdx-1,nOpt));
 $('pn'+i).onclick=()=>setOpt(mod(optIdx+1,nOpt));
 const kc=$('kit'+i).getContext('2d');kc.clearRect(0,0,64,36);
 const base={kit:isGK?gkKit(t):kit,skin:SKIN[pl.skin|0],hair:pl.hair,phase:0,moving:false,num:pl.num,gk:isGK,name:pl.n};
 drawFootballer(kc,14,33,Object.assign({view:'front'},base));
 drawFootballer(kc,32,33,Object.assign({view:'back'},base));
 drawFootballer(kc,50,33,Object.assign({view:'side',flip:false},base));
}
function tourInfo(el){
 const T=TOURS[setup.tourType];
 el.innerHTML=`<div class="tour-info"><p class="side-name">${T.name.toUpperCase()}</p><p class="big">Formato</p><p>${T.desc}.</p>
  <p class="big">Cómo se juega</p><p>Vos jugás tus partidos con P1 y la CPU juega el resto con el mismo motor del juego, así que los resultados salen de partidos de verdad. En la fase de grupos puede haber empate; en las eliminatorias, penales en primera persona.</p>
  <p class="big">Rivales</p><p>Se sortean entre ${CATS.filter(c=>T.cats.includes(c.id)).map(c=>c.name).join(', ')}.</p></div>`;
}
function renderMenu(){
 seg($('optMode'),[['amistoso','PARTIDO AMISTOSO'],['torneo','TORNEO'],['online','ONLINE']],()=>setup.mode,v=>setup.mode=v);
 const onl=setup.mode==='online';$('online').hidden=!onl;$('mgrid').hidden=onl;document.querySelector('.panel.controls').hidden=onl;
 if(onl){netInit();renderOnline();}
 const tm=setup.mode==='torneo';
 $('tourPick').hidden=!tm;
 seg($('optTour'),[['lib','Libertadores'],['ucl','Champions'],['wc','Mundial']],()=>setup.tourType,v=>setup.tourType=v);
 $('btnPlay').textContent=tm?(tour&&!tour.champion?'NUEVO TORNEO':'EMPEZAR TORNEO'):'JUGAR';
 const cont=$('btnContTour');cont.hidden=!tour;
 if(tour){cont.textContent=(tour.champion?'VER ':'CONTINUAR ')+TOURS[tour.type].name.toUpperCase();cont.onclick=()=>showTour();}
 $('tiePick').hidden=tm;
 seg($('optTie'),[['golden','Gol de oro'],['pens','Penales'],['draw','Empate']],()=>setup.tie||'golden',v=>setup.tie=v);
 seg($('optFormat'),[[1,'1 vs 1'],[2,'2 vs 2'],[3,'3 vs 3']],()=>setup.format,v=>setup.format=v);
 seg($('optDur'),[[120,'2 min'],[180,'3 min'],[240,'4 min'],[300,'5 min']],()=>setup.duration,v=>setup.duration=v);
 seg($('optCap'),[[3,'3 goles'],[5,'5 goles'],[0,'sin límite']],()=>setup.cap,v=>setup.cap=v);
 seg($('optStats'),[[false,'Reales (normalizadas)'],[true,'Todos iguales']],()=>setup.equal,v=>setup.equal=v);
 seg($('optReplay'),[[true,'Sí, en cámara lenta'],[false,'No']],()=>setup.replays,v=>setup.replays=v);
 seg($('optDiff'),[['easy','Fácil'],['normal','Normal'],['hard','Difícil']],()=>setup.diff,v=>setup.diff=v);
 sideCard(0);sideCard(1);
}
/* ===================== ONLINE =====================
   Salas con la capacidad "room" del artifact. El anfitrión simula el partido (manda él) y publica,
   unas 30 veces por segundo, una foto compacta del partido en su "presencia". Cada jugador publica
   en la suya sus controles. Nada de esto se guarda: si el anfitrión se va, la sala se termina. */
/* ===================== ONLINE FUERA DE CLAUDE =====================
   Fuera de claude.ai, las salas van por un servidor propio (Cloudflare Workers + Durable Objects, carpeta server/).
   Este cliente imita la capacidad "room" de los artifacts: presencia por jugador, lista de pares y salas con nombre.
   Se manda solo lo que cambió de la presencia (unas 30 veces por segundo como máximo). */
function wsRoomClient(base){
 const me='p'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-3);
 base=String(base).replace(/\/+$/,'');
 function mk(name){
  const peers=new Map();let mine={},chg={},dirty=false,ws=null,open=false,closed=false,retry=0,handlers=[],connH=[],cached=Object.freeze([]);
  const selfPeer=()=>Object.freeze({peer:me,by:null,isMe:true,sameTab:true,kind:'viewer',guest:false,presence:Object.freeze(Object.assign({},mine)),updatedAt:Date.now()});
  const other=(peer,presence)=>Object.freeze({peer,by:null,isMe:false,sameTab:false,kind:'viewer',guest:false,presence:Object.freeze(presence),updatedAt:Date.now()});
  peers.set(me,selfPeer());cached=Object.freeze([...peers.values()]);
  const notify=(joined,left,updated)=>{cached=Object.freeze([...peers.values()]);const ch={peers:cached,joined:joined||[],left:left||[],updated:updated||[]};for(const h of handlers.slice()){try{h(ch);}catch(e){console.error(e);}}};
  const flush=()=>{if(!open||!dirty)return;dirty=false;const p=chg;chg={};try{ws.send(JSON.stringify({t:'p',patch:p}));}catch(e){}};
  const timer=setInterval(flush,33);
  function connect(){
   if(closed)return;
   try{ws=new WebSocket(base+'/room/'+encodeURIComponent(name)+'?peer='+me);}catch(e){setTimeout(connect,2000);return;}
   ws.onopen=()=>{open=true;retry=0;chg=Object.assign({},mine);dirty=true;flush();connH.forEach(h=>h(true));};
   ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data);}catch(e){return;}
    if(m.t==='hello'&&Array.isArray(m.peers)){const left=[];for(const[k,v]of peers)if(k!==me)left.push(v);for(const k of [...peers.keys()])if(k!==me)peers.delete(k);
     const joined=[];for(const q of m.peers){if(!q||q.peer===me)continue;const o=other(String(q.peer),q.presence&&typeof q.presence==='object'?q.presence:{});peers.set(o.peer,o);joined.push(o);}notify(joined,left,[]);}
    else if(m.t==='p'&&m.peer&&m.peer!==me){const cur=peers.get(m.peer),pres=Object.assign({},cur?cur.presence:{});
     if(m.patch&&typeof m.patch==='object')for(const k in m.patch){if(m.patch[k]===null)delete pres[k];else pres[k]=m.patch[k];}
     const o=other(String(m.peer),pres);peers.set(o.peer,o);notify(cur?[]:[o],[],cur?[o]:[]);}
    else if(m.t==='leave'&&m.peer){const q=peers.get(m.peer);if(q&&m.peer!==me){peers.delete(m.peer);notify([],[q],[]);}}};
   ws.onclose=()=>{const was=open;open=false;if(was)connH.forEach(h=>h(false));if(!closed){retry++;setTimeout(connect,Math.min(5000,300*retry));}};
   ws.onerror=()=>{};
  }
  connect();
  const api={name,
   presence(patch){if(!patch||typeof patch!=='object')return Promise.reject({code:'invalid_argument'});
    const next=Object.assign({},mine);for(const k in patch){if(patch[k]===null)delete next[k];else next[k]=patch[k];}
    if(JSON.stringify(next).length>7800)return Promise.reject({code:'invalid_argument',message:'presencia muy grande'});
    mine=next;for(const k in patch)chg[k]=patch[k];dirty=true;peers.set(me,selfPeer());notify([],[],[peers.get(me)]);return Promise.resolve();},
   peers:()=>cached,
   onPeers(h,onErr){handlers.push(h);setTimeout(()=>{if(handlers.includes(h))h({peers:cached,joined:cached,left:[],updated:[]});},0);return()=>{handlers=handlers.filter(x=>x!==h);};},
   connected:()=>open,
   onConnection(h){connH.push(h);setTimeout(()=>h(open),0);return()=>{connH=connH.filter(x=>x!==h);};},
   emit:()=>Promise.reject({code:'not_permitted'}),on:()=>()=>{},
   leave(){closed=true;clearInterval(timer);handlers=[];connH=[];try{ws&&ws.close(1000,'bye');}catch(e){}return Promise.resolve();}};
  return api;
 }
 const lobby=mk('lobby'),rooms={};
 lobby.join=n=>{
  if(typeof n!=='string'||!/^[a-z0-9][a-z0-9_.-]{0,47}$/.test(n))return Promise.reject({code:'invalid_argument'});
  if(rooms[n])return Promise.resolve(rooms[n]);
  if(Object.keys(rooms).length>=16)return Promise.reject({code:'limit_reached'});
  const r=mk(n),lv=r.leave;r.leave=()=>{delete rooms[n];return lv();};rooms[n]=r;return Promise.resolve(r);};
 lobby.standalone=true;
 return lobby;
}

const NET={room:null,user:null,state:'off',sala:null,code:null,host:false,me:null,names:{},lobbyPeers:[],salaPeers:[],
 cfg:null,asg:{},want:{t:-1,k:0},at:0,lastMid:null,inps:{},cnt:{},snaps:[],evSeq:0,evBuf:[],lastEv:0,uid:null,err:'',uiKey:'',pubTick:-1,endPub:false,hostSeen:0,ip:null};
const NEUT=()=>({mx:0,my:0,kick:false,lob:false,sprint:false,slide:false,dive:false,skill:false,sx:0,sy:0,hx:true});
const r2=v=>Math.round((+v||0)*100)/100;
const cleanTxt=(v,n)=>[...String(v==null?'':v)].filter(ch=>{const c=ch.codePointAt(0);return!(c<32||(c>=127&&c<160)||(c>=0x200b&&c<=0x200f)||(c>=0x2028&&c<=0x202e)||(c>=0x2060&&c<=0x206f));}).join('').trim().slice(0,n||18);
const escH=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function myNick(){try{return cleanTxt(localStorage.getItem('picadito-nick')||'');}catch(e){return'';}}
function setNick(v){try{localStorage.setItem('picadito-nick',cleanTxt(v));}catch(e){}}
function nameOf(p){if(!p)return'Jugador';return(p.by&&NET.names[p.by])||cleanTxt(p.presence&&p.presence.nick)||'Jugador';}
function peerById(id){return NET.salaPeers.find(p=>p.peer===id);}
function hostPeer(){const hs=NET.salaPeers.filter(p=>p.presence&&p.presence.host===1);if(!hs.length)return null;return hs.sort((a,b)=>(a.presence.since||0)-(b.presence.since||0))[0];}
async function netInit(){
 if(NET.state!=='off')return;
 NET.state='connecting';renderOnline(true);
 let room=null,user=null;
 try{if(window.claude&&window.claude.use){[room,user]=await Promise.all([window.claude.use('room'),window.claude.use('user')]);}}catch(e){room=null;}
 if(!room&&window.PICADITO_SERVER){room=wsRoomClient(window.PICADITO_SERVER);user=null;}
 NET.user=user;NET.standalone=!!(room&&room.standalone);
 if(!room){NET.state='none';renderOnline(true);return;}
 if(NET.standalone)room.onConnection(()=>renderOnline(true));
 NET.room=room;NET.state='lobby';
 room.onPeers(ch=>{NET.lobbyPeers=ch.peers;resolveNames(ch.peers);renderOnline();},e=>{if(e&&e.code==='not_granted'){NET.state='none';renderOnline(true);}});
 try{NET.uid=user&&user.id?await user.id():null;}catch(e){NET.uid=null;}
 renderOnline(true);
}
async function resolveNames(peers){
 if(!NET.user||!NET.user.profiles)return;
 const ids=[...new Set(peers.map(p=>p.by).filter(Boolean))].filter(id=>!(id in NET.names));
 if(!ids.length)return;
 for(const id of ids)NET.names[id]='';
 try{const ps=await NET.user.profiles(ids);for(const id of ids)NET.names[id]=cleanTxt(ps&&ps[id]&&ps[id].name,24);}catch(e){}
 renderOnline(true);netLabels();
}
function randCode(){const a='abcdefghjkmnpqrstuvwxyz23456789';let s='';for(let i=0;i<4;i++)s+=a[Math.floor(Math.random()*a.length)];return s;}
async function joinSala(code,host){
 code=cleanTxt(code,8).toLowerCase().replace(/[^a-z0-9]/g,'');
 if(!code){NET.err='Escribí el código de la sala.';renderOnline(true);return;}
 if(NET.sala)await leaveSala();
 NET.err='';
 let sala;try{sala=await NET.room.join('pp-'+code);}catch(e){NET.err='No se pudo entrar a la sala ('+((e&&e.code)||'error')+'). Probá de nuevo.';renderOnline(true);return;}
 Object.assign(NET,{sala,code,host,state:'sala',at:Date.now(),lastMid:null,asg:{},want:{t:-1,k:0},snaps:[],hostSeen:performance.now()});
 if(host){
  const s0=setup.sides;
  NET.cfg={a:s0[0].team,b:s0[1].team===s0[0].team?TEAMS.find(t=>t.id!==s0[0].team).id:s0[1].team,f:Math.max(2,setup.format),d:setup.duration,cap:setup.cap,eq:!!setup.equal};
  NET.want={t:0,k:0};NET.hstate='lobby';NET.mid=0;
 }
 sala.onPeers(ch=>{NET.salaPeers=ch.peers;const me=ch.peers.find(p=>p.isMe&&p.sameTab);if(me)NET.me=me.peer;resolveNames(ch.peers);netOnPeers();},
  e=>{if(NET.sala===sala&&e&&(e.code==='not_permitted'||e.code==='not_granted')){NET.err='Se cortó la conexión con la sala.';leaveSala();}});
 pushMine();renderOnline(true);
}
async function leaveSala(){
 const s=NET.sala;NET.sala=null;NET.salaPeers=[];NET.host=false;NET.code=null;NET.state=NET.room?'lobby':'none';
 if(NET.room)NET.room.presence({sala:null}).catch(()=>{});
 if(s)try{await s.leave();}catch(e){}
 if(game&&game.net){startDemo();showScreen('menu');}
 renderOnline(true);
}
function pushMine(extra){
 if(!NET.sala)return;
 const o={nick:myNick(),want:NET.want,at:NET.at,uid:NET.uid||null};
 if(NET.host)Object.assign(o,{host:1,since:NET.at,cfg:NET.cfg,asg:NET.asg,st:NET.hstate,mid:NET.mid});
 NET.sala.presence(Object.assign(o,extra||{})).catch(()=>{});
 if(NET.host&&NET.room){const humans=Object.keys(NET.asg).length;
  NET.room.presence({sala:{c:NET.code,f:NET.cfg.f,a:NET.cfg.a,b:NET.cfg.b,p:NET.salaPeers.length||1,h:humans,s:NET.hstate==='play'?'jugando':'espera'}}).catch(()=>{});}
}
// ----- lugares: el anfitrión decide quién juega con quién (por orden de llegada) -----
function maxHumans(f){return f+(f>=2?1:0);}
function computeAsg(){
 const c=NET.cfg,asg={},taken=[new Set(),new Set()];
 const ps=NET.salaPeers.filter(p=>p.presence&&p.presence.want).slice().sort((a,b)=>(a.presence.at||0)-(b.presence.at||0)||(a.peer<b.peer?-1:1));
 for(const p of ps){
  const w=p.presence.want,t=w.t;if(t!==0&&t!==1)continue;
  const tm=teamOf(t===0?c.a:c.b),T=taken[t];if(T.size>=maxHumans(c.f))continue;
  const field=[...T].filter(i=>i>=0).length;
  let k=w.k|0;if(k===-1&&c.f<2)k=0;if(k<-1||k>=tm.players.length)k=0;
  if(k>=0&&field>=c.f)k=c.f>=2&&!T.has(-1)?-1:null;
  if(k!=null&&T.has(k)){k=k===-1?null:null;}
  if(k==null){ // lo que quedó libre
   if(field<c.f)k=[...tm.players.keys()].find(i=>!T.has(i));
   if(k==null&&c.f>=2&&!T.has(-1))k=-1;
   if(k==null)continue;}
  T.add(k);asg[p.peer]={t,k};
 }
 return asg;
}
function netOnPeers(){
 const hp=hostPeer();
 if(NET.host){
  // controles de cada jugador
  for(const p of NET.salaPeers)if(!p.isMe||!p.sameTab)NET.inps[p.peer]=p.presence&&p.presence.in||null;
  if(NET.hstate!=='play'){const a=computeAsg();if(JSON.stringify(a)!==JSON.stringify(NET.asg)){NET.asg=a;pushMine();}}
  // alguien se fue en pleno partido: su jugador pasa a la CPU
  if(game&&game.net&&game.net.host)for(const id in game.ctrls){const c=game.ctrls[id];if(c.peer&&c.peer!==NET.me&&!peerById(c.peer)){game.ctrls[id]={type:'ai',diff:'normal'};const pl=game.state.players[id];pl.hgk=false;popup('SE DESCONECTÓ',pl.x,pl.y,'#ff5a4f');}}
  if(NET.room)pushMineLobbyCount();
 }else if(hp){
  const pr=hp.presence;NET.cfg=pr.cfg||NET.cfg;NET.asg=pr.asg||{};
  if(pr.st==='play'&&pr.mid&&pr.mid!==NET.lastMid&&NET.me&&pr.cfg){startNetMatch(pr.cfg,pr.asg||{},pr.mid,false);}
  if(game&&game.net&&!game.net.host&&pr.snap&&pr.snap.m===NET.lastMid){const sn=pr.snap,S=NET.snaps;if(!S.length||sn.k>S[S.length-1].k){S.push(Object.assign({at:performance.now()},sn));if(S.length>24)S.shift();}}
 }
 renderOnline();
}
let lobbyCountT=0;
function pushMineLobbyCount(){const now=performance.now();if(now-lobbyCountT<1500)return;lobbyCountT=now;const n=NET.salaPeers.length;if(n!==NET.lastCount){NET.lastCount=n;pushMine();}}
// ----- partido -----
function startNetMatch(c,asg,mid,host){
 NET.lastMid=mid;NET.snaps=[];NET.lastEv=0;NET.evSeq=0;NET.evBuf=[];NET.cnt={};NET.pubTick=-1;NET.endPub=false;NET.endShown=false;NET.hostSeen=performance.now();
 const humans=[];
 for(const peer in asg){const a=asg[peer],tm=teamOf(a.t===0?c.a:c.b);if(a.k!==-1&&!tm.players[a.k])continue;humans.push({team:a.t,gk:a.k===-1,k:a.k,name:a.k===-1?tm.gk.n:tm.players[a.k].n,peer});}
 const cfg={format:c.f,duration:c.d,cap:c.cap,equal:!!c.eq,diff:'normal',tie:'golden',replays:false,sides:[{team:c.a,player:0,ctrl:'CPU',kit:'auto'},{team:c.b,player:0,ctrl:'CPU',kit:'auto'}]};
 startMatch(cfg,null,{humans,host});
 netLabels();
 const mine=humans.find(h=>h.peer===NET.me);
 $('hint').textContent=(mine?(mine.gk?'Sos el arquero · E agarrar (en el área) · Q estirada · Espacio sacar':'Sos '+mine.name+' · WASD · Espacio patear · E globo · Q barrida'):'Estás mirando')+' · Esc menú · Sala '+NET.code.toUpperCase();
}
function myTeam(){const a=NET.asg&&NET.asg[NET.me];return a?a.t:-1;}
function netLabels(){
 if(!game||!game.net)return;const mt=myTeam();
 for(const id in game.ctrls){const c=game.ctrls[id];if(!c.peer)continue;const p=game.state.players[id];
  c.label=(c.peer===NET.me?'VOS':nameOf(peerById(c.peer)))+(p.role==='gk'?' 🧤':'');
  c.col=c.peer===NET.me?'#3fd8ff':mt<0?(p.team===0?'#ffd24a':'#9be7ff'):p.team===mt?'#7dff4f':'#ff5aa8';}
}
function netInput(peer){
 const r=NET.inps[peer];if(!r||typeof r!=='object')return NEUT();
 const c=Array.isArray(r.c)?r.c.map(v=>v|0):[0,0,0,0];
 let st=NET.cnt[peer];if(!st)st=NET.cnt[peer]={c:c.slice(),hold:[0,0,0,0]};
 const bits=r.b|0,cl=v=>Math.max(-1,Math.min(1,+v||0));
 const o=NEUT();o.mx=cl(r.x);o.my=cl(r.y);const l=Math.hypot(o.mx,o.my);if(l>1){o.mx/=l;o.my/=l;}
 o.sprint=!!(bits&4);
 const nm=['kick','lob','slide','skill'],bt=[1,2,8,0];
 for(let i=0;i<4;i++){if(c[i]!==st.c[i]){if(c[i]>st.c[i])st.hold[i]=i===3?1:2;st.c[i]=c[i];}
  o[nm[i]]=(bt[i]&&!!(bits&bt[i]))||st.hold[i]>0;if(st.hold[i]>0)st.hold[i]--;}
 if(o.skill){o.sx=Math.sign(+r.sx||0);o.sy=Math.sign(+r.sy||0);}
 return o;
}
function netSendInput(){
 if(!NET.sala)return;
 const inp=game.netMenu?NEUT():readHuman(1);
 const P=NET.ip||(NET.ip={c:[0,0,0,0],prev:[false,false,false,false],last:''});
 const arr=[inp.kick,inp.lob,inp.slide,inp.skill];
 for(let i=0;i<4;i++){if(arr[i]&&!P.prev[i])P.c[i]++;P.prev[i]=arr[i];}
 if(inp.skill){P.sx=inp.sx;P.sy=inp.sy;}
 const msg={x:r2(inp.mx),y:r2(inp.my),b:(inp.kick?1:0)|(inp.lob?2:0)|(inp.sprint?4:0)|(inp.slide?8:0),c:P.c.slice(),sx:P.sx||0,sy:P.sy||0};
 const key=JSON.stringify(msg);if(key!==P.last){P.last=key;NET.sala.presence({in:msg}).catch(()=>{});}
}
function netCollect(evs){
 for(const e of evs){const o={};for(const k in e){const v=e[k];if(typeof v==='number')o[k]=r2(v);else if(typeof v==='string')o[k]=v.slice(0,40);else if(typeof v==='boolean')o[k]=v;}
  NET.evBuf.push([++NET.evSeq,o]);}
 while(NET.evBuf.length>12)NET.evBuf.shift();
}
function netSnap(s){
 const b=s.ball;
 const o={m:NET.lastMid,k:s.tick,ph:s.phase,pt:r2(s.phaseT),c:r2(s.clock),g:s.golden?1:0,ot:r2(s.ot),sc:s.score.slice(),kt:s.kickoffTeam,lg:s.lastGoalTeam==null?-1:s.lastGoalTeam,
  b:[r2(b.x),r2(b.y),r2(b.z),r2(b.vx),r2(b.vy),r2(b.vz),b.holder,r2(b.roll)],
  p:s.players.map(p=>[r2(p.x),r2(p.y),r2(p.face),r2(p.run%1000),r2(p.vx),r2(p.vy),p.dive?r2(p.dive.dy||0):null,r2(p.diveT),r2(p.kickAnim),r2(p.slideT),r2(p.slideDx),r2(p.stunT),r2(p.charge),p.charging?1:0,r2(p.stam),p.skill?[p.skill.type,r2(p.skill.t),r2(p.skill.dur),p.skill.burst?1:0]:0,p.kind==='lob'?1:0]),
  e:NET.evBuf.slice()};
 if(s.phase==='end')o.scr=s.scorers.slice(-12).map(x=>({name:String(x.name).slice(0,30),team:x.team,own:!!x.own,t:r2(x.t),golden:!!x.golden}));
 // la presencia entera no puede pasar de 4 KiB
 while(o.e.length&&JSON.stringify(o).length>2900)o.e.shift();
 return o;
}
function netHostPublish(){
 const s=game.state;
 if(s.phase==='end'){if(NET.endPub)return;NET.endPub=true;NET.hstate='end';pushMine({snap:netSnap(s)});return;}
 if(s.tick-NET.pubTick<2)return;NET.pubTick=s.tick;
 NET.sala.presence({snap:netSnap(s)}).catch(()=>{});
}
function netApply(a,b,u){
 const s=game.state,L=(x,y)=>x+(y-x)*u;
 s.tick=b.k;s.phase=b.ph;s.phaseT=b.pt;s.clock=b.c;s.golden=!!b.g;s.ot=b.ot;s.score=b.sc;s.kickoffTeam=b.kt;s.lastGoalTeam=b.lg<0?null:b.lg;
 const A=a.b,B=b.b,bl=Math.hypot(B[0]-A[0],B[1]-A[1])>4?1:u,bb=s.ball;
 bb.x=A[0]+(B[0]-A[0])*bl;bb.y=A[1]+(B[1]-A[1])*bl;bb.z=A[2]+(B[2]-A[2])*bl;bb.vx=B[3];bb.vy=B[4];bb.vz=B[5];bb.holder=B[6];bb.roll=B[7];
 s.players.forEach((p,i)=>{const P=a.p[i],Q=b.p[i];if(!P||!Q)return;const t=Math.hypot(Q[0]-P[0],Q[1]-P[1])>3?1:u;
  p.x=P[0]+(Q[0]-P[0])*t;p.y=P[1]+(Q[1]-P[1])*t;p.face=Q[2];p.run=L(P[3],Q[3]);p.vx=Q[4];p.vy=Q[5];p.dive=Q[6]==null?null:{dy:Q[6]};p.diveT=Q[7];p.kickAnim=Q[8];p.slideT=Q[9];p.slideDx=Q[10];p.stunT=Q[11];
  p.charge=Q[12];p.charging=!!Q[13];p.stam=Q[14];p.skill=Q[15]?{type:Q[15][0],t:Q[15][1],dur:Q[15][2],burst:!!Q[15][3]}:null;p.kind=Q[16]?'lob':'kick';});
}
function netClient(dt){
 netSendInput();
 if(hostPeer())NET.hostSeen=performance.now();
 if(performance.now()-NET.hostSeen>5000&&!NET.endShown){NET.endShown=true;banner('SE CORTÓ','El anfitrión se fue de la sala',3);setTimeout(()=>{if(game&&game.net&&!game.net.host){startDemo();showScreen('menu');setup.mode='online';renderMenu();}},2600);return;}
 const S=NET.snaps;if(!S.length)return;
 const now=performance.now(),last=S[S.length-1];
 const rt=last.k+Math.min(6,(now-last.at)/1000*60)-4;
 let a=S[0],b=S[0];
 for(let i=S.length-1;i>=0;i--){if(S[i].k<=rt){a=S[i];b=S[i+1]||S[i];break;}}
 const u=b.k>a.k?Math.max(0,Math.min(1,(rt-a.k)/(b.k-a.k))):0;
 netApply(a,b,u);
 const s=game.state;
 for(const e of last.e||[])if(Array.isArray(e)&&e[0]>NET.lastEv){NET.lastEv=e[0];if(e[1]&&typeof e[1].t==='string')s.events.push(e[1]);}
 handleEvents();
 if(last.ph==='end'&&!NET.endShown){NET.endShown=true;netApply(last,last,0);s.phase='end';s.scorers=Array.isArray(last.scr)?last.scr:[];setTimeout(()=>{if(game&&game.net)showEnd();},600);}
}
function netStart(){
 if(!NET.host)return;
 NET.asg=computeAsg();NET.mid=(Date.now()%2e9)+1;NET.hstate='play';
 pushMine({snap:null});
 startNetMatch(NET.cfg,NET.asg,NET.mid,true);
}
function netBackToSala(){
 if(NET.host&&NET.hstate!=='lobby'){NET.hstate='lobby';pushMine({snap:null});}
 if(NET.sala)NET.sala.presence({in:null}).catch(()=>{});NET.ip=null;
 startDemo();showScreen('menu');setup.mode='online';renderMenu();
}
// ----- pantalla de salas -----
function teamSelect(id,val){
 return`<select class="cat" id="${id}">${CATS.map(c=>`<optgroup label="${escH(c.name)}">${TEAMS.filter(t=>t.cat===c.id).map(t=>`<option value="${t.id}"${t.id===val?' selected':''}>${escH(t.name)}</option>`).join('')}</optgroup>`).join('')}</select>`;
}
function renderOnline(force){
 const el=$('online');if(!el||setup.mode!=='online'||$('menu').hidden)return;
 const st=NET.state;
 const hp=NET.sala?hostPeer():null;
 const key=JSON.stringify([st,NET.err,NET.code,NET.host,NET.names,NET.cfg,NET.asg,NET.want,
  NET.standalone&&NET.room&&NET.room.connected(),st==='lobby'?NET.lobbyPeers.map(p=>[p.peer,p.by,p.presence.sala]):0,
  NET.sala?NET.salaPeers.map(p=>[p.peer,p.by,p.presence.nick,p.presence.want,p.presence.host,p.presence.st]):0]);
 if(!force&&key===NET.uiKey)return;NET.uiKey=key;
 const nick=myNick();
 const nickRow=`<label class="olab">Tu apodo (se usa si no aparece tu nombre)<input id="onNick" maxlength="18" value="${escH(nick)}" placeholder="Ej: el Pibe"></label>`;
 if(st==='off'||st==='connecting'){el.innerHTML=`<p class="label">Online</p><p class="small-note">Conectando con las salas…</p>`;return;}
 if(st==='none'){el.innerHTML=window.claude?`<p class="label">Online</p><p class="onote">El online funciona en el juego publicado en claude.ai, abierto con tu cuenta. Tus amigos tienen que abrir el mismo link con su cuenta: personas de tu organización o invitadas al artifact. Desde un link público o sin iniciar sesión no se puede conectar.</p>`
  :`<p class="label">Online</p><p class="onote">Esta copia del juego no tiene un servidor de salas configurado. Quien la publicó tiene que poner la dirección del servidor en <b>config.js</b> (los pasos están en el README).</p>`;return;}
 if(st==='lobby'){
  const salas=NET.lobbyPeers.filter(p=>p.presence&&p.presence.sala&&p.presence.sala.c&&!(p.isMe&&p.sameTab));
  el.innerHTML=`<div class="ohead"><p class="label">Online · Salas</p></div>
  <div class="orow">${nickRow}<button class="play osm" id="onCreate">CREAR SALA</button></div>
  <div class="orow"><label class="olab">Entrar con código<input id="onCode" maxlength="6" placeholder="abcd" autocapitalize="off"></label><button class="btn-cont" id="onJoinCode">ENTRAR</button></div>
  ${NET.err?`<p class="oerr">${escH(NET.err)}</p>`:''}${NET.standalone&&!NET.room.connected()?'<p class="oerr">Conectando con el servidor de salas…</p>':''}
  <p class="label" style="margin-top:14px">Salas abiertas</p>
  <div class="olist">${salas.length?salas.map(p=>{const s=p.presence.sala,ta=teamOf(s.a)||TEAMS[0],tb=teamOf(s.b)||TEAMS[1];
   return`<div class="osala"><div><b>${escH(nameOf(p))}</b> <span class="code">${escH(String(s.c).toUpperCase())}</span><br><span class="sub">${chip(ta.id)}${escH(ta.name)} vs ${chip(tb.id)}${escH(tb.name)} · ${s.f|0} vs ${s.f|0} · ${s.p|0} en la sala · ${s.s==='jugando'?'jugando':'esperando'}</span></div><button class="btn-cont" data-join="${escH(s.c)}">ENTRAR</button></div>`;}).join(''):'<p class="small-note">No hay salas abiertas. Creá una y pasales el código a tus amigos.</p>'}</div>
  <p class="onote">${NET.standalone?'Pasales a tus amigos este mismo link: ven las salas abiertas o entran con el código.':'Tus amigos tienen que abrir este mismo link con su cuenta de Claude (personas de tu organización o invitadas al artifact).'}</p>`;
  $('onNick').onchange=e=>{setNick(e.target.value);};
  $('onCreate').onclick=()=>{setNick($('onNick').value);joinSala(randCode(),true);};
  $('onJoinCode').onclick=()=>{setNick($('onNick').value);joinSala($('onCode').value,false);};
  $('onCode').onkeydown=e=>{if(e.key==='Enter')$('onJoinCode').click();};
  el.querySelectorAll('[data-join]').forEach(b=>b.onclick=()=>{setNick($('onNick').value);joinSala(b.dataset.join,false);});
  return;
 }
 // dentro de una sala
 const c=NET.cfg;
 if(!c||!hp&&!NET.host){el.innerHTML=`<div class="ohead"><p class="label">Sala ${escH((NET.code||'').toUpperCase())}</p><button class="btn-cont" id="onLeave">SALIR</button></div><p class="small-note">Buscando al anfitrión de la sala…</p>`;$('onLeave').onclick=()=>leaveSala();return;}
 const who={};for(const peer in NET.asg){const a=NET.asg[peer];who[a.t+':'+a.k]=peer;}
 const myA=NET.asg[NET.me];
 const col=t=>{const tm=teamOf(t===0?c.a:c.b);const kit=game&&game.kits?null:null;
  const rows=[];
  if(c.f>=2)rows.push([-1,'🧤 '+tm.gk.n+' (arquero)']);
  tm.players.forEach((pl,i)=>rows.push([i,pl.n+' #'+pl.num]));
  const humans=Object.values(NET.asg).filter(a=>a.t===t).length;
  return`<div class="oteam"><p class="tname">${chip(tm.id)}${escH(tm.name)} <span class="sub">${t===0?'LOCAL':'VISITANTE'} · ${humans}/${maxHumans(c.f)}</span></p>
   ${rows.map(([k,lab])=>{const peer=who[t+':'+k],me=peer&&peer===NET.me;const p=peer?peerById(peer):null;
    return`<button class="oslot${me?' me':''}${peer&&!me?' taken':''}" data-t="${t}" data-k="${k}"${peer&&!me?' disabled':''}><span>${escH(lab)}</span><b>${peer?escH(me?'VOS':nameOf(p)):''}</b></button>`;}).join('')}</div>`;};
 const watchers=NET.salaPeers.filter(p=>!NET.asg[p.peer]);
 el.innerHTML=`<div class="ohead"><p class="label">Sala <span class="code">${escH(NET.code.toUpperCase())}</span> · ${NET.host?'sos el anfitrión':'anfitrión: '+escH(nameOf(hp))}</p><button class="btn-cont" id="onLeave">SALIR</button></div>
 ${NET.host?`<div class="ocfg"><label class="olab">Local${teamSelect('onA',c.a)}</label><label class="olab">Visitante${teamSelect('onB',c.b)}</label>
  <div><p class="label">Formato</p><div class="seg" id="onF"></div></div><div><p class="label">Duración</p><div class="seg" id="onD"></div></div><div><p class="label">Gana quien llega a</p><div class="seg" id="onCap"></div></div></div>`
  :`<p class="small-note">${escH(teamOf(c.a).name)} vs ${escH(teamOf(c.b).name)} · ${c.f} vs ${c.f} · ${Math.round(c.d/60)} min${c.cap?' · a '+c.cap+' goles':''}</p>`}
 <p class="small-note">Tocá un jugador para elegirlo. ${c.f>=2?'El arquero también se puede elegir: agarrás con E (o AGARRAR) solo dentro del área.':'En 1 vs 1 los arqueros los maneja la CPU.'} Los lugares vacíos los juega la CPU.</p>
 <div class="oteams">${col(0)}${col(1)}</div>
 <div class="orow"><button class="btn-cont" id="onWatch"${myA?'':' disabled'}>SOLO MIRAR</button><span class="sub">Mirando: ${watchers.length?watchers.map(p=>escH(p.peer===NET.me?'vos':nameOf(p))).join(', '):'nadie'}</span></div>
 ${NET.host?`<button class="play" id="onStart">EMPEZAR PARTIDO</button>`:`<p class="onote">${hp&&hp.presence.st==='play'?'Hay un partido en juego: entrás en el próximo.':'Esperando que el anfitrión empiece el partido…'}</p>`}
 <p class="onote">Código para tus amigos: <b class="code">${escH(NET.code.toUpperCase())}</b>. ${NET.host?'Dejá esta pestaña a la vista mientras juegan: el partido corre en tu navegador.':''}</p>`;
 $('onLeave').onclick=()=>leaveSala();
 el.querySelectorAll('.oslot').forEach(b=>b.onclick=()=>{NET.want={t:+b.dataset.t,k:+b.dataset.k};NET.at=Date.now();pushMine();renderOnline(true);});
 $('onWatch').onclick=()=>{NET.want={t:-1,k:0};pushMine();renderOnline(true);};
 if(NET.host){
  const upd=()=>{NET.asg=computeAsg();pushMine();renderOnline(true);};
  $('onA').onchange=e=>{c.a=e.target.value;upd();};$('onB').onchange=e=>{c.b=e.target.value;upd();};
  seg($('onF'),[[1,'1 vs 1'],[2,'2 vs 2'],[3,'3 vs 3']],()=>c.f,v=>{c.f=v;setTimeout(upd);});
  seg($('onD'),[[120,'2 min'],[180,'3 min'],[240,'4 min'],[300,'5 min']],()=>c.d,v=>{c.d=v;setTimeout(upd);});
  seg($('onCap'),[[3,'3 goles'],[5,'5 goles'],[0,'sin límite']],()=>c.cap,v=>{c.cap=v;setTimeout(upd);});
  $('onStart').onclick=()=>netStart();
 }
}

$('btnPlay').onclick=()=>{if(setup.mode==='torneo'){tour=newTour(setup.tourType,setup.tsel.team,setup.tsel.kit,setup.tsel.player);saveTour();save();startDemo();showTour();}else startMatch();};
$('btnResume').onclick=()=>togglePause();
$('btnRestart').onclick=()=>{startMatch(game.cfg,game.tourMatch);};
$('btnMenu').onclick=()=>{if(game&&game.net){netBackToSala();return;}const t=game&&game.tourMatch;startDemo();if(t)showTour();else{showScreen('menu');renderMenu();}};
$('btnRematch').onclick=()=>{if(game&&game.net){if(NET.host)netStart();return;}if(game&&game.tourMatch){startDemo();showTour();}else startMatch();};
$('btnEndMenu').onclick=()=>{if(game&&game.net){netBackToSala();return;}showScreen('menu');renderMenu();startDemo();};
$('btnTourMenu').onclick=()=>{showScreen('menu');renderMenu();};
addEventListener('keydown',e=>{if(e.code==='Enter'&&!$('menu').hidden&&setup.mode!=='online'&&document.activeElement===document.body)startMatch();});
renderMenu();startDemo();last=performance.now();requestAnimationFrame(frame);
screen.addEventListener('pointerdown',()=>{try{window.focus();}catch(e){}});
(function setupTouch(){
 const zone=$('tzone'),joy=$('tjoy'),knob=$('tknob'),R=56;
 const setJoy=(x,y)=>{let dx=x-touch.ox,dy=y-touch.oy;const l=Math.hypot(dx,dy);if(l>R){dx*=R/l;dy*=R/l;}touch.mx=dx/R;touch.my=dy/R;knob.style.transform=`translate(${dx}px,${dy}px)`;};
 zone.addEventListener('pointerdown',e=>{e.preventDefault();if(touch.joyId!==null)return;touch.on=true;touch.joyId=e.pointerId;try{zone.setPointerCapture(e.pointerId);}catch(_){}
  const r=$('app').getBoundingClientRect();touch.ox=e.clientX;touch.oy=e.clientY;joy.style.left=(e.clientX-r.left)+'px';joy.style.top=(e.clientY-r.top)+'px';joy.hidden=false;setJoy(e.clientX,e.clientY);});
 zone.addEventListener('pointermove',e=>{if(e.pointerId!==touch.joyId)return;e.preventDefault();setJoy(e.clientX,e.clientY);});
 const endJoy=e=>{if(e.pointerId!==touch.joyId)return;touch.joyId=null;touch.mx=touch.my=0;joy.hidden=true;knob.style.transform='';};
 zone.addEventListener('pointerup',endJoy);zone.addEventListener('pointercancel',endJoy);zone.addEventListener('lostpointercapture',endJoy);
 document.querySelectorAll('#tbtns .tb').forEach(b=>{const n=b.dataset.b;
  b.addEventListener('pointerdown',e=>{e.preventDefault();touch.on=true;touch.held[n]=true;touch.tap[n]=true;b.classList.add('on');try{b.setPointerCapture(e.pointerId);}catch(_){}
   ac();if(AC&&AC.state==='suspended')AC.resume();});
  const up=e=>{touch.held[n]=false;b.classList.remove('on');};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
  b.addEventListener('contextmenu',e=>e.preventDefault());});
 $('tpause').addEventListener('pointerdown',e=>{e.preventDefault();togglePause();});
 $('touch').addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
 // pantalla completa (si el navegador lo permite) y bloqueo en horizontal
 const fs=$('btnFull');fs.hidden=!(document.fullscreenEnabled&&touch.on);
 fs.onclick=()=>{const el=document.documentElement;if(!el.requestFullscreen)return;el.requestFullscreen().then(()=>{try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{});}catch(_){}}).catch(()=>{});togglePause();};
})();
function updateTouchUI(){
 const playing=!!(game&&!game.demo&&!game.paused&&$('end').hidden&&$('menu').hidden&&$('tour').hidden&&(game.state.phase!=='end'||game.pens));
 const show=touch.on&&playing&&!game.replay;
 const el=$('touch');if(el.hidden===show){el.hidden=!show;document.body.classList.toggle('touching',show);}
 if(!show&&touch.joyId!==null){touch.joyId=null;touch.mx=touch.my=0;$('tjoy').hidden=true;}
 if(!show){for(const n in touch.held)touch.held[n]=false;document.querySelectorAll('#tbtns .tb.on').forEach(b=>b.classList.remove('on'));}
 // en penales la barrida/globo/sprint no se usan
 const pens=!!(game&&game.pens);for(const n of ['lob','slide','sprint','skill']){const b=document.querySelector('.tb-'+n);if(b)b.hidden=pens;}
 // con el arquero, el globo agarra y la barrida es la estirada
 if(show&&!pens){const me=game.state.players.find(q=>game.ctrls[q.id].type==='human'&&game.ctrls[q.id].slot===1),gk=!!(me&&me.role==='gk');
  if(touch.gk!==gk){touch.gk=gk;document.querySelector('.tb-lob').textContent=gk?'AGARRAR':'GLOBO';document.querySelector('.tb-slide').textContent=gk?'ESTIRADA':'BARRIDA';}document.querySelector('.tb-skill').hidden=gk;}
 $('rotate').hidden=!(touch.on&&playing&&innerHeight>innerWidth);
}
// acceso de solo lectura para diagnosticar desde la consola del navegador
window.picadito={get state(){return game&&game.state;},get net(){return NET;},get game(){return game;},get keys(){return[...keys];},get touch(){return touch;},get pens(){return game&&game.pens?{phase:game.pens.phase,res:game.pens.res,cur:game.pens.cur&&{phase:game.pens.cur.phase,cam:game.pens.cur.cam,hs:game.pens.cur.hs,hk:game.pens.cur.hk,result:game.pens.cur.result,dive:game.pens.cur.dive}}:null;}};
}
