function Article(article_name)
{
	this.article_name = article_name;
	
	
}

function QuestionAnswer(choice_index,article,wiki_correct)
{
	this.article = article;
	this.wiki_correct = wiki_correct;
	var user_answer = false;
	this.SET_user_answer = function(user_choice)
	{
		user_answer = user_choice;
		
	}
	
	this.GET_user_answer = function()
	{
		return user_answer;
		
	}
	
	
	this.is_correct_answer=function()
	{
		var correct=false;
		if ((wiki_correct== true) && (user_answer==true))
			correct =  true;
		
		//alert("Correct : "+correct);
		return correct;
		
		
	};
	
	
}