$(document).ready(function(){
    var header = document.querySelector('.header');
    document.onscroll = function () {
        if(window.pageYOffset >= 100 && document.body.offsetWidth >= 992 || window.pageYOffset >= 240 && document.body.offsetWidth < 992){
            header.classList.add('header-fixHead');
        } else {
            header.classList.remove('fixHead');
        }
    };

//slick-slider//
    $('.slider').slick({
        arrows: false,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    });

    $('.reviews-slider').slick({
        arrows: true,
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,

        prevArrow: '<div class="reviews-control-prev"><svg class="bi bi-chevron-left" width="50" height="50" viewBox="0 0 20 20" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6.646 3.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L12.293 10 6.646 4.354a.5.5 0 010-.708z"/></svg></div>',
        nextArrow: '<div class="reviews-control-next"><svg class="bi bi-chevron-right" width="50" height="50" viewBox="0 0 20 20" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6.646 3.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L12.293 10 6.646 4.354a.5.5 0 010-.708z"/></svg></div>'
    });


    $('.small-img-item').click(function() {
        $('.small-img-item').removeClass('active-present');
        $(this).addClass("active-present");
        let attr = $(this)[0].getAttribute('src');
        let src = $('.big-img img').attr('src');
        $('.big-img img').attr('src', attr);
    });


    // Smooth scroll
    $(".smoothscroll").click(function (event) {
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();
            // Store hash
            var hash = this.hash;
            // Using jQuery's animate() method to add smooth page scroll
            $("html, body").animate(
                {
                    scrollTop: $(hash).offset().top
                },
                400
            );
        }
    });
})

//timer//
document.addEventListener("DOMContentLoaded", function () {
    try {
        // countdown
        let dateEnd = new Date();
        dateEnd.setDate(dateEnd.getDay() ? dateEnd.getDate() - dateEnd.getDay() + 8 : dateEnd.getDate() + 1);
        dateEnd.setHours(0, 0, 0);
        let countdown = new LightCountdown(".countdown-week", dateEnd, {
            animation: "animated flipInX",
            animationDuration: "600ms"
        });
    } catch (e) {
        console.error(e);
    }

    // animate block sale in header
    var headerBlock = document.getElementById("main");
    var moveBlock = document.getElementById("saleBlock");
    var maxClientX = document.body.offsetWidth;
    var maxClientY = document.body.offsetHeight*0.8;
    // set default animate delay
    moveBlock.style.transition = "0s";

    function blockStop() {
        moveBlock.style.transform = `translate(${0}px,${0}px)`;
    }

    function blockMove(event) {
        moveBlock.style.transform = `translate(${-event.clientX/4}px,${-event.clientY/4}px)`;
    }

    headerBlock.addEventListener("mousemove", function (event) {
        if(document.body.offsetWidth > 1200){
            blockMove(event);
            if (event.clientX > maxClientX || event.clientY > maxClientY) {
                blockStop();
            }
        }
    });
    headerBlock.addEventListener("mouseout", function () {
        blockStop();
    });


});

$(document).ready(function () {
    // Form submit
    $("form").submit(function (event) {
        event.preventDefault();

        if (typeof sessionStorage !== 'undefined') {
            if (sessionStorage.getItem('formSubmitted')) {
                if (!confirm('Вы уже отправили заявку, повторить?')) { return false }
            } else {
                sessionStorage.setItem('formSubmitted', 'true')
            }
        }
        let presentId = $('.active-present')[0].getAttribute('id');
        let data = $(this).serializeArray();
        data.push({
            name: "source",
            value: "Test"
        });
        data.push({
            name: "title",
            value: "Test message"
        });
        data.push({
            name: "link",
            value: location.href
        });
        data.push({
            name: "presentId",
            value: presentId
        });

        console.log(JSON.stringify(data));
        return false; // Testing

        $.ajax({
            type: "POST",
            url: "https://skidka-tut.by/action/index.php",
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            dataType: "json",
            data: data,
        }).done(function (response) {
            alert(response.text);
        }).fail(function (error, textStatus) {
            console.log(error, textStatus);
            alert('Извините, произошла ошибка запроса. Свяжитесь с менеджером по телефону!');
        });

        // Event dispatcher for IE9+ included
        if (typeof (Event) === 'function') {
            document.dispatchEvent(new Event('app.form.send'));
        } else {
            var ev = document.createEvent('Event');
            ev.initEvent('app.form.send', false, false);
            document.dispatchEvent(ev);
        }

        console.log(JSON.stringify(data));
        return false
    });
});

function submitPresentModal() {
    $('.preview-present').remove();
    $('.modal-present').css('z-index', 1);
    let attr = $('.active-present')[0].getAttribute('src');
    let img = $("<img>");
    let presentImg = $('.present-img');
    img.attr('src',attr);
    img.addClass("preview-present");
    presentImg.append(img);
}

let HIDDEN_CLASS_NAME = 'hidden'
let TARGET_CLASS_NAME = 'target'
let SOURCE_CLASS_NAME = 'source'

let targetIdToShow = 1

function main() {
    let targets = getElements(TARGET_CLASS_NAME)
    let sources = getElements(SOURCE_CLASS_NAME)
    sources.forEach(function (sourceNode) {
        let sourceNodeId = extractId(sourceNode, SOURCE_CLASS_NAME)
        sourceNode.addEventListener('click', function () {
            showTarget(targets, sourceNodeId)
        })
    })
    showTarget(targets, targetIdToShow)
}

function getElements(type) {
    return [].slice.call(document.querySelectorAll('.' + type)).sort(function (targetNode1, targetNode2) {
        let target1Num = extractId(targetNode1, TARGET_CLASS_NAME)
        let target2Num = extractId(targetNode2, TARGET_CLASS_NAME)
        return target1Num > target2Num
    })
}

function extractId(targetNode, baseClass) {
    let currentClassIndex = targetNode.classList.length
    while (currentClassIndex--) {
        let currentClass = targetNode.classList.item(currentClassIndex)
        let maybeIdNum = parseInt(currentClass.split('-')[1])
        if (isNaN(maybeIdNum)) {
            continue
        }
        let classStrinToValidate = baseClass + '-' + maybeIdNum
        if (classStrinToValidate === currentClass) {
            return maybeIdNum
        }
    }
}

function showTarget(targets, targetId) {
    targets.forEach(function (targetNode, targetIndex) {
        let currentTargetNodeId = extractId(targetNode, TARGET_CLASS_NAME)
        if (currentTargetNodeId === targetId) {
            targetNode.classList.remove(HIDDEN_CLASS_NAME)
        } else {
            targetNode.classList.add(HIDDEN_CLASS_NAME)
        }
    })
}

main()

$('#modal-present-item').on('hidden.bs.modal', function (e) {
    $('.modal-present').css('z-index', 1050);
})


$(".nav-link").click(function(a) {
    "" !== this.hash && (a.preventDefault(), a = this.hash, $("html, body").animate({
        scrollTop: $(a).offset().top
    }, 400))
});

