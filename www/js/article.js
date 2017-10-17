function Article(type, article_name,wiki_correct)
{
	var user_answer = false;
	var thumbnail_url="";
	this.article_name = article_name;
	this.thumbnail_url="";
	this.type = type;//3 types: target,distractor,subject
	this.wiki_correct = wiki_correct;
	
	
	
	this.get_html = function()
	{
		
		var html_value = "blank_html";
		if((this.type=="target") || (this.type =="distractor"))
		{
			
			html_value = "<center><img height='100' width='150' src='"+this.thumbnail_url + "'/></center>";
				
		}
		else
		{
			html_value = this.article_name;
	
		}
	
		return html_value;
		
	}
	
	this.is_correct_answer = function()
	{
		var correct=false;
		if ((wiki_correct== true) && (user_answer==true))
			correct =  true;
		
		return correct;
		
		
	}
	
	
	this.SET_user_answer = function(user_choice)
	{
		user_answer = user_choice;
		
	}
	
	this.GET_user_answer = function()
	{
		return user_answer;
		
	}
	
}
