$(document).ready(function() {
  $("#version").html("v0.14");
  
  $("#searchbutton").click( function (e) {
    if($("#searchfield").val() != "") {
      displayModal();
    }
  });
  
  $("#searchfield").keydown( function (e) {
    if(e.keyCode == 13 && $("#searchfield").val() != "") {
      displayModal();
    }	
  });
  
  var images; 
  var numResults;
  var current;

  function displayModal() {
    $(  "#myModal").modal('show');
    
    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: "+$("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();
    $.getJSON('/search/' + $("#searchfield").val() , function(data) {
      images = data;
      renderQueryResults(data);
    });
  }
  
  $("#next").click( function(e) {
    current = current+4;
    showFour(current);
  });
  
  $("#previous").click( function(e) {
    current = Math.max(0, current-4);
    showFour(current);
  });
  
  function renderQueryResults(data) {
    console.log(data);
    if (data.error != undefined) {
      $("#status").html("Error: "+data.error);
    } else {
      images = data.results;
      images.push("", "", "", "");
      numResults = data.num_results;

      current = 0;


      showFour(0);
      
    }
  }
  
  function showFour(start){
    console.log(images[start+1]);
    var currentMessage = "Showing " + Math.min(current + 1,numResults) + "-" +
    Math.min(current+4, numResults);

    $("#status").html(currentMessage + " of "+numResults+" result(s)");

    $("#photo0").attr("src", images[start+0]);
    $("#photo1").attr("src", images[start+1]);
    $("#photo2").attr("src", images[start+2]);
    $("#photo3").attr("src", images[start+3]);
    if(numResults  > start+4){
      $("#next").show();
    }else{
      $("#next").hide();
    }
    if(start != 0){
      $("#previous").show();
    }else{
      $("#previous").hide();
    }
  }
});
