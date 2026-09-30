import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./DroneDashboard.css";

import sites from "../data/sites.json";

import {
  getDangerLevel,
  getDistance,
  getNearestSensor,
  getSensorCondition,
  getWindRisk,
} from "../utils/windDanger";


const STATUS_COLORS = {

  GREEN: "#16a05d",

  YELLOW: "#d47a00",

  RED: "#df3030",

};


/* =========================================================
   SIMULATED ENVIRONMENTAL SCENARIOS
   ========================================================= */

const SIMULATION_SCENARIOS = {

  NORMAL: {

    pm10: 34,

    pm25: 8,

    arsenic: 0.01,

  },


  ELEVATED: {

    pm10: 65,

    pm25: 22,

    arsenic: 0.03,

  },


  CRITICAL: {

    pm10: 125,

    pm25: 42,

    arsenic: 0.06,

  },

};


/* =========================================================
   WIND LABEL
   ========================================================= */

function getWindLabel(degrees) {

  const directions = [
    "N",
    "NE",
    "E",
    "SE",
    "S",
    "SW",
    "W",
    "NW",
  ];


  const index =
    Math.round(
      degrees / 45
    ) %
    directions.length;


  return directions[index];

}


/* =========================================================
   CURRENT TIME DISPLAY
   ========================================================= */

function getCurrentTime() {

  return new Date()
    .toLocaleTimeString(
      [],
      {
        hour:
          "2-digit",

        minute:
          "2-digit",
      }
    );

}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function DroneDashboard() {


  /* =======================================================
     SITE
     ======================================================= */

  const [siteId] =
    useState(
      sites[0].id
    );


  const site =
    sites.find(
      (currentSite) =>
        currentSite.id ===
        siteId
    );


  /* =======================================================
     ACTUAL NEAREST SENSOR

     This is now calculated instead of simply using
     site.sensors[0].
     ======================================================= */

  const nearestSensor =
    getNearestSensor(
      site
    );


  const nearestSensorDistance =
    getDistance(
      site.township,
      nearestSensor
    );


  /* =======================================================
     WIND
     ======================================================= */

  const [
    windDirection,
    setWindDirection,
  ] = useState(45);


  /* =======================================================
     SENSOR SIMULATION
     ======================================================= */

  const [
    sensorReadings,
    setSensorReadings,
  ] = useState({

    pm10:
      nearestSensor
        .readings.pm10,

    pm25:
      nearestSensor
        .readings.pm25,

    arsenic:
      nearestSensor
        .readings.arsenic,

  });


  const [
    simulationScenario,
    setSimulationScenario,
  ] = useState(
    "NORMAL"
  );


  /*
     Combine the nearest sensor metadata with the
     currently simulated readings.
  */

  const activeSensor = {

    ...nearestSensor,

    readings:
      sensorReadings,

  };


  /* =======================================================
     LAST UPDATED

     Previously this was a hardcoded date/time.

     Now it updates whenever the simulation inputs change.
     ======================================================= */

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(
    getCurrentTime()
  );


  /* =======================================================
     EVENT LOG
     ======================================================= */

  const [log, setLog] =
    useState([

      {
        type:
          "GREEN",

        time:
          "Demo ready",

        message:
          "Simulation initialized. Environmental readings nominal.",
      },

    ]);


  /* =======================================================
     DRONE STATE
     ======================================================= */

  const [
    droneStatus,
    setDroneStatus,
  ] = useState(
    "STANDBY"
  );


  const [
    dronePosition,
    setDronePosition,
  ] = useState(
    null
  );


  const [
    suppressionProgress,
    setSuppressionProgress,
  ] = useState(0);


  /* =======================================================
     TIMER REFERENCES

     Previously our timers existed only inside functions.

     That meant if DroneDashboard disappeared while a
     mission was running, those timers could continue
     running in the background.

     useRef lets us keep references to them so that they
     can be cancelled later.
     ======================================================= */

  const deploymentTimer =
    useRef(null);


  const movementTimer =
    useRef(null);


  const suppressionTimer =
    useRef(null);


  const returnTimer =
    useRef(null);


  /* =======================================================
     CLEAN UP TIMERS

     This runs when DroneDashboard is removed from the page,
     for example when the user navigates to Recycling Value.
     ======================================================= */

  useEffect(
    () => {

      return () => {

        clearTimeout(
          deploymentTimer.current
        );


        clearInterval(
          movementTimer.current
        );


        clearInterval(
          suppressionTimer.current
        );


        clearInterval(
          returnTimer.current
        );

      };

    },
    []
  );


  /* =======================================================
     RISK ASSESSMENT
     ======================================================= */

  const sensorCondition =
    getSensorCondition(
      activeSensor
    );


  const windRisk =
    getWindRisk(
      site,
      windDirection
    );


  const status =
    getDangerLevel(
      site,
      windDirection,
      activeSensor
    );


  const windLabel =
    getWindLabel(
      windDirection
    );


  /* =======================================================
     DRONE BASE
     ======================================================= */

  const droneStartPosition = {

    lat:
      site.mineDump.lat -
      0.006,

    lng:
      site.mineDump.lng -
      0.006,

  };


  /* =======================================================
     EVENT LOG HELPER
     ======================================================= */

  function addEvent(
    type,
    message
  ) {

    const newEvent = {

      type:
        type,

      time:
        getCurrentTime(),

      message:
        message,

    };


    setLog(
      (previousLog) => [

        newEvent,

        ...previousLog,

      ]
    );

  }


  /* =======================================================
     CHANGE SIMULATION SCENARIO
     ======================================================= */

  function changeScenario(
    scenarioName
  ) {


    /*
       Prevent scenario changes during an active mission.
    */

    if (
      droneStatus !==
      "STANDBY"
    ) {

      return;

    }


    const newReadings =
      SIMULATION_SCENARIOS[
        scenarioName
      ];


    setSimulationScenario(
      scenarioName
    );


    setSensorReadings({

      pm10:
        newReadings.pm10,

      pm25:
        newReadings.pm25,

      arsenic:
        newReadings.arsenic,

    });


    setLastUpdated(
      getCurrentTime()
    );


    if (
      scenarioName ===
      "NORMAL"
    ) {

      addEvent(
        "GREEN",
        "Simulation changed to NORMAL conditions. Sensor readings nominal."
      );

    }


    if (
      scenarioName ===
      "ELEVATED"
    ) {

      addEvent(
        "YELLOW",
        "Simulation changed to ELEVATED conditions. Increased environmental readings detected."
      );

    }


    if (
      scenarioName ===
      "CRITICAL"
    ) {

      addEvent(
        "RED",
        "Simulation changed to CRITICAL sensor conditions. Risk engine evaluating wind transport."
      );

    }

  }


  /* =======================================================
     WIND CHANGE

     We now handle this through a function so we can also
     update the timestamp.
     ======================================================= */

  function handleWindChange(
    event
  ) {


    if (
      droneStatus !==
      "STANDBY"
    ) {

      return;

    }


    const newDirection =
      Number(
        event.target.value
      );


    setWindDirection(
      newDirection
    );


    setLastUpdated(
      getCurrentTime()
    );

  }


  /* =======================================================
     DUST SUPPRESSION
     ======================================================= */

  function startDustSuppression() {


    setDroneStatus(
      "SUPPRESSING"
    );


    setSuppressionProgress(
      0
    );


    addEvent(
      "RED",
      "Drone arrived at mine dump. Dust suppression started."
    );


    let progress =
      0;


    suppressionTimer.current =
      setInterval(
        () => {


          progress =
            progress + 10;


          setSuppressionProgress(
            progress
          );


          if (
            progress >=
            100
          ) {


            clearInterval(
              suppressionTimer.current
            );


            suppressionTimer.current =
              null;


            setSuppressionProgress(
              100
            );


            setDroneStatus(
              "COMPLETE"
            );


            addEvent(
              "GREEN",
              "Dust suppression complete. Mission successful."
            );

          }


        },
        300
      );

  }


  /* =======================================================
     FLY TO MINE
     ======================================================= */

  function moveDroneToMine() {


    const startLat =
      droneStartPosition.lat;


    const startLng =
      droneStartPosition.lng;


    const targetLat =
      site.mineDump.lat;


    const targetLng =
      site.mineDump.lng;


    const totalSteps =
      40;


    let currentStep =
      0;


    setDroneStatus(
      "TRAVELLING"
    );


    addEvent(
      "YELLOW",
      "Drone airborne. Travelling toward mine dump."
    );


    movementTimer.current =
      setInterval(
        () => {


          currentStep =
            currentStep + 1;


          const progress =
            currentStep /
            totalSteps;


          const newLat =

            startLat +

            (
              targetLat -
              startLat
            ) *

            progress;


          const newLng =

            startLng +

            (
              targetLng -
              startLng
            ) *

            progress;


          setDronePosition({

            lat:
              newLat,

            lng:
              newLng,

          });


          if (
            currentStep >=
            totalSteps
          ) {


            clearInterval(
              movementTimer.current
            );


            movementTimer.current =
              null;


            setDronePosition({

              lat:
                targetLat,

              lng:
                targetLng,

            });


            startDustSuppression();

          }


        },
        100
      );

  }


  /* =======================================================
     DEPLOY DRONE
     ======================================================= */

  function handleLaunch() {


    if (
      status !==
      "RED"
    ) {

      return;

    }


    if (
      droneStatus !==
      "STANDBY"
    ) {

      return;

    }


    setDroneStatus(
      "DEPLOYING"
    );


    setDronePosition({

      lat:
        droneStartPosition.lat,

      lng:
        droneStartPosition.lng,

    });


    setSuppressionProgress(
      0
    );


    addEvent(

      "RED",

      `Deployment authorised. ` +
      `${sensorCondition} sensor conditions detected. ` +
      `Wind ${windLabel} ${windDirection}° is carrying risk toward the community.`

    );


    deploymentTimer.current =
      setTimeout(
        () => {


          deploymentTimer.current =
            null;


          moveDroneToMine();

        },
        1000
      );

  }


  /* =======================================================
     RETURN TO BASE
     ======================================================= */

  function returnDroneToBase() {


    if (
      droneStatus !==
      "COMPLETE"
    ) {

      return;

    }


    setDroneStatus(
      "RETURNING"
    );


    addEvent(
      "YELLOW",
      "Return to base authorised. Drone leaving mine dump."
    );


    const startLat =
      site.mineDump.lat;


    const startLng =
      site.mineDump.lng;


    const targetLat =
      droneStartPosition.lat;


    const targetLng =
      droneStartPosition.lng;


    const totalSteps =
      40;


    let currentStep =
      0;


    returnTimer.current =
      setInterval(
        () => {


          currentStep =
            currentStep + 1;


          const progress =
            currentStep /
            totalSteps;


          const newLat =

            startLat +

            (
              targetLat -
              startLat
            ) *

            progress;


          const newLng =

            startLng +

            (
              targetLng -
              startLng
            ) *

            progress;


          setDronePosition({

            lat:
              newLat,

            lng:
              newLng,

          });


          if (
            currentStep >=
            totalSteps
          ) {


            clearInterval(
              returnTimer.current
            );


            returnTimer.current =
              null;


            setDronePosition(
              null
            );


            setSuppressionProgress(
              0
            );


            setDroneStatus(
              "STANDBY"
            );


            addEvent(
              "GREEN",
              "Drone returned safely to base. System ready for next mission."
            );

          }


        },
        100
      );

  }


  /* =======================================================
     STATUS MESSAGE
     ======================================================= */

  function getStatusMessage() {


    if (
      status ===
      "RED"
    ) {

      return (
        `${sensorCondition} sensor readings detected while wind is travelling toward ${site.name}.`
      );

    }


    if (
      status ===
      "YELLOW"
    ) {

      return (
        `${sensorCondition} sensor readings detected. Wind transport risk is ${windRisk.toLowerCase()}.`
      );

    }


    return (
      "Sensor readings are normal. No immediate response required."
    );

  }


  /* =======================================================
     BUTTON TEXT
     ======================================================= */

  function getDroneButtonText() {


    if (
      droneStatus ===
      "DEPLOYING"
    ) {

      return "Preparing Drone...";

    }


    if (
      droneStatus ===
      "TRAVELLING"
    ) {

      return "Drone En Route";

    }


    if (
      droneStatus ===
      "SUPPRESSING"
    ) {

      return "Dust Suppression Active";

    }


    if (
      droneStatus ===
      "RETURNING"
    ) {

      return "Drone Returning";

    }


    if (
      status ===
      "RED"
    ) {

      return "DANGER — Deploy Drone";

    }


    return "Standby — No Threat";

  }


  /* =======================================================
     HELP TEXT
     ======================================================= */

  function getDroneHelpText() {


    if (
      droneStatus ===
      "DEPLOYING"
    ) {

      return (
        "Preparing drone for deployment..."
      );

    }


    if (
      droneStatus ===
      "TRAVELLING"
    ) {

      return (
        "Mission active · Drone travelling to mine dump"
      );

    }


    if (
      droneStatus ===
      "SUPPRESSING"
    ) {

      return (
        "Drone on site · Dust suppression in progress"
      );

    }


    if (
      droneStatus ===
      "COMPLETE"
    ) {

      return (
        "Mission complete · Drone ready to return"
      );

    }


    if (
      droneStatus ===
      "RETURNING"
    ) {

      return (
        "Drone returning to staging location"
      );

    }


    if (
      status ===
      "RED"
    ) {

      return (
        "Sensor and wind conditions require operator response"
      );

    }


    if (
      status ===
      "YELLOW"
    ) {

      return (
        "Conditions require monitoring"
      );

    }


    return (
      "No deployment required"
    );

  }


  /* =======================================================
     SENSOR DISPLAY HELPERS
     ======================================================= */

  function getReadingClass(
    reading,
    warningValue
  ) {


    if (
      reading >=
      warningValue
    ) {

      return "reading-red";

    }


    return "reading-green";

  }


  function getBarClass(
    reading,
    warningValue
  ) {


    if (
      reading >=
      warningValue
    ) {

      return "reading-bar red-bar";

    }


    return "reading-bar green-bar";

  }


  /* =======================================================
     UI
     ======================================================= */

  return (

    <div className="drone-dashboard">


      {/* ================= HEADER ================= */}

      <div className="drone-header">


        <div>

          <h1>
            Drone Response
          </h1>

          <p className="drone-subtitle">
            Wind tracking · Dust suppression dispatch
          </p>

        </div>


        <div className="header-right">


          <div className="critical-badge">

            <span className="critical-dot"></span>

            {status === "RED"
              ? "1 CRITICAL"
              : "0 CRITICAL"}

          </div>


          <div className="last-updated">

            <span>
              Last updated
            </span>

            <strong>
              {lastUpdated}
            </strong>

          </div>


        </div>


      </div>


      {/* ================= STATUS ================= */}

      <div
        className={
          `status-banner status-${status.toLowerCase()}`
        }
      >


        <div className="status-left">


          <div className="status-heading">


            <span

              className="status-dot"

              style={{
                backgroundColor:
                  STATUS_COLORS[
                    status
                  ],
              }}

            ></span>


            <strong>

              {status}

              {status === "GREEN" &&
                " — All Clear"}

              {status === "YELLOW" &&
                " — Monitor"}

              {status === "RED" &&
                " — Danger"}

            </strong>


          </div>


          <div className="status-message">

            {getStatusMessage()}

          </div>


        </div>


        <div className="status-direction">

          {windLabel}

          {" · "}

          {windDirection}°

        </div>


      </div>


      {/* ================= SIMULATION ================= */}

      <div className="dashboard-card simulation-card">


        <div className="simulation-heading">


          <div>

            <h3>
              ENVIRONMENTAL SIMULATION
            </h3>

            <p>
              Simulated site sensor input for prototype demonstration
            </p>

          </div>


          <div className="simulation-indicator">

            DEMO MODE

          </div>


        </div>


        <div className="scenario-buttons">


          <button

            className={
              simulationScenario ===
              "NORMAL"

                ? "scenario-button scenario-normal active"

                : "scenario-button scenario-normal"
            }

            onClick={
              () =>
                changeScenario(
                  "NORMAL"
                )
            }

            disabled={
              droneStatus !==
              "STANDBY"
            }

          >

            Normal

          </button>


          <button

            className={
              simulationScenario ===
              "ELEVATED"

                ? "scenario-button scenario-elevated active"

                : "scenario-button scenario-elevated"
            }

            onClick={
              () =>
                changeScenario(
                  "ELEVATED"
                )
            }

            disabled={
              droneStatus !==
              "STANDBY"
            }

          >

            Elevated

          </button>


          <button

            className={
              simulationScenario ===
              "CRITICAL"

                ? "scenario-button scenario-critical active"

                : "scenario-button scenario-critical"
            }

            onClick={
              () =>
                changeScenario(
                  "CRITICAL"
                )
            }

            disabled={
              droneStatus !==
              "STANDBY"
            }

          >

            Critical

          </button>


        </div>


        <div className="simulation-summary">


          <span>

            PM10

            <strong>
              {sensorReadings.pm10}
            </strong>

          </span>


          <span>

            PM2.5

            <strong>
              {sensorReadings.pm25}
            </strong>

          </span>


          <span>

            Arsenic

            <strong>
              {sensorReadings.arsenic}
            </strong>

          </span>


          <span>

            Sensor State

            <strong>
              {sensorCondition}
            </strong>

          </span>


          <span>

            Wind Risk

            <strong>
              {windRisk}
            </strong>

          </span>


        </div>


      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="drone-main-grid">


        {/* ================= MAP ================= */}

        <div className="dashboard-card map-card">


          <div className="map-card-header">


            <div className="card-title">
              SITE MAP
            </div>


            <div className="map-legend">

              <span>
                <i className="legend-dot mine-dot"></i>
                Mine Dump
              </span>

              <span>
                <i className="legend-dot township-dot"></i>
                Township
              </span>

              <span>
                <i className="legend-dot sensor-dot"></i>
                Sensor
              </span>


              {dronePosition && (

                <span>

                  <i className="legend-dot drone-dot"></i>

                  Drone

                </span>

              )}


            </div>


          </div>


          <MapContainer

            center={[
              site.mineDump.lat,
              site.mineDump.lng,
            ]}

            zoom={13}

            className="map-container"

          >


            <TileLayer

              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

              attribution="&copy; OpenStreetMap contributors"

            />


            {/* MINE */}

            <CircleMarker

              center={[
                site.mineDump.lat,
                site.mineDump.lng,
              ]}

              radius={10}

              pathOptions={{
                color: "#f59e0b",
                fillColor: "#f59e0b",
                fillOpacity: 1,
              }}

            >

              <Popup>
                Mine Dump
              </Popup>

            </CircleMarker>


            {/* COMMUNITY */}

            <CircleMarker

              center={[
                site.township.lat,
                site.township.lng,
              ]}

              radius={9}

              pathOptions={{
                color: "#08978f",
                fillColor: "#08978f",
                fillOpacity: 1,
              }}

            >

              <Popup>
                {site.name}
              </Popup>

            </CircleMarker>


            {/* SENSORS */}

            {site.sensors.map(
              (sensor) => (

                <CircleMarker

                  key={
                    sensor.id
                  }

                  center={[
                    sensor.lat,
                    sensor.lng,
                  ]}

                  radius={
                    sensor.id ===
                    nearestSensor.id

                      ? 8

                      : 6
                  }

                  pathOptions={{
                    color: "#6366e8",
                    fillColor: "#6366e8",
                    fillOpacity: 1,
                  }}

                >

                  <Popup>

                    <strong>
                      {sensor.name}
                    </strong>

                    <br />

                    Distance to community:
                    {" "}

                    {getDistance(
                      site.township,
                      sensor
                    ).toFixed(2)}
                    {" "}
                    km

                  </Popup>

                </CircleMarker>

              )
            )}


            {/* FLIGHT PATH */}

            {dronePosition && (

              <Polyline

                positions={[

                  [
                    droneStartPosition.lat,
                    droneStartPosition.lng,
                  ],

                  [
                    site.mineDump.lat,
                    site.mineDump.lng,
                  ],

                ]}

                pathOptions={{
                  color: "#172338",
                  weight: 2,
                  dashArray: "6 8",
                  opacity: 0.6,
                }}

              />

            )}


            {/* SUPPRESSION */}

            {droneStatus ===
              "SUPPRESSING" && (

              <Circle

                center={[
                  site.mineDump.lat,
                  site.mineDump.lng,
                ]}

                radius={220}

                pathOptions={{
                  color: "#08978f",
                  fillColor: "#08978f",
                  fillOpacity: 0.15,
                  weight: 2,
                }}

              >

                <Popup>

                  <strong>
                    Dust Suppression Zone
                  </strong>

                  <br />

                  Progress:
                  {" "}

                  {suppressionProgress}%

                </Popup>

              </Circle>

            )}


            {/* DRONE */}

            {dronePosition && (

              <CircleMarker

                center={[
                  dronePosition.lat,
                  dronePosition.lng,
                ]}

                radius={9}

                pathOptions={{
                  color: "#172338",
                  fillColor: "#ffffff",
                  fillOpacity: 1,
                  weight: 4,
                }}

              >

                <Popup>

                  <strong>
                    Dust Suppression Drone
                  </strong>

                  <br />

                  Status:
                  {" "}

                  {droneStatus}

                </Popup>

              </CircleMarker>

            )}


          </MapContainer>


        </div>


        {/* ================= RIGHT COLUMN ================= */}

        <div className="drone-right-column">


          {/* WIND */}

          <div className="dashboard-card control-card">


            <h3>
              WIND DIRECTION
            </h3>


            <div className="compass">

              <span className="compass-n">N</span>
              <span className="compass-ne">NE</span>
              <span className="compass-e">E</span>
              <span className="compass-se">SE</span>
              <span className="compass-s">S</span>
              <span className="compass-sw">SW</span>
              <span className="compass-w">W</span>
              <span className="compass-nw">NW</span>


              <div

                className="wind-arrow"

                style={{
                  transform:
                    `rotate(${windDirection + 180}deg)`,
                }}

              >

                <div className="wind-arrow-line"></div>

                <div className="wind-arrow-head"></div>

              </div>


              <div className="compass-center-dot"></div>


            </div>


            <input

              className="wind-slider"

              type="range"

              min="0"

              max="359"

              value={
                windDirection
              }

              onChange={
                handleWindChange
              }

              disabled={
                droneStatus !==
                "STANDBY"
              }

            />


            <div className="slider-directions">

              <span>N</span>
              <span>E</span>
              <span>S</span>
              <span>W</span>
              <span>N</span>

            </div>


            <div className="wind-value">

              <strong>
                {windLabel}
              </strong>

              <span>
                {windDirection}°
              </span>

            </div>


            <div className="wind-help">

              Wind transport:
              {" "}

              <strong>
                {windRisk}
              </strong>

            </div>


          </div>


          {/* NEAREST SENSOR */}

          <div className="dashboard-card sensor-card">


            <h3>
              NEAREST SENSOR
            </h3>


            <div className="sensor-source">

              {activeSensor.name}

              {" · "}

              {nearestSensorDistance.toFixed(
                2
              )}
              {" km · "}

              {sensorCondition}

            </div>


            <div className="sensor-reading">


              <div className="sensor-reading-header">

                <span>
                  PM10
                </span>


                <strong

                  className={
                    getReadingClass(
                      sensorReadings.pm10,
                      50
                    )
                  }

                >

                  {sensorReadings.pm10}
                  {" "}
                  µg/m³

                </strong>

              </div>


              <div className="reading-track">

                <div

                  className={
                    getBarClass(
                      sensorReadings.pm10,
                      50
                    )
                  }

                  style={{
                    width:
                      `${Math.min(
                        sensorReadings.pm10,
                        100
                      )}%`,
                  }}

                ></div>

              </div>


            </div>


            <div className="sensor-reading">


              <div className="sensor-reading-header">

                <span>
                  PM2.5
                </span>


                <strong

                  className={
                    getReadingClass(
                      sensorReadings.pm25,
                      15
                    )
                  }

                >

                  {sensorReadings.pm25}
                  {" "}
                  µg/m³

                </strong>

              </div>


              <div className="reading-track">

                <div

                  className={
                    getBarClass(
                      sensorReadings.pm25,
                      15
                    )
                  }

                  style={{
                    width:
                      `${Math.min(
                        sensorReadings.pm25 * 2,
                        100
                      )}%`,
                  }}

                ></div>

              </div>


            </div>


            <div className="sensor-reading">


              <div className="sensor-reading-header">

                <span>
                  Arsenic
                </span>


                <strong

                  className={
                    getReadingClass(
                      sensorReadings.arsenic,
                      0.02
                    )
                  }

                >

                  {sensorReadings.arsenic}
                  {" "}
                  µg/m³

                </strong>

              </div>


              <div className="reading-track">

                <div

                  className={
                    getBarClass(
                      sensorReadings.arsenic,
                      0.02
                    )
                  }

                  style={{
                    width:
                      `${Math.min(
                        sensorReadings.arsenic * 2000,
                        100
                      )}%`,
                  }}

                ></div>

              </div>


            </div>


          </div>


          {/* DRONE CONTROL */}

          <div className="dashboard-card drone-control-card">


            <h3>
              DRONE CONTROL
            </h3>


            <div className="mission-status">

              <span>
                MISSION STATUS
              </span>

              <strong
                className={
                  `mission-status-${droneStatus.toLowerCase()}`
                }
              >
                {droneStatus}
              </strong>

            </div>


            {droneStatus ===
              "SUPPRESSING" && (

              <div className="suppression-progress">


                <div className="suppression-progress-header">

                  <span>
                    Dust Suppression
                  </span>

                  <strong>
                    {suppressionProgress}%
                  </strong>

                </div>


                <div className="suppression-progress-track">

                  <div

                    className="suppression-progress-bar"

                    style={{
                      width:
                        `${suppressionProgress}%`,
                    }}

                  ></div>

                </div>


              </div>

            )}


            {droneStatus ===
              "COMPLETE" && (

              <div className="mission-complete-message">

                ✓ Dust suppression complete

              </div>

            )}


            {droneStatus !==
              "COMPLETE" && (

              <button

                className={

                  status ===
                    "RED" &&

                  droneStatus ===
                    "STANDBY"

                    ? "launch-button launch-button-danger"

                    : "launch-button"

                }

                onClick={
                  handleLaunch
                }

                disabled={

                  status !==
                    "RED" ||

                  droneStatus !==
                    "STANDBY"

                }

              >

                {getDroneButtonText()}

              </button>

            )}


            {droneStatus ===
              "COMPLETE" && (

              <button

                className="return-button"

                onClick={
                  returnDroneToBase
                }

              >

                Return Drone to Base

              </button>

            )}


            <p className="control-help">

              {getDroneHelpText()}

            </p>


          </div>


        </div>


      </div>


      {/* ================= EVENT LOG ================= */}

      <div className="dashboard-card event-log">


        <div className="event-log-header">

          <h3>
            EVENT LOG
          </h3>

          <span>
            {log.length} entries
          </span>

        </div>


        {log.map(
          (entry, index) => (

            <div
              className="event-row"
              key={
                index
              }
            >

              <span
                className={
                  `event-dot event-${entry.type.toLowerCase()}`
                }
              ></span>

              <span className="event-time">
                {entry.time}
              </span>

              <span className="event-message">
                {entry.message}
              </span>

            </div>

          )
        )}


      </div>


    </div>

  );

}