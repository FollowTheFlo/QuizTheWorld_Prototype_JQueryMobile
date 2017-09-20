function Quizz(target_name,multiple_choices_number,max_questions_number, min_score)
{
	
	var choice_KO_number = multiple_choices_number -1; //we remove the correct answer
	var toasts_list = [];
	var subject_index=0;
	var target_subjects_count=0;
	this.target_article = target_name;
	var current_toast;
	var is_finished=false;
	this.min_score = min_score;
	this.final_score = 0;
	
	function calculate_score()
	{
		
		//alert("in calculate_score, length : "+toasts_list.length);
		var score=0;
		var i=0;
		var j=0;
		while( i<toasts_list.length)
		{
			j=0;
			console.log("length of QuestionAnswer : "+toasts_list[i].GET_question_answer_list().length);
			//scanning all the choice of teh toast to see if correct answer match
			while((j<toasts_list[i].GET_question_answer_list().length) && (toasts_list[i].GET_question_answer_list()[j].is_correct_answer() == false))
			{
				console.log("is_correct : "+toasts_list[i].GET_question_answer_list()[j].is_correct_answer()+" - j value : "+j+" article name: "+toasts_list[i].GET_question_answer_list()[j].article.article_name+", user answer: "+toasts_list[i].GET_question_answer_list()[j].GET_user_answer());
				j++;
			}
			//console.log("OUT j value : "+j+", is correct "+toasts_list[i].GET_question_answer_list()[j].is_correct_answer()+" article name: "+toasts_list[i].GET_question_answer_list()[j].article.article_name+" article name: "+toasts_list[i].GET_question_answer_list()[j].article.article_name+", user answer: "+toasts_list[i].GET_question_answer_list()[j].GET_user_answer());
			
			//if didn't go til end of the loop, means we hit the is_correct_answer. if no good answer j is equal to full length
			
			console.log("FLO value j is "+j+" and length "+toasts_list[i].GET_question_answer_list().length);
			if(j<toasts_list[i].GET_question_answer_list().length)
			{
				//alert("good answer on - Q"+i);
				score++;
				
			}
			
			i++;
			//return score*100/toasts_list.length).toFixed(2);
		}
		
		alert("Total : "+ score +" / "+toasts_list.length + " -> "+ (score*100/toasts_list.length).toFixed(2)+"%");
		return (score*100/toasts_list.length).toFixed(2);
	}
	
	function display_correct_answer()
	{
	
		var choices_length = current_toast.GET_question_answer_list().length;
		
		//alert("choices length : " + choices_length)
		
		var i=0;
		while(i<choices_length && current_toast.GET_question_answer_list()[i].wiki_correct == false)
		{
			i++;
		}
		
		alert("The correct answer is : "+(i+1)+" - "+ current_toast.GET_question_answer_list()[i].article.article_name);
	
	
	}
	
	
	function insert_user_response()
	{
		
		//need to get the toast and its associated QuestionAnswer objects
		
		var user_choice_index = $("input[name='quiz-choice']:checked").val();
		var user_choice_index_int = parseInt(user_choice_index);

            if(user_choice_index){

               // alert("value is : "+user_choice_index);

            }
		current_toast.GET_question_answer_list()[user_choice_index_int].SET_user_answer(true);
		
		var user_response = current_toast.GET_question_answer_list()[user_choice_index_int].article.article_name;
		//alert("FLO user response -> "+user_response+", object length : "+current_toast.GET_question_answer_list().length);
		
		var is_correct_answer = current_toast.GET_question_answer_list()[user_choice_index_int].is_correct_answer();
		
		if(is_correct_answer)
			alert("Good answer");
		else
			display_correct_answer();
	}
	
	function is_selection_done()
	{
		var isChecked = $('#quiz-choice').prop('checked')
		
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
			
		
	   
	console.log("FLO -> in EVENT live");   
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
	
		//display NEXT button and bind the event
		$("#next_btn .ui-btn-text").text("Next");
		document.getElementById('next_btn').style.display = "block";
		$("#next_btn").on('tap', TapNext);
	


	}
	
	this.disable_NEXT_feature=function()
	{
	
		//hide NEXT button and kill the event;
		document.getElementById('next_btn').style.display = "none";
		$("#next_btn").off();	


	}
	
	
	
	
	
	//UI_Init(); //Clear UI when new Quiss created
	this.UI_Init=function()
	{
		//counter before displaying first question
		$("#questions_counter").html("");
		
		$("#questions_area").html("<h3>Loading</h3>");
		
		
	}
	
	
	function UI_Display_questions_counter()
	{
		//adding 1 to exclude the 0 digit
		questions_count_html = "<h3>"+(parseInt(subject_index)+1)+" / "+(target_subjects_count+1)+"</h3>"
		$("#questions_counter").html(questions_count_html);
		
	}
	
	
	
	function count_Target_Subjects()
	{
		var total_count=0;
		var target_count_query= 
			"http://dbpedia.org/sparql?query=PREFIX dbp: <http://dbpedia.org/resource/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23>"+
	    	 "PREFIX dbpprop: <http://dbpedia.org/property> PREFIX skos: <http://www.w3.org/2004/02/skos/core%23> PREFIX dcterms: <http://purl.org/dc/terms/>  PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+
			"SELECT count( DISTINCT ?subject) as ?total_count WHERE {?article rdfs:label '"+target_name+"'@en."+
			"?article <http://purl.org/dc/terms/subject> ?subject} &format=json";

		
		var JSON_response = JSON_request(target_count_query);
		
		 console.log("count_Target_Subjects -> length: " +JSON_response.results.bindings.length);
		
				
		 if(JSON_response.results && JSON_response.results.bindings[0] && JSON_response.results.bindings[0].total_count )
		    {
			 
			 	console.log("count_Target_Subjects response count : "+JSON_response.results.bindings[0].total_count.value);
				if(parseInt(JSON_response.results.bindings[0].total_count.value) >0 )
				{
					total_count = JSON_response.results.bindings[0].total_count.value;
					
					target_subjects_count = total_count-1;//through testing it seems the last row is always empty, so adjusting
				}
				else
				{
					alert("Target has no Subjects");
				}
			 		    	
		    }
		 else
			 {
			 
			 alert("Problem in JSON Request for Target count");
			 }
		
		
	}
	
	this.build_START_toast= function()
	{
		count_Target_Subjects();
		//target_name,multiple_choices_number,max questions_number
		current_toast = new Toast();
		subject_index = $("#subject_index_input").val();
		
		multiple_choices_number = $("#multiple_choices_number_input").val();
		
		//subject_index++; //COUNTER,it is the first question, the second come when pressing next, so need to be incremented already
		current_toast.fill_Toast(target_name,subject_index,0,0,0,multiple_choices_number);
		//fill_Toast= function (target_name,target_subject_index,distractor_index,distractor_subject_index,distractor_subject_index,distractor_subject_number)
		
		UI_Display_questions_counter();
		//alert("adding toast 1 - index: "+subject_index);
		//toasts_list[subject_index] = current_toast;
		
	};
	
	function build_NEXT_toast()
	{
			//alert("adding toast 3 - index: "+subject_index);
		if(is_finished==true)
		{
			alert("finished");
					return;
		}
		
			//add previous toast in the list
			toasts_list[subject_index] = current_toast;
					
		
		//we will create a new toast if last question has not been reached
		if(subject_index<target_subjects_count)
		{
		
			current_toast = new Toast();
			//var subject_index = $("#subject_index_input").val();
			//multiple_choices_number = $("#multiple_choices_number_input").val();
			console.log("subject_index before INC: "+subject_index);
			
		
			subject_index++;
			current_toast.fill_Toast(target_name,subject_index,0,0,0,multiple_choices_number);
			
			if(subject_index==target_subjects_count)
			{
				//last question, change label NEXT to FINISH
				$("#next_btn .ui-btn-text").text("Finish");
				
			}
			
		}
		else 
		{
			is_finished=true;
			//alert("Processing the results");
			
			final_score = calculate_score();
			//alert("Final score : "+final_score+"%");
			
		}
		
		UI_Display_questions_counter();
		
		//alert("adding toast 2 - index: "+subject_index);
		//toasts_list[subject_index] = current_toast;
		
	};
	

}