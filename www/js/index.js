//Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available

var FIRST_QUIZ=true;// this var is used to kill event of current instance
var current_quiz;
var quizz_list = [];

function onDeviceReady() {
	
    console.log("deviceready");
   
}

$("#article_btn").live('tap', function(){ 
	   
	   
   // alert("hello");
    
    var article_keyword = $("#article_input").val();
	
	if(is_valid_article(article_keyword))	
		build_quizz(article_keyword);
	else
		alert("Target article not found");

});

function is_valid_article(target_name)
	{
		var is_valid= false;
		var target_subjects_count=0;
		var target_count_query= 
			"http://dbpedia.org/sparql?query=PREFIX dbp: <http://dbpedia.org/resource/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23>"+
	    	 "PREFIX dbpprop: <http://dbpedia.org/property> PREFIX skos: <http://www.w3.org/2004/02/skos/core%23> PREFIX dcterms: <http://purl.org/dc/terms/>  PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+
			"SELECT count(?article) as ?target_count  WHERE {?article rdfs:label '"+target_name+"'@en } &format=json";
		
		var JSON_response = JSON_request(target_count_query);
		
		console.log("json target count "+JSON_response);
		console.log("is_valid_article -> length: " +JSON_response.results.bindings.length);
		
		
		
		 if(JSON_response.results && JSON_response.results.bindings[0] && JSON_response.results.bindings[0].target_count )
		    {
			 
			 	console.log("response count : "+JSON_response.results.bindings[0].target_count.value);
			 	if(parseInt(JSON_response.results.bindings[0].target_count.value) >0 )
			 	{
			 		is_valid=true;
			 	}
			 
		    	
		    }
		 else
			 {
			 
			 alert("Problem in JSON Request for Target count");
			 }
		
		return is_valid;
	}


function build_quizz(keyword)
{
	
	console.log("FLO -> build_quizz");
	
	//make sure the event is killed if exists as can ref to previous quizz object
	
	
	if(FIRST_QUIZ == false){
		
		//if not first quizz, we assume the object current_quiz exists
		// we disable the NEXT feature as event bind with previous object instance
		current_quiz.disable_NEXT_feature();
		
					
	}
	
	
	
	//Quizz(target_name,multiple_choices_number,questions_number,min_score)
	current_quiz = new Quizz(keyword,5,10,70);
	
	//document.getElementById('next_btn').style.display = "none";
	//		$("#next_btn").die('tap');
	
	
	
		current_quiz.UI_Init();
		
		current_quiz.build_START_toast();
		
		console.log("FLO -> in build_quizz with keyword: "+keyword);
		
		current_quiz.enable_NEXT_feature();
		
		FIRST_QUIZ = false;
	
	   

}
	
	



function JSON_request(my_query)
{
console.log("sparql_request_article");

//console.log("query is : "+my_query);


    
 
    
    var JSON_object = {};
    requester  = new  XMLHttpRequest;
    //  Monitor the onreadystatechange event for a change in readyState

    try{
    	
        //choose non asynchronous, so avoid global var that usually needed to pull data from callback method.
        requester.open("GET", my_query, false);
        requester.send();
        
        //console.log(JSON.stringify(requester.responseText));
                 
         JSON_object =  JSON.parse(requester.responseText.replace("'","\'"));
      
    
    }catch(err)
    {
    alert("ajax error: "+err);
    
    
    
    }
            
            //var person = new Person(name,abstract_str,thumbnail_str);
            
            
        
    
    return JSON_object;

}

function fill_toast_from_JSON(json_res)
{
	
	console.log("fill_toast_From_JSON");
   
    var current_toast_subject_KO=new Array();
    var current_toast_subject_OK="";
    var display_string="";
    
   
   // console.log("subject_entity_list(json_res) -> length: " +json_res.results.bindings.length);
   
    if(json_res.results && json_res.results.bindings[0] && json_res.results.bindings[0].target_subject_label )
    {
    	current_toast_subject_OK = json_res.results.bindings[0].target_subject_label.value;
    	// alert("Toast target:"+ current_toast_subject_OK);
    	 display_string = "OK-> "+ current_toast_subject_OK + "\n";
    }
      
    for (var i = 0; i < json_res.results.bindings.length ; i++) 
    { 
        
        if(json_res.results && json_res.results.bindings[i] && json_res.results.bindings[i].distractor_subject_label )
        {
        	current_toast_subject_KO[i] = json_res.results.bindings[i].distractor_subject_label.value;
            
           
            display_string = display_string + "KO "+i+" -> "+current_toast_subject_KO[i]+"\n";
            
        }
        
            
       
    }
    
   // alert(display_string);
     

}



