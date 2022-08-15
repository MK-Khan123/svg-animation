function polygons_animation(panel, deg = 180) {
    const tlPolygons = gsap.timeline({
        scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "center top",
            scrub: true,
        },
    });
    tlPolygons
        .to(
            "#yellow-polygon",
            {
                duration: 0.2,
                rotation: deg,
            },
            0
        )
        .to(
            "#blue-polygon",
            {
                duration: 0.2,
                rotation: deg,
            },
            0
        )
        .to(
            "#red-polygon",
            {
                duration: 0.2,
                rotation: deg,
            },
            0
        );

    return tlPolygons;
}

function smoothScroll(content, viewport, smoothness) {
    content = gsap.utils.toArray(content)[0];
    smoothness = smoothness || 0.7;

    gsap.set(viewport || content.parentNode, {
        overflow: "hidden",
        position: "fixed",
        height: "100vh",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    });
    gsap.set(content, { overflow: "visible", width: "100%" });

    let getProp = gsap.getProperty(content),
        setProp = gsap.quickSetter(content, "y", "px"),
        setScroll = ScrollTrigger.getScrollFunc(window),
        removeScroll = () => (content.style.overflow = "visible"),
        killScrub = (trigger) => {
            let scrub = trigger.getTween
                ? trigger.getTween()
                : gsap.getTweensOf(trigger.animation)[0];
            scrub && scrub.pause();
            trigger.animation.progress(trigger.progress);
        },
        height,
        isProxyScrolling;

    function refreshHeight() {
        height = content.clientHeight;
        content.style.overflow = "visible";
        document.body.style.height = height + "px";
        return height - document.documentElement.clientHeight;
    }

    ScrollTrigger.addEventListener("refresh", () => {
        removeScroll();
        requestAnimationFrame(removeScroll);
    });
    ScrollTrigger.defaults({ scroller: content });
    ScrollTrigger.prototype.update = (p) => p;

    ScrollTrigger.scrollerProxy(content, {
        scrollTop(value) {
            if (arguments.length) {
                isProxyScrolling = true;
                setProp(-value);
                setScroll(value);
                return;
            }
            return -getProp("y");
        },
        scrollHeight: () => document.body.scrollHeight,
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
    });

    return ScrollTrigger.create({
        animation: gsap.fromTo(
            content,
            { y: 0 },
            {
                y: () => document.documentElement.clientHeight - height,
                ease: "none",
                onUpdate: ScrollTrigger.update,
            }
        ),
        scroller: window,
        invalidateOnRefresh: true,
        start: 0,
        end: refreshHeight,
        refreshPriority: -999,
        scrub: smoothness,
        onUpdate: (self) => {
            if (isProxyScrolling) {
                killScrub(self);
                isProxyScrolling = false;
            }
        },
        onRefresh: killScrub,
    });
}
const panelOne = document.querySelector("#panel-one");
window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const panelTwo = document.querySelector("#panel-two");
    const panelThree = document.querySelector("#panel-three");
    const panelFour = document.querySelector("#panel-four");
    const panelFive = document.querySelector("#panel-five");
    //! cursor animation
    let cursor = document.querySelector(".cursor");
    let cursorScale = document.querySelectorAll(".cursor-scale");
    let cursorHover = document.querySelectorAll(".cursor-hover");
    let cursorInner = document.querySelector(".cursor-inner");
    let mouseX = 0;
    let mouseY = 0;

    gsap.to({}, 0.01, {
        repeat: -1,
        onRepeat: function () {
            gsap.set(cursor, {
                css: {
                    opacity: 1,
                    left: mouseX,
                    top: mouseY,
                },
            });
        },
    });
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    cursorScale.forEach((link) => {
        link.addEventListener("mousemove", () => {
            cursor.classList.add("grow");
            if (link.classList.contains("small")) {
                cursor.classList.remove("grow");
                cursor.classList.add("grow-small");
            }
        });

        link.addEventListener("mouseleave", () => {
            cursor.classList.remove("grow");
            cursor.classList.remove("grow-small");
        });
    });
    // cursorHover.forEach((link) => {
    //     const oldWidth = cursor.style.width;
    //     const oldHeight = cursor.style.height;
    //     const oldBg = cursor.style.background;
    //     const oldLeft = cursor.style.marginLeft;
    //     const oldTop = cursor.style.marginTop;
    //     link.addEventListener("mouseover", () => {
    //         cursor.style.width = "40px";
    //         cursor.style.height = "40px";
    //         cursor.style.background = "white";
    //         document.querySelector("body").style.cursor = "none";
    //         cursor.style.marginTop = "-15px";
    //         cursor.style.marginLeft = "-16px";
    //         cursorInner.style.display = "block";
    //     })
    //     link.addEventListener("mouseout", () => {
    //         document.querySelector("body").style.cursor = "default";
    //         cursor.style.width = oldWidth;
    //         cursor.style.height = oldHeight;
    //         cursor.style.background = oldBg;
    //         cursor.style.cursor = "pointer";
    //         cursor.style.marginTop = oldTop;
    //         cursor.style.marginLeft = oldLeft;
    //         cursorInner.style.display = "none";
    //     })
    // })
    // panel swap animation
    let panels = gsap.utils.toArray(".panel");
    ScrollTrigger.create({
        start: 0,
        end: "max",
        snap: 1 / (panels.length - 1),
        duration: 1,
    });

    //! name animation
    // function animateName() {
    //   var spanText = function spanText(text) {
    //     var string = text.innerText;
    //     var spaned = "";
    //     for (var i = 0; i < string.length; i++) {
    //       if (string.substring(i, i + 1) === " ")
    //         spaned += string.substring(i, i + 1);
    //       else spaned += "<span>" + string.substring(i, i + 1) + "</span>";
    //     }
    //     text.innerHTML = spaned;
    //   };

    //   let headline = document.querySelector(".cursor-scale");

    //   spanText(headline);

    //   let animations = document.querySelectorAll("h1");

    //   animations.forEach((animation) => {
    //     let letters = animation.querySelectorAll("span");
    //     letters.forEach((letter, i) => {
    //       letter.style.animationDelay = i * 0.1 + "s";
    //     });
    //   });

    //   let animationStep2 = document.querySelector(
    //     ".cursor-scale span:last-of-type"
    //   );
    //   animationStep2.addEventListener("animationend", () => {
    //     headline.classList.add("animation--step-2");
    //     setTimeout(() => {
    //       headline.classList.remove("animation--step-2");
    //       headline.classList.add("animation--step-3");
    //     }, 1000);
    //   });
    // }
    // setInterval(animateName, 2000);

    //! smooth scroll animation
    smoothScroll("#smooth-content");

    // panel one starts
    gsap
        .timeline({
            scrollTrigger: {
                trigger: panelOne,
                start: "top bottom",
                end: "+=100%",
                scrub: true,
            },
        })
        .to(
            "#blue-ellipse",
            {
                x: '639px',                
                y: "90rem",
                rotation: "135deg",
                duration: 1,
            },
            0
        )
        .to(
            "#gray-ellipse",
            {
                rotation: "180deg",
                y: "50rem",
                x: "-50rem",
                duration: 1,
            },
            0
        )
        .to(
            "#hidden-gray-ellipse",
            {
                x: "40rem",
                y: "10rem",
                rotation: -345,
                duration: 1,
            },
            0
        )
        .to(
            "#red-ellipse",
            {
                rotate: "180deg",
                // x: "10rem",
                y: "55rem",
                duration: 1,
            },
            0
        )
        .to(
            "#panel-three-gray-ellipse",
            {
                y: "90rem",
                duration: 1,
            },
            0
        )
        .to(
            "#polygons",
            {
                x: "-50rem",
                y: "58rem",
                duration: 1,
            },
            0
        )
        .add(polygons_animation(panelOne));
    //! panel one ends

    //! panel two starts
    gsap
        .timeline({
            scrollTrigger: {
                trigger: panelTwo,
                start: "top bottom",
                end: "+=100%",
                scrub: true
            },
        })
        .to(
            "#blue-ellipse",
            {
                x: "15rem",
                y: "150.5rem",
                rotation: "-163deg",
                duration: 1,
            },
            0
        )
        .to(
            "#gray-ellipse",
            {
                rotation: "-180deg",
                x: "5rem",
                y: "115rem",
                duration: 1,
            },
            0
        )
        .to(
            "#red-ellipse",
            {
                rotate: "-180deg",
                x: "-5.2rem",
                y: "116rem",
                duration: 1,
            },
            0
        )
        .to(
            "#hidden-gray-ellipse",
            {
                rotation: "-5deg",
                duration: 1,
            },
            0
        )
        .to(
            "#panel-three-gray-ellipse",
            {
                x: "30rem",
                y: "160rem",
                rotation: 120,
                duration: 1,
            },
            0
        )
        .to(
            "#panel-three-red-ellipse",
            {
                rotation: -220,
                duration: 1,
            },
            0
        )
        .to(
            "#polygons",
            {
                x: "15rem",
                y: "100rem",
                duration: 1,
            },
            0
        )
        .add(polygons_animation(panelTwo, 250));
    //! panel two ends

    //PANEL 3 STARTS
    gsap.timeline({
        scrollTrigger: {
            trigger: panelThree,
            start: "top bottom",
            end: "+=100%",
            scrub: true
        },
    })
        .to(
            "#blue-ellipse",
            {
                x: "40rem",
                y: "210rem",
                rotation: -10,
                duration: 1,
            }
        )
        .to(
            "#gray-ellipse",
            {
                x: "-45rem",
                y: "130rem",
                rotation: "270deg",
                duration: 1,
            },
            0
        )
        .to(
            "#panel-three-gray-ellipse",
            {
                x: "-57rem",
                y: "190rem",
                rotation: -30,
                duration: 1,
            },
            0
        )
        .to(
            "#panel-three-red-ellipse",
            {
                rotation: 440,
                duration: 1,
            },
            0
        )
        .to(
            "#polygons",
            {
                x: "-55rem",
                y: "160rem",
                duration: 1,
            },
            0
        )
        .add(polygons_animation(panelThree, 300))
        .add(hoverOverServices);
    //PANEL 3 ENDS

    //PANEL 4 STARTS
    gsap
        .timeline({
            scrollTrigger: {
                trigger: panelFour,
                start: "top bottom",
                end: "+=100%",
                scrub: true,
            },
        })
        .to(
            "#blue-ellipse",
            {
                x: "9rem",
                y: "240rem",
                rotation: -244,
                duration: 1,
            },
            0
        )
        .to(
            "#panel-three-gray-ellipse",
            {
                x: "50rem",
                y: "250rem",
                rotation: 360,
                duration: 1,
            },
            0
        )
        .to(
            "#panel-three-red-ellipse",
            {
                x: '-55rem',
                y: '-45',
                rotation: 320,
                duration: 1,
            },
            0
        )
        .to(
            "#panel-four-gray-ellipse",
            {
                rotation: 100,
                x: "-6rem",
                y: "40rem",
                duration: 1,
            },
            0
        )
        .to(
            "#panel-five-red-ellipse",
            {
                x: "-150rem",
                rotation: 100,
                duration: 1,
            },
            0
        )
        .to(
            "#panel-five-gray-ellipse",
            {
                rotation: 90,
                x: "35rem",
                y: "-5rem",
                duration: 1,
            },
            0
        )
        .to(
            "#yellow-polygon",
            {
                x: "20rem",
                y: "105rem",
                rotation: "-280deg",
            },
            0
        )
        .to(
            "#blue-polygon",
            {
                x: "15rem",
                y: "75rem",
                rotation: "-280deg",
            },
            0
        )
        .to(
            "#red-polygon",
            {
                x: "10rem",
                y: "45rem",
                rotation: "-280deg",
            },
            0
        );

    //PANEL 5 STARTS
    gsap
        .timeline({
            scrollTrigger: {
                trigger: panelFive,
                start: "top bottom",
                end: "+=100%",
                scrub: true,
            },
        })
        .to(
            "#panel-four-gray-ellipse",
            {
                x: "-150rem",
                y: "85rem",
                rotation: 270,
                duration: 1,
            },
            0
        )
        .to(
            "#blue-ellipse",
            {
                x: "41rem",
                y: "316rem",
                rotation: 0,
                duration: 1,
            },
            0
        )
        .to(
            "#panel-five-gray-ellipse",
            {
                rotation: -20,
                x: "15rem",
                y: "8rem",
                duration: 1,
            },
            0
        )
        .to(
            "#panel-five-red-ellipse",
            {
                x: "-50rem",
                rotation: -270,
                duration: 1,
            },
            0
        );

    //! vision and mission panel
    document.querySelector("#vision").addEventListener("click", () => {
        gsap
            .timeline()
            .to(
                "#vision-panel",
                {
                    duration: 1,
                    opacity: 1,
                    right: "15em",
                    display: "block",
                },
                0
            )
            .to(
                "#vision",
                {
                    duration: 1,
                    opacity: 0,
                },
                0
            )
            .to(
                "#vision-text",
                {
                    duration: 1,
                    opacity: 0,
                },
                0
            );
        gsap
            .timeline()
            .to(
                "#mission-panel",
                {
                    display: "none",
                },
                0
            )
            .to(
                "#mission",
                {
                    opacity: 0.5,
                    display: "block",
                },
                1
            )
            .to(
                "#mission-text",
                {
                    opacity: 1,
                    display: "block",
                },
                1
            );
    });

    document.querySelector("#vision-panel").addEventListener("click", () => {
        gsap
            .timeline()
            .to(
                "#vision-panel",
                {
                    duration: 1,
                    right: "20em",
                    display: "none",
                },
                0
            )
            .to(
                "#vision",
                {
                    duration: 1,
                    display: "block",
                    opacity: 0.5,
                },
                1
            )
            .to(
                "#vision-text",
                {
                    duration: 1,
                    opacity: 1,
                    display: "block",
                },
                1
            );
    });

    document.querySelector("#mission").addEventListener("click", () => {
        gsap
            .timeline()
            .to(
                "#mission-panel",
                {
                    duration: 1,
                    left: "15em",
                    display: "block",
                },
                0
            )
            .to(
                "#mission",
                {
                    duration: 1,
                    opacity: 0,
                    display: "none",
                },
                0
            )
            .to(
                "#mission-text",
                {
                    duration: 1,
                    opacity: 0,
                },
                0
            );
        gsap
            .timeline()
            .to(
                "#vision-panel",
                {
                    display: "none",
                },
                0
            )
            .to(
                "#vision",
                {
                    duration: 1,
                    display: "block",
                    opacity: 0.5,
                },
                1
            )
            .to(
                "#vision-text",
                {
                    duration: 1,
                    opacity: 1,
                    display: "block",
                },
                1
            );
    });

    document.querySelector("#mission-panel").addEventListener("click", () => {
        gsap
            .timeline()
            .to(
                "#mission-panel",
                {
                    duration: 1,
                    left: "20em",
                    display: "none",
                },
                0
            )
            .to(
                "#mission",
                {
                    duration: 1,
                    opacity: 0.5,
                    display: "block",
                },
                1
            )
            .to(
                "#mission-text",
                {
                    duration: 1,
                    opacity: 1,
                    display: "block",
                },
                1
            );
    });
    //! vision and mission panel ends

    //! healthcare and automation panel
    const contents_to_toggle = [
        "#about-main-heading",
        "#about-main-body",
        "#vision-missions",
        "#healthcare-btn",
        "#automation-btn",
        "#automation-text-box",
    ];

    //! healthcare panel
    document.querySelector("#healthcare-btn").addEventListener("click", () => {
        gsap
            .timeline()
            .to(
                "#healthcare-panel",
                {
                    duration: 1,
                    display: "block",
                    x: "-3.5rem",
                    y: "-17rem",
                },
                0
            )
            .to(
                ".healthcare-panel-how-text-box",
                {
                    duration: 1,
                    opacity: 1,
                },
                1.5
            );
        gsap.utils.toArray(contents_to_toggle).forEach((element) => {
            gsap.to(element, {
                duration: 1,
                opacity: 0,
            });
        });

        gsap.utils
            .toArray([
                ".healthcare-panel-content-heading",
                ".healthcare-panel-content-text",
            ])
            .forEach((element) => {
                gsap.to(element, {
                    duration: 2,
                    opacity: 1,
                });
            });
    });

    document.querySelector("#healthcare-panel").addEventListener("click", (e) => {
        if (
            !e.target.classList.contains("how-text") &&
            !e.target.classList.contains("healthcare-panel-how-text-box")
        ) {
            gsap.timeline().to("#healthcare-panel", {
                duration: 1,
                display: "none",
                x: "-100rem",
                y: "-19.5rem",
            });
            gsap.utils.toArray(contents_to_toggle).forEach((element) => {
                gsap.to(element, {
                    duration: 2,
                    opacity: 1,
                });
            });

            // remove the how-text-box when click healthcare panel
            gsap.to(".healthcare-panel-how-text-box", {
                duration: 1,
                opacity: 0,
            });
        }
    });

    // automation animation
    document
        .querySelector(".healthcare-panel-how-text-box")
        .addEventListener("click", () => {
            gsap.timeline().to("#automation-text-box", {
                duration: 1,
                opacity: 1,
                y: "-1em",
            });

            gsap.utils
                .toArray([
                    ".healthcare-panel-content-heading",
                    ".healthcare-panel-content-text",
                    ".healthcare-panel-how-text-box",
                ])
                .forEach((element) => {
                    gsap.to(element, {
                        duration: 2,
                        opacity: 0,
                    });
                });
        });

    //! automation panel
    document.querySelector("#automation-btn").addEventListener("click", () => {
        gsap.timeline().to(
            "#automation-panel",
            {
                duration: 1,
                display: "block",
                x: "3.5rem",
                y: "-19.5rem",
            },
            0
        );
        gsap.utils.toArray(contents_to_toggle).forEach((element) => {
            gsap.to(element, {
                duration: 1,
                opacity: 0,
            });
        });
        gsap
            .timeline()
            .to(
                "#animated-circles-1",
                {
                    duration: 1,
                    x: "-24rem",
                    y: "0rem",
                },
                1
            )
            .to(
                "#animated-circles-text-1",
                {
                    duration: 1,
                    opacity: 1,
                    x: "38rem",
                    y: "8rem",
                },
                1
            )
            .to(
                "#animated-circles-2",
                {
                    duration: 1,
                    x: "-22rem",
                    y: "-8rem",
                },
                1.2
            )
            .to(
                "#animated-circles-text-2",
                {
                    duration: 1,
                    opacity: 1,
                    x: "39rem",
                    y: "-0.5rem",
                },
                1.2
            )
            .to(
                "#animated-circles-3",
                {
                    duration: 1,
                    x: "-18rem",
                    y: "-16rem",
                },
                1.4
            )
            .to(
                "#animated-circles-text-3",
                {
                    duration: 1,
                    opacity: 1,
                    x: "40rem",
                    y: "-9rem",
                },
                1.4
            )
            .to(
                "#animated-circles-4",
                {
                    duration: 1,
                    x: "-10rem",
                    y: "-20rem",
                },
                1.6
            )
            .to(
                "#animated-circles-5",
                {
                    duration: 1,
                    x: "-1rem",
                    y: "-20rem",
                },
                1.8
            );
    });

    document.querySelector("#automation-panel").addEventListener("click", (e) => {
        gsap.timeline().to("#automation-panel", {
            duration: 1,
            display: "none",
            x: "100rem",
            y: "-19.5rem",
        });
        gsap.utils.toArray(contents_to_toggle).forEach((element) => {
            gsap.to(element, {
                duration: 2,
                opacity: 1,
            });
        });
        gsap
            .timeline()
            .to(
                "#animated-circles-1",
                {
                    duration: 1,
                    x: "0rem",
                    y: "0rem",
                },
                1
            )
            .to(
                "#animated-circles-text-1",
                {
                    duration: 1,
                    opacity: 0,
                    x: "0rem",
                    y: "0rem",
                },
                1
            )
            .to(
                "#animated-circles-2",
                {
                    duration: 1,
                    x: "0rem",
                    y: "0rem",
                },
                1.2
            )
            .to(
                "#animated-circles-text-2",
                {
                    duration: 1,
                    opacity: 0,
                    x: "0rem",
                    y: "0rem",
                },
                1.2
            )
            .to(
                "#animated-circles-3",
                {
                    duration: 1,
                    x: "0rem",
                    y: "0rem",
                },
                1.4
            )
            .to(
                "#animated-circles-text-3",
                {
                    duration: 1,
                    opacity: 0,
                    x: "0rem",
                    y: "0rem",
                },
                1.4
            )
            .to(
                "#animated-circles-4",
                {
                    duration: 1,
                    x: "0rem",
                    y: "0rem",
                },
                1.6
            )
            .to(
                "#animated-circles-5",
                {
                    duration: 1,
                    x: "0rem",
                    y: "0rem",
                },
                1.8
            );
    });
    //! healthcare and automation panel ends

    document.querySelector("#slider-btn").addEventListener("click", function (e) {
        const slider = document.querySelector("#work-main-slider");

        if (slider.style.left !== "50%") {
            gsap
                .timeline()
                .to(
                    slider,
                    {
                        // duration: .5,
                        css: {
                            left: "50%",
                        },
                        onEnd: function () {
                            document
                                .querySelector("#slider-btn")
                                .classList.add("active-slide");
                        },
                    },
                    0.4
                )
                .to(
                    "#work-main-content-one",
                    {
                        opacity: 1,
                    },
                    0.4
                )
                .to(
                    "#work-main-content-two",
                    {
                        opacity: 0,
                    },
                    0.4
                );
        } else {
            gsap
                .timeline()
                .to(
                    slider,
                    {
                        css: {
                            left: "0",
                        },
                        onEnd: function () {
                            document
                                .querySelector("#slider-btn")
                                .classList.remove("active-slide");
                        },
                    },
                    0.4
                )
                .to(
                    "#work-main-content-one",
                    {
                        opacity: 0,
                    },
                    0.4
                )
                .to(
                    "#work-main-content-two",
                    {
                        opacity: 1,
                    },
                    0.4
                );
        }
    });
});

// name animation
var spanText = function spanText(text) {
    var string = text.innerText;
    var spaned = "";
    for (var i = 0; i < string.length; i++) {
        if (string.substring(i, i + 1) === " ")
            spaned += string.substring(i, i + 1);
        else
            spaned +=
                "<span class='heading-animation dark-mode-heading-change '>" +
                string.substring(i, i + 1) +
                "</span>";
    }
    text.innerHTML = spaned;
};

let headline = document.querySelector("#header-name");

spanText(headline);

let animations = document.querySelectorAll("h1");

animations.forEach((animation) => {
    let letters = animation.querySelectorAll("span");
    letters.forEach((letter, i) => {
        letter.style.animationDelay = i * 0.1 + "s";
    });
});

let animationStep2 = document.querySelector("h1 span:last-of-type");
let animationStep3 = document.querySelector("h1::before");
animationStep2.addEventListener("animationend", () => {
    headline.classList.add("animation--step-2");
    setTimeout(() => {
        headline.classList.remove("animation--step-2");
        headline.classList.add("animation--step-3");
    }, 1000);
});

let clearScroll;
//auto scroll after name animation is finished
// const autoScroll = (time) => {
//     clearScroll = setTimeout(function () {
//         const panelOneCooard = panelOne.getBoundingClientRect();
//         window.scrollTo(panelOneCooard.left, 400);
//     }, time);
// };

// autoScroll(3000);

// when we are at the top of the page, auto scroll to the panel one
window.addEventListener("scroll", () => {
    const windowCoord = document.documentElement.getBoundingClientRect();
    if (windowCoord.y === 0) {
        autoScroll(1200);
    }
});

// light mode for desktop
const darkMode = document.querySelector(".dark-mode");
const lightMode = document.querySelector(".light-mode");
const headingAnimation = document.querySelector(".heading-animation");
const missionPanel = document.querySelector("#mission-panel");
const vissionPanel = document.querySelector("#vision-panel");
const nav = document.querySelector("nav");
const smoothWrapper = document.querySelector("#smooth-wrapper");
const redEllispse = document.querySelector("#red-ellipse");
const visionPanel = document.querySelector("#vision-panel");
const arrow = document.querySelector(".arrow");
const healthCareBtn = document.querySelector("#healthcare-btn");
const automationBtn = document.querySelector("#automation-btn");
const inputText = document.querySelectorAll(".input-text");
const darkLogo = document.querySelector(".dark-logo");
const lightLogo = document.querySelector(".light-logo");
const linkedInDarkLogo = document.querySelector(".linkedIn-dark-logo");
const linkedInLightLogo = document.querySelector(".linkedIn-light-logo");
const automationTextBox = document.querySelector("#automation-text-box");
const pageFooter = document.querySelector("#page-footer");
const grayRingLight = document.querySelector(".gray-ring-light");
const grayRingDark = document.querySelector(".gray-ring-dark");
const sliderBtn = document.querySelector("#slider-btn");
const navLinks = document.querySelector(".nav-links");
const hamburgherIcon = document.querySelector(".hamburger-icon");

// mission and vission panel background blur
function blurMissionVisionPanel(selector, color, shadow) {
    selector.style.background = color;
    selector.style.boxShadow = shadow;
}

function modeChange(textColor, backgroundColor) {
    document.body.style.backgroundColor = backgroundColor;
    nav.style.color = textColor;
    smoothWrapper.style.color = textColor;

    document
        .querySelectorAll("#panel-one-content-body div p")
        .forEach(function (el) {
            el.style.color = textColor;
        });

    // panel two heading
    document.querySelector("#about-main-heading h2").style.color = textColor;
    document.querySelector("#about-main-heading p").style.color = textColor;

    // panel two vision
    visionPanel.style.color = textColor;
    blurMissionVisionPanel(
        vissionPanel,
        "linear-gradient(94.85deg, rgba(86, 93, 255, 0.1278) 97.05%, rgba(160, 160, 160, 0.0234) 100.14%)",
        " 8px 8px 4px rgba(0, 0, 0, 0.25)"
    );

    // panel two mission
    missionPanel.style.color = textColor;
    blurMissionVisionPanel(
        missionPanel,
        "linear-gradient(94.85deg, rgba(86, 93, 255, 0.1278) 97.05%, rgba(160, 160, 160, 0.0234) 100.14%)",
        " 8px 8px 4px rgba(0, 0, 0, 0.25)"
    );

    // panel three heading
    document.querySelector("#work-main-heading-one").style.color = textColor;
    document.querySelector("#work-main-content-one h1").style.color = textColor;
    document.querySelector("#work-main-content-two h1").style.color = textColor;

    // panel three footer
    healthCareBtn.style.color = textColor;
    automationBtn.style.color = textColor;

    // panel two healthcare
    document.querySelector("#healthcare-panel-content h1").style.color =
        textColor;
    document.querySelector("#healthcare-panel-content p").style.color = textColor;

    // panel two automation
    document.querySelector("#automation-panel-content h1").style.color =
        textColor;
    document.querySelector("#automation-panel-content p").style.color = textColor;

    // work
    automationTextBox.style.color = textColor;

    // contact from
    inputText.forEach((input) => {
        input.style.color = textColor;
    });
}

function lightVersion() {
    darkMode.classList.toggle("hide");
    lightMode.classList.toggle("hide");

    // change light mode
    modeChange("#000", "#EBF3FF");

    // gray ring color change
    const ellipses = gsap.utils.toArray([
        "#hidden-gray-ellipse",
        "#gray-ellipse",
    ]);
    gsap.to(ellipses, {
        duration: 0.1,
        css: {
            filter:
                "invert(49%) sepia(47%) saturate(221%) hue-rotate(192deg) brightness(88%) contrast(85%)",
        },
    });

    // logo change
    darkLogo.classList.add("logo-hide");
    lightLogo.classList.remove("logo-hide");

    //heading color change
    document.querySelectorAll("#header-name span").forEach((span) => {
        span.classList.add("light-mode-heading-change");
        span.classList.remove("dark-mode-heading-change");
    });

    // panel one change mode
    document
        .querySelector("#panel-one-content-heading>h1")
        .classList.remove("dark");
    document
        .querySelector("#panel-one-content-heading>h1")
        .classList.add("light");

    // panel one text
    document
        .querySelector("#panel-one-content-heading p")
        .classList.add("light-text");
    document
        .querySelector("#panel-one-content-heading p")
        .classList.remove("dark-text");

    //slider btn
    sliderBtn.style.border = "1px solid #1f2937";
    const borderB =
        window.getComputedStyle(arrow, ":before").borderBottom + " #1f2937";
    const borderR = window.getComputedStyle(arrow, ":after").borderRight;

    //footer color change
    pageFooter.style.background =
        "linear-gradient(89.63deg, rgba(31, 41, 55, 0.58) 0.56%, rgba(31, 41, 55, 0.58) 165.89%";

    // footer logo change
    linkedInDarkLogo.classList.add("logo-hide");
    linkedInLightLogo.classList.remove("logo-hide");
}

function darkVersion() {
    lightMode.classList.toggle("hide");
    darkMode.classList.toggle("hide");

    //change dark mode
    modeChange("#fff", "#1F2937");

    // loogo change
    darkLogo.classList.remove("logo-hide");
    lightLogo.classList.add("logo-hide");

    // gray ring color change
    const ellipses = gsap.utils.toArray([
        "#hidden-gray-ellipse",
        "#gray-ellipse",
    ]);
    gsap.to(ellipses, {
        duration: 0.1,
        css: {
            filter: "none",
        },
    });

    //heading color change
    document.querySelectorAll("#header-name span").forEach((span) => {
        span.classList.add("dark-mode-heading-change");
        span.classList.remove("light-mode-heading-change");
    });

    // panel one heading
    document
        .querySelector("#panel-one-content-heading>h1")
        .classList.remove("light");
    document.querySelector("#panel-one-content-heading>h1").classList.add("dark");

    // panel one text
    document
        .querySelector("#panel-one-content-heading p")
        .classList.add("dark-text");
    document
        .querySelector("#panel-one-content-heading p")
        .classList.remove("light-text");

    //slider btn
    sliderBtn.style.border = "1px solid rgba(255, 255, 255, 0.1)";

    //footer logo change
    linkedInDarkLogo.classList.remove("logo-hide");
    linkedInLightLogo.classList.add("logo-hide");
}

//!light  mode
darkMode.addEventListener("click", () => {
    lightVersion();
});

// dark mode
lightMode.addEventListener("click", () => {
    darkVersion();
});

//mobile responsive
hamburgherIcon.addEventListener("click", () => {
    navLinks.classList.toggle("add-opactiy");
});


//PANEL 3 (SERVICES SECTION FUNCTIONS)

//This function starts the rotation animation of the services section on mouse enter event.
function hoverOverServices() {

    console.log("im in");

    const title = document.getElementById('services-title');
    const tagline = document.getElementById('services-tagline');
    const servicesIcon = document.getElementById('ai-vector');

    const topLeftArrow = document.getElementById('top-left-arrow');
    const topRightArrow = document.getElementById('top-right-arrow');
    const bottomLeftArrow = document.getElementById('bottom-left-arrow');
    const bottomRightArrow = document.getElementById('bottom-right-arrow');

    const migration = document.getElementById('migration');
    const automation = document.getElementById('automation');
    const engineering = document.getElementById('engineering');
    const visualization = document.getElementById('visualization');

    topLeftArrow.style.visibility = 'visible';
    topRightArrow.style.visibility = 'visible';
    bottomLeftArrow.style.visibility = 'visible';
    bottomRightArrow.style.visibility = 'visible';

    migration.style.visibility = 'visible';
    automation.style.visibility = 'visible';
    engineering.style.visibility = 'visible';
    visualization.style.visibility = 'visible';

    title.style.visibility = 'hidden';
    tagline.style.visibility = 'hidden';

    //This class is added for smooth rotation of the AI Vector Icon
    servicesIcon.classList.add('ai-vector-hover');
}

let services = [];

//This function removes all the active animation of the selected service (like migration, automation, etc.), when we try to select another circular shaped bubble (with services name on it e.g; migration, automation, etc.) without clicking on the larger circle. When we click on the larger circle (one with the service details), the animation class gets removed.
const removePreviousAnimation = (id, direction) => {

    if (services.length === 0) {
        services.push({
            service_name: id,
            position: direction,
        });
    } else if (services.length > 0) {

        services.map(feature => {
            const { service_name, position } = feature;

            const service = document.getElementById(service_name);
            const serviceArrow = document.getElementById(`${position}-arrow`);
            const serviceDetails = document.getElementById(`${service_name}-details`);

            //First removes fading out animation classes
            service.classList.remove(`${service_name}-circle-fading-out`);
            serviceArrow.classList.remove(`${position}-arrow-fading-out`);

            //Then adds fading in animation classes
            service.classList.add(`${service_name}-circle-fading-in`);
            serviceArrow.classList.add(`${position}-arrow-fading-in`);

            //To make the service details circular shape (the larger circle) appear smoothly in a transition.
            serviceDetails.style.animation = 'fadeOut 0.5s';
            serviceDetails.style.animationFillMode = "forwards";
            setTimeout(() => {
                serviceDetails.style.visibility = 'hidden';
            }, 500);
        });

        services = [];

        services.push({
            service_name: id,
            position: direction,
        });
    }
};

function fadingAnimation(id, direction) {

    const animation = document.getElementById(`${id}`);
    const arrow = document.getElementById(`${direction}-arrow`);
    const animationDetails = document.getElementById(`${id}-details`);

    if (animation.classList.contains(`${id}-circle-fading-out`) === false) {

        removePreviousAnimation(id, direction);

        //Removes previously selected animation classes
        animation.classList.remove(`${id}-circle-fading-in`);
        arrow.classList.remove(`${direction}-arrow-fading-in`);

        animation.classList.add(`${id}-circle-fading-out`);
        arrow.classList.add(`${direction}-arrow-fading-out`);

        animationDetails.style.visibility = 'visible';
        animationDetails.style.animation = 'fadeIn 1s';
        animationDetails.style.animationFillMode = "forwards";

    } else if (animation.classList.contains(`${id}-circle-fading-in`) === false) {

        animation.classList.remove(`${id}-circle-fading-out`);
        arrow.classList.remove(`${direction}-arrow-fading-out`);

        animation.classList.add(`${id}-circle-fading-in`);
        arrow.classList.add(`${direction}-arrow-fading-in`);

        //To make the service details circular shape (the larger circle) disappear smoothly.
        animationDetails.style.animation = 'fadeOut 0.5s';
        animationDetails.style.animationFillMode = "forwards";
        setTimeout(() => {
            animationDetails.style.visibility = 'hidden';
        }, 500);

        services = [];
    }
};