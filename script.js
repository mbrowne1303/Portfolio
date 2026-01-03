let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document
                    .querySelector("header nav a[href*='" + id + "']")
                    .classList.add('active');
            })
        }
    })
}

menuIcon.onclick = () => {
    navbar.classList.toggle('active');
    menuIcon.classList.toggle("open");
}


/* ------------------------------------------------
   VIDEO CAROUSEL (FULL + FIXED)
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const group = document.querySelector(".video-group");
    const videos = document.querySelectorAll(".video-group video");
    if (!group || videos.length === 0) return;

    const total = videos.length;
    const angle = 360 / total;
    const radius = 450;
    const baseHeight = 260;

    let activeVideo = null;

    // SETUP video size + circular placement
    videos.forEach((vid, i) => {
        vid.addEventListener("loadedmetadata", () => {
            const aspect = vid.videoWidth / vid.videoHeight;
            const width = baseHeight * aspect;

            vid.style.width = `${width}px`;
            vid.style.height = `${baseHeight}px`;
            vid.style.left = `calc(50% - ${width / 2}px)`;

            vid.dataset.angle = i * angle;

            vid.style.transform =
                `rotateY(${vid.dataset.angle}deg) translateZ(${radius}px)`;
        });

        // CLICK VIDEO → bring forward
    vid.addEventListener("click", (e) => {
        e.stopPropagation();

        // Clicking same video closes it
        if (activeVideo === vid) {
            resetVideo(vid);
            activeVideo = null;
            return;
        }

        // Close previous active one
        if (activeVideo) resetVideo(activeVideo);

        activeVideo = vid;

        // PAUSE CAROUSEL
        group.style.animationPlayState = "paused";

        // DETECT IF THIS VIDEO IS ALREADY AT FRONT
        let isAlreadyFront =
            Math.abs(parseFloat(vid.dataset.angle)) < 1 ||
            parseFloat(vid.dataset.angle) === 360;

        if (!isAlreadyFront) {
            // Only rotate carousel if needed
            group.style.transform = `rotateY(-${vid.dataset.angle}deg)`;
        } else {
            // Don't rotate carousel again
            group.style.transform = `rotateY(0deg)`;
        }

        // Bring forward and flatten rotation
        vid.classList.add("active");
        vid.style.transform = `rotateY(0deg) translateZ(600px) scale(1.25)`;

        vid.controls = true;
        vid.muted = false;
        vid.play();
    });

    });

    // CLICK OUTSIDE → close video
    document.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "video") return;
        if (!activeVideo) return;

        resetVideo(activeVideo);
        activeVideo = null;
    });

    // Reset video and restore carousel
    function resetVideo(vid) {
        vid.classList.remove("active");
        vid.controls = false;
        vid.muted = true;
        vid.pause();

        group.style.animationPlayState = "running";
        group.style.transform = "";

        vid.style.transform =
            `rotateY(${vid.dataset.angle}deg) translateZ(${radius}px)`;
    }
});
