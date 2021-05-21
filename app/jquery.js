$(".btn1").click(function(){
    $("#buttons").css("display","none");
    $(".login-form").css("display","block");
    $(".reg-form").css("display","none");
})

$(".btn2").click(function(){
    $("#buttons").css("display","none");
    $(".reg-form").css("display","block");
    $(".login-form").css("display","none");
})

$(".btnr2").click(function(){
    $("#buttons").css("display","none");
    $(".reg-form").css("display","none");
    $(".login-form").css("display","block");
})

$(".btnl2").click(function(){
    $("#buttons").css("display","none");
    $(".login-form").css("display","none");
    $(".reg-form").css("display","block");
})


var check = function() {
    console.log("entered")
    if ($('#pass11').val() ==
      $('#pass22').val()) {
      
      $('.btnr1').css('pointer-events','all')
      $('.wrapper').css('cursor','initial')
      document.getElementById('give_warning').innerHTML = 'Passwords Matching';
    } else {
        $('.btnr1').css('pointer-events','none')
        $('#give_warning').text = "Passwords not matching"
        $('.wrapper').css('cursor','not-allowed')
      document.getElementById('give_warning').innerHTML = 'Passwords not matching';
    }
}