//Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available

var FIRST_QUIZ=true;// this var is used to kill event of current instance
var current_quiz;
var quiz_list = [];
var quiz_number=0;
var MAX_QUESTIONS_NUMBER=10;
var MAX_CHOICES_NUMBER = 5;
var SHOW_ANSWER_AFTER_QUESTION= false;
var USER_LOCALE= "en";

function onDeviceReady() {
	
    console.log("deviceready");
	
	show_desktop();
   
}

$(document).on('tap','#article_btn', function(){ 
	   
	   
   // alert("hello");
    
		//get value of locale slect menu
	USER_LOCALE = $('#language_list').val();
	
	
    var article_keyword = $("#article_input").val();
	
	if(is_valid_article(article_keyword))
	{	
		display_quiz_page();//display Quizz Tab, function define in dashboard.js
		build_quizz(article_keyword);
	}
	else
		alert("Target article not found");

});



function is_valid_article(target_name)
	{
		var is_valid= false;
		var target_subjects_count=0;
		
		var locale_url= "http://dbpedia.org/sparql";
		
		if(USER_LOCALE=="fr")
			locale_url="http://fr.dbpedia.org/sparql";
		else if(USER_LOCALE=="es")
			locale_url="http://dbpedia.org/sparql";
		
		
		var target_count_query= locale_url+"?query=PREFIX dbp: <http://dbpedia.org/resource/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23>"+
	    	 "PREFIX dbpprop: <http://dbpedia.org/property> PREFIX skos: <http://www.w3.org/2004/02/skos/core%23> PREFIX dcterms: <http://purl.org/dc/terms/>  PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+
			"SELECT count(?article) as ?target_count  WHERE {?article rdfs:label '"+target_name+"'@"+USER_LOCALE+" } &format=json";
				
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
			 
			 alert("Problem in JSON Request for Target count on locale: "+USER_LOCALE);
			 }
		
		return is_valid;
	}



	
function get_tools_UI_input()
{
	
	
	if($("#language_list").val())
	{
		MAX_QUESTIONS_NUMBER = $("#questions_number_input").val();
		
	}
	
	
	
	if($("#questions_number_input").val())
	{
		MAX_QUESTIONS_NUMBER = $("#questions_number_input").val();
		
	}

	
	
	if($("#choices_number_input").val())
	{
		MAX_CHOICES_NUMBER = $("#choices_number_input").val();
		
	}
	
	
	if($("#show_toast_result_input").val())
	{
		if($("#show_toast_result_input").val() == "on")
			SHOW_ANSWER_AFTER_QUESTION = true;
		else
			SHOW_ANSWER_AFTER_QUESTION = false;
		
	}
	
	
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
	
	get_tools_UI_input(); // to fill MAX_CHOICES_NUMBER,MAX_QUESTIONS_NUMBER,SHOW_ANSWER_AFTER_QUESTION,USER_LOCALE,RANDOM_FACTOR

	
	//alert("MAX_QUESTIONS_NUMBER "+MAX_QUESTIONS_NUMBER+", MAX_CHOICES_NUMBER "+MAX_CHOICES_NUMBER);
	//Quizz(target_name,multiple_choices_number,questions_number,min_score,DISPLAY_LIVE_RESPONSE)
	current_quiz = new Quizz(quiz_number,keyword,parseInt(MAX_CHOICES_NUMBER),parseInt(MAX_QUESTIONS_NUMBER),70,SHOW_ANSWER_AFTER_QUESTION,USER_LOCALE);
	//current_quiz = new Quizz(quiz_number,keyword,parseInt(MAX_CHOICES_NUMBER),parseInt(MAX_QUESTIONS_NUMBER),70,SHOW_ANSWER_AFTER_QUESTION,USER_LOCALE);
	
	//document.getElementById('next_btn').style.display = "none";
	//		$("#next_btn").die('tap');
	
	
	
		current_quiz.UI_Init();
		
		//true if valid questions generated
		var success = current_quiz.build_START_toast();
		
		if(success)
		{
				
			console.log("FLO -> in build_quizz with keyword: "+keyword);
			
			current_quiz.enable_NEXT_feature();
			
			
		
			quiz_list[quiz_number] = current_quiz;
		  
			quiz_number++;
		}
		else
		{
			//alert("No valid questions found");
			current_quiz.enable_NEXT_feature();
			
			//current_quiz.disable_NEXT_feature();
		}
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
         console.log(JSON.stringify(requester.responseText));
        //console.log(JSON.stringify(requester.responseText));
                 
         JSON_object =  JSON.parse(requester.responseText.replace("'","\'"));
       
    
    }catch(err)
    {
    alert("ajax error: "+err);
    
    
    
    }
            
            //var person = new Person(name,abstract_str,thumbnail_str);
            
            
        
    
    return JSON_object;

}



function UI_display_quiz_history()
{
	var quiz_index=0
	HTML_string="<h3 style='font-size:15px;color:white;text-align:center;'>Quiz history since the App is opened:</h3><hr>"
	
	while(quiz_index<quiz_list.length)
	{
		if(quiz_list[quiz_index].GET_isFinished())
		{
			HTML_string = HTML_string+ "<h3 style='font-size:15px;color:white;'>- At "+quiz_list[quiz_index].GET_timestamp()+
			" - Quiz about <b>'"+ quiz_list[quiz_index].target_article+"' ("+quiz_list[quiz_index].GET_selected_locale()+
			")</b> finished with score of "+quiz_list[quiz_index].GET_final_score()+"%.<div class='history_quiz' name='"+quiz_index+"' style='color:yellow;text-align:center;'>--show Details--</div></h3>";
		
		}else{
			
			HTML_string = HTML_string+ "<h3 style='font-size:15px;color:white;'>- At "+quiz_list[quiz_index].GET_timestamp()+" - Quiz about <b>'"+ quiz_list[quiz_index].target_article+"' ("+quiz_list[quiz_index].GET_selected_locale()+")</b> was not finished.<div class='history_quiz' name='"+quiz_index+"' style='color:yellow;text-align:center;'>--show Details--</div></h3>";
		}
		HTML_string = HTML_string + "<hr>";
		quiz_index++;
	}
	
	$("#history_area").html(HTML_string);
}

function UI_show_quiz_answers(quiz_index)
{
	
	quiz_list[quiz_index].GET_UI_quiz_results();
	
}

$(document).on('tap','.history_quiz', function() {
  //alert( $( this ).attr('name') );
  //we pull quiz index from html name attribute and pass it in UI function to taget correct quiz 
  
  UI_show_quiz_answers(parseInt($( this ).attr('name') ));
  
});


