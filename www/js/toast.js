function Toast(){
	var subject_OK= new Article("subject","");
	this.target_article = new Article("target","");
	var subject_KO = [];
	this.distractor_article= new Article("distractor","");
	var user_response;
	var success=false;
	var choices_list = [];
	this.target_title = "Blank Subject";
	this.UI_HTML_string = "";
	this.is_valid = false;
	
	
		
	this.GET_UI_toast_HTML = function()
	{
		 console.log("GET_UI_toast_HTML");
		return UI_HTML_build_radio_buttons();
		
	}
	
	this.GET_choices_list = function()
	{
		console.log("GET_choices_list");
		return choices_list;
		
	}
	
	
	
	
	
	this.fill_Toast= function (target_name,target_subject_index,distractor_index,distractor_subject_index,distractor_subject_number,SELECTED_LOCALE)
	{
		var GET_choices_OK_VERIF = false;
		var GET_choicesS_KO_VERIF = false;
		target_title = target_name;
		    var display_string = target_name +" is best related to :\n";
		distractor_subject_number--;//remove 1 choices to exclude the good choices as we  list the KO choicess
		
		var locale_url= "http://dbpedia.org/sparql";
		
		if(SELECTED_LOCALE=="fr")
			locale_url="http://fr.dbpedia.org/sparql";
		else if(SELECTED_LOCALE=="es")
			locale_url="http://es.dbpedia.org/sparql";
		
	       console.log("fill_toast_From_JSON with target_name: "+ target_name);
		   
	      var my_query=locale_url+"?query=PREFIX dbp: <http://dbpedia.org/resource/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23>"+
	    	  "PREFIX dbpprop: <http://dbpedia.org/property> PREFIX skos: <http://www.w3.org/2004/02/skos/core%23> PREFIX dcterms: <http://purl.org/dc/terms/>  PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX dbo: <http://dbpedia.org/ontology/>"+

	    	  "SELECT ?distractor_subject_label ?distractor_label ?target_subject_label ?target_thumbnail ?distractor_thumbnail WHERE{"+
	    	  "?article rdfs:label ?distractor_label."+
	    	  "?article <http://purl.org/dc/terms/subject> ?distractor_subject."+
	    	  "?distractor_subject rdfs:label ?distractor_subject_label."+
			  "OPTIONAL {?article dbo:thumbnail ?distractor_thumbnail}."+
			  "FILTER (langMatches(lang(?distractor_subject_label),'"+SELECTED_LOCALE+"'))"+
	    	  "FILTER (str(?distractor_subject_label) != '"+target_name+"')"+
	    	  "FILTER NOT EXISTS"+
	    	  "{"+
	    	  "?temp_article rdfs:label '"+target_name+"'@"+SELECTED_LOCALE+"."+
	    	  "?temp_article <http://purl.org/dc/terms/subject> ?temp_subject."+
	    	  "?temp_subject rdfs:label ?distractor_subject_label."+
	    	  "}"+
	    	  "{"+
	    	  	"SELECT DISTINCT ?distractor_label ?target_subject_label ?target_thumbnail WHERE{"+
	    	  	"?distractor <http://purl.org/dc/terms/subject> ?distractor_subject."+
	    	  	"?distractor_subject rdfs:label ?target_subject_label."+
	    	  	"?distractor rdfs:label ?distractor_label."+
	    	  	"FILTER (langMatches(lang(?distractor_label),'"+SELECTED_LOCALE+"'))"+
	    	  	"FILTER (str(?distractor_label) != '"+target_name+"')"+
	    	  	"{"+
	    	  		"SELECT ?target_subject_label ?target_thumbnail WHERE{"+
	    	  		"?target_article rdfs:label '"+target_name+"'@"+SELECTED_LOCALE+"."+
	    	  		"?target_article <http://purl.org/dc/terms/subject> ?target_subject."+
	    	  		"?target_subject rdfs:label ?target_subject_label."+
					"OPTIONAL {?target_article dbo:thumbnail ?target_thumbnail}."+
					"FILTER (langMatches(lang(?target_subject_label),'"+SELECTED_LOCALE+"'))"+
					"FILTER (str(?target_subject_label) != '"+target_name+"')"+
	    	  		"}"+
	    	  		"OFFSET "+target_subject_index+" LIMIT 1"+
	    	  	"}"+
	    	  	"}"+
	    	  	" OFFSET "+distractor_index+" LIMIT 1"+
	    	 "}} OFFSET "+distractor_subject_index+" LIMIT "+distractor_subject_number+" &format=json";
		
		
		//alert("my query: "+my_query);
		//console.log("json1");
		var JSON_response = JSON_request(my_query);
		
		
	   
	   
	    
	   
	    console.log("subject_entity_list(json_res) -> length: " +JSON_response.results.bindings.length);
	  
	    
	    //get the OK subject stored in SPARQL var target_subject_label
	    if(JSON_response.results && JSON_response.results.bindings[0] && JSON_response.results.bindings[0].target_subject_label )
	    {
			//subject OOK in each json row, we pull it on [0] to be sure to have it
	    	subject_OK.article_name = JSON_response.results.bindings[0].target_subject_label.value;
			this.target_article.article_name = target_name;
			
			if(JSON_response.results.bindings[0].target_thumbnail){
				//subject_OK.thumbnail_url = JSON_response.results.bindings[0].target_thumbnail.value;
				this.target_article.thumbnail_url = JSON_response.results.bindings[0].target_thumbnail.value;
			}
			//subject_OK.get_html();
			//	target_article.get_html();
			
			//alert("FLOOOOOO subject_OK url :"+subject_OK.html_string);
			
	    	// alert("Toast target:"+ current_toast_subject_OK);
	    	 display_string = display_string + "OK-> "+ subject_OK.article_name + "\n";
			 GET_choices_OK_VERIF=true;
			this.distractor_article.article_name= JSON_response.results.bindings[0].distractor_label.value;
			
			if(this.distractor_article.thumbnail_url = JSON_response.results.bindings[0].distractor_thumbnail)
				this.distractor_article.thumbnail_url = JSON_response.results.bindings[0].distractor_thumbnail.value;
	    
	    //get the KO subjects stored in SPARQL var distractor_subject_label
			for (var i = 0; i < JSON_response.results.bindings.length ; i++)
			{ 
				
				if(JSON_response.results && JSON_response.results.bindings[i] && JSON_response.results.bindings[i].distractor_subject_label )
				{
					subject_KO[i] =  new Article("subject",JSON_response.results.bindings[i].distractor_subject_label.value);
													
						
					//console.log("Toast distractor:"+"i" + subject_KO[i].article_name);
					
					display_string = display_string + "KO "+i+" -> "+subject_KO[i].article_name+"\n";
					GET_choicesS_KO_VERIF=true;
					
				}
		   
			}
		 }
		else{
			
			//alert("Question skipped as no choicess found, please press NEXT");
			//if no subject, add fake question
			subject_OK.article_name = "none";
			subject_KO[0] = "none";
		}
	    
		if(GET_choices_OK_VERIF && GET_choicesS_KO_VERIF)
		{
						
			console.log("success collecting subject of OK and KO");
			success = true;
			this.is_valid = true;
			console.log("SET IS_VALID = TRUE");
		}
		else if(GET_choices_OK_VERIF==true && GET_choicesS_KO_VERIF==false)
		{
			//alert("No available choicess for subject "+target_name+" : "+subject_OK.article_name+"/n Please go to next Question" );
			
			console.log("No available choicess for subject "+target_name+" : "+subject_OK.article_name+"/n Please go to next Question");
		}
		
		
		if(this.is_valid == true){
			//build choices based on OK and KO, never empty, if there are no distractor, we filled them with value 'none', purpose is to avoid NULL article object. We will filter them at the end
			build_choices_list();
			
			//genreate HTML string
			//UI_HTML_string = UI_HTML_build_radio_buttons();
		}

		return success;
	}
	
	function build_choices_list()
	{
		 
		//generate random number between 0 and length of KO choicess, will be use to insert OK choices. 
		//create offset as OK choices will be inserted
		var random_index = Math.floor(Math.random()*(subject_KO.length+1));
		
		console.log("build_choices_list, random index: "+random_index);

		var article_index=0;
		while(article_index < random_index)
		{
			//Choice(choices_index,article,wiki_correct)
			
			choices_list[article_index]= new Choice(article_index,subject_KO[article_index],false);
			
			article_index++;
		}
		
				
		//insert good choices
		choices_list[article_index]= new Choice(article_index,subject_OK,true);
		article_index++;//increment the index to insert KO choicess after OK choices
		
		//add 1 to length as we added OK choices
		while(article_index < (subject_KO.length+1))
		{
			//Choice(choices_index,article,wiki_correct)
			
			//article_index-1 to pull the subject KO as there was an offset created by OK subject insert
			choices_list[article_index]= new Choice(article_index,subject_KO[article_index-1],false);
			console.log("FLO Index QA -> " + article_index);
			
			
			article_index++;
			
			
		}
		
		
		console.log("FLO subject KO length" + subject_KO.length);
		console.log("FLO choices_list Length -> "+ choices_list.length);
		
	}
	
	function UI_HTML_build_radio_buttons()
	{
		console.log("UI_HTML_build_radio_buttons");
		console.log("FLO choices_list.length -> " + choices_list.length);
		var index=0;
		var QA_string= target_title +" is best related to :\n";
		var HTML_string = "<h2 style='font-size:15px;color:white;text-align:center'>'"+target_title +"' is best related to:</h2><fieldset data-role='controlgroup' data-mini='false' id='radio_quiz' data-content-theme='c' data-corners='false' data-theme='c' data-native-menu='false' >";

     	
		while(index < choices_list.length)
		{
			//alert("BEFORE: "+choices_list[index].article.UI_html);
			//choices_list[index].article.get_html();
			//alert("AFTER: "+choices_list[index].article.article_name);
			console.log("FLO Index-> "+index);
			
			QA_string = QA_string + (index+1) + " - " +choices_list[index].article.get_html()+ " OK -> " + choices_list[index].wiki_correct + "\n";
			
			HTML_string = HTML_string + "<input data-content-theme='a' data-theme='a' type='radio' name='quiz-choice' id='radio-choices-"+index+"' value='" +index + "' />"+
			"<label for='radio-choices-" +index + "'>" +choices_list[index].article.get_html() + "</label>";
			
			console.log("FLO temp QA_string-> "+QA_string + ", good -> "+choices_list[index].wiki_correct);
			
			index++;
		}
		
		HTML_string = HTML_string + "</fieldset>";
		//HTML_string = HTML_string + "<h3>"+distractor.article_name + "</h3>";
		//HTML_string = HTML_string + "<img height='100' width='150' src='"+distractor.thumbnail_url + "'/>";
		console.log("QA_string -> "+QA_string);
		//alert("TOAST HTML_string: "+HTML_string);
		return HTML_string;
		
		
		
				
	}
	
	 this.build_image_toast = function(OK_thumb_article,KO_thumb_article_list)
	{
		subject_KO = KO_thumb_article_list;
		subject_OK = OK_thumb_article;
		
		build_choices_list();
		
		/*
		var random_index = Math.floor(Math.random()*(KO_thumb_article_list.length+1));
		
		console.log("build_choices_list, random index: "+random_index);
		var thumbnail_Choices_list = [];
		
		var article_index=0;
		while(article_index < random_index)
		{
			//Choice(choices_index,article,wiki_correct)
			
			thumbnail_Choices_list[article_index]= new Choice(article_index,KO_thumb_article_list[article_index],false);
			
			article_index++;
		}
		
				
		//insert good choices
		thumbnail_Choices_list[article_index]= new Choice(article_index,OK_thumb_article,true);
		article_index++;//increment the index to insert KO choicess after OK choices
		
		//add 1 to length as we added OK choices
		while(article_index < (KO_thumb_article_list.length+1))
		{
			//Choice(choices_index,article,wiki_correct)
			
			//article_index-1 to pull the subject KO as there was an offset created by OK subject insert
			thumbnail_Choices_list[article_index]= new Choice(article_index,KO_thumb_article_list[article_index-1],false);
			console.log("FLO Index QA -> " + article_index);
			
			
			article_index++;
			
			
		}
		
		///now display
		
		console.log("UI_HTML_build_radio_buttons");
		console.log("FLO thumbnail_Choices_list.length -> " + thumbnail_Choices_list.length);
		var index=0;
		var QA_string= target_title +" is best related to :\n";
		var HTML_string = "<h2 style='font-size:15px;color:white;text-align:center'>'"+OK_thumb_article.article_name +"' is best related to:</2><fieldset data-role='controlgroup' data-mini='false' id='radio_quiz' data-content-theme='c' data-corners='false' data-theme='c' data-native-menu='false' >";

     	
		while(index < thumbnail_Choices_list.length)
		{
			console.log("FLO Index-> "+index);
			
			QA_string = QA_string + (index+1) + " - " +thumbnail_Choices_list[index].article.article_name + " OK -> " + thumbnail_Choices_list[index].wiki_correct + "\n";
			
			HTML_string = HTML_string + "<input data-content-theme='a' data-theme='a' type='radio' name='quiz-choice' id='radio-choices-"+index+"' value='" +index + "' />"+
			"<label for='radio-choices-" +index + "'><img height='50' width='70' src='"+thumbnail_Choices_list[index].article.thumbnail_url + "'/> </label>";
			
			console.log("FLO temp QA_string-> "+QA_string + ", good -> "+thumbnail_Choices_list[index].wiki_correct);
			
			index++;
		}
		
		HTML_string = HTML_string + "</fieldset>";
		//HTML_string = HTML_string + "<h3>"+distractor.article_name + "</h3>";
		//HTML_string = HTML_string + "<img height='100' width='150' src='"+distractor.thumbnail_url + "'/>";
		console.log("QA_string -> "+QA_string);
		
		UI_HTML_string = HTML_string;

		
		*/
		
				
	}
	
	
	
}