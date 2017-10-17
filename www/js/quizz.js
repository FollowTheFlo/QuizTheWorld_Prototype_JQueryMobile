function Quizz(quiz_number,target_name,multiple_choices_number,max_questions_number, min_score,DISPLAY_LIVE_RESPONSE,SELECTED_LOCALE)
{
	
	var choice_KO_number = multiple_choices_number -1; //we remove the correct answer
	var toasts_list = [];
	var current_question_index=0;
	var target_subjects_count=0;
	this.target_article = target_name;
	var current_toast;
	var is_finished=false;
	this.min_score = min_score;
	var final_score = 0;
	var final_questions_number=0;
	var start_timestamp =  new Date().toLocaleString();
	//var random_index_list= [];
	
	
	this.GET_UI_quiz_results = function()
	{
		get_results_details();
		
	}
	
	this.GET_final_score = function()
	{
		return final_score;
		
	}
	
	this.GET_selected_locale = function()
	{
		return SELECTED_LOCALE;
		
	}
	
	
	this.GET_timestamp = function()
	{
		return start_timestamp;
		
	}
	
	this.GET_isFinished = function()
	{
		return is_finished;
		
	}
	
	function fill_toasts_list()
	{
		var question_index=0;
		var valid_question_index=0; //index used by excluding invalid toast
		var distractor_index=0;
		var distractor_count=0;
		var random_distractor_index=0;
		toasts_list = [];
		
		target_subjects_count = count_Target_Subjects();
		
		//adding 3 indexes to cover the invalid questions, the ones that don't have distractor
		var index_selection_list = get_random_list_indexes(max_questions_number+3,target_subjects_count);
		
		while(question_index<index_selection_list.length)
		{
			distractor_count = count_subject_distractors(index_selection_list[question_index]);
			if(distractor_count>0)
			{
				//generate random distractor index
				random_distractor_index = random_num_out_of(distractor_count-1);
							
					var toast_instance = new Toast();
					//fill_Toast(target_name,target_current_question_index,distractor_index,distractor_current_question_index,distractor_subject_number)

					console.log("FLO fill TOAST: "+question_index);
					
					//check number of distractor for the subject
										
					
					toast_instance.fill_Toast(target_name,index_selection_list[question_index],random_distractor_index,0,multiple_choices_number,SELECTED_LOCALE);
								
					console.log("FLOOOO toast_instance.is_valid = "+toast_instance.is_valid);
					
					if(toast_instance.is_valid == true)
					{
						console.log("FLO, TOAST "+valid_question_index+" valid ");
						toasts_list[valid_question_index] = toast_instance;
						valid_question_index++;
						
					}
					else{
						
						console.log("invalid toast at index "+question_index);
						
					}
			}
			else
			{
				console.log("Subject has no Distractors at index: "+question_index);
				
			}
			
			
			
		
			question_index++;
			
		}
		
		//truncate the toasts list if more row than 'max_questions_number' as we added 3 for security, to take care of invalid distractors subjects
		if(toasts_list.length > max_questions_number)
			toasts_list.slice(0,max_questions_number);
		
		
	}
	
	function UI_display_One_Toast_HTML(question_index)
	{
		console.log("IN UI_display_One_Toast_HTML, index: "+question_index);
		console.log("FLOOOOOOOOOOO toasts_list length "+toasts_list.length);
		var HTML_string = toasts_list[question_index].GET_UI_toast_HTML();
		
		console.log("Toast HTML string at index "+question_index+" is : "+HTML_string);
		
		$("#questions_area").html(HTML_string);
		
		//$('#radio_quiz').removeClass("ui-controlgroup-last ui-corner-bottom");
		$("#questions_area").trigger('create');
		
	}
	
		
	
	
	function calculate_score()
	{
		
		//alert("in calculate_score, length : "+toasts_list.length);
		var score=0;
		var toasts_index=0;

		var choices_index=0;
		//var toast_index= current_question_index;
		while(toasts_index<final_questions_number)
		{
			
			choices_index=0;
		
			while((choices_index<toasts_list[toasts_index].GET_article_shuffle_list().length) && (toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].is_correct_answer() == false))
			{
					choices_index++;
			}
				
			//if didn't go til end of the loop, means we hit the is_correct_answer. if no good answer j is equal to full length
			
		  	if(choices_index<toasts_list[toasts_index].GET_article_shuffle_list().length)
			{
				//alert("good answer on - Q"+i);
				score++;
				
			}
			
			toasts_index++;
			
			
		}
		
		final_score = (score*100/final_questions_number).toFixed(0);
		
		var HTML_string = "<h3 style='font-size:50px;color:white;text-align:center;margin-bottom:0px;'>"+score+" / "+final_questions_number+"</h3>"+
		"<h3 style='font-size:90px;color:white;text-align:center;margin-bottom:10px;'>"+(score*100/final_questions_number).toFixed(0)+"%</h3>";
		
		return HTML_string;
		
	}
	
	function display_correct_answer()
	{
		
		var toast_index= current_question_index;
		var choices_length = toasts_list[toast_index].GET_article_shuffle_list().length;
			
		var i=0;
		while(i<choices_length && toasts_list[toast_index].GET_article_shuffle_list()[i].wiki_correct == false)
		{
			i++;
		}
		
		return("<h3  style='text-align:center;color:red'>The correct answer is : </br><b>#"+(i+1)+" <br/> "+ toasts_list[toast_index].GET_article_shuffle_list()[i].article_name)+"</b></h3>";
		
	
	
	}
	
	
	function insert_user_response()
	{
		
		//need to get the toast and its associated QuestionAnswer objects
		
		var user_choice_index = $("input[name='quiz-choice']:checked").val();
		var user_choice_index_int = parseInt(user_choice_index);
		var toast_index= current_question_index;

            if(user_choice_index){

               console.log("value is : "+user_choice_index+" current_index "+(toast_index)+" , taost length"+final_questions_number); 

            }
			
		//alert("Insert")
		toasts_list[toast_index].GET_article_shuffle_list()[user_choice_index_int].SET_user_answer(true);
		
		var user_response = toasts_list[toast_index].GET_article_shuffle_list()[user_choice_index_int].article_name;
		//alert("FLO user response -> "+user_response+", object length : "+toasts_list[current_question_index].choices_list.length);
		
		var is_correct_answer = toasts_list[toast_index].GET_article_shuffle_list()[user_choice_index_int].is_correct_answer();
		
		if(DISPLAY_LIVE_RESPONSE==true)
			UI_display_live_response(is_correct_answer);
		
	}
	
	
	function UI_display_live_response(is_correct_answer)
	{
		var answer_output = "";
		
			if(is_correct_answer)
				answer_output = "<h3 style='font-size:30px;color:green;text-align:center;'>Correct answer!</h3>";
			else
				answer_output = display_correct_answer();
		
		
		//alert(answer_output);
		$("#live_answer_output").html(answer_output);
		$("#live_answer_popup").popup("open");
		//alert(answer_output);
	}
	
	function is_selection_done()
	{
		//var isChecked = $("input[name='quiz-choice']:checked").val();
		
		//console.log("FLO is_selection_done : "+input[name='quiz-choice']:checked").val());
		
		 if (!$("input[name='quiz-choice']:checked").val())
		 {
			alert('Please select an answer');
			return false;
		}
		else
		{
			return true;
		}
		
	}
	
	
	function TapNext( event )
	{
			
		
	   
	console.log("FLO -> in NEXT EVENT live");   
		// alert("hello");
    
		//var article_keyword = $("#article_input").val();
		//quizz.(article_keyword);
	if(is_selection_done() && is_finished==false)
	{	
		
		insert_user_response();
		build_NEXT_toast();
	}
		
		
		
		
		
		
	}
		
		
	this.enable_NEXT_feature=function()
	{
		console.log("enable_NEXT_feature, quiz_number: "+quiz_number);
		
		//display NEXT button and bind the event
		$("#next_btn-"+quiz_number+" .ui-btn-text").text("Next");
		document.getElementById('next_btn-'+quiz_number).style.display = "block";
		
	


	}
	
	this.disable_NEXT_feature=function()
	{
	
		//hide NEXT button and kill the event;
		console.log("disable_NEXT_feature, quiz_number: "+quiz_number);
		$("#next_btn-"+quiz_number).die();
		document.getElementById('next_btn-'+quiz_number).style.display = "none";
		
		$("#results_details_btn").die();
		
		

	}
	
	
	
	
	
	//UI_Init(); //Clear UI when new Quiss created
	this.UI_Init=function()
	{
		
		$("#questions_area").html("<h3  style='font-size:15px;color:white;text-align:center'>Loading</p3>");
		$("#quiz_questions").show();
		$("#quiz_results").hide();
		$("#questions_counter").html("");
		

		
		
	}
	
	
	function UI_Display_questions_counter()
	{
		
		var questions_count_html = "<h3  style='font-size:15px;color:white;text-align:center'>"+(parseInt(current_question_index)+1)+" / "+(final_questions_number)+"</h3>";
		$("#questions_counter").html(questions_count_html);
		$("#questions_counter").trigger('create');
	}
	
	function UI_Display_Quiz_Tab_Title()
	{
		var quizz_tab_title_html= "<h3  style='font-size:15px;color:white;text-align:center'>Quizz about: "+target_name+"</h3>"
		$("#quizz_tab_title").html(quizz_tab_title_html);
		$("#quizz_tab_title").trigger('create');
		
		style='font-size:15px;color:white;text-align:center'
	}
	
	function count_subject_distractors(target_subject_index)
	{
		//alert("START count_subject_distractors");
		var distractor_count=0;
		var my_query=get_locale_SPARQL_url()+"?query=PREFIX dbp: <http://dbpedia.org/resource/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23>"+
	    	  "PREFIX dbpprop: <http://dbpedia.org/property> PREFIX skos: <http://www.w3.org/2004/02/skos/core%23> PREFIX dcterms: <http://purl.org/dc/terms/>  PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+

	    	   	"SELECT COUNT( DISTINCT ?distractor_label) as ?distractor_count WHERE{"+
	    	  	"?distractor <http://purl.org/dc/terms/subject> ?distractor_subject."+
	    	  	"?distractor_subject rdfs:label ?target_subject_label."+
	    	  	"?distractor rdfs:label ?distractor_label."+
	    	  	" FILTER (langMatches(lang(?distractor_label),'"+SELECTED_LOCALE+"'))"+
	    	  	" FILTER (str(?distractor_label) != '"+target_name+"')"+
	    	  	" {"+
	    	  		" SELECT ?target_subject_label WHERE { "+
	    	  		" ?target_article rdfs:label '"+target_name+"'@"+SELECTED_LOCALE+"."+
	    	  		" ?target_article <http://purl.org/dc/terms/subject> ?target_subject."+
	    	  		" ?target_subject rdfs:label ?target_subject_label. "+
					"FILTER (langMatches(lang(?target_subject_label),'"+SELECTED_LOCALE+"'))"+
					"FILTER (str(?target_subject_label) != '"+target_name+"')"+
	    	  		"}"+
	    	  		"OFFSET "+target_subject_index+" LIMIT 1"+
	    	  	"}"+
	    	  	"}"+
	    	  	"&format=json";
				//alert("count json: "+my_query);
		var JSON_response = JSON_request(my_query);
			    
	   
	    console.log("subject_entity_list(json_res) -> length: " +JSON_response.results.bindings.length);
	  
	    
	    //get the OK subject stored in SPARQL var target_subject_label
	    if(JSON_response.results && JSON_response.results.bindings[0] && JSON_response.results.bindings[0].distractor_count )
	    {
			distractor_count= JSON_response.results.bindings[0].distractor_count.value;
		}
		console.log("count_subject_distractors, count: "+distractor_count);
		return distractor_count;
		
	}
	
	function count_Target_Subjects()
	{
		var total_count=0;
		var target_count_query= get_locale_SPARQL_url()+"?query=PREFIX dbp: <http://dbpedia.org/resource/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23>"+
	    	 "PREFIX dbpprop: <http://dbpedia.org/property> PREFIX skos: <http://www.w3.org/2004/02/skos/core%23> PREFIX dcterms: <http://purl.org/dc/terms/>  PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+
			"SELECT count( DISTINCT ?subject) as ?total_count WHERE {?article rdfs:label '"+target_name+"'@"+SELECTED_LOCALE+"."+
			"?article <http://purl.org/dc/terms/subject> ?subject} &format=json";

		console.log("count_Target_Subjects query: "+target_count_query);
		var JSON_response = JSON_request(target_count_query);
		
		 console.log("count_Target_Subjects -> length: " +JSON_response.results.bindings.length);
		
				
		 if(JSON_response.results && JSON_response.results.bindings[0] && JSON_response.results.bindings[0].total_count )
		    {
			 
			 	console.log("count_Target_Subjects response count : "+JSON_response.results.bindings[0].total_count.value);
				if(parseInt(JSON_response.results.bindings[0].total_count.value) >0 )
				{
					total_count = JSON_response.results.bindings[0].total_count.value;
					
					target_subjects_count = total_count; 
				}
				else
				{
					alert("Target has no Subjects");
					show_desktop();
				}
			 		    	
		    }
		 else
			 {
			 
			 alert("Problem in JSON Request for Target count");
			 show_desktop();
			 }
		
		return target_subjects_count;
		
	}
	
	function set_number_of_questions()
	{
		console.log("IN set_number_of_questions");
		//calculate number of questions, if there are more subjects returned from SPARQL than ones from user input, we limit with user limit
		if(toasts_list.length > max_questions_number)
		{
			return max_questions_number;
		}
		else
		{
			return toasts_list.length;
		}
		
	}
	
	this.build_START_toast= function()
	{
		Add_next_button();
		current_question_index=0;
		//this.UI_Init();
		//count_Target_Subjects();
		//target_name,multiple_choices_number,max questions_number
		
		//fill_toasts_list() to create all the Toast, Toast contains Choices, Choices contains Articles
		fill_toasts_list();
		
		
		var success = build_image_toast();
		
		console.log("build_image_toast: "+success);
		
		
		if((!toasts_list) || (toasts_list.length==0))
		{
			console.log("WARNING toast list is null or empty");
			return false ;
		}
		
		
		
		//calculate the total question number after comparing with user input and question numb pulled from JSON without invalid questions
		final_questions_number = set_number_of_questions();//this function compared user input number with max valid questions.
		console.log("final_questions_number : "+final_questions_number);
			
		
		UI_Display_questions_counter();
		
		UI_display_One_Toast_HTML(current_question_index);
		
		return true;
	};
	
	function build_NEXT_toast()
	{
		if((!toasts_list) || (toasts_list.length==0))
			return ;
		
			//alert("adding toast 3 - index: "+current_question_index);
		if(is_finished==true)
		{
			alert("finished");
					return;
		}
		
			//add previous toast in the list
			//toasts_list[current_question_index] = current_toast;
					
		
		//we will create a new toast if last question has not been reached, -1 because we increment index at the beginning of the loop
		if(current_question_index < final_questions_number-1)
		{
		
			//current_toast = new Toast();
			//var current_question_index = $("#current_question_index_input").val();
			//multiple_choices_number = $("#multiple_choices_number_input").val();
			console.log("current_question_index before INC: "+current_question_index);
			
			current_question_index++;
			UI_Display_questions_counter();
			UI_display_One_Toast_HTML(current_question_index);
			//current_toast.fill_Toast(target_name,current_question_index,0,0,0,multiple_choices_number);
			//alert("current_question_index: "+current_question_index+" , toasts_list.length: "+toasts_list.length);
			
			if(current_question_index == final_questions_number-1)
			{
				//last question, change label NEXT to FINISH
				$("#next_btn-"+quiz_number+" .ui-btn-text").text("Finish");
				
			}
			
			
			
		}
		else 
		{
			is_finished=true;
			//alert("Processing the results");
			
			//final_score = calculate_score();
			UI_display_results_HTML(calculate_score());
			//alert("Final score : "+final_score+"%");
			
		}
		
		
		
		
		
		
		//alert("adding toast 2 - index: "+current_question_index);
		//toasts_list[current_question_index] = current_toast;
		
	};
	
	function UI_display_results_HTML(HTML_string)
	{
		//var HTML_string = "<h3 style='font-size:100px;color:white;text-align:center;margin-bottom:8px;'>"+final_score+"%</h3>";
		
		
		$("#quiz_questions").hide();
		$("#quiz_results").show();
		$("#results_score").html(HTML_string);
		
		
	}
	
function get_random_list_indexes(index_number, total_number){
		var random_list = [];
		var random_index=0;
		var i=0;
		
		if(index_number>=total_number)
		{
			index_number=total_number;
		}
		//alert("index num : "+index_number)
		while(i<index_number)
		{
			random_index = random_num_out_of(total_number);
          
			if(random_list.indexOf(random_index,0) == -1)
			{
            	
				random_list.push(random_index);
				i++;
			}
		}
		
		return random_list;
		
	}

	function build_image_toast()
	{
		var distractor_article_list = [];
		var i=0;
		var j=0;
		
		var target_article;
		
		//we get the target article in index 0, could be any index as target_index always have the the same value
		// sometimes SPARQL returns thumbnail 'undefined', need to filter them
		if( toasts_list[0] && toasts_list[0].target_article && toasts_list[0].target_article.thumbnail_url != "" && toasts_list[0].target_article.thumbnail_url != "undefined")
			 target_article = toasts_list[0].target_article;
		else 
			return false;
	
		
		
		//max_questions_number-1 as exclude OK choice
		while((i< toasts_list.length) && (i<(multiple_choices_number-1)))
		{
				if(toasts_list[i] && toasts_list[i].distractor_article && toasts_list[i].distractor_article.thumbnail_url != "" && toasts_list[i].distractor_article.thumbnail_url != "undefined")
				{
					
						distractor_article_list[j] = toasts_list[i].distractor_article;
						j++;
				}
					
				i++;
				
		}
		
		if(distractor_article_list.length == 0)
			return false;
		
			
		var image_toast = new Toast();
		image_toast.build_image_toast(target_article,distractor_article_list);
		toasts_list.splice(random_num_out_of(toasts_list.length),1,image_toast);
		
		return true;
		
	}
	function get_locale_SPARQL_url()
	{
		var locale_url= "http://dbpedia.org/sparql";
		
		if(SELECTED_LOCALE=="fr")
			locale_url="http://fr.dbpedia.org/sparql";
		else if(SELECTED_LOCALE=="es")
			locale_url="http://es.dbpedia.org/sparql";
		
		//alert("return locale: "+SELECTED_LOCALE+" ,url: "+locale_url);
		return locale_url;
	}
	
	function random_num_out_of(total_index)
	{
		
		return Math.floor(Math.random()*(total_index))
	}
	
	function get_results_details()
	{	
		var quiz_score=0;
		var toasts_index=0;
		var html_string="";
		var choices_index=0;
		var question_content="";
		var accordion_menu="<div  data-content-theme='a' data-theme='a' id='quiz_accordion' data-role='collapsible-set' data-inset='false'>";
		//var user_response=false;
		//var correct_answer=false;
		var user_answered_fine=false;
		var not_answered=true;
		var question_header="";
		var choice_content="";
		var questions_content="";
		console.log("final_questions_number: "+final_questions_number);
		//var toast_index= current_question_index;
		while(toasts_index<final_questions_number)
		{
			//question_content= "<div style='z-index:-1;' data-role='collapsible' class='ui-collapsible ui-collapsible-inset ui-collapsible-collapsed' id='toast-" + toasts_index + "' >";
			user_answered_fine=false;
			console.log("in toast loop, index  "+toasts_index);
			choices_index=0;
		//	console.log("length of QuestionAnswer : "+toasts_list[toasts_index].choices_list.length);
			//scanning all the choice of teh toast to see if correct answer match
			while(choices_index < toasts_list[toasts_index].GET_article_shuffle_list().length)
			{	
				if(toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].wiki_correct == false && toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].GET_user_answer() == false)
				{//not correct answer and user did not selected it
					 
					 choice_content = choice_content+ "<p style='padding-left:5%;padding-right:5%'>"+(choices_index+1)+" - "+ toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].get_html()+"</p>";
					 console.log("condition 1");
				
				}else if(toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].wiki_correct == false && toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].GET_user_answer() == true)
				{//not correct answer and user selected it: fail questions!
					
					 choice_content = choice_content+ "<p style='padding-left:5%;padding-right:5%;color:red'>"+(choices_index+1)+" - "+ toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].get_html()+"</p>";
					 console.log("condition 2");
					 not_answered=false;
					
				}
				else if(toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].wiki_correct == true && toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].GET_user_answer() == true)
				{
					user_answered_fine=true;
					not_answered=false;
					choice_content = choice_content+ "<p style='padding-left:5%;padding-right:5%;color:green'>"+(choices_index+1)+" - "+ toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].get_html()+"</p>";
					 console.log("condition 3");
					
				}
				else if(toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].wiki_correct == true && toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].GET_user_answer() == false)
				{
					
					choice_content= choice_content+ "<p style='padding-left:5%;padding-right:5%;color:green'>"+(choices_index+1)+" - "+ toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].get_html()+"</p>";
					console.log("condition 4");
					
				}
				else
				{
					console.log("condition 5");
					choice_content= choice_content+ "<p>Undefined</p>";
				}
				
				console.log("wiki_correct: "+toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].wiki_correct);
				console.log("user choice: "+toasts_list[toasts_index].GET_article_shuffle_list()[choices_index].GET_user_answer());
				console.log("in choice loop, index  "+choices_index);
			
			//	console.log("is_correct : "+toasts_list[toasts_index].choices_list[choices_index].is_correct_answer()+" - choices_index value : "+choices_index+" article name: "+toasts_list[toasts_index].choices_list[choices_index].article_name+", user answer: "+toasts_list[toasts_index].choices_list[choices_index].GET_user_answer());
				choices_index++;
			}
				
			if(user_answered_fine)
			{
				question_header= "<div style='z-index:-1;' data-role='collapsible' class='ui-collapsible ui-collapsible-inset ui-collapsible-collapsed' id='toast-" + (toasts_index+1) + "' ><h3>Question "+ (toasts_index+1) +" -> PASSED </h3>";
				quiz_score++;
			}
			else
			{
				question_header= "<div style='z-index:-1;' data-role='collapsible' class='ui-collapsible ui-collapsible-inset ui-collapsible-collapsed' id='toast-" + (toasts_index+1) + "' ><h3>Question "+ (toasts_index+1) +" -> FAILED </h3>";
			}		
			
			if(not_answered==true)
			{
				question_header= "<div style='z-index:-1;' data-role='collapsible' class='ui-collapsible ui-collapsible-inset ui-collapsible-collapsed' id='toast-" + (toasts_index+1) + "' ><h3>Question "+ (toasts_index+1) +" -> NOT ANSWERED </h3>";
	
			}
					
			questions_content = questions_content + question_header + choice_content + "</div>";
			choice_content="";
			not_answered=true;
					//console.log("OUT j value : "+j+", is correct "+toasts_list[i].choices_list[j].is_correct_answer()+" article name: "+toasts_list[i].choices_list[j].article_name+" article name: "+toasts_list[i].choices_list[j].article_name+", user answer: "+toasts_list[i].choices_list[j].GET_user_answer());
					
					//if didn't go til end of the loop, means we hit the is_correct_answer. if no good answer j is equal to full length
					
							
					toasts_index++;
		}
		//accordion_menu = accordion_menu + question_content+"</div>";
		html_string = "<h3>Quiz Details about '"+target_name+"' : </h3><h3>Score: "+quiz_score+"/"+final_questions_number + "</h3>" + accordion_menu + questions_content+"</div>";
		
		//alert("full results: "+html_string);
		
		$("#details_results_output").html(html_string);
		
		$("#details_results_popup").popup("open");
		$("#details_results_popup").trigger('create');
		//$('#details_results_popup').css('z-index','100');
		
		
		//return html_string;
	}

	$('#results_details_btn').live('tap',function(){ 
	//alert("On click");
		get_results_details();
	});
	
	function Add_next_button()
	{
		var next_button_html = "<a data-inline='true' data-content-theme='a' data-theme='a' id='next_btn-"+quiz_number+"' data-role='button' style='display:none;'>Next</a>";
		$("#next_btn_area").html(next_button_html);
		$("#next_btn_area").trigger('create');
		$(document).on('tap',"#next_btn-"+quiz_number,TapNext);
		
	}
}
