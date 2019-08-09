//main javascript that creates the leaflet interactive panels as well as all the funcitonalities on leaflet
//the line chart contained outside of the leaflet panel is created in D3 and is in the linechart.js
//author: Mengyu Liang

//define global variables, especially the map controls
var sliderControl2 = L.control({ position: "bottomleft"} );
var temporalLegend = L.control({ position: "bottomleft" });
var vispanel = L.control({ position: "bottomleft" });
 //container for all overlay legends that situated at the lower right corner

//add the wl stations and icons
var stationIcon=L.icon({
	iconUrl:"assets/waterstation.svg",
	iconSize: 30,
	iconAnchor: [15,15],
	popupAnchor:[0,-20]
});

var simpleIcon=L.icon({
  iconUrl:"assets/star.svg",
  iconSize: 30,
  iconAnchor: [15,15],
  popupAnchor:[0,-20]
});

//define the map layers

	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2U2OWZlciIsImEiOiJjandybXN4cWgwMG1nNDhvMmF2N2F4azY5In0.55ZAujpFej7KZXDoeGwOpg';

	var  streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
		   satellite= L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr});	

	
  var map=L.map('mapid',{
		center:[-19.3,23.1], //specify a map center location when load
		zoom:8, //specify the zoom levels
		layers:[streets]  //intial background
	});

  map.addControl(new L.Control.Fullscreen({
    title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
    }
  }));

  var wlstations=L.layerGroup().addTo(map);

  L.marker([-18.275733,21.787312], {icon: stationIcon}).bindPopup("Mohembo Station").addTo(wlstations).on('click', onClick);
  L.marker([-18.96266,22.373213], {icon: stationIcon}).bindPopup("Guma Station").addTo(wlstations).on('click', onClick);

//wlstations.addTo(map)

//function handels the display of the line chart 
function onClick(e) {
  var div = document.getElementById('linechart');
    if (div.style.display !== 'block') {
        div.style.display = 'block';
    }
    else {
        div.style.display = 'none';
        //map.addControl(faparkrigLegend);
    }
  
      //$("#linechart").toggle("slide");
    
};
	var baseLayers = {		
		"Streets": streets,
		"Satellite": satellite
	};

//pie chart function for popup window
function chartCreate(divid,lcs){
  //console.log(lcs);
  CanvasJS.addColorSet("lcShades",
                [//colorSet Array
                "rgb(255,187,34)",
                "rgb(160,220,0)",
                "rgb(255,255,76)",
                "rgb(0,150,160)",
                "rgb(0, 204,0)",
                "rgb(240,150,255)",
                "rgb(250,0,0)",
                "rgb(0,50,200)",   
                 "rgb(0,0,128)"             
                ]);


  var chart = new CanvasJS.Chart(divid, {
          animationEnabled: true,
          width:300,//in pixels
          height:200,
          //position:relative,
          colorSet: "lcShades",
          
          data: [{
            type: "doughnut",
            startAngle: 120,
            //innerRadius: 60,
            indexLabelFontSize: 12,
            indexLabel: "{label} - #percent%",
            toolTipContent: "<b>{label}:</b> {y} (#percent%)",
            dataPoints: [
              { y: Number(lcs[0].y), label: lcs[0].label  },
              { y: Number(lcs[1].y), label: lcs[1].label },
              { y: Number(lcs[2].y), label: lcs[2].label  },
              { y: Number(lcs[3].y), label: lcs[3].label  },
              { y: Number(lcs[4].y), label: lcs[4].label },
              { y: Number(lcs[5].y), label: lcs[5].label  },
              { y: Number(lcs[6].y), label: lcs[6].label  },
              { y: Number(lcs[7].y), label: lcs[7].label },
              { y: Number(lcs[8].y), label: lcs[8].label  }
             
            ]
            
          }]
        });


  chart.render();
};


//add 30 sites to the map for furthur actions
function onEachFeature(feature, layer) {
      var popupcontent =[];
      //console.log(feature.properties);
      var lcss=[];
     
      for (var prop in feature.properties) {
        if (prop ==="cell" ){
          //console.log(prop);
          popupcontent.push(feature.properties[prop]);
          //lcs.push()
        } else if (prop!=="x"&&prop!=="y"&&prop!="total_px"){
          var lc={
            y:feature.properties[prop],
            label:prop
          };
          // console.log(lc);
          lcss.push(lc);       

        }
      };
      var div_chart = $('<div style="width: 300px; height: 200px;"></div>');
      var div_text = $('<div>'+"Site "+"<b>"+popupcontent+"</b>"+' Land cover composition: </div>');
      
      var div_main = $('<div></div>');
      div_main.append(div_text);
      
      div_main.append(div_chart);
        //layer.bindPopup(popupcontent.join("<br />"));
      layer.bindPopup(div_main[0]);
      //console.log(div_chart);
      chartCreate(div_chart[0],lcss);


};


$.getJSON("data/sites_with_lc.geojson", function(json) {
  //console.log(json);
  //add the 25 points as layer
  
  var sites=L.geoJSON(json, {

      style: function (feature) {
        return feature.properties && feature.properties.style;
      },

      onEachFeature: onEachFeature,

      pointToLayer: function (feature, latlng) {
        //var bounds=L.latLng(latlng).toBounds(10900);
        // console.log(bounds);
        var latmin=L.latLng(latlng).lat-0.05;
        var latmax=L.latLng(latlng).lat+0.05;
        var lngmin=L.latLng(latlng).lng-0.05;
        var lngmax=L.latLng(latlng).lng+0.05;
        
        var bounds=[[latmin,lngmin],[latmax,lngmax]];
        //console.log(bounds);

        var rectangle=L.rectangle(bounds,{color:"#82a7b0",weight:2}).on('click', function(e){
          console.log(e);
            map.setView(e.latlng, 12);

        });

        
        return rectangle;
      }
  }).addTo(map);

});


//add the delta extent in geojson
var geojsonFeature = {"type":"GeometryCollection",
  "properties":{
    "name":"Okavango Delta Extent"
  },
   "geometries": [
  {"type":"Polygon","coordinates":[[[22.964312241609107,-18.549727743598613],[22.98075228300209,-18.55178520264862],[23.027248909118942,-18.56408211962513],[23.085614454962275,-18.60307028504047],[23.10050386169324,-18.625347754116515],[23.104887250437393,-18.628298067316994],[23.105209497262827,-18.628780210307863],[23.11874476317121,-18.644110406258356],[23.12303683942322,-18.6472033757923],[23.134855595844993,-18.660829122976818],[23.165147235492338,-18.709832646754876],[23.2108082465692,-18.741222747953653],[23.295735651260404,-18.799606909077873],[23.354104513881445,-18.83859466116282],[23.364699486871874,-18.854445739908574],[23.389590012380282,-18.871073891441178],[23.39715169607751,-18.872869961780957],[23.41717858384172,-18.875288138360055],[23.430783568737006,-18.878622773536236],[23.440687512890637,-18.881865988694315],[23.443951201439354,-18.88238672747312],[23.457651448415838,-18.88687343466282],[23.459388456945998,-18.88794039957001],[23.462182744044465,-18.888424453238507],[23.474153184114005,-18.89270059610212],[23.483936454781308,-18.89597083485738],[23.495374819657403,-18.89948465092959],[23.495772115654965,-18.89962756237304],[23.495900614946596,-18.89964705284318],[23.50943316970044,-18.903849506341427],[23.509796290326065,-18.90398075135001],[23.509909071272787,-18.903998017430425],[23.523432124813375,-18.908238611027304],[23.52360561129912,-18.908301586904177],[23.523658235307945,-18.908309678740622],[23.537173699670866,-18.912567431482728],[23.564343772135825,-18.921169226997122],[23.57769883334102,-18.925383925224683],[23.59085683185985,-18.929519221822968],[23.60400897891607,-18.933608385247616],[23.652107293909808,-18.939715815083375],[23.665870350945696,-18.939147822906843],[23.66938154578084,-18.939770944159925],[23.673284239528343,-18.938994742308832],[23.71096997436613,-18.942982530209715],[23.72478216623353,-18.945939392125126],[23.734061595093642,-18.94882722662672],[23.73747163024497,-18.94932644091934],[23.740435420454936,-18.949107285104027],[23.74206531390886,-18.948680935206824],[23.75581936248614,-18.947035204002788],[23.777195715618213,-18.945760358664668],[23.82028995211605,-18.95099303670997],[23.82627448453677,-18.95246842664478],[23.852038191996908,-18.960923715449688],[23.91041553852168,-18.999910326196083],[23.94942422943006,-19.05826032571581],[23.96312478639161,-19.12709056211835],[23.949430942067075,-19.195922308760725],[23.91042756641812,-19.254276520700834],[23.906465850689337,-19.256922839058007],[23.90406055321078,-19.260337819349534],[23.896566575277102,-19.267130801443734],[23.889569551323564,-19.27156134826026],[23.869145558882565,-19.28759588437754],[23.844082058056806,-19.327390178784693],[23.831181526966557,-19.382936972749356],[23.833918872042133,-19.384357832721708],[23.8535230939915,-19.39751253302018],[23.85805320787817,-19.400038091793636],[23.87229992867073,-19.410309884789186],[23.89426640820892,-19.428996903418547],[23.93327554004067,-19.48734690596228],[23.946976246650564,-19.556177147915996],[23.945223969774364,-19.58122588981678],[23.944685027393806,-19.585057773248085],[23.932743286540024,-19.62884078481139],[23.893739450506395,-19.68719500299159],[23.81211591360426,-19.804763316384488],[23.777335985681287,-19.858750606636356],[23.76895757120389,-19.86771210096758],[23.766476089352054,-19.871014543472036],[23.766455075140293,-19.87103874714852],[23.766446160515777,-19.87105436233634],[23.75815818486177,-19.882077940732998],[23.746850230410814,-19.897119882933108],[23.730242112536676,-19.916244424350978],[23.727234276389456,-19.91825360520631],[23.725364150266724,-19.92094072205197],[23.718074435774433,-19.927699279915842],[23.717932795695805,-19.92779008597104],[23.71785359038583,-19.927903690594718],[23.713572132054836,-19.931859892871902],[23.71017436974266,-19.935620753336647],[23.701672061849116,-19.945174552242808],[23.692936691576296,-19.955077934192637],[23.683969095029006,-19.965302141244525],[23.67483744938232,-19.975715569983468],[23.674676016647947,-19.97583124015571],[23.67453020761788,-19.976065025884132],[23.66424523519603,-19.987732668219614],[23.662759849572634,-19.98879407794865],[23.661472712404677,-19.990805910568245],[23.652058304281837,-20.00100309612088],[23.651565043117703,-20.001347064116104],[23.65117279626559,-20.00195530405429],[23.64177266185709,-20.011990526912516],[23.633014294992254,-20.02137003723029],[23.62541168076638,-20.029679264218636],[23.618980185439508,-20.036981057808042],[23.613050270976633,-20.04409012071436],[23.606978049061677,-20.051734654117077],[23.606677946885494,-20.05211246328515],[23.59957056918243,-20.061355825152663],[23.59168352832623,-20.071788616824826],[23.5916686353843,-20.071805719933717],[23.591662511098622,-20.071816412337075],[23.583330083507754,-20.082833926974185],[23.58270351166136,-20.083553344615318],[23.58245925581899,-20.08397587166402],[23.574039068004925,-20.094926606455285],[23.572723411941297,-20.096425099432004],[23.572282647854692,-20.097173793987217],[23.563688839307137,-20.10799097412175],[23.559632725835026,-20.112537561856787],[23.55880631809225,-20.11387543784865],[23.549743145881383,-20.124337750350065],[23.54622281604795,-20.126876311315662],[23.543189396522678,-20.131502972936893],[23.525907257893532,-20.149402605920255],[23.524598127867712,-20.150293948845274],[23.52367721040311,-20.151671831669542],[23.465306582327422,-20.190663777204335],[23.396453583713566,-20.20435768929059],[23.260587817600815,-20.26578601857233],[23.248838920344692,-20.27899088682879],[23.248356302236346,-20.27972379904526],[23.238662109428123,-20.289684189824452],[23.23431369996926,-20.29263220305604],[23.23152460710781,-20.296622818026158],[23.221176018078413,-20.30614055872203],[23.220431381441493,-20.306615862009625],[23.220028881963714,-20.30718649642336],[23.215114718027134,-20.311628465031237],[23.212027119562897,-20.31801182938752],[23.211045482800188,-20.31939261630817],[23.187574523300892,-20.359329533223377],[23.179444919911404,-20.370215279160423],[23.162501211859542,-20.389789732977636],[23.162205189798012,-20.389987487192244],[23.162008753811904,-20.3902801863296],[23.152270846822365,-20.399941060124302],[23.152101500319233,-20.400053717816863],[23.14046583212397,-20.410657471415362],[23.12974350455978,-20.419557092040236],[23.127459319268137,-20.42093469181393],[23.122099001416498,-20.42556083943495],[23.110756654315903,-20.43398348059988],[23.109352347045245,-20.434779503209683],[23.107472378846285,-20.43636535443313],[23.100280179705468,-20.44145864760151],[23.08788829259511,-20.451402076615214],[23.08782994384122,-20.45143661141305],[23.087699592692182,-20.45155328390817],[23.086846475529494,-20.452235955083168],[23.068361160290156,-20.463160080653086],[23.056052135549297,-20.472098312521457],[23.054947172634982,-20.472660766477485],[23.054787807979455,-20.472698994349493],[23.054591017977543,-20.472841560731823],[23.03694600303392,-20.481774065417166],[23.030909330423754,-20.48321504159132],[23.024525108875142,-20.487480023501355],[22.95567777641657,-20.501173151369112],[22.88683068854698,-20.48748346845725],[22.828465071838696,-20.448495128246677],[22.796993455714905,-20.40606005239947],[22.791675108496346,-20.396106606992547],[22.78590198658083,-20.38596546737405],[22.776046798395207,-20.365829452642604],[22.775839145046838,-20.36478582146256],[22.775269784276155,-20.363923276778635],[22.770269824123886,-20.351453648770725],[22.75735148839965,-20.28452902353325],[22.75809381658864,-20.26820295584176],[22.759291430514274,-20.2550632279779],[22.763285755284077,-20.238868972016796],[22.766021569300094,-20.220085754611826],[22.769993555080855,-20.206740609738624],[22.775652199036386,-20.190795524548253],[22.775731673164948,-20.1903885120272],[22.780903686124656,-20.177650164746034],[22.78125841860096,-20.17711527281061],[22.781385903526232,-20.176474427932973],[22.782579679363334,-20.08756631748715],[22.76157315903549,-20.062326192043557],[22.753911144507263,-20.0511912034938],[22.704970504706406,-20.03272264070094],[22.620739486898636,-20.028421706055045],[22.530755809003995,-20.05637439081348],[22.471931364167528,-20.10493148952096],[22.4623357251944,-20.11471614769066],[22.461599445598896,-20.115213297590394],[22.46109336838786,-20.115970602850275],[22.45417574853224,-20.12136871664578],[22.426379608223797,-20.1430592303763],[22.414052414779125,-20.150447627394186],[22.394334395654038,-20.160372198118708],[22.39311472458339,-20.16120156771022],[22.37985881145205,-20.166947506398007],[22.378422158028275,-20.16724548721037],[22.37714985352727,-20.16809551709412],[22.30830926224273,-20.1817878480923],[22.287196454304663,-20.180545045118077],[22.273433109500765,-20.17891885851152],[22.166730667462268,-20.161737889126105],[22.086968942496974,-20.147407881262826],[22.03213728184991,-20.087575657604134],[22.02301588401745,-20.079534069279],[22.019966830928844,-20.07526759202362],[22.014786489936615,-20.071806638654586],[21.975792251172336,-20.013454831670618],[21.96340328502048,-19.96624332249201],[21.963335953039227,-19.965687307349068],[21.957945560842344,-19.95356463157179],[21.957473930474922,-19.951343227715725],[21.956125046566832,-19.949324719127677],[21.943953545843154,-19.903838753914805],[21.9397329540418,-19.87100815997639],[21.93961366916235,-19.869622185360697],[21.939342012843092,-19.868661606915495],[21.937206664831102,-19.85530001761715],[21.936359585883352,-19.844632410679253],[21.935514358923193,-19.84111588813499],[21.93514374559737,-19.836435805798217],[21.907169270715816,-19.705811228932827],[21.898833583656025,-19.666888403761735],[21.92083380735028,-19.55679772796418],[21.92177549847505,-19.550983366630295],[21.920373051225152,-19.54393374265905],[21.930727949356996,-19.483787411108736],[21.97684418673967,-19.388476614258877],[21.982868044713683,-19.37734461294535],[22.002449870581287,-19.331325302266308],[22.006087475462444,-19.31824343872731],[22.007761874983675,-19.31338625821487],[22.008007539435933,-19.311806564796743],[22.01214688089808,-19.298820176550976],[22.013399471562956,-19.29539554244187],[22.013517310160427,-19.29469378177204],[22.017965691881287,-19.28182190070173],[22.01836711965382,-19.281180321914352],[22.018538172422858,-19.280190798985952],[22.023110551293964,-19.26736090504786],[22.023514429363104,-19.266722256293296],[22.02368141254488,-19.265782425958548],[22.028396882291617,-19.252931579961057],[22.029624850171707,-19.251009716947287],[22.03012043068131,-19.24842253039093],[22.035177369844416,-19.235707179136348],[22.03749995089361,-19.232177474179597],[22.038349436160214,-19.2282277504104],[22.077953443223965,-19.16050924157805],[22.08689802940697,-19.15011598345712],[22.094322433035916,-19.14474337598925],[22.095081799096153,-19.143645819057983],[22.097358134416684,-19.133091016186253],[22.136351377343914,-19.074738392750962],[22.14765808804224,-19.039313216182403],[22.109762494202364,-18.926874530961303],[22.107084208841883,-18.92309992695055],[22.10258858576915,-18.92010013572716],[22.010004726573946,-18.81944091391726],[21.898547355324116,-18.679324231380143],[21.877608948030474,-18.64146722147127],[21.875229796849368,-18.636529085399783],[21.83182627129663,-18.592302989096964],[21.6873010844433,-18.453061312053702],[21.686492369198458,-18.451851658713682],[21.68316510412348,-18.44382958729912],[21.64553467008718,-18.394360515438336],[21.63115928341796,-18.381453472075112],[21.60744420057119,-18.358760112716148],[21.60091653857391,-18.353776496390736],[21.53518724832009,-18.302623189252234],[21.532494202716023,-18.30051496049138],[21.520909068190637,-18.29144563252761],[21.520488517791318,-18.29120684760406],[21.52698531100009,-18.289993590999927],[21.544038534000038,-18.28678965299987],[21.628477824000072,-18.271183369999918],[21.712710409000067,-18.25557708799998],[21.756141193894805,-18.2474969416381],[21.786050318798104,-18.24193245305333],[21.7971496990001,-18.239867451999913],[21.88148563700011,-18.22415781699995],[21.966028280000074,-18.20855153399991],[22.05026086500007,-18.19284189899993],[22.055794119596918,-18.19181797561394],[22.060598201135484,-18.195663618461058],[22.09450084052169,-18.21887059488588],[22.09464468077471,-18.219085841975378],[22.113139137591457,-18.23891592497273],[22.12197910791854,-18.251658398173237],[22.122638098605716,-18.252019004067957],[22.15939454408925,-18.277640090992744],[22.207602944885657,-18.332653510705494],[22.28327663554024,-18.41189372967594],[22.28383520347862,-18.412579764155144],[22.326029850951528,-18.47042676316173],[22.357149853495102,-18.504083654818153],[22.359120613218888,-18.50716164134698],[22.418032743919696,-18.557792578149066],[22.418807977109427,-18.558952613057965],[22.419918973665528,-18.55970690249543],[22.483652707216635,-18.625363537291854],[22.555160703654778,-18.63116504656623],[22.602401898527216,-18.618774187686274],[22.60369091382761,-18.618618285919144],[22.638039922602424,-18.598488938911657],[22.706881741620702,-18.58479632562393],[22.70992764431099,-18.585402034656937],[22.712732748829747,-18.584891375913493],[22.75989182112083,-18.586424855358352],[22.85680906886462,-18.55684144318815],[22.87198412186702,-18.554576826221037],[22.889235274400924,-18.55012949112804],[22.895608850075746,-18.54941290961051],[22.896658308068236,-18.549229463620854],[22.89920755680335,-18.549008306716143],[22.90107233142822,-18.548798649931527],[22.90263175158527,-18.548711244878994],[22.927636699908746,-18.546541968450185],[22.949985339768,-18.547934742404337],[22.964312241609107,-18.549727743598613]]]}
]};

var deltaStyle={
    
    "color": "#799ea6",
    'fillColor':'none',
    "stroke-dasharray": 5,
    "weight": 4,
    "opacity": 0.5

};

var delta=L.layerGroup();
  L.geoJSON(geojsonFeature,{style:deltaStyle,"stroke-dasharray": 5}).addTo(delta);//.on("click",function(e){console.log(e);map.setView(e.latlng, 12);});


//intilize a global variable for overlay raster imagery bounds
var imageBounds=[[-18.190972222, 21.507], [-20.490496032,23.988797619]];

//add land cover to map as overlay
var lc=L.layerGroup();
  L.imageOverlay('assets/vis/lc_ras.png', imageBounds).addTo(lc);

//add the four kriging results as overlay
var ndvikrig=L.layerGroup();
  L.imageOverlay('assets/vis/ndvi_krig.PNG', imageBounds).setOpacity(1).addTo(ndvikrig);
var ndwikrig=L.layerGroup();
  L.imageOverlay('assets/vis/ndwi_krig.PNG', imageBounds).setOpacity(1).addTo(ndwikrig);
var laikrig=L.layerGroup();
  L.imageOverlay('assets/vis/lai_krig.PNG', imageBounds).setOpacity(1).addTo(laikrig);
var faparkrig=L.layerGroup();
  L.imageOverlay('assets/vis/fapar_krig.PNG', imageBounds).setOpacity(1).addTo(faparkrig);


//initialize the time slider for SWI
var sliderControl = null;

var swiimage=[];


var image1202 = L.imageOverlay('assets/vis/20161202SWI_greenbg.png', imageBounds, {
    time: "2016-12-02",
    opacity: 1
});

var image0401 = L.imageOverlay("assets/vis/20170401SWI_greenbg.png", imageBounds, {
    time: "2017-04-01",
    opacity: 1
});

var image0411 = L.imageOverlay("assets/vis/20170411SWI_greenbg.png", imageBounds, {
    time: "2017-04-11",
    opacity: 1
});

var image0421 = L.imageOverlay("assets/vis/20170421SWI_greenbg.png", imageBounds, {
    time: "2017-04-21",
    opacity: 1
});

var image1107 = L.imageOverlay("assets/vis/20171107SWI_greenbg.png", imageBounds, {
    time: "2017-11-07",
    opacity: 1
});

var image0106 = L.imageOverlay("assets/vis/20180106SWI_greenbg.png", imageBounds, {
    time: "2018-01-06",
    opacity: 1
});

var image0426 = L.imageOverlay("assets/vis/20180426SWI_greenbg.png", imageBounds, {
    time: "2018-04-26",
    opacity: 1
});

var image0516 = L.imageOverlay("assets/vis/20180516SWI_greenbg.png", imageBounds, {
    time: "2018-05-16",
    opacity: 1
});

var image0605 = L.imageOverlay("assets/vis/20180516SWI_greenbg.png", imageBounds, {
    time: "2018-06-05",
    opacity: 1
});

var image1122 = L.imageOverlay("assets/vis/20161122SWI_greenbg.png", imageBounds, {
    time: "2016-11-22",
    opacity: 1
});

swiimage.push(image1122,image1202,image0401,image0411,image0421,image1122,image0106,image0426,image0516,image0605);


//swi sliders defined separately
timelayer = L.layerGroup(swiimage);//([swiimage[0],image1202,image0401,image0411,image0421,image1107,image0106,image0426,image0516,image0605]);
var sliderControl = L.control.sliderControl({
  layer:timelayer,
  position: "topright",
  alwaysShowDate:true
});



//fixing some typos in assets names
//create legends 
 var lcLegend=L.control({position:"topright"});
        lcLegend.onAdd=function(map){
          var src = "assets/vis/lc_legend.png";
          var div = L.DomUtil.create('div', 'infolegend');
          div.style.width = '230px';
          div.style.height = '472px';
          div.style.float = 'right';
          div.style['background-image'] = 'url(' + src + ')';
          return div;
        };
var ndviLegend=L.control({position:"topright"});
        ndviLegend.onAdd=function(map){
          var src = "assets/vis/ndvi_legend.PNG";
          var div = L.DomUtil.create('div', 'infolegend');
          //div.id=infolegend;
          div.style.width = '125px';
          div.style.height = '245px';
          div.style.float = 'right';
          div.style['background-image'] = 'url(' + src + ')';
          //div.style.display="none"
          return div;
        };
var ndwiLegend=L.control({position:"topright"});
        ndwiLegend.onAdd=function(map){
          var src = "assets/vis/ndwi_legend.PNG";
          var div = L.DomUtil.create('div', 'infolegend');
          div.style.width = '125px';
          div.style.height = '245px';
          div.style.float = 'right';
          div.style['background-image'] = 'url(' + src + ')';
          return div;
        };
var laiLegend=L.control({position:"topright"});
      laiLegend.onAdd=function(map){

        var src = "assets/vis/lai_legend.PNG";
        var div = L.DomUtil.create('div', 'infolegend');
        //div.id=infolegend;
        div.style.width = '125px';
        div.style.height = '245px';
        div.style.float = 'right';
        div.style['background-image'] = 'url(' + src + ')';
        //div.style.display="none"
        return div;
      };
var faparLegend=L.control({position:"topright"});
      faparLegend.onAdd=function(map){
        var src = "assets/vis/fapar_legend.PNG";
        var div = L.DomUtil.create('div', 'infolegend');
        //div.id=infolegend;
        div.style.width = '125px';
        div.style.height = '245px';
        div.style.float = 'right';
        div.style['background-image'] = 'url(' + src + ')';
        //div.style.display="none"
        return div;
      };
var swiLegend=L.control({position:"topright"});
      swiLegend.onAdd=function(map){
        var src = "assets/vis/swi_legend.png";
        var div = L.DomUtil.create('div', 'infolegend2');
        //div.id=infolegend;
        div.style.width = '78px';
        div.style.height = '401px';
        div.style.margin = '35px 10px 10px 10px';
        div.style.float = 'right';
        div.style.zIndex=2;
        div.style['background-image'] = 'url(' + src + ')';
        //div.style.display="none"
        return div;
      };

        

//handels turn on and off the legend along with the overlay
map.on('overlayadd', function(eventLayer){
  if (eventLayer.name === 'Soil Water Index'){
    map.removeControl(ndwiLegend);
        map.removeControl(ndviLegend);
        map.removeControl(laiLegend);
        map.removeControl(faparLegend);
        map.removeControl(lcLegend);
      
      sliderControl.addTo(map);
      swiLegend.addTo(map);
      
      sliderControl.startSlider();
        
      
    }; 
    if (eventLayer.name === 'Land cover'){
        
        map.removeControl(ndwiLegend);
        map.removeControl(ndviLegend);
        map.removeControl(laiLegend);
        map.removeControl(faparLegend);
        map.removeControl(swiLegend);
        map.removeControl(sliderControl);
        lcLegend.addTo(map);
    };
    if (eventLayer.name === 'Correlation: SWI&NDVI'){ 
        
        map.removeControl(ndwiLegend);
        map.removeControl(lcLegend);
        map.removeControl(laiLegend);
        map.removeControl(faparLegend);
        map.removeControl(swiLegend);
        map.removeControl(sliderControl);
        ndviLegend.addTo(map);
    };
    if (eventLayer.name === 'Correlation: SWI&NDWI'){
       
        map.removeControl(lcLegend);
        map.removeControl(ndviLegend);
        map.removeControl(laiLegend);
        map.removeControl(faparLegend);
        map.removeControl(swiLegend);
        map.removeControl(sliderControl);
         ndwiLegend.addTo(map);
    };
    if (eventLayer.name==="Correlation: SWI&LAI"){
      
      map.removeControl(ndwiLegend);
        map.removeControl(ndviLegend);
        map.removeControl(lcLegend);
        map.removeControl(faparLegend);
        map.removeControl(swiLegend);
        map.removeControl(sliderControl);
        laiLegend.addTo(map);
    };
    if (eventLayer.name==="Correlation: SWI&FAPAR"){
      
      map.removeControl(ndwiLegend);
        map.removeControl(ndviLegend);
        map.removeControl(laiLegend);
        map.removeControl(lcLegend);
        map.removeControl(swiLegend);
        map.removeControl(sliderControl);
        faparLegend.addTo(map);
    }
    
});

map.on('overlayremove', function(eventLayer){
  if (eventLayer.name==="Vegetation Indices"){
    map.removeControl(temporalLegend);
    map.removeControl(vispanel);
    map.removeControl(sliderControl2);

  };
  if (eventLayer.name==="Land cover"){
      map.removeControl(lcLegend);
  };
  if (eventLayer.name === 'Correlation: SWI&NDVI'){ 
       map.removeControl(ndviLegend);
    };

  if (eventLayer.name === 'Correlation: SWI&NDWI'){ 
       map.removeControl(ndwiLegend);
    };
  if (eventLayer.name === 'Correlation: SWI&LAI'){ 
       map.removeControl(laiLegend);
    };
  if (eventLayer.name === 'Correlation: SWI&FAPAR'){ 
       map.removeControl(faparLegend);
    };
  if (eventLayer.name==="Soil Water Index"){
      map.removeControl(swiLegend);
      map.removeControl(sliderControl);
  };
});



//add the VI overlay: to add 5 experimental site in red, click on the sites, activate vi view panel and slider

var exsites=L.layerGroup();
var highlight = {
    'color': 'red',
    'weight': 6,
    'opacity': 1
};


var site1=L.rectangle([[-18.7, 22.4], [-18.8, 22.5]], {color:"red",weight:3,fillOpacity: 0.02}).bindPopup("Site <b>135</b>").addTo(exsites);
var site2=L.rectangle([[-19.4, 23.2], [-19.5, 23.3]], {color:"red",weight:3,fillOpacity: 0.02}).bindPopup("Site<b> 318</b>").addTo(exsites);
var site3=L.rectangle([[-19.6, 23.7], [-19.7, 23.8]], {color:"red",weight:3,fillOpacity: 0.02}).bindPopup("Site <b>373</b>").addTo(exsites);
var site4=L.rectangle([[-20.1, 22.2], [-20.2, 22.3]], {color:"red",weight:3,fillOpacity: 0.02}).bindPopup("Site <b>483</b>").addTo(exsites);
var site5=L.rectangle([[-19.6, 22.3], [-19.7, 22.4]], {color:"red",weight:3,fillOpacity: 0.02}).bindPopup("Site <b>359</b>").addTo(exsites);
$(site1).attr({"class":"site135"});
$(site2).attr({"class":"site318"});
$(site3).attr({"class":"site373"});
$(site4).attr({"class":"site483"});
$(site5).attr({"class":"site359"});
exsites.eachLayer(function (layer) {
  console.log(layer.className);
  layer.on('click',function(){
      console.log(layer.options.weight);

      console.log(map.baseLayer);
      layer.setStyle(highlight);
      map.setView(this.getBounds()._southWest, 11);
      onClick_legend(this,layer.className);
  });

  
});



//create a custome legend slider and initialize
function createSliderUI(timestamps,siteid) {
  console.log(siteid);
   sliderControl2.onAdd = function(map) {

     var slider = L.DomUtil.create("input", "range-slider");
     var datearray=["2016-11-22","2016-12-02","2017-04-01","2017-04-11","2017-04-21","2017-11-07","2018-01-06","2018-04-26","2018-05-16","2018-06-05"]; 
     // L.DomEvent.addListener(slider, "mousedown", function(e) { 
     //    L.DomEvent.stopPropagation(e); 
     $(slider).mousedown(function () {
            map.dragging.disable();
        });
     $(document).mouseup(function () {
            map.dragging.enable();
      
        });
     //  });
      $(slider)
        
        .attr({"type":"range", 
          "max": timestamps[timestamps.length-1], 
          "min": timestamps[0], 
          "step": 1,
          "value":String(timestamps[0])

        })
        .on("input change", function() {
          //update the vis container
          //console.log(swiimage);
          //swiimage[this.value-1].addTo(map);
          var ndvisrc="assets/VI_plots/"+siteid+"ndvi"+(this.value-1)+".png";
          var ndwisrc="assets/VI_plots/"+siteid+"ndwi"+(this.value-1)+".png";
          var laisrc="assets/VI_plots/"+siteid+"lai"+(this.value-1)+".png";
          var faparsrc="assets/VI_plots/"+siteid+"fapar"+(this.value-1)+".png";
          //console.log(faparsrc);

          //createVIpanel(this.value);
          $(".ndvicontainer").html('<img id="theImg1" '+'src="'+ndvisrc+'"/>');
          $(".ndwicontainer").html('<img id="theImg2" '+'src="'+ndwisrc+'"/>');
          $(".laicontainer").html('<img id="theImg3" '+'src="'+laisrc+'"/>');
          $(".faparcontainer").html('<img id="theImg4" '+'src="'+faparsrc+'"/>');
         
          $(".temporal-legend").text('Vegetation indices on '+datearray[this.value-1]);

        });
        
      return slider;
    }
    //initialize the slider, i.e. when the slider value is 1
    //swiimage[0].addTo(map);
    createVIpanel(timestamps[0]-1,siteid);
    
    sliderControl2.addTo(map);
    createTemporalLegend(timestamps[0]-1); 
};



//create VI penels with containders for vi images
function createVIpanel(startTimestamp,siteid) {
  console.log(siteid);
   
   //var datearray=["2016-11-22","2016-12-02","2017-04-01","2017-04-11","2017-04-21","2017-11-07","2018-01-06","2018-04-26","2018-06-05"]; 

   vispanel.onAdd = function(map) { 
     var output = L.DomUtil.create("output", "vis-panel");
      var ndvicontainer=L.DomUtil.create("div","ndvicontainer");  
      var ndwicontainer=L.DomUtil.create("div","ndwicontainer");
      var laicontainer=L.DomUtil.create("div","laicontainer");  
      var faparcontainer=L.DomUtil.create("div","faparcontainer");
     //var ndvisrc="assets/ndvi"+startTimestamp+".png"
       
       $(ndvicontainer).html(('<img id="theImg1" '+'src="'+"assets/VI_plots/"+siteid+"ndvi"+startTimestamp+".png"+'"/>'));
       $(ndwicontainer).html(('<img id="theImg2" '+'src="'+"assets/VI_plots/"+siteid+"ndwi"+startTimestamp+".png"+'"/>'));
       $(laicontainer).html(('<img id="theImg3" '+'src="'+"assets/VI_plots/"+siteid+"lai"+startTimestamp+".png"+'"/>'));
       $(faparcontainer).html(('<img id="theImg4" '+'src="'+"assets/VI_plots/"+siteid+"fapar"+startTimestamp+".png"+'"/>'));

       $(output).append(ndvicontainer,ndwicontainer,laicontainer,faparcontainer);
       
     return output; 
   }

    vispanel.addTo(map);

}

//legend above the slider bar to show the time 
function createTemporalLegend(startTimestamp) {
  console.log(startTimestamp);
   
   var datearray=["2016-11-22","2016-12-02","2017-04-01","2017-04-11","2017-04-21","2017-11-07","2018-01-06","2018-04-26","2018-05-16","2018-06-05"]; 

   temporalLegend.onAdd = function(map) { 
     var output = L.DomUtil.create("output", "temporal-legend");
       $(output).text('Vegetation indices on ' +datearray[startTimestamp])
     return output; 
   }

    temporalLegend.addTo(map);

}

//function linked to the clicking event and initialized the chain of creating the vi-penel
function onClick_legend(e,siteid) {
  console.log(e);
  console.log(siteid);
  var timestamps=["1","2","3","4","5","6","7","8","9","10"];
  console.log(timestamps);
  // map.addControl(vis);
  createSliderUI(timestamps,siteid);
   
};

//handels the layers and displays on the maps
var overlays = {
    // "Water Level Station":wlstations,
    "Delta extent":delta,
    "Land cover":lc,
    "Soil Water Index":timelayer,
    "Correlation: SWI&NDVI": ndvikrig,
    "Correlation: SWI&NDWI": ndwikrig,
    "Correlation: SWI&LAI": laikrig,
    "Correlation: SWI&FAPAR": faparkrig,
    "Vegetation Indices":exsites
};



L.control.layers(baseLayers, overlays,{collapsed: false}).addTo(map);


delta.addTo(map);


//functions not used



// //display the land cover layer from the wms
// var testWMS = "http://172.16.99.243:8080/geoserver/landcoveroncemore/wms"
// var testLayer = L.nonTiledLayer.wms(testWMS, {
//     layers: 'delta_lc2',
//     format: 'image/png',
//     transparent: true, 
//     attribution: 'KNMI'
// });





// //handels adding legend from the wms capabilitites
// var testLegend = L.control({
//     position: 'topright'
// });
// testLegend.onAdd = function(map) {
//     var src = testWMS+"?request=GetLegendGraphic&format=image%2Fpng&layer=delta_lc2";
//     var div = L.DomUtil.create('div', 'infolegend');
//     //div.id=infolegend;
//     div.style.width = '260px';
//     div.style.height = '530px';
//     div.style.float = 'right';
//     div.style['background-image'] = 'url(' + src + ')';
//     //div.style.display="none"
//     return div;
// };


// function createVIS(date){
  
    

//     var vis = L.control({position:"bottomleft"});
    
//     vis.onAdd = function(map) {

//       console.log(this);
//       var vis=L.DomUtil.create("input","vis");
//       $(vis).text(date);
//       // vis.style.position= 'relative';
      
//       // var ndvicontainer=L.DomUtil.create("div","ndvicontainer");  
//       // var ndwicontainer=L.DomUtil.create("div","ndwicontainer");
//       // var laicontainer=L.DomUtil.create("div","laicontainer");  
//       // var faparcontainer=L.DomUtil.create("div","laicontainer");
//       //   // var vis= L.DomUtil.create(“div”,“vis”);  
//       //   // var ndviContainer = L.DomUtil.create(“div”,“ndvicontainer”);  
//       //   // var ndwiContainer = L.DomUtil.create(“div”,“ndwicontainer”);
//       //   // var laiContainer = L.DomUtil.create(“div”,“laicontainer”);  
//       //   // var faparContainer = L.DomUtil.create(“div”,“faparcontainer”);
//       //   // var margin;

//       //   $(vis).append(ndvicontainer,ndwicontainer,laicontainer,faparcontainer);

//       //   var ndvisrc="assets/ndvi"+date+".png";
//       //   var ndwisrc="assets/ndwi"+date+".png";
//       //   var laisrc="assets/lai"+date+".png";
//       //   var faparsrc="assets/fapar"+date+".png";
//       //   console.log(ndvisrc);



        
//       //   $(vis).attr("style","width: "+600+"px; height: "+170+"px");
//       //    $(ndvicontainer).html('<img id="theImg1" '+'src="'+ndvisrc+'"/>').attr("style","width: "+150+"px; height: "+150+"px; display: inline-block");
//       //    $(ndwicontainer).html('<img id="theImg2"'+' src="'+ndwisrc +'"/>').attr("style","width: "+150+"px; height: "+150+"px; display: inline-block");
//       //    $(laicontainer).html('<img id="theImg3" '+'src="'+laisrc+ '"/>').attr("style","width: "+150+"px; height: "+150+"px; display: inline-block");
//       //    $(faparcontainer).html('<img id="theImg4" '+'src="'+faparsrc+ '"/>').attr("style","width: "+150+"px; height: "+150+"px; display: inline-block");
//          // $(legendCircle).attr(“style”, “width: “ + currentRadius*2 + 
//          //   “px; height: “ + currentRadius*2 + 
//          //   “px; margin-left: “ + margin + “px” );

//       //   var src = "assets/nature.png";
//       // //   var div = L.DomUtil.create('div', 'infolegend2');
//       // //   //div.id=infolegend;
   
       
//         // ndvicontainer.style.position= 'relative';
//         // ndwicontainer.style.position= 'relative';
//         // laicontainer.style.position= 'relative';
//         // faparcontainer.style.position= 'relative';
//       //   ndvicontainer.style.float = 'right';
//       //   ndvicontainer.style.zIndex=2;
//       //   ndvicontainer.style['background-image'] = 'url(' + src + ')';
         
        
//         //this.update();
//         return vis;
        
//       //   return vis; 

//     };


//     // vis.update = function (map) {
//     //   console.log(this);
      
//     //   $(vis).remove();
//     // };

//     vis.addTo(map);
    

// };

