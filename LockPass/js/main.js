window.onload = function() {

    var eCW = new CustomEvent('rotarydetent', {detail: {'direction': 'CW'}});
    var eCCW = new CustomEvent('rotarydetent', {detail: {'direction': 'CCW'}});
    var tester = document.querySelector('.tester');
    var tester2 = document.querySelector('.tester2');

    tester.addEventListener('click', function(e){
      e.preventDefault();
      document.dispatchEvent(eCW);
    });
    tester2.addEventListener('click', function(e){
      e.preventDefault();
      document.dispatchEvent(eCCW);
    });


    var number = document.querySelector('.number'),
        circle = document.querySelector('.circle'),
        body = document.querySelector('body'),
        session = localStorage.getItem('Session'),
        storeSecret = localStorage.getItem('secreto'),
        storedPassword = localStorage.getItem('combinationCode'),
        counter = 0,
        eventCount = 0,
        NumDegrees = 0,
        CombinationNumber = '',
        SecretMessage = '',
        StoredCombinationCode = '',
        TrialCombination = '';

    var ResetWheel = function(msg) {
        number.innerHTML = msg;
        setTimeout(function() {
            ResetCircle();
            Rotator(0);
        }, 1000);
    };
    var ResetCircle = function() {
        NumDegrees = 0;
        counter = 0;
        number.innerHTML = counter;
    };
    var Rotator = function(NumDegrees) {
        circle.style.webkitTransform = 'rotate(' + NumDegrees + 'deg)';
        circle.style.transform = 'rotate(' + NumDegrees + 'deg)';
    };
    var incrementNumDeg = function() {
        NumDegrees += 15;
        console.log('Increment: ', NumDegrees);
        Rotator(NumDegrees);
        counter++;
        if (number.innerHTML === '23') {
            counter = 0;
        }
    };
    var decreaseNumDeg = function() {
        NumDegrees -= 15;
        console.log('Decrease: ', NumDegrees);
        Rotator(NumDegrees);
        counter--;
        if (number.innerHTML === '0') {
            counter = 23;
        }
    };
    var PasswordChange = function() {
        var changePass = confirm('¿Cambiar Pass?');
        if (changePass === true) {
            body.className = '';
            StoredCombinationCode = '';
            eventCount = 0;
            localStorage.removeItem('combinationCode');
        } else {
            eventCount = 0;
        }
    };
    var SecretChange = function() {
        var changeSecret = confirm('¿Cambiar Secreto?');
        if (changeSecret === true) {
            storeSecret = '';
            StoredCombinationCode = '';
            localStorage.removeItem('secreto');
            SecretMessage = prompt('¿Tu Secreto?: ');
            localStorage.setItem('secreto', SecretMessage);
            storeSecret = localStorage.getItem('secreto');
        }
        eventCount = 0;
    };

    if (session) {
        body.className = 'stored';
    } else {
        alert('1 \nROTA para\n seleccionar un\n número');
        alert('2 \nPULSA para\n guardar');
    }
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === 'back') {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    document.addEventListener('rotarydetent', function(ev) {
        /* Get the direction value from the event */
        var direction = ev.detail.direction;

        //Turn ClockWise
        if (direction === 'CW') {
            incrementNumDeg();
        }
        //Turn Counter Clock Wise
        else if (direction === 'CCW') {
            decreaseNumDeg();
        }

        number.innerHTML = counter;
        CombinationNumber = '';
        CombinationNumber += number.textContent;
    });


    number.addEventListener('click', function() {
        if (CombinationNumber === '') {
            CombinationNumber = '0';
        }
        eventCount++;
        if (body.className === 'stored') {
            if (eventCount === 1) {
                TrialCombination = CombinationNumber;
                ResetWheel('👌');
            }
            if (eventCount === 2) {
                TrialCombination += CombinationNumber;
                ResetWheel('👌');
            } else if (eventCount === 3) {
                TrialCombination += CombinationNumber;
                if (TrialCombination === storedPassword) {
                    //Show storeSecret Message
                    alert('Tu Secreto: \n' + storeSecret);
                    //Ask if we want to change Password
                    PasswordChange();
                    SecretChange();
                    ResetWheel('👌');
                } else {
                    alert('INCORRECTO,\n Vuelve a probar');
                    eventCount = 0;
                    ResetWheel('🚫');
                }
                console.log(TrialCombination);
                CombinationNumber = '';
            }
        } else {
            StoredCombinationCode += CombinationNumber;
            if (eventCount === 3) {
                debugger;
                localStorage.setItem('combinationCode', StoredCombinationCode);
                localStorage.setItem('Session', true);
                alert('Tu \n código secreto:\n' + StoredCombinationCode);
                body.className = 'stored';
                eventCount = 0;
                if (storeSecret) {
                    SecretMessage = storeSecret;
                } else {
                    SecretChange();
                }
                storedPassword = localStorage.getItem('combinationCode');
                session = localStorage.getItem('Session');

                console.log(storedPassword);
                console.log(storeSecret);
                CombinationNumber = '';
            }
            ResetWheel('👌');
        }
    });
};