//floating input label
$('div.float-label input').on('focusin focusout', function () {
    if ($(this).is(":focus")) {
        $(this).css('border-bottom', '1px solid #4aa3df');
        $(this).siblings('span').addClass('active-input-label');
    } else {
        $(this).css('border-bottom', '1px solid #ccc');
        
        if ($(this).val() == '') {
            $(this).siblings('span').removeClass('active-input-label');
        }
    }
});

$('#nav-contact div.nav-icon').on('click', function () {
    var target = $(this).data('target');
    
    //remove active class
    if($(this).hasClass('active')) {
        $(this).removeClass('active').addClass('pulse');
        $('#contact-info').css('height', '0px').css('border-width', '0px');
    }
    else {
        $('#nav-contact div.nav-icon.active').removeClass('active');
        $(this).addClass('active').removeClass('pulse');
        
        $('#contact-form, #contact-email, #contact-location, #contact-number').hide();
        
        switch(target) {
            case 'email': 
                $('#contact-info').css('height', '307px').css('border-width', '2px');
                $('#contact-form').show();
                break;
            case 'email-address': 
                $('#contact-info').css('height', '67px').css('border-width', '2px');
                $('#contact-email').show();
                break;
            case 'phone':
                $('#contact-info').css('height', '67px').css('border-width', '2px');
                $('#contact-number').show();
                break;
            case 'location':
                $('#contact-info').css('height', '300px').css('border-width', '2px');
                $('#contact-location').show();
                break;
        }
    }
});

$('#nav-contact')
    .mouseenter(function () {
        $(this).children().removeClass('pulse');
    })
    .mouseleave(function() {
        if($(this).children().hasClass('active') == false)
            $(this).children().addClass('pulse');
    });

//contact form
function validate_email(email) { 
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function send_email() {
	
	var name = $('#contact-form-name input[type=text]').val();
	var email = $('#contact-form-email input[type=email]').val();
	var msg = $('#contact-form-msg textarea').val();
    
    if(name == '' || name == ' ') {
        $('#contact-form .form-feedback').text('Please enter your name.').removeClass('text-green').addClass('text-red');
        return;
    }
    if(!validate_email(email)) {
        $('#contact-form .form-feedback').text('Please enter a valid email address.').removeClass('text-green').addClass('text-red');
        return;
    }
    if(msg == '' || msg == ' ') {
        $('#contact-form .form-feedback').text('Please enter a message.').removeClass('text-green').addClass('text-red');
        return;
    }
    
    //display loading overlay
    $('#contact-form .ajax-loading').show();
    
    $.ajax({
        type: 'POST',
        url: './php/mailer.php',
        data: 'name=' + name + '&email=' + email + '&msg=' + msg,
        success: function(res){
            if(res == 'sent') {
                //add feedback message
                $('#contact-form .form-feedback').text('Sent! Thank you for your message.').removeClass('text-red').addClass('text-green');
                //remove value from input
                $('#contact-form-name input[type=text], #contact-form-email input[type=email], #contact-form-msg textarea').val('');
            } else if(res == 'error') {
                //add feedback message
                $('#contact-form .form-feedback').text('An error has occured. Please try again.').removeClass('text-green').addClass('text-red');
            } else if(res == 'invalid-email') {
                //add feedback message
                $('#contact-form .form-feedback').text('Please enter a valid email address.').removeClass('text-green').addClass('text-red');
            }
            //hide loading overlay
            $('#contact-form .ajax-loading').hide();
        }
    });
}

//timeline indicator
function reCalcPos () {
    //edu dot indicator
    var marg = $('#yr12').position().top;
    marg = marg + $('.edu-iten-uni').height() - 35;
    $('#edu-timeline div:last-child').css('margin-top', marg+'px');
    
    //side nav
    var padd = ($(window).height() - $('#nav2-profile').height()) / 2;
    $('#nav2-profile').css('padding-top', padd+'px');
}

//clock
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function availability (target, from, to) {
	var template = '<canvas width="120" height="120" id="' + target + '">' + target.capitalize() + ': ' + from + ' - ' + to + '</canvas>';
	$('#availability').append(template);
	
	var canvas = document.getElementById(target);
	var context = canvas.getContext("2d");	
	
	if (from.slice(-2) == 'pm') {
		from = from.substring(0, from.length - 2);
		from_int = parseInt(from) + 12;
	} else {
		from = from.substring(0, from.length - 2);
		from_int = parseInt(from) + 12;
	}
	
	if (to.slice(-2) == 'pm') {
		to = to.substring(0, to.length - 2);
		to_int = parseInt(to) + 12;
	} else {
		to = to.substring(0, to.length - 2);
		to_int = parseInt(to) + 12;
	}
	
	var x = $('#' + target).width() / 2;
	var y = $('#' + target).width() / 2 - 10;
	var r = x * 0.8; //percentage
	var start = (from_int - 3) * (1 / 6) * Math.PI;
	var end =  (to_int - 3) * (1 / 6) * Math.PI;
	
	//background
	context.beginPath();
	context.arc(x, y, r, 0, 2*Math.PI);
	context.lineWidth = 1;
	context.strokeStyle = '#ccc';
	context.stroke();
	
	//foreground
	context.beginPath();
	context.arc(x, y, r, start, end);
	context.lineWidth = 3;
	//context.strokeStyle = '#2ecc71';
	context.strokeStyle = '#4aa3df';
	context.lineCap = 'round';
	context.stroke();
	
	//center
	context.beginPath();
	context.arc(x, y, 3, 0, 2*Math.PI);
	context.lineWidth = 1;
	context.strokeStyle = '#2980b9';
	context.stroke();
	
	//indicator
	context.font = 'normal 14px Calibri';
	context.textAlign = 'center';
	context.fillStyle = '#7f8c8d';
	context.fillText('12', x, y - r + 18);
	context.fillText('6', x, y * 2 - 10);
	context.fillText('3', (2 * x) - r + 25, y + 4);
	context.fillText('9', x - r + 10, y + 4);
	
	//label
	context.font = 'normal 15px Calibri';
	context.textAlign = 'center';
	context.fillStyle = '#2c3e50';
	context.fillText(target.capitalize(), x, 115);
}

//clickable profile icon
$('#nav-profile div.nav-icon, #nav2-profile div.nav-icon').on('click', function () {
    var target = $(this).data('target');
    
    var profile = ['about', 'education', 'skills', 'employment', 'availability', 'portfolio'];
    
    for (var loop = 0; loop < profile.length; loop++) {
        if (target == profile[loop]) {
            $.scrollTo('#profile-'+target, 600, {easing: 'swing'});
            break;
        }
    }
});

$('#back-to-top').on('click', function () {
    $.scrollTo('#nav-container', 600);
});