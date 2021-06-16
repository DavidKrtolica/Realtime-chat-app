    const socket = io();
    $(() => {
        $("#send").click(()=>{
            if ($("#name").val() != "" && $("#message").val() != "") {
            sendMessage({name: $("#name").val(), message: $("#message").val()});
            // CLEARING THE MESSAGE INPUT FIELD
            $('#message').val('');
            } else {
                alert("You haven't written a name and a message!!");
            };
        });
        
        $("#delete").click(()=>{
            deleteMessages();
            // CLEARING THE INPUT FIELD ONCE THE "CLEAR CHAT" BUTTON IS PRESSED
            $('#name').val('');
            $('#message').val('');
        });

        getMessages();
    });

    socket.on('message', addMessages);

    // GETTING THE "messages" DIV AND SETTING IT TO "" - EMPTY STRING
    socket.on('changeDiv', (data) => {
        $('#messages').html(data.clearDiv);
    });

    function addMessages(message) {
        $("#messages").append(`<h4> ${ message.name } </h4> <p> ${ message.message } </p>`);
    };

    function getMessages() {
        // JQUERY AJAX GET REQUEST
        $.get('https://realtime-chatsapp.herokuapp.com/messages', (data) => {
            data.forEach(addMessages);
        });
    };

    function sendMessage(message){
        // JQUERY AJAX POST REQUEST
        $.post('https://realtime-chatsapp.herokuapp.com/messages', message);
    };

    function deleteMessages() {
        // JQUERY AJAX DELETE REQUEST
        $.ajax({
            url: 'https://realtime-chatsapp.herokuapp.com/messages',
            type: 'DELETE',
            contentType:'application/json',  
            dataType: 'text',              
            success: function(result) {
                console.log('Success!');
            },
            error: function(result){
                console.log('Error occured...');
            }
        });
        // WE ALSO NEED TO CLEAR OUT THE MESSAGES DIV ON THE HTML PAGE
        const clearDiv = '';
        socket.emit('divCleared', { clearDiv });
    };