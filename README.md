# Sentinel — Environmental Guard

Sentinel is an environmental monitoring and response platform designed to support communities and organisations managing environmental risks associated with mining waste.

The platform brings together environmental monitoring, risk assessment, drone-response simulation, waste reprocessing analysis, and community-facing environmental information in one system.

## The Problem

Mining waste sites located near communities can create ongoing environmental-management challenges.

These challenges include:

- Monitoring airborne pollutants and other environmental indicators.
- Identifying when environmental conditions may pose a risk to nearby communities.
- Responding quickly when dangerous conditions develop.
- Understanding whether mining waste has potential economic value through reprocessing.
- Providing communities with accessible information about environmental conditions around them.

These activities are often treated separately.

Sentinel explores how they could be connected through a single digital platform.

## Our Solution

Sentinel approaches the problem through three modules:

###  PROTECT — Drone Response

An operational dashboard that combines environmental sensor readings with wind direction to assess potential risk to nearby communities.

The prototype monitors:

- PM10
- PM2.5
- Arsenic
- Wind direction

The system classifies conditions as:

- **GREEN** — Normal conditions
- **YELLOW** — Elevated conditions requiring monitoring
- **RED** — Conditions requiring operator attention and possible intervention

When a RED condition occurs, an operator can deploy a simulated environmental-response drone.

The simulated mission follows:

`STANDBY → DEPLOYING → TRAVELLING → SUPPRESSING → COMPLETE → RETURNING → STANDBY`

The drone-response workflow demonstrates how a future physical drone could be integrated into the platform for environmental-response operations such as dust suppression.

###  REPROCESS — Recycling Value

A dashboard exploring the potential value of reprocessing mining waste.

It provides estimates relating to:

- Waste available for processing
- Potential gold recovery value
- Brick production
- Employment opportunities
- Waste-processing trends

The purpose is to demonstrate that mining waste can be considered not only as an environmental liability, but also as a potential source of recoverable material and economic activity.

###  PREVENT — Community Monitor

A community-facing environmental monitoring view.

The goal is to make relevant environmental information easier for surrounding communities to understand and access.

The module is designed around information such as:

- Air-quality conditions
- Water-quality conditions
- Environmental alerts
- Monitoring locations
- Incident information


## Current Prototype

The current demonstration uses Snake Park, Soweto, Gauteng as the prototype site.

The application currently includes:

- Interactive OpenStreetMap
- Simulated environmental sensors
- Dynamic nearest-sensor calculation
- Wind-direction simulation
- Environmental risk classification
- Drone deployment simulation
- Drone flight animation
- Dust-suppression simulation
- Return-to-base workflow
- Environmental event logging
- Recycling-value calculations
- Community monitoring interface

## Technology Stack

### Frontend
- React
- JavaScript
- CSS

### Mapping
- Leaflet
- React Leaflet
- OpenStreetMap

### Data Visualisation
- Chart.js
- React Chart.js 2

### Prototype Data
- JSON
- Simulated environmental sensor readings

### Version Control
- Git
- GitHub

## Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/buhleza/yellow-mountain-guard.git
```

### 2. Enter the project directory

```bash
cd yellow-mountain-guard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npm start
```

The application will run locally in your browser.

## Demo — Drone Response

To demonstrate the Drone Response workflow:

1. Open the **Drone Response** dashboard.
2. Start with the **Normal** environmental scenario.
3. Select **Critical** to simulate high environmental readings.
4. Adjust the wind direction until the system identifies transport toward the community.
5. Observe the danger level change to **RED**.
6. Deploy the drone.
7. Observe the drone travel to the mining waste site.
8. Watch the simulated dust-suppression operation.
9. Complete the mission and return the drone to base.
10. Review the event log.

## Prototype Limitations

Sentinel is currently a hackathon prototype.

The following components are simulated and should not be interpreted as production environmental or safety systems:

- Environmental sensor readings
- Drone deployment and flight
- Dust-suppression operation
- Environmental risk thresholds
- Wind conditions

The environmental thresholds used by the prototype are demonstration values and are not presented as official regulatory or medical limits.

The prototype also does not currently implement a validated atmospheric dispersion model.

## Future Development

Future versions of Sentinel could include:

- Integration with physical IoT environmental sensors
- Real-time weather-station or weather API data
- Real drone telemetry and approved drone-control integration
- Validated environmental and atmospheric dispersion models
- Predictive environmental-risk analytics
- Historical environmental data
- Multi-site monitoring
- Authentication and role-based access
- Cloud backend and database infrastructure
- SMS or mobile environmental alerts
- Multilingual and accessible community interfaces
- Community incident reporting
- Integration of laboratory and assay data into reprocessing calculations
- More advanced waste-reprocessing feasibility analysis

## Vision

Sentinel aims to connect three important questions:

**How do we detect environmental risk?**

**How do we respond when risk develops?**

**How do we create value and transparency while protecting surrounding communities?**

The long-term vision is a platform where environmental monitoring does not end with collecting data — it leads to informed decisions, coordinated responses, and accessible information.

## Team

Built by team (CipherGuard) project for a hackathon.

### Project Areas

- **Drone Response / PROTECT**
- **Recycling Value / REPROCESS**
- **Community Monitor / PREVENT**

## Disclaimer

Sentinel is a prototype created for demonstration purposes. Environmental readings, thresholds, drone operations, suppression behaviour, and economic calculations shown in the prototype should not be interpreted as validated real-world environmental, engineering, medical, regulatory, or financial assessments.
