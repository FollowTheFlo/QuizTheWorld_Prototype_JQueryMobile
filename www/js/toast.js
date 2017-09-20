function Toast(){
	var subject_OK= new Article("");
	var subject_KO = [];
	var user_response;
	var success=false;
	var question_answer_list = [];
	this.target_title = "Blank Subject";
	
	this.GET_question_answer_list = function()
	{
		return question_answer_list;
		
	}
	
	this.fill_Toast= function (target_name,target_subject_index,distractor_index,distractor_subject_index,distractor_subject_index,distractor_subject_number)
	{
		var GET_CHOICE_OK_VERIF = false;
		var GET_CHOICES_KO_VERIF = false;
		target_title = target_name;
		    var display_string = target_name +" is related to :\n";
		distractor_subject_number--;//remove 1 choice to exclude the good choice as we  list the KO choices
		/*
		var target_subject_index = 2;
		var distractor_index = 2;
		var distractor_subject_index = 2;
		var distractor_subject_number = 5
		*/
	       console.log("fill_toast_From_JSON with target_name: "+ target_name);
		   
	      var my_query=
	    	  "http://dbpedia.org/sparql?query=PREFIX dbp: <http://dbpedia.org/resource/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23>"+
	    	  "PREFIX dbpprop: <http://dbpedia.org/property> PREFIX skos: <http://www.w3.org/2004/02/skos/core%23> PREFIX dcterms: <http://purl.org/dc/terms/>  PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+

	    	  "SELECT ?distractor_subject_label ?distractor_label ?target_subject_label WHERE { "+
	    	  "?article rdfs:label ?distractor_label. "+
	    	  "?article <http://purl.org/dc/terms/subject> ?distractor_subject. "+
	    	  "?distractor_subject rdfs:label ?distractor_subject_label. "+
	    	  "FILTER NOT EXISTS "+
	    	  "{ "+
	    	  "?temp_article rdfs:label '"+target_name+"'@en. "+
	    	  "?temp_article <http://purl.org/dc/terms/subject> ?temp_subject. "+
	    	  "?temp_subject rdfs:label ?distractor_subject_label. "+
	    	  "} "+
	    	  "{ "+
	    	  	" SELECT DISTINCT ?distractor_label ?target_subject_label WHERE { "+
	    	  	" ?distractor <http://purl.org/dc/terms/subject> ?distractor_subject. "+
	    	  	"?distractor_subject rdfs:label ?target_subject_label. "+
	    	  	"?distractor rdfs:label ?distractor_label. "+
	    	  	" FILTER (langMatches(lang(?distractor_label),'EN')) "+
	    	  	" FILTER (str(?distractor_label) != '"+target_name+"') "+
	    	  	" {"+
	    	  		" SELECT ?target_subject_label  WHERE { "+
	    	  		" ?target_article rdfs:label '"+target_name+"'@en. "+
	    	  		" ?target_article <http://purl.org/dc/terms/subject> ?target_subject. "+
	    	  		" ?target_subject rdfs:label ?target_subject_label. "+
	    	  		" } "+
	    	  		" OFFSET "+target_subject_index+" LIMIT 1 "+
	    	  	" } "+
	    	  	" } "+
	    	  	" OFFSET "+distractor_index+" LIMIT 1 "+
	    	 " }	  } OFFSET "+distractor_subject_index+" LIMIT "+distractor_subject_number+" &format=json";
		
		//console.log("json1");
		var JSON_response = JSON_request(my_query);
		
		
	   
	   
	    
	   
	    console.log("subject_entity_list(json_res) -> length: " +JSON_response.results.bindings.length);
	  
	    
	    //get the OK subject stored in SPARQL var target_subject_label
	    if(JSON_response.results && JSON_response.results.bindings[0] && JSON_response.results.bindings[0].target_subject_label )
	    {
			//subject OOK in each json row, we pull it on [0] to be sure to have it
	    	subject_OK.article_name = JSON_response.results.bindings[0].target_subject_label.value;
	    	// alert("Toast target:"+ current_toast_subject_OK);
	    	 display_string = display_string + "OK-> "+ subject_OK.article_name + "\n";
			 GET_CHOICE_OK_VERIF=true;
	   
	    
	    //get the KO subjects stored in SPARQL var distractor_subject_label
			for (var i = 0; i < JSON_response.results.bindings.length ; i++)
			{ 
				
				if(JSON_response.results && JSON_response.results.bindings[i] && JSON_response.results.bindings[i].distractor_subject_label )
				{
					subject_KO[i] =  new Article(JSON_response.results.bindings[i].distractor_subject_label.value);
						
								
						
					//console.log("Toast distractor:"+"i" + subject_KO[i].article_name);
					
					display_string = display_string + "KO "+i+" -> "+subject_KO[i].article_name+"\n";
					GET_CHOICES_KO_VERIF=true;
					
				}
		   
			}
		 }
		else{
			
			alert("Question skipped as no choices found, please press NEXT");
		}
	    
		if(GET_CHOICE_OK_VERIF && GET_CHOICES_KO_VERIF)
		{
			//alert(display_string);
			
			//Display from objects
			build_question_answer();
			UI_HTML_build_radio_buttons();
			
			
			success=true;
		}
		else if(GET_CHOICE_OK_VERIF==true && GET_CHOICES_KO_VERIF==false)
			alert("No available choices for subject "+target_name+" : "+subject_OK.article_name+"/n Please go to next Question" );
		

		return success;
	}
	
	function build_question_answer()
	{
		 
		//generate random number between 0 and length of KO choices, will be use to insert OK choice. 
		//create offset as OK choice will be inserted
		var random_index = Math.floor(Math.random()*(subject_KO.length+1));
		
		console.log("build_question_answer, random index: "+random_index);
		var CORRECT_RESPONSE=1
		var USER_RESPONSE=2
		var article_index=0;
		while(article_index < random_index)
		{
			//QuestionAnswer(choice_index,article,wiki_correct)
			
			question_answer_list[article_index]= new QuestionAnswer(article_index,subject_KO[article_index],false);
			
			article_index++;
		}
		
				
		//insert good choice
		question_answer_list[article_index]= new QuestionAnswer(article_index,subject_OK,true);
		article_index++;//increment the index to insert KO choices after OK choice
		
		//add 1 to length as we added OK choice
		while(article_index < (subject_KO.length+1))
		{
			//QuestionAnswer(choice_index,article,wiki_correct)
			
			//article_index-1 to pull the subject KO as there was an offset created by OK subject insert
			question_answer_list[article_index]= new QuestionAnswer(article_index,subject_KO[article_index-1],false);
			console.log("FLO Index QA -> " + article_index);
			
			
			article_index++;
			
			
		}
		
		
		console.log("FLO subject KO length" + subject_KO.length);
		console.log("FLO question_answer_list Length -> "+ question_answer_list.length);
		
	}
	
	function UI_HTML_build_radio_buttons()
	{
		console.log("UI_HTML_build_radio_buttons");
		console.log("FLO question_answer_list.length -> " + question_answer_list.length);
		var index=0;
		var QA_string= target_title +" is related to :\n";
		var HTML_string = "<h3 style='text-align:center'>'<b>"+target_title +"</b>' is related to:</h3><fieldset data-role='controlgroup' data-mini='true' id='radio_quiz' data-content-theme='a' data-corners='false' data-theme='a' data-native-menu='false' >";

     	
		while(index < question_answer_list.length)
		{
			console.log("FLO Index-> "+index);
			
			QA_string = QA_string + (index+1) + " - " +question_answer_list[index].article.article_name + " OK -> " + question_answer_list[index].wiki_correct + "\n";
			
			HTML_string = HTML_string + "<input type='radio' name='quiz-choice' id='radio-choice-"+index+"' value='" +index + "' />"+
			"<label for='radio-choice-" +index + "'>" +question_answer_list[index].article.article_name + "</label>";
			
			console.log("FLO temp QA_string-> "+QA_string + ", good -> "+question_answer_list[index].wiki_correct);
			
			index++;
		}
		
		HTML_string = HTML_string + "</fieldset>";
		console.log("QA_string -> "+QA_string);
		
		//alert(QA_string);
		
		//questions_count_html = "<h3>"+subject_index+" / "+target_subjects_count+"</h3>"
		$("#questions_area").html(HTML_string);
		
		//$('#radio_quiz').removeClass("ui-controlgroup-last ui-corner-bottom");
		$("#questions_area").trigger('create');
		//$("input[type='radio']").attr("checked",true).checkboxradio("refresh");
		
				
	}
	
}