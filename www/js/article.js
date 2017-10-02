function Article(type, article_name)
{
	var thumbnail_url="";
	this.article_name = article_name;
	this.thumbnail_url="";
	this.type = type;//3 types: target,distractor,subject
	//this.UI_html = "blank_html";
	//var html_string="blank_html";
		
	
	this.get_html = function()
	{
		//alert("ARTICLE: name: "+ this.article_name+" ,thumbnail_url: "+this.thumbnail_url+" ,type: "+type);
		//return article_name1;
		
		//alert("Article : type: "+type);
		var html_value="blank_html";
		if((this.type=="target") || (this.type =="distractor"))
		{
			
			html_value = "<center><img height='100' width='150' src='"+this.thumbnail_url + "'/></center>";
			//alert("Article : in condition 1 ");
			
		}
		else
		{
			html_value = this.article_name;
			//alert("Article : in condition 2 ");
		}
		//alert("ARTICLE: "+this.UI_html);
		//article_name = html_value;
		return html_value;
	}
	
	
	
	
}

function Choice(choice_index,article,wiki_correct)
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