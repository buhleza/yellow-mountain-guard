/* =========================================================
   PROTOTYPE SENSOR THRESHOLDS

   These thresholds are used only for the hackathon
   simulation.

   They are not presented as regulatory, medical,
   or scientifically validated exposure limits.
   ========================================================= */

const SENSOR_THRESHOLDS = {

  pm10: {
    warning: 50,
    high: 100,
  },

  pm25: {
    warning: 15,
    high: 35,
  },

  arsenic: {
    warning: 0.02,
    high: 0.05,
  },

};


/* =========================================================
   CONVERT DEGREES TO RADIANS
   ========================================================= */

function toRad(degrees) {

  return (
    degrees *
    Math.PI /
    180
  );

}


/* =========================================================
   BEARING BETWEEN TWO LOCATIONS
   ========================================================= */

function bearingTo(a, b) {

  const dLng =
    toRad(
      b.lng -
      a.lng
    );


  const lat1 =
    toRad(
      a.lat
    );


  const lat2 =
    toRad(
      b.lat
    );


  const y =
    Math.sin(dLng) *
    Math.cos(lat2);


  const x =

    Math.cos(lat1) *
    Math.sin(lat2)

    -

    Math.sin(lat1) *
    Math.cos(lat2) *
    Math.cos(dLng);


  const bearingRadians =
    Math.atan2(
      y,
      x
    );


  const bearingDegrees =
    bearingRadians *
    180 /
    Math.PI;


  return (
    bearingDegrees +
    360
  ) % 360;

}


/* =========================================================
   DISTANCE BETWEEN TWO COORDINATES

   Uses the Haversine formula.

   Result is returned in kilometres.
   ========================================================= */

export function getDistance(
  pointA,
  pointB
) {

  const earthRadius =
    6371;


  const lat1 =
    toRad(
      pointA.lat
    );


  const lat2 =
    toRad(
      pointB.lat
    );


  const differenceLat =
    toRad(
      pointB.lat -
      pointA.lat
    );


  const differenceLng =
    toRad(
      pointB.lng -
      pointA.lng
    );


  const a =

    Math.sin(
      differenceLat / 2
    ) ** 2

    +

    Math.cos(lat1) *
    Math.cos(lat2) *

    Math.sin(
      differenceLng / 2
    ) ** 2;


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );


  return (
    earthRadius *
    c
  );

}


/* =========================================================
   FIND NEAREST SENSOR

   For this prototype we define "nearest" as the sensor
   geographically closest to the community/township point.
   ========================================================= */

export function getNearestSensor(
  site
) {

  let nearestSensor =
    site.sensors[0];


  let nearestDistance =
    getDistance(
      site.township,
      nearestSensor
    );


  for (
    let i = 1;
    i < site.sensors.length;
    i++
  ) {

    const currentSensor =
      site.sensors[i];


    const currentDistance =
      getDistance(
        site.township,
        currentSensor
      );


    if (
      currentDistance <
      nearestDistance
    ) {

      nearestSensor =
        currentSensor;


      nearestDistance =
        currentDistance;

    }

  }


  return nearestSensor;

}


/* =========================================================
   SENSOR CONDITION

   NORMAL
   ELEVATED
   HIGH
   ========================================================= */

export function getSensorCondition(
  sensor
) {

  const readings =
    sensor.readings;


  if (
    readings.pm10 >=
      SENSOR_THRESHOLDS.pm10.high ||

    readings.pm25 >=
      SENSOR_THRESHOLDS.pm25.high ||

    readings.arsenic >=
      SENSOR_THRESHOLDS.arsenic.high
  ) {

    return "HIGH";

  }


  if (
    readings.pm10 >=
      SENSOR_THRESHOLDS.pm10.warning ||

    readings.pm25 >=
      SENSOR_THRESHOLDS.pm25.warning ||

    readings.arsenic >=
      SENSOR_THRESHOLDS.arsenic.warning
  ) {

    return "ELEVATED";

  }


  return "NORMAL";

}


/* =========================================================
   WIND TRANSPORT RISK
   ========================================================= */

export function getWindRisk(
  site,
  windDirection
) {

  const dangerBearing =
    bearingTo(
      site.mineDump,
      site.township
    );


  /*
     Weather convention:

     Wind direction tells us where the wind
     COMES FROM.

     Add 180 degrees to determine where the
     wind travels toward.
  */

  const windTravelDirection =
    (
      windDirection +
      180
    ) % 360;


  const difference =
    Math.abs(

      (
        (
          windTravelDirection -
          dangerBearing +
          180
        ) %
        360
      )

      -

      180

    );


  if (
    difference <= 30
  ) {

    return "TOWARD";

  }


  if (
    difference <= 60
  ) {

    return "NEAR";

  }


  return "AWAY";

}


/* =========================================================
   FINAL PROTOTYPE RISK DECISION
   ========================================================= */

export function getDangerLevel(
  site,
  windDirection,
  sensor
) {

  const sensorCondition =
    getSensorCondition(
      sensor
    );


  const windRisk =
    getWindRisk(
      site,
      windDirection
    );


  /*
     RED

     Elevated/high readings combined with wind
     travelling toward the community.
  */

  if (
    sensorCondition === "HIGH" &&
    windRisk === "TOWARD"
  ) {

    return "RED";

  }


  if (
    sensorCondition === "ELEVATED" &&
    windRisk === "TOWARD"
  ) {

    return "RED";

  }


  /*
     YELLOW

     Readings require attention but the wind is
     not currently directly transporting material
     toward the community.
  */

  if (
    sensorCondition === "HIGH"
  ) {

    return "YELLOW";

  }


  if (
    sensorCondition === "ELEVATED"
  ) {

    return "YELLOW";

  }


  return "GREEN";

}