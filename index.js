var debug_sim = null;

(function() {
    'use strict';

    function init() {
        document.getElementById("config-min-heartbeat").value = Simulation.config.MIN_HEARTBEAT;
        document.getElementById("config-max-heartbeat").value = Simulation.config.MAX_HEARTBEAT;
        document.getElementById("config-min-strength").value = Simulation.config.MIN_STRENGTH;
        document.getElementById("config-max-strength").value = Simulation.config.MAX_STRENGTH;
        document.getElementById("config-min-amount-of-joints").value = Simulation.config.MIN_AMOUNT_OF_JOINTS;
        document.getElementById("config-max-amount-of-joints").value = Simulation.config.MAX_AMOUNT_OF_JOINTS;
        document.getElementById("config-min-friction").value = Simulation.config.MIN_FRICTION;
        document.getElementById("config-max-friction").value = Simulation.config.MAX_FRICTION;
        document.getElementById("config-min-amount-of-connections-per-joint").value = Simulation.config.MIN_AMOUNT_OF_CONNECTIONS_PER_JOINT;
        document.getElementById("config-max-amount-of-connections-per-joint").value = Simulation.config.MAX_AMOUNT_OF_CONNECTIONS_PER_JOINT;
        document.getElementById("config-spawn-width").value = Simulation.config.JOINT_SPAWN_WIDTH;
        document.getElementById("config-spawn-height").value = Simulation.config.JOINT_SPAWN_HEIGHT;
        document.getElementById("config-min-expanded-muscle-length").value = Simulation.config.MIN_EXPANDED_MUSCLE_LENGTH;
        document.getElementById("config-max-expanded-muscle-length").value = Simulation.config.MAX_EXPANDED_MUSCLE_LENGTH;
        document.getElementById("config-min-contracted-muscle-length").value = Simulation.config.MIN_CONTRACTED_MUSCLE_LENGTH;
        document.getElementById("config-max-contracted-muscle-length").value = Simulation.config.MAX_CONTRACTED_MUSCLE_LENGTH;
        document.getElementById("config-amount-of-speices").value = Simulation.config.AMOUNT_OF_SPECIES;
        document.getElementById("config-timer-length").value = Simulation.config.TIMER_LENGTH;
        document.getElementById("config-automate").value = Simulation.config.AUTOMATE;



        document.getElementById("start-simulation").onclick = (function() {
            document.getElementById("setup").style.display = "none";
            document.getElementById("time-data").style.display = "block";
            document.getElementById("creature-data").style.display = "block";
            document.getElementById("next-creature-button").style.display = "block";

            Simulation.config.MIN_HEARTBEAT = parseFloat(document.getElementById("config-min-heartbeat").value);
            Simulation.config.MAX_HEARTBEAT = parseFloat(document.getElementById("config-max-heartbeat").value);
            Simulation.config.MIN_STRENGTH = parseFloat(document.getElementById("config-min-strength").value);
            Simulation.config.MAX_STRENGTH = parseFloat(document.getElementById("config-max-strength").value);
            Simulation.config.MIN_AMOUNT_OF_JOINTS = parseFloat(document.getElementById("config-min-amount-of-joints").value);
            Simulation.config.MAX_AMOUNT_OF_JOINTS = parseFloat(document.getElementById("config-max-amount-of-joints").value);
            Simulation.config.MIN_FRICTION = parseFloat(document.getElementById("config-min-friction").value);
            Simulation.config.MAX_FRICTION = parseFloat(document.getElementById("config-max-friction").value);
            Simulation.config.MIN_AMOUNT_OF_CONNECTIONS_PER_JOINT = parseFloat(document.getElementById("config-min-amount-of-connections-per-joint").value);
            Simulation.config.MAX_AMOUNT_OF_CONNECTIONS_PER_JOINT = parseFloat(document.getElementById("config-max-amount-of-connections-per-joint").value);
            Simulation.config.JOINT_SPAWN_WIDTH = parseFloat(document.getElementById("config-spawn-width").value);
            Simulation.config.JOINT_SPAWN_HEIGHT = parseFloat(document.getElementById("config-spawn-height").value);
            Simulation.config.MIN_EXPANDED_MUSCLE_LENGTH = parseFloat(document.getElementById("config-min-expanded-muscle-length").value);
            Simulation.config.MAX_EXPANDED_MUSCLE_LENGTH = parseFloat(document.getElementById("config-max-expanded-muscle-length").value);
            Simulation.config.MIN_CONTRACTED_MUSCLE_LENGTH = parseFloat(document.getElementById("config-min-contracted-muscle-length").value);
            Simulation.config.MAX_CONTRACTED_MUSCLE_LENGTH = parseFloat(document.getElementById("config-max-contracted-muscle-length").value);
            Simulation.config.AMOUNT_OF_SPECIES = parseFloat(document.getElementById("config-amount-of-speices").value);
            Simulation.config.TIMER_LENGTH = parseFloat(document.getElementById("config-timer-length").value);
            Simulation.config.AUTOMATE = document.getElementById("config-automate").checked;

            debug_sim = new Simulation('#interstitial-wrapper');

        });
    }

    function Simulation(outerContainerId) {
        this.outerContainerEl = document.querySelector(outerContainerId);
        this.containerEl = null;
        this.canvas = null;
        this.canvasCtx = null;
        this.dimensions = Simulation.defaultDimensions;
        this.timerIntervalId = 0;
        this.nextCreatureIntervalId = 0;

        this.creatureList = [];
        this.creatureIndex = -1;
        this.generation = 1;

        this.creature = null;
        this.paused = false;

        this.resizeTimerId_ = null;


        this.containerEl = document.createElement('div');
        this.containerEl.className = Simulation.classes.CONTAINER;
        this.canvas = this.createCanvas(this.containerEl, this.dimensions.WIDTH, this.dimensions.HEIGHT);
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.fillStyle = '#f7f7f7';
        this.canvasCtx.fill();
        this.updateCanvasScaling(this.canvas);
        this.outerContainerEl.appendChild(this.containerEl);
        window.addEventListener(Simulation.events.RESIZE, this.debounceResize.bind(this));

        document.getElementById("next-creature-button").onclick = this.nextCreature.bind(this);

        document.getElementById("pause").onclick = this.pause.bind(this);
        document.getElementById("play").onclick = this.play.bind(this);


        this.init();


    }

    Simulation.classes = {
        CANVAS: 'simulation-canvas',
        CONTAINER: 'simulation-container',
        CRASHED: 'crashed',
        ICON: 'icon-offline',
        SNACKBAR: 'snackbar',
        SNACKBAR_SHOW: 'snackbar-show',
        TOUCH_CONTROLLER: 'controller'
    };

    Simulation.defaultDimensions = {
        WIDTH: window.innerWidth,
        HEIGHT: window.innerHeight
    };

    Simulation.config = {
        AUTOMATE: false,
        GRAVITY: 2,
        AMOUNT_OF_SPECIES: 100,
        TIMER_LENGTH: 10,
        MIN_HEARTBEAT: 15,
        MAX_HEARTBEAT: 40,
        MAX_STRENGTH: 10,
        MIN_STRENGTH: 3,
        MIN_AMOUNT_OF_JOINTS: 2,
        MAX_AMOUNT_OF_JOINTS: 5,
        MIN_FRICTION: .008,
        MAX_FRICTION: .5,
        HIGH_SCORE: 0,
        TIMER: 10,
        VIEWPORT: 0,
        MIN_AMOUNT_OF_CONNECTIONS_PER_JOINT: 1,
        MAX_AMOUNT_OF_CONNECTIONS_PER_JOINT: 5,
        JOINT_SPAWN_WIDTH: 200,
        JOINT_SPAWN_HEIGHT: 200,
        MIN_EXPANDED_MUSCLE_LENGTH: 200,
        MAX_EXPANDED_MUSCLE_LENGTH: 100,
        MIN_CONTRACTED_MUSCLE_LENGTH: 100,
        MAX_CONTRACTED_MUSCLE_LENGTH: 20,

    }



    Simulation.events = {
        ANIM_END: 'webkitAnimationEnd',
        CLICK: 'click',
        KEYDOWN: 'keydown',
        KEYUP: 'keyup',
        MOUSEDOWN: 'mousedown',
        MOUSEUP: 'mouseup',
        RESIZE: 'resize',
        TOUCHEND: 'touchend',
        TOUCHSTART: 'touchstart',
        VISIBILITY: 'visibilitychange',
        BLUR: 'blur',
        FOCUS: 'focus',
        LOAD: 'load',
        GAMEPADCONNECTED: 'gamepadconnected'
    };

    Simulation.prototype = {

        init: function() {

            for (var i = 0; i < Simulation.config.AMOUNT_OF_SPECIES; i++) {
                this.creatureList.push(new Creature(this.canvas))
            }


            this.nextCreature();
            Simulation.config.VIEWPORT = this.creature.posX;

            this.drawBackground();
            this.update();

        },

        pause: function() {
            this.paused = true;
            document.getElementById("pause").style.display = "none";
            document.getElementById("play").style.display = "inline-block";

            clearInterval(this.nextCreatureIntervalId);
            clearInterval(this.timerIntervalId);
        },

        play: function() {
            this.paused = false;
            document.getElementById("play").style.display = "none";
            document.getElementById("pause").style.display = "inline-block";

            clearInterval(this.nextCreatureIntervalId);
            clearInterval(this.timerIntervalId);

            this.nextCreatureIntervalId = window.setInterval(this.nextCreature.bind(this), Simulation.config.TIMER * 1000);
            this.timerIntervalId = setInterval(function() {
                Simulation.config.TIMER -= 1;
            }, 1000);

            this.raq();
        },


        nextCreature: function() {

            if (this.creatureList[this.creatureIndex + 1] != null) {

                clearInterval(this.timerIntervalId);
                clearInterval(this.nextCreatureIntervalId);

                Simulation.config.TIMER = Simulation.config.TIMER_LENGTH;
                this.timerIntervalId = setInterval(function() {
                    Simulation.config.TIMER -= 1;
                }, 1000);
                this.nextCreatureIntervalId = window.setInterval(this.nextCreature.bind(this), Simulation.config.TIMER_LENGTH * 1000);
                this.creatureIndex++;

                this.creature = this.creatureList[this.creatureIndex];
                for (var i = 0; i < this.creature.joints.length; i++) {
                    this.creature.joints[i].resetPosition();
                }


            } else {

                this.dataProcess();
            }

        },

        dataProcess: function() {
            this.pause();
            if (!Simulation.config.AUTOMATE) {

                document.getElementById("time-data").style.display = "none";
                document.getElementById("creature-data").style.display = "none";
                document.getElementById("next-creature-button").style.display = "none";
                document.getElementById("interstitial-wrapper").style.display = "none";
                document.getElementById("data-process").style.display = "block";
                document.getElementById("sort-creatures").onclick = this.sortCreatures.bind(this);


                google.charts.load('current', {
                    'packages': ['corechart']
                });
                google.charts.setOnLoadCallback(this.drawChart.bind(this));
            } else {
                this.sortCreatures();
                this.removeCreatures();
                this.reproduceCreatures();
                this.continueSimulation();
            }



        },

        sortCreatures: function() {

            this.creatureList.sort(function(a, b) {
                return ((b.xPos - b.startDistance) - (a.xPos - a.startDistance));
            });
            if (!Simulation.config.AUTOMATE) {
                this.drawChart();

                document.getElementById("sort-creatures").style.display = "none";
                document.getElementById("kill-creatures").style.display = "block";
                document.getElementById("kill-creatures").onclick = this.removeCreatures.bind(this);
            }

        },

        removeCreatures: function() {

            this.creatureList = this.creatureList.splice(0, Math.ceil(this.creatureList.length / 2));
            if (!Simulation.config.AUTOMATE) {
                this.drawChart();
                document.getElementById("kill-creatures").style.display = "none";
                document.getElementById("reproduce-creatures").style.display = "block";
                document.getElementById("reproduce-creatures").onclick = this.reproduceCreatures.bind(this);
            }
        },

        reproduceCreatures: function() {
            var tempList = this.creatureList.concat();
            for (var i = 0; i < this.creatureList.length; i++) {
                tempList.push(new Creature(this.canvas, this.creatureList[i]));
            }
            this.creatureList = tempList.concat();
            if (!Simulation.config.AUTOMATE) {
                this.drawChart();

                document.getElementById("reproduce-creatures").style.display = "none";
                document.getElementById("continue-simulation").style.display = "block";
                document.getElementById("continue-simulation").onclick = this.continueSimulation.bind(this);
            }
        },

        continueSimulation: function() {
            this.generation++;
            this.creatureIndex = -1;
            this.nextCreature();
            document.getElementById("time-data").style.display = "block";
            document.getElementById("creature-data").style.display = "block";
            document.getElementById("next-creature-button").style.display = "block";
            document.getElementById("interstitial-wrapper").style.display = "block";
            document.getElementById("data-process").style.display = "none";
            document.getElementById("continue-simulation").style.display = "none";
            document.getElementById("sort-creatures").style.display = "block";

            this.play();
        },


        drawChart: function() {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Distance');
            data.addColumn('number', 'Creatures');

            for (var i = 0; i < this.creatureList.length; i++) {

                data.addRows([
                    [this.creatureList[i].xPos - this.creatureList[i].startDistance, i + 1]
                ]);
            }

            var options = {
                title: 'Distance vs. Species ',
                hAxis: {
                    title: 'Distance',
                },
                vAxis: {
                    title: 'Creatures',
                },
                legend: 'none',
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
            chart.clearChart();
            chart.draw(data, options);
        },





        update: function() {

            this.drawPending = false;
            this.clearCanvas();
            this.drawBackground();
            this.creature.update();
            this.updateHUD();
            this.raq();
        },

        updateHUD: function() {
            var amountOfJoints = this.creature.joints.length;
            var amountOfMuscles = this.creature.muscles.length;
            var internalClock = this.creature.internalClock + "/" + this.creature.maxInternalClock;
            var muscleState = this.creature.muscleState;

            var averageJointFriction = 0;
            for (var i = 0; i < this.creature.joints.length; i++) {
                averageJointFriction += this.creature.joints[i].friction;
            }
            averageJointFriction /= this.creature.joints.length;



            var averageMuscleStrength = 0;
            for (var j = 0; j < this.creature.muscles.length; j++) {
                averageMuscleStrength += this.creature.muscles[j].strength;
            }
            averageMuscleStrength /= this.creature.muscles.length;

            document.getElementById("generation").innerHTML = this.generation;
            document.getElementById("amount-of-joints").innerHTML = amountOfJoints.toFixed(3);
            document.getElementById("amount-of-muscles").innerHTML = amountOfMuscles.toFixed(3);
            document.getElementById("internal-clock").innerHTML = internalClock;
            document.getElementById("muscle-state").innerHTML = muscleState;
            document.getElementById("average-muscle-strength").innerHTML = averageMuscleStrength.toFixed(3);
            document.getElementById("average-joint-friction").innerHTML = averageJointFriction.toFixed(3);
            document.getElementById("highscore").innerHTML = Simulation.config.HIGH_SCORE.toFixed(3);
            document.getElementById("time-remaining").innerHTML = Simulation.config.TIMER;
            document.getElementById("distance").innerHTML = (this.creature.xPos - this.creature.startDistance).toFixed(3);
            document.getElementById("creature-index").innerHTML = this.creatureIndex + 1 + "/" + this.creatureList.length;


        },

        raq: function() {
            if (!this.drawPending && !this.paused) {
                this.drawPending = true;
                this.raqId = requestAnimationFrame(this.update.bind(this))
            }
        },

        drawImage: function(src, xPos, yPos, width, height) {
            this.canvasCtx.restore();
            this.canvasCtx.drawImage(src, xPos, yPos, width, height);
        },

        drawBackground: function() {
            this.canvasCtx.fillStyle = "#87ceeb";
            this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.75);
            this.canvasCtx.fill();

            for (var i = -100; i < 100; i++) {
                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(i * 1000 - Simulation.config.VIEWPORT + this.creature.startDistance, 0);
                this.canvasCtx.lineTo(i * 1000 - Simulation.config.VIEWPORT + this.creature.startDistance, this.canvas.height);
                this.canvasCtx.stroke();

                this.canvasCtx.save();
                this.canvasCtx.translate(i * 1000 - Simulation.config.VIEWPORT + this.creature.startDistance - 120, this.canvas.height / 2);
                this.canvasCtx.rotate(-Math.PI / 2);
                this.canvasCtx.textAlign = "center";
                this.canvasCtx.fillStyle = "black"
                this.canvasCtx.font = "30px Verdana";
                this.canvasCtx.fillText(i * 1000, 100, 100);
                this.canvasCtx.restore();
            }

            this.canvasCtx.fillStyle = "#629632";
            this.canvasCtx.fillRect(0, this.canvas.height * 0.75, this.canvas.width, this.canvas.height / 4);
            this.canvasCtx.fill();
        },



        debounceResize: function() {
            if (!this.resizeTimerId_) {
                this.resizeTimerId_ = setInterval(this.adjustDimensions.bind(this), 250)
            }
        },

        updateCanvasScaling: function(canvas, opt_width, opt_height) {
            var context = canvas.getContext('2d');
            var devicePixelRatio = Math.floor(window.devicePixelRatio) || 1;
            var backingStoreRatio = Math.floor(context.webkitBackingStorePixelRatio) || 1;
            var ratio = devicePixelRatio / backingStoreRatio;
            if (devicePixelRatio !== backingStoreRatio) {
                var oldWidth = opt_width || canvas.width;
                var oldHeight = opt_height || canvas.height;
                canvas.width = oldWidth * ratio;
                canvas.height = oldHeight * ratio;
                canvas.style.width = oldWidth + 'px';
                canvas.style.height = oldHeight + 'px';
                context.scale(ratio, ratio);
                return true
            } else if (devicePixelRatio == 1) {
                canvas.style.width = canvas.width + 'px';
                canvas.style.height = canvas.height + 'px'
            }
            return false;
        },


        adjustDimensions: function() {
            clearInterval(this.resizeTimerId_);
            this.resizeTimerId_ = null;
            var boxStyles = window.getComputedStyle(this.outerContainerEl);
            var padding = Number(boxStyles.paddingLeft.substr(0, boxStyles.paddingLeft.length - 2));
            this.dimensions.WIDTH = this.outerContainerEl.offsetWidth - padding * 2;
            if (this.canvas) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.updateCanvasScaling(this.canvas);
                this.clearCanvas();
                this.drawBackground();
            }
        },

        clearCanvas: function() {
            this.canvasCtx.clearRect(0, 0, this.dimensions.WIDTH, this.dimensions.HEIGHT);
        },

        createCanvas: function(container, width, height, opt_classname) {
            var canvas = document.createElement('canvas');
            canvas.className = opt_classname ? Simulation.classes.CANVAS + ' ' + opt_classname : Simulation.classes.CANVAS;
            canvas.width = width;
            canvas.height = height;
            container.appendChild(canvas);
            return canvas
        },
    };


    function Creature(canvas, parent) {
        this.parent = parent;
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.time = 0;
        this.yPos = 0;
        this.xPos = 0;
        if (this.parent == null) {
            this.maxInternalClock = randomInteger(Simulation.config.MIN_HEARTBEAT, Simulation.config.MAX_HEARTBEAT);
            this.startContracting = randomInteger(this.maxInternalClock * 0.25, this.maxInternalClock * 0.25);
            this.amountOfJoints = randomInteger(Simulation.config.MIN_AMOUNT_OF_JOINTS, Simulation.config.MAX_AMOUNT_OF_JOINTS);

        } else {
            this.maxInternalClock = randomInteger(parent.maxInternalClock - 10, parent.maxInternalClock + 10)
            this.startContracting = randomInteger(this.maxInternalClock * 0.25, this.maxInternalClock * 0.25);
            this.amountOfJoints = parent.amountOfJoints;

        }


        this.internalClock = 0;
        this.muscleState = Creature.config.CONTRACT;


        this.muscles = [];
        this.joints = [];

        this.init();
    };

    Creature.config = {
        CONTRACTING: "CONTRACTING",
        EXPANDING: "EXPANDING",
    }


    Creature.prototype = {
        init: function() {
            if (this.parent == null) {
                for (var i = 0; i < this.amountOfJoints; i++) {
                    this.joints.push(new Joint());
                }

                for (var j = 0; j < this.joints.length; j++) {
                    for (var k = 0; k < randomInteger(Simulation.config.MIN_AMOUNT_OF_CONNECTIONS_PER_JOINT, Simulation.config.MAX_AMOUNT_OF_CONNECTIONS_PER_JOINT); k++) {
                        var index = randomInteger(0, this.amountOfJoints - 1);
                        while (index == j) {
                            index = randomInteger(0, this.amountOfJoints - 1);
                        }
                        this.muscles.push(new Muscle(this.joints[j], this.joints[index], j, index));
                        this.joints[j].attachedMuscleIndices.push(this.muscles.length - 1);
                    }
                }
            } else {
                this.joints = this.parent.joints.concat();
                this.muscles = this.parent.muscles.concat();

                for (var i = 0; i < this.joints.length; i++) {
                    this.joints[i].friction = randomFloat(this.parent.joints[i].friction - .05, this.parent.joints[i].friction + .05);
                }

                for (var j = 0; j < this.muscles.length; j++) {
                    this.muscles[j].expandedHeight = randomInteger(this.parent.muscles[j].expandedHeight - 25, this.parent.muscles[j].expandedHeight + 25);
                    this.muscles[j].contractedHeight = randomInteger(this.parent.muscles[j].contractedHeight - 25, this.parent.muscles[j].contractedHeight + 25);
                    this.muscles[j].strength = randomInteger(this.parent.muscles[j].strength - 1, this.parent.muscles[j].strength + 1);
                }
            }



            this.calculateDistance();
            this.startDistance = this.xPos;
            this.update();
        },

        update: function() {

            this.calculateDistance();
            Simulation.config.VIEWPORT = this.xPos - window.innerWidth / 2;
            if (this.internalClock <= this.maxInternalClock) {
                this.internalClock++;
            } else {
                this.internalClock = 0;
            }

            if (this.startContracting >= this.internalClock) {
                this.muscleState = Creature.config.CONTRACTING;
            } else {
                this.muscleState = Creature.config.EXPANDING;
            }

            if (this.xPos - this.startDistance > Simulation.config.HIGH_SCORE) {
                Simulation.config.HIGH_SCORE = this.xPos - this.startDistance;
            }

            for (var i = 0; i < this.joints.length; i++) {



                var joint = this.joints[i];
                var xVelocity = 0;
                var yVelocity = Simulation.config.GRAVITY;
                for (var k = 0; k < joint.attachedMuscleIndices.length; k++) {


                    var muscle = this.muscles[joint.attachedMuscleIndices[k]];

                    var currentLength = getLength(muscle.startX, muscle.startY, muscle.endX, muscle.endY)
                    if ((this.muscleState == Creature.config.EXPANDING && currentLength < muscle.expandLength) || (this.muscleState == Creature.config.CONTRACTING && currentLength > muscle.contractLength)) {
                        var pointX = null;
                        var pointY = null;
                        if (muscle.startX == joint.xPos) {
                            pointX = muscle.endX;
                            pointY = muscle.endY;
                        } else {
                            pointX = muscle.startX;
                            pointY = muscle.startY;
                        }

                        var xSlope = joint.xPos - pointX;
                        var ySlope = joint.yPos - pointY;

                        if (muscle.jointIsColliding) {
                            var tempY = Math.abs(Math.sin(muscle.angle) * muscle.strength * 2);
                        } else {
                            var tempY = Math.abs(Math.sin(muscle.angle) * muscle.strength);

                        }

                        var tempX = Math.abs(Math.cos(muscle.angle) * muscle.strength);

                        if (this.muscleState == Creature.config.CONTRACTING) {
                            if (xSlope > 0) {
                                tempX *= -1;
                            }
                            if (ySlope > 0) {
                                tempY *= -1;
                            }
                        } else {
                            if (xSlope < 0) {
                                tempX *= -1;
                            }
                            if (ySlope < 0) {
                                tempY *= -1;
                            }
                        }

                        if (this.joints[i].colliding) {
                            xVelocity += tempX * this.joints[i].friction;

                        } else {
                            xVelocity += tempX;
                        }

                        yVelocity += tempY;
                    }
                }

                this.joints[i].xPos += xVelocity;

                this.joints[i].yPos += yVelocity;

                this.joints[i].checkForCollision();




                if (this.joints[i].colliding) {
                    this.joints[i].yPos = window.innerHeight * 0.75 - 20;
                }
            }

            for (var j = 0; j < this.muscles.length; j++) {
                this.muscles[j].update(this.joints);
            }



            this.draw();

            this.time++;
        },

        calculateDistance: function() {
            var averageXDistance = 0;
            var averageYDistance = 0;
            for (var i = 0; i < this.joints.length; i++) {
                averageXDistance += this.joints[i].xPos;
                averageYDistance += this.joints[i].yPos;
            }

            this.xPos = (averageXDistance / this.joints.length);
            this.yPos = (averageYDistance / this.joints.length);

        },

        draw: function() {

            for (var i = 0; i < this.muscles.length; i++) {
                var muscle = this.muscles[i];
                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(muscle.startX - Simulation.config.VIEWPORT, muscle.startY);
                this.canvasCtx.lineTo(muscle.endX - Simulation.config.VIEWPORT, muscle.endY);
                this.canvasCtx.lineWidth = 15;
                this.canvasCtx.strokeStyle = "rgba(139,69,19," + muscle.strength / 10 + ")";
                this.canvasCtx.stroke();



            }


            for (var j = 0; j < this.joints.length; j++) {


                var joint = this.joints[j];
                this.canvasCtx.beginPath();
                this.canvasCtx.arc(joint.xPos - Simulation.config.VIEWPORT, joint.yPos, 20, 0, 2 * Math.PI, false);
                this.canvasCtx.fillStyle = joint.color;
                this.canvasCtx.fill();
                this.canvasCtx.lineWidth = 5;
                this.canvasCtx.strokeStyle = 'black';
                this.canvasCtx.stroke();
            }

        }
    };

    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    };


    function Joint() {
        this.attachedMuscleIndices = [];
        this.friction = randomFloat(Simulation.config.MIN_FRICTION, Simulation.config.MAX_FRICTION);
        this.xPos = randomInteger(window.innerWidth / 2 - Simulation.config.JOINT_SPAWN_WIDTH / 2, window.innerWidth / 2 + Simulation.config.JOINT_SPAWN_WIDTH / 2);
        this.yPos = randomInteger(window.innerHeight * 0.625 - Simulation.config.JOINT_SPAWN_HEIGHT / 2, window.innerHeight * 0.5 + Simulation.config.JOINT_SPAWN_HEIGHT / 2);
        this.colliding = this.isColliding(this.yPos, 20);

        this.xStartPos = this.xPos;
        this.yStartPos = this.yPos;

        this.gradient = (this.friction - Simulation.config.MIN_FRICTION) / (Simulation.config.MAX_FRICTION - Simulation.config.MIN_FRICTION);
        this.color = "hsl(0, 0%, " + (100 - this.gradient * 100) + "%)";
    };

    Joint.prototype = {
        isColliding: function(yPos, radius) {
            return (yPos + radius > window.innerHeight * 0.75);
        },

        checkForCollision: function() {
            this.colliding = this.isColliding(this.yPos, 20);
        },

        resetPosition: function() {
            this.xPos = this.xStartPos;
            this.yPos = this.yStartPos;
        }
    };

    function Muscle(jointA, jointB, indexA, indexB) {
        this.startX = jointA.xPos;
        this.startY = jointA.yPos;
        this.endX = jointB.xPos;
        this.endY = jointB.yPos;

        this.jointIsColliding = this.checkForJointCollision(jointA, jointB);

        this.indexA = indexA;
        this.indexB = indexB;

        this.angle = getRotation(this.startX, this.startY, this.endX, this.endY);

        this.expandedHeight = randomInteger(Simulation.config.MIN_EXPANDED_MUSCLE_LENGTH, Simulation.config.MAX_EXPANDED_MUSCLE_LENGTH);
        this.contractedHeight = randomInteger(Simulation.config.MIN_CONTRACTED_MUSCLE_LENGTH, Simulation.config.MAX_CONTRACTED_MUSCLE_LENGTH);
        this.strength = randomInteger(Simulation.config.MIN_STRENGTH, Simulation.config.MAX_STRENGTH);
    };

    Muscle.prototype = {
        update: function(joints) {
            var jointA = joints[this.indexA];
            var jointB = joints[this.indexB];

            this.startX = jointA.xPos;
            this.startY = jointA.yPos;
            this.endX = jointB.xPos;
            this.endY = jointB.yPos;

            this.jointIsColliding = this.checkForJointCollision(jointA, jointB);

            this.contractLength = randomInteger(25, 100);
            this.expandLength = randomInteger(this.contractLength + 25, 200);

            this.angle = getRotation(this.startX, this.startY, this.endX, this.endY);
        },

        checkForJointCollision: function(jointA, jointB) {
            return (jointA.colliding || jointB.colliding);
        }
    };

    function getDistance(startX, startY, endX, endY) {
        return Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    }

    function getLength(startX, startY, endX, endY) {
        return Math.abs(Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)));
    }

    function getRotation(startX, startY, endX, endY) {
        var a = startX - endX;
        var b = endY - startY;
        var angle = Math.atan(a / b);
        angle = angle * 180 / Math.PI;

        angle = 90 - Math.abs(angle);
        return angle;
    }



    init();

})();
