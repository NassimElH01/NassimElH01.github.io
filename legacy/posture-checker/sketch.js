/**
 * Femtech 65+ | Surveillance Mirror
 * Posture Checker with MoveNet Pose Estimation
 * Optimized, debugged, and modern camera permission handling
 */

// Model & Video state
let video;
let bodyPose;
let poses = [];
let modelLoaded = false;
let cameraReady = false;
let isDetecting = false;
let cameraPermissionDenied = false;
let cameraErrorMsg = "";

// Settings
let isMirrored = true;
let smoothedScore = 100;
let targetScore = 100;
let statusText = "Scanner...";
let statusColor = "#00ff88";
let currentTiltDeg = 0;
let currentDeltaY = 0;

// Performance & Telemetry
let lastFpsUpdate = 0;
let currentFps = 0;
let blinkOn = true;

// Cached DOM Elements
let dom = {};

function preload() {
    // Tjek om ml5 er indlæst
    if (typeof ml5 !== "undefined" && ml5.bodyPose) {
        try {
            // Indlæs MoveNet med spejlvendte koordinater til spejlet
            bodyPose = ml5.bodyPose("MoveNet", { flipped: true }, () => {
                modelLoaded = true;
                console.log("MoveNet model klar");
                updateStatus("AI-model klar. Afventer kameratilladelse...");
                checkAndStartDetection();
            });
        } catch (err) {
            console.error("Fejl under indlæsning af bodyPose:", err);
            updateStatus("Fejl under indlæsning af AI-model.");
        }
    } else {
        console.warn("ml5.bodyPose ikke tilgængelig i preload.");
    }
}

function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent("canvas-holder");
    frameRate(60);

    // Initialiser DOM-referencer
    initDomElements();

    // Tjek for file:// protokol
    checkProtocol();

    // Start kameraforbindelse
    initCamera();
}

/**
 * Cacher DOM-elementer for at forhindre unødig layout thrashing i draw-loopet
 */
function initDomElements() {
    dom = {
        systemStatus: document.getElementById("system-status"),
        postureVal: document.getElementById("posture-val"),
        scoreBar: document.getElementById("score-bar"),
        alertVal: document.getElementById("alert-val"),
        tiltVal: document.getElementById("tilt-val"),
        fpsVal: document.getElementById("fps-val"),
        recBadge: document.getElementById("rec-badge"),
        btnStartCamera: document.getElementById("btn-start-camera"),
        btnToggleMirror: document.getElementById("btn-toggle-mirror"),
        protocolWarning: document.getElementById("protocol-warning")
    };

    if (dom.btnStartCamera) {
        dom.btnStartCamera.addEventListener("click", () => {
            initCamera(true);
        });
    }

    if (dom.btnToggleMirror) {
        dom.btnToggleMirror.addEventListener("click", () => {
            isMirrored = !isMirrored;
            dom.btnToggleMirror.innerText = isMirrored ? "🪞 Spejlvend: TIL" : "🪞 Spejlvend: FRA";
        });
    }
}

/**
 * Tjekker om appen kører på file:// og viser vejledning
 */
function checkProtocol() {
    if (window.location.protocol === "file:" && dom.protocolWarning) {
        dom.protocolWarning.classList.remove("hidden");
    }
}

/**
 * Initialiserer webcam med eksplicit tilladelseshåndtering og browser-fallbacks
 */
function initCamera(userInitiated = false) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraPermissionDenied = true;
        cameraErrorMsg = "Browseren understøtter ikke kameraadgang eller blokerer det i denne kontekst.";
        updateStatus(cameraErrorMsg);
        return;
    }

    updateStatus("Anmoder om kameratilladelse...");
    if (dom.recBadge) {
        dom.recBadge.innerText = "AFVENTER";
        dom.recBadge.className = "badge warning";
    }

    // Constraints for jævn overvågningsvideo
    const constraints = {
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
        },
        audio: false
    };

    // Hvis der allerede findes et videoelement, ryd op
    if (video) {
        try {
            video.remove();
        } catch (e) { }
    }

    // Opret capture via p5.js
    video = createCapture(constraints, function (stream) {
        cameraReady = true;
        cameraPermissionDenied = false;
        cameraErrorMsg = "";
        console.log("Kamerastream etableret");

        if (dom.recBadge) {
            dom.recBadge.innerText = "LIVE FEED";
            dom.recBadge.className = "badge live";
        }
        if (dom.btnStartCamera) {
            dom.btnStartCamera.innerText = "✓ Kamera Aktivt";
            dom.btnStartCamera.classList.add("secondary");
        }

        updateStatus("Kamera aktivt. Initialiserer sporing...");
        checkAndStartDetection();
    });

    // Skjul standard HTML-videoelementet, så vi kan styre det på canvas
    video.size(640, 480);
    video.hide();

    // Sørg for iOS/Safari-kompatibilitet
    if (video.elt) {
        video.elt.setAttribute("playsinline", "");
        video.elt.setAttribute("autoplay", "");
        video.elt.muted = true;

        video.elt.addEventListener("error", (e) => {
            console.error("Video element fejl:", e);
            cameraPermissionDenied = true;
            cameraErrorMsg = "Fejl ved indlæsning af videofeed.";
            updateStatus(cameraErrorMsg);
        });
    }

    // Direkte getUserMedia tjek for at fange afviste tilladelser (NotAllowedError)
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            // Tilladelse givet
            cameraPermissionDenied = false;
        })
        .catch((err) => {
            console.warn("getUserMedia afvist eller blokeret:", err);
            cameraPermissionDenied = true;
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                cameraErrorMsg = "Kameratilladelse afvist. Tillad kamera i browserens adresselinje.";
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                cameraErrorMsg = "Intet webkamera fundet på enheden.";
            } else {
                cameraErrorMsg = "Kamerafejl: " + err.name;
            }
            updateStatus(cameraErrorMsg);
            if (dom.recBadge) {
                dom.recBadge.innerText = "BLOKERET";
                dom.recBadge.className = "badge error";
            }
            if (dom.btnStartCamera) {
                dom.btnStartCamera.innerText = "⚠️ Prøv Kamera Igen";
            }
        });
}

/**
 * Sikrer at både modellen og videoens dimensioner er klar før MoveNet startes
 */
function checkAndStartDetection() {
    if (isDetecting) return;

    if (!modelLoaded && typeof ml5 !== "undefined" && ml5.bodyPose && !bodyPose) {
        bodyPose = ml5.bodyPose("MoveNet", { flipped: true }, () => {
            modelLoaded = true;
            checkAndStartDetection();
        });
        return;
    }

    const videoIsReady = video && video.elt && video.elt.readyState >= 2 && video.elt.videoWidth > 0;

    if (modelLoaded && videoIsReady) {
        try {
            bodyPose.detectStart(video, gotPoses);
            isDetecting = true;
            console.log("MoveNet kontinuerlig sporing aktiveret");
            updateStatus("System operativt. Søger efter subjekt...");
        } catch (e) {
            console.error("Kunne ikke starte MoveNet detectStart:", e);
        }
    }
}

function draw() {
    // Opdater FPS hvert 500ms
    if (millis() - lastFpsUpdate > 500) {
        currentFps = Math.round(frameRate());
        lastFpsUpdate = millis();
        blinkOn = !blinkOn;
        if (dom.fpsVal) dom.fpsVal.innerText = currentFps + " FPS";
    }

    // Tjek om detektion kan startes, hvis det ikke var klar i setup
    if (!isDetecting && modelLoaded && video && video.elt && video.elt.readyState >= 2) {
        checkAndStartDetection();
    }

    // Tegn baggrund / videofeed
    if (cameraReady && video && video.elt && video.elt.readyState >= 2) {
        if (isMirrored) {
            // Spejlvend videoen vandret så brugeren ser et naturligt spejl
            push();
            translate(width, 0);
            scale(-1, 1);
            image(video, 0, 0, width, height);
            pop();
        } else {
            image(video, 0, 0, width, height);
        }

        // Subtilt sci-fi overvågningsfilter (ikke for mørkt)
        fill(8, 14, 20, 75);
        noStroke();
        rect(0, 0, width, height);

        // Kropsanalyse
        if (poses && poses.length > 0) {
            const pose = poses[0];
            analyzePosture(pose);
            drawSkeleton(pose);
        } else {
            targetScore = 100;
            updateStatus("Søger efter subjekt foran linsen...");
            updateAlert("Ingen person identificeret", "#94a3b8");
        }
    } else {
        // Standby skærm hvis kameraet afventer tilladelse eller indlæser
        drawStandbyScreen();
    }

    // Tegn HUD og overvågningsgrafik
    drawSurveillanceOverlay();

    // Opdater glidende score og interface
    updateMetricsUI();
}

/**
 * Modtager og normaliserer kropspositioner for lynhurtig O(1) opslag
 */
function gotPoses(results) {
    if (!results || results.length === 0) {
        poses = [];
        return;
    }

    // Normaliser keypoints direkte på pose-objektet
    for (let i = 0; i < results.length; i++) {
        const pose = results[i];
        if (pose.keypoints && Array.isArray(pose.keypoints)) {
            for (let j = 0; j < pose.keypoints.length; j++) {
                const kp = pose.keypoints[j];
                if (kp && kp.name) {
                    pose[kp.name] = kp;
                }
            }
        }
    }

    poses = results;
}

/**
 * Henter et specifikt keypoint robust
 */
function getKeypoint(pose, name) {
    if (!pose) return null;
    if (pose[name]) return pose[name];
    if (pose.keypoints && Array.isArray(pose.keypoints)) {
        return pose.keypoints.find(k => k.name === name) || null;
    }
    return null;
}

/**
 * Analyserer holdning (skulderbalance, hældning, autonomi-score)
 */
function analyzePosture(pose) {
    const leftShoulder = getKeypoint(pose, "left_shoulder");
    const rightShoulder = getKeypoint(pose, "right_shoulder");
    const nose = getKeypoint(pose, "nose");

    if (leftShoulder && rightShoulder && leftShoulder.confidence > 0.25 && rightShoulder.confidence > 0.25) {
        // Beregn forskel i skulderhøjde (pixels)
        currentDeltaY = Math.abs(leftShoulder.y - rightShoulder.y);

        // Beregn fysisk afstand for at normalisere i forhold til afstand fra kameraet
        const shoulderDist = Math.max(30, dist(leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y));

        // Hældningsvinkel i grader (0 = helt vandret)
        currentTiltDeg = Math.abs(Math.asin(Math.min(1, currentDeltaY / shoulderDist)) * (180 / Math.PI));

        // Beregn Postural Autonomy Score (0 - 100)
        // Straffer asymmetri proportionalt med både hældningsgrader og absolut pixelafvigelse
        const penalty = (currentDeltaY * 1.3) + (currentTiltDeg * 2.5);
        targetScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

        updateStatus("Subjekt låst og sporet. Biometrisk feed aktiv.");

        // Bedøm holdningstærskel
        if (currentTiltDeg > 7 || currentDeltaY > 24) {
            statusText = "ADVARSEL: Asymmetri registreret. Korriger holdning.";
            statusColor = "#ff4d4f";
        } else if (currentTiltDeg > 4 || currentDeltaY > 12) {
            statusText = "BEMÆRK: Let skævhed målt. Juster skuldre.";
            statusColor = "#faad14";
        } else {
            statusText = "OPTIMAL: Holdning opretholder autonomi-tærskel.";
            statusColor = "#00ff88";
        }

        updateAlert(statusText, statusColor);
    } else {
        updateStatus("Subjekt delvist sporet. Viser kun partiel krop.");
        updateAlert("Juster position foran kameraet", "#94a3b8");
    }
}

/**
 * Tegner biomekanisk skelet og referencelinjer
 */
function drawSkeleton(pose) {
    const leftShoulder = getKeypoint(pose, "left_shoulder");
    const rightShoulder = getKeypoint(pose, "right_shoulder");
    const nose = getKeypoint(pose, "nose");

    // Skuldre og balancelinje
    if (leftShoulder && rightShoulder && leftShoulder.confidence > 0.25 && rightShoulder.confidence > 0.25) {
        const midX = (leftShoulder.x + rightShoulder.x) / 2;
        const midY = (leftShoulder.y + rightShoulder.y) / 2;

        // Vandret ideal-horisont (grå stiplet/dæmpet linje)
        stroke(255, 255, 255, 60);
        strokeWeight(1);
        line(midX - 100, midY, midX + 100, midY);

        // Målelinje mellem skuldre med farvekode efter holdning
        stroke(statusColor);
        strokeWeight(3);
        line(leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y);

        // Skulderpunkter med neon-glød
        fill(statusColor);
        noStroke();
        circle(leftShoulder.x, leftShoulder.y, 10);
        circle(rightShoulder.x, rightShoulder.y, 10);

        // Referencepunkter i midten
        fill(255);
        circle(midX, midY, 4);
    }

    // Hoved / Næse sigtekorn
    if (nose && nose.confidence > 0.25) {
        push();
        translate(nose.x, nose.y);
        stroke(0, 255, 136, 180);
        strokeWeight(1.5);
        noFill();

        // Cybernetisk sigtekorn
        rect(-18, -18, 36, 36);
        line(-24, 0, -18, 0);
        line(18, 0, 24, 0);
        line(0, -24, 0, -18);
        line(0, 18, 0, 24);

        // Lille punkt i midten
        fill(0, 255, 136);
        noStroke();
        circle(0, 0, 3);
        pop();
    }
}

/**
 * Tegner cyberpunk overvågnings-HUD, tid og gitter
 */
function drawSurveillanceOverlay() {
    // 1. Tidsstempel og knude-ID
    fill(0, 255, 136);
    noStroke();
    textSize(11);
    textAlign(LEFT, TOP);
    text("REC // FEMTECH-SURVEILLANCE-NODE: 01-ALPHA", 20, 20);

    // Live blinkende optageindikator
    if (blinkOn && cameraReady && !cameraPermissionDenied) {
        fill(255, 40, 40);
        circle(12, 26, 7);
    }

    // 2. ISO tidsstempel
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0] + "." + Math.floor(now.getMilliseconds() / 100);
    fill(180, 210, 230, 200);
    text("SYS.TIME: " + timeStr + " UTC+2", 20, 38);
    text("MODE: MIRRORED BIOMETRIC AUTOPSY", 20, 52);

    // 3. Hjørne-viewfinder klammer
    stroke(0, 255, 136, 90);
    strokeWeight(2);
    noFill();
    // Øverst venstre
    line(10, 10, 30, 10);
    line(10, 10, 10, 30);
    // Øverst højre
    line(width - 10, 10, width - 30, 10);
    line(width - 10, 10, width - 10, 30);
    // Nederst venstre
    line(10, height - 10, 30, height - 10);
    line(10, height - 10, 10, height - 30);
    // Nederst højre
    line(width - 10, height - 10, width - 30, height - 10);
    line(width - 10, height - 10, width - 10, height - 30);

    // 4. Måleskala i bunden
    stroke(255, 255, 255, 40);
    strokeWeight(1);
    line(20, height - 25, width - 20, height - 25);
    for (let x = 20; x <= width - 20; x += 40) {
        line(x, height - 28, x, height - 22);
    }
}

/**
 * Standby skærm hvis kameraet ikke er aktivt
 */
function drawStandbyScreen() {
    background(13, 17, 23);

    // Gitterlinjer for sci-fi look
    stroke(25, 38, 50);
    strokeWeight(1);
    for (let x = 0; x < width; x += 40) {
        line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 40) {
        line(0, y, width, y);
    }

    textAlign(CENTER, CENTER);
    noStroke();

    if (cameraPermissionDenied) {
        fill(255, 77, 79);
        textSize(15);
        text("KAMERAADGANG IKKE TILGÆNGELIG", width / 2, height / 2 - 25);
        textSize(12);
        fill(200, 210, 220);
        text(cameraErrorMsg || "Tillad venligst kamera i browserens adresselinje.", width / 2, height / 2 + 5);
        fill(0, 255, 136);
        text("Klik på 'Start / Tillad Kamera' nedenfor for at prøve igen.", width / 2, height / 2 + 30);
    } else {
        fill(0, 255, 136);
        textSize(14);
        text("INITIALISERER KAMERAFEED...", width / 2, height / 2 - 20);
        textSize(12);
        fill(148, 163, 184);
        text("Godkend venligst kameraanmodningen i browseren", width / 2, height / 2 + 10);

        // Roterende radar / radar-puls
        const pulse = (sin(frameCount * 0.08) + 1) * 20;
        noFill();
        stroke(0, 255, 136, 120);
        circle(width / 2, height / 2 - 20, 80 + pulse);
    }
}

/**
 * Opdaterer metrics og progress bar uden layout thrashing
 */
function updateMetricsUI() {
    // Blød interpolation af postural score
    smoothedScore = lerp(smoothedScore, targetScore, 0.1);
    const roundedScore = Math.round(smoothedScore);

    if (dom.postureVal) {
        const textVal = poses.length > 0 ? roundedScore + " / 100" : "--";
        if (dom.postureVal.innerText !== textVal) {
            dom.postureVal.innerText = textVal;
        }
    }

    if (dom.scoreBar) {
        const widthPercent = poses.length > 0 ? roundedScore + "%" : "0%";
        if (dom.scoreBar.style.width !== widthPercent) {
            dom.scoreBar.style.width = widthPercent;
            dom.scoreBar.style.backgroundColor = statusColor;
        }
    }

    if (dom.tiltVal) {
        const tiltStr = poses.length > 0
            ? currentTiltDeg.toFixed(1) + "° (" + Math.round(currentDeltaY) + " px forskel)"
            : "--";
        if (dom.tiltVal.innerText !== tiltStr) {
            dom.tiltVal.innerText = tiltStr;
        }
    }
}

function updateStatus(text) {
    if (dom.systemStatus && dom.systemStatus.innerText !== text) {
        dom.systemStatus.innerText = "Systemstatus: " + text;
    }
}

function updateAlert(text, color) {
    if (dom.alertVal) {
        if (dom.alertVal.innerText !== text) {
            dom.alertVal.innerText = text;
        }
        if (dom.alertVal.style.color !== color) {
            dom.alertVal.style.color = color;
        }
    }
}
