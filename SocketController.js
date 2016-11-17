/*
*  SocketController.js
*
*  Контроллер управление сокетами
*
*/

module.exports = function(io)
 {

   var users = []; // хранит подключенных пользователей
   var msges = []; // хранит  сообщения

   // ========================================-> SOCKETS CONNECTED
   io.sockets.on('connection', function(socket)
      {

           // console.log('New client connected [socket-id = ' + socket.id + ']');

           // Запуск функций для вывода данных
           io.sockets.emit('users', users);
           io.sockets.emit('msges', msges);

         // ............................................................................ CLIENT-SIDE
           /***********************************************************
           *   Действие на запуск функции "Отправка сообщения" на стороне Клиента
           *
           ***********************************************************/
           socket.on('send message', function(data)
            {
              // запуск функции "Новое сообщение"
              io.sockets.emit('new message', {nick: socket.nickname, message: data});     // отошлет всем данные включая меня

              msges.push(data);

             io.sockets.emit('msges', msges);

            //  socket.broadcast.emit('msges', msges); // отошлет всем данные кроме меня
            })




            /***********************************************************
            *  Действие на запуск функции "Новый юзер" на стороне Клиента
            *
            ***********************************************************/
            socket.on('new user', function(data, callback)
             {
                     console.log(data);

                     socket.nickname = data;
                     users.push(data);

                     io.sockets.emit('users', users);

             })


             /***********************************************************
             *  Действие на отсоеденение клиента
             *
             ***********************************************************/
              socket.on('disconnect', function(data)
               {
                 if(!socket.nickname) return; // если в массиве сокетов нет поля nickname - выход
                 users.splice(users.indexOf(socket.nickname), 1); // удаляем из массива людей которые приконектелись
                 io.sockets.emit('users', users); // обновляем
               })
         // ............................................................................ CLIENT-SIDE

      });
      // ========================================-> SOCKETS CONNECTED
 }
